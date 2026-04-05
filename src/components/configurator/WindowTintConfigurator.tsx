'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useConfiguratorStore,
  TINT_TYPES,
  SHADE_LEVELS,
  WINDOW_GROUPS,
} from '@/store/configuratorStore';
import type { WindowConfig } from '@/store/configuratorStore';
import { ChevronDown, Layers, Zap, Shield } from 'lucide-react';

const tintKeys = Object.keys(TINT_TYPES);
const shadeKeys = Object.keys(SHADE_LEVELS);

// Shade visual opacity for the circle indicators
const SHADE_OPACITY: Record<string, number> = {
  light: 0.25,
  medium: 0.5,
  dark: 0.8,
  limo: 0.95,
};

function TintDropdown({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = TINT_TYPES[value];

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          disabled
            ? 'bg-white/5 text-white/20 cursor-not-allowed'
            : 'bg-white/[0.06] text-white/80 hover:bg-white/10 ring-1 ring-white/10'
        }`}
      >
        <span>{selected?.name || value}</span>
        <span className="text-white/40">${selected?.pricePerSqft}/ft²</span>
        <ChevronDown className="w-3 h-3 text-white/40" />
      </button>

      <AnimatePresence>
        {open && !disabled && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute z-40 top-full mt-1 left-0 w-56 rounded-xl bg-[#1a1a1a] ring-1 ring-white/10 shadow-2xl overflow-hidden"
            >
              {tintKeys.map((key) => {
                const tint = TINT_TYPES[key];
                const isActive = value === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      onChange(key);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${
                      isActive
                        ? 'bg-blue-500/15 text-blue-400'
                        : 'text-white/70 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{tint.name}</span>
                        {tint.badge && (
                          <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30">
                            {tint.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-white/40">${tint.pricePerSqft}/ft²</span>
                    </div>
                    <p className="text-white/30 text-[10px] mt-0.5">{tint.description}</p>
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ShadeSelector({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {shadeKeys.map((key) => {
        const shade = SHADE_LEVELS[key];
        const isActive = value === key;
        return (
          <button
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => onChange(key)}
            title={`${shade.name} (${shade.vlt}% VLT) - ${shade.description}`}
            className={`group relative flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] transition-all ${
              disabled
                ? 'cursor-not-allowed opacity-30'
                : isActive
                  ? 'bg-blue-500/15 ring-1 ring-blue-500/40 text-blue-400'
                  : 'hover:bg-white/5 text-white/40'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full ring-1 transition-all ${
                isActive ? 'ring-blue-400 scale-110' : 'ring-white/20'
              }`}
              style={{ backgroundColor: `rgba(0,0,0,${SHADE_OPACITY[key]})` }}
            />
            <span className="font-medium">{shade.vlt}%</span>
          </button>
        );
      })}
    </div>
  );
}

function WindowCard({ window: w }: { window: WindowConfig }) {
  const { toggleWindow, setWindowTint, setWindowShade } = useConfiguratorStore();
  const tint = TINT_TYPES[w.tintType];
  const shade = SHADE_LEVELS[w.shade];

  return (
    <motion.div
      layout
      className={`rounded-xl p-4 transition-all duration-300 ${
        w.enabled
          ? 'bg-white/[0.04] ring-1 ring-white/10'
          : 'bg-white/[0.02] ring-1 ring-white/5 opacity-50'
      }`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Checkbox */}
          <button
            onClick={() => toggleWindow(w.position)}
            className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all ${
              w.enabled ? 'bg-blue-500' : 'bg-white/10 ring-1 ring-white/20'
            }`}
          >
            {w.enabled && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <span className={`text-sm font-medium ${w.enabled ? 'text-white' : 'text-white/40'}`}>
            {w.label}
          </span>
        </div>
        <span className={`text-xs ${w.enabled ? 'text-white/50' : 'text-white/20'}`}>
          {w.sqft} sq.ft
        </span>
      </div>

      {/* Config row */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/30 uppercase tracking-wider">Tint</span>
          <TintDropdown
            value={w.tintType}
            onChange={(val) => setWindowTint(w.position, val)}
            disabled={!w.enabled}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/30 uppercase tracking-wider">Shade</span>
          <ShadeSelector
            value={w.shade}
            onChange={(val) => setWindowShade(w.position, val)}
            disabled={!w.enabled}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-[11px]">
        <div className="flex items-center gap-1 text-white/30">
          <Layers className="w-3 h-3" />
          <span>VLT: {shade?.vlt ?? '--'}%</span>
        </div>
        <div className="flex items-center gap-1 text-white/30">
          <Shield className="w-3 h-3" />
          <span>UV: {tint?.uvBlock ?? '--'}%</span>
        </div>
        <div className="ml-auto">
          <span className={`text-sm font-semibold ${w.enabled ? 'text-blue-400' : 'text-white/20'}`}>
            ${w.enabled ? (w.sqft * w.pricePerSqft).toFixed(2) : '0.00'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function QuickApplyBar() {
  const { applyToAll, applyToGroup, windows } = useConfiguratorStore();
  const [bulkTint, setBulkTint] = useState('ceramic');
  const [bulkShade, setBulkShade] = useState('medium');

  const hasWindows = windows.length > 0;

  return (
    <div className="rounded-xl bg-white/[0.03] ring-1 ring-white/10 p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-blue-400" />
        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Quick Apply</span>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/30">Tint:</span>
          <TintDropdown value={bulkTint} onChange={setBulkTint} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/30">Shade:</span>
          <ShadeSelector value={bulkShade} onChange={setBulkShade} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          disabled={!hasWindows}
          onClick={() => applyToAll(bulkTint, bulkShade)}
          className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-medium ring-1 ring-blue-500/30 hover:bg-blue-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Apply to All
        </button>
        {(Object.keys(WINDOW_GROUPS) as Array<'front' | 'rear' | 'sides'>).map((groupKey) => (
          <button
            key={groupKey}
            disabled={!hasWindows}
            onClick={() => applyToGroup(groupKey, bulkTint, bulkShade)}
            className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 text-xs font-medium ring-1 ring-white/10 hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {WINDOW_GROUPS[groupKey].label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function WindowTintConfigurator() {
  const { windows, subtotal } = useConfiguratorStore();
  const enabledCount = windows.filter((w) => w.enabled).length;
  const enabledSqft = windows.filter((w) => w.enabled).reduce((s, w) => s + w.sqft, 0);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-white mb-2">Configure Windows & Tint</h2>
        <p className="text-white/50 text-sm">
          Choose different tint types and shade levels for each window
        </p>
      </div>

      {/* Quick Apply */}
      <QuickApplyBar />

      {/* Window cards */}
      <div className="space-y-3">
        {windows.map((w) => (
          <WindowCard key={w.position} window={w} />
        ))}
      </div>

      {/* Running total */}
      {windows.length > 0 && (
        <motion.div
          className="mt-6 rounded-xl bg-white/[0.03] ring-1 ring-white/10 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm text-white/50">
              <span>
                Enabled: <span className="text-white font-medium">{enabledCount}</span> of{' '}
                {windows.length} windows
              </span>
              <span>
                Total area: <span className="text-white font-medium">{enabledSqft} sq.ft</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-white/40">Subtotal</span>
              <motion.div
                key={subtotal}
                className="text-2xl font-bold text-white"
                initial={{ scale: 1.1, color: '#60a5fa' }}
                animate={{ scale: 1, color: '#ffffff' }}
                transition={{ duration: 0.3 }}
              >
                ${subtotal.toFixed(2)}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
