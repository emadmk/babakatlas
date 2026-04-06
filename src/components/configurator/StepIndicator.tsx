'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const STEPS = [
  { label: 'Country', number: 1 },
  { label: 'Vehicle', number: 2 },
  { label: 'Tint', number: 3 },
  { label: 'Service', number: 4 },
  { label: 'Details', number: 5 },
  { label: 'Summary', number: 6 },
];

export default function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* Progress bar */}
      <div className="relative h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;

          return (
            <div key={step.number} className="flex flex-col items-center relative">
              {/* Connecting line */}
              {index < STEPS.length - 1 && (
                <div className="hidden sm:block absolute top-4 left-1/2 w-full h-px">
                  <div
                    className={`h-full transition-colors duration-500 ${
                      isCompleted ? 'bg-blue-500' : 'bg-white/10'
                    }`}
                  />
                </div>
              )}

              {/* Circle */}
              <motion.div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                  isCompleted
                    ? 'bg-blue-500 text-white'
                    : isActive
                      ? 'bg-blue-500/20 text-blue-400 ring-2 ring-blue-500'
                      : 'bg-white/5 text-white/30 ring-1 ring-white/10'
                }`}
                animate={
                  isActive
                    ? { boxShadow: '0 0 20px rgba(59,130,246,0.4)' }
                    : { boxShadow: '0 0 0px rgba(59,130,246,0)' }
                }
                transition={{ duration: 0.3 }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                ) : (
                  step.number
                )}
              </motion.div>

              {/* Label */}
              <span
                className={`mt-2 text-[10px] sm:text-xs transition-colors duration-300 ${
                  isActive
                    ? 'text-blue-400 font-medium'
                    : isCompleted
                      ? 'text-white/60'
                      : 'text-white/30'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
