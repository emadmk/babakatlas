'use client';

import { motion } from 'framer-motion';
import { useConfiguratorStore, SHIPPING_INFO } from '@/store/configuratorStore';
import { Clock, Truck } from 'lucide-react';

const countries = [
  { code: 'PH' as const, flag: '\u{1F1F5}\u{1F1ED}' },
  { code: 'AU' as const, flag: '\u{1F1E6}\u{1F1FA}' },
];

export default function ShippingSelector() {
  const { shippingCountry, setShippingCountry, subtotal } = useConfiguratorStore();
  const freeShipping = subtotal >= 200;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-semibold text-white mb-2">Shipping Destination</h2>
        <p className="text-white/50 text-sm">Select your country for delivery</p>
      </div>

      {/* Free shipping banner */}
      {freeShipping && (
        <motion.div
          className="mb-8 p-4 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/30 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-2">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">
              Your order qualifies for free shipping!
            </span>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {countries.map((country) => {
          const info = SHIPPING_INFO[country.code];
          const isSelected = shippingCountry === country.code;

          return (
            <motion.button
              key={country.code}
              onClick={() => setShippingCountry(country.code)}
              className={`relative text-left rounded-2xl p-8 transition-all duration-300 ${
                isSelected
                  ? 'bg-blue-500/10 ring-2 ring-blue-500'
                  : 'bg-white/[0.03] ring-1 ring-white/10 hover:ring-white/20 hover:bg-white/[0.06]'
              }`}
              whileHover={{ scale: 1.01, y: -3 }}
              whileTap={{ scale: 0.99 }}
              animate={
                isSelected
                  ? { boxShadow: '0 0 40px rgba(59,130,246,0.12)' }
                  : { boxShadow: '0 0 0px rgba(59,130,246,0)' }
              }
            >
              {/* Flag */}
              <div className="text-5xl mb-4">{country.flag}</div>

              {/* Country name */}
              <h3
                className={`text-xl font-semibold mb-4 ${
                  isSelected ? 'text-white' : 'text-white/80'
                }`}
              >
                {info.name}
              </h3>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-white/30 flex-shrink-0" />
                  <span className="text-sm text-white/50">{info.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-white/30 flex-shrink-0" />
                  <span className="text-sm text-white/50">
                    {freeShipping ? (
                      <>
                        <span className="line-through text-white/30">${info.baseCost}</span>
                        <span className="ml-2 text-emerald-400 font-medium">Free</span>
                      </>
                    ) : (
                      <>Base shipping: ${info.baseCost}</>
                    )}
                  </span>
                </div>
              </div>

              {!freeShipping && (
                <p className="mt-4 text-[11px] text-white/30">
                  Free shipping on orders over $200
                </p>
              )}

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
