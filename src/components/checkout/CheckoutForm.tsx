"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "../ui/Button";

interface AddressInfo {
  fullName: string;
  email?: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface CheckoutFormProps {
  clientSecret: string;
  shippingInfo: AddressInfo;
  billingInfo: AddressInfo;
  totalAmount?: number;
  onSuccess: () => void;
}

export default function CheckoutForm({
  clientSecret,
  shippingInfo,
  billingInfo,
  totalAmount,
  onSuccess,
}: CheckoutFormProps) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message);
      }

      const { error: confirmError, paymentIntent } =
        await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}/checkout/success`,
            payment_method_data: {
              billing_details: {
                name: billingInfo.fullName,
                email: shippingInfo.email,
                phone: shippingInfo.phone,
                address: {
                  line1: billingInfo.address,
                  city: billingInfo.city,
                  state: billingInfo.state,
                  postal_code: billingInfo.zipCode,
                  country: "US",
                },
              },
            },
          },
          redirect: "if_required",
        });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // Payment successful - clear cart and redirect
        onSuccess();
        router.push(`/checkout/success?payment_intent=${paymentIntent.id}`);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Payment failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-payment-form">
      {error && (
        <div className="checkout-error">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      <div className="payment-element-wrapper">
        <PaymentElement
          options={{
            layout: "tabs",
            terms: {
              card: "auto",
            },
          }}
        />
      </div>

      <Button type="submit" disabled={!stripe || loading}>
        {loading ? (
          <>
            <div className="spinner"></div>
            Processing...
          </>
        ) : (
          <>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            {typeof totalAmount === "number"
              ? `Place Order - $${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : "Pay Now"}
          </>
        )}
      </Button>

      <p className="checkout-secure-notice">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
        Your payment information is encrypted and secure
      </p>
    </form>
  );
}
