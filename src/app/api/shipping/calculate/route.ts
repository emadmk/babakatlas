import { NextRequest, NextResponse } from 'next/server';
import {
  calculateShipping,
  calculateInstallation,
} from '@/lib/pricingServer';
import { formatCurrency } from '@/lib/pricing';
import { getShippingRates } from '@/lib/adminData';

interface ShippingRequest {
  country: string;
  sqft: number;
  subtotal: number;
  serviceType: 'shipping' | 'installation';
  carType?: string;
  windowCount?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: ShippingRequest = await request.json();
    const { country, sqft, subtotal, serviceType, carType, windowCount } = body;

    // ── Validate ────────────────────────────────────────────────────
    if (!country || !['PH', 'AU'].includes(country)) {
      return NextResponse.json(
        { success: false, error: 'Invalid country. Supported: PH, AU' },
        { status: 400 },
      );
    }

    if (typeof sqft !== 'number' || sqft <= 0) {
      return NextResponse.json(
        { success: false, error: 'sqft must be a positive number' },
        { status: 400 },
      );
    }

    if (typeof subtotal !== 'number' || subtotal < 0) {
      return NextResponse.json(
        { success: false, error: 'subtotal must be a non-negative number' },
        { status: 400 },
      );
    }

    // ── Get shipping info from admin config ─────────────────────────
    const shippingRates = getShippingRates();
    const rateData = shippingRates.find((r) => r.country === country && r.active);

    const countryName = rateData?.countryName?.en ?? country;
    const deliveryTime = rateData
      ? `${rateData.deliveryDays.min}-${rateData.deliveryDays.max} business days`
      : '';
    const freeShippingThreshold = rateData?.freeAbove ?? 200;

    // ── Calculate ───────────────────────────────────────────────────
    const shippingCost = calculateShipping(country, sqft, subtotal);

    let installationCost = 0;
    if (serviceType === 'installation') {
      if (!carType) {
        return NextResponse.json(
          { success: false, error: 'carType is required for installation service' },
          { status: 400 },
        );
      }
      installationCost = calculateInstallation(country, carType, windowCount ?? 0);
    }

    const freeShipping = shippingCost === 0 && serviceType === 'shipping';

    return NextResponse.json({
      success: true,
      data: {
        country,
        countryName,
        deliveryTime,
        shippingCost,
        shippingFormatted: formatCurrency(shippingCost, country),
        installationCost,
        installationFormatted: formatCurrency(installationCost, country),
        freeShipping,
        freeShippingThreshold,
        freeShippingThresholdFormatted: formatCurrency(freeShippingThreshold, country),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 },
    );
  }
}
