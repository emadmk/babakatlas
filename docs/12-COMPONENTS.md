# 12 - Components

## Reusable Components

### Navbar (`src/components/Navbar.tsx`)

The main site navigation bar. Features:

- **Logo**: "Atlas" (white) + "Adaptive" (blue), links to homepage
- **Desktop nav links**: Home, Configurator, About, FAQ, Contact (translated via `t()`)
- **Language toggle**: Globe icon, switches between EN and TL
- **Cart badge**: ShoppingCart icon with count of configured windows from `configuratorStore`
- **User dropdown**: When logged in, shows avatar initial, name, and dropdown with:
  - Dashboard link
  - Admin Panel link (only if role === "admin")
  - Sign Out button
- **Login button**: When not logged in, shows "Login" button
- **Mobile hamburger**: Slide-down mobile menu with all links
- **Scroll behavior**: Transparent at top, gains `bg-black/70 backdrop-blur-2xl` on scroll
- **Animation**: Framer Motion slide-in from top on mount

### Footer (`src/components/Footer.tsx`)

Four-column footer layout:

1. **Brand column** (2-col wide):
   - Logo
   - Description text
   - Newsletter signup form (email input + send button)
   - Shipping badge: "Shipping to Philippines & Australia"

2. **Company column**: About, Technology, Careers, Contact
3. **Products column**: All Tint Films, Ceramic, Carbon, Adaptive
4. **Support column**: FAQ, Shipping Info, Installation, Track Order

Bottom bar: Copyright, Terms of Service, Privacy Policy, social icons, email link.

### ConditionalLayout (`src/components/ConditionalLayout.tsx`)

Simple wrapper that checks `usePathname()`:
- Hides Navbar + Footer on `/admin/*` and `/auth/*`
- Shows them on all other routes

### LanguageSwitcher (`src/components/LanguageSwitcher.tsx`)

Dropdown component for language selection:
- Shows current language flag and name
- Dropdown lists all available locales with flags
- Active language has a green checkmark
- Uses Framer Motion for open/close animation
- Closes on click outside or Escape key

### AuthGuard (`src/components/auth/AuthGuard.tsx`)

Route protection wrapper:
- Shows loading spinner while session is being fetched
- Redirects to `/auth/login` if unauthenticated
- Renders children if authenticated
- Accepts optional `fallback` prop for custom loading state

### Providers (`src/components/Providers.tsx`)

Wraps the app in NextAuth's `SessionProvider`:

```tsx
export default function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

Used in root layout to provide session context to all pages.

### ImageUploader (`src/components/admin/ImageUploader.tsx`)

Admin component for image management:

- **Two modes**: Upload File / Enter URL (toggled with tabs)
- **Upload mode**:
  - Drag-and-drop zone
  - Click to select file
  - Validates file type (JPG, PNG, WebP) and size (max 5MB)
  - Uploads to `POST /api/admin/upload`
  - Shows loading spinner during upload
- **URL mode**:
  - Text input for external URL
  - "Set" button to apply
- **Preview**: Shows current image with remove (X) button
- **Error display**: Red text below the component

## Configurator Components

### CarTypeSelector (`src/components/configurator/CarTypeSelector.tsx`)

- Fetches car types from `GET /api/products/cars`
- Grid of cards, each showing:
  - Car image (from Unsplash or admin uploads)
  - Car type name (localized)
  - Window count
- Selected car has blue border/highlight
- Click handler calls `setCarType(slug)` and advances to step 2

### WindowTintConfigurator (`src/components/configurator/WindowTintConfigurator.tsx`)

The most complex component. Two view modes:

**List View**:
- Table rows for each window position
- Columns: checkbox, label, tint type dropdown, shade dropdown, sqft, price
- Quick Apply controls at top:
  - Tint type selector
  - Shade selector
  - "Apply to All" button
  - Group buttons (Front, Rear, Sides)
- Per-window pricing updates in real-time

**Visual View**:
- SVG diagram of a car
- Clickable window regions
- Color-coded by selected tint type
- Tooltip on hover showing window details

Features shared by both views:
- Fetches tint products from API (with shades and multipliers)
- Shows tint type specs (VLT, UV block, heat rejection, price)
- Shade selection with VLT indicator
- Real-time price calculation

### ServiceSelector (`src/components/configurator/ServiceSelector.tsx`)

- Fetches services from `GET /api/config/services`
- Two cards:
  1. **Shipping Only**: Icon, description, feature list
  2. **Professional Installation**: Icon, description, feature list
- Selected service has blue border
- Shows estimated cost for each option

### ShippingSelector (`src/components/configurator/ShippingSelector.tsx`)

- Country selection (PH / AU) with flag emojis
- Address form:
  - Full name
  - Street address
  - City
  - State/Province
  - Postal code
  - Country (auto-filled from selection)
- Delivery time estimate
- Shipping cost display (or "Free Shipping" badge)
- Free shipping threshold indicator

### OrderSummary (`src/components/configurator/OrderSummary.tsx`)

- Line items for each enabled window:
  - Window name, tint type, shade, sqft, price
- Pricing breakdown:
  - Subtotal
  - Shipping (or "Free")
  - Installation (if applicable)
  - Tax (with label: "VAT 12%" or "GST 10%")
  - **Total** (highlighted)
- "Proceed to Checkout" button -> navigates to `/checkout`
- "Reset Configuration" option

### StepIndicator (`src/components/configurator/StepIndicator.tsx`)

Visual step progress bar:
- 5 steps shown horizontally
- Each step: number circle + label
- States: completed (checkmark, green), active (blue), upcoming (gray)
- Connecting lines between steps
- Responsive: collapses labels on mobile
