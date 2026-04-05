import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripeInstance } from '@/lib/stripe';
import { sendOrderConfirmationEmail, sendAdminNewOrderEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  const stripe = getStripeInstance();
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook signature verification failed';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      const customerEmail = session.customer_email;

      console.log(`Checkout session completed for order: ${orderId}`);

      // Update order status to CONFIRMED via internal API
      if (orderId) {
        try {
          const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3002';
          const updateRes = await fetch(`${baseUrl}/api/orders/${orderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              status: 'CONFIRMED',
              paymentStatus: 'PAID',
              stripeSessionId: session.id,
              stripePaymentIntentId: session.payment_intent as string,
            }),
          });

          if (updateRes.ok) {
            const orderData = await updateRes.json();
            const order = orderData.data;

            // Send order confirmation email to customer
            if (customerEmail && order) {
              await sendOrderConfirmationEmail(customerEmail, {
                orderNumber: order.orderNumber || orderId,
                items: order.items?.map((item: { name: string; quantity: number; price: number }) => ({
                  name: item.name,
                  qty: item.quantity || 1,
                  price: item.price || 0,
                })) || [{ name: 'Window Tint Order', qty: 1, price: (session.amount_total || 0) / 100 }],
                subtotal: (session.amount_subtotal || session.amount_total || 0) / 100,
                shipping: 0,
                tax: 0,
                total: (session.amount_total || 0) / 100,
                shippingAddress: order.shippingAddress || 'See order details',
                estimatedDelivery: '5-10 business days',
              });

              // Send admin notification
              await sendAdminNewOrderEmail(
                order.orderNumber || orderId,
                (session.amount_total || 0) / 100,
                order.contactName || customerEmail
              );
            }
          }
        } catch (error) {
          console.error('Failed to update order after payment:', error);
        }
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
