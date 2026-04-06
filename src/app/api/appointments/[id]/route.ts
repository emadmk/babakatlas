export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAppointment, updateAppointment } from "@/lib/adminData";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const appointment = getAppointment(id);
    if (!appointment) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: appointment });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = updateAppointment(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
