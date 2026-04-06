export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAppointments, createAppointment } from "@/lib/adminData";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country") || undefined;
    const status = searchParams.get("status") || undefined;
    const userId = searchParams.get("userId") || undefined;
    const email = searchParams.get("email") || undefined;

    const appointments = getAppointments({ country, status, userId, email });
    return NextResponse.json({ success: true, data: appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId = "",
      userId = null,
      customerName,
      customerEmail,
      customerPhone = "",
      country,
      address,
      city,
      vehicleType = "",
      date,
      slot,
      notes = "",
    } = body;

    if (!customerName || !customerEmail || !country || !address || !city || !date || !slot) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const appointment = createAppointment({
      orderId,
      userId,
      customerName,
      customerEmail,
      customerPhone,
      country,
      address,
      city,
      vehicleType,
      date,
      slot,
      status: "pending",
      notes,
    });

    return NextResponse.json({ success: true, data: appointment }, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
