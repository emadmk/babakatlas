import { create } from 'zustand';

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

export const TINT_TYPES: Record<
  string,
  {
    name: string;
    description: string;
    pricePerSqft: number;
    vlt: string;
    uvBlock: number;
    heatRejection: number;
    badge?: string;
  }
> = {
  standard: {
    name: 'Standard',
    description: 'Reliable dyed film with solid UV protection and classic appearance.',
    pricePerSqft: 3,
    vlt: '35%',
    uvBlock: 95,
    heatRejection: 35,
  },
  metallic: {
    name: 'Metallic',
    description: 'Reflective metallic particles for enhanced heat rejection and privacy.',
    pricePerSqft: 5,
    vlt: '15-35%',
    uvBlock: 97,
    heatRejection: 45,
  },
  carbon: {
    name: 'Carbon',
    description: 'Carbon-infused film with no signal interference and matte finish.',
    pricePerSqft: 6,
    vlt: '25-50%',
    uvBlock: 99,
    heatRejection: 50,
  },
  ceramic: {
    name: 'Ceramic',
    description: 'Nano-ceramic technology for maximum clarity and superior heat rejection.',
    pricePerSqft: 8,
    vlt: '20-70%',
    uvBlock: 99,
    heatRejection: 60,
    badge: 'Most Popular',
  },
  crystalline: {
    name: 'Crystalline',
    description: 'Multi-layer optical film that keeps your windows virtually clear.',
    pricePerSqft: 10,
    vlt: '40-90%',
    uvBlock: 99,
    heatRejection: 60,
  },
  adaptive: {
    name: 'Adaptive',
    description: 'Smart film that automatically adjusts tint based on light conditions.',
    pricePerSqft: 12,
    vlt: 'Auto-adjusting',
    uvBlock: 99,
    heatRejection: 65,
    badge: 'Premium',
  },
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
const TAX_RATE = 0.08;

export interface ConfiguratorState {
  step: number;
  carType: string | null;
  carModel: string | null;
  selectedWindows: string[];
  tintType: string | null;
  serviceType: 'shipping' | 'installation' | null;
  shippingCountry: 'PH' | 'AU' | null;
  // Computed
  totalSqft: number;
  unitPrice: number;
  subtotal: number;
  shippingCost: number;
  installationCost: number;
  tax: number;
  total: number;
  // Actions
  setStep: (step: number) => void;
  setCarType: (carType: string) => void;
  setCarModel: (carModel: string) => void;
  toggleWindow: (window: string) => void;
  selectAllWindows: () => void;
  clearWindows: () => void;
  setTintType: (tintType: string) => void;
  setServiceType: (serviceType: 'shipping' | 'installation') => void;
  setShippingCountry: (country: 'PH' | 'AU') => void;
  calculatePricing: () => void;
  reset: () => void;
}

const initialState = {
  step: 1,
  carType: null,
  carModel: null,
  selectedWindows: [] as string[],
  tintType: null,
  serviceType: null as 'shipping' | 'installation' | null,
  shippingCountry: null as 'PH' | 'AU' | null,
  totalSqft: 0,
  unitPrice: 0,
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
    set({ carType, carModel: null, selectedWindows: [] });
    get().calculatePricing();
  },

  setCarModel: (carModel: string) => set({ carModel }),

  toggleWindow: (window: string) => {
    const { selectedWindows } = get();
    const updated = selectedWindows.includes(window)
      ? selectedWindows.filter((w) => w !== window)
      : [...selectedWindows, window];
    set({ selectedWindows: updated });
    get().calculatePricing();
  },

  selectAllWindows: () => {
    const { carType } = get();
    if (!carType) return;
    const windows = Object.keys(WINDOW_SQFT[carType] || {});
    set({ selectedWindows: windows });
    get().calculatePricing();
  },

  clearWindows: () => {
    set({ selectedWindows: [] });
    get().calculatePricing();
  },

  setTintType: (tintType: string) => {
    set({ tintType });
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
    const { carType, selectedWindows, tintType, serviceType, shippingCountry } = get();

    if (!carType) return;

    const windowData = WINDOW_SQFT[carType] || {};
    const totalSqft = selectedWindows.reduce((sum, w) => sum + (windowData[w] || 0), 0);

    const tint = tintType ? TINT_TYPES[tintType] : null;
    const unitPrice = tint ? tint.pricePerSqft : 0;
    const subtotal = totalSqft * unitPrice;

    const shipping = shippingCountry ? SHIPPING_INFO[shippingCountry] : null;
    const shippingCost =
      shipping ? (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : shipping.baseCost) : 0;

    const installationCost =
      serviceType === 'installation' ? totalSqft * INSTALLATION_RATE : 0;

    const tax = Math.round((subtotal + installationCost) * TAX_RATE * 100) / 100;
    const total =
      Math.round((subtotal + shippingCost + installationCost + tax) * 100) / 100;

    set({ totalSqft, unitPrice, subtotal, shippingCost, installationCost, tax, total });
  },

  reset: () => set({ ...initialState }),
}));
