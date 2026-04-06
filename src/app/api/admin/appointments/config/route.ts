export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAppointmentConfigs, getAppointmentConfig, updateAppointmentConfig } from "@/lib/adminData";

export async function GET() {
  try {
    const configs = getAppointmentConfigs();
    return NextResponse.json({ success: true, data: configs });
  } catch (error) {
    console.error("Error fetching appointment configs:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { country, ...data } = body;

    if (!country) {
      return NextResponse.json({ success: false, error: "Country required" }, { status: 400 });
    }

    const existing = getAppointmentConfig(country);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Config not found" }, { status: 404 });
    }

    const updated = updateAppointmentConfig(country, data);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating appointment config:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
