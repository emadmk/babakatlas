'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useConfiguratorStore } from '@/store/configuratorStore';
import { Clock, Truck, MapPin, ChevronDown } from 'lucide-react';
import { formatCurrency } from '@/lib/pricing';

const PH_REGIONS = [
  'Metro Manila',
  'Cebu',
  'Davao',
  'Calabarzon',
  'Central Luzon',
  'Western Visayas',
  'Central Visayas',
  'Northern Mindanao',
  'Ilocos Region',
  'Bicol Region',
  'Eastern Visayas',
  'Zamboanga Peninsula',
  'Cordillera Administrative Region',
  'SOCCSKSARGEN',
  'Caraga',
  'BARMM',
];

const AU_STATES = [
  'NSW',
  'VIC',
  'QLD',
  'WA',
  'SA',
  'TAS',
  'ACT',
  'NT',
];

const STATE_LABELS: Record<string, string> = {
  NSW: 'New South Wales',
  VIC: 'Victoria',
  QLD: 'Queensland',
  WA: 'Western Australia',
  SA: 'South Australia',
  TAS: 'Tasmania',
  ACT: 'Australian Capital Territory',
  NT: 'Northern Territory',
};

const countries = [
  { code: 'PH' as const, flag: '\u{1F1F5}\u{1F1ED}' },
  { code: 'AU' as const, flag: '\u{1F1E6}\u{1F1FA}' },
];

export default function ShippingSelector() {
  const {
    shippingCountry,
    setShippingCountry,
    subtotal,
    shippingRates,
    freeShippingThresholds,
    shippingAddress,
    setShippingAddress,
    configLoaded,
  } = useConfiguratorStore();

  // Get the free shipping threshold from config (API) for the selected country
  const freeThreshold = shippingCountry
    ? (freeShippingThresholds[shippingCountry] ?? 200)
    : 200;
  const freeShipping = subtotal >= freeThreshold;

  // Get shipping rate info from API-loaded data or fallback
  function getShippingInfo(code: string) {
    const apiRate = shippingRates.find((r) => r.country === code && r.active);
    if (apiRate) {
      return {
        name: apiRate.countryName?.en ?? code,
        baseCost: apiRate.baseRate,
        deliveryTime: `${apiRate.deliveryDays.min}-${apiRate.deliveryDays.max} business days`,
        flag: apiRate.flag,
        freeAbove: apiRate.freeAbove,
      };
    }
    // Fallback for before config loads
    const fallbacks: Record<string, { name: string; baseCost: number; deliveryTime: string; flag: string; freeAbove: number }> = {
      PH: { name: 'Philippines', baseCost: 15, deliveryTime: '7-14 business days', flag: '\u{1F1F5}\u{1F1ED}', freeAbove: 200 },
      AU: { name: 'Australia', baseCost: 25, deliveryTime: '5-10 business days', flag: '\u{1F1E6}\u{1F1FA}', freeAbove: 300 },
    };
    return fallbacks[code] ?? { name: code, baseCost: 0, deliveryTime: '', flag: '', freeAbove: 200 };
  }

  const regions = shippingCountry === 'AU' ? AU_STATES : PH_REGIONS;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-semibold text-white mb-2">Shipping Destination</h2>
        <p className="text-white/50 text-sm">Select your country and enter shipping details</p>
      </div>

      {/* Free shipping banner */}
      {freeShipping && shippingCountry && (
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

      {/* Country selection cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {countries.map((country) => {
          const info = getShippingInfo(country.code);
          const isSelected = shippingCountry === country.code;
          const countryFreeShipping = subtotal >= info.freeAbove;

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
              <div className="text-5xl mb-4">{info.flag}</div>

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
                    {countryFreeShipping ? (
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

              {!countryFreeShipping && (
                <p className="mt-4 text-[11px] text-white/30">
                  Free shipping on orders over ${info.freeAbove}
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

      {/* Shipping Address Form (shown after country selection) */}
      <AnimatePresence>
        {shippingCountry && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            <div className="rounded-2xl p-6 bg-white/[0.03] ring-1 ring-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white/70" />
                </div>
                <h3 className="text-lg font-semibold text-white">Shipping Address</h3>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm text-white/50 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={shippingAddress.name}
                    onChange={(e) => setShippingAddress({ name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all"
                  />
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-sm text-white/50 mb-1.5">Street Address</label>
                  <input
                    type="text"
                    value={shippingAddress.street1}
                    onChange={(e) => setShippingAddress({ street1: e.target.value })}
                    placeholder="123 Main Street"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all"
                  />
                </div>

                {/* City + State/Province + ZIP */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-white/50 mb-1.5">City</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ city: e.target.value })}
                      placeholder={shippingCountry === 'PH' ? 'Manila' : 'Sydney'}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/50 mb-1.5">
                      {shippingCountry === 'AU' ? 'State' : 'Region'}
                    </label>
                    <div className="relative">
                      <select
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ state: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all appearance-none pr-10"
                      >
                        <option value="" className="bg-neutral-900 text-white/50">
                          Select...
                        </option>
                        {regions.map((r) => (
                          <option key={r} value={r} className="bg-neutral-900">
                            {shippingCountry === 'AU' ? (STATE_LABELS[r] ?? r) : r}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-white/50 mb-1.5">
                      {shippingCountry === 'AU' ? 'Postcode' : 'ZIP Code'}
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.zip}
                      onChange={(e) => setShippingAddress({ zip: e.target.value })}
                      placeholder={shippingCountry === 'PH' ? '1000' : '2000'}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all"
                    />
                  </div>
                </div>

                {/* Country (auto-filled, read-only) */}
                <div>
                  <label className="block text-sm text-white/50 mb-1.5">Country</label>
                  <div className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60">
                    {getShippingInfo(shippingCountry).flag}{' '}
                    {getShippingInfo(shippingCountry).name}
                  </div>
                </div>
              </div>

              {/* Shipping rate display */}
              {configLoaded && (
                <div className="mt-6 pt-5 border-t border-white/10">
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-3">
                    Estimated Shipping Rate
                  </p>
                  {(() => {
                    const info = getShippingInfo(shippingCountry);
                    const isFree = subtotal >= info.freeAbove;
                    return (
                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] ring-1 ring-white/10">
                        <div className="flex items-center gap-3">
                          <Truck className="w-5 h-5 text-white/40" />
                          <div>
                            <p className="text-sm text-white/80">Standard Delivery</p>
                            <p className="text-xs text-white/40">{info.deliveryTime}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-medium ${isFree ? 'text-emerald-400' : 'text-white'}`}>
                          {isFree ? 'Free' : formatCurrency(info.baseCost, shippingCountry)}
                        </span>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
