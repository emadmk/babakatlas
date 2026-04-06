'use client';

import { motion } from 'framer-motion';
import { useConfiguratorStore } from '@/store/configuratorStore';

const countries = [
  {
    code: 'PH' as const,
    name: 'Philippines',
    flag: '\u{1F1F5}\u{1F1ED}',
    currency: 'PHP',
    currencySymbol: '\u20B1',
    description: 'Serving Metro Manila and nationwide',
  },
  {
    code: 'AU' as const,
    name: 'Australia',
    flag: '\u{1F1E6}\u{1F1FA}',
    currency: 'AUD',
    currencySymbol: 'A$',
    description: 'All states and territories',
  },
];

export default function CountrySelector() {
  const { country, setCountry } = useConfiguratorStore();

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-semibold text-white mb-2">Select Your Country</h2>
        <p className="text-white/50 text-sm">
          Choose your location to get started with pricing and availability
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {countries.map((c) => {
          const isSelected = country === c.code;
          return (
            <motion.button
              key={c.code}
              onClick={() => setCountry(c.code)}
              className={`relative text-left rounded-2xl p-8 transition-all duration-300 overflow-hidden ${
                isSelected
                  ? 'bg-blue-500/10 ring-2 ring-blue-500'
                  : 'bg-white/[0.03] ring-1 ring-white/10 hover:ring-white/20 hover:bg-white/[0.06]'
              }`}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              animate={
                isSelected
                  ? { boxShadow: '0 0 50px rgba(59,130,246,0.15)' }
                  : { boxShadow: '0 0 0px rgba(59,130,246,0)' }
              }
            >
              {/* Glass morphism overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />

              {/* Flag */}
              <div className="text-6xl mb-5 relative z-10">{c.flag}</div>

              {/* Country name */}
              <h3
                className={`text-2xl font-bold mb-1 relative z-10 ${
                  isSelected ? 'text-white' : 'text-white/80'
                }`}
              >
                {c.name}
              </h3>

              {/* Currency */}
              <div className="flex items-center gap-2 mb-3 relative z-10">
                <span className={`text-sm font-medium px-2 py-0.5 rounded-md ${
                  isSelected ? 'bg-blue-500/20 text-blue-300' : 'bg-white/5 text-white/40'
                }`}>
                  {c.currency}
                </span>
                <span className="text-sm text-white/30">{c.currencySymbol}</span>
              </div>

              {/* Description */}
              <p className="text-sm text-white/40 relative z-10">{c.description}</p>

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  className="absolute top-4 right-4 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center z-10"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <svg
                    className="w-4 h-4 text-white"
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
