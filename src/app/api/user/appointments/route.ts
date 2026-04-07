export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getAppointments } from "@/lib/adminData";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
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
