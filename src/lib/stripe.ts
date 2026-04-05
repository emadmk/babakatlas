import Stripe from 'stripe';

// ── Server-side Stripe instance ───────────────────────────────────────
export function getStripeInstance(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Stripe(key, { apiVersion: '2024-12-18.acacia' as any });
}

// ── Create Checkout Session ───────────────────────────────────────────
export async function createCheckoutSession(params: {
  items: Array<{ name: string; description: string; amount: number; quantity: number }>;
  customerEmail: string;
  orderId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const stripe = getStripeInstance();
  if (!stripe) throw new Error('Stripe not configured');

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: params.customerEmail,
    metadata: { orderId: params.orderId },
    line_items: params.items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description,
        },
        unit_amount: Math.round(item.amount * 100),
      },
      quantity: item.quantity,
    })),
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  });

  return session;
}

// ── Create Payment Intent (alternative flow) ──────────────────────────
export async function createPaymentIntent(amount: number, currency: string = 'usd', metadata: Record<string, string> = {}) {
  const stripe = getStripeInstance();
  if (!stripe) throw new Error('Stripe not configured');

  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata,
  });
}

// ── Client-side publishable key helper ────────────────────────────────
export function getStripePublishableKey(): string {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    console.warn(
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined. Stripe Elements will not work.',
    );
    return '';
  }
  return key;
}
