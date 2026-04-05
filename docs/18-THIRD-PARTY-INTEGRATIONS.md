# 18 - Third-Party Integrations

## Stripe (Payments)

### Overview

Stripe handles payment processing via Checkout Sessions (hosted payment page).

**Files**:
- `src/lib/stripe.ts` - Server-side Stripe utilities
- `src/app/api/checkout/create-session/route.ts` - Creates checkout sessions
- `src/app/api/webhooks/stripe/route.ts` - Handles payment confirmations

### Setup

1. Create a Stripe account at https://dashboard.stripe.com
2. Get API keys from Developers -> API keys

### Environment Variables

```env
STRIPE_SECRET_KEY=sk_test_...                      # Server-side key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...     # Client-side key
STRIPE_WEBHOOK_SECRET=whsec_...                     # Webhook signing secret
```

### Test Mode vs Live Mode

| Mode | Key Prefix | Description |
|------|-----------|-------------|
| Test | `sk_test_` / `pk_test_` | No real charges, use test card numbers |
| Live | `sk_live_` / `pk_live_` | Real payments, real money |

**Test card numbers**:
- `4242 4242 4242 4242` - Succeeds
- `4000 0000 0000 0002` - Declined
- Any future expiry, any CVC, any ZIP

### Webhook URL

**Local development**: Use Stripe CLI
```bash
stripe listen --forward-to localhost:3002/api/webhooks/stripe
```

**Production**: `https://yourdomain.com/api/webhooks/stripe`

Configure in Stripe Dashboard -> Developers -> Webhooks. Select event: `checkout.session.completed`.

### Flow

```
1. Client -> POST /api/checkout/create-session (with order items)
2. Server -> Stripe API (create Checkout Session)
3. Server -> Client (session URL)
4. Client -> Redirect to Stripe Checkout
5. Customer pays on Stripe
6. Stripe -> POST /api/webhooks/stripe (checkout.session.completed)
7. Server updates order status to CONFIRMED
8. Customer redirected to /checkout/success
```

### Graceful Degradation

When `STRIPE_SECRET_KEY` is not set:
- `getStripeInstance()` returns `null`
- Checkout session creation throws an error
- The checkout page should handle this gracefully

---

## Shippo (Shipping)

### Overview

Shippo provides real-time carrier shipping rates and label generation.

**File**: `src/lib/shippo.ts`

### Setup

1. Create a Shippo account at https://goshippo.com
2. Get API token from Settings -> API

### Environment Variable

```env
SHIPPO_API_KEY=shippo_test_...
```

### API Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `POST /shipments` | Create shipment, get rates |
| `POST /transactions` | Purchase label from rate |

### Rate Calculation Flow

```
1. Build shipment request:
   - From address (admin-configured)
   - To address (customer-entered)
   - Parcel dimensions
2. POST to Shippo /shipments API
3. Receive array of carrier rates
4. Display to customer or use cheapest
```

### Label Creation

```typescript
const label = await createShippingLabel(rateId);
// Returns: label_url (PDF), tracking_number, carrier
```

### Test Mode vs Live Mode

| Key Prefix | Mode |
|-----------|------|
| `shippo_test_` | Test mode (fake rates, fake labels) |
| `shippo_live_` | Live mode (real rates, real labels) |

### Fallback

When `SHIPPO_API_KEY` is not set:
- `getShippingRates()` returns `null`
- The system falls back to admin-configured manual rates from `adminData.ts`
- Manual rates are always available regardless of Shippo configuration

---

## Google OAuth

### Overview

Optional Google login via NextAuth.js Google Provider.

**File**: `src/lib/auth.ts`

### Setup in Google Cloud Console

1. Go to https://console.cloud.google.com
2. Create a new project (or select existing)
3. Navigate to APIs & Services -> Credentials
4. Click "Create Credentials" -> OAuth client ID
5. Application type: Web application
6. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
7. Copy Client ID and Client Secret

### Environment Variables

```env
GOOGLE_CLIENT_ID=123456789.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
```

### Behavior When Not Configured

The provider is only added if both environment variables are set:

```typescript
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(GoogleProvider({ ... }));
}
```

If not configured:
- Google login button should not appear
- No error is thrown
- Credentials login still works

### Callback URL

The callback URL must match exactly in Google Console:

```
{NEXTAUTH_URL}/api/auth/callback/google
```

---

## Gmail SMTP

### Overview

Email sending via Gmail's SMTP server using Nodemailer.

**File**: `src/lib/email.ts`

### Setup

1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account -> Security -> App passwords
3. Generate an App Password for "Mail"
4. Use the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Environment Variables

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcdefghijklmnop           # 16-char App Password (no spaces)
SMTP_FROM=AtlasAdaptive <noreply@atlasadaptive.com>
```

### Connection Settings

```typescript
{
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,       // Uses STARTTLS
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  }
}
```

### Testing

From the admin settings page (`/admin/settings`), click "Send Test Email" to verify the configuration. The test email is sent to the `SMTP_USER` address.

### Alternative SMTP Providers

The system works with any SMTP provider. Just change `SMTP_HOST` and `SMTP_PORT`:

| Provider | Host | Port |
|----------|------|------|
| Gmail | smtp.gmail.com | 587 |
| Outlook | smtp.office365.com | 587 |
| SendGrid | smtp.sendgrid.net | 587 |
| Mailgun | smtp.mailgun.org | 587 |
| Amazon SES | email-smtp.{region}.amazonaws.com | 587 |

### Behavior When Not Configured

When SMTP credentials are not set:
- `send()` catches the error and returns `false`
- Email-dependent features (welcome email, order emails) fail silently
- The app continues to function without email
- Admin settings page shows SMTP as "not configured"
