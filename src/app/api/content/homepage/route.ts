import { NextResponse } from "next/server";
import { getHomepageContent } from "@/lib/adminData";

export async function GET() {
  const content = getHomepageContent();
  return NextResponse.json({ success: true, data: content });
}
