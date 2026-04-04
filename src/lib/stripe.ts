import Stripe from 'stripe';

// ── Server-side Stripe instance ───────────────────────────────────────
// Ensure STRIPE_SECRET_KEY is set in your .env.local
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!stripeSecretKey) {
      throw new Error(
        'STRIPE_SECRET_KEY is not defined. Add it to your .env.local file.',
      );
    }
    _stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia' as Stripe.StripeConfig['apiVersion'],
      typescript: true,
    });
  }
  return _stripe;
}

// ── Create Checkout Session ───────────────────────────────────────────
export interface CheckoutSessionParams {
  orderId: string;
  lineItems: {
    name: string;
    description?: string;
    amount: number; // in cents
    quantity: number;
  }[];
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export async function createCheckoutSession(
  params: CheckoutSessionParams,
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: params.customerEmail,
    line_items: params.lineItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description,
        },
        unit_amount: item.amount,
      },
      quantity: item.quantity,
    })),
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      orderId: params.orderId,
      ...params.metadata,
    },
  });

  return session;
}

// ── Create Payment Intent (alternative flow) ──────────────────────────
export interface PaymentIntentParams {
  amount: number; // in cents
  currency?: string;
  customerEmail: string;
  orderId: string;
  metadata?: Record<string, string>;
}

export async function createPaymentIntent(
  params: PaymentIntentParams,
): Promise<Stripe.PaymentIntent> {
  const stripe = getStripe();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: params.amount,
    currency: params.currency ?? 'usd',
    receipt_email: params.customerEmail,
    metadata: {
      orderId: params.orderId,
      ...params.metadata,
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
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
