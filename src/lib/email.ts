import nodemailer from "nodemailer";

// Email transporter - configure with your SMTP settings
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

export async function sendPasswordResetEmail(to: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "AtlasAdaptive <noreply@atlasadaptive.com>",
      to,
      subject: "Reset Your Password - AtlasAdaptive",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 16px;">
          <h1 style="color: #0071E3; text-align: center;">AtlasAdaptive</h1>
          <h2 style="text-align: center;">Password Reset Request</h2>
          <p style="color: #a1a1aa;">We received a request to reset your password. Click the button below to set a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #0071E3; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">Reset Password</a>
          </div>
          <p style="color: #71717a; font-size: 12px;">If you didn't request this, you can safely ignore this email. The link expires in 1 hour.</p>
          <p style="color: #71717a; font-size: 12px;">— AtlasAdaptive Team</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

export async function sendOrderConfirmationEmail(to: string, orderNumber: string, total: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "AtlasAdaptive <noreply@atlasadaptive.com>",
      to,
      subject: `Order Confirmed - ${orderNumber} | AtlasAdaptive`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 16px;">
          <h1 style="color: #0071E3; text-align: center;">AtlasAdaptive</h1>
          <h2 style="text-align: center;">Order Confirmed!</h2>
          <p style="color: #a1a1aa;">Thank you for your order. Here are the details:</p>
          <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin: 20px 0;">
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <p><strong>Total:</strong> ${total}</p>
          </div>
          <p style="color: #a1a1aa;">You can track your order in your <a href="${process.env.NEXTAUTH_URL}/dashboard/orders" style="color: #0071E3;">dashboard</a>.</p>
          <p style="color: #71717a; font-size: 12px;">— AtlasAdaptive Team</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}
