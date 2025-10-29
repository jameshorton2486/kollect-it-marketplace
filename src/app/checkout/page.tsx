'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '@/contexts/CartContext';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import Link from 'next/link';
import Image from 'next/image';
import { BLUR_DATA_URL, transformCloudinary } from '@/lib/image';

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface BillingInfo {
  sameAsShipping: boolean;
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, itemCount, subtotal, tax, total, clearCart } = useCart();

  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validatedTotal, setValidatedTotal] = useState<number | null>(null);

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    sameAsShipping: true,
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (itemCount === 0) {
      router.push('/cart');
    }
  }, [itemCount, router]);

  // Update shipping info when session loads
  useEffect(() => {
    if (session?.user) {
      setShippingInfo((prev) => ({
        ...prev,
        fullName: session.user?.name || prev.fullName,
        email: session.user?.email || prev.email,
      }));
    }
  }, [session]);

  const validateShippingForm = (): boolean => {
    const required = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];

    for (const field of required) {
      if (!shippingInfo[field as keyof ShippingInfo]) {
        setError(`Please fill in all required fields`);
        return false;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Validate phone format (basic)
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(shippingInfo.phone)) {
      setError('Please enter a valid phone number');
      return false;
    }

    // Validate ZIP code format (US)
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(shippingInfo.zipCode)) {
      setError('Please enter a valid ZIP code');
      return false;
    }

    return true;
  };

  const handleContinueToPayment = async () => {
    setError('');

    if (!validateShippingForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create Payment Intent
      const response = await fetch('/api/checkout/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingInfo,
          billingInfo: billingInfo.sameAsShipping ? shippingInfo : billingInfo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      setClientSecret(data.clientSecret);
      if (typeof data.validatedTotal === 'number') {
        setValidatedTotal(data.validatedTotal);
      }
      setStep('payment');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (itemCount === 0) {
    return null; // Will redirect
  }

  const stripePromise = getStripe();

  return (
    <div className="checkout-page">
      {/* Progress Indicator */}
      <div className="checkout-progress">
        <div className={`checkout-steps ${step === 'shipping' ? 'step-1' : 'step-2'}`}>
          <div className="checkout-step-fill" />
          <div className={`checkout-step ${step === 'shipping' ? 'active' : 'completed'}`}>
            <div className="checkout-step-circle">1</div>
            <div className="checkout-step-label">Shipping</div>
          </div>
          <div className={`checkout-step ${step === 'payment' ? 'active' : ''}`}>
            <div className="checkout-step-circle">2</div>
            <div className="checkout-step-label">Payment</div>
          </div>
        </div>
      </div>

      <div className="checkout-content">
        <div className="container">
          <div className="checkout-layout">
            {/* Left Column - Forms */}
            <div className="checkout-forms">
              {error && (
                <div className="checkout-error">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Shipping Form */}
              {step === 'shipping' && (
                <div className="checkout-section">
                  <h2 className="checkout-section-title">Shipping Information</h2>

                  <div className="checkout-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label" htmlFor="shipping-fullName">Full Name *</label>
                        <input
                          id="shipping-fullName"
                          type="text"
                          required
                          value={shippingInfo.fullName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                          className="form-input"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label" htmlFor="shipping-email">Email Address *</label>
                        <input
                          id="shipping-email"
                          type="email"
                          required
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                          className="form-input"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="shipping-phone">Phone Number *</label>
                        <input
                          id="shipping-phone"
                          type="tel"
                          required
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                          className="form-input"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label" htmlFor="shipping-address">Street Address *</label>
                        <input
                          id="shipping-address"
                          type="text"
                          required
                          value={shippingInfo.address}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                          className="form-input"
                          placeholder="123 Main Street"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label" htmlFor="shipping-city">City *</label>
                        <input
                          id="shipping-city"
                          type="text"
                          required
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          className="form-input"
                          placeholder="New York"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="shipping-state">State *</label>
                        <input
                          id="shipping-state"
                          type="text"
                          required
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                          className="form-input"
                          placeholder="NY"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label" htmlFor="shipping-zip">ZIP Code *</label>
                        <input
                          id="shipping-zip"
                          type="text"
                          required
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                          className="form-input"
                          placeholder="10001"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="shipping-country">Country *</label>
                          <select
                            id="shipping-country"
                            value={shippingInfo.country}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                            className="form-input"
                          >
                            <option>United States</option>
                            <option>Canada</option>
                            <option>United Kingdom</option>
                            <option>Australia</option>
                            <option>Other</option>
                          </select>
                      </div>
                    </div>

                      {session?.user && (
                        <div className="form-row">
                          <label className="form-checkbox">
                            <input type="checkbox" />
                            <span>Save this address to my account</span>
                          </label>
                        </div>
                      )}

                    <button
                      onClick={handleContinueToPayment}
                      disabled={loading}
                      className="btn-continue"
                    >
                      {loading ? 'Processing...' : 'Continue to Payment'}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Form */}
              {step === 'payment' && clientSecret && (
                <div className="checkout-section">
                  <h2 className="checkout-section-title">Payment Information</h2>

                  {/* Shipping Summary with Edit */}
                  <div className="shipping-review">
                    <div className="shipping-review-header">
                      <h3>Shipping To</h3>
                      <button onClick={() => setStep('shipping')} className="btn-link">Edit</button>
                    </div>
                    <div className="shipping-review-body">
                      <p className="font-medium">{shippingInfo.fullName}</p>
                      <p>{shippingInfo.address}</p>
                      <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                    </div>
                  </div>

                  {/* Billing Address Toggle */}
                  <div className="billing-toggle">
                    <label className="form-checkbox">
                      <input
                        type="checkbox"
                        checked={billingInfo.sameAsShipping}
                        onChange={(e) => setBillingInfo({ ...billingInfo, sameAsShipping: e.target.checked })}
                      />
                      <span>Billing address is same as shipping</span>
                    </label>
                  </div>

                  {!billingInfo.sameAsShipping && (
                    <div className="checkout-form mt-3">
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label" htmlFor="billing-fullName">Full Name *</label>
                          <input
                            id="billing-fullName"
                            type="text"
                            required
                            value={billingInfo.fullName}
                            onChange={(e) => setBillingInfo({ ...billingInfo, fullName: e.target.value })}
                            className="form-input"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label" htmlFor="billing-address">Street Address *</label>
                          <input
                            id="billing-address"
                            type="text"
                            required
                            value={billingInfo.address}
                            onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                            className="form-input"
                            placeholder="123 Main Street"
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label" htmlFor="billing-city">City *</label>
                          <input
                            id="billing-city"
                            type="text"
                            required
                            value={billingInfo.city}
                            onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                            className="form-input"
                            placeholder="New York"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="billing-state">State *</label>
                          <input
                            id="billing-state"
                            type="text"
                            required
                            value={billingInfo.state}
                            onChange={(e) => setBillingInfo({ ...billingInfo, state: e.target.value })}
                            className="form-input"
                            placeholder="NY"
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label" htmlFor="billing-zip">ZIP Code *</label>
                          <input
                            id="billing-zip"
                            type="text"
                            required
                            value={billingInfo.zipCode}
                            onChange={(e) => setBillingInfo({ ...billingInfo, zipCode: e.target.value })}
                            className="form-input"
                            placeholder="10001"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="billing-country">Country *</label>
                          <select
                            id="billing-country"
                            value={billingInfo.country}
                            onChange={(e) => setBillingInfo({ ...billingInfo, country: e.target.value })}
                            className="form-input"
                          >
                            <option>United States</option>
                            <option>Canada</option>
                            <option>United Kingdom</option>
                            <option>Australia</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm
                      clientSecret={clientSecret}
                      shippingInfo={shippingInfo}
                      billingInfo={billingInfo.sameAsShipping ? shippingInfo : billingInfo}
                      totalAmount={validatedTotal ?? total}
                      onSuccess={() => clearCart()}
                    />
                  </Elements>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className="checkout-summary">
              <h2 className="checkout-summary-title">Order Summary</h2>

              <div className="checkout-summary-items">
                {items.map((item) => (
                  <div key={item.id} className="checkout-summary-item">
                    <Image src={transformCloudinary(item.image, 'thumbnail')} alt={`${item.title} in order summary`} width={64} height={64} className="rounded object-cover" loading="lazy" quality={85} placeholder="blur" blurDataURL={BLUR_DATA_URL} />
                    <div className="checkout-summary-item-info">
                      <h4>{item.title}</h4>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <span className="checkout-summary-item-price">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="checkout-summary-divider" />

              <div className="checkout-summary-row">
                <span>Subtotal ({itemCount} items)</span>
                <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              <div className="checkout-summary-row">
                <span>Shipping</span>
                <span className="checkout-shipping-free">Free</span>
              </div>

              <div className="checkout-summary-row">
                <span>Tax (8%)</span>
                <span>${tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              <div className="checkout-summary-divider" />

              <div className="checkout-summary-total">
                <span>Total</span>
                <span>${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              <div className="checkout-trust-badges">
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
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  <span>Powered by Stripe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
