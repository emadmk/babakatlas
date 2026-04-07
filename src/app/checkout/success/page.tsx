'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Package,
  ArrowRight,
  ShoppingBag,
  LayoutDashboard,
  Mail,
  Calendar,
  Copy,
  Check,
} from 'lucide-react';
import { formatCurrency } from '@/lib/pricing';

// ── Simple confetti-like particles ───────────────────────────────────
function ConfettiParticles() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 2 + Math.random() * 2,
    size: 4 + Math.random() * 6,
    color: [
      '#22c55e',
      '#3b82f6',
      '#f59e0b',
      '#ec4899',
      '#8b5cf6',
      '#06b6d4',
    ][Math.floor(Math.random() * 6)],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: -10,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: typeof window !== 'undefined' ? window.innerHeight + 20 : 1000,
            opacity: 0,
            rotate: 360 + Math.random() * 360,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  );
}

// ── Animated checkmark ───────────────────────────────────────────────
function AnimatedCheckmark() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
      className="relative"
    >
      {/* Glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-emerald-500/20"
        initial={{ scale: 1 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 1.5, repeat: 2, repeatType: 'loop', delay: 0.5 }}
      />
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 300 }}
        >
          <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
        </motion.div>
      </div>
    </motion.div>
  );
}

// ── Main Success Page ────────────────────────────────────────────────
export default function CheckoutSuccessPage() {
  const router = useRouter();

  const [orderNumber, setOrderNumber] = useState<string>('');
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [orderCountry, setOrderCountry] = useState<string>('PH');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const num = sessionStorage.getItem('lastOrderNumber');
    const total = sessionStorage.getItem('lastOrderTotal');
    const country = sessionStorage.getItem('lastOrderCountry');

    if (num) setOrderNumber(num);
    if (total) setOrderTotal(parseFloat(total));
    if (country) setOrderCountry(country);

    // Clean up session storage
    return () => {
      sessionStorage.removeItem('lastOrderId');
      sessionStorage.removeItem('lastOrderNumber');
      sessionStorage.removeItem('lastOrderTotal');
      sessionStorage.removeItem('lastOrderCountry');
    };
  }, []);

  const handleCopyOrder = useCallback(() => {
    if (orderNumber) {
      navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [orderNumber]);

  // Estimated delivery: 7-14 business days from now
  const estimatedDelivery = (() => {
    const start = new Date();
    start.setDate(start.getDate() + 7);
    const end = new Date();
    end.setDate(end.getDate() + 14);
    const fmt = (d: Date) =>
      d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${fmt(start)} - ${fmt(end)}`;
  })();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      <ConfettiParticles />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-lg w-full text-center space-y-8"
      >
        {/* Checkmark */}
        <div className="flex justify-center">
          <AnimatedCheckmark />
        </div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Your order has been placed!
          </h1>
          <p className="text-white/50 text-lg">
            Thank you for choosing Atlas Adaptive Tint.
          </p>
        </motion.div>

        {/* Order details card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 text-left space-y-4"
        >
          {/* Order number */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider">Order Number</p>
              <p className="text-xl font-mono font-bold text-white mt-0.5">
                {orderNumber || 'TG-XXXXXXXX-XXXX'}
              </p>
            </div>
            <button
              onClick={handleCopyOrder}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              title="Copy order number"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4 text-white/40" />
              )}
            </button>
          </div>

          <div className="border-t border-white/10" />

          {/* Order total */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-white/40" />
              <span className="text-sm text-white/50">Order Total</span>
            </div>
            <span className="font-semibold text-white">
              {orderTotal > 0
                ? formatCurrency(orderTotal, orderCountry)
                : '--'}
            </span>
          </div>

          {/* Estimated delivery */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white/40" />
              <span className="text-sm text-white/50">Estimated Delivery</span>
            </div>
            <span className="text-sm font-medium text-white/80">
              {estimatedDelivery}
            </span>
          </div>

          {/* Email notice */}
          <div className="rounded-xl bg-white/[0.04] border border-white/5 p-3 flex items-start gap-3">
            <Mail className="w-4 h-4 text-blue-400/70 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-white/50">
              A confirmation email with your order details and tracking information
              has been sent to your email address.
            </p>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <button
            onClick={() => router.push('/dashboard')}
            className="flex-1 py-3.5 px-6 rounded-xl bg-white text-black font-semibold flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Go to Dashboard
          </button>
          <button
            onClick={() => router.push('/configurator')}
            className="flex-1 py-3.5 px-6 rounded-xl bg-white/10 text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/15 transition-colors border border-white/10"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-white/30 text-xs"
        >
          Need help? Contact us at support@atlasadaptivetint.com
        </motion.p>
      </motion.div>
    </div>
  );
}
