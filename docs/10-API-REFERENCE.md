# 10 - API Reference

All API routes are under `src/app/api/`. Routes that need dynamic behavior include `export const dynamic = "force-dynamic"` to prevent Next.js static caching.

## Authentication APIs

### NextAuth Handler

```
GET/POST /api/auth/[...nextauth]
```
**File**: `src/app/api/auth/[...nextauth]/route.ts`

NextAuth.js catch-all handler. Handles `/api/auth/signin`, `/api/auth/signout`, `/api/auth/session`, `/api/auth/callback/*`, etc.

### Register

```
POST /api/auth/register
```
**File**: `src/app/api/auth/register/route.ts`

**Auth required**: No

**Request body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "country": "PH",
  "phone": "+63 917 123 4567"
}
```

**Response** (201):
```json
{ "success": true, "data": { "id": "usr-...", "name": "John Doe", "email": "john@example.com" } }
```

**Errors**: 400 (missing fields, short password), 409 (email exists)

### Forgot Password

```
POST /api/auth/forgot-password
```
**File**: `src/app/api/auth/forgot-password/route.ts`

**Auth required**: No

**Request body**: `{ "email": "john@example.com" }`

Sends password reset email if user exists.

---

## Order APIs

### Create Order

```
POST /api/orders
```
**File**: `src/app/api/orders/route.ts`

**Auth required**: No (guest checkout supported, user ID captured if logged in)

**Request body**: See [Checkout documentation](07-CHECKOUT-AND-PAYMENTS.md)

**Response** (201): Order object with computed pricing

### List User Orders

```
GET /api/orders
```
**File**: `src/app/api/orders/route.ts`

**Auth required**: Yes

Returns orders for the authenticated user, sorted by newest first.

### Get/Update Single Order

```
GET /api/orders/[id]
PATCH /api/orders/[id]
```
**File**: `src/app/api/orders/[id]/route.ts`

**Auth required**: Varies

PATCH accepts: `{ status, paymentStatus, stripeSessionId, stripePaymentIntentId }`

---

## Checkout APIs

### Create Stripe Session

```
POST /api/checkout/create-session
```
**File**: `src/app/api/checkout/create-session/route.ts`

**Auth required**: No

**Request body**:
```json
{
  "items": [{ "name": "...", "description": "...", "amount": 128, "quantity": 1 }],
  "email": "john@example.com",
  "orderId": "uuid"
}
```

**Response**: `{ "success": true, "data": { "sessionId": "cs_...", "url": "https://..." } }`

---

## Webhook APIs

### Stripe Webhook

```
POST /api/webhooks/stripe
```
**File**: `src/app/api/webhooks/stripe/route.ts`

**Auth required**: No (uses Stripe signature verification)

Handles `checkout.session.completed` event. Updates order status and sends emails.

---

## Product APIs (Public)

### List Tint Products

```
GET /api/products/tints
```
**File**: `src/app/api/products/tints/route.ts`

Returns all active tint products with specs, prices, and shades.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "prod-standard",
      "name": "Standard",
      "slug": "standard",
      "tintType": "standard",
      "description": "...",
      "pricePerSqft": 3,
      "specs": { "vlt": "35%", "uvBlock": "95%", "heatRejection": "35%" },
      "badge": null,
      "shades": [{ "id": "light", "name": "Light", "vlt": 70, "priceMultiplier": 1.0 }, ...]
    }
  ]
}
```

### List Car Types

```
GET /api/products/cars
```
**File**: `src/app/api/products/cars/route.ts`

Returns all active car types with images and window counts.

---

## Config APIs (Public)

### Pricing Config

```
GET /api/config/pricing
```
**File**: `src/app/api/config/pricing/route.ts`

Returns shipping rates, installation rates, tax rates, and shipping markup settings. Used by the configurator store's `loadConfig()`.

**Response**:
```json
{
  "success": true,
  "data": {
    "shipping": [...ShippingRateConfig],
    "installation": [...InstallationRateConfig],
    "tax": { "PH": 0.12, "AU": 0.10 },
    "shippingMarkup": 0,
    "shippingMarkupType": "flat"
  }
}
```

### Services Config

```
GET /api/config/services
```
**File**: `src/app/api/config/services/route.ts`

Returns active service options (shipping only, installation).

### Shipping Config

```
GET /api/config/shipping
```
**File**: `src/app/api/config/shipping/route.ts`

Returns shipping rates for display.

### Windows Config

```
GET /api/config/windows
```
**File**: `src/app/api/config/windows/route.ts`

Returns window configurations grouped by car type.

---

## Content APIs (Public)

### Homepage

```
GET /api/content/homepage
```
**File**: `src/app/api/content/homepage/route.ts`

Returns full homepage content (hero, benefits, how it works, stats, testimonials, CTA).

### FAQ

```
GET /api/content/faq
```
**File**: `src/app/api/content/faq/route.ts`

Returns active FAQ items sorted by order.

### About

```
GET /api/content/about
```
**File**: `src/app/api/content/about/route.ts`

Returns about page content (story, mission, values, stats, team).

### Contact

