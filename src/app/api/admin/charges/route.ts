export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getCharges, createCharge, getAdminOrders } from "@/lib/adminData";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const email = searchParams.get("email") || undefined;

    const charges = getCharges({ status, email });
    // Get orders with installation service type
    const installationOrders = getAdminOrders().filter(o => o.serviceType === 'installation');
    return NextResponse.json({ success: true, data: { charges, installationOrders } });
  } catch (error) {
    console.error("Error fetching charges:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId = null,
      customerEmail,
      customerName,
      orderId = null,
      appointmentId = null,
      description,
      amount,
      currency = "PHP",
    } = body;

    if (!customerEmail || !customerName || !description || !amount) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (customerEmail, customerName, description, amount)" },
        { status: 400 }
      );
    }

    const charge = createCharge({
      userId,
      customerEmail,
      customerName,
      orderId,
      appointmentId,
      description,
      amount: parseFloat(amount),
      currency,
      status: "pending",
      paidAt: null,
    });

    return NextResponse.json({ success: true, data: charge }, { status: 201 });
  } catch (error) {
    console.error("Error creating charge:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
