import { NextResponse } from 'next/server';
import { stripe, formatAmountForStripe } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const { items, shippingInfo, billingInfo } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = items.reduce((total: number, item: any) => {
      return total + (item.price * item.quantity);
    }, 0);

    const tax = subtotal * 0.08; // 8% tax
    const shipping = 0; // Free shipping
    const total = subtotal + tax + shipping;

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(total),
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        subtotal: subtotal.toString(),
        tax: tax.toString(),
        shipping: shipping.toString(),
        total: total.toString(),
        itemCount: items.length.toString(),
        shippingName: shippingInfo.fullName,
        shippingEmail: shippingInfo.email,
        shippingPhone: shippingInfo.phone,
        shippingAddress: JSON.stringify({
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
        }),
        items: JSON.stringify(items.map((item: any) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        }))),
      },
      description: `Kollect-It Order - ${items.length} item(s)`,
      receipt_email: shippingInfo.email,
      shipping: {
        name: shippingInfo.fullName,
        phone: shippingInfo.phone,
        address: {
          line1: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          postal_code: shippingInfo.zipCode,
          country: 'US',
        },
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
