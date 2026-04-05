export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getShippingRates, updateShippingRate } from "@/lib/adminData";

export async function GET() {
  const data = getShippingRates();
  return NextResponse.json({ success: true, data, count: data.length });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updates = body.data || body;

    if (Array.isArray(updates)) {
      for (const rate of updates) {
        if (rate.id) {
          updateShippingRate(rate.id, rate);
        }
      }
      return NextResponse.json({ success: true, data: getShippingRates() });
    }

    if (updates.id) {
      const updated = updateShippingRate(updates.id, updates);
      if (!updated) {
        return NextResponse.json({ success: false, error: "Shipping rate not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
