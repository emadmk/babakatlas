# 15 - State Management

## Overview

The application uses **Zustand** for client-side state management. There are four stores, each serving a distinct purpose.

## Stores

### 1. Configurator Store (Primary)

**File**: `src/store/configuratorStore.ts`

The most important store. Manages the entire 5-step configurator flow.

#### State Shape

```typescript
interface ConfiguratorState {
  // Navigation
  step: number;                    // Current step (1-5)

  // Configuration
  carType: string | null;          // Selected car type slug
  windows: WindowConfig[];         // Per-window tint/shade config
  serviceType: 'shipping' | 'installation' | null;
  shippingCountry: 'PH' | 'AU' | null;

  // Computed pricing
  totalSqft: number;
  subtotal: number;
  shippingCost: number;
  installationCost: number;
  tax: number;
  total: number;

  // API-loaded config
  configLoaded: boolean;
  configLoading: boolean;
  shippingRates: ShippingRateData[];
  installationRates: InstallationRateData[];
  tintProducts: TintProductData[];
  taxRates: Record<string, number>;
  freeShippingThresholds: Record<string, number>;
  shippingMarkup: number;
  shippingMarkupType: 'flat' | 'percentage';

  // Address
  shippingAddress: ShippingAddress;
}
```

#### Key Actions

| Action | Trigger | Effect |
|--------|---------|--------|
| `loadConfig()` | Configurator mount | Fetches pricing + tint data from API |
| `setCarType(slug)` | Step 1 selection | Builds windows array, recalculates |
| `toggleWindow(pos)` | Step 2 checkbox | Enables/disables window |
| `setWindowTint(pos, type)` | Step 2 dropdown | Changes tint for one window |
| `setWindowShadeWithMultiplier(pos, shade, mult)` | Step 2 dropdown | Changes shade with price multiplier |
| `applyToAll(tint, shade)` | Quick Apply button | Applies to all windows |
| `applyToGroupWithMultiplier(group, tint, shade, mult)` | Group button | Applies to front/rear/sides |
| `setServiceType(type)` | Step 3 selection | Updates service, recalculates |
| `setShippingCountry(country)` | Step 4 selection | Updates country, recalculates |
| `setShippingAddress(addr)` | Step 4 form | Updates address fields |
| `calculatePricing()` | After any change | Recomputes all pricing |
| `reset()` | Reset button | Clears config, preserves loaded API data |

#### Data Flow

```
User interaction
    |
    v
Action (e.g., setWindowTint)
    |
    v
State update (Zustand set())
    |
    v
calculatePricing() called
    |
    v
Pricing state updated
    |
    v
React re-render (components subscribe to relevant slices)
```

#### Persistence

The configurator store is **NOT persisted** to localStorage. Configuration is lost on page refresh. The loaded API config is cached in memory and only fetched once per session.

### 2. Cart Store

**File**: `src/store/cartStore.ts`

A generic shopping cart store. **Currently unused** by the main configurator flow but available for future use.

#### State

```typescript
interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item) => void;
  removeItem: (id) => void;
  updateQuantity: (id, quantity) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open) => void;
  total: () => number;
  itemCount: () => number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
  tintColor?: string;
}
```

#### Persistence

Uses Zustand's `persist` middleware with localStorage:

```typescript
persist(
  (set, get) => ({ ... }),
  {
    name: "babakatlas-cart",
    partialize: (state) => ({ items: state.items }),
  }
)
```

Only `items` array is persisted. The `isOpen` state resets on page load.

### 3. Auth Store

**File**: `src/store/authStore.ts`

Manages client-side user state. Primarily used for UI logic; actual auth is handled by NextAuth's `useSession()`.

#### State

```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user) => void;
  setLoading: (loading) => void;
  logout: () => void;
  updateProfile: (data) => void;
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  phone?: string;
  country?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}
```

#### Persistence

Not persisted. Resets on page load. Session state comes from NextAuth.

### 4. Admin Store

**File**: `src/store/adminStore.ts`

Manages admin panel UI state and data.

#### State

```typescript
interface AdminState {
  // Data
  products: AdminProduct[];
  orders: AdminOrder[];
  users: AdminUser[];
  pricing: PricingConfig;
  stats: DashboardStats;

  // Loading
  isLoading: boolean;
  error: string | null;

  // Filters
  orderStatusFilter: OrderStatusFilter;
  orderSearch: string;
  userSearch: string;

  // Sidebar
  sidebarOpen: boolean;
}
```

#### Actions

- **Products**: `setProducts`, `addProduct`, `updateProduct`, `removeProduct`, `toggleProductActive`
- **Orders**: `setOrders`, `updateOrderStatus`, `addOrderNote`, filter/search setters
- **Users**: `setUsers`, `toggleUserStatus`, search setter
- **Pricing**: `setPricing`, `updateTintPrice`, `updateShippingRate`, `updateInstallationRate`
- **Stats**: `setStats`
- **General**: `setLoading`, `setError`, `setSidebarOpen`

#### Persistence

Not persisted. Admin pages fetch fresh data on mount and populate the store.

## State Flow Diagram

```
                    +------------------+
                    |  API Endpoints   |
                    +--------+---------+
                             |
                    fetch / POST
                             |
              +--------------+---------------+
              |              |               |
     +--------v---+   +-----v------+  +-----v------+
     | configurator|   | adminStore |  | authStore  |
     | Store       |   |            |  |            |
     +------+------+   +-----+------+  +-----+------+
            |                 |               |
            v                 v               v
     Configurator      Admin Panel     Auth UI / Guards
     Components        Components      Components
```

## Best Practices Used

1. **Single-purpose stores**: Each store handles one domain
2. **Computed values**: Pricing is calculated via `calculatePricing()` rather than derived in components
3. **API config loading**: Config is fetched once and cached in store state
4. **Reset preserves config**: `reset()` keeps loaded API data to avoid re-fetching
5. **Selective subscriptions**: Components use selectors to subscribe to specific state slices:
   ```typescript
   const total = useConfiguratorStore((s) => s.total);
   ```
