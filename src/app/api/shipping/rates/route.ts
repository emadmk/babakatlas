import { NextRequest, NextResponse } from 'next/server';
import { getShippingRates } from '@/lib/shippo';
import { getSiteSettings } from '@/lib/adminData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { toAddress, parcel } = body;

    if (!toAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing destination address' },
        { status: 400 }
      );
    }

    const settings = getSiteSettings();

    // Use from address from settings or fallback
    const fromAddress = settings.shippoFromAddress || {
      name: 'AtlasAdaptive',
      street1: '123 Main Street',
      city: 'Manila',
      state: 'Metro Manila',
      zip: '1000',
      country: 'PH',
    };

    // Default parcel dimensions if not provided
    const parcelData = parcel || {
      length: '12',
      width: '12',
      height: '4',
      weight: '2',
      mass_unit: 'lb',
      distance_unit: 'in',
    };

    const rates = await getShippingRates({
      fromAddress,
      toAddress,
      parcel: parcelData,
    });

    if (rates === null) {
      return NextResponse.json(
        { success: false, error: 'Shippo not configured. Set SHIPPO_API_KEY in your .env file.' },
        { status: 503 }
      );
    }

    // Apply admin markup to rates (hidden from customer)
    const markup = settings.shippingMarkup || 0;
    const markupType = settings.shippingMarkupType || 'flat';

    const ratesWithMarkup = rates.map((rate: { amount: string; currency: string; provider: string; servicelevel: { name: string }; estimated_days: number; object_id: string }) => {
      const originalAmount = parseFloat(rate.amount);
      let finalAmount: number;

      if (markupType === 'percentage') {
        finalAmount = originalAmount * (1 + markup / 100);
      } else {
        finalAmount = originalAmount + markup;
      }

      return {
        id: rate.object_id,
        provider: rate.provider,
        service: rate.servicelevel?.name || 'Standard',
        amount: Math.round(finalAmount * 100) / 100,
        currency: rate.currency,
        estimatedDays: rate.estimated_days,
      };
    });

    return NextResponse.json({
      success: true,
      data: ratesWithMarkup,
    });
  } catch (error) {
    console.error('Shipping rates error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch shipping rates' },
      { status: 500 }
    );
  }
}
