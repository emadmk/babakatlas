# 04 - Data Store

## Architecture

The application uses a **centralized in-memory data store** implemented in `src/lib/adminData.ts`. This single file is the **Single Source of Truth** for all application data.

### How It Works

1. On server startup, the module attempts to load `data/store.json` from disk
2. If the file exists and is valid JSON, its contents populate in-memory `Map` objects
3. If the file does not exist, seed data (hardcoded in the same file) is used
4. Every write operation (create, update, delete) immediately saves the full state back to `data/store.json`

### File Location

```
<project-root>/data/store.json
```

This file is auto-generated and should be in `.gitignore` for production. Deleting it resets all data to seed defaults on the next server restart.

### Persistence Functions

```typescript
// src/lib/adminData.ts

function loadFromFile(): StoreData | null {
  // Reads data/store.json, returns parsed data or null
}

function saveToFile(): void {
  // Serializes all in-memory Maps to JSON and writes to data/store.json
}
```

### StoreData Shape

```typescript
interface StoreData {
  products: TintProduct[];
  carTypes: CarTypeConfig[];
  windowConfigs: WindowConfig[];
  serviceConfigs: ServiceConfig[];
  shippingRates: ShippingRateConfig[];
  installationRates: InstallationRateConfig[];
  siteSettings: SiteSettings;
  faqItems: FaqItem[];
  aboutContent: AboutContent;
  contactInfo: ContactInfo;
  homepageContent: HomepageContent;
  adminOrders: AdminOrder[];
  adminUsers: AdminUser[];
}
```

## Data Types and Interfaces

### TintProduct

Represents a tint film product with localized names and configurable shades.

```typescript
interface TintProduct {
  id: string;                          // e.g., "prod-standard"
  slug: string;                        // e.g., "standard"
  name: { en: string; tl: string };    // Localized name
  description: { en: string; tl: string };
  tintType: string;                    // e.g., "standard", "ceramic", "carbon"
  vlt: string;                         // Visible Light Transmission, e.g., "35%"
  uvBlock: number;                     // UV block percentage, e.g., 99
  heatRejection: number;              // Heat rejection percentage, e.g., 60
  pricePerSqft: number;               // Base price per square foot
  imageUrl: string;                    // Product image URL
  badge: string | null;               // e.g., "Most Popular", "Premium"
  shades: TintShade[];                // Available shade levels
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TintShade {
  id: string;          // e.g., "light", "medium", "dark", "limo"
  name: string;        // Display name
  vlt: number;         // VLT for this shade, e.g., 70, 35, 15, 5
  priceMultiplier: number;  // 1.0 = no markup, 1.1 = 10% markup
}
```

**Seed products**: Standard ($3/sqft), Ceramic ($8, "Most Popular"), Carbon ($6), Adaptive ($12, "Premium"), Crystalline ($10), Metallic ($5)

**Default shades**: Light (VLT 70, 1.0x), Medium (VLT 35, 1.0x), Dark (VLT 15, 1.1x), Limo (VLT 5, 1.2x)

### CarTypeConfig

```typescript
interface CarTypeConfig {
  id: string;                          // e.g., "car-sedan"
  slug: string;                        // e.g., "sedan"
  name: { en: string; tl: string };
  type: string;                        // Enum: SEDAN, SUV, VAN, STATION_WAGON, etc.
  windowCount: number;                 // Number of windows
  imageUrl: string;                    // Car type image
  active: boolean;
}
```

**Seed types**: Sedan (6 windows), SUV (8), Van (8), Station Wagon (8), Hatchback (6), Coupe (6), Truck (6), Convertible (6)

### WindowConfig

```typescript
interface WindowConfig {
  id: string;                          // e.g., "win-sedan-front_windshield"
  carType: string;                     // e.g., "SEDAN"
  position: string;                    // e.g., "FRONT_WINDSHIELD"
  label: { en: string; tl: string };
  defaultSqft: number;                // Square footage for this window
  active: boolean;
}
```

Window positions: `FRONT_WINDSHIELD`, `REAR_WINDSHIELD`, `FRONT_LEFT`, `FRONT_RIGHT`, `REAR_LEFT`, `REAR_RIGHT`, `REAR_QUARTER_LEFT`, `REAR_QUARTER_RIGHT`, `SUNROOF`

### ServiceConfig

```typescript
interface ServiceConfig {
  id: string;
  slug: string;                        // "shipping_only" or "installation"
  name: { en: string; tl: string };
  description: { en: string; tl: string };
  features: { en: string[]; tl: string[] };  // Bullet points
  active: boolean;
}
```

### ShippingRateConfig

```typescript
interface ShippingRateConfig {
  id: string;
  country: string;                     // "PH" or "AU"
  countryName: { en: string; tl: string };
  flag: string;                        // Emoji flag
  baseRate: number;                    // Base shipping cost
  perSqftRate: number;                // Additional cost per sqft
  freeAbove: number;                  // Free shipping threshold
  deliveryDays: { min: number; max: number };
  active: boolean;
}
```

**Seed rates**: PH ($15 base, $2/sqft, free above $200, 7-14 days), AU ($25 base, $3/sqft, free above $300, 5-10 days)

### InstallationRateConfig

```typescript
interface InstallationRateConfig {
  id: string;
  country: string;
  carType: string;                     // e.g., "SEDAN"
  baseRate: number;                    // Base installation cost
  perWindowRate: number;              // Per-window surcharge
  active: boolean;
}
```

Rates are defined per country + car type combination (16 total: 8 car types x 2 countries).

### SiteSettings

