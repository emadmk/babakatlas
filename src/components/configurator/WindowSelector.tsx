'use client';

import { motion } from 'framer-motion';
import { useConfiguratorStore, WINDOW_SQFT } from '@/store/configuratorStore';

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

// Positions for each window on the top-down car diagram (percentage based)
const WINDOW_POSITIONS: Record<string, { x: number; y: number; w: number; h: number }> = {
  front_windshield: { x: 30, y: 5, w: 40, h: 12 },
  front_left: { x: 5, y: 20, w: 18, h: 15 },
  front_right: { x: 77, y: 20, w: 18, h: 15 },
  rear_left: { x: 5, y: 50, w: 18, h: 15 },
  rear_right: { x: 77, y: 50, w: 18, h: 15 },
  rear_quarter_left: { x: 5, y: 68, w: 18, h: 10 },
  rear_quarter_right: { x: 77, y: 68, w: 18, h: 10 },
  rear_windshield: { x: 30, y: 82, w: 40, h: 12 },
  sunroof: { x: 35, y: 40, w: 30, h: 18 },
};

function CarOutline({ carType }: { carType: string }) {
  // Different outlines based on car type
  const outlines: Record<string, string> = {
    sedan:
      'M50 2 Q85 2 92 8 L95 15 Q98 20 98 30 L98 75 Q98 85 92 92 L85 96 Q70 98 50 98 Q30 98 15 96 L8 92 Q2 85 2 75 L2 30 Q2 20 5 15 L8 8 Q15 2 50 2 Z',
    suv:
      'M50 2 Q88 2 94 6 L96 12 Q98 16 98 25 L98 78 Q98 88 94 94 L88 98 Q72 100 50 100 Q28 100 12 98 L6 94 Q2 88 2 78 L2 25 Q2 16 4 12 L6 6 Q12 2 50 2 Z',
    van:
      'M50 1 Q85 1 92 5 L96 10 Q99 15 99 22 L99 80 Q99 90 94 95 L88 98 Q72 100 50 100 Q28 100 12 98 L6 95 Q1 90 1 80 L1 22 Q1 15 4 10 L8 5 Q15 1 50 1 Z',
    station_wagon:
      'M50 2 Q86 2 92 7 L95 14 Q98 20 98 28 L98 76 Q98 86 92 92 L86 97 Q70 99 50 99 Q30 99 14 97 L8 92 Q2 86 2 76 L2 28 Q2 20 5 14 L8 7 Q14 2 50 2 Z',
    hatchback:
      'M50 3 Q82 3 90 9 L94 16 Q97 22 97 32 L97 72 Q97 84 90 90 L82 95 Q68 97 50 97 Q32 97 18 95 L10 90 Q3 84 3 72 L3 32 Q3 22 6 16 L10 9 Q18 3 50 3 Z',
    coupe:
      'M50 3 Q80 3 88 10 L92 18 Q96 24 96 34 L96 70 Q96 82 88 88 L80 94 Q66 96 50 96 Q34 96 20 94 L12 88 Q4 82 4 70 L4 34 Q4 24 8 18 L12 10 Q20 3 50 3 Z',
    truck:
      'M50 2 Q86 2 92 7 L95 14 Q98 20 98 28 L98 76 Q98 86 92 92 L86 97 Q70 99 50 99 Q30 99 14 97 L8 92 Q2 86 2 76 L2 28 Q2 20 5 14 L8 7 Q14 2 50 2 Z',
    convertible:
      'M50 4 Q78 4 86 11 L90 19 Q94 26 94 36 L94 68 Q94 80 86 86 L78 92 Q65 94 50 94 Q35 94 22 92 L14 86 Q6 80 6 68 L6 36 Q6 26 10 19 L14 11 Q22 4 50 4 Z',
  };

  return (
    <path
      d={outlines[carType] || outlines.sedan}
      fill="none"
      stroke="rgba(255,255,255,0.15)"
      strokeWidth="1.5"
    />
  );
}

