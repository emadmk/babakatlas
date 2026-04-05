export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServiceConfigs, updateServiceConfig } from "@/lib/adminData";

export async function GET() {
  const data = getServiceConfigs();
  return NextResponse.json({ success: true, data, count: data.length });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (Array.isArray(body)) {
      const results = body.map((item: { id: string; [key: string]: unknown }) =>
        updateServiceConfig(item.id, item)
      );
      return NextResponse.json({ success: true, data: results.filter(Boolean) });
    }

    if (body.id) {
      const updated = updateServiceConfig(body.id, body);
      if (!updated) {
        return NextResponse.json({ success: false, error: "Service config not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
