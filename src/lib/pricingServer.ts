/**
 * Server-side pricing that reads from admin data (single source of truth).
 * Use this in API routes instead of the client-safe pricing.ts.
 */
import { TINT_TYPES, WINDOW_SQFT } from '@/store/configuratorStore';
import {
  getShippingRates,
  getInstallationRates,
  getSiteSettings,
} from '@/lib/adminData';

// ── Subtotal ──────────────────────────────────────────────────────────
export function calculateSubtotal(sqft: number, pricePerSqft: number): number {
  return Math.round(sqft * pricePerSqft * 100) / 100;
}

// ── Shipping (reads from admin config) ────────────────────────────────
export function calculateShipping(
  country: string,
  sqft: number,
  subtotal: number,
): number {
  const rates = getShippingRates();
  const rate = rates.find((r) => r.country === country && r.active);

  if (rate) {
    if (subtotal >= rate.freeAbove) return 0;

    const settings = getSiteSettings();
    let cost = rate.baseRate + sqft * rate.perSqftRate;

    // Apply markup from admin settings
    if (settings.shippingMarkup > 0) {
      if (settings.shippingMarkupType === 'percentage') {
        cost = cost * (1 + settings.shippingMarkup / 100);
      } else {
        cost = cost + settings.shippingMarkup;
      }
    }

    return Math.round(cost * 100) / 100;
  }

  // Fallback if no rate found
  return 0;
}

// ── Installation (reads from admin config) ────────────────────────────
export function calculateInstallation(
  country: string,
  carType: string,
  windowCount: number,
): number {
  if (!['PH', 'AU'].includes(country)) return 0;

  const rates = getInstallationRates(country, carType.toUpperCase());
  const rate = rates.find(
    (r) => r.country === country && r.carType === carType.toUpperCase() && r.active
  );

  if (rate) {
    return Math.round((rate.baseRate + windowCount * rate.perWindowRate) * 100) / 100;
  }

  // Fallback
  return Math.round((80 + windowCount * 5) * 100) / 100;
}

// ── Tax (reads from admin config) ─────────────────────────────────────
export function getTaxInfo(country: string) {
  const settings = getSiteSettings();
  const rate = settings.taxRates?.[country as keyof typeof settings.taxRates];
  if (rate !== undefined) {
    const pct = Math.round(rate * 100);
    const label =
      country === 'PH' ? `VAT (${pct}%)` : country === 'AU' ? `GST (${pct}%)` : `Tax (${pct}%)`;
    return { rate, label };
  }
  return { rate: 0, label: 'Tax' };
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

// ── Full quote builder ────────────────────────────────────────────────
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
