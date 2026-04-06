export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAppointments } from "@/lib/adminData";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const appointments = getAppointments({ email: session.user.email });
    return NextResponse.json({ success: true, data: appointments });
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
