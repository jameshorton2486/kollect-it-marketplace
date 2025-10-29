import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { getRequestId } from '@/lib/request-context';
import { respondError } from '@/lib/api-error';

/**
 * Stripe Webhook Handler
 * Processes Stripe events for payment confirmations
 *
 * IMPORTANT: Webhook secret must be set in production
 * Get from: Stripe Dashboard → Developers → Webhooks
 */

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    logger.warn('Stripe webhook missing signature', { requestId });
    const res = NextResponse.json({ error: 'Missing signature', requestId }, { status: 400 });
    res.headers.set('X-Request-ID', requestId);
    return res;
  }

  // Verify webhook signature
  let event: Stripe.Event;

  try {
    if (!webhookSecret) {
      if (process.env.NODE_ENV !== 'development') {
        logger.error('Stripe webhook secret missing in production', { requestId });
  return respondError(request, new Error('Webhook secret not configured'), { status: 503, code: 'webhook_secret_missing' });
      }
      logger.warn('STRIPE_WEBHOOK_SECRET not set - verification disabled (dev only)', { requestId });
      event = JSON.parse(body) as Stripe.Event;
    } else {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    }
  } catch (err) {
    logger.error('Stripe webhook signature verification failed', { requestId }, err);
    const res = NextResponse.json({ error: 'Invalid signature', requestId }, { status: 400 });
    res.headers.set('X-Request-ID', requestId);
    return res;
  }

  logger.info('Stripe webhook received', { requestId, type: event.type });

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
  logger.info('PaymentIntent succeeded', { requestId, paymentIntentId: paymentIntent.id });

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
          logger.info('Order updated to paid', { requestId, orderId: paymentIntent.metadata.orderId });
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
  logger.warn('PaymentIntent failed', { requestId, paymentIntentId: failedPayment.id });

        // Update order to failed status
        if (failedPayment.metadata?.orderId) {
          await prisma.order.update({
            where: { id: failedPayment.metadata.orderId },
            data: {
              paymentStatus: 'failed',
            },
          });
          logger.info('Order marked as failed', { requestId, orderId: failedPayment.metadata.orderId });
        }
        break;

      case 'charge.succeeded':
        const charge = event.data.object as Stripe.Charge;
  logger.info('Charge succeeded', { requestId, chargeId: charge.id });
        break;

      case 'charge.failed':
        const failedCharge = event.data.object as Stripe.Charge;
  logger.warn('Charge failed', { requestId, chargeId: failedCharge.id });
        break;

      default:
        logger.info('Unhandled Stripe event type', { requestId, type: event.type });
    }
    const res = NextResponse.json({ received: true, requestId });
    res.headers.set('X-Request-ID', requestId);
    return res;
  } catch (error) {
    logger.error('Error processing Stripe webhook', { requestId }, error);
  return respondError(request, error, { status: 500, code: 'webhook_processing_failed' });
  }
}
