import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { status, trackingNumber, shippingLabelUrl, carrier } = await request.json();

    // Get current order to check if status changed
    const currentOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!currentOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status,
        trackingNumber: trackingNumber || null,
        shippingLabelUrl: shippingLabelUrl || null,
        carrier: carrier || null,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
    });

    // Send email notification if status changed
    if (currentOrder.status !== status && updatedOrder.customerEmail) {
      await sendStatusUpdateEmail(updatedOrder);
    }

    return NextResponse.json({
      order: updatedOrder,
      message: 'Order updated successfully. Customer will be notified by email.',
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to send status update email
async function sendStatusUpdateEmail(order: any) {
  try {
    const { sendOrderStatusUpdateEmail } = await import('@/lib/email');

    await sendOrderStatusUpdateEmail({
      orderNumber: order.orderNumber,
      customerName: order.customerName || 'Customer',
      customerEmail: order.customerEmail,
      status: order.status,
      trackingNumber: order.trackingNumber || undefined,
      carrier: order.carrier || undefined,
    });
  } catch (emailError) {
    console.error('Error sending status update email:', emailError);
  }
}
