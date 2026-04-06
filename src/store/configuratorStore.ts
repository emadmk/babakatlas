import { create } from 'zustand';

// =============================================================================
// Types for API-loaded data
// =============================================================================

export interface TintProductData {
  id: string;
  name: string;
  slug: string;
  tintType: string;
  category: string; // "nano-ceramic" | "adaptive"
  description: string;
  pricePerSqft: number;
  rollWidth: number;
  rollLength: number;
  rollPrice: number;
  pricePerMeter: number;
  currency: string;
  specs: { vlt: string; uvBlock: string; heatRejection: string; irrRejection: string };
  badge: string | null;
  shades: { id: string; name: string; vlt: number; priceMultiplier: number }[];
}

export interface TintPackageData {
  id: string;
  name: { en: string; tl: string };
  description: { en: string; tl: string };
  coverage: string;
  metersUsed: Record<string, number>;
  applicableTintTypes: string[];
  order: number;
  active: boolean;
}

export interface CarTypeData {
  id: string;
  name: string;
  slug: string;
  type: string;
  imageUrl: string;
  windows: { id: string; label: string; sqft: number }[];
  totalSqft: number;
  glassArea: { frontWindshield: number; rearWindshield: number; totalSideWindows: number; totalArea: number } | null;
  rollUsage: { windshield: number; rear: number; sides: number; total: number } | null;
  sizeGroup: string;
}

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

export interface ShippingAddress {
  name: string;
  street1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

// =============================================================================
// Legacy exports for backward compatibility
// =============================================================================

// These are kept so that other components that import them don't break,
// but the configurator no longer uses per-window pricing.

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
  'nano-ceramic': {
    name: 'Nano Ceramic',
    pricePerSqft: 0,
    description: 'Premium nano-ceramic film',
    uvBlock: 99,
    heatRejection: 60,
    badge: 'Most Popular',
  },
  adaptive: {
    name: 'Adaptive',
    pricePerSqft: 0,
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
  default: { name: 'Default', vlt: 0, description: 'Default shade' },
};

export const WINDOW_SQFT: Record<string, Record<string, number>> = {};

export const WINDOW_LABELS: Record<string, string> = {
  front_windshield: 'Front Windshield',
  rear_windshield: 'Rear Windshield',
  front_left: 'Front Left',
  front_right: 'Front Right',
  rear_left: 'Rear Left',
  rear_right: 'Rear Right',
  rear_quarter_left: 'Rear Quarter Left',
  rear_quarter_right: 'Rear Quarter Right',
};

export const WINDOW_GROUPS = {
  front: { label: 'Front Windows', positions: ['front_windshield', 'front_left', 'front_right'] },
  rear: { label: 'Rear Windows', positions: ['rear_windshield', 'rear_left', 'rear_right', 'rear_quarter_left', 'rear_quarter_right'] },
  sides: { label: 'Side Windows', positions: ['front_left', 'front_right', 'rear_left', 'rear_right', 'rear_quarter_left', 'rear_quarter_right'] },
};

export const SHIPPING_INFO: Record<
  string,
  { name: string; baseCost: number; deliveryTime: string; flag: string }
> = {
  PH: { name: 'Philippines', baseCost: 15, deliveryTime: '7-14 business days', flag: '\u{1F1F5}\u{1F1ED}' },
  AU: { name: 'Australia', baseCost: 25, deliveryTime: '5-10 business days', flag: '\u{1F1E6}\u{1F1FA}' },
};

// Legacy WindowConfig type kept for backward compat
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

// =============================================================================
// Store types
// =============================================================================

export interface ConfiguratorState {
  step: number;
  carType: string | null;

  // New package-based selection
  selectedCategory: string | null; // "nano-ceramic" | "adaptive"
  selectedProduct: string | null; // product slug e.g. "nano-ceramic-35"
  selectedPackage: string | null; // package id e.g. "pkg-full-wrap"

  // Combo extra: for combo package, the ceramic product to pair
  comboProduct: string | null; // product slug for the ceramic portion of combo

  // Legacy: kept for backward compat (OrderSummary etc.)
  windows: WindowConfig[];

  serviceType: 'shipping' | 'installation' | null;
  shippingCountry: 'PH' | 'AU' | null;

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

