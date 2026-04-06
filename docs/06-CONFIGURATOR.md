# 06 - Configurator

## Overview

The configurator is a 6-step wizard at `/configurator` that guides customers through selecting window tint for their vehicle. It is the core e-commerce flow of the application. Pricing is **package-based** (by meters of film used for a coverage level) rather than per-window.

**File**: `src/app/configurator/page.tsx`

## 6-Step Flow

### Step 1: Country Selection

**Component**: `src/components/configurator/CountrySelector.tsx`

- Displays country options as cards: Philippines (PHP) and Australia (AUD)
- Each card shows: flag, country name, currency code, currency symbol, description
- Sets the currency context for the rest of the configurator

### Step 2: Vehicle Type Selection

**Component**: `src/components/configurator/CarTypeSelector.tsx`

- Fetches car types from `GET /api/products/cars`
- Displays car types as cards with images (from Unsplash or admin uploads)
- Each card shows: car name, vehicle details
- User clicks to select; the store is updated with `setCarType(slug)`

### Step 3: Tint & Package Selection

**Component**: `src/components/configurator/WindowTintConfigurator.tsx`

This step now combines tint product selection with package (coverage) selection:

- **Category selection**: Choose between tint categories (e.g., nano-ceramic, adaptive)
- **Product selection**: Choose a specific tint product within the category (e.g., a specific VLT level)
- **Package selection**: Choose a coverage package (e.g., full wrap, partial coverage)
  - Packages define how many meters of film are used per vehicle size group
  - Pricing is calculated from `metersUsed * pricePerMeter` for the selected product
  - Packages are fetched from `GET /api/products/packages`

There is no per-window pricing. The price is determined by the product's per-meter rate and the package's meter usage for the selected vehicle's size group.

### Step 4: Service Type

**Component**: `src/components/configurator/ServiceSelector.tsx`

- Fetches services from `GET /api/config/services`
- Two options:
  1. **Shipping Only**: Pre-cut films shipped to customer's address
  2. **Professional Installation (Home Service)**: Films installed by certified technicians at customer's location
- Each option shows: name, description, feature bullets
- Feature data is localized (en/tl)

### Step 5: Details (Shipping or Appointment)

This step renders different components based on the service type selected in Step 4:

#### If Shipping: Shipping Address

**Component**: `src/components/configurator/ShippingSelector.tsx`

- Country auto-set from Step 1
- Address form fields: name, street, city, state, postal code
- Shows shipping rate based on admin-configured values
- Free shipping indicator when subtotal exceeds threshold
- Delivery time estimate

#### If Installation: Appointment Booking

**Component**: `src/components/configurator/AppointmentBooking.tsx`

- **Address collection**: Street, city, state/region (PH regions or AU states)
- **Calendar view**: Interactive monthly calendar showing available dates
  - Fetches availability from `GET /api/appointments/available?country=XX&month=M&year=Y`
  - Days color-coded by availability (available, limited, full, past/blocked)
  - Holidays and admin-blocked dates shown as unavailable
- **Time slot selection**: Morning or afternoon slot for the selected date
  - Shows available vs total capacity per slot
  - Slots can be individually enabled/disabled by admin
- **Minimum advance booking**: Configurable per-country (e.g., 24 hours in advance)

### Step 6: Order Summary

**Component**: `src/components/configurator/OrderSummary.tsx`

- Complete pricing breakdown:
  - Selected tint product and package
  - Meters of film used
  - Subtotal (product price based on package meters)
  - Shipping cost (or "Free" if above threshold), or appointment details if installation
  - Tax (VAT 12% for PH, GST 10% for AU)
  - **Total**
- Checkout button -> navigates to `/checkout`
- Note: Installation cost is handled separately through the charges system, not included in the checkout total

### Step Indicator

**Component**: `src/components/configurator/StepIndicator.tsx`

Visual step progress bar showing all 6 steps with active/completed/upcoming states.

## Zustand Store

**File**: `src/store/configuratorStore.ts`

### State

