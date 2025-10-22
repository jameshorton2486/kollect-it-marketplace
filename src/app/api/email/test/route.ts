import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  testEmailConnection,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
  sendWelcomeEmail,
  sendAdminNewOrderEmail,
} from '@/lib/email';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true, name: true, email: true },
    });

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { type } = await request.json();

    let result;

    switch (type) {
      case 'connection':
        result = await testEmailConnection();
        break;

      case 'order-confirmation':
        result = await sendOrderConfirmationEmail({
          orderNumber: 'KI-TEST-123456',
          customerName: user.name || 'Test Customer',
          customerEmail: user.email,
          total: 1250.0,
          subtotal: 1150.0,
          tax: 92.0,
          shipping: 0,
          items: [
            { title: 'Classical Landscape Oil Painting, 19th Century', price: 850.0, quantity: 1 },
            { title: 'Antique Gold Pocket Watch, Circa 1920', price: 300.0, quantity: 1 },
          ],
          shippingAddress: {
            address: '123 Collector Lane',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States',
          },
        });
        break;

      case 'status-update':
        result = await sendOrderStatusUpdateEmail({
          orderNumber: 'KI-TEST-123456',
          customerName: user.name || 'Test Customer',
          customerEmail: user.email,
          status: 'shipped',
          trackingNumber: '9400111899223344556677',
          carrier: 'USPS',
        });
        break;

      case 'welcome':
        result = await sendWelcomeEmail({
          name: user.name || 'Test Customer',
          email: user.email,
        });
        break;

      case 'admin-alert':
        result = await sendAdminNewOrderEmail({
          orderNumber: 'KI-TEST-123456',
          customerName: 'John Doe',
          customerEmail: 'customer@example.com',
          total: 1250.0,
          subtotal: 1150.0,
          tax: 92.0,
          shipping: 0,
          items: [
            { title: 'Classical Landscape Oil Painting, 19th Century', price: 850.0, quantity: 1 },
            { title: 'Antique Gold Pocket Watch, Circa 1920', price: 300.0, quantity: 1 },
          ],
          shippingAddress: {
            address: '123 Collector Lane',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States',
          },
        });
        break;

      default:
        return NextResponse.json({ error: 'Invalid test type' }, { status: 400 });
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Test email sent successfully! Check ${user.email} for the email.`,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to send email. Check server logs for details.',
        error: result.error,
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Email test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error testing email',
      error: error.message,
    }, { status: 500 });
  }
}

// Import prisma (need to define it here for the user check)
import { prisma } from '@/lib/prisma';
