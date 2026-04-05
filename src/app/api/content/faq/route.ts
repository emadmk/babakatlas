export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getFaqItems } from "@/lib/adminData";

export async function GET() {
  const items = getFaqItems().filter((item) => item.active);
  return NextResponse.json({ success: true, data: items });
}
