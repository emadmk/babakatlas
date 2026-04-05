import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { orders } from '@/lib/ordersStore';

// ── GET: Get order details ────────────────────────────────────────────
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const order = orders.get(id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 },
      );
    }

    // Check authorization: either the order owner or allow anonymous for recently created orders
    const session = await getServerSession(authOptions);
    if (order.userId && (session?.user as { id?: string } | undefined)?.id !== order.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 },
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// ── PATCH: Update order status ────────────────────────────────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const order = orders.get(id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 },
      );
    }

    const body = await request.json();
    const { status, paymentStatus, stripeSessionId } = body;

    // Validate status transitions
    const validStatuses = [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 },
      );
    }

    const validPaymentStatuses = ['unpaid', 'paid', 'refunded'];
    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid payment status. Must be one of: ${validPaymentStatuses.join(', ')}`,
        },
        { status: 400 },
      );
    }

    // Apply updates
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (stripeSessionId) order.stripeSessionId = stripeSessionId;
    order.updatedAt = new Date().toISOString();

    orders.set(id, order);

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 },
    );
  }
}