  // Actions
  loadConfig: () => Promise<void>;
  setShippingAddress: (address: Partial<ShippingAddress>) => void;
  setStep: (step: number) => void;
  setCarType: (carType: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedProduct: (slug: string) => void;
  setSelectedPackage: (packageId: string) => void;
  setComboProduct: (slug: string) => void;

  // Legacy actions (kept for backward compat)
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
  selectedCategory: null as string | null,
  selectedProduct: null as string | null,
  selectedPackage: null as string | null,
  comboProduct: null as string | null,
  windows: [] as WindowConfig[],
  serviceType: null as 'shipping' | 'installation' | null,
  shippingCountry: null as 'PH' | 'AU' | null,
  totalSqft: 0,
  subtotal: 0,
  metersUsed: 0,
  shippingCost: 0,
  installationCost: 0,
  tax: 0,
  total: 0,

  configLoaded: false,
  configLoading: false,
  shippingRates: [] as ShippingRateData[],
  installationRates: [] as InstallationRateData[],
  tintProducts: [] as TintProductData[],
  tintPackages: [] as TintPackageData[],
  carTypes: [] as CarTypeData[],
  taxRates: { PH: 0.12, AU: 0.10 } as Record<string, number>,
  freeShippingThresholds: { PH: 10000, AU: 300 } as Record<string, number>,
  shippingMarkup: 0,
  shippingMarkupType: 'flat' as 'flat' | 'percentage',

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
      const [pricingRes, tintsRes, packagesRes, carsRes] = await Promise.all([
        fetch('/api/config/pricing'),
        fetch('/api/products/tints'),
        fetch('/api/products/packages'),
        fetch('/api/products/cars'),
      ]);

      const pricingJson = await pricingRes.json();

      let tintProducts: TintProductData[] = [];
      try {
        const tintsJson = await tintsRes.json();
        const tintData = tintsJson.data || tintsJson;
        tintProducts = Array.isArray(tintData) ? tintData : [];
      } catch { /* fallback */ }

      let tintPkgs: TintPackageData[] = [];
      try {
        const pkgsJson = await packagesRes.json();
        const pkgData = pkgsJson.data || pkgsJson;
        tintPkgs = Array.isArray(pkgData) ? pkgData : [];
      } catch { /* fallback */ }

      let carTypesData: CarTypeData[] = [];
      try {
        const carsJson = await carsRes.json();
        const carsData = carsJson.data || carsJson;
        carTypesData = Array.isArray(carsData) ? carsData : [];
      } catch { /* fallback */ }

      if (pricingJson.success && pricingJson.data) {
        const { shipping, installation, tax, shippingMarkup, shippingMarkupType } = pricingJson.data;

        const freeShippingThresholds: Record<string, number> = {};
        const taxRates: Record<string, number> = {};

        if (shipping && Array.isArray(shipping)) {
          for (const rate of shipping) {
            freeShippingThresholds[rate.country] = rate.freeAbove;
          }
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
          tintPackages: tintPkgs,
          carTypes: carTypesData,
          taxRates: Object.keys(taxRates).length > 0 ? taxRates : get().taxRates,
          freeShippingThresholds:
            Object.keys(freeShippingThresholds).length > 0
              ? freeShippingThresholds
              : get().freeShippingThresholds,
          shippingMarkup: shippingMarkup ?? 0,
          shippingMarkupType: shippingMarkupType ?? 'flat',
        });

        get().calculatePricing();
      } else {
        set({
          configLoaded: true,
          configLoading: false,
          tintProducts,
          tintPackages: tintPkgs,
          carTypes: carTypesData,
        });
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
    set({ carType, selectedCategory: null, selectedProduct: null, selectedPackage: null, comboProduct: null });
    get().calculatePricing();
  },

  setSelectedCategory: (category: string) => {
    set({ selectedCategory: category, selectedProduct: null, selectedPackage: null, comboProduct: null });
    get().calculatePricing();
  },

  setSelectedProduct: (slug: string) => {
    const { tintProducts, selectedCategory } = get();
    const product = tintProducts.find((p) => p.slug === slug);
    if (product) {
      set({
        selectedProduct: slug,
        selectedCategory: product.category || selectedCategory,
      });
    } else {
      set({ selectedProduct: slug });
    }
    get().calculatePricing();
  },

  setSelectedPackage: (packageId: string) => {
    set({ selectedPackage: packageId });
    get().calculatePricing();
  },

  setComboProduct: (slug: string) => {
    set({ comboProduct: slug });
    get().calculatePricing();
  },