```typescript
interface ConfiguratorState {
  step: number;                          // Current step (1-6)
  country: 'PH' | 'AU' | null;          // Selected country (Step 1)
  carType: string | null;                // Selected car type slug (Step 2)

  // Package-based selection (Step 3)
  selectedCategory: string | null;       // "nano-ceramic" | "adaptive"
  selectedProduct: string | null;        // product slug e.g. "nano-ceramic-35"
  selectedPackage: string | null;        // package id e.g. "pkg-full-wrap"
  comboProduct: string | null;           // for combo packages, the ceramic product slug

  // Legacy: kept for backward compat
  windows: WindowConfig[];

  serviceType: 'shipping' | 'installation' | null;
  shippingCountry: 'PH' | 'AU' | null;

  // Appointment booking data
  appointment: AppointmentData | null;

  // Computed pricing
  totalSqft: number;
  subtotal: number;
  metersUsed: number;
  shippingCost: number;
  installationCost: number;
  tax: number;
  total: number;

  // Config loaded from API
  configLoaded: boolean;
  configLoading: boolean;
  shippingRates: ShippingRateData[];
  installationRates: InstallationRateData[];
  tintProducts: TintProductData[];
  tintPackages: TintPackageData[];
  carTypes: CarTypeData[];
  taxRates: Record<string, number>;
  freeShippingThresholds: Record<string, number>;
  shippingMarkup: number;
  shippingMarkupType: 'flat' | 'percentage';

  // Shipping address
  shippingAddress: ShippingAddress;
}
```

### AppointmentData

```typescript
interface AppointmentData {
  date: string | null;          // ISO date string e.g. "2026-04-15"
  slot: 'morning' | 'afternoon' | null;
  address: string;
  city: string;
  state: string;
  zip: string;
}
```

### TintPackageData

```typescript
interface TintPackageData {
  id: string;
  name: { en: string; tl: string };
  description: { en: string; tl: string };
  coverage: string;                       // e.g., "full-wrap", "sides-only"
  metersUsed: Record<string, number>;     // meters per vehicle size group
  applicableTintTypes: string[];
  order: number;
  active: boolean;
}
```

### Key Actions

| Action | Description |
|--------|-------------|
| `loadConfig()` | Fetches pricing config, tint products, packages, and car types. Sets all config state. |
| `setCountry(country)` | Select PH or AU (Step 1) |
| `setCarType(slug)` | Selects car type (Step 2) |
| `setSelectedCategory(cat)` | Choose tint category (nano-ceramic/adaptive) |
| `setSelectedProduct(slug)` | Choose specific tint product |
| `setSelectedPackage(pkgId)` | Choose coverage package |
| `setComboProduct(slug)` | Set the ceramic product for combo packages |
| `setServiceType(type)` | Select shipping or installation (Step 4) |
| `setAppointment(data)` | Set appointment booking details (Step 5, installation) |
| `setShippingAddress(addr)` | Set shipping address fields (Step 5, shipping) |
| `calculatePricing()` | Recalculates all pricing based on current state |
| `reset()` | Reset to initial state (preserves loaded config) |

### `loadConfig()` Flow

```
1. Fetch /api/config/pricing   --> { shipping rates, installation rates, tax rates, markup }
2. Fetch /api/products/tints   --> { tint products with per-meter prices }
3. Fetch /api/products/packages --> { coverage packages with meter usage }
4. Fetch /api/products/cars    --> { car types with size groups }
5. Merge into store state
6. Recalculate pricing with new config values
```

Called once when the configurator page mounts. Skipped if already loaded.

### `calculatePricing()` Flow

```
1. Look up selected product's pricePerMeter
2. Look up selected package's metersUsed for the vehicle's sizeGroup
3. Subtotal = metersUsed * pricePerMeter
4. Calculate shipping (if service type is shipping):
   a. Check if subtotal >= free shipping threshold for country
   b. If not free: baseRate + totalSqft * perSqftRate
   c. Apply markup (flat or percentage)
5. Installation cost is NOT included in checkout total
   (handled separately through the charges system)
6. Calculate tax: subtotal * taxRate
7. Total = subtotal + shipping + tax
```

## Static Data (Legacy)

The store exports static lookup data kept for backward compatibility. The configurator no longer uses per-window pricing:

- `TINT_TYPES` - Legacy tint type definitions (pricePerSqft set to 0)
- `SHADE_LEVELS` - Legacy shade definitions
- `WINDOW_SQFT` - Empty (no longer used)
- `WINDOW_LABELS` - Human-readable window position names
- `WINDOW_GROUPS` - Front/Rear/Sides groupings
- `SHIPPING_INFO` - Default shipping info per country
