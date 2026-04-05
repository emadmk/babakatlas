'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useConfiguratorStore,
  TINT_TYPES,
  SHADE_LEVELS,
  WINDOW_GROUPS,
} from '@/store/configuratorStore';
import type { WindowConfig } from '@/store/configuratorStore';
import { ChevronDown, Layers, Zap, Shield, List, Car } from 'lucide-react';

// ---------- Types for API-fetched tint products ----------

interface TintShadeFromAPI {
  id: string;
  name: string;
  vlt: number;
  priceMultiplier: number;
}

interface TintProductFromAPI {
  id: string;
  name: string;
  slug: string;
  tintType: string;
  description: string;
  pricePerSqft: number;
  specs: { vlt: string; uvBlock: string; heatRejection: string };
  badge: string | null;
  shades: TintShadeFromAPI[];
}

// ---------- Helpers ----------

const tintKeys = Object.keys(TINT_TYPES);

function getShadesForTint(
  tintType: string,
  tintProducts: TintProductFromAPI[]
): TintShadeFromAPI[] {
  const product = tintProducts.find((p) => p.tintType === tintType || p.slug === tintType);
  if (product && product.shades && product.shades.length > 0) {
    return product.shades;
  }
  // Fallback to hardcoded SHADE_LEVELS
  return Object.entries(SHADE_LEVELS).map(([key, val]) => ({
    id: key,
    name: val.name,
    vlt: val.vlt,
    priceMultiplier: 1.0,
  }));
}

function getShadeOpacity(vlt: number): number {
  // Lower VLT = darker = higher opacity
  return Math.max(0.1, 1 - vlt / 100);
}

// ---------- Tint Dropdown ----------

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

// ---------- Dynamic Shade Selector ----------

