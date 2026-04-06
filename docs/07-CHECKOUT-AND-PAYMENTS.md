# 07 - Checkout and Payments

## Overview

The checkout flow starts when the user clicks "Checkout" on the configurator's Order Summary step (Step 6). The system creates an order, then redirects to Stripe for payment (or simulates payment if Stripe is not configured). Note that installation cost is handled separately through the charges system and is **not** included in the checkout total.

## Checkout Page

**File**: `src/app/checkout/page.tsx`

The checkout page:

1. Reads configurator state from the Zustand store
2. Collects contact info (name, email, phone) if not already provided
3. Shows order summary with pricing breakdown
4. Creates an order via `POST /api/orders`
5. Creates a Stripe checkout session via `POST /api/checkout/create-session`
6. Redirects to Stripe's hosted checkout page

## Order Creation

### Endpoint: `POST /api/orders`

**File**: `src/app/api/orders/route.ts`

#### Request Body

```json
{
  "contact": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+63 917 123 4567"
  },
  "shippingAddress": {
    "address": "123 Main St",
    "city": "Manila",
    "postalCode": "1000",
    "country": "PH"
  },
  "carType": "sedan",
  "carModel": "Toyota Corolla",
  "tintType": "ceramic",
  "selectedWindows": ["front_left", "front_right", "rear_left", "rear_right"],
  "serviceType": "shipping"
}
```

#### Processing Steps

1. Validates all required fields
2. Validates car type against `WINDOW_SQFT` lookup
3. Calculates pricing server-side using `buildPricingQuote()` from `pricingServer.ts`
4. Gets authenticated user ID (optional -- guest checkout supported)
5. Generates order number: `TG-{YYYYMMDD}-{RANDOM}`
6. Creates order in both:
   - `ordersStore.ts` in-memory Map (for runtime)
   - `adminData.ts` persistent store (for admin panel)
7. Returns order data with formatted pricing

#### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "TG-20260405-A1B2",
    "status": "pending",
    "paymentStatus": "unpaid",
    "pricing": {
      "subtotal": 128,
      "shipping": 0,
      "taxLabel": "VAT (12%)",
      "tax": 15.36,
      "total": 143.36,
      "totalFormatted": "PHP 143.36"
    }
  }
}
```

## Stripe Integration

### Checkout Session Creation

**Endpoint**: `POST /api/checkout/create-session`  
**File**: `src/app/api/checkout/create-session/route.ts`

#### Request

```json
{
  "items": [
    {
      "name": "Ceramic Tint - 4 Windows",
      "description": "Sedan, front and rear side windows",
      "amount": 128,
      "quantity": 1
    },
    {
      "name": "Shipping",
      "amount": 15,
      "quantity": 1
    }
  ],
  "email": "john@example.com",
  "orderId": "uuid"
}
```

#### Processing

1. Validates required fields
2. Calls `createCheckoutSession()` from `src/lib/stripe.ts`
3. Creates a Stripe Checkout Session with:
   - `payment_method_types: ['card']`
   - `mode: 'payment'`
   - `customer_email`: customer's email
   - `metadata: { orderId }`: for webhook correlation
   - `line_items`: mapped from request items (amount in cents)
   - `success_url`: `/checkout/success?session_id={CHECKOUT_SESSION_ID}`
   - `cancel_url`: `/checkout?cancelled=true`

#### Response

```json
{
  "success": true,
  "data": {
    "sessionId": "cs_test_...",
    "url": "https://checkout.stripe.com/..."
  }
}
```

The client then redirects to `data.url`.

### Stripe Library

**File**: `src/lib/stripe.ts`

```typescript
// Server-side Stripe instance
export function getStripeInstance(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: '2024-12-18.acacia' });
}

// Create Checkout Session
export async function createCheckoutSession(params) { ... }

// Create Payment Intent (alternative flow, not currently used in main flow)
export async function createPaymentIntent(amount, currency, metadata) { ... }

// Client-side publishable key
export function getStripePublishableKey(): string { ... }
```

## Webhook Handler

**Endpoint**: `POST /api/webhooks/stripe`  
**File**: `src/app/api/webhooks/stripe/route.ts`

### Event: `checkout.session.completed`

When Stripe confirms payment:

1. Verifies webhook signature using `STRIPE_WEBHOOK_SECRET`
2. Extracts `orderId` from session metadata
3. Updates order status to `CONFIRMED` and payment status to `PAID` via internal API call to `PATCH /api/orders/{orderId}`
4. Sends order confirmation email to customer (`sendOrderConfirmationEmail`)
5. Sends new order notification to admin (`sendAdminNewOrderEmail`)

### Signature Verification

```typescript
const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
```

If verification fails, returns 400 error.

## Fallback Mode (No Stripe)

When `STRIPE_SECRET_KEY` is not set:

- `getStripeInstance()` returns `null`
- `createCheckoutSession()` throws "Stripe not configured"
- The checkout page should detect this and either:
  - Show a "Payment processing unavailable" message
  - Allow order creation without payment (status remains `pending` / `unpaid`)

## Checkout Success Page

**File**: `src/app/checkout/success/page.tsx`

After successful Stripe payment, the user is redirected to `/checkout/success?session_id={id}`. This page:

1. Displays order confirmation message
2. Shows order number
3. Links to order tracking in user dashboard

## Order Data Structure Summary

```
Order Lifecycle:
  pending -> confirmed -> processing -> shipped -> delivered
                                                  \-> cancelled

Payment Lifecycle:
  unpaid -> paid -> refunded
```

## Payment Statuses

| Status | Description |
|--------|-------------|
| `unpaid` | Order created, no payment received |
| `paid` | Stripe payment confirmed via webhook |
| `refunded` | Payment refunded (manual process) |
