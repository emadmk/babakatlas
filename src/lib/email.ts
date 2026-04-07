import nodemailer from 'nodemailer';

// ── Transporter ───────────────────────────────────────────
function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const FROM = process.env.SMTP_FROM || 'Atlas Adaptive Tint <noreply@atlasadaptivetint.com>';
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3002';

// ── Email Templates ──────────────────────────────────────
function baseTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
    <body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <!-- Logo -->
        <div style="text-align:center;margin-bottom:32px;">
          <img src="${BASE_URL}/images/logo/logo-dark.png" alt="Atlas Adaptive Tint" style="height:48px;width:auto;" />
        </div>
        <!-- Content Card -->
        <div style="background:#1a1a1a;border:1px solid #333;border-radius:16px;padding:32px;">
          ${content}
        </div>
        <!-- Footer -->
        <div style="text-align:center;margin-top:24px;color:#666;font-size:12px;">
          <p>&copy; ${new Date().getFullYear()} Atlas Adaptive Tint. All rights reserved.</p>
          <p>Premium Window Tint Films | Philippines & Australia</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ── Send function ─────────────────────────────────────────
async function send(to: string, subject: string, html: string): Promise<boolean> {
  try {
    const transporter = getTransporter();
    await transporter.sendMail({ from: FROM, to, subject, html });
    return true;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
}

// ── 1. Welcome / Registration ─────────────────────────────
export async function sendWelcomeEmail(to: string, name: string) {
  const html = baseTemplate(`
    <h2 style="color:#fff;margin:0 0 16px;">Welcome to Atlas Adaptive Tint!</h2>
    <p style="color:#aaa;line-height:1.6;">Hi ${name},</p>
    <p style="color:#aaa;line-height:1.6;">Thank you for creating your account. You now have access to our premium window tint configurator and can track all your orders.</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${BASE_URL}/configurator" style="background:#0071E3;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">Start Configuring</a>
    </div>
    <p style="color:#666;font-size:13px;">If you have any questions, contact us at hello@atlasadaptivetint.com</p>
  `);
  return send(to, 'Welcome to Atlas Adaptive Tint!', html);
}

// ── 2. Password Reset ─────────────────────────────────────
export async function sendPasswordResetEmail(to: string, resetToken: string) {
  const resetUrl = `${BASE_URL}/auth/reset-password?token=${resetToken}`;
  const html = baseTemplate(`
    <h2 style="color:#fff;margin:0 0 16px;">Password Reset Request</h2>
    <p style="color:#aaa;line-height:1.6;">We received a request to reset your password. Click the button below to set a new password:</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${resetUrl}" style="background:#0071E3;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">Reset Password</a>
    </div>
    <p style="color:#666;font-size:13px;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
  `);
  return send(to, 'Reset Your Password - Atlas Adaptive Tint', html);
}

// ── 3. Order Confirmation ─────────────────────────────────
export async function sendOrderConfirmationEmail(to: string, order: {
  orderNumber: string;
  items: Array<{ name: string; qty: number; price: number }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: string;
  estimatedDelivery: string;
}) {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding:8px 0;color:#ccc;border-bottom:1px solid #333;">${item.name}</td>
      <td style="padding:8px 0;color:#ccc;border-bottom:1px solid #333;text-align:center;">${item.qty}</td>
      <td style="padding:8px 0;color:#fff;border-bottom:1px solid #333;text-align:right;">$${item.price.toFixed(2)}</td>
    </tr>
  `).join('');

  const html = baseTemplate(`
    <h2 style="color:#fff;margin:0 0 8px;">Order Confirmed!</h2>
    <p style="color:#0071E3;font-size:14px;margin:0 0 24px;">Order #${order.orderNumber}</p>
    <p style="color:#aaa;line-height:1.6;">Thank you for your order. Here are the details:</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <thead>
        <tr style="border-bottom:2px solid #333;">
          <th style="text-align:left;padding:8px 0;color:#888;font-size:12px;">Item</th>
          <th style="text-align:center;padding:8px 0;color:#888;font-size:12px;">Qty</th>
          <th style="text-align:right;padding:8px 0;color:#888;font-size:12px;">Price</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <div style="margin:16px 0;padding:16px;background:#111;border-radius:8px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
        <span style="color:#888;">Subtotal</span><span style="color:#ccc;">$${order.subtotal.toFixed(2)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
        <span style="color:#888;">Shipping</span><span style="color:#ccc;">$${order.shipping.toFixed(2)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
        <span style="color:#888;">Tax</span><span style="color:#ccc;">$${order.tax.toFixed(2)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding-top:8px;border-top:1px solid #333;">
        <span style="color:#fff;font-weight:bold;">Total</span><span style="color:#0071E3;font-weight:bold;font-size:18px;">$${order.total.toFixed(2)}</span>
      </div>
    </div>
    <p style="color:#888;font-size:13px;">Shipping to: ${order.shippingAddress}</p>
    <p style="color:#888;font-size:13px;">Estimated delivery: ${order.estimatedDelivery}</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${BASE_URL}/dashboard/orders" style="background:#0071E3;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">Track Your Order</a>
    </div>
  `);
  return send(to, `Order Confirmed #${order.orderNumber} - Atlas Adaptive Tint`, html);
}

// ── 4. Order Status Update (Processing) ───────────────────
export async function sendOrderProcessingEmail(to: string, orderNumber: string) {
  const html = baseTemplate(`
    <h2 style="color:#fff;margin:0 0 16px;">Your Order is Being Prepared</h2>
    <p style="color:#0071E3;font-size:14px;margin:0 0 16px;">Order #${orderNumber}</p>
    <p style="color:#aaa;line-height:1.6;">Great news! Your tint films are being cut and prepared for shipment. We'll notify you when they ship.</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${BASE_URL}/dashboard/orders" style="background:#0071E3;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">View Order</a>
    </div>
  `);
  return send(to, `Order Processing #${orderNumber} - Atlas Adaptive Tint`, html);
}

// ── 5. Order Shipped ──────────────────────────────────────
export async function sendOrderShippedEmail(to: string, orderNumber: string, trackingNumber?: string, carrier?: string) {
  const trackingHtml = trackingNumber ? `
    <div style="margin:16px 0;padding:16px;background:#111;border-radius:8px;">
      <p style="color:#888;font-size:13px;margin:0 0 8px;">Tracking Number:</p>
      <p style="color:#0071E3;font-size:16px;font-weight:bold;margin:0;">${trackingNumber}</p>
      ${carrier ? `<p style="color:#888;font-size:12px;margin:8px 0 0;">Carrier: ${carrier}</p>` : ''}
    </div>
  ` : '';

  const html = baseTemplate(`
    <h2 style="color:#fff;margin:0 0 16px;">Your Order Has Been Shipped!</h2>
    <p style="color:#0071E3;font-size:14px;margin:0 0 16px;">Order #${orderNumber}</p>
    <p style="color:#aaa;line-height:1.6;">Your tint films are on their way! You can track your package using the details below.</p>
    ${trackingHtml}
    <div style="text-align:center;margin:24px 0;">
      <a href="${BASE_URL}/dashboard/orders" style="background:#0071E3;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">Track Order</a>
    </div>
  `);
  return send(to, `Order Shipped #${orderNumber} - Atlas Adaptive Tint`, html);
}

// ── 6. Order Delivered ────────────────────────────────────
export async function sendOrderDeliveredEmail(to: string, orderNumber: string) {
  const html = baseTemplate(`
    <h2 style="color:#fff;margin:0 0 16px;">Order Delivered!</h2>
    <p style="color:#0071E3;font-size:14px;margin:0 0 16px;">Order #${orderNumber}</p>
    <p style="color:#aaa;line-height:1.6;">Your tint films have been delivered. We hope you love them!</p>
    <p style="color:#aaa;line-height:1.6;">Need help with installation? Check our <a href="${BASE_URL}/faq" style="color:#0071E3;">FAQ</a> or <a href="${BASE_URL}/contact" style="color:#0071E3;">contact us</a>.</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${BASE_URL}/dashboard/orders" style="background:#0071E3;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">View Order</a>
    </div>
  `);
  return send(to, `Order Delivered #${orderNumber} - Atlas Adaptive Tint`, html);
}

// ── 7. Order Cancelled ────────────────────────────────────
export async function sendOrderCancelledEmail(to: string, orderNumber: string, reason?: string) {
  const html = baseTemplate(`
    <h2 style="color:#fff;margin:0 0 16px;">Order Cancelled</h2>
    <p style="color:#0071E3;font-size:14px;margin:0 0 16px;">Order #${orderNumber}</p>
    <p style="color:#aaa;line-height:1.6;">Your order has been cancelled.${reason ? ` Reason: ${reason}` : ''}</p>
    <p style="color:#aaa;line-height:1.6;">If you have any questions, please <a href="${BASE_URL}/contact" style="color:#0071E3;">contact us</a>.</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${BASE_URL}/configurator" style="background:#0071E3;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">Start New Order</a>
    </div>
  `);
  return send(to, `Order Cancelled #${orderNumber} - Atlas Adaptive Tint`, html);
}

// ── 8. Contact Form Notification (to admin) ───────────────
export async function sendContactFormEmail(data: { name: string; email: string; subject: string; message: string }) {
  const adminEmail = process.env.SMTP_USER || 'admin@atlasadaptive.com';
  const html = baseTemplate(`
    <h2 style="color:#fff;margin:0 0 16px;">New Contact Form Submission</h2>
    <div style="margin:16px 0;padding:16px;background:#111;border-radius:8px;">
      <p style="color:#888;margin:0 0 4px;font-size:12px;">From:</p>
      <p style="color:#fff;margin:0 0 12px;">${data.name} (${data.email})</p>
      <p style="color:#888;margin:0 0 4px;font-size:12px;">Subject:</p>
      <p style="color:#fff;margin:0 0 12px;">${data.subject}</p>
      <p style="color:#888;margin:0 0 4px;font-size:12px;">Message:</p>
      <p style="color:#ccc;margin:0;white-space:pre-wrap;">${data.message}</p>
    </div>
    <p style="color:#666;font-size:12px;">Reply directly to ${data.email}</p>
  `);
  return send(adminEmail, `Contact Form: ${data.subject}`, html);
}

// ── 9. Admin: New Order Notification ──────────────────────
export async function sendAdminNewOrderEmail(orderNumber: string, total: number, customerName: string) {
  const adminEmail = process.env.SMTP_USER || 'admin@atlasadaptive.com';
  const html = baseTemplate(`
    <h2 style="color:#fff;margin:0 0 16px;">New Order Received!</h2>
    <div style="margin:16px 0;padding:16px;background:#111;border-radius:8px;">
      <p style="color:#888;margin:0 0 4px;font-size:12px;">Order Number:</p>
      <p style="color:#0071E3;margin:0 0 12px;font-weight:bold;">${orderNumber}</p>
      <p style="color:#888;margin:0 0 4px;font-size:12px;">Customer:</p>
      <p style="color:#fff;margin:0 0 12px;">${customerName}</p>
      <p style="color:#888;margin:0 0 4px;font-size:12px;">Total:</p>
      <p style="color:#30d158;margin:0;font-weight:bold;font-size:20px;">$${total.toFixed(2)}</p>
    </div>
    <div style="text-align:center;margin:24px 0;">
      <a href="${BASE_URL}/admin/orders" style="background:#0071E3;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">View in Admin</a>
    </div>
  `);
  return send(adminEmail, `New Order #${orderNumber} - $${total.toFixed(2)}`, html);
}

// ── 10. Test Email ────────────────────────────────────────
export async function sendTestEmail(to: string) {
  const html = baseTemplate(`
    <h2 style="color:#fff;margin:0 0 16px;">Test Email</h2>
    <p style="color:#aaa;line-height:1.6;">This is a test email from Atlas Adaptive Tint. If you received this, your SMTP configuration is working correctly.</p>
    <div style="margin:16px 0;padding:16px;background:#111;border-radius:8px;">
      <p style="color:#888;margin:0 0 4px;font-size:12px;">SMTP Host:</p>
      <p style="color:#fff;margin:0 0 12px;">${process.env.SMTP_HOST || 'smtp.gmail.com'}</p>
      <p style="color:#888;margin:0 0 4px;font-size:12px;">From:</p>
      <p style="color:#fff;margin:0;">${FROM}</p>
    </div>
  `);
  return send(to, 'Test Email - Atlas Adaptive Tint', html);
}
