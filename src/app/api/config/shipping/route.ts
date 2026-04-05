export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getShippingRates } from "@/lib/adminData";

export async function GET() {
  const rates = getShippingRates().filter((r) => r.active);

  return NextResponse.json({
    success: true,
    data: rates,
    count: rates.length,
  });
}
