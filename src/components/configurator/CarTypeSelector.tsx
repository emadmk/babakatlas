'use client';

import { motion } from 'framer-motion';
import { useConfiguratorStore, WINDOW_SQFT } from '@/store/configuratorStore';

const CAR_TYPES = [
  {
    id: 'sedan',
    label: 'Sedan',
    svg: (
      <svg viewBox="0 0 120 60" fill="none" className="w-full h-full">
        <path
          d="M15 40 Q15 35 20 32 L35 28 Q45 18 60 16 L85 16 Q95 18 100 28 L108 32 Q112 35 112 40"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <line x1="12" y1="40" x2="115" y2="40" stroke="currentColor" strokeWidth="2" />
        <circle cx="32" cy="42" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="92" cy="42" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="55" y1="17" x2="55" y2="28" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <line x1="75" y1="16" x2="75" y2="28" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'suv',
    label: 'SUV',
    svg: (
      <svg viewBox="0 0 120 60" fill="none" className="w-full h-full">
        <path
          d="M15 38 L20 28 Q25 14 40 12 L85 12 Q100 14 105 28 L110 38"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <line x1="12" y1="38" x2="115" y2="38" stroke="currentColor" strokeWidth="2" />
        <circle cx="30" cy="42" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="92" cy="42" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="50" y1="13" x2="50" y2="28" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <line x1="70" y1="12" x2="70" y2="28" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <line x1="88" y1="13" x2="88" y2="28" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'van',
    label: 'Van',
    svg: (
      <svg viewBox="0 0 120 60" fill="none" className="w-full h-full">
        <path
          d="M18 38 L20 15 Q22 10 28 10 L95 10 Q102 10 104 15 L108 38"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <line x1="15" y1="38" x2="112" y2="38" stroke="currentColor" strokeWidth="2" />
        <circle cx="30" cy="42" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="92" cy="42" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="45" y1="11" x2="45" y2="30" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <line x1="65" y1="10" x2="65" y2="30" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <line x1="85" y1="10" x2="85" y2="30" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'station_wagon',
    label: 'Station Wagon',
    svg: (
      <svg viewBox="0 0 120 60" fill="none" className="w-full h-full">
        <path
          d="M15 38 L22 30 Q35 18 50 16 L95 16 Q105 17 108 30 L110 38"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <line x1="12" y1="38" x2="115" y2="38" stroke="currentColor" strokeWidth="2" />
        <circle cx="30" cy="42" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="92" cy="42" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="55" y1="16" x2="55" y2="28" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <line x1="78" y1="16" x2="78" y2="28" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'hatchback',
    label: 'Hatchback',
    svg: (
      <svg viewBox="0 0 120 60" fill="none" className="w-full h-full">
        <path
          d="M15 38 Q18 32 25 28 L40 20 Q50 16 60 16 L80 16 Q95 18 100 28 L105 32 Q108 36 108 38"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <line x1="12" y1="38" x2="112" y2="38" stroke="currentColor" strokeWidth="2" />
        <circle cx="30" cy="42" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="90" cy="42" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="58" y1="16" x2="58" y2="26" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'coupe',
    label: 'Coupe',
    svg: (
      <svg viewBox="0 0 120 60" fill="none" className="w-full h-full">
        <path
          d="M12 38 Q14 34 18 30 L38 20 Q55 14 70 14 L90 16 Q102 20 106 30 Q108 34 110 38"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <line x1="10" y1="38" x2="115" y2="38" stroke="currentColor" strokeWidth="2" />
        <circle cx="28" cy="42" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="94" cy="42" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="62" y1="14" x2="62" y2="26" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'truck',
    label: 'Truck',
    svg: (
      <svg viewBox="0 0 120 60" fill="none" className="w-full h-full">
        <path
          d="M15 38 L20 28 Q30 16 45 14 L65 14 Q72 14 72 20 L72 38"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path d="M72 22 L108 22 L108 38" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="12" y1="38" x2="115" y2="38" stroke="currentColor" strokeWidth="2" />
        <circle cx="30" cy="42" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="95" cy="42" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    id: 'convertible',
    label: 'Convertible',
    svg: (
      <svg viewBox="0 0 120 60" fill="none" className="w-full h-full">
        <path
          d="M12 38 Q14 34 18 30 L40 24 Q55 22 70 22 L95 24 Q105 28 108 34 L110 38"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <line x1="10" y1="38" x2="115" y2="38" stroke="currentColor" strokeWidth="2" />
        <circle cx="28" cy="42" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="94" cy="42" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
        {/* No roof line - it's a convertible */}
        <path d="M50 23 Q55 20 60 23" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      </svg>
    ),
  },
];

export default function CarTypeSelector() {
  const { carType, setCarType } = useConfiguratorStore();

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-semibold text-white mb-2">Select Your Car Type</h2>
        <p className="text-white/50 text-sm">
          Choose the body style that matches your vehicle
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CAR_TYPES.map((car) => {
          const isSelected = carType === car.id;
          const windowCount = Object.keys(WINDOW_SQFT[car.id] || {}).length;

          return (
            <motion.button
              key={car.id}
              onClick={() => setCarType(car.id)}
              className={`relative group rounded-2xl p-6 text-left transition-all duration-300 ${
                isSelected
                  ? 'bg-blue-500/10 ring-2 ring-blue-500'
                  : 'bg-white/[0.03] ring-1 ring-white/10 hover:ring-white/20 hover:bg-white/[0.06]'
              }`}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              animate={
                isSelected
                  ? { boxShadow: '0 0 30px rgba(59,130,246,0.15)' }
                  : { boxShadow: '0 0 0px rgba(59,130,246,0)' }
              }
            >
              {/* Car SVG */}
              <div
                className={`w-full h-16 mb-4 transition-colors duration-300 ${
                  isSelected ? 'text-blue-400' : 'text-white/40 group-hover:text-white/60'
                }`}
              >
                {car.svg}
              </div>

              {/* Label */}
              <div
                className={`text-sm font-medium mb-1 transition-colors duration-300 ${
                  isSelected ? 'text-white' : 'text-white/70'
                }`}
              >
                {car.label}
              </div>

              {/* Window count */}
              <div className="text-xs text-white/40">{windowCount} windows</div>

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  className="absolute top-3 right-3 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
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
