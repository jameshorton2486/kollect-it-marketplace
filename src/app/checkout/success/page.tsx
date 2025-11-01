"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface OrderDetails {
  orderNumber: string;
  email: string;
  total: number;
  items: {
    title: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    if (!paymentIntentId) {
      setError("No payment information found");
      setLoading(false);
      return;
    }

    const createOrder = async () => {
      try {
        const response = await fetch("/api/checkout/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create order");
        }

        setOrderDetails(data.order);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    createOrder();
  }, [paymentIntentId]);

  if (loading) {
    return (
      <div className="success-page">
        <div className="success-container">
          <div className="success-loading">
            <div className="spinner-large"></div>
            <h2>Processing your order...</h2>
            <p>Please wait while we confirm your payment</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="success-page">
        <div className="success-container">
          <div className="success-error">
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <Link href="/cart" className="btn-primary">
              Return to Cart
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return null;
  }

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-content">
          {/* Success Icon */}
          <div className="success-icon">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="success-title">Order Confirmed!</h1>
          <p className="success-subtitle">
            Thank you for your purchase. We've sent a confirmation email to{" "}
            <strong>{orderDetails.email}</strong>
          </p>

          {/* Order Number */}
          <div className="success-order-number">
            <span className="success-order-label">Order Number:</span>
            <span className="success-order-value">
              {orderDetails.orderNumber}
            </span>
          </div>

          {/* Order Summary */}
          <div className="success-summary">
            <h2 className="success-summary-title">Order Summary</h2>

            <div className="success-items">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="success-item">
                  <div className="success-item-info">
                    <h4>{item.title}</h4>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <span className="success-item-price">
                    ${(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="success-summary-divider" />

            <div className="success-total">
              <span>Total Paid</span>
              <span>
                $
                {orderDetails.total.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="success-shipping">
            <h3 className="success-shipping-title">Shipping Address</h3>
            <p>{orderDetails.shippingAddress.address}</p>
            <p>
              {orderDetails.shippingAddress.city},{" "}
              {orderDetails.shippingAddress.state}{" "}
              {orderDetails.shippingAddress.zipCode}
            </p>
          </div>

          {/* Next Steps */}
          <div className="success-next-steps">
            <h3 className="success-next-title">What's Next?</h3>
            <ul className="success-steps-list">
              <li>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                You'll receive an email confirmation shortly
              </li>
              <li>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                We'll send you tracking information once your order ships
              </li>
              <li>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Expected delivery: 5-7 business days
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="success-actions">
            <Link href="/account?tab=orders" className="btn-primary">
              View Order Status
            </Link>
            <Link href="/" className="btn-secondary">
              Continue Shopping
            </Link>
          </div>

          {/* Help Section */}
          <div className="success-help">
            <p>
              Need help?{" "}
              <Link href="/contact" className="success-help-link">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="success-page">
          <div className="success-container">
            <div className="success-loading">
              <div className="spinner-large"></div>
              <h2>Loading...</h2>
            </div>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
