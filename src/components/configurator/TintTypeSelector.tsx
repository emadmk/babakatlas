'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useConfiguratorStore } from '@/store/configuratorStore';
import { Shield, Thermometer, Sun } from 'lucide-react';

interface TintTypeItem {
  id: string;
  name: string;
  description: string;
  pricePerSqft: number;
  vlt: string;
  uvBlock: number;
  heatRejection: number;
  badge?: string;
  darkness?: number;
}

// Visual darkness levels fallback
const DEFAULT_DARKNESS: Record<string, number> = {
  standard: 65,
  metallic: 75,
  carbon: 60,
  ceramic: 45,
  crystalline: 25,
  adaptive: 50,
};

function LoadingSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-10 space-y-2">
        <div className="w-56 h-8 bg-white/10 rounded-lg mx-auto animate-pulse" />
        <div className="w-72 h-4 bg-white/5 rounded-lg mx-auto animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-full h-64 bg-white/5 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function TintTypeSelector() {
  const { tintType, setTintType, totalSqft } = useConfiguratorStore();
  const [tintTypes, setTintTypes] = useState<TintTypeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchTintTypes() {
      try {
        const res = await fetch('/api/products/tints');
        if (!res.ok) throw new Error('Failed to fetch tint types');
        const data = await res.json();
        if (!cancelled) {
          const items = Array.isArray(data) ? data : data.tints || data.products || [];
          setTintTypes(items);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch tint types:', err);
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchTintTypes();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <LoadingSkeleton />;

  if (error || tintTypes.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto text-center">
        <p className="text-white/50 text-sm mb-4">Unable to load tint types.</p>
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
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-semibold text-white mb-2">Choose Your Tint</h2>
        <p className="text-white/50 text-sm">
          Select the film technology that best fits your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tintTypes.map((tint) => {
          const id = tint.id;
          const isSelected = tintType === id;
          const darkness = tint.darkness ?? DEFAULT_DARKNESS[id] ?? 50;
          const estimatedCost = totalSqft * tint.pricePerSqft;

          return (
            <motion.button
              key={id}
              onClick={() => setTintType(id)}
              className={`relative text-left rounded-2xl p-6 transition-all duration-300 ${
                isSelected
                  ? 'bg-blue-500/10 ring-2 ring-blue-500'
                  : 'bg-white/[0.03] ring-1 ring-white/10 hover:ring-white/20 hover:bg-white/[0.06]'
              }`}
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.99 }}
              animate={
                isSelected
                  ? { boxShadow: '0 0 40px rgba(59,130,246,0.12)' }
                  : { boxShadow: '0 0 0px rgba(59,130,246,0)' }
              }
            >
              {/* Badge */}
              {tint.badge && (
                <div
                  className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                    tint.badge === 'Premium'
                      ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30'
                      : 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30'
                  }`}
                >
                  {tint.badge}
                </div>
              )}

              {/* Tint darkness preview */}
              <div className="mb-4 h-3 rounded-full overflow-hidden bg-white/5 ring-1 ring-white/10">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(to right, rgba(0,0,0,${darkness / 100}), rgba(0,0,0,${(darkness + 20) / 100}))`,
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${darkness}%` }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                />
              </div>

              {/* Name and price */}
              <div className="flex items-baseline justify-between mb-2">
                <h3 className={`text-lg font-semibold ${isSelected ? 'text-white' : 'text-white/80'}`}>
                  {tint.name}
                </h3>
                <div className="text-right">
                  <span className={`text-lg font-bold ${isSelected ? 'text-blue-400' : 'text-white/70'}`}>
                    ${tint.pricePerSqft}
                  </span>
                  <span className="text-white/40 text-xs">/ft&sup2;</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-white/40 text-xs mb-4 leading-relaxed">{tint.description}</p>

              {/* Stats */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sun className="w-3.5 h-3.5 text-white/30" />
                  <span className="text-xs text-white/50">VLT</span>
                  <span className="text-xs text-white/70 ml-auto">{tint.vlt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-white/30" />
                  <span className="text-xs text-white/50">UV Block</span>
                  <span className="text-xs text-white/70 ml-auto">{tint.uvBlock}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-3.5 h-3.5 text-white/30" />
                  <span className="text-xs text-white/50">Heat Rejection</span>
                  <span className="text-xs text-white/70 ml-auto">{tint.heatRejection}%</span>
                </div>
              </div>

              {/* Estimated cost */}
              {totalSqft > 0 && (
                <div className="mt-4 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-white/30">Est. for {totalSqft} ft&sup2;</span>
                    <span
                      className={`text-sm font-semibold ${isSelected ? 'text-blue-400' : 'text-white/50'}`}
                    >
                      ${estimatedCost}
                    </span>
                  </div>
                </div>
              )}

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  className="absolute top-4 left-4 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
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
