# 06 - Configurator

## Overview

The configurator is a 5-step wizard at `/configurator` that guides customers through selecting window tint for their vehicle. It is the core e-commerce flow of the application.

**File**: `src/app/configurator/page.tsx`

## 5-Step Flow

### Step 1: Car Type Selection

**Component**: `src/components/configurator/CarTypeSelector.tsx`

- Fetches car types from `GET /api/products/cars`
- Displays car types as cards with images (from Unsplash or admin uploads)
- Each card shows: car name, window count
- User clicks to select; the store is updated with `setCarType(slug)`
- `setCarType()` initializes windows with default tint (ceramic) and shade (medium)

### Step 2: Windows & Tint Selection

**Component**: `src/components/configurator/WindowTintConfigurator.tsx`

The most complex step. Two view modes:

#### List View
- Each window is a row with: checkbox (enable/disable), label, tint dropdown, shade dropdown, sqft, price
- Users can toggle individual windows on/off
- Each window can have a different tint type and shade

#### Visual View
- SVG car diagram showing window positions
- Click windows to select/deselect
- Color-coded by tint type

#### Quick Apply Groups
Three preset groups for bulk application:
- **Front Windows**: front_windshield, front_left, front_right
- **Rear Windows**: rear_windshield, rear_left, rear_right, rear_quarter_left, rear_quarter_right
- **Side Windows**: front_left, front_right, rear_left, rear_right, rear_quarter_left, rear_quarter_right

Users select a tint + shade and click a group button to apply to all windows in that group.

#### Shade Price Multipliers
Each shade level has a price multiplier:
- Light (VLT 70): 1.0x (base price)
- Medium (VLT 35): 1.0x
- Dark (VLT 15): 1.1x (10% markup)
- Limo (VLT 5): 1.2x (20% markup)

The actual multipliers come from the product's `shades` array (configurable in admin).

### Step 3: Service Type

**Component**: `src/components/configurator/ServiceSelector.tsx`

- Fetches services from `GET /api/config/services`
- Two options:
  1. **Shipping Only**: Pre-cut films shipped to customer's address
  2. **Professional Installation**: Films installed by certified technicians
- Each option shows: name, description, feature bullets
- Feature data is localized (en/tl)

### Step 4: Shipping / Address

**Component**: `src/components/configurator/ShippingSelector.tsx`

- Country selection (Philippines or Australia)
- Address form fields: name, street, city, state, postal code
- Shows shipping rate or installation rate based on service type
- Free shipping indicator when subtotal exceeds threshold
- Delivery time estimate
- Rate calculation uses admin-configured values

### Step 5: Order Summary

**Component**: `src/components/configurator/OrderSummary.tsx`

- Complete pricing breakdown:
  - Per-window line items (tint type, shade, sqft, price)
  - Subtotal
  - Shipping cost (or "Free" if above threshold)
  - Installation cost (if applicable)
  - Tax (VAT 12% for PH, GST 10% for AU)
  - **Total**
- Checkout button -> navigates to `/checkout`

### Step Indicator

**Component**: `src/components/configurator/StepIndicator.tsx`

Visual step progress bar showing all 5 steps with active/completed/upcoming states.

## Zustand Store

**File**: `src/store/configuratorStore.ts`

### State

```typescript
interface ConfiguratorState {
  step: number;                          // Current step (1-5)
  carType: string | null;                // Selected car type slug
  windows: WindowConfig[];               // Per-window configuration
  serviceType: 'shipping' | 'installation' | null;
  shippingCountry: 'PH' | 'AU' | null;

  // Computed pricing
  totalSqft: number;
  subtotal: number;
  shippingCost: number;
  installationCost: number;
  tax: number;
  total: number;

  // Config from API
  configLoaded: boolean;
  configLoading: boolean;
  shippingRates: ShippingRateData[];
  installationRates: InstallationRateData[];
  tintProducts: TintProductData[];
  taxRates: Record<string, number>;
  freeShippingThresholds: Record<string, number>;
  shippingMarkup: number;
  shippingMarkupType: 'flat' | 'percentage';

  // Shipping address
  shippingAddress: ShippingAddress;
}
```

### WindowConfig (per window)

```typescript
interface WindowConfig {
  position: string;       // e.g., "front_left"
  label: string;          // e.g., "Front Left"
  enabled: boolean;       // Whether this window is included
  tintType: string;       // Selected tint type slug
  shade: string;          // Selected shade level
  shadeMultiplier: number; // Price multiplier for shade
  sqft: number;           // Square footage
  pricePerSqft: number;   // Price per sqft for selected tint
  price: number;          // sqft * pricePerSqft * shadeMultiplier
}
```

### Key Actions

| Action | Description |
|--------|-------------|
| `loadConfig()` | Fetches pricing config from `/api/config/pricing` and tint products from `/api/products/tints`. Sets shipping rates, installation rates, tax rates, etc. |
| `setCarType(slug)` | Selects car type, builds windows array with defaults |
| `toggleWindow(pos)` | Enable/disable a specific window |
| `setWindowTint(pos, type)` | Change tint type for one window |
| `setWindowShade(pos, shade)` | Change shade for one window |
| `setWindowShadeWithMultiplier(pos, shade, mult)` | Change shade with explicit multiplier |
| `applyToAll(tint, shade)` | Apply tint + shade to all windows |
| `applyToGroup(group, tint, shade)` | Apply to front/rear/sides group |
| `setServiceType(type)` | Select shipping or installation |
| `setShippingCountry(country)` | Select PH or AU |
| `calculatePricing()` | Recalculates all pricing based on current state |
| `reset()` | Reset to initial state (preserves loaded config) |

### `loadConfig()` Flow

```
1. Fetch /api/config/pricing  --> { shipping rates, installation rates, tax rates, markup }
2. Fetch /api/products/tints  --> { tint products with prices and shades }
3. Merge into store state
4. Recalculate pricing with new config values
```

Called once when the configurator page mounts. Skipped if already loaded.

### `calculatePricing()` Flow

```
1. Sum sqft and price of all enabled windows
2. Calculate shipping:
   a. Check if subtotal >= free shipping threshold for country
   b. If not free: baseRate + totalSqft * perSqftRate
   c. Apply markup (flat or percentage)
3. Calculate installation:
   a. Look up rate for country + carType
   b. baseRate + enabledWindowCount * perWindowRate
4. Calculate tax: (subtotal + installationCost) * taxRate
5. Total = subtotal + shipping + installation + tax
```

## Static Data

The store exports static lookup data used as fallbacks:

- `TINT_TYPES` - Default tint type definitions with prices
- `SHADE_LEVELS` - Shade definitions (Light/Medium/Dark/Limo)
- `WINDOW_SQFT` - Default sqft per window per car type
- `WINDOW_LABELS` - Human-readable window position names
- `WINDOW_GROUPS` - Front/Rear/Sides groupings
- `SHIPPING_INFO` - Default shipping info per country
