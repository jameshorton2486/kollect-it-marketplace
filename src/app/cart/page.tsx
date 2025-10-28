'use client';

import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface SuggestionProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  images: { url: string }[];
  category: { name: string };
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, itemCount, subtotal, tax, total, clearCart } = useCart();
  const [suggestions, setSuggestions] = useState<SuggestionProduct[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/products?featured=true&limit=6', { cache: 'no-store' });
        let data: SuggestionProduct[] = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
          const res2 = await fetch('/api/products?limit=6', { cache: 'no-store' });
          data = await res2.json();
        }
        if (!cancelled) setSuggestions(data);
      } catch {
        // ignore
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  if (itemCount === 0) {
    return (
      <div className="container py-16">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto mb-4 h-24 w-24 text-[var(--color-charcoal)]">
            <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl text-brand-navy">Your cart is empty</h1>
          <p className="mt-2 text-[var(--color-charcoal)]">Start exploring our collection.</p>
          <Link href="/shop" className="btn-cta mt-4 inline-block">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--color-border)] pb-4">
        <div>
          <h1 className="font-serif text-brand-navy text-[42px] leading-tight">Your Cart</h1>
          <p className="text-xs uppercase tracking-wider text-[var(--color-charcoal)]">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
        </div>
        <Link href="/shop" className="text-sm text-brand-gold hover:underline">Continue Shopping</Link>
      </div>

      {/* Layout */}
      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        {/* Items */}
        <div className="flex-1">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-4 border-b border-[var(--color-border)] py-4">
              <Link href={`/product/${item.slug}`} className="block h-[120px] w-[120px] shrink-0 overflow-hidden rounded bg-[var(--color-gray-light)]">
                <Image src={item.image} alt={item.title} width={120} height={120} className="h-full w-full object-cover" />
              </Link>

              <div className="flex w-full flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[12px] uppercase tracking-wider text-brand-gold">{item.categoryName}</p>
                    <Link href={`/product/${item.slug}`} className="font-serif text-[18px] leading-snug text-brand-navy no-underline hover:underline">{item.title}</Link>
                    <p className="text-brand-gold">${item.price.toLocaleString()}</p>
                  </div>

                  <div className="text-right">
                    <div className="inline-flex items-center rounded border border-[var(--color-border)]">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity" className="px-3 py-2">−</button>
                      <span className="w-10 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity" className="px-3 py-2">+</button>
                    </div>
                    <div className="mt-2 font-semibold text-brand-gold">${(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                </div>

                <div>
                  <button onClick={() => removeItem(item.id)} aria-label="Remove item" className="text-sm text-[var(--color-gray-dark)] transition-colors hover:text-red-500">× Remove</button>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-3">
            <button onClick={clearCart} className="rounded border border-[var(--color-border)] px-3 py-2 text-sm">Clear Cart</button>
          </div>
        </div>

        {/* Summary */}
        <aside className="w-full lg:w-80 lg:shrink-0">
          <div className="rounded border border-[var(--color-border)] p-4">
            <h2 className="font-serif text-brand-navy text-xl">Order Summary</h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between"><span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span><span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
              <div className="flex items-center justify-between"><span>Shipping</span><span className="text-[var(--color-charcoal)]">Calculated at checkout</span></div>
              <div className="flex items-center justify-between"><span>Estimated Tax (8%)</span><span>${tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
            </div>
            <div className="my-3 border-t border-[var(--color-border)]" />
            <div className="flex items-center justify-between font-semibold text-brand-gold"><span>Total</span><span>${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>

            <Link href="/checkout" className="btn-cta mt-4 block w-full text-center">Proceed to Checkout</Link>
            <Link href="/shop" className="mt-2 block text-center text-sm text-brand-gold hover:underline">Continue Shopping</Link>
          </div>
        </aside>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="section-spacing">
          <h2 className="font-serif text-brand-navy text-2xl">You may also like</h2>
          <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
            {suggestions.map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="w-[220px] shrink-0">
                <div className="h-[160px] w-full overflow-hidden rounded">
                  {p.images[0] ? (
                    <img src={p.images[0].url} alt={p.title} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
                  ) : (
                    <div className="h-full w-full bg-[var(--color-gray-light)]" />
                  )}
                </div>
                <div className="mt-2">
                  <h3 className="line-clamp-2 min-h-[3rem] text-sm">{p.title}</h3>
                  <p className="text-brand-gold font-medium">${p.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
