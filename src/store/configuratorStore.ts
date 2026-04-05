import { create } from 'zustand';

// =============================================================================
// Default data (used as fallback before API loads)
// =============================================================================

export const TINT_TYPES: Record<
  string,
  {
    name: string;
    pricePerSqft: number;
    description: string;
    uvBlock: number;
    heatRejection: number;
    badge?: string;
  }
> = {
  standard: {
    name: 'Standard',
    pricePerSqft: 3,
    description: 'Basic dyed film',
    uvBlock: 95,
    heatRejection: 35,
  },
  metallic: {
    name: 'Metallic',
    pricePerSqft: 5,
    description: 'Reflective metallic',
    uvBlock: 97,
    heatRejection: 45,
  },
  carbon: {
    name: 'Carbon',
    pricePerSqft: 6,
    description: 'Carbon particle film',
    uvBlock: 99,
    heatRejection: 50,
  },
  ceramic: {
    name: 'Ceramic',
    pricePerSqft: 8,
    description: 'Premium nano-ceramic',
    uvBlock: 99,
    heatRejection: 60,
    badge: 'Most Popular',
  },
  crystalline: {
    name: 'Crystalline',
    pricePerSqft: 10,
    description: 'Near-invisible heat block',
    uvBlock: 99,
    heatRejection: 60,
  },
  adaptive: {
    name: 'Adaptive',
    pricePerSqft: 12,
    description: 'Smart auto-adjusting',
    uvBlock: 99,
    heatRejection: 65,
    badge: 'Premium',
  },
};

export const SHADE_LEVELS: Record<
  string,
  { name: string; vlt: number; description: string }
> = {
  light: { name: 'Light', vlt: 70, description: 'Subtle tint, maximum visibility' },
  medium: { name: 'Medium', vlt: 35, description: 'Balanced privacy and visibility' },
  dark: { name: 'Dark', vlt: 15, description: 'Maximum privacy' },
  limo: { name: 'Limo', vlt: 5, description: 'Darkest available' },
};

export const WINDOW_SQFT: Record<string, Record<string, number>> = {
  sedan: {
    front_windshield: 12,
    rear_windshield: 10,
    front_left: 4,
    front_right: 4,
    rear_left: 4,
    rear_right: 4,
  },
  suv: {
    front_windshield: 14,
    rear_windshield: 12,
    front_left: 5,
    front_right: 5,
    rear_left: 5,
    rear_right: 5,
    rear_quarter_left: 3,
    rear_quarter_right: 3,
  },
  van: {
    front_windshield: 16,
    rear_windshield: 14,
    front_left: 5,
    front_right: 5,
    rear_left: 6,
    rear_right: 6,
    rear_quarter_left: 4,
    rear_quarter_right: 4,
  },
  station_wagon: {
    front_windshield: 13,
    rear_windshield: 11,
    front_left: 4,
    front_right: 4,
    rear_left: 5,
    rear_right: 5,
    rear_quarter_left: 3,
    rear_quarter_right: 3,
  },
  hatchback: {
    front_windshield: 11,
    rear_windshield: 9,
    front_left: 4,
    front_right: 4,
    rear_left: 3,
    rear_right: 3,
  },
  coupe: {
    front_windshield: 11,
    rear_windshield: 8,
    front_left: 4,
    front_right: 4,
    rear_left: 3,
    rear_right: 3,
  },
  truck: {
    front_windshield: 14,
    rear_windshield: 10,
    front_left: 5,
    front_right: 5,
    rear_left: 3,
    rear_right: 3,
  },
  convertible: {
    front_windshield: 10,
    front_left: 4,
    front_right: 4,
    rear_left: 3,
    rear_right: 3,
    sunroof: 6,
  },
};

export const WINDOW_LABELS: Record<string, string> = {
  front_windshield: 'Front Windshield',
  rear_windshield: 'Rear Windshield',
  front_left: 'Front Left',
  front_right: 'Front Right',
  rear_left: 'Rear Left',
  rear_right: 'Rear Right',
  rear_quarter_left: 'Rear Quarter Left',
  rear_quarter_right: 'Rear Quarter Right',
  sunroof: 'Sunroof',
};

