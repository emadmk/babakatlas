import { NextRequest, NextResponse } from 'next/server';
import {
  calculateShipping,
  calculateInstallation,
  formatCurrency,
} from '@/lib/pricing';
import { SHIPPING_INFO } from '@/store/configuratorStore';

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

    // ── Calculate ───────────────────────────────────────────────────
    const shippingInfo = SHIPPING_INFO[country];
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
    const freeShippingThreshold = country === 'PH' ? 200 : 300;

    return NextResponse.json({
      success: true,
      data: {
        country,
        countryName: shippingInfo.name,
        deliveryTime: shippingInfo.deliveryTime,
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
