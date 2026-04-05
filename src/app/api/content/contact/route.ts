import { NextResponse } from "next/server";
import { getContactInfo } from "@/lib/adminData";

export async function GET() {
  const info = getContactInfo();
  return NextResponse.json({ success: true, data: info });
}
