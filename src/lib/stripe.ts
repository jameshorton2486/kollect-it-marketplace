import Stripe from "stripe";
import { loadStripe, Stripe as StripeClient } from "@stripe/stripe-js";

// Validate Stripe keys
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

// Server-side Stripe instance
// Using account default API version (omit apiVersion to use latest stable)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
});

// Client-side Stripe promise
let stripePromise: Promise<StripeClient | null>;

export const getStripe = () => {
  if (!stripePromise) {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      throw new Error(
        "Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable",
      );
    }
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

// Format amount for Stripe (convert dollars to cents)
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};

// Format amount for display (convert cents to dollars)
export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100;
};