export default function WindowSelector() {
  const { carType, selectedWindows, toggleWindow, selectAllWindows, clearWindows, totalSqft } =
    useConfiguratorStore();

  if (!carType) return null;

  const availableWindows = Object.keys(WINDOW_SQFT[carType] || {});
  const windowData = WINDOW_SQFT[carType] || {};

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-white mb-2">Select Windows to Tint</h2>
        <p className="text-white/50 text-sm">
          Click on the windows you want tinted, or use the buttons below
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-3 mb-8">
        <button
          onClick={selectAllWindows}
          className="px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-medium ring-1 ring-blue-500/30 hover:bg-blue-500/20 transition-all"
        >
          Select All
        </button>
        <button
          onClick={clearWindows}
          className="px-4 py-2 rounded-lg bg-white/5 text-white/60 text-sm font-medium ring-1 ring-white/10 hover:bg-white/10 transition-all"
        >
          Clear
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Car diagram */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-72 h-96">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              <CarOutline carType={carType} />

              {availableWindows.map((windowId) => {
                const pos = WINDOW_POSITIONS[windowId];
                if (!pos) return null;
                const isSelected = selectedWindows.includes(windowId);

                return (
                  <g key={windowId}>
                    <rect
                      x={pos.x}
                      y={pos.y}
                      width={pos.w}
                      height={pos.h}
                      rx="2"
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'fill-blue-500/40 stroke-blue-400'
                          : 'fill-white/5 stroke-white/20 hover:fill-white/10 hover:stroke-white/40'
                      }`}
                      strokeWidth="0.8"
                      onClick={() => toggleWindow(windowId)}
                    />
                    {isSelected && (
                      <rect
                        x={pos.x}
                        y={pos.y}
                        width={pos.w}
                        height={pos.h}
                        rx="2"
                        fill="none"
                        stroke="rgba(59,130,246,0.6)"
                        strokeWidth="1.5"
                        className="animate-pulse"
                      />
                    )}
                    <text
                      x={pos.x + pos.w / 2}
                      y={pos.y + pos.h / 2 + 1}
                      textAnchor="middle"
                      className={`text-[3px] pointer-events-none select-none ${
                        isSelected ? 'fill-blue-200' : 'fill-white/40'
                      }`}
                    >
                      {windowData[windowId]}ft&sup2;
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Window list */}
        <div className="flex-1 space-y-2">
          {availableWindows.map((windowId) => {
            const isSelected = selectedWindows.includes(windowId);
            const sqft = windowData[windowId];

            return (
              <motion.button
                key={windowId}
                onClick={() => toggleWindow(windowId)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                  isSelected
                    ? 'bg-blue-500/10 ring-1 ring-blue-500/40'
                    : 'bg-white/[0.03] ring-1 ring-white/10 hover:bg-white/[0.06]'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                      isSelected ? 'bg-blue-500' : 'bg-white/10 ring-1 ring-white/20'
                    }`}
                  >
                    {isSelected && (
                      <motion.svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </motion.svg>
                    )}
                  </div>
                  <span
                    className={`text-sm ${isSelected ? 'text-white font-medium' : 'text-white/60'}`}
                  >
                    {WINDOW_LABELS[windowId] || windowId}
                  </span>
                </div>
                <span className={`text-xs ${isSelected ? 'text-blue-400' : 'text-white/40'}`}>
                  {sqft} sq.ft
                </span>
              </motion.button>
            );
          })}

          {/* Total */}
          <div className="pt-4 mt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Total Area</span>
              <motion.span
                key={totalSqft}
                className="text-xl font-semibold text-white"
                initial={{ scale: 1.2, color: '#60a5fa' }}
                animate={{ scale: 1, color: '#ffffff' }}
                transition={{ duration: 0.3 }}
              >
                {totalSqft} sq.ft
              </motion.span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
