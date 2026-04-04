'use client';

import { motion } from 'framer-motion';
import { useConfiguratorStore, WINDOW_SQFT } from '@/store/configuratorStore';

const CAR_TYPES = [
  {
    id: 'sedan',
    label: 'Sedan',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop',
  },
  {
    id: 'suv',
    label: 'SUV',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=250&fit=crop',
  },
  {
    id: 'van',
    label: 'Van',
    image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400&h=250&fit=crop',
  },
  {
    id: 'station_wagon',
    label: 'Station Wagon',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=250&fit=crop',
  },
  {
    id: 'hatchback',
    label: 'Hatchback',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop',
  },
  {
    id: 'coupe',
    label: 'Coupe',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop',
  },
  {
    id: 'truck',
    label: 'Truck',
    image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400&h=250&fit=crop',
  },
  {
    id: 'convertible',
    label: 'Convertible',
    image: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=400&h=250&fit=crop',
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
              {/* Car Image */}
              <div className="w-full h-24 mb-4 overflow-hidden rounded-lg">
                <img
                  src={car.image}
                  alt={`${car.label} car type`}
                  loading="lazy"
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    isSelected ? 'brightness-110 scale-105' : 'brightness-75 group-hover:brightness-90 group-hover:scale-105'
                  }`}
                />
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
