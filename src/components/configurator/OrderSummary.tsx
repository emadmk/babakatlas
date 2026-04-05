'use client';

import { motion } from 'framer-motion';
import {
  useConfiguratorStore,
  TINT_TYPES,
  SHADE_LEVELS,
} from '@/store/configuratorStore';
import { Edit3, Shield, Lock, CreditCard } from 'lucide-react';

// Format car type string dynamically instead of using hardcoded labels
const formatCarType = (type: string) => {
  // Handle common abbreviations
  const upper = type.toUpperCase();
  if (upper === 'SUV') return 'SUV';
  return type
    ?.split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ') || 'Unknown';
};

function SummarySection({
  title,
  editStep,
  onEdit,
  children,
}: {
  title: string;
  editStep: number;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 rounded-xl bg-white/[0.03] ring-1 ring-white/10">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-white/60 uppercase tracking-wider">{title}</h4>
        <button
          onClick={() => onEdit(editStep)}
          className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          <Edit3 className="w-3 h-3" />
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}

export default function OrderSummary() {
  const {
    carType,
    windows,
    serviceType,
    shippingCountry,
    totalSqft,
    subtotal,
    shippingCost,
    installationCost,
    tax,
    total,
    setStep,
    shippingAddress,
    shippingRates,
  } = useConfiguratorStore();

  const enabledWindows = windows.filter((w) => w.enabled);

  // Get shipping display info from API-loaded data
  const shippingRateData = shippingCountry
    ? shippingRates.find((r) => r.country === shippingCountry && r.active)
    : null;
  const shipping = shippingCountry
    ? shippingRateData
      ? {
          name: shippingRateData.countryName?.en ?? shippingCountry,
          flag: shippingRateData.flag,
          deliveryTime: `${shippingRateData.deliveryDays.min}-${shippingRateData.deliveryDays.max} business days`,
        }
      : { name: shippingCountry === 'PH' ? 'Philippines' : 'Australia', flag: shippingCountry === 'PH' ? '\u{1F1F5}\u{1F1ED}' : '\u{1F1E6}\u{1F1FA}', deliveryTime: '' }
    : null;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-semibold text-white mb-2">Order Summary</h2>
        <p className="text-white/50 text-sm">Review your configuration before checkout</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Details */}
        <div className="lg:col-span-3 space-y-4">
          {/* Vehicle */}
          <SummarySection title="Vehicle" editStep={1} onEdit={setStep}>
            <p className="text-white font-medium">{carType ? formatCarType(carType) : '--'}</p>
          </SummarySection>

          {/* Windows & Tint */}
          <SummarySection title="Windows & Tint" editStep={2} onEdit={setStep}>
            <div className="space-y-2.5">
              {enabledWindows.map((w) => {
                const tint = TINT_TYPES[w.tintType];
                const shade = SHADE_LEVELS[w.shade];
                return (
                  <div
                    key={w.position}
                    className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0"
                  >
                    <div>
                      <span className="text-sm text-white/80">{w.label}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-white/40">
                          {tint?.name || w.tintType}
                        </span>
                        <span className="text-[11px] text-white/30">|</span>
                        <span className="text-[11px] text-white/40">
                          {shade?.name || w.shade} ({shade?.vlt ?? '--'}% VLT)
                        </span>
                        <span className="text-[11px] text-white/30">|</span>
                        <span className="text-[11px] text-white/40">{w.sqft} ft²</span>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-white/70">
                      ${(w.sqft * w.pricePerSqft).toFixed(2)}
                    </span>
                  </div>
                );
              })}
              {enabledWindows.length === 0 && (
                <p className="text-sm text-white/30">No windows selected</p>
              )}
              <div className="pt-2 mt-1 border-t border-white/5 flex justify-between">
                <span className="text-sm text-white/50">
                  {enabledWindows.length} windows | {totalSqft} sq.ft
                </span>
                <span className="text-sm font-medium text-white">${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </SummarySection>

          {/* Service */}
          <SummarySection title="Service" editStep={3} onEdit={setStep}>
            <p className="text-white font-medium">
              {serviceType === 'installation'
                ? 'Professional Installation + Shipping'
                : 'Shipping Only'}
            </p>
          </SummarySection>

          {/* Shipping */}
          <SummarySection title="Shipping" editStep={4} onEdit={setStep}>
            {shipping && (
              <div>
                <p className="text-white font-medium">
                  {shipping.flag} {shipping.name}
                </p>
                {shipping.deliveryTime && (
                  <p className="text-xs text-white/40 mt-1">
                    Estimated delivery: {shipping.deliveryTime}
                  </p>
                )}
              </div>
            )}
            {/* Shipping Address */}
            {shippingAddress.name && (
              <div className="mt-3 pt-3 border-t border-white/5">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1.5">Ship To</p>
                <p className="text-sm text-white/80">{shippingAddress.name}</p>
                {shippingAddress.street1 && (
                  <p className="text-sm text-white/60">{shippingAddress.street1}</p>
                )}
                <p className="text-sm text-white/60">
                  {[shippingAddress.city, shippingAddress.state, shippingAddress.zip]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
            )}
          </SummarySection>
        </div>

        {/* Right: Pricing */}
        <div className="lg:col-span-2">
          <div className="sticky top-8">
            <motion.div
              className="rounded-2xl p-6 bg-white/[0.03] ring-1 ring-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-5">
                Pricing
              </h4>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">
                    Tint Films ({enabledWindows.length} windows, {totalSqft} ft²)
                  </span>
                  <span className="text-white/80">${subtotal.toFixed(2)}</span>
                </div>

                {installationCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Installation</span>
                    <span className="text-white/80">${installationCost.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Shipping</span>
                  <span className={shippingCost === 0 ? 'text-emerald-400 text-sm' : 'text-white/80'}>
                    {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Tax (est.)</span>
                  <span className="text-white/80">${tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-white/10 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-white font-semibold">Total</span>
                    <motion.span
                      key={total}
                      className="text-2xl font-bold text-white"
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                    >
                      ${total.toFixed(2)}
                    </motion.span>
                  </div>
                </div>
              </div>

              {/* Checkout button */}
              <motion.button
                className="w-full mt-6 py-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-sm transition-colors relative overflow-hidden group"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Proceed to Checkout
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>

              {/* Trust badges */}
              <div className="mt-5 flex items-center justify-center gap-4">
                <div className="flex items-center gap-1.5 text-white/30">
                  <Lock className="w-3 h-3" />
                  <span className="text-[10px]">SSL Secured</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/30">
                  <Shield className="w-3 h-3" />
                  <span className="text-[10px]">Buyer Protection</span>
                </div>
              </div>

              <p className="text-center text-[10px] text-white/20 mt-3">
                30-day money-back guarantee on all products
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
