export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAdminUsers, createAdminUser } from "@/lib/adminData";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, country, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUsers = getAdminUsers();
    if (existingUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Create user
    const newUser = createAdminUser({
      name,
      email: email.toLowerCase(),
      phone: phone || "",
      country: country || "PH",
      city: "",
      ordersCount: 0,
      totalSpent: 0,
      status: "active",
      joinedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      password, // stored in data store
    });

    // Send welcome email (don't block on failure)
    sendWelcomeEmail(email, name).catch(() => {});

    return NextResponse.json({
      success: true,
      data: { id: newUser.id, name: newUser.name, email: newUser.email },
    }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Registration failed" },
      { status: 500 }
    );
  }
}