const FRONT_WINDOWS = ['front_windshield', 'front_left', 'front_right'];
const REAR_WINDOWS = ['rear_windshield', 'rear_left', 'rear_right', 'rear_quarter_left', 'rear_quarter_right'];
const SIDE_WINDOWS = ['front_left', 'front_right', 'rear_left', 'rear_right', 'rear_quarter_left', 'rear_quarter_right'];

export const WINDOW_GROUPS = {
  front: { label: 'Front Windows', positions: FRONT_WINDOWS },
  rear: { label: 'Rear Windows', positions: REAR_WINDOWS },
  sides: { label: 'Side Windows', positions: SIDE_WINDOWS },
};

// Default SHIPPING_INFO kept for backward compatibility (components that import it)
export const SHIPPING_INFO: Record<
  string,
  { name: string; baseCost: number; deliveryTime: string; flag: string }
> = {
  PH: { name: 'Philippines', baseCost: 15, deliveryTime: '7-14 business days', flag: '\u{1F1F5}\u{1F1ED}' },
  AU: { name: 'Australia', baseCost: 25, deliveryTime: '5-10 business days', flag: '\u{1F1E6}\u{1F1FA}' },
};

// =============================================================================
// Types for API-loaded config
// =============================================================================

export interface ShippingRateData {
  country: string;
  countryName: { en: string; tl: string };
  flag: string;
  baseRate: number;
  perSqftRate: number;
  freeAbove: number;
  deliveryDays: { min: number; max: number };
  active: boolean;
}

export interface InstallationRateData {
  country: string;
  carType: string;
  baseRate: number;
  perWindowRate: number;
  active: boolean;
}

export interface TintProductData {
  id: string;
  name: string;
  slug: string;
  tintType: string;
  description: string;
  pricePerSqft: number;
  specs: { vlt: string; uvBlock: string; heatRejection: string };
  badge: string | null;
  shades: { id: string; name: string; vlt: number; priceMultiplier: number }[];
}

export interface ShippingAddress {
  name: string;
  street1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

// =============================================================================
// Store types
// =============================================================================

export interface WindowConfig {
  position: string;
  label: string;
  enabled: boolean;
  tintType: string;
  shade: string;
  shadeMultiplier: number;
  sqft: number;
  pricePerSqft: number;
  price: number;
}

export interface ConfiguratorState {
  step: number;
  carType: string | null;
  windows: WindowConfig[];
  serviceType: 'shipping' | 'installation' | null;
  shippingCountry: 'PH' | 'AU' | null;

  // Computed pricing
  totalSqft: number;
  subtotal: number;
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
  taxRates: Record<string, number>;
  freeShippingThresholds: Record<string, number>;
  shippingMarkup: number;
  shippingMarkupType: 'flat' | 'percentage';

  // Shipping address
  shippingAddress: ShippingAddress;

