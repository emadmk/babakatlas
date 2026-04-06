export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAppointments } from "@/lib/adminData";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country") || undefined;
    const status = searchParams.get("status") || undefined;

    const appointments = getAppointments({ country, status });
    return NextResponse.json({ success: true, data: appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
