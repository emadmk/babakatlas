export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getCharge, updateCharge } from "@/lib/adminData";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const charge = getCharge(id);
    if (!charge) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: charge });
  } catch (error) {
    console.error("Error fetching charge:", error);
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

    // If marking as paid, set paidAt
    if (body.status === "paid" && !body.paidAt) {
      body.paidAt = new Date().toISOString();
    }

    const updated = updateCharge(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating charge:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
