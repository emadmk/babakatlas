export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getCarTypes, createCarType } from "@/lib/adminData";

export async function GET() {
  const data = getCarTypes();
  return NextResponse.json({ success: true, data, count: data.length });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const carType = createCarType({
      slug: body.slug || "",
      name: body.name || { en: "", tl: "" },
      type: body.type || "",
      windowCount: body.windowCount || 0,
      imageUrl: body.imageUrl || "",
      active: body.active !== false,
    });
    return NextResponse.json({ success: true, data: carType }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
