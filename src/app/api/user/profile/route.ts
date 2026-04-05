export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getAdminUserByEmail, updateAdminUser } from "@/lib/adminData";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  const user = getAdminUserByEmail(session.user.email);
  if (!user) {
    return NextResponse.json({ success: true, data: {
      name: session.user.name || "",
      email: session.user.email,
      phone: "",
      country: "",
      city: "",
    }});
  }

  // Don't send password
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _pw, ...safeUser } = user;
  return NextResponse.json({ success: true, data: safeUser });
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  const user = getAdminUserByEmail(session.user.email);
  if (!user) {
    return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
  }

  const body = await request.json();
  const updated = updateAdminUser(user.id, {
    name: body.name || user.name,
    phone: body.phone || user.phone,
    city: body.city || user.city,
    country: body.country || user.country,
  });

  return NextResponse.json({ success: true, data: updated });
}
