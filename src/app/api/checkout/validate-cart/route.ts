import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Cart Validation Endpoint
 * Validates cart items against database to prevent price tampering
 *
 * SECURITY: Never trust client-side prices!
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty or invalid' },
        { status: 400 }
      );
    }

    // Validate each item against database
    const validatedItems = [];
    let subtotal = 0;

    for (const item of items) {
      // Fetch product from database
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: {
          id: true,
          title: true,
          price: true,
          status: true,
        },
      });

      // Validate product exists and is active
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 }
        );
      }

      if (product.status !== 'active') {
        return NextResponse.json(
          { error: `Product "${product.title}" is no longer available` },
          { status: 400 }
        );
      }

      // Validate quantity
      if (!item.quantity || item.quantity < 1 || item.quantity > 99) {
        return NextResponse.json(
          { error: `Invalid quantity for "${product.title}"` },
          { status: 400 }
        );
      }

      // CRITICAL: Use database price, ignore client price
      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;

      validatedItems.push({
        productId: product.id,
        title: product.title,
        price: product.price, // Database price, not client price
        quantity: item.quantity,
        lineTotal,
      });
    }

    // Calculate tax (8% - adjust as needed)
    const tax = subtotal * 0.08;

    // Calculate shipping (free for this implementation)
    const shipping = 0;

    // Calculate total
    const total = subtotal + tax + shipping;

    return NextResponse.json({
      valid: true,
      items: validatedItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    });
  } catch (error) {
    console.error('Cart validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate cart' },
      { status: 500 }
    );
  }
}
