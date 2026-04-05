# 05 - Admin Panel

## Overview

The admin panel is accessible at `/admin` and is restricted to users with the `admin` role. It provides a full CMS and management interface for all aspects of the e-commerce site.

**File**: `src/app/admin/layout.tsx`

## Authentication & Authorization

The admin layout (`src/app/admin/layout.tsx`) performs three checks:

1. **Loading**: Shows spinner while session is being fetched
2. **Unauthenticated**: Redirects to `/auth/login`
3. **Non-admin role**: Shows "Access Denied" with a link to `/dashboard`

Only the hardcoded admin account (`admin@atlasadaptive.com` / `Atlas2026!`) has the `admin` role.

## Layout Structure

The admin panel uses a sidebar + content layout:

- **Sidebar** (left, 256px): Fixed on desktop, slide-out on mobile. Contains navigation, logo, back-to-site link, and sign-out button.
- **Top bar**: Sticky header with mobile menu toggle and admin avatar
- **Content area**: Rendered with a Framer Motion page transition

### Navigation Items

| Route | Label | Icon |
|-------|-------|------|
| `/admin` | Dashboard | LayoutDashboard |
| `/admin/products` | Tint Products | Package |
| `/admin/cars` | Car Types | Car |
| `/admin/windows` | Windows | AppWindow |
| `/admin/services` | Services | Wrench |
| `/admin/shipping` | Shipping | Truck |
| `/admin/pricing` | Pricing | DollarSign |
| `/admin/orders` | Orders | ShoppingCart |
| `/admin/content/homepage` | Homepage | Home |
| `/admin/content/faq` | FAQ | HelpCircle |
| `/admin/content/about` | About | Info |
| `/admin/content/contact` | Contact | Phone |
| `/admin/users` | Users | Users |
| `/admin/settings` | Settings | Settings |

The Content section is collapsible with a chevron toggle.

## Admin Pages

### Dashboard (`/admin`)

**File**: `src/app/admin/page.tsx`

Displays key statistics fetched from `GET /api/admin/stats`:
- Total orders, total revenue, active users, pending orders
- Revenue by month chart data
- Recent orders list

Stats are computed from the actual data in the admin store.

### Tint Products (`/admin/products`)

**Files**: `src/app/admin/products/page.tsx`, `[id]/page.tsx`, `new/page.tsx`

- **List view**: Shows all tint products with name, type, price, active status
- **Create**: Form for new product with all fields including localized names/descriptions, shades, image upload
- **Edit**: Same form pre-populated with existing data
- **Delete**: Remove product from store
- **Toggle active**: Enable/disable product visibility
- **Image upload**: Uses `ImageUploader` component (drag-drop or URL)

API: `GET/POST /api/admin/products`, `GET/PUT/DELETE /api/admin/products/[id]`

### Car Types (`/admin/cars`)

**Files**: `src/app/admin/cars/page.tsx`, `[id]/page.tsx`

- CRUD for car types (Sedan, SUV, Van, etc.)
- Each car type has: localized name, type enum, window count, image
- Unsplash images used as defaults

API: `GET/POST /api/admin/cars`, `GET/PUT/DELETE /api/admin/cars/[id]`

### Windows Configuration (`/admin/windows`)

**File**: `src/app/admin/windows/page.tsx`

- View and edit window configurations per car type
- Each window has: position, localized label, default square footage, active toggle
- Grouped by car type for easy editing

API: `GET/PUT /api/admin/windows`

### Services (`/admin/services`)

**File**: `src/app/admin/services/page.tsx`

- Edit service options: "Shipping Only" and "Professional Installation"
- Localized names, descriptions, and feature lists

API: `GET/PUT /api/admin/services`

### Shipping (`/admin/shipping`)

**File**: `src/app/admin/shipping/page.tsx`

- Edit shipping rates per country (PH, AU)
- Fields: base rate, per-sqft rate, free shipping threshold, delivery days
- Edit installation rates per country + car type
- Shippo integration status indicator
- Shipping markup configuration (flat amount or percentage)

API: `GET/PUT /api/admin/shipping`, `GET/PUT /api/admin/installation`

### Pricing (`/admin/pricing`)

**File**: `src/app/admin/pricing/page.tsx`

- Edit per-sqft prices for each tint type
- View/edit tax rates per country
- Currency configuration

API: `GET/PUT /api/admin/pricing`

### Orders (`/admin/orders`)

**Files**: `src/app/admin/orders/page.tsx`, `[id]/page.tsx`

- **List view**: All orders with filters by status, search by order number/customer
- **Detail view**: Full order details including:
  - Customer info and shipping address
  - Item details (car type, tint, windows, sqft, prices)
  - Pricing breakdown
  - Payment status
  - Status management (dropdown to change status)
  - Notes (add admin notes to order)
  - Order timeline

Status transitions: `pending` -> `confirmed` -> `processing` -> `shipped` -> `delivered` (or `cancelled` at any stage)

API: `GET /api/admin/orders`, `GET/PUT /api/admin/orders/[id]`

### Users (`/admin/users`)

**Files**: `src/app/admin/users/page.tsx`, `[id]/page.tsx`

- **List view**: All registered users with search, filter by status
- **Detail view**: User profile, order history, account status
- **Ban/Activate**: Toggle user status between `active` and `banned`
- Banned users cannot log in

API: `GET /api/admin/users`, `GET/PUT /api/admin/users/[id]`

### Settings (`/admin/settings`)

**File**: `src/app/admin/settings/page.tsx`

- Site name and description
- Contact email and phone
- **Integration status indicators**:
  - Stripe: Shows if `STRIPE_SECRET_KEY` is configured
  - Shippo: Shows if `SHIPPO_API_KEY` is configured
  - SMTP: Shows if `SMTP_USER` and `SMTP_PASS` are configured
- Shipping markup (amount + type)
- Shippo from-address configuration
- Test email button (sends to admin email)

API: `GET/PUT /api/admin/settings`

### Content Management

#### Homepage (`/admin/content/homepage`)

Edit all homepage sections:
- Hero: title, subtitle, CTA button text, background image
- Benefits: icon, title, description, stat for each card
- How It Works: 4 steps with titles and descriptions
- Stats: counter values and labels
- Testimonials: name, car, quote, rating, avatar
- CTA section: title, subtitle, button text, badges

API: `GET/PUT /api/admin/content/homepage`

#### FAQ (`/admin/content/faq`)

- Add, edit, delete, reorder FAQ items
- Each item has localized question and answer
- Toggle active/inactive

API: `GET/POST /api/admin/content/faq`, `PUT/DELETE /api/admin/content/faq/[id]`

#### About (`/admin/content/about`)

Edit the about page content:
- Company story, mission statement
- Values (icon, title, description)
- Stats (value, label, icon)
- Team members (name, role, bio, image)

API: `GET/PUT /api/admin/content/about`

#### Contact (`/admin/content/contact`)

Edit contact page info:
- Email, phone
- Business hours
- Service regions
- Contact form subject options

API: `GET/PUT /api/admin/content/contact`
