import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

interface ShippingAddress {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export async function POST(request: Request) {
  try {
    const { paymentIntentId } = await request.json();

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Payment Intent ID required" },
        { status: 400 },
      );
    }

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 },
      );
    }

    // Get session (optional - guest checkout allowed)
    const session = await getServerSession(authOptions);
    let userId: string | null = null;

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });
      userId = user?.id || null;
    }

    // Parse metadata
    const metadata = paymentIntent.metadata;
    const items = JSON.parse(metadata.items || "[]") as OrderItem[];
    const shippingAddress = JSON.parse(
      metadata.shippingAddress || "{}",
    ) as ShippingAddress;

    // Generate order number
    const orderNumber = `KI-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Check if order already exists (prevent duplicate orders)
    const existingOrder = await prisma.order.findFirst({
      where: {
        paymentMethod: paymentIntentId,
      },
    });

    if (existingOrder) {
      // Return existing order
      return NextResponse.json({
        order: {
          orderNumber: existingOrder.orderNumber,
          email: metadata.shippingEmail,
          total: existingOrder.total,
          items: items.map((item) => ({
            title: item.title,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress,
        },
      });
    }

    // Create order in database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: userId || undefined,
        status: "processing",
        subtotal: parseFloat(metadata.subtotal),
        tax: parseFloat(metadata.tax),
        shipping: parseFloat(metadata.shipping),
        total: parseFloat(metadata.total),
        customerName: metadata.shippingName,
        customerEmail: metadata.shippingEmail,
        customerPhone: metadata.shippingPhone,
        shippingAddress: shippingAddress.address,
        shippingCity: shippingAddress.city,
        shippingState: shippingAddress.state,
        shippingZip: shippingAddress.zipCode,
        shippingCountry: shippingAddress.country,
        paymentMethod: paymentIntentId,
        paymentStatus: "paid",
        items: {
          create: items.map((item) => ({
            productId: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Send confirmation emails
    try {
      const { sendOrderConfirmationEmail, sendAdminNewOrderEmail } =
        await import("@/lib/email");

      const emailData = {
        orderNumber: order.orderNumber,
        customerName: metadata.shippingName,
        customerEmail: metadata.shippingEmail,
        total: order.total,
        subtotal: order.subtotal,
        tax: order.tax,
        shipping: order.shipping,
        items: order.items.map((item) => ({
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress,
      };

      // Send customer confirmation (don't wait for it)
      sendOrderConfirmationEmail(emailData);

      // Send admin notification (don't wait for it)
      sendAdminNewOrderEmail(emailData);
    } catch (emailError) {
      // Log error but don't fail the order creation
      console.error("Error sending order emails:", emailError);
    }

    return NextResponse.json({
      order: {
        orderNumber: order.orderNumber,
        email: metadata.shippingEmail,
        total: order.total,
        items: order.items.map((item) => ({
          title: item.title,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress,
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create order",
      },
      { status: 500 },
    );
  }
}
