# 01 - Project Overview

## Project Name

**AtlasAdaptive** (package name: `babakatlas`)

## Purpose

AtlasAdaptive is an e-commerce platform for selling and configuring automotive window tint films. Customers can use an interactive 6-step configurator to select their country (PHP/AUD), choose their vehicle type, pick a tint product and coverage package, select shipping or professional installation (with appointment booking), and complete checkout with Stripe payment processing. The platform also includes an appointment scheduling system for home service installations and a charges system for tracking installation-related payments.

## Target Markets

| Market | Country Code | Currency | Tax |
|--------|-------------|----------|-----|
| Philippines | PH | PHP | VAT 12% |
| Australia | AU | AUD | GST 10% |

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 14.2.35 | Full-stack React framework (App Router) |
| React | ^18 | UI library |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | ^3.4.1 | Utility-first CSS |
| Framer Motion | ^12.38.0 | Animations |
| Zustand | ^5.0.12 | Client-side state management |
| NextAuth.js | ^4.24.13 | Authentication (Credentials + Google OAuth) |
| Stripe | ^22.0.0 | Payment processing |
| Nodemailer | ^7.0.13 | Email delivery (SMTP/Gmail) |
| Prisma | ^5.22.0 | ORM (PostgreSQL schema, currently file-based store) |
| Lucide React | ^1.7.0 | Icon library |
| React Query | ^5.96.2 | Server state (available, lightly used) |
| class-variance-authority | ^0.7.1 | Component variant utilities |
| clsx / tailwind-merge | - | Class name utilities |

## Architecture Overview

### Next.js App Router

The project uses Next.js 14 with the **App Router** (`src/app/` directory). All pages are file-based routes. API routes are defined under `src/app/api/`.

### File-Based Data Store (Primary)

Instead of using a database for runtime data, the project uses a **centralized in-memory data store** (`src/lib/adminData.ts`) that persists to `data/store.json` on disk. This store holds all products, car types, window configs, shipping rates, installation rates, orders, users, FAQ, about content, contact info, homepage content, and site settings.

### Prisma / PostgreSQL (Secondary)

A full Prisma schema exists at `prisma/schema.prisma` for PostgreSQL. It mirrors the data structures but is **not currently used at runtime**. It is intended for future production migration. Seed scripts are available at `prisma/seed.js`.

### Client State

Zustand stores manage client-side state:
- `configuratorStore` - The main tint configurator state machine (6-step, package-based pricing, appointment booking)
- `cartStore` - Generic cart (currently unused, persisted to localStorage)
- `authStore` - User authentication state
- `adminStore` - Admin panel UI state

## Directory Structure