  // Actions
  loadConfig: () => Promise<void>;
  setShippingAddress: (address: Partial<ShippingAddress>) => void;
  setStep: (step: number) => void;
  setCarType: (carType: string) => void;
  toggleWindow: (position: string) => void;
  setWindowTint: (position: string, tintType: string) => void;
  setWindowShade: (position: string, shade: string) => void;
  setWindowShadeWithMultiplier: (position: string, shade: string, multiplier: number) => void;
  applyToAll: (tintType: string, shade: string) => void;
  applyToAllWithMultiplier: (tintType: string, shade: string, multiplier: number) => void;
  applyToGroup: (group: 'front' | 'rear' | 'sides', tintType: string, shade: string) => void;
  applyToGroupWithMultiplier: (group: 'front' | 'rear' | 'sides', tintType: string, shade: string, multiplier: number) => void;
  setServiceType: (serviceType: 'shipping' | 'installation') => void;
  setShippingCountry: (country: 'PH' | 'AU') => void;
  calculatePricing: () => void;
  reset: () => void;
}

// =============================================================================
// Helpers
// =============================================================================

function buildWindows(carType: string, defaultTint: string = 'ceramic', defaultShade: string = 'medium', tintProducts?: TintProductData[]): WindowConfig[] {
  const windowData = WINDOW_SQFT[carType] || {};
  // Try API data first, fallback to hardcoded TINT_TYPES
  const apiTint = tintProducts?.find((t) => t.slug === defaultTint || t.tintType === defaultTint);
  const fallbackTint = TINT_TYPES[defaultTint];
  const pricePerSqft = apiTint?.pricePerSqft ?? fallbackTint?.pricePerSqft ?? 0;
  const defaultMultiplier = 1.0;
  return Object.entries(windowData).map(([position, sqft]) => ({
    position,
    label: WINDOW_LABELS[position] || position,
    enabled: true,
    tintType: defaultTint,
    shade: defaultShade,
    shadeMultiplier: defaultMultiplier,
    sqft,
    pricePerSqft,
    price: sqft * pricePerSqft * defaultMultiplier,
  }));
}

const emptyShippingAddress: ShippingAddress = {
  name: '',
  street1: '',
  city: '',
  state: '',
  zip: '',
  country: '',
};

const initialState = {
  step: 1,
  carType: null as string | null,
  windows: [] as WindowConfig[],
  serviceType: null as 'shipping' | 'installation' | null,
  shippingCountry: null as 'PH' | 'AU' | null,
  totalSqft: 0,
  subtotal: 0,
  shippingCost: 0,
  installationCost: 0,
  tax: 0,
  total: 0,

  // Config state
  configLoaded: false,
  configLoading: false,
  shippingRates: [] as ShippingRateData[],
  installationRates: [] as InstallationRateData[],
  tintProducts: [] as TintProductData[],
  taxRates: { PH: 0.12, AU: 0.10 } as Record<string, number>,
  freeShippingThresholds: { PH: 200, AU: 300 } as Record<string, number>,
  shippingMarkup: 0,
  shippingMarkupType: 'flat' as 'flat' | 'percentage',

  // Shipping address
  shippingAddress: { ...emptyShippingAddress },
};

// =============================================================================
// Store
// =============================================================================

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  ...initialState,

  // ── Load config from API ──────────────────────────────────────────
  loadConfig: async () => {
    const { configLoaded, configLoading } = get();
    if (configLoaded || configLoading) return;

    set({ configLoading: true });

    try {
      const [res, tintsRes] = await Promise.all([
        fetch('/api/config/pricing'),
        fetch('/api/products/tints'),
      ]);
      const json = await res.json();
      let tintProducts: TintProductData[] = [];
      try {
        const tintsJson = await tintsRes.json();
        const tintData = tintsJson.data || tintsJson;
        tintProducts = Array.isArray(tintData) ? tintData : [];
      } catch {
        // tint fetch failed, keep empty array
      }

      if (json.success && json.data) {
        const { shipping, installation, tax, shippingMarkup, shippingMarkupType } = json.data;

        // Build lookup maps from API data
        const freeShippingThresholds: Record<string, number> = {};
        const taxRates: Record<string, number> = {};

        if (shipping && Array.isArray(shipping)) {
          for (const rate of shipping) {
            freeShippingThresholds[rate.country] = rate.freeAbove;
          }

          // Also update the exported SHIPPING_INFO for backward compat
          for (const rate of shipping) {
            const deliveryTime = rate.deliveryDays
              ? `${rate.deliveryDays.min}-${rate.deliveryDays.max} business days`
              : SHIPPING_INFO[rate.country]?.deliveryTime ?? '';
            SHIPPING_INFO[rate.country] = {
              name: rate.countryName?.en ?? rate.country,
              baseCost: rate.baseRate,
              deliveryTime,
              flag: rate.flag,
            };
          }
        }

        if (tax) {
          for (const [country, rate] of Object.entries(tax)) {
            taxRates[country] = rate as number;
          }
        }

        set({
          configLoaded: true,
          configLoading: false,
          shippingRates: shipping ?? [],
          installationRates: installation ?? [],
          tintProducts,
          taxRates: Object.keys(taxRates).length > 0 ? taxRates : get().taxRates,
          freeShippingThresholds:
            Object.keys(freeShippingThresholds).length > 0
              ? freeShippingThresholds
              : get().freeShippingThresholds,
          shippingMarkup: shippingMarkup ?? 0,
          shippingMarkupType: shippingMarkupType ?? 'flat',
        });

        // Recalculate pricing with new config values
        get().calculatePricing();
      } else {
        set({ configLoading: false });
      }
    } catch (err) {
      console.error('Failed to load configurator config:', err);
      set({ configLoading: false });
    }
  },

