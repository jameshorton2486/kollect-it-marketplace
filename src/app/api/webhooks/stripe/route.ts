import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

/**
 * Stripe Webhook Handler
 * Processes Stripe events for payment confirmations
 *
 * IMPORTANT: Webhook secret must be set in production
 * Get from: Stripe Dashboard → Developers → Webhooks
 */

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    console.error('Missing stripe-signature header');
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  // Verify webhook signature
  let event: Stripe.Event;

  try {
    if (!webhookSecret) {
      console.warn('STRIPE_WEBHOOK_SECRET not set - webhook verification disabled');
      // In development, you can parse without verification (NOT for production!)
      event = JSON.parse(body) as Stripe.Event;
    } else {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err instanceof Error ? err.message : 'Unknown error');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log(`Received webhook event: ${event.type}`);

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);

        // Update order status in database
        // Note: You may need to add stripePaymentIntentId field to Order model
        if (paymentIntent.metadata?.orderId) {
          await prisma.order.update({
            where: { id: paymentIntent.metadata.orderId },
            data: {
              paymentStatus: 'paid',
              status: 'processing',
            },
          });
          console.log(`Updated order ${paymentIntent.metadata.orderId} to paid`);
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.error(`PaymentIntent failed: ${failedPayment.id}`);

        // Update order to failed status
        if (failedPayment.metadata?.orderId) {
          await prisma.order.update({
            where: { id: failedPayment.metadata.orderId },
            data: {
              paymentStatus: 'failed',
            },
          });
          console.log(`Marked order ${failedPayment.metadata.orderId} as failed`);
        }
        break;

      case 'charge.succeeded':
        const charge = event.data.object as Stripe.Charge;
        console.log(`Charge succeeded: ${charge.id}`);
        break;

      case 'charge.failed':
        const failedCharge = event.data.object as Stripe.Charge;
        console.error(`Charge failed: ${failedCharge.id}`);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
