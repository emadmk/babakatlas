import { NextRequest, NextResponse } from "next/server";
import { getWindowConfigs } from "@/lib/adminData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const carType = searchParams.get("carType") || undefined;

  const configs = getWindowConfigs(carType).filter((w) => w.active);

  return NextResponse.json({
    success: true,
    data: configs,
    count: configs.length,
  });
}