  // ── Shipping address ──────────────────────────────────────────────
  setShippingAddress: (address: Partial<ShippingAddress>) => {
    const current = get().shippingAddress;
    set({ shippingAddress: { ...current, ...address } });
  },

  setStep: (step: number) => set({ step }),

  setCarType: (carType: string) => {
    const { tintProducts } = get();
    const windows = buildWindows(carType, 'ceramic', 'medium', tintProducts);
    set({ carType, windows });
    get().calculatePricing();
  },

  toggleWindow: (position: string) => {
    const { windows } = get();
    set({
      windows: windows.map((w) =>
        w.position === position ? { ...w, enabled: !w.enabled } : w
      ),
    });
    get().calculatePricing();
  },

  setWindowTint: (position: string, tintType: string) => {
    const { windows, tintProducts } = get();
    // Try API data first, fallback to hardcoded
    const apiTint = tintProducts.find((t) => t.slug === tintType || t.tintType === tintType);
    const fallbackTint = TINT_TYPES[tintType];
    const pricePerSqft = apiTint?.pricePerSqft ?? fallbackTint?.pricePerSqft ?? 0;
    if (!apiTint && !fallbackTint) return;
    set({
      windows: windows.map((w) =>
        w.position === position
          ? { ...w, tintType, pricePerSqft, price: w.sqft * pricePerSqft * w.shadeMultiplier }
          : w
      ),
    });
    get().calculatePricing();
  },

  setWindowShade: (position: string, shade: string) => {
    const { windows } = get();
    set({
      windows: windows.map((w) =>
        w.position === position ? { ...w, shade } : w
      ),
    });
    get().calculatePricing();
  },

  setWindowShadeWithMultiplier: (position: string, shade: string, multiplier: number) => {
    const { windows } = get();
    set({
      windows: windows.map((w) =>
        w.position === position
          ? { ...w, shade, shadeMultiplier: multiplier, price: w.sqft * w.pricePerSqft * multiplier }
          : w
      ),
    });
    get().calculatePricing();
  },

  applyToAll: (tintType: string, shade: string) => {
    const { windows, tintProducts } = get();
    const apiTint = tintProducts.find((t) => t.slug === tintType || t.tintType === tintType);
    const fallbackTint = TINT_TYPES[tintType];
    const pricePerSqft = apiTint?.pricePerSqft ?? fallbackTint?.pricePerSqft ?? 0;
    if (!apiTint && !fallbackTint) return;
    set({
      windows: windows.map((w) => ({
        ...w,
        tintType,
        shade,
        pricePerSqft,
        price: w.sqft * pricePerSqft * w.shadeMultiplier,
      })),
    });
    get().calculatePricing();
  },

  applyToAllWithMultiplier: (tintType: string, shade: string, multiplier: number) => {
    const { windows, tintProducts } = get();
    const apiTint = tintProducts.find((t) => t.slug === tintType || t.tintType === tintType);
    const fallbackTint = TINT_TYPES[tintType];
    const pricePerSqft = apiTint?.pricePerSqft ?? fallbackTint?.pricePerSqft ?? 0;
    if (!apiTint && !fallbackTint) return;
    set({
      windows: windows.map((w) => ({
        ...w,
        tintType,
        shade,
        shadeMultiplier: multiplier,
        pricePerSqft,
        price: w.sqft * pricePerSqft * multiplier,
      })),
    });
    get().calculatePricing();
  },

  applyToGroup: (group: 'front' | 'rear' | 'sides', tintType: string, shade: string) => {
    const { windows, tintProducts } = get();
    const apiTint = tintProducts.find((t) => t.slug === tintType || t.tintType === tintType);
    const fallbackTint = TINT_TYPES[tintType];
    const pricePerSqft = apiTint?.pricePerSqft ?? fallbackTint?.pricePerSqft ?? 0;
    if (!apiTint && !fallbackTint) return;
    const positions = WINDOW_GROUPS[group].positions;
    set({
      windows: windows.map((w) =>
        positions.includes(w.position)
          ? { ...w, tintType, shade, pricePerSqft, price: w.sqft * pricePerSqft * w.shadeMultiplier }
          : w
      ),
    });
    get().calculatePricing();
  },

