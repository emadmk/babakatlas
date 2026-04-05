import { NextRequest, NextResponse } from "next/server";
import { getInstallationRates, updateInstallationRate } from "@/lib/adminData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country") || undefined;
  const carType = searchParams.get("carType") || undefined;
  const data = getInstallationRates(country, carType);
  return NextResponse.json({ success: true, data, count: data.length });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const items = body.data || body;

    if (Array.isArray(items)) {
      const results = items.map((item: { id: string; [key: string]: unknown }) =>
        updateInstallationRate(item.id, item)
      );
      return NextResponse.json({ success: true, data: results.filter(Boolean) });
    }

    if (items.id) {
      const updated = updateInstallationRate(items.id, items);
      if (!updated) {
        return NextResponse.json({ success: false, error: "Installation rate not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