```typescript
interface SiteSettings {
  siteName: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  taxRates: { PH: number; AU: number };          // e.g., { PH: 0.12, AU: 0.10 }
  currencies: { PH: string; AU: string };        // e.g., { PH: "PHP", AU: "AUD" }
  shippingMarkup: number;                        // Flat or percentage markup
  shippingMarkupType: 'flat' | 'percentage';
  shippoFromAddress: {                           // Origin address for Shippo
    name: string; street1: string; city: string;
    state: string; zip: string; country: string;
  };
}
```

### FaqItem

```typescript
interface FaqItem {
  id: string;
  question: { en: string; tl: string };
  answer: { en: string; tl: string };
  order: number;                       // Sort order
  active: boolean;
}
```

10 seed FAQ items covering window tinting legality, longevity, DIY vs professional, ceramic vs carbon differences, etc.

### AboutContent

```typescript
interface AboutContent {
  story: { en: string; tl: string };              // Company story text
  mission: { en: string; tl: string };
  values: Array<{
    icon: string;
    title: { en: string; tl: string };
    description: { en: string; tl: string };
  }>;
  stats: Array<{ value: string; label: { en: string; tl: string }; icon: string }>;
  team: Array<{
    name: string;
    role: { en: string; tl: string };
    bio: { en: string; tl: string };
    imageUrl: string;
  }>;
}
```

### ContactInfo

```typescript
interface ContactInfo {
  email: string;
  phone: string;
  businessHours: Array<{ day: { en: string; tl: string }; hours: string }>;
  regions: Array<{
    country: string; flag: string;
    name: { en: string; tl: string };
    detail: { en: string; tl: string };
  }>;
  subjects: Array<{ en: string; tl: string }>;   // Contact form subject options
}
```

### HomepageContent

```typescript
interface HomepageContent {
  hero: {
    title: { en: string; tl: string };
    subtitle: { en: string; tl: string };
    cta: { en: string; tl: string };
    backgroundImage: string;
  };
  benefits: Array<{ id: string; icon: string; title: {...}; description: {...}; stat: string }>;
  howItWorks: Array<{ step: number; title: {...}; description: {...}; icon: string }>;
  stats: Array<{ value: string; label: {...}; suffix: string }>;
  testimonials: Array<{ id: string; name: string; car: string; quote: {...}; rating: number; avatar: string }>;
  cta: { title: {...}; subtitle: {...}; button: {...}; badges: Array<{...}> };
}
```

### AdminOrder

```typescript
interface AdminOrder {
  id: string;
  orderNumber: string;                 // e.g., "TG-20260401-A1B2"
  userId: string | null;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  contact: { name: string; email: string; phone: string };
  shippingAddress: { address: string; city: string; postalCode: string; country: string };
  items: {
    carType: string; carModel: string | null;
    tintType: string; tintName: string;
    selectedWindows: string[]; totalSqft: number;
    unitPrice: number; subtotal: number;
  };
  serviceType: 'shipping' | 'installation';
  pricing: {
    subtotal: number; shipping: number; installation: number;
    taxLabel: string; tax: number; total: number;
  };
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  notes: string[];
  createdAt: string;
  updatedAt: string;
}
```

### AdminUser

```typescript
interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  status: 'active' | 'banned';
  joinedAt: string;
  lastActive: string;
  password?: string;                   // Plain text for demo, bcrypt in production
}
```

## CRUD Functions

Every data type has getter/setter functions exported from `adminData.ts`:

| Data Type | Get All | Get One | Create | Update | Delete |
|-----------|---------|---------|--------|--------|--------|
| TintProduct | `getProducts()` | `getProduct(id)` | `createProduct(data)` | `updateProduct(id, data)` | `deleteProduct(id)` |
| CarTypeConfig | `getCarTypes()` | `getCarType(id)` | `createCarType(data)` | `updateCarType(id, data)` | `deleteCarType(id)` |
| WindowConfig | `getWindowConfigs(carType?)` | `getWindowConfig(id)` | - | `updateWindowConfig(id, data)` | - |
| ServiceConfig | `getServiceConfigs()` | `getServiceConfig(id)` | - | `updateServiceConfig(id, data)` | - |
| ShippingRate | `getShippingRates()` | `getShippingRate(id)` | - | `updateShippingRate(id, data)` | - |
| InstallationRate | `getInstallationRates(country?, carType?)` | `getInstallationRate(id)` | - | `updateInstallationRate(id, data)` | - |
| SiteSettings | `getSiteSettings()` | - | - | `updateSiteSettings(data)` | - |
| FaqItem | `getFaqItems()` | `getFaqItem(id)` | `createFaqItem(data)` | `updateFaqItem(id, data)` | `deleteFaqItem(id)` |
| AboutContent | `getAboutContent()` | - | - | `updateAboutContent(data)` | - |
| ContactInfo | `getContactInfo()` | - | - | `updateContactInfo(data)` | - |
| HomepageContent | `getHomepageContent()` | - | - | `updateHomepageContent(data)` | - |
| AdminOrder | `getAdminOrders()` | `getAdminOrder(id)` | `createAdminOrder(data)` | `updateAdminOrder(id, data)` | - |
| AdminUser | `getAdminUsers()` | `getAdminUser(id)` | `createAdminUser(data)` | `updateAdminUser(id, data)` | - |

Additional helpers:
- `getAdminUserByEmail(email)` - Find user by email (used for login)
- `getAdminUserOrders(userId)` - Get orders for a specific user

## Data Flow

```
Admin Panel UI
    |
    v
Admin API Routes (POST/PUT/DELETE /api/admin/*)
    |
    v
adminData.ts CRUD functions
    |
    v
In-Memory Maps  <-->  data/store.json (disk)
    |
    v
Public API Routes (GET /api/config/*, /api/products/*, /api/content/*)
    |
    v
Frontend Components / Configurator Store
```

## Resetting Data

To reset all data to seed defaults:

```bash
rm data/store.json
# Then restart the server
```