  applyToGroupWithMultiplier: (group: 'front' | 'rear' | 'sides', tintType: string, shade: string, multiplier: number) => {
    const { windows, tintProducts } = get();
    const apiTint = tintProducts.find((t) => t.slug === tintType || t.tintType === tintType);
    const fallbackTint = TINT_TYPES[tintType];
    const pricePerSqft = apiTint?.pricePerSqft ?? fallbackTint?.pricePerSqft ?? 0;
    if (!apiTint && !fallbackTint) return;
    const positions = WINDOW_GROUPS[group].positions;
    set({
      windows: windows.map((w) =>
        positions.includes(w.position)
          ? { ...w, tintType, shade, shadeMultiplier: multiplier, pricePerSqft, price: w.sqft * pricePerSqft * multiplier }
          : w
      ),
    });
    get().calculatePricing();
  },

  setServiceType: (serviceType: 'shipping' | 'installation') => {
    set({ serviceType });
    get().calculatePricing();
  },

  setShippingCountry: (country: 'PH' | 'AU') => {
    const { shippingAddress } = get();
    set({
      shippingCountry: country,
      shippingAddress: { ...shippingAddress, country },
    });
    get().calculatePricing();
  },

  calculatePricing: () => {
    const {
      windows,
      serviceType,
      shippingCountry,
      shippingRates,
      installationRates,
      taxRates,
      freeShippingThresholds,
      shippingMarkup,
      shippingMarkupType,
      carType,
    } = get();

    const enabledWindows = windows.filter((w) => w.enabled);
    const totalSqft = enabledWindows.reduce((sum, w) => sum + w.sqft, 0);
    const subtotal = enabledWindows.reduce((sum, w) => sum + w.sqft * w.pricePerSqft * (w.shadeMultiplier || 1), 0);

    // ── Shipping cost (from API config) ───────────────────────────
    let shippingCost = 0;
    if (shippingCountry) {
      const freeThreshold = freeShippingThresholds[shippingCountry] ?? 200;
      if (subtotal >= freeThreshold) {
        shippingCost = 0;
      } else {
        // Look up from API-loaded rates first
        const rateData = shippingRates.find((r) => r.country === shippingCountry && r.active);
        if (rateData) {
          shippingCost = rateData.baseRate + totalSqft * rateData.perSqftRate;
        } else {
          // Fallback to SHIPPING_INFO
          const fallback = SHIPPING_INFO[shippingCountry];
          shippingCost = fallback ? fallback.baseCost : 0;
        }

        // Apply markup
        if (shippingMarkup > 0) {
          if (shippingMarkupType === 'percentage') {
            shippingCost = shippingCost * (1 + shippingMarkup / 100);
          } else {
            shippingCost = shippingCost + shippingMarkup;
          }
        }
      }
    }

    // ── Installation cost (from API config) ───────────────────────
    let installationCost = 0;
    if (serviceType === 'installation' && shippingCountry && carType) {
      const carTypeUpper = carType.toUpperCase();
      const rateData = installationRates.find(
        (r) => r.country === shippingCountry && r.carType === carTypeUpper && r.active
      );
      if (rateData) {
        installationCost = rateData.baseRate + enabledWindows.length * (rateData.perWindowRate || 0);
      } else {
        // Fallback: only used if API hasn't loaded yet
        const fallbackRate = 4;
        installationCost = totalSqft * fallbackRate;
      }
    }

    // ── Tax (from API config) ─────────────────────────────────────
    const taxRate = shippingCountry ? (taxRates[shippingCountry] ?? 0.08) : 0.08;
    const tax = Math.round((subtotal + installationCost) * taxRate * 100) / 100;
    const total = Math.round((subtotal + shippingCost + installationCost + tax) * 100) / 100;

    set({ totalSqft, subtotal, shippingCost, installationCost, tax, total });
  },

  reset: () => {
    // Preserve loaded config across resets
    const { configLoaded, shippingRates, installationRates, tintProducts, taxRates, freeShippingThresholds, shippingMarkup, shippingMarkupType } = get();
    set({
      ...initialState,
      configLoaded,
      shippingRates,
      installationRates,
      tintProducts,
      taxRates,
      freeShippingThresholds,
      shippingMarkup,
      shippingMarkupType,
    });
  },
}));
