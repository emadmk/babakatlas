export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAboutContent, updateAboutContent } from "@/lib/adminData";

export async function GET() {
  const content = getAboutContent();
  return NextResponse.json({ success: true, data: content });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = updateAboutContent(body);
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