```
babakatlas/
+-- src/
|   +-- app/                        # Next.js App Router pages & API
|   |   +-- page.tsx                # Homepage
|   |   +-- layout.tsx              # Root layout (Providers, Language, ConditionalLayout)
|   |   +-- globals.css             # Global styles, glass morphism, gradients
|   |   +-- admin/                  # Admin panel (protected, sidebar layout)
|   |   |   +-- layout.tsx          # Admin layout with sidebar, auth check
|   |   |   +-- page.tsx            # Admin dashboard
|   |   |   +-- products/           # Tint product CRUD
|   |   |   +-- packages/           # Tint package management
|   |   |   +-- cars/               # Car type CRUD
|   |   |   +-- windows/            # Window config management
|   |   |   +-- services/           # Service config
|   |   |   +-- shipping/           # Shipping & installation rates
|   |   |   +-- pricing/            # Pricing configuration
|   |   |   +-- orders/             # Order management
|   |   |   +-- appointments/       # Appointment scheduling management
|   |   |   +-- charges/            # Installation charges management
|   |   |   +-- users/              # User management
|   |   |   +-- settings/           # Site settings
|   |   |   +-- content/            # CMS (homepage, FAQ, about, contact)
|   |   +-- api/                    # API routes
|   |   |   +-- auth/               # NextAuth, register, forgot-password
|   |   |   +-- admin/              # Admin CRUD APIs
|   |   |   +-- orders/             # Order creation & retrieval
|   |   |   +-- checkout/           # Stripe checkout session
|   |   |   +-- webhooks/           # Stripe webhook handler
|   |   |   +-- appointments/       # Appointment booking & availability
|   |   |   +-- products/           # Public product endpoints (tints, cars, packages)
|   |   |   +-- config/             # Public config (pricing, services, shipping, windows)
|   |   |   +-- content/            # Public content (homepage, FAQ, about, contact)
|   |   |   +-- shipping/           # Shipping rate calculation
|   |   |   +-- user/               # User orders, profile, charges, appointments
|   |   |   +-- email/              # Test email
|   |   |   +-- contact/            # Contact form submission
|   |   +-- auth/                   # Auth pages (login, register, forgot-password)
|   |   +-- dashboard/              # User dashboard (orders, profile)
|   |   +-- configurator/           # 6-step tint configurator
|   |   +-- checkout/               # Checkout + success page
|   |   +-- about/                  # About page
|   |   +-- faq/                    # FAQ page
|   |   +-- contact/                # Contact page
|   |   +-- shipping/               # Shipping info page
|   |   +-- terms/                  # Terms of service
|   |   +-- privacy/                # Privacy policy
|   +-- components/                 # Reusable React components
|   |   +-- Navbar.tsx              # Main navigation bar
|   |   +-- Footer.tsx              # Site footer
|   |   +-- ConditionalLayout.tsx   # Show/hide nav on admin/auth pages
|   |   +-- Providers.tsx           # NextAuth SessionProvider
|   |   +-- LanguageSwitcher.tsx    # Language dropdown
|   |   +-- admin/                  # Admin-specific components
|   |   |   +-- ImageUploader.tsx   # Drag-drop / URL image uploader
|   |   +-- auth/                   # Auth components
|   |   |   +-- AuthGuard.tsx       # Route protection wrapper
|   |   +-- configurator/           # Configurator step components
|   |       +-- CountrySelector.tsx
|   |       +-- CarTypeSelector.tsx
|   |       +-- WindowTintConfigurator.tsx
|   |       +-- ServiceSelector.tsx
|   |       +-- ShippingSelector.tsx
|   |       +-- AppointmentBooking.tsx
|   |       +-- OrderSummary.tsx
|   |       +-- StepIndicator.tsx
|   +-- context/
|   |   +-- LanguageContext.tsx      # i18n provider & useLanguage hook
|   +-- lib/                        # Core business logic
|   |   +-- adminData.ts            # Centralized data store (SINGLE SOURCE OF TRUTH)
|   |   +-- auth.ts                 # NextAuth configuration
|   |   +-- email.ts                # Email templates & send functions
|   |   +-- i18n.ts                 # Internationalization utilities
|   |   +-- ordersStore.ts          # In-memory orders Map
|   |   +-- pricing.ts              # Client-side pricing calculations
|   |   +-- pricingServer.ts        # Server-side pricing (reads from adminData)
|   |   +-- shippo.ts               # Shippo shipping API integration
|   |   +-- stripe.ts               # Stripe payment integration
|   +-- store/                      # Zustand stores
|   |   +-- configuratorStore.ts    # Main configurator state
|   |   +-- cartStore.ts            # Generic cart (unused)
|   |   +-- authStore.ts            # Auth state
|   |   +-- adminStore.ts           # Admin panel state
|   +-- locales/                    # Translation files
|   |   +-- en.json                 # English translations
|   |   +-- tl.json                 # Tagalog translations
|   +-- types/
|       +-- next-auth.d.ts          # NextAuth type augmentation
+-- prisma/
|   +-- schema.prisma               # PostgreSQL schema
|   +-- seed.ts                     # TypeScript seed (reference)
|   +-- seed.js                     # JavaScript seed (used by npm script)
+-- public/                         # Static assets & uploaded images
+-- data/                           # Runtime data persistence
|   +-- store.json                  # File-based data store (auto-generated)
+-- package.json
+-- next.config.mjs
+-- tailwind.config.ts
+-- tsconfig.json
+-- postcss.config.mjs
```

## Key Design Decisions

1. **File-based data store over database for MVP**: The project uses `data/store.json` for persistence rather than PostgreSQL. This simplifies deployment (no DB server needed) and allows rapid iteration. The Prisma schema is maintained for future migration.

2. **Centralized `adminData.ts`**: All data reads/writes funnel through a single module. This makes it trivial to swap the storage backend later.

3. **Dual pricing modules**: `pricing.ts` (client-safe, uses hardcoded defaults) and `pricingServer.ts` (reads from admin config). The configurator store fetches server config via API to override client defaults.

4. **Admin-configurable everything**: Products, packages, car types, windows, services, shipping rates, installation rates, tax rates, appointments, charges, homepage content, FAQ, about page, and contact info are all editable through the admin panel.

5. **Apple-inspired dark theme**: The UI uses a dark theme with glassmorphism effects, subtle gradients, and Framer Motion animations following Apple's design language.

6. **Bilingual support (EN/TL)**: All user-facing content supports English and Tagalog via a custom i18n system with JSON translation files and a React context provider.

7. **Package-based pricing**: The configurator uses a package-based pricing model (e.g., full wrap, partial coverage) with prices calculated from meters of tint film used, rather than per-window/per-sqft pricing.

8. **Appointment scheduling**: Home service installations include a built-in appointment booking system with calendar availability, morning/afternoon slots, and per-country configuration.

9. **Charges system**: Installation-related charges are tracked separately, allowing admin to manage payments for home service appointments.