  // Legacy window actions (no-ops for backward compat)
  toggleWindow: () => { get().calculatePricing(); },
  setWindowTint: () => { get().calculatePricing(); },
  setWindowShade: () => { get().calculatePricing(); },
  setWindowShadeWithMultiplier: () => { get().calculatePricing(); },
  applyToAll: () => { get().calculatePricing(); },
  applyToAllWithMultiplier: () => { get().calculatePricing(); },
  applyToGroup: () => { get().calculatePricing(); },
  applyToGroupWithMultiplier: () => { get().calculatePricing(); },

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
      carType,
      selectedProduct,
      selectedPackage,
      comboProduct,
      serviceType,
      shippingCountry,
      shippingRates,
      installationRates,
      taxRates,
      freeShippingThresholds,
      shippingMarkup,
      shippingMarkupType,
      tintProducts,
      tintPackages,
      carTypes,
    } = get();

    // Find the selected car, product, and package
    const car = carTypes.find((c) => c.slug === carType || c.id === carType);
    const product = tintProducts.find((p) => p.slug === selectedProduct);
    const pkg = tintPackages.find((p) => p.id === selectedPackage);

    let metersUsed = 0;
    let subtotal = 0;

    if (car && product && pkg) {
      const sizeGroup = car.sizeGroup || 'small';
      metersUsed = pkg.metersUsed[sizeGroup] || 0;

      if (pkg.coverage === 'combo' && comboProduct) {
        // Combo: adaptive on windshield (1m or 1.5m), ceramic on rest
        const adaptiveProduct = product;
        const ceramicProduct = tintProducts.find((p) => p.slug === comboProduct);

        if (ceramicProduct) {
          // Windshield portion uses adaptive pricing
          const windshieldPkg = tintPackages.find((p) => p.coverage === 'windshield');
          const windshieldMeters = windshieldPkg ? (windshieldPkg.metersUsed[sizeGroup] || 1) : 1;
          const remainingMeters = metersUsed - windshieldMeters;

          subtotal = (windshieldMeters * adaptiveProduct.pricePerMeter) +
                     (remainingMeters * ceramicProduct.pricePerMeter);
        } else {
          subtotal = metersUsed * adaptiveProduct.pricePerMeter;
        }
      } else {
        subtotal = metersUsed * product.pricePerMeter;
      }
    }

    const totalSqft = car?.totalSqft || 0;

    // ── Shipping cost ───────────────────────────────────
    let shippingCost = 0;
    if (shippingCountry) {
      const freeThreshold = freeShippingThresholds[shippingCountry] ?? 10000;
      if (subtotal >= freeThreshold) {
        shippingCost = 0;
      } else {
        const rateData = shippingRates.find((r) => r.country === shippingCountry && r.active);
        if (rateData) {
          shippingCost = rateData.baseRate + totalSqft * rateData.perSqftRate;
        } else {
          const fallback = SHIPPING_INFO[shippingCountry];
          shippingCost = fallback ? fallback.baseCost : 0;
        }

        if (shippingMarkup > 0) {
          if (shippingMarkupType === 'percentage') {
            shippingCost = shippingCost * (1 + shippingMarkup / 100);
          } else {
            shippingCost = shippingCost + shippingMarkup;
          }
        }
      }
    }

    // ── Installation cost ───────────────────────────────
    let installationCost = 0;
    if (serviceType === 'installation' && shippingCountry && car) {
      const carTypeUpper = car.type || carType?.toUpperCase() || '';
      const rateData = installationRates.find(
        (r) => r.country === shippingCountry && r.carType === carTypeUpper && r.active
      );
      if (rateData) {
        installationCost = rateData.baseRate + (car.windows?.length || 0) * (rateData.perWindowRate || 0);
      } else {
        installationCost = 2000; // PHP fallback
      }
    }

    // ── Tax ─────────────────────────────────────────────
    const taxRate = shippingCountry ? (taxRates[shippingCountry] ?? 0.12) : 0.12;
    const tax = Math.round((subtotal + installationCost) * taxRate * 100) / 100;
    const total = Math.round((subtotal + shippingCost + installationCost + tax) * 100) / 100;

    set({ totalSqft, subtotal, metersUsed, shippingCost, installationCost, tax, total });
  },

  reset: () => {
    const { configLoaded, shippingRates, installationRates, tintProducts, tintPackages, carTypes, taxRates, freeShippingThresholds, shippingMarkup, shippingMarkupType } = get();
    set({
      ...initialState,
      configLoaded,
      shippingRates,
      installationRates,
      tintProducts,
      tintPackages,
      carTypes,
      taxRates,
      freeShippingThresholds,
      shippingMarkup,
      shippingMarkupType,
    });
  },
}));
