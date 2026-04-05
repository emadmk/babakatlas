import { create } from 'zustand';

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

export const SHIPPING_INFO: Record<
  string,
  { name: string; baseCost: number; deliveryTime: string; flag: string }
> = {
  PH: { name: 'Philippines', baseCost: 15, deliveryTime: '7-14 business days', flag: '\u{1F1F5}\u{1F1ED}' },
  AU: { name: 'Australia', baseCost: 25, deliveryTime: '5-10 business days', flag: '\u{1F1E6}\u{1F1FA}' },
};

const INSTALLATION_RATE = 4; // per sqft
const FREE_SHIPPING_THRESHOLD = 200;
const TAX_RATES: Record<string, number> = { PH: 0.12, AU: 0.10 };

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

  // Actions
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

function buildWindows(carType: string, defaultTint: string = 'ceramic', defaultShade: string = 'medium'): WindowConfig[] {
  const windowData = WINDOW_SQFT[carType] || {};
  const tint = TINT_TYPES[defaultTint];
  const defaultMultiplier = SHADE_LEVELS[defaultShade] ? 1.0 : 1.0;
  return Object.entries(windowData).map(([position, sqft]) => ({
    position,
    label: WINDOW_LABELS[position] || position,
    enabled: true,
    tintType: defaultTint,
    shade: defaultShade,
    shadeMultiplier: defaultMultiplier,
    sqft,
    pricePerSqft: tint ? tint.pricePerSqft : 0,
    price: sqft * (tint ? tint.pricePerSqft : 0) * defaultMultiplier,
  }));
}

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
};

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  ...initialState,

  setStep: (step: number) => set({ step }),

  setCarType: (carType: string) => {
    const windows = buildWindows(carType);
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
    const { windows } = get();
    const tint = TINT_TYPES[tintType];
    if (!tint) return;
    set({
      windows: windows.map((w) =>
        w.position === position
          ? { ...w, tintType, pricePerSqft: tint.pricePerSqft, price: w.sqft * tint.pricePerSqft * w.shadeMultiplier }
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
    const { windows } = get();
    const tint = TINT_TYPES[tintType];
    if (!tint) return;
    set({
      windows: windows.map((w) => ({
        ...w,
        tintType,
        shade,
        pricePerSqft: tint.pricePerSqft,
        price: w.sqft * tint.pricePerSqft * w.shadeMultiplier,
      })),
    });
    get().calculatePricing();
  },

  applyToAllWithMultiplier: (tintType: string, shade: string, multiplier: number) => {
    const { windows } = get();
    const tint = TINT_TYPES[tintType];
    if (!tint) return;
    set({
      windows: windows.map((w) => ({
        ...w,
        tintType,
        shade,
        shadeMultiplier: multiplier,
        pricePerSqft: tint.pricePerSqft,
        price: w.sqft * tint.pricePerSqft * multiplier,
      })),
    });
    get().calculatePricing();
  },

  applyToGroup: (group: 'front' | 'rear' | 'sides', tintType: string, shade: string) => {
    const { windows } = get();
    const tint = TINT_TYPES[tintType];
    if (!tint) return;
    const positions = WINDOW_GROUPS[group].positions;
    set({
      windows: windows.map((w) =>
        positions.includes(w.position)
          ? { ...w, tintType, shade, pricePerSqft: tint.pricePerSqft, price: w.sqft * tint.pricePerSqft * w.shadeMultiplier }
          : w
      ),
    });
    get().calculatePricing();
  },

  applyToGroupWithMultiplier: (group: 'front' | 'rear' | 'sides', tintType: string, shade: string, multiplier: number) => {
    const { windows } = get();
    const tint = TINT_TYPES[tintType];
    if (!tint) return;
    const positions = WINDOW_GROUPS[group].positions;
    set({
      windows: windows.map((w) =>
        positions.includes(w.position)
          ? { ...w, tintType, shade, shadeMultiplier: multiplier, pricePerSqft: tint.pricePerSqft, price: w.sqft * tint.pricePerSqft * multiplier }
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
    set({ shippingCountry: country });
    get().calculatePricing();
  },

  calculatePricing: () => {
    const { windows, serviceType, shippingCountry } = get();

    const enabledWindows = windows.filter((w) => w.enabled);
    const totalSqft = enabledWindows.reduce((sum, w) => sum + w.sqft, 0);
    const subtotal = enabledWindows.reduce((sum, w) => sum + w.sqft * w.pricePerSqft * (w.shadeMultiplier || 1), 0);

    const shipping = shippingCountry ? SHIPPING_INFO[shippingCountry] : null;
    const shippingCost = shipping
      ? subtotal >= FREE_SHIPPING_THRESHOLD
        ? 0
        : shipping.baseCost
      : 0;

    const installationCost =
      serviceType === 'installation' ? totalSqft * INSTALLATION_RATE : 0;

    const taxRate = shippingCountry ? (TAX_RATES[shippingCountry] || 0.08) : 0.08;
    const tax = Math.round((subtotal + installationCost) * taxRate * 100) / 100;
    const total = Math.round((subtotal + shippingCost + installationCost + tax) * 100) / 100;

    set({ totalSqft, subtotal, shippingCost, installationCost, tax, total });
  },

  reset: () => set({ ...initialState }),
}));
