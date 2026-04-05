export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getAdminOrders } from "@/lib/adminData";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  const userEmail = session.user.email;

  // Find orders by userId or email
  const allOrders = getAdminOrders();
  const userOrders = allOrders.filter(o =>
    o.userId === userId || o.contact?.email === userEmail
  );

  return NextResponse.json({ success: true, data: userOrders });
}
