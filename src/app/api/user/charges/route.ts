export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getCharges } from "@/lib/adminData";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const charges = getCharges({ email: session.user.email });
    return NextResponse.json({ success: true, data: charges });
  } catch (error) {
    console.error("Error fetching user charges:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
