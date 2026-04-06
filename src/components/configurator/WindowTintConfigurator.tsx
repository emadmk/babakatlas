'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useConfiguratorStore } from '@/store/configuratorStore';
import type { TintProductData, TintPackageData, CarTypeData } from '@/store/configuratorStore';
import { Shield, Zap, ChevronRight, Check, Info } from 'lucide-react';

// ---------- Helpers ----------

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getVltOpacity(vlt: string): number {
  const num = parseInt(vlt.replace('%', ''));
  if (isNaN(num)) return 0.5;
  return Math.max(0.1, 1 - num / 100);
}

// ---------- Category Selector ----------

function CategorySelector({
  selectedCategory,
  onSelect,
  products,
}: {
  selectedCategory: string | null;
  onSelect: (category: string) => void;
  products: TintProductData[];
}) {
  const categories = [
    {
      id: 'nano-ceramic',
      label: 'Nano Ceramic',
      description: '99% IR rejection, multiple VLT options',
      priceLabel: 'From ' + formatCurrency(1667) + '/m',
      icon: Shield,
      badge: 'Most Popular',
    },
    {
      id: 'adaptive',
      label: 'Adaptive',
      description: 'Auto-adjusting VLT, premium photochromic',
      priceLabel: 'From ' + formatCurrency(6667) + '/m',
      icon: Zap,
      badge: 'Premium',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Step 1</span>
        <ChevronRight className="w-3 h-3 text-white/20" />
        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Choose Tint Category</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const Icon = cat.icon;
          const count = products.filter((p) => p.category === cat.id).length;

          return (
            <motion.button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`relative text-left rounded-xl p-5 transition-all duration-300 ${
                isSelected
                  ? 'bg-blue-500/10 ring-2 ring-blue-500'
                  : 'bg-white/[0.03] ring-1 ring-white/10 hover:ring-white/20 hover:bg-white/[0.06]'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isSelected ? 'bg-blue-500/20' : 'bg-white/5'
                }`}>
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-400' : 'text-white/40'}`} />
                </div>
                {cat.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    isSelected
                      ? 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30'
                      : 'bg-white/5 text-white/40 ring-1 ring-white/10'
                  }`}>
                    {cat.badge}
                  </span>
                )}
              </div>

              <h3 className={`text-lg font-semibold mb-1 ${isSelected ? 'text-white' : 'text-white/80'}`}>
                {cat.label}
              </h3>
              <p className="text-sm text-white/40 mb-3">{cat.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-white/30">{count} variants</span>
                <span className={`text-sm font-medium ${isSelected ? 'text-blue-400' : 'text-white/50'}`}>
                  {cat.priceLabel}
                </span>
              </div>

              {isSelected && (
                <motion.div
                  className="absolute top-3 right-3 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Product/VLT Selector ----------

function ProductSelector({
  selectedProduct,
  selectedCategory,
  onSelect,
  products,
}: {
  selectedProduct: string | null;
  selectedCategory: string;
  onSelect: (slug: string) => void;
  products: TintProductData[];
}) {
  const filtered = products.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Step 2</span>
        <ChevronRight className="w-3 h-3 text-white/20" />
        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
          {selectedCategory === 'adaptive' ? 'Choose Variant' : 'Choose VLT%'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {filtered.map((product) => {
          const isSelected = selectedProduct === product.slug;
          const opacity = getVltOpacity(product.specs.vlt);

          return (
            <motion.button
              key={product.id}
              onClick={() => onSelect(product.slug)}
              className={`relative text-left rounded-xl p-4 transition-all duration-300 ${
                isSelected
                  ? 'bg-blue-500/10 ring-2 ring-blue-500'
                  : 'bg-white/[0.03] ring-1 ring-white/10 hover:ring-white/20 hover:bg-white/[0.06]'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* VLT circle */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-8 h-8 rounded-full ring-2 ${
                    isSelected ? 'ring-blue-400' : 'ring-white/20'
                  }`}
                  style={{ backgroundColor: `rgba(0,0,0,${opacity})` }}
                />
                <div>
                  <div className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-white/70'}`}>
                    {product.specs.vlt} VLT
                  </div>
                </div>
              </div>

              <div className={`text-xs mb-2 ${isSelected ? 'text-white/60' : 'text-white/30'}`}>
                {product.name}
              </div>

              <div className="flex items-center gap-3 text-[10px] text-white/30">
                <span>UV: {product.specs.uvBlock}</span>
                <span>IRR: {product.specs.irrRejection}</span>
              </div>

              <div className={`mt-2 text-xs font-medium ${isSelected ? 'text-blue-400' : 'text-white/40'}`}>
                {formatCurrency(product.pricePerMeter)}/m
              </div>

              {product.badge && (
                <span className="absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30">
                  {product.badge}
                </span>
              )}

              {isSelected && (
                <motion.div
                  className="absolute bottom-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <Check className="w-2.5 h-2.5 text-white" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Package Selector ----------

function PackageSelector({
  selectedPackage,
  selectedCategory,
  onSelect,
  packages,
  car,
  product,
  comboProduct,
  onComboSelect,
  products,
}: {
  selectedPackage: string | null;
  selectedCategory: string;
  onSelect: (packageId: string) => void;
  packages: TintPackageData[];
  car: CarTypeData | null;
  product: TintProductData | null;
  comboProduct: string | null;
  onComboSelect: (slug: string) => void;
  products: TintProductData[];
}) {
  const filtered = packages.filter(
    (pkg) =>
      pkg.applicableTintTypes.includes(selectedCategory) ||
      pkg.applicableTintTypes.includes('all')
  );

  const sizeGroup = car?.sizeGroup || 'small';

  const coverageIcons: Record<string, string> = {
    windshield: 'Front windshield only',
    half: 'Windshield + front windows',
    'semi-full': 'All windows + rear (no front WS)',
    'full-wrap': 'Everything: all windows + windshields',
    combo: 'Adaptive windshield + Ceramic rest',
  };

  const ceramicProducts = products.filter((p) => p.category === 'nano-ceramic');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Step 3</span>
        <ChevronRight className="w-3 h-3 text-white/20" />
        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Choose Package</span>
      </div>

      <div className="space-y-3">
        {filtered.map((pkg) => {
          const isSelected = selectedPackage === pkg.id;
          const meters = pkg.metersUsed[sizeGroup] || 0;
          let price = 0;
          if (product) {
            if (pkg.coverage === 'combo') {
              // Combo pricing: adaptive windshield + ceramic rest
              const windshieldPkg = packages.find((p) => p.coverage === 'windshield');
              const wMeters = windshieldPkg ? (windshieldPkg.metersUsed[sizeGroup] || 1) : 1;
              const rMeters = meters - wMeters;
              const ceramicProd = comboProduct
                ? products.find((p) => p.slug === comboProduct)
                : ceramicProducts[0];
              price = (wMeters * product.pricePerMeter) + (rMeters * (ceramicProd?.pricePerMeter || 1666.67));
            } else {
              price = meters * product.pricePerMeter;
            }
          }

          return (
            <motion.button
              key={pkg.id}
              onClick={() => onSelect(pkg.id)}
              className={`w-full text-left rounded-xl p-4 transition-all duration-300 ${
                isSelected
                  ? 'bg-blue-500/10 ring-2 ring-blue-500'
                  : 'bg-white/[0.03] ring-1 ring-white/10 hover:ring-white/20 hover:bg-white/[0.06]'
              }`}
              whileHover={{ scale: 1.005 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-white/70'}`}>
                      {pkg.name.en}
                    </h4>
                    {isSelected && (
                      <motion.div
                        className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Check className="w-2.5 h-2.5 text-white" />
                      </motion.div>
                    )}
                  </div>
                  <p className="text-xs text-white/30 mb-2">
                    {coverageIcons[pkg.coverage] || pkg.description.en}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-white/40">
                    <span>{meters}m of roll</span>
                    <span className="text-white/20">|</span>
                    <span>{car?.name || 'Vehicle'} ({sizeGroup})</span>
                  </div>
                </div>

                <div className="text-right ml-4">
                  <div className={`text-lg font-bold ${isSelected ? 'text-blue-400' : 'text-white/60'}`}>
                    {formatCurrency(price)}
                  </div>
                  {product && (
                    <div className="text-[10px] text-white/30">
                      {meters}m x {formatCurrency(product.pricePerMeter)}/m
                    </div>
                  )}
                </div>
              </div>

              {/* Combo ceramic selector */}
              {pkg.coverage === 'combo' && isSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-white/10"
                >
                  <p className="text-xs text-white/50 mb-2">Choose Ceramic VLT% for side windows & rear:</p>
                  <div className="flex flex-wrap gap-2">
                    {ceramicProducts.map((cp) => (
                      <button
                        key={cp.slug}
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onComboSelect(cp.slug); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          comboProduct === cp.slug
                            ? 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/40'
                            : 'bg-white/5 text-white/50 ring-1 ring-white/10 hover:bg-white/10'
                        }`}
                      >
                        {cp.specs.vlt} VLT
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Price Summary Strip ----------

function PriceSummaryStrip({
  product,
  pkg,
  car,
  metersUsed,
  subtotal,
}: {
  product: TintProductData | null;
  pkg: TintPackageData | null;
  car: CarTypeData | null;
  metersUsed: number;
  subtotal: number;
}) {
  if (!product || !pkg || subtotal === 0) return null;

  return (
    <motion.div
      className="mt-6 rounded-xl bg-gradient-to-r from-blue-500/5 to-blue-500/10 ring-1 ring-blue-500/20 p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-white/60">
            <span className="font-medium text-white">{product.name}</span>
            <span className="text-white/30">|</span>
            <span>{pkg.name.en}</span>
            <span className="text-white/30">|</span>
            <span>{car?.name || 'Vehicle'}</span>
          </div>
          <div className="text-xs text-white/40">
            {metersUsed}m x {formatCurrency(product.pricePerMeter)}/m (roll width: {product.rollWidth}m)
          </div>
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
            {formatCurrency(subtotal)}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ---------- Main Component ----------

export default function WindowTintConfigurator() {
  const {
    carType,
    selectedCategory,
    selectedProduct,
    selectedPackage,
    comboProduct,
    subtotal,
    metersUsed,
    tintProducts,
    tintPackages,
    carTypes,
    setSelectedCategory,
    setSelectedProduct,
    setSelectedPackage,
    setComboProduct,
  } = useConfiguratorStore();

  const car = carTypes.find((c) => c.slug === carType || c.id === carType) || null;
  const product = tintProducts.find((p) => p.slug === selectedProduct) || null;
  const pkg = tintPackages.find((p) => p.id === selectedPackage) || null;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-white mb-2">Select Tint & Package</h2>
        <p className="text-white/50 text-sm">
          Choose your tint film and coverage package for{' '}
          <span className="text-white/70 font-medium">{car?.name || 'your vehicle'}</span>
        </p>
      </div>

      <div className="space-y-8">
        {/* Step 1: Category */}
        <CategorySelector
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
          products={tintProducts}
        />

        {/* Step 2: Product/VLT */}
        <AnimatePresence>
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ProductSelector
                selectedProduct={selectedProduct}
                selectedCategory={selectedCategory}
                onSelect={setSelectedProduct}
                products={tintProducts}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3: Package */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <PackageSelector
                selectedPackage={selectedPackage}
                selectedCategory={selectedCategory || ''}
                onSelect={setSelectedPackage}
                packages={tintPackages}
                car={car}
                product={product}
                comboProduct={comboProduct}
                onComboSelect={setComboProduct}
                products={tintProducts}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Price summary */}
        <PriceSummaryStrip
          product={product}
          pkg={pkg}
          car={car}
          metersUsed={metersUsed}
          subtotal={subtotal}
        />

        {/* Info box */}
        {selectedCategory && (
          <div className="rounded-xl bg-white/[0.02] ring-1 ring-white/5 p-4">
            <div className="flex items-start gap-3">
              <Info className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-white/30 space-y-1">
                <p>All tint films are 1.52m wide rolls. Price is calculated per linear meter of roll used.</p>
                <p>Nano Ceramic: {formatCurrency(50000)}/roll (30m) = {formatCurrency(1667)}/m</p>
                <p>Adaptive: {formatCurrency(200000)}/roll (30m) = {formatCurrency(6667)}/m</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