```
GET /api/content/contact
```
**File**: `src/app/api/content/contact/route.ts`

Returns contact info (email, phone, hours, regions, subjects).

---

## User APIs

### User Orders

```
GET /api/user/orders
```
**File**: `src/app/api/user/orders/route.ts`

**Auth required**: Yes

Returns orders for the authenticated user from the admin data store.

### User Profile

```
GET /api/user/profile
PUT /api/user/profile
```
**File**: `src/app/api/user/profile/route.ts`

**Auth required**: Yes

GET returns user profile. PUT updates profile fields (name, phone, city, country).

---

## Shipping APIs

### Calculate Shipping

```
POST /api/shipping/calculate
```
**File**: `src/app/api/shipping/calculate/route.ts`

Calculates shipping/installation cost for given parameters.

**Request**: `{ country, sqft, subtotal, serviceType, carType?, windowCount? }`

### Shipping Rates

```
GET /api/shipping/rates
```
**File**: `src/app/api/shipping/rates/route.ts`

Returns all active shipping rates.

---

## Admin APIs

All admin APIs are under `/api/admin/` and should be accessed only by admin users.

### Products

```
GET    /api/admin/products          # List all products
POST   /api/admin/products          # Create product
GET    /api/admin/products/[id]     # Get single product
PUT    /api/admin/products/[id]     # Update product
DELETE /api/admin/products/[id]     # Delete product
```
**Files**: `src/app/api/admin/products/route.ts`, `[id]/route.ts`

### Cars

```
GET    /api/admin/cars              # List all car types
POST   /api/admin/cars              # Create car type
GET    /api/admin/cars/[id]         # Get single car type
PUT    /api/admin/cars/[id]         # Update car type
DELETE /api/admin/cars/[id]         # Delete car type
```
**Files**: `src/app/api/admin/cars/route.ts`, `[id]/route.ts`

### Windows

```
GET /api/admin/windows              # List all window configs
PUT /api/admin/windows              # Update window configs
```
**File**: `src/app/api/admin/windows/route.ts`

### Services

```
GET /api/admin/services             # List service configs
PUT /api/admin/services             # Update service configs
```
**File**: `src/app/api/admin/services/route.ts`

### Shipping

```
GET /api/admin/shipping             # List shipping rates
PUT /api/admin/shipping             # Update shipping rates
```
**File**: `src/app/api/admin/shipping/route.ts`

### Installation

```
GET /api/admin/installation         # List installation rates
PUT /api/admin/installation         # Update installation rates
```
**File**: `src/app/api/admin/installation/route.ts`

### Pricing

```
GET /api/admin/pricing              # Get pricing config
PUT /api/admin/pricing              # Update pricing
```
**File**: `src/app/api/admin/pricing/route.ts`

### Orders

```
GET /api/admin/orders               # List all orders
GET /api/admin/orders/[id]          # Get single order
PUT /api/admin/orders/[id]          # Update order (status, notes)
```
**Files**: `src/app/api/admin/orders/route.ts`, `[id]/route.ts`

### Users

```
GET /api/admin/users                # List all users
GET /api/admin/users/[id]           # Get single user
PUT /api/admin/users/[id]           # Update user (status, profile)
```
**Files**: `src/app/api/admin/users/route.ts`, `[id]/route.ts`

### Settings

```
GET /api/admin/settings             # Get site settings
PUT /api/admin/settings             # Update site settings
```
**File**: `src/app/api/admin/settings/route.ts`

### Stats

```
GET /api/admin/stats                # Get dashboard statistics
```
**File**: `src/app/api/admin/stats/route.ts`

Returns: totalOrders, revenue, activeUsers, pendingOrders, revenueByMonth.

### Content Management

```
GET /api/admin/content/homepage     # Get homepage content
PUT /api/admin/content/homepage     # Update homepage content

GET /api/admin/content/faq          # List FAQ items
POST /api/admin/content/faq         # Create FAQ item
PUT /api/admin/content/faq/[id]     # Update FAQ item
DELETE /api/admin/content/faq/[id]  # Delete FAQ item

GET /api/admin/content/about        # Get about content
PUT /api/admin/content/about        # Update about content

GET /api/admin/content/contact      # Get contact info
PUT /api/admin/content/contact      # Update contact info
```

### Upload

```
POST /api/admin/upload              # Upload image file
```
**File**: `src/app/api/admin/upload/route.ts`

Accepts multipart form data with `file` and optional `category` field. Saves to `public/uploads/{category}/{timestamp}-{random}.{ext}`.

Allowed types: JPEG, PNG, WebP, SVG. Max size: 5MB.

**Response**: `{ "success": true, "url": "/uploads/general/1712345678-abc123.jpg" }`

---

## Email APIs

### Test Email

```
POST /api/email/test
```
**File**: `src/app/api/email/test/route.ts`

Sends a test email to verify SMTP configuration.

---

## Contact API

### Submit Contact Form

```
POST /api/contact
```
**File**: `src/app/api/contact/route.ts`

**Request**: `{ name, email, subject, message }`

Sends contact form email to admin.
