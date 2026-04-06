'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useConfiguratorStore } from '@/store/configuratorStore';
import { Edit3, Shield, Lock, CreditCard } from 'lucide-react';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const formatCarType = (type: string) => {
  const upper = type.toUpperCase();
  if (upper === 'SUV' || upper === 'MPV') return upper;
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
  const router = useRouter();
  const {
    carType,
    selectedProduct,
    selectedPackage,
    comboProduct,
    serviceType,
    shippingCountry,
    metersUsed,
    subtotal,
    shippingCost,
    tax,
    total,
    setStep,
    shippingAddress,
    shippingRates,
    tintProducts,
    tintPackages,
    carTypes,
  } = useConfiguratorStore();

  const car = carTypes.find((c) => c.slug === carType || c.id === carType);
  const product = tintProducts.find((p) => p.slug === selectedProduct);
  const pkg = tintPackages.find((p) => p.id === selectedPackage);

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
          <SummarySection title="Vehicle" editStep={2} onEdit={setStep}>
            <p className="text-white font-medium">{carType ? formatCarType(carType) : '--'}</p>
            {car?.glassArea && (
              <p className="text-xs text-white/40 mt-1">
                Total glass area: {car.glassArea.totalArea} sqm
              </p>
            )}
          </SummarySection>

          {/* Tint & Package */}
          <SummarySection title="Tint & Package" editStep={3} onEdit={setStep}>
            {product && pkg ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-white/80 font-medium">{product.name}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-white/40">
                        VLT: {product.specs.vlt}
                      </span>
                      <span className="text-[11px] text-white/30">|</span>
                      <span className="text-[11px] text-white/40">
                        UV: {product.specs.uvBlock}
                      </span>
                      <span className="text-[11px] text-white/30">|</span>
                      <span className="text-[11px] text-white/40">
                        IRR: {product.specs.irrRejection}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-white/50">
                    {formatCurrency(product.pricePerMeter)}/m
                  </span>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-white/70">{pkg.name.en}</span>
                      <span className="text-xs text-white/30 ml-2">({metersUsed}m of roll)</span>
                    </div>
                  </div>

                  {pkg.coverage === 'combo' && comboProduct && (
                    <div className="mt-2 text-xs text-white/40">
                      Combo: Adaptive windshield + {tintProducts.find((p) => p.slug === comboProduct)?.name || 'Nano Ceramic'} rest
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-white/5 flex justify-between">
                  <span className="text-sm text-white/50">
                    {metersUsed}m x {formatCurrency(product.pricePerMeter)}/m
                  </span>
                  <span className="text-sm font-medium text-white">{formatCurrency(subtotal)}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-white/30">No tint selected</p>
            )}
          </SummarySection>

          {/* Service */}
          <SummarySection title="Service" editStep={4} onEdit={setStep}>
            <p className="text-white font-medium">
              {serviceType === 'installation'
                ? 'Home Service Installation'
                : 'Shipping Only'}
            </p>
            {serviceType === 'installation' && (
              <p className="text-xs text-amber-400/70 mt-1">
                Installation fee will be quoted separately after assessment
              </p>
            )}
          </SummarySection>

          {/* Shipping / Appointment */}
          <SummarySection title={serviceType === 'installation' ? 'Appointment' : 'Shipping'} editStep={5} onEdit={setStep}>
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
                    Tint Film ({metersUsed}m)
                  </span>
                  <span className="text-white/80">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Shipping</span>
                  <span className={shippingCost === 0 ? 'text-emerald-400 text-sm' : 'text-white/80'}>
                    {shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Tax (VAT est.)</span>
                  <span className="text-white/80">{formatCurrency(tax)}</span>
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
                      {formatCurrency(total)}
                    </motion.span>
                  </div>
                </div>
              </div>

              {/* Checkout button */}
              <motion.button
                onClick={() => router.push('/checkout')}
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
