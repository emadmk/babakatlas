export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServiceConfigs } from "@/lib/adminData";

export async function GET() {
  const services = getServiceConfigs().filter((s) => s.active);

  return NextResponse.json({
    success: true,
    data: services,
    count: services.length,
  });
}
