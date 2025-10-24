'use client';

import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { items, removeItem, updateQuantity, itemCount, subtotal, tax, total, clearCart } = useCart();

  if (itemCount === 0) {
    return (
      <div className="cart-page">
        {/* Header */}
        <header className="header">
          <div className="header-container">
            <Link href="/" className="logo">
              <svg width="180" height="40" viewBox="0 0 180 40" fill="none">
                <text
                  x="50%"
                  y="50%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fontFamily="var(--font-serif)"
                  fontSize="24"
                  fontWeight="400"
                  fill="#322923"
                >
                  KOLLECT • IT
                </text>
              </svg>
            </Link>
          </div>
        </header>

        {/* Empty Cart */}
        <div className="cart-empty">
          <div className="cart-empty-content">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <h1>Your Cart is Empty</h1>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link href="/" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <Link href="/" className="logo">
            <svg width="180" height="40" viewBox="0 0 180 40" fill="none">
              <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontFamily="var(--font-serif)"
                fontSize="24"
                fontWeight="400"
                fill="#322923"
              >
                KOLLECT • IT
              </text>
            </svg>
          </Link>
        </div>
      </header>

      <div className="cart-content container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <p className="cart-item-count">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <Link href={`/product/${item.slug}`} className="cart-item-image">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={150}
                    height={150}
                    className="cart-item-img"
                  />
                </Link>

                <div className="cart-item-details">
                  <div className="cart-item-info">
                    <span className="cart-item-category">{item.categoryName}</span>
                    <Link href={`/product/${item.slug}`} className="cart-item-title">
                      {item.title}
                    </Link>
                    <p className="cart-item-price">${item.price.toLocaleString()}</p>
                  </div>

                  <div className="cart-item-actions">
                    <div className="cart-item-quantity">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="quantity-btn"
                        aria-label="Decrease quantity"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="quantity-btn"
                        aria-label="Increase quantity"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="cart-item-remove"
                      aria-label="Remove item"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      Remove
                    </button>
                  </div>

                  <div className="cart-item-subtotal">
                    ${(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}

            <button onClick={clearCart} className="btn-clear-cart">
              Clear Cart
            </button>
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="cart-summary-row">
              <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
              <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <div className="cart-summary-row">
              <span>Shipping</span>
              <span className="cart-shipping-note">Calculated at checkout</span>
            </div>

            <div className="cart-summary-row">
              <span>Estimated Tax (8%)</span>
              <span>${tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <div className="cart-summary-divider" />

            <div className="cart-summary-total">
              <span>Total</span>
              <span>${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <Link href="/checkout" className="btn-checkout">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Proceed to Checkout
            </Link>

            <Link href="/" className="btn-continue-shopping">
              Continue Shopping
            </Link>

            <div className="cart-trust-badges">
              <div className="trust-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Secure Checkout</span>
              </div>
              <div className="trust-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>30-Day Returns</span>
              </div>
              <div className="trust-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
                <span>Authenticity Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
