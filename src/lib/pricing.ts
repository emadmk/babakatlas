import { TINT_TYPES, WINDOW_SQFT, SHIPPING_INFO } from '@/store/configuratorStore';

// =============================================================================
// Server-side pricing helper
// =============================================================================
// For server-side API routes that need admin config values, import directly
// from @/lib/adminData. This file provides a client-safe pricing module
// that uses sensible defaults. The configurator store fetches actual admin
// values via /api/config/pricing and overrides these client-side defaults.

// ── Subtotal ──────────────────────────────────────────────────────────
export function calculateSubtotal(sqft: number, pricePerSqft: number): number {
  return Math.round(sqft * pricePerSqft * 100) / 100;
}

// ── Shipping ──────────────────────────────────────────────────────────
const SHIPPING_RATE_PER_SQFT: Record<string, number> = {
  PH: 2,
  AU: 3,
};

const FREE_SHIPPING_THRESHOLD_DEFAULTS: Record<string, number> = {
  PH: 200,
  AU: 300,
};

export function calculateShipping(
  country: string,
  sqft: number,
  subtotal: number,
): number {
  const info = SHIPPING_INFO[country];
  if (!info) return 0;

  const threshold = FREE_SHIPPING_THRESHOLD_DEFAULTS[country] ?? 200;
  if (subtotal >= threshold) return 0;

  const rateSqft = SHIPPING_RATE_PER_SQFT[country] ?? 2;
  return Math.round((info.baseCost + sqft * rateSqft) * 100) / 100;
}

// ── Installation ──────────────────────────────────────────────────────
const INSTALLATION_BASE: Record<string, number> = {
  sedan: 80,
  suv: 100,
  van: 120,
  station_wagon: 90,
  hatchback: 75,
  coupe: 75,
  truck: 100,
  convertible: 110,
};

export function calculateInstallation(
  country: string,
  carType: string,
  windowCount: number,
): number {
  // Installation only available in supported countries
  if (!['PH', 'AU'].includes(country)) return 0;
  const base = INSTALLATION_BASE[carType] ?? 80;
  // Small per-window surcharge
  const perWindow = windowCount * 5;
  return Math.round((base + perWindow) * 100) / 100;
}

// ── Tax ───────────────────────────────────────────────────────────────
const TAX_RATES: Record<string, { rate: number; label: string }> = {
  PH: { rate: 0.12, label: 'VAT (12%)' },
  AU: { rate: 0.10, label: 'GST (10%)' },
};

export function getTaxInfo(country: string) {
  return TAX_RATES[country] ?? { rate: 0, label: 'Tax' };
}

export function calculateTax(subtotal: number, country: string): number {
  const { rate } = getTaxInfo(country);
  return Math.round(subtotal * rate * 100) / 100;
}

// ── Total ─────────────────────────────────────────────────────────────
export function calculateTotal(
  subtotal: number,
  shipping: number,
  installation: number,
  tax: number,
): number {
  return Math.round((subtotal + shipping + installation + tax) * 100) / 100;
}

// ── Currency formatting ───────────────────────────────────────────────
const CURRENCY_MAP: Record<string, { code: string; symbol: string; locale: string }> = {
  PH: { code: 'PHP', symbol: '\u20B1', locale: 'en-PH' },
  AU: { code: 'AUD', symbol: 'A$', locale: 'en-AU' },
};

export function formatCurrency(amount: number, country: string = 'PH'): string {
  const info = CURRENCY_MAP[country];
  if (!info) return `$${amount.toFixed(2)}`;

  return new Intl.NumberFormat(info.locale, {
    style: 'currency',
    currency: info.code,
    minimumFractionDigits: 2,
  }).format(amount);
}

// ── Full quote builder (used by API) ──────────────────────────────────
export interface PricingQuote {
  totalSqft: number;
  unitPrice: number;
  subtotal: number;
  shipping: number;
  installation: number;
  taxLabel: string;
  tax: number;
  total: number;
}

export function buildPricingQuote(params: {
  carType: string;
  selectedWindows: string[];
  tintType: string;
  serviceType: 'shipping' | 'installation';
  country: string;
}): PricingQuote {
  const { carType, selectedWindows, tintType, serviceType, country } = params;

  const windowData = WINDOW_SQFT[carType] ?? {};
  const totalSqft = selectedWindows.reduce((sum, w) => sum + (windowData[w] ?? 0), 0);

  const tint = TINT_TYPES[tintType];
  const unitPrice = tint ? tint.pricePerSqft : 0;

  const subtotal = calculateSubtotal(totalSqft, unitPrice);
  const shipping =
    serviceType === 'shipping' ? calculateShipping(country, totalSqft, subtotal) : 0;
  const installation =
    serviceType === 'installation'
      ? calculateInstallation(country, carType, selectedWindows.length)
      : 0;

  const { label: taxLabel } = getTaxInfo(country);
  const tax = calculateTax(subtotal + installation, country);
  const total = calculateTotal(subtotal, shipping, installation, tax);

  return { totalSqft, unitPrice, subtotal, shipping, installation, taxLabel, tax, total };
}
