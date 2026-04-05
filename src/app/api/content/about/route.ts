import { NextResponse } from "next/server";
import { getAboutContent } from "@/lib/adminData";

export async function GET() {
  const content = getAboutContent();
  return NextResponse.json({ success: true, data: content });
}
