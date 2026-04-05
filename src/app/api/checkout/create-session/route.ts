import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, email, orderId } = body;

    if (!items || !email || !orderId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: items, email, orderId' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3002';

    const session = await createCheckoutSession({
      items: items.map((item: { name: string; description?: string; amount: number; quantity: number }) => ({
        name: item.name,
        description: item.description || '',
        amount: item.amount,
        quantity: item.quantity,
      })),
      customerEmail: email,
      orderId,
      successUrl: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/checkout?cancelled=true`,
    });

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error) {
    console.error('Checkout session creation failed:', error);
    const message = error instanceof Error ? error.message : 'Failed to create checkout session';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
