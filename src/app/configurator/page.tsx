'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useConfiguratorStore } from '@/store/configuratorStore';
import StepIndicator from '@/components/configurator/StepIndicator';
import CountrySelector from '@/components/configurator/CountrySelector';
import CarTypeSelector from '@/components/configurator/CarTypeSelector';
import WindowTintConfigurator from '@/components/configurator/WindowTintConfigurator';
import ServiceSelector from '@/components/configurator/ServiceSelector';
import ShippingSelector from '@/components/configurator/ShippingSelector';
import AppointmentBooking from '@/components/configurator/AppointmentBooking';
import OrderSummary from '@/components/configurator/OrderSummary';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

const TOTAL_STEPS = 6;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
  }),
};

function canProceed(state: ReturnType<typeof useConfiguratorStore.getState>): boolean {
  switch (state.step) {
    case 1:
      return !!state.country;
    case 2:
      return !!state.carType;
    case 3:
      return !!state.selectedProduct && !!state.selectedPackage;
    case 4:
      return !!state.serviceType;
    case 5:
      if (state.serviceType === 'installation') {
        return !!(state.appointment?.date && state.appointment?.slot && state.shippingAddress.street1);
      }
      return !!state.shippingCountry;
    case 6:
      return true;
    default:
      return false;
  }
}

function StepContent({ step, serviceType }: { step: number; serviceType: string | null }) {
  switch (step) {
    case 1:
      return <CountrySelector />;
    case 2:
      return <CarTypeSelector />;
    case 3:
      return <WindowTintConfigurator />;
    case 4:
      return <ServiceSelector />;
    case 5:
      return serviceType === 'installation' ? <AppointmentBooking /> : <ShippingSelector />;
    case 6:
      return <OrderSummary />;
    default:
      return null;
  }
}

export default function ConfiguratorPage() {
  const store = useConfiguratorStore();
  const { step, setStep, reset, loadConfig, serviceType } = store;
  const isValid = canProceed(store);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const goNext = () => {
    if (isValid && step < TOTAL_STEPS) {
      setStep(step + 1);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col pt-20">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white tracking-tight">
              Tint Configurator
            </h1>
            <p className="text-xs text-white/40">Build your perfect tint package</p>
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Start Over
          </button>
        </div>
      </header>

      {/* Step indicator */}
      <div className="flex-shrink-0 py-8 border-b border-white/5">
        <StepIndicator currentStep={step} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <AnimatePresence mode="wait" custom={step}>
            <motion.div
              key={step}
              custom={step}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              <StepContent step={step} serviceType={serviceType} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation footer */}
      <footer className="flex-shrink-0 border-t border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Back */}
          <div>
            {step > 1 && (
              <motion.button
                onClick={goBack}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </motion.button>
            )}
          </div>

          {/* Step counter */}
          <span className="text-xs text-white/30">
            Step {step} of {TOTAL_STEPS}
          </span>

          {/* Next / Finish */}
          <div>
            {step < TOTAL_STEPS && (
              <motion.button
                onClick={goNext}
                disabled={!isValid}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isValid
                    ? 'bg-blue-500 hover:bg-blue-400 text-white'
                    : 'bg-white/5 text-white/20 cursor-not-allowed'
                }`}
                whileHover={isValid ? { scale: 1.02 } : {}}
                whileTap={isValid ? { scale: 0.98 } : {}}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
