'use client';

import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

export default function CartIcon() {
  const { itemCount } = useCart();

  return (
    <Link href="/cart" className="cart-icon-link" aria-label="Shopping cart">
      <div className="cart-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        {itemCount > 0 && (
          <span className="cart-count-badge">{itemCount}</span>
        )}
      </div>
    </Link>
  );
}
