'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Truck,
  Wrench,
  ChevronRight,
  ArrowLeft,
  Package,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  User,
  Mail,
  Phone,
  Home,
  Globe,
} from 'lucide-react';
import {
  useConfiguratorStore,
  TINT_TYPES,
  SHIPPING_INFO,
} from '@/store/configuratorStore';
import { formatCurrency, getTaxInfo } from '@/lib/pricing';

// ── Helpers ───────────────────────────────────────────────────────────
function formatCarType(slug: string): string {
  return slug
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ── Animation variants ───────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

// ── Glass card wrapper ───────────────────────────────────────────────
function GlassCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className={`rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ── Main Checkout Page ───────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter();
  const config = useConfiguratorStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [address, setAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: config.shippingCountry ?? 'PH',
  });

  // Derived data
  const enabledWindows = config.windows.filter((w) => w.enabled);
  const taxInfo = getTaxInfo(address.country);
  const shippingInfo = SHIPPING_INFO[address.country];

  const isEmpty = !config.carType || enabledWindows.length === 0;

  // Window details for the order summary
  const windowItems = useMemo(() => {
    return enabledWindows.map((w) => ({
      id: w.position,
      label: w.label,
      sqft: w.sqft,
      tintType: w.tintType,
      tintName: TINT_TYPES[w.tintType]?.name ?? w.tintType,
      shade: w.shade,
      pricePerSqft: w.pricePerSqft,
      price: w.sqft * w.pricePerSqft,
    }));
  }, [enabledWindows]);

  // ── Submit order ──────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (isEmpty) {
      setError('Your cart is empty. Please configure your tint first.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Create the order
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact,
          shippingAddress: address,
          carType: config.carType,
          carModel: null,
          tintType: enabledWindows[0]?.tintType ?? 'ceramic',
          selectedWindows: enabledWindows.map((w) => w.position),
          serviceType: config.serviceType ?? 'shipping',
          windowConfigs: enabledWindows.map((w) => ({
            position: w.position,
            tintType: w.tintType,
            shade: w.shade,
            sqft: w.sqft,
            pricePerSqft: w.pricePerSqft,
          })),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        setIsSubmitting(false);
        return;
      }

      const orderId = data.data.id;
      const orderNumber = data.data.orderNumber;
      const totalAmount = data.data.pricing?.total ?? config.total;

      // Store order info
      sessionStorage.setItem('lastOrderId', orderId);
      sessionStorage.setItem('lastOrderNumber', orderNumber);
      sessionStorage.setItem('lastOrderTotal', String(totalAmount));
      sessionStorage.setItem('lastOrderCountry', address.country);

      // Step 2: Try to create a Stripe checkout session
      const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (!stripeKey) {
        // Stripe not configured, go directly to success (for dev/testing)
        router.push('/checkout/success');
        return;
      }

      const checkoutRes = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            name: `Tint Package - ${config.carType ? formatCarType(config.carType) : 'Vehicle'}`,
            description: `${enabledWindows.length} windows, ${config.totalSqft} sq ft`,
            amount: totalAmount,
            quantity: 1,
          }],
          email: contact.email,
          orderId,
        }),
      });

      const checkoutData = await checkoutRes.json();

      if (!checkoutData.success || !checkoutData.data?.url) {
        // If Stripe session fails, fall back to success page
        setError(checkoutData.error || 'Payment setup failed. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Step 3: Redirect to Stripe Checkout
      window.location.href = checkoutData.data.url;
    } catch {
      setError('Network error. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  }

  // ── Empty state ───────────────────────────────────────────────────
  if (isEmpty) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <Package className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-white/50 mb-6">
            Configure your tinted glass in the configurator first.
          </p>
          <button
            onClick={() => router.push('/configurator')}
            className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-colors"
          >
            Go to Configurator
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-lg sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-lg font-semibold">Checkout</h1>
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <Lock className="w-3.5 h-3.5" />
            Secure
          </div>
        </div>
      </header>

      {/* ── Main content ───────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ── Left: Checkout Form ──────────────────────────────── */}
          <motion.form
            onSubmit={handleSubmit}
            className="lg:col-span-7 space-y-6"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            {/* Error banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Contact Info ──────────────────────────────────── */}
            <GlassCard>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-white/70" />
                </div>
                <h2 className="text-lg font-semibold">Contact Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/50 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      required
                      value={contact.name}
                      onChange={(e) => setContact({ ...contact, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/50 mb-1.5">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type="email"
                        required
                        value={contact.email}
                        onChange={(e) => setContact({ ...contact, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-white/50 mb-1.5">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type="tel"
                        required
                        value={contact.phone}
                        onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                        placeholder="+63 912 345 6789"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* ── Shipping Address ──────────────────────────────── */}
            <GlassCard>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white/70" />
                </div>
                <h2 className="text-lg font-semibold">Shipping Address</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/50 mb-1.5">Street Address</label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      required
                      value={address.address}
                      onChange={(e) => setAddress({ ...address, address: e.target.value })}
                      placeholder="123 Main Street"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-sm text-white/50 mb-1.5">City</label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="Manila"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/50 mb-1.5">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      placeholder="1000"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/50 mb-1.5">Country</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <select
                        value={address.country}
                        onChange={(e) => setAddress({ ...address, country: e.target.value as 'PH' | 'AU' })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all appearance-none"
                      >
                        <option value="PH" className="bg-neutral-900">Philippines</option>
                        <option value="AU" className="bg-neutral-900">Australia</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* ── Payment ───────────────────────────────────────── */}
            <GlassCard>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-white/70" />
                </div>
                <h2 className="text-lg font-semibold">Payment</h2>
              </div>

              {/* Stripe checkout info */}
              {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? (
                <div className="rounded-xl border border-white/20 bg-white/[0.02] p-6 text-center">
                  <CreditCard className="w-10 h-10 text-white/30 mx-auto mb-3" />
                  <p className="text-white/60 text-sm mb-1">Secure Payment via Stripe</p>
                  <p className="text-white/30 text-xs">
                    You will be redirected to Stripe&apos;s secure checkout to complete payment
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-yellow-500/30 bg-yellow-500/5 p-6 text-center">
                  <CreditCard className="w-10 h-10 text-yellow-500/30 mx-auto mb-3" />
                  <p className="text-yellow-400/70 text-sm mb-1">Stripe Not Configured</p>
                  <p className="text-white/25 text-xs">
                    Payment processing is not available. Orders will be saved without payment.
                  </p>
                </div>
              )}

              {/* Trust badges */}
              <div className="mt-5 flex items-center justify-center gap-6 text-white/30">
                <div className="flex items-center gap-1.5 text-xs">
                  <Lock className="w-3.5 h-3.5" />
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>PCI Compliant</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Money-Back Guarantee</span>
                </div>
              </div>
            </GlassCard>

            {/* ── Submit button (mobile) ────────────────────────── */}
            <div className="lg:hidden">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-white text-black font-bold text-lg flex items-center justify-center gap-2 hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </motion.form>

          {/* ── Right: Order Summary (Sticky) ────────────────────── */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Order items */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                {/* Car info */}
                <div className="flex items-start gap-4 pb-4 border-b border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-white/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white">
                      Tint Package
                    </p>
                    <p className="text-sm text-white/50">
                      {formatCarType(config.carType!)}
                    </p>
                    <p className="text-xs text-white/30 mt-0.5">
                      {enabledWindows.length} windows, {config.totalSqft} sq ft
                    </p>
                  </div>
                </div>

                {/* Window list */}
                <div className="py-4 border-b border-white/10">
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-2">
                    Windows ({windowItems.length})
                  </p>
                  <div className="space-y-1.5">
                    {windowItems.map((w) => (
                      <div
                        key={w.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div>
                          <span className="text-white/60">{w.label}</span>
                          <span className="text-white/30 text-xs ml-2">{w.tintName} | {w.sqft} ft²</span>
                        </div>
                        <span className="text-white/50">${w.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service type */}
                <div className="py-4 border-b border-white/10">
                  <div className="flex items-center gap-2 text-sm">
                    {config.serviceType === 'installation' ? (
                      <>
                        <Wrench className="w-4 h-4 text-white/40" />
                        <span className="text-white/60">Professional Installation</span>
                      </>
                    ) : (
                      <>
                        <Truck className="w-4 h-4 text-white/40" />
                        <span className="text-white/60">
                          Ship to {shippingInfo?.name ?? address.country}
                        </span>
                      </>
                    )}
                  </div>
                  {shippingInfo && (
                    <p className="text-xs text-white/30 mt-1 ml-6">
                      {shippingInfo.deliveryTime}
                    </p>
                  )}
                </div>

                {/* Pricing breakdown */}
                <div className="pt-4 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Subtotal</span>
                    <span className="text-white/80">
                      {formatCurrency(config.subtotal, address.country)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Shipping</span>
                    <span className="text-white/80">
                      {config.shippingCost === 0 ? (
                        <span className="text-emerald-400">Free</span>
                      ) : (
                        formatCurrency(config.shippingCost, address.country)
                      )}
                    </span>
                  </div>

                  {config.serviceType === 'installation' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Installation</span>
                      <span className="text-white/80">
                        {formatCurrency(config.installationCost, address.country)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">{taxInfo.label}</span>
                    <span className="text-white/80">
                      {formatCurrency(config.tax, address.country)}
                    </span>
                  </div>

                  <div className="border-t border-white/10 pt-3 mt-3 flex justify-between items-baseline">
                    <span className="font-semibold text-white">Total</span>
                    <span className="text-2xl font-bold text-white">
                      {formatCurrency(config.total, address.country)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Place Order button (desktop) */}
              <div className="hidden lg:block">
                <button
                  type="submit"
                  form=""
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="w-full py-4 rounded-2xl bg-white text-black font-bold text-lg flex items-center justify-center gap-2 hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Trust section */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400/70" />
                    <div>
                      <p className="text-sm font-medium text-white/80">Secure Checkout</p>
                      <p className="text-xs text-white/40">256-bit SSL encryption</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-blue-400/70" />
                    <div>
                      <p className="text-sm font-medium text-white/80">Tracked Shipping</p>
                      <p className="text-xs text-white/40">Full tracking on every order</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-400/70" />
                    <div>
                      <p className="text-sm font-medium text-white/80">Quality Guarantee</p>
                      <p className="text-xs text-white/40">30-day satisfaction guarantee</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
