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

## Home Service (Professional Installation)

For the "Professional Installation" service type, the customer books an appointment for home service installation instead of receiving a shipment. Installation cost is handled separately through the **charges system** (see Admin Panel docs) and is **not** included in the checkout total.

### Appointment Booking Flow

When the customer selects "Professional Installation" in Step 4 of the configurator, Step 5 shows the `AppointmentBooking` component instead of `ShippingSelector`:

1. Customer enters their service address (street, city, state/region)
2. An interactive calendar shows available dates for the selected country
3. Customer selects a date and a time slot (morning or afternoon)
4. Availability is checked in real-time via `GET /api/appointments/available`

### Appointment Configuration (Admin)

Per-country appointment settings are managed at `/admin/appointments`:

| Setting | Description |
|---------|-------------|
| `morningSlots` | Number of morning appointment slots per day |
| `afternoonSlots` | Number of afternoon appointment slots per day |
| `morningTime` | Morning slot time label (e.g., "8:00 AM - 12:00 PM") |
| `afternoonTime` | Afternoon slot time label (e.g., "1:00 PM - 5:00 PM") |
| `morningEnabled` | Whether morning slots are available |
| `afternoonEnabled` | Whether afternoon slots are available |
| `minAdvanceHours` | Minimum hours in advance to book (e.g., 24) |
| `holidays` | List of holiday dates (unavailable) |
| `blockedDates` | Admin-blocked dates (unavailable) |

### Installation Charges

Installation charges are created and managed through the charges system (`/admin/charges`). Charges can be linked to orders and/or appointments, and have their own payment lifecycle (pending -> paid -> cancelled). This decouples the product purchase from the installation service fee.

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
