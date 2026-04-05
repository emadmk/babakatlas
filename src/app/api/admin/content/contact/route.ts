export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getContactInfo, updateContactInfo } from "@/lib/adminData";

export async function GET() {
  const info = getContactInfo();
  return NextResponse.json({ success: true, data: info });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = updateContactInfo(body);
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
