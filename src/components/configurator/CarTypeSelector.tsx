'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useConfiguratorStore } from '@/store/configuratorStore';

interface CarTypeItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  imageUrl?: string;
  totalSqft?: number;
  sizeGroup?: string;
  glassArea?: { totalArea: number } | null;
}

function LoadingSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-10 space-y-2">
        <div className="w-64 h-8 bg-white/10 rounded-lg mx-auto animate-pulse" />
        <div className="w-48 h-4 bg-white/5 rounded-lg mx-auto animate-pulse" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-full h-44 bg-white/5 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function CarTypeSelector() {
  const { carType, setCarType } = useConfiguratorStore();
  const [carTypes, setCarTypes] = useState<CarTypeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchCarTypes() {
      try {
        const res = await fetch('/api/products/cars');
        if (!res.ok) throw new Error('Failed to fetch car types');
        const data = await res.json();
        if (!cancelled) {
          const items = data.data || data;
          setCarTypes(Array.isArray(items) ? items : []);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch car types:', err);
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchCarTypes();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <LoadingSkeleton />;

  if (error || carTypes.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto text-center">
        <p className="text-white/50 text-sm mb-4">Unable to load car types.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-medium ring-1 ring-blue-500/30 hover:bg-blue-500/20 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-semibold text-white mb-2">Select Your Vehicle Type</h2>
        <p className="text-white/50 text-sm">
          Choose the body style that matches your vehicle
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {carTypes.map((car) => {
          const isSelected = carType === car.slug;
          const imgSrc = car.imageUrl;

          return (
            <motion.button
              key={car.id}
              onClick={() => setCarType(car.slug)}
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
              {imgSrc && (
                <div className="w-full h-24 mb-4 overflow-hidden rounded-lg">
                  <img
                    src={imgSrc}
                    alt={`${car.name} vehicle type`}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      isSelected ? 'brightness-110 scale-105' : 'brightness-75 group-hover:brightness-90 group-hover:scale-105'
                    }`}
                  />
                </div>
              )}

              {/* Label */}
              <div
                className={`text-sm font-medium mb-1 transition-colors duration-300 ${
                  isSelected ? 'text-white' : 'text-white/70'
                }`}
              >
                {car.name}
              </div>

              {/* Info */}
              <div className="text-xs text-white/40 space-y-0.5">
                {car.glassArea && (
                  <div>Glass area: {car.glassArea.totalArea} sqm</div>
                )}
                {car.sizeGroup && (
                  <div className="text-[10px] text-white/30">
                    Size: {car.sizeGroup}
                  </div>
                )}
              </div>

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
