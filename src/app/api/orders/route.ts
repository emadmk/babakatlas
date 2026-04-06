export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { buildPricingQuote } from '@/lib/pricingServer';
import { formatCurrency } from '@/lib/pricing';
// Legacy imports kept for buildPricingQuote fallback path
import { createAdminOrder, createAppointment } from '@/lib/adminData';

import { orders, type Order } from '@/lib/ordersStore';

// ── Generate order number ─────────────────────────────────────────────
function generateOrderNumber(): string {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TG-${datePart}-${randomPart}`;
}

// ── POST: Create new order ────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      contact,
      shippingAddress,
      carType,
      carModel,
      tintType,
      selectedProduct,
      selectedPackage,
      comboProduct,
      selectedWindows,
      serviceType,
    } = body;

    // ── Validate required fields ──────────────────────────────────
    if (!contact?.name || !contact?.email || !contact?.phone) {
      return NextResponse.json(
        { success: false, error: 'Contact info (name, email, phone) is required' },
        { status: 400 },
      );
    }

    if (
      !shippingAddress?.address ||
      !shippingAddress?.city ||
      !shippingAddress?.postalCode ||
      !shippingAddress?.country
    ) {
      return NextResponse.json(
        { success: false, error: 'Complete shipping address is required' },
        { status: 400 },
      );
    }

    if (!carType) {
      return NextResponse.json(
        { success: false, error: 'Car type is required' },
        { status: 400 },
      );
    }

    if (!serviceType || !['shipping', 'installation'].includes(serviceType)) {
      return NextResponse.json(
        { success: false, error: 'Service type must be "shipping" or "installation"' },
        { status: 400 },
      );
    }

    // ── Calculate pricing server-side ─────────────────────────────
    const country = shippingAddress.country;

    // Try package-based pricing first, fall back to legacy
    let quote;
    if (selectedProduct && selectedPackage) {
      // New package-based: use client-computed values with server validation
      const { getProducts, getTintPackages, getCarTypes, getShippingRates, getInstallationRates, getSiteSettings } = await import('@/lib/adminData');
      const products = getProducts();
      const packages = getTintPackages();
      const carTypes = getCarTypes();
      const settings = getSiteSettings();

      const product = products.find((p) => p.slug === selectedProduct);
      const pkg = packages.find((p) => p.id === selectedPackage);
      const car = carTypes.find((c) => c.slug === carType);

      if (!product || !pkg || !car) {
        return NextResponse.json(
          { success: false, error: 'Invalid product, package, or car type' },
          { status: 400 },
        );
      }

      const sizeGroup = car.sizeGroup || 'small';
      const metersUsed = pkg.metersUsed[sizeGroup] || 0;
      let subtotal = metersUsed * product.pricePerMeter;

      // Handle combo pricing
      if (pkg.coverage === 'combo' && comboProduct) {
        const ceramicProduct = products.find((p) => p.slug === comboProduct);
        if (ceramicProduct) {
          const windshieldPkg = packages.find((p) => p.coverage === 'windshield');
          const wMeters = windshieldPkg ? (windshieldPkg.metersUsed[sizeGroup] || 1) : 1;
          const rMeters = metersUsed - wMeters;
          subtotal = (wMeters * product.pricePerMeter) + (rMeters * ceramicProduct.pricePerMeter);
        }
      }

      const taxRate = (settings.taxRates as Record<string, number>)[country] ?? 0.12;
      const taxLabel = country === 'PH' ? `VAT ${taxRate * 100}%` : `GST ${taxRate * 100}%`;

      // Shipping
      let shipping = 0;
      const shippingRates = getShippingRates();
      const shippingRate = shippingRates.find((r) => r.country === country && r.active);
      if (shippingRate && subtotal < shippingRate.freeAbove) {
        shipping = shippingRate.baseRate;
      }

      // Installation
      let installation = 0;
      if (serviceType === 'installation') {
        const installRates = getInstallationRates(country, car.type);
        if (installRates.length > 0) {
          installation = installRates[0].baseRate + (car.windowCount || 0) * installRates[0].perWindowRate;
        }
      }

      const tax = Math.round((subtotal + installation) * taxRate * 100) / 100;
      const total = Math.round((subtotal + shipping + installation + tax) * 100) / 100;

      quote = { totalSqft: 0, unitPrice: product.pricePerMeter, subtotal, shipping, installation, taxLabel, tax, total };
    } else {
      quote = buildPricingQuote({
        carType,
        selectedWindows: Array.isArray(selectedWindows) ? selectedWindows : [],
        tintType: tintType || 'nano-ceramic-35',
        serviceType,
        country,
      });
    }

    // ── Get authenticated user (optional) ─────────────────────────
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

    // ── Build order ───────────────────────────────────────────────
    const orderNumber = generateOrderNumber();
    const orderId = crypto.randomUUID();
    const now = new Date().toISOString();

    const tintName = selectedProduct || tintType || 'Custom';

    const order: Order = {
      id: orderId,
      orderNumber,
      userId,
      status: 'pending',
      contact,
      shippingAddress,
      items: {
        carType,
        carModel: carModel ?? null,
        tintType: tintType || selectedProduct || 'mixed',
        tintName,
        selectedWindows: Array.isArray(selectedWindows) ? selectedWindows : [],
        totalSqft: quote.totalSqft,
        unitPrice: quote.unitPrice,
        subtotal: quote.subtotal,
      },
      serviceType,
      pricing: {
        subtotal: quote.subtotal,
        shipping: quote.shipping,
        installation: quote.installation,
        taxLabel: quote.taxLabel,
        tax: quote.tax,
        total: quote.total,
      },
      paymentStatus: 'unpaid',
      stripeSessionId: null,
      createdAt: now,
      updatedAt: now,
    };

    orders.set(orderId, order);

    // Also save to persistent admin data store
    createAdminOrder({
      id: orderId,
      orderNumber,
      userId,
      status: 'pending',
      contact,
      shippingAddress,
      items: order.items,
      serviceType,
      pricing: order.pricing,
      paymentStatus: 'unpaid',
      notes: [],
      createdAt: now,
      updatedAt: now,
    });

    // If installation service, create appointment from body.appointment
    if (serviceType === 'installation' && body.appointment) {
      const appt = body.appointment;
      createAppointment({
        orderId,
        userId,
        customerName: contact.name,
        customerEmail: contact.email,
        customerPhone: contact.phone || '',
        country: shippingAddress?.country || country || 'PH',
        address: appt.address || shippingAddress?.address || '',
        city: appt.city || shippingAddress?.city || '',
        vehicleType: carType || '',
        date: appt.date || '',
        slot: appt.slot || 'morning',
        status: 'pending',
        notes: appt.notes || '',
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          ...order,
          pricing: {
            ...order.pricing,
            totalFormatted: formatCurrency(order.pricing.total, country),
          },
        },
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 },
    );
  }
}

// ── GET: List user orders ─────────────────────────────────────────────
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const user = session?.user as { id?: string } | undefined;
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
    }

    const userId = user.id;
    const userOrders = Array.from(orders.values())
      .filter((o) => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      data: userOrders,
      count: userOrders.length,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// Re-export for backward compat
export type { Order };
