# 09 - Email System

## Overview

The email system uses **Nodemailer** with SMTP (Gmail by default) to send transactional emails. All email functions are in `src/lib/email.ts`.

## SMTP Configuration

### Environment Variables

```env
SMTP_HOST=smtp.gmail.com        # Default
SMTP_PORT=587                    # Default, uses STARTTLS
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM=AtlasAdaptive <noreply@atlasadaptive.com>
```

### Gmail App Password Setup

1. Enable 2-Factor Authentication on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Generate a new App Password for "Mail"
4. Use the 16-character password as `SMTP_PASS`

### Transporter

```typescript
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
```

## Email Templates

All emails use a shared `baseTemplate()` function that wraps content in a dark-themed HTML layout:

- Background: `#0a0a0a` (near black)
- Content card: `#1a1a1a` with `#333` border and 16px border radius
- Logo: "Atlas" (white) + "Adaptive" (blue `#0071E3`)
- Footer: Copyright, "Premium Window Tint Films | Philippines & Australia"
- CTA buttons: Blue (`#0071E3`) with white text, rounded
- Text: White headings, gray (`#aaa`) body text

## Email Types

### 1. Welcome / Registration

**Function**: `sendWelcomeEmail(to, name)`

Sent when a new user registers. Contains:
- Welcome greeting with user's name
- CTA button to configurator
- Support email reference

### 2. Password Reset

**Function**: `sendPasswordResetEmail(to, resetToken)`

Sent when user requests password reset:
- Reset link with token: `{BASE_URL}/auth/reset-password?token={token}`
- 1-hour expiry notice
- Safety notice if not requested

### 3. Order Confirmation

**Function**: `sendOrderConfirmationEmail(to, order)`

Sent after successful payment (triggered by Stripe webhook). Contains:
- Order number (blue accent color)
- Item table with columns: Item, Qty, Price
- Pricing summary box:
  - Subtotal, Shipping, Tax, **Total** (blue, 18px)
- Shipping address
- Estimated delivery date
- CTA: "Track Your Order" -> `/dashboard/orders`

### 4. Order Processing

**Function**: `sendOrderProcessingEmail(to, orderNumber)`

Sent when order status changes to "processing":
- "Your Order is Being Prepared" heading
- Notification that films are being cut
- CTA: "View Order"

### 5. Order Shipped

**Function**: `sendOrderShippedEmail(to, orderNumber, trackingNumber?, carrier?)`

Sent when order ships. Contains:
- "Your Order Has Been Shipped" heading
- Tracking info box (if provided):
  - Tracking number (blue, bold, 16px)
  - Carrier name
- CTA: "Track Order"

### 6. Order Delivered

**Function**: `sendOrderDeliveredEmail(to, orderNumber)`

- "Order Delivered" heading
- Links to FAQ and contact for installation help
- CTA: "View Order"

### 7. Order Cancelled

**Function**: `sendOrderCancelledEmail(to, orderNumber, reason?)`

- "Order Cancelled" heading
- Optional cancellation reason
- Link to contact support
- CTA: "Start New Order" -> `/configurator`

### 8. Contact Form (to Admin)

**Function**: `sendContactFormEmail(data)`

Sent to admin email when a visitor submits the contact form:
- "New Contact Form Submission" heading
- Sender name and email
- Subject
- Full message text
- Reply-to address

### 9. Admin New Order Notification

**Function**: `sendAdminNewOrderEmail(orderNumber, total, customerName)`

Sent to admin when a new paid order comes in:
- "New Order Received" heading
- Order number, customer name
- Total amount in green (`#30d158`), 20px bold
- CTA: "View in Admin" -> `/admin/orders`

### 10. Test Email

**Function**: `sendTestEmail(to)`

Sent from admin settings page to verify SMTP configuration:
- "Test Email" heading
- Confirms SMTP is working
- Shows SMTP host and from address

## Send Function

All emails route through a single `send()` function:

```typescript
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
```

Returns `true` on success, `false` on failure (never throws).

## Contact Form Flow

**Endpoint**: `POST /api/contact`  
**File**: `src/app/api/contact/route.ts`

1. User fills out contact form on `/contact`
2. Client sends `{ name, email, subject, message }` to API
3. API calls `sendContactFormEmail(data)` to admin
4. Returns success/failure to client

## Test Email API

**Endpoint**: `POST /api/email/test`  
**File**: `src/app/api/email/test/route.ts`

Called from admin settings to verify SMTP:
1. Sends test email to configured admin address
2. Returns success/failure with any error details
