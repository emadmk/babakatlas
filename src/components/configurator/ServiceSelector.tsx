'use client';

import { motion } from 'framer-motion';
import { useConfiguratorStore } from '@/store/configuratorStore';
import { Package, Wrench, Check, Info } from 'lucide-react';

export default function ServiceSelector() {
  const { serviceType, setServiceType } = useConfiguratorStore();

  const services = [
    {
      id: 'shipping' as const,
      icon: Package,
      title: 'Shipping Only',
      description: "We'll ship pre-cut tint films to your address",
      features: [
        'Fast delivery',
        'DIY installation guide included',
        'Professional tools recommended',
      ],
      note: null as string | null,
    },
    {
      id: 'installation' as const,
      icon: Wrench,
      title: 'Home Service Installation',
      description:
        'Our certified technicians will come to your location',
      longDescription:
        'After purchasing your tint films, book a convenient appointment. Our team will assess the installation and provide a custom quote based on your vehicle and location.',
      features: [
        'Professional installation',
        'On-site service',
        'Warranty included',
      ],
      note: 'Installation fee will be quoted separately after booking',
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-semibold text-white mb-2">Choose Your Service</h2>
        <p className="text-white/50 text-sm">
          Ship to your door or book a home service installation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {services.map((service) => {
          const isSelected = serviceType === service.id;
          const Icon = service.icon;

          return (
            <motion.button
              key={service.id}
              onClick={() => setServiceType(service.id)}
              className={`relative text-left rounded-2xl p-8 transition-all duration-300 ${
                isSelected
                  ? 'bg-blue-500/10 ring-2 ring-blue-500'
                  : 'bg-white/[0.03] ring-1 ring-white/10 hover:ring-white/20 hover:bg-white/[0.06]'
              }`}
              whileHover={{ scale: 1.01, y: -3 }}
              whileTap={{ scale: 0.99 }}
              animate={
                isSelected
                  ? { boxShadow: '0 0 40px rgba(59,130,246,0.12)' }
                  : { boxShadow: '0 0 0px rgba(59,130,246,0)' }
              }
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all ${
                  isSelected
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-white/5 text-white/40'
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>

              {/* Title */}
              <h3
                className={`text-xl font-semibold mb-2 ${
                  isSelected ? 'text-white' : 'text-white/80'
                }`}
              >
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-white/40 text-sm mb-2 leading-relaxed">
                {service.description}
              </p>

              {/* Long description for installation */}
              {'longDescription' in service && service.longDescription && (
                <p className="text-white/30 text-xs mb-4 leading-relaxed">
                  {service.longDescription}
                </p>
              )}

              {/* Features */}
              <ul className="space-y-2.5 mb-4">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isSelected ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/30'
                      }`}
                    >
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-sm text-white/50">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Note for installation */}
              {service.note && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-amber-400/70 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-amber-400/70">{service.note}</span>
                  </div>
                </div>
              )}

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <svg
                    className="w-3.5 h-3.5 text-white"
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
