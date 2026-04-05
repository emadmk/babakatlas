# 11 - Frontend Pages

## Public Pages

### Homepage (`/`)

**File**: `src/app/page.tsx`

The landing page fetches content from `GET /api/content/homepage` and renders:

1. **Hero Section**: Full-width background image, headline, subtitle, CTA button to configurator
2. **Benefits Grid**: 6 cards showing UV protection, heat reduction, privacy, glare reduction, interior protection, energy saving
3. **How It Works**: 4-step process (Choose Car -> Select Windows -> Pick Tint -> Order)
4. **Stats Section**: Animated counters (10,000+ cars, 99% UV block, 50+ models, 2 countries)
5. **Testimonials**: Customer reviews with star ratings and avatars
6. **CTA Section**: Final call-to-action with badges (free shipping, professional grade, warranty)

All text content is localized (EN/TL) and admin-editable.

### Configurator (`/configurator`)

**File**: `src/app/configurator/page.tsx`

The 5-step tint configuration wizard. See [06-CONFIGURATOR.md](06-CONFIGURATOR.md) for full details.

### Checkout (`/checkout`)

**File**: `src/app/checkout/page.tsx`

Order review and payment page. Collects contact info, displays order summary, creates order, and redirects to Stripe.

### Checkout Success (`/checkout/success`)

**File**: `src/app/checkout/success/page.tsx`

Post-payment confirmation page. Shows order number, success message, and links to order tracking.

### About (`/about`)

**File**: `src/app/about/page.tsx`

Fetches content from `GET /api/content/about`. Displays:
- Company story with rich text
- Mission statement
- Core values cards (Quality, Innovation, Customer Service, Sustainability)
- Business stats
- Team members grid

### FAQ (`/faq`)

**File**: `src/app/faq/page.tsx`

Fetches FAQ items from `GET /api/content/faq`. Renders:
- Accordion-style Q&A list
- Items sorted by admin-configured order
- Only active items shown
- Bilingual content based on selected language

### Contact (`/contact`)

**File**: `src/app/contact/page.tsx`

Fetches contact info from `GET /api/content/contact`. Features:
- Contact form (name, email, subject dropdown, message)
- Business hours display
- Service regions (PH, AU) with flags
- Email and phone links
- Form submits to `POST /api/contact`

### Shipping (`/shipping`)

**File**: `src/app/shipping/page.tsx`

Shipping information page showing:
- Supported countries and delivery times
- Shipping rates
- Free shipping thresholds
- Installation availability

### Terms of Service (`/terms`)

**File**: `src/app/terms/page.tsx`

Static terms of service page.

### Privacy Policy (`/privacy`)

**File**: `src/app/privacy/page.tsx`

Static privacy policy page.

## Auth Pages

### Login (`/auth/login`)

**File**: `src/app/auth/login/page.tsx`

- Email and password fields
- "Remember me" option
- Google OAuth button (shown only if configured)
- Links to register and forgot password
- Redirects to `/dashboard` on success (or `/admin` for admin)

### Register (`/auth/register`)

**File**: `src/app/auth/register/page.tsx`

- Name, email, password, confirm password fields
- Country selector (PH/AU)
- Phone number (optional)
- Submits to `POST /api/auth/register`
- Auto-login after successful registration

### Forgot Password (`/auth/forgot-password`)

**File**: `src/app/auth/forgot-password/page.tsx`

- Email field
- Submits to `POST /api/auth/forgot-password`
- Shows success message regardless of email existence (security best practice)

## Dashboard Pages

All dashboard pages are wrapped in `AuthGuard` and require authentication.

### Dashboard Overview (`/dashboard`)

**File**: `src/app/dashboard/page.tsx`

User dashboard showing:
- Welcome message with user name
- Quick stats (total orders, total spent)
- Recent orders list
- Quick links to configurator and profile

### My Orders (`/dashboard/orders`)

**File**: `src/app/dashboard/orders/page.tsx`

- List of user's orders from `GET /api/user/orders`
- Each order shows: order number, date, status badge, total, items summary
- Status color coding (pending=yellow, confirmed=blue, processing=orange, shipped=purple, delivered=green, cancelled=red)

### Profile (`/dashboard/profile`)

**File**: `src/app/dashboard/profile/page.tsx`

- View and edit user profile
- Fields: name, email (read-only), phone, country, city
- Saves via `PUT /api/user/profile`

## Page Layout Behavior

The `ConditionalLayout` component (`src/components/ConditionalLayout.tsx`) controls Navbar and Footer visibility:

| Path Pattern | Navbar | Footer |
|-------------|--------|--------|
| `/admin/*` | Hidden | Hidden |
| `/auth/*` | Hidden | Hidden |
| All others | Shown | Shown |

```typescript
const hideNavFooter = pathname.startsWith("/admin");
const isAuthPage = pathname.startsWith("/auth");
```
