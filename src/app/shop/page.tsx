'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingCart, Info, Ruler, Check } from 'lucide-react';
import Link from 'next/link';

interface TintProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  rollWidth: number;
  rollLength: number;
  rollPrice: number;
  pricePerMeter: number;
  currency: string;
  specs: { vlt: string; uvBlock: string; heatRejection: string; irrRejection: string };
  badge: string | null;
}

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

export default function ShopPage() {
  const [products, setProducts] = useState<TintProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [meters, setMeters] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetch('/api/products/tints')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setProducts(res.data);
          if (res.data.length > 0) {
            setSelectedProduct(res.data[0].slug);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const product = products.find((p) => p.slug === selectedProduct);
  const totalPrice = product ? meters * product.pricePerMeter : 0;
  const totalArea = product ? meters * product.rollWidth : 0;

  const adjustMeters = (delta: number) => {
    setMeters((prev) => {
      const next = prev + delta;
      if (next < 0.5) return 0.5;
      if (next > 30) return 30;
      return Math.round(next * 2) / 2; // step 0.5
    });
  };

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const ceramicProducts = products.filter((p) => p.category === 'nano-ceramic');
  const adaptiveProducts = products.filter((p) => p.category === 'adaptive');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Buy Tint Film by the Meter</h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Purchase tint film in custom lengths. Perfect for DIY installation, commercial projects,
            or if you know exactly how much you need.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Product selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Adaptive products */}
            {adaptiveProducts.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-3">
                  Adaptive Series - {formatCurrency(adaptiveProducts[0]?.pricePerMeter || 0)}/m
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {adaptiveProducts.map((p) => {
                    const isSelected = selectedProduct === p.slug;
                    return (
                      <motion.button
                        key={p.id}
                        onClick={() => setSelectedProduct(p.slug)}
                        className={`text-left rounded-xl p-4 transition-all duration-300 ${
                          isSelected
                            ? 'bg-blue-500/10 ring-2 ring-blue-500'
                            : 'bg-white/[0.03] ring-1 ring-white/10 hover:ring-white/20 hover:bg-white/[0.06]'
                        }`}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full ring-2 ${
                              isSelected ? 'ring-blue-400' : 'ring-white/20'
                            }`}
                            style={{ backgroundColor: `rgba(0,0,0,${getVltOpacity(p.specs.vlt)})` }}
                          />
                          <div>
                            <div className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-white/70'}`}>
                              {p.name}
                            </div>
                            <div className="text-[11px] text-white/30">
                              VLT: {p.specs.vlt} | IRR: {p.specs.irrRejection} | UV: {p.specs.uvBlock}
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-blue-400 ml-auto" />
                          )}
                        </div>
                        {p.badge && (
                          <span className="inline-block mt-2 text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30">
                            {p.badge}
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Nano Ceramic products */}
            {ceramicProducts.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-3">
                  Nano Ceramic Series - {formatCurrency(ceramicProducts[0]?.pricePerMeter || 0)}/m
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {ceramicProducts.map((p) => {
                    const isSelected = selectedProduct === p.slug;
                    return (
                      <motion.button
                        key={p.id}
                        onClick={() => setSelectedProduct(p.slug)}
                        className={`text-left rounded-xl p-4 transition-all duration-300 ${
                          isSelected
                            ? 'bg-blue-500/10 ring-2 ring-blue-500'
                            : 'bg-white/[0.03] ring-1 ring-white/10 hover:ring-white/20 hover:bg-white/[0.06]'
                        }`}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`w-7 h-7 rounded-full ring-2 ${
                              isSelected ? 'ring-blue-400' : 'ring-white/20'
                            }`}
                            style={{ backgroundColor: `rgba(0,0,0,${getVltOpacity(p.specs.vlt)})` }}
                          />
                          <div className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-white/70'}`}>
                            {p.specs.vlt} VLT
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-blue-400 ml-auto" />}
                        </div>
                        <div className="text-[10px] text-white/30">
                          IRR: {p.specs.irrRejection} | UV: {p.specs.uvBlock}
                        </div>
                        {p.badge && (
                          <span className="inline-block mt-2 text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30">
                            {p.badge}
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Roll info */}
            <div className="rounded-xl bg-white/[0.02] ring-1 ring-white/5 p-4">
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-white/30 space-y-1">
                  <p>All tint films are 1.52m wide. You choose the length in meters.</p>
                  <p>Minimum order: 0.5m. Maximum: 30m (full roll).</p>
                  <p>Nano Ceramic: {formatCurrency(50000)}/roll (30m). Adaptive: {formatCurrency(200000)}/roll (30m).</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Length selector & pricing */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <motion.div
                className="rounded-2xl p-6 bg-white/[0.03] ring-1 ring-white/10 space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Selected product */}
                {product && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
                    <p className="text-xs text-white/40">{product.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-white/40">
                      <span>VLT: {product.specs.vlt}</span>
                      <span>IRR: {product.specs.irrRejection}</span>
                      <span>UV: {product.specs.uvBlock}</span>
                    </div>
                  </div>
                )}

                {/* Length selector */}
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider block mb-3">
                    Length (meters)
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => adjustMeters(-0.5)}
                      disabled={meters <= 0.5}
                      className="w-10 h-10 rounded-lg bg-white/5 ring-1 ring-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1 text-center">
                      <input
                        type="number"
                        value={meters}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          if (!isNaN(v) && v >= 0.5 && v <= 30) {
                            setMeters(Math.round(v * 2) / 2);
                          }
                        }}
                        min={0.5}
                        max={30}
                        step={0.5}
                        className="w-full text-center text-3xl font-bold text-white bg-transparent border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <div className="text-xs text-white/30 mt-1">meters</div>
                    </div>
                    <button
                      onClick={() => adjustMeters(0.5)}
                      disabled={meters >= 30}
                      className="w-10 h-10 rounded-lg bg-white/5 ring-1 ring-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quick length buttons */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[1, 2, 3, 5, 10, 30].map((len) => (
                      <button
                        key={len}
                        onClick={() => setMeters(len)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          meters === len
                            ? 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/40'
                            : 'bg-white/5 text-white/40 ring-1 ring-white/10 hover:bg-white/10'
                        }`}
                      >
                        {len}m{len === 30 ? ' (full)' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dimensions */}
                <div className="flex items-center gap-2 text-xs text-white/40 bg-white/[0.02] rounded-lg p-3">
                  <Ruler className="w-4 h-4 text-white/20" />
                  <span>
                    {product?.rollWidth || 1.52}m wide x {meters}m long = {totalArea.toFixed(2)} sqm
                  </span>
                </div>

                {/* Pricing */}
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/50">{meters}m x {formatCurrency(product?.pricePerMeter || 0)}/m</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-white font-semibold">Total</span>
                    <motion.span
                      key={totalPrice}
                      className="text-3xl font-bold text-white"
                      initial={{ scale: 1.1, color: '#60a5fa' }}
                      animate={{ scale: 1, color: '#ffffff' }}
                    >
                      {formatCurrency(totalPrice)}
                    </motion.span>
                  </div>
                </div>

                {/* Add to cart */}
                <motion.button
                  onClick={handleAddToCart}
                  className="w-full py-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-sm transition-colors relative overflow-hidden group"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {addedToCart ? (
                      <>
                        <Check className="w-4 h-4" />
                        Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart - {formatCurrency(totalPrice)}
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>

                {/* Configurator link */}
                <div className="text-center">
                  <Link
                    href="/configurator"
                    className="text-xs text-white/30 hover:text-white/50 transition-colors"
                  >
                    Need help choosing? Use our Tint Configurator
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