function DynamicShadeSelector({
  value,
  shades,
  onChange,
  disabled,
}: {
  value: string;
  shades: TintShadeFromAPI[];
  onChange: (shadeId: string, multiplier: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {shades.map((shade) => {
        const isActive = value === shade.id;
        const opacity = getShadeOpacity(shade.vlt);
        return (
          <button
            key={shade.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(shade.id, shade.priceMultiplier)}
            title={`${shade.name} (${shade.vlt}% VLT)${shade.priceMultiplier !== 1 ? ` - ${shade.priceMultiplier}x price` : ''}`}
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
              style={{ backgroundColor: `rgba(0,0,0,${opacity})` }}
            />
            <span className="font-medium">{shade.vlt}%</span>
            {shade.priceMultiplier !== 1.0 && (
              <span className="text-[8px] text-yellow-400/70">{shade.priceMultiplier}x</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ---------- Window Card ----------

function WindowCard({
  window: w,
  tintProducts,
}: {
  window: WindowConfig;
  tintProducts: TintProductFromAPI[];
}) {
  const { toggleWindow, setWindowTint, setWindowShadeWithMultiplier } = useConfiguratorStore();
  const tint = TINT_TYPES[w.tintType];
  const shades = getShadesForTint(w.tintType, tintProducts);
  const currentShade = shades.find((s) => s.id === w.shade);

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
          <DynamicShadeSelector
            value={w.shade}
            shades={shades}
            onChange={(shadeId, multiplier) => setWindowShadeWithMultiplier(w.position, shadeId, multiplier)}
            disabled={!w.enabled}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-[11px]">
        <div className="flex items-center gap-1 text-white/30">
          <Layers className="w-3 h-3" />
          <span>VLT: {currentShade?.vlt ?? '--'}%</span>
        </div>
        <div className="flex items-center gap-1 text-white/30">
          <Shield className="w-3 h-3" />
          <span>UV: {tint?.uvBlock ?? '--'}%</span>
        </div>
        <div className="ml-auto">
          <span className={`text-sm font-semibold ${w.enabled ? 'text-blue-400' : 'text-white/20'}`}>
            ${w.enabled ? (w.sqft * w.pricePerSqft * (w.shadeMultiplier || 1)).toFixed(2) : '0.00'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ---------- Quick Apply Bar ----------

function QuickApplyBar({ tintProducts }: { tintProducts: TintProductFromAPI[] }) {
  const { applyToAllWithMultiplier, applyToGroupWithMultiplier, windows } = useConfiguratorStore();
  const [bulkTint, setBulkTint] = useState('ceramic');
  const [bulkShade, setBulkShade] = useState('medium');
  const [bulkMultiplier, setBulkMultiplier] = useState(1.0);

  const shades = getShadesForTint(bulkTint, tintProducts);
  const hasWindows = windows.length > 0;

  const handleShadeChange = useCallback((shadeId: string, multiplier: number) => {
    setBulkShade(shadeId);
    setBulkMultiplier(multiplier);
  }, []);

  return (
    <div className="rounded-xl bg-white/[0.03] ring-1 ring-white/10 p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-blue-400" />
        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Quick Apply</span>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/30">Tint:</span>
          <TintDropdown value={bulkTint} onChange={(val) => {
            setBulkTint(val);
            // Reset shade to first available shade for new tint
            const newShades = getShadesForTint(val, tintProducts);
            if (newShades.length > 0) {
              setBulkShade(newShades[0].id);
              setBulkMultiplier(newShades[0].priceMultiplier);
            }
          }} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/30">Shade:</span>
          <DynamicShadeSelector
            value={bulkShade}
            shades={shades}
            onChange={handleShadeChange}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          disabled={!hasWindows}
          onClick={() => applyToAllWithMultiplier(bulkTint, bulkShade, bulkMultiplier)}
          className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-medium ring-1 ring-blue-500/30 hover:bg-blue-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Apply to All
        </button>
        {(Object.keys(WINDOW_GROUPS) as Array<'front' | 'rear' | 'sides'>).map((groupKey) => (
          <button
            key={groupKey}
            disabled={!hasWindows}
            onClick={() => applyToGroupWithMultiplier(groupKey, bulkTint, bulkShade, bulkMultiplier)}
            className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 text-xs font-medium ring-1 ring-white/10 hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {WINDOW_GROUPS[groupKey].label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- SVG Car Visual View ----------

interface WindowAreaProps {
  windowKey: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  window: WindowConfig | undefined;
  onClick: (windowKey: string) => void;
}

function WindowArea({ windowKey, label, x, y, width, height, window: w, onClick }: WindowAreaProps) {
  const [hovered, setHovered] = useState(false);
  const fillOpacity = w?.enabled && w.shadeMultiplier
    ? getShadeOpacity(
        // Try to derive VLT from shade data - use a rough mapping
        w.shade === 'light' ? 70 : w.shade === 'medium' ? 35 : w.shade === 'dark' ? 15 : w.shade === 'limo' ? 5 : 50
      )
    : 0.1;

  const tint = w ? TINT_TYPES[w.tintType] : null;

  return (
    <g
      onClick={() => onClick(windowKey)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="cursor-pointer"
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={4}
        fill={w?.enabled ? `rgba(59, 130, 246, ${fillOpacity})` : 'rgba(255,255,255,0.05)'}
        stroke={hovered ? '#3b82f6' : w?.enabled ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}
        strokeWidth={hovered ? 2 : 1}
        className="transition-all duration-200"
      />
      <text
        x={x + width / 2}
        y={y + height / 2 - 4}
        textAnchor="middle"
        className="fill-white/60 text-[9px] font-medium pointer-events-none select-none"
      >
        {label}
      </text>
      {w?.enabled && tint && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 8}
          textAnchor="middle"
          className="fill-white/30 text-[7px] pointer-events-none select-none"
        >
          {tint.name}
        </text>
      )}
      {hovered && w?.enabled && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 18}
          textAnchor="middle"
          className="fill-blue-400/60 text-[7px] pointer-events-none select-none"
        >
          Click to configure
        </text>
      )}
    </g>
  );
}

function VisualWindowConfigPanel({
  windowConfig,
  tintProducts,
  onClose,
}: {
  windowConfig: WindowConfig;
  tintProducts: TintProductFromAPI[];
  onClose: () => void;
}) {
  const { setWindowTint, setWindowShadeWithMultiplier, toggleWindow } = useConfiguratorStore();
  const shades = getShadesForTint(windowConfig.tintType, tintProducts);
  const tint = TINT_TYPES[windowConfig.tintType];
  const currentShade = shades.find((s) => s.id === windowConfig.shade);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white/[0.06] ring-1 ring-white/10 rounded-xl p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white">{windowConfig.label}</h4>
        <button onClick={onClose} className="text-white/40 hover:text-white text-xs">
          Close
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => toggleWindow(windowConfig.position)}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
            windowConfig.enabled
              ? 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30'
              : 'bg-white/5 text-white/40 ring-1 ring-white/10'
          }`}
        >
          {windowConfig.enabled ? 'Enabled' : 'Disabled'}
        </button>
        <span className="text-xs text-white/40">{windowConfig.sqft} sq.ft</span>
      </div>

      <div>
        <span className="text-[10px] text-white/30 uppercase tracking-wider block mb-1">Tint Type</span>
        <TintDropdown
          value={windowConfig.tintType}
          onChange={(val) => setWindowTint(windowConfig.position, val)}
          disabled={!windowConfig.enabled}
        />
      </div>

      <div>
        <span className="text-[10px] text-white/30 uppercase tracking-wider block mb-1">Shade Level</span>
        <DynamicShadeSelector
          value={windowConfig.shade}
          shades={shades}
          onChange={(shadeId, multiplier) => setWindowShadeWithMultiplier(windowConfig.position, shadeId, multiplier)}
          disabled={!windowConfig.enabled}
        />
      </div>

      <div className="flex items-center gap-4 text-[11px] pt-2 border-t border-white/10">
        <div className="flex items-center gap-1 text-white/30">
          <Layers className="w-3 h-3" />
          <span>VLT: {currentShade?.vlt ?? '--'}%</span>
        </div>
        <div className="flex items-center gap-1 text-white/30">
          <Shield className="w-3 h-3" />
          <span>UV: {tint?.uvBlock ?? '--'}%</span>
        </div>
        <span className="ml-auto text-sm font-semibold text-blue-400">
          ${windowConfig.enabled ? (windowConfig.sqft * windowConfig.pricePerSqft * (windowConfig.shadeMultiplier || 1)).toFixed(2) : '0.00'}
        </span>
      </div>
    </motion.div>
  );
}

function CarVisualView({ tintProducts }: { tintProducts: TintProductFromAPI[] }) {
  const { windows } = useConfiguratorStore();
  const [selectedWindow, setSelectedWindow] = useState<string | null>(null);

  const windowMap: Record<string, WindowConfig> = {};
  for (const w of windows) {
    windowMap[w.position] = w;
  }

  const handleWindowClick = (windowKey: string) => {
    setSelectedWindow(selectedWindow === windowKey ? null : windowKey);
  };

  // Define window layout positions for the SVG car diagram
  const windowAreas = [
    { key: 'front_windshield', label: 'Front WS', x: 80, y: 10, width: 140, height: 50 },
    { key: 'front_left', label: 'FL', x: 10, y: 70, width: 60, height: 60 },
    { key: 'front_right', label: 'FR', x: 230, y: 70, width: 60, height: 60 },
    { key: 'rear_left', label: 'RL', x: 10, y: 140, width: 60, height: 60 },
    { key: 'rear_right', label: 'RR', x: 230, y: 140, width: 60, height: 60 },
    { key: 'rear_quarter_left', label: 'RQL', x: 10, y: 210, width: 60, height: 40 },
    { key: 'rear_quarter_right', label: 'RQR', x: 230, y: 210, width: 60, height: 40 },
    { key: 'rear_windshield', label: 'Rear WS', x: 80, y: 260, width: 140, height: 50 },
    { key: 'sunroof', label: 'Sunroof', x: 100, y: 150, width: 100, height: 40 },
  ];

  // Only show areas that exist in current car config
  const visibleAreas = windowAreas.filter((area) => windowMap[area.key]);

  const selectedWindowConfig = selectedWindow ? windowMap[selectedWindow] : null;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* SVG Car Diagram */}
      <div className="flex-shrink-0">
        <div className="bg-white/[0.02] ring-1 ring-white/10 rounded-xl p-4">
          <p className="text-[10px] text-white/30 uppercase tracking-wider text-center mb-3">
            Top-Down View - Click a window to configure
          </p>
          <svg width="300" height="320" viewBox="0 0 300 320" className="mx-auto">
            {/* Car body outline */}
            <rect
              x={70}
              y={5}
              width={160}
              height={310}
              rx={30}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={2}
            />
            {/* Side panels */}
            <rect x={5} y={65} width={65} height={195} rx={8} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <rect x={230} y={65} width={65} height={195} rx={8} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />

            {/* Window areas */}
            {visibleAreas.map((area) => (
              <WindowArea
                key={area.key}
                windowKey={area.key}
                label={area.label}
                x={area.x}
                y={area.y}
                width={area.width}
                height={area.height}
                window={windowMap[area.key]}
                onClick={handleWindowClick}
              />
            ))}

            {/* Front/Rear labels */}
            <text x={150} y={5} textAnchor="middle" className="fill-white/20 text-[8px] select-none">FRONT</text>
            <text x={150} y={318} textAnchor="middle" className="fill-white/20 text-[8px] select-none">REAR</text>
          </svg>
        </div>
      </div>

      {/* Config Panel */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          {selectedWindowConfig ? (
            <VisualWindowConfigPanel
              key={selectedWindow}
              windowConfig={selectedWindowConfig}
              tintProducts={tintProducts}
              onClose={() => setSelectedWindow(null)}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/[0.02] ring-1 ring-white/10 rounded-xl p-6 text-center"
            >
              <Car className="w-8 h-8 text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm">
                Click on a window in the diagram to configure its tint and shade.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---------- Main Component ----------

export default function WindowTintConfigurator() {
  const { windows, subtotal } = useConfiguratorStore();
  const enabledCount = windows.filter((w) => w.enabled).length;
  const enabledSqft = windows.filter((w) => w.enabled).reduce((s, w) => s + w.sqft, 0);

  const [viewMode, setViewMode] = useState<'list' | 'visual'>('list');
  const [tintProducts, setTintProducts] = useState<TintProductFromAPI[]>([]);

  useEffect(() => {
    fetch('/api/products/tints')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setTintProducts(res.data);
          // Sync with store so pricing stays consistent
          const store = useConfiguratorStore.getState();
          if (store.tintProducts.length === 0) {
            useConfiguratorStore.setState({ tintProducts: res.data });
          }
        }
      })
      .catch(() => {
        // Fallback: tintProducts stays empty, will use hardcoded SHADE_LEVELS
      });
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-white mb-2">Configure Windows & Tint</h2>
        <p className="text-white/50 text-sm">
          Choose different tint types and shade levels for each window
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <button
          onClick={() => setViewMode('list')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            viewMode === 'list'
              ? 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/40'
              : 'bg-white/5 text-white/50 ring-1 ring-white/10 hover:bg-white/10'
          }`}
        >
          <List className="w-3.5 h-3.5" />
          List View
        </button>
        <button
          onClick={() => setViewMode('visual')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            viewMode === 'visual'
              ? 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/40'
              : 'bg-white/5 text-white/50 ring-1 ring-white/10 hover:bg-white/10'
          }`}
        >
          <Car className="w-3.5 h-3.5" />
          Visual View
        </button>
      </div>

      {viewMode === 'list' ? (
        <>
          {/* Quick Apply */}
          <QuickApplyBar tintProducts={tintProducts} />

          {/* Window cards */}
          <div className="space-y-3">
            {windows.map((w) => (
              <WindowCard key={w.position} window={w} tintProducts={tintProducts} />
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Quick Apply */}
          <QuickApplyBar tintProducts={tintProducts} />

          {/* Visual car view */}
          <CarVisualView tintProducts={tintProducts} />
        </>
      )}

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
