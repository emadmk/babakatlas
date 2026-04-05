import { NextRequest, NextResponse } from "next/server";
import { getHomepageContent, updateHomepageContent } from "@/lib/adminData";

export async function GET() {
  const content = getHomepageContent();
  return NextResponse.json({ success: true, data: content });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = updateHomepageContent(body);
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
