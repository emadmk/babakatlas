# 08 - Shipping

## Architecture

The shipping system has three layers:

1. **Admin-configurable manual rates** (primary, always available)
2. **Shippo API integration** (optional, for real carrier rates)
3. **Shipping markup** (admin-controlled, hidden from customer)

## Manual Shipping Rates

Configured in the admin panel at `/admin/shipping` and stored in `adminData.ts`.

### Rate Structure

```typescript
interface ShippingRateConfig {
  id: string;
  country: string;                    // "PH" or "AU"
  countryName: { en: string; tl: string };
  flag: string;
  baseRate: number;                   // Base cost in USD
  perSqftRate: number;               // Additional cost per square foot
  freeAbove: number;                 // Free shipping threshold
  deliveryDays: { min: number; max: number };
  active: boolean;
}
```

### Default Rates

| Country | Base Rate | Per Sqft | Free Above | Delivery |
|---------|-----------|----------|------------|----------|
| Philippines (PH) | $15 | $2/sqft | $200 | 7-14 business days |
| Australia (AU) | $25 | $3/sqft | $300 | 5-10 business days |

### Calculation Formula

```
if subtotal >= freeAbove:
  shippingCost = 0
else:
  shippingCost = baseRate + (totalSqft * perSqftRate)
  shippingCost += markup
```

## Shippo Integration

**File**: `src/lib/shippo.ts`

When `SHIPPO_API_KEY` is set, the system can query Shippo's API for real carrier rates.

### Rate Lookup

```typescript
export async function getShippingRates(params: {
  fromAddress: { name, street1, city, state, zip, country };
  toAddress: { name, street1, city, state, zip, country };
  parcel: { length, width, height, weight, mass_unit, distance_unit };
}): Promise<Rate[] | null>
```

1. Creates a shipment object via `POST https://api.goshippo.com/shipments`
2. Returns array of carrier rates (USPS, FedEx, DHL, etc.)
3. Returns `null` if API key is not configured

### Label Creation

```typescript
export async function createShippingLabel(rateId: string): Promise<Transaction>
```

Creates a shipping label for a selected rate. Returns label PDF URL and tracking number.

### From Address

The origin address for Shippo shipments is configured in site settings:

```typescript
shippoFromAddress: {
  name: 'AtlasAdaptive',
  street1: '123 Main Street',
  city: 'Manila',
  state: 'Metro Manila',
  zip: '1000',
  country: 'PH',
}
```

Editable via `/admin/settings`.

## Shipping Markup

Admin can add a hidden markup on top of calculated shipping costs:

| Setting | Description |
|---------|-------------|
| `shippingMarkup` | The markup value (number) |
| `shippingMarkupType` | `flat` (add fixed amount) or `percentage` (add % of shipping cost) |

### Example

If calculated shipping = $25 and markup is 20% (`percentage`):
```
finalShipping = 25 * (1 + 20/100) = $30
```

If markup is $5 (`flat`):
```
finalShipping = 25 + 5 = $30
```

The markup is applied in both:
- `pricingServer.ts` (server-side, for order creation)
- `configuratorStore.ts` (client-side, for real-time pricing display)

The customer sees only the final price; the markup is not itemized.

## Free Shipping Thresholds

Per-country thresholds are configurable:

- PH: Free shipping on orders over $200 (default)
- AU: Free shipping on orders over $300 (default)

When `subtotal >= freeAbove`, shipping cost is $0 regardless of other calculations.

## Installation Rates

For the "Professional Installation" service type, rates replace shipping costs.

### Rate Structure

```typescript
interface InstallationRateConfig {
  id: string;
  country: string;       // "PH" or "AU"
  carType: string;        // "SEDAN", "SUV", "VAN", etc.
  baseRate: number;
  perWindowRate: number;
  active: boolean;
}
```

### Calculation

```
installationCost = baseRate + (enabledWindowCount * perWindowRate)
```

### Default Installation Rates (PH)

| Car Type | Base Rate | Per Window |
|----------|-----------|------------|
| Sedan | $50 | $8 |
| SUV | $65 | $10 |
| Van | $70 | $10 |
| Hatchback | $45 | $8 |
| Coupe | $45 | $8 |
| Truck | $60 | $9 |

Australian rates are approximately 50-80% higher.

## Address Collection

The `ShippingSelector` component collects:

- Full name
- Street address (street1)
- City
- State/Province
- Postal/ZIP code
- Country (auto-set from country selection)

This data is stored in the configurator store's `shippingAddress` field and passed to the order creation API.

## Shipping Rate Calculation API

**Endpoint**: `POST /api/shipping/calculate`  
**File**: `src/app/api/shipping/calculate/route.ts`

### Request

```json
{
  "country": "PH",
  "sqft": 38,
  "subtotal": 304,
  "serviceType": "shipping",
  "carType": "sedan",
  "windowCount": 6
}
```

### Response

```json
{
  "success": true,
  "data": {
    "country": "PH",
    "countryName": "Philippines",
    "deliveryTime": "7-14 business days",
    "shippingCost": 0,
    "shippingFormatted": "PHP 0.00",
    "installationCost": 0,
    "freeShipping": true,
    "freeShippingThreshold": 200,
    "freeShippingThresholdFormatted": "PHP 200.00"
  }
}
```

## Shipping Rates API (Public)

**Endpoint**: `GET /api/shipping/rates`  
**File**: `src/app/api/shipping/rates/route.ts`

Returns all active shipping rates for display on the shipping info page.
