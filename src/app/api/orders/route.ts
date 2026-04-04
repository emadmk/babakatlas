import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { buildPricingQuote, formatCurrency } from '@/lib/pricing';
import { TINT_TYPES, WINDOW_SQFT } from '@/store/configuratorStore';

// ── In-memory store (replace with DB later) ───────────────────────────
export interface Order {
  id: string;
  orderNumber: string;
  userId: string | null;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: {
    carType: string;
    carModel: string | null;
    tintType: string;
    tintName: string;
    selectedWindows: string[];
    totalSqft: number;
    unitPrice: number;
    subtotal: number;
  };
  serviceType: 'shipping' | 'installation';
  pricing: {
    subtotal: number;
    shipping: number;
    installation: number;
    taxLabel: string;
    tax: number;
    total: number;
  };
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  stripeSessionId: string | null;
  createdAt: string;
  updatedAt: string;
}

// In-memory orders (will be replaced with DB)
const orders: Map<string, Order> = new Map();

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

    if (!carType || !WINDOW_SQFT[carType]) {
      return NextResponse.json(
        { success: false, error: 'Invalid car type' },
        { status: 400 },
      );
    }

    if (!tintType || !TINT_TYPES[tintType]) {
      return NextResponse.json(
        { success: false, error: 'Invalid tint type' },
        { status: 400 },
      );
    }

    if (!Array.isArray(selectedWindows) || selectedWindows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one window must be selected' },
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
    const quote = buildPricingQuote({
      carType,
      selectedWindows,
      tintType,
      serviceType,
      country,
    });

    // ── Get authenticated user (optional) ─────────────────────────
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

    // ── Build order ───────────────────────────────────────────────
    const orderNumber = generateOrderNumber();
    const orderId = crypto.randomUUID();
    const now = new Date().toISOString();

    const tint = TINT_TYPES[tintType];

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
        tintType,
        tintName: tint.name,
        selectedWindows,
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

// Export orders map for the [id] route
export { orders };
