import { NextResponse } from "next/server";
import crypto from "crypto";

// TODO: Import and use the email service once SMTP is configured
// import { sendPasswordResetEmail } from "@/lib/email";

// TODO: Store reset tokens in the database with expiry timestamps
// and validate them in the reset-password endpoint

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Generate a random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // TODO: Look up the user by email in the database
    // TODO: If user exists, store the reset token with a 1-hour expiry
    // TODO: Send the email using sendPasswordResetEmail(email, resetToken)

    // For now, log the token to console for development/testing
    console.log(`[Forgot Password] Reset requested for: ${email}`);
    console.log(`[Forgot Password] Generated token: ${resetToken}`);
    console.log(
      `[Forgot Password] Reset URL: ${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
    );

    // Always return success to avoid leaking whether an email exists
    return NextResponse.json({
      message: "If an account exists with this email, a reset link has been sent.",
    });
  } catch (error) {
    console.error("[Forgot Password] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
