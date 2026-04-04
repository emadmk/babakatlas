'use client';

import { motion } from 'framer-motion';
import {
  useConfiguratorStore,
  TINT_TYPES,
  SHIPPING_INFO,
  WINDOW_SQFT,
} from '@/store/configuratorStore';
import { Edit3, Shield, Lock, CreditCard } from 'lucide-react';

const WINDOW_LABELS: Record<string, string> = {
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

const CAR_LABELS: Record<string, string> = {
  sedan: 'Sedan',
  suv: 'SUV',
  van: 'Van',
  station_wagon: 'Station Wagon',
  hatchback: 'Hatchback',
  coupe: 'Coupe',
  truck: 'Truck',
  convertible: 'Convertible',
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
    selectedWindows,
    tintType,
    serviceType,
    shippingCountry,
    totalSqft,
    unitPrice,
    subtotal,
    shippingCost,
    installationCost,
    tax,
    total,
    setStep,
  } = useConfiguratorStore();

  const tint = tintType ? TINT_TYPES[tintType] : null;
  const shipping = shippingCountry ? SHIPPING_INFO[shippingCountry] : null;
  const windowData = carType ? WINDOW_SQFT[carType] || {} : {};

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
            <p className="text-white font-medium">{carType ? CAR_LABELS[carType] : '--'}</p>
          </SummarySection>

          {/* Windows */}
          <SummarySection title="Windows" editStep={2} onEdit={setStep}>
            <div className="space-y-1.5">
              {selectedWindows.map((w) => (
                <div key={w} className="flex items-center justify-between">
                  <span className="text-sm text-white/70">{WINDOW_LABELS[w] || w}</span>
                  <span className="text-xs text-white/40">{windowData[w]} sq.ft</span>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-white/5 flex justify-between">
                <span className="text-sm text-white/50">Total area</span>
                <span className="text-sm font-medium text-white">{totalSqft} sq.ft</span>
              </div>
            </div>
          </SummarySection>

          {/* Tint */}
          <SummarySection title="Tint Film" editStep={3} onEdit={setStep}>
            {tint && (
              <div>
                <p className="text-white font-medium mb-1">{tint.name}</p>
                <div className="flex items-center gap-4 text-xs text-white/40">
                  <span>VLT: {tint.vlt}</span>
                  <span>UV: {tint.uvBlock}%</span>
                  <span>Heat: {tint.heatRejection}%</span>
                </div>
              </div>
            )}
          </SummarySection>

          {/* Service */}
          <SummarySection title="Service" editStep={4} onEdit={setStep}>
            <p className="text-white font-medium">
              {serviceType === 'installation'
                ? 'Professional Installation + Shipping'
                : 'Shipping Only'}
            </p>
          </SummarySection>

          {/* Shipping */}
          <SummarySection title="Shipping" editStep={5} onEdit={setStep}>
            {shipping && (
              <div>
                <p className="text-white font-medium">
                  {shipping.flag} {shipping.name}
                </p>
                <p className="text-xs text-white/40 mt-1">
                  Estimated delivery: {shipping.deliveryTime}
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
                    {tint?.name} Film ({totalSqft} ft&sup2; x ${unitPrice})
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
