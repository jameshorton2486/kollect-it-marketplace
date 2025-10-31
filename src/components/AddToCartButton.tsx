"use client";

import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { Button } from "./ui/Button";

interface AddToCartButtonProps {
  product: {
    id: string;
    title: string;
    price: number;
    slug: string;
    image: string;
    categoryName: string;
  };
  variant?: "primary" | "secondary" | "card";
  className?: string;
  quantity?: number; // Optional quantity to add (defaults to 1)
}

export default function AddToCartButton({
  product,
  variant = "primary",
  className = "",
  quantity = 1,
}: AddToCartButtonProps) {
  const { addItem, items, updateQuantity } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if button is inside a link
    e.stopPropagation(); // Stop event bubbling

    const qty =
      Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;

    const existing = items.find((i) => i.id === product.id);
    if (existing) {
      // Increase existing quantity by qty
      updateQuantity(product.id, existing.quantity + qty);
    } else {
      // Add once, then set to desired qty if > 1
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        slug: product.slug,
        categoryName: product.categoryName,
      });
      if (qty > 1) {
        // After initial add (quantity 1 by default), set to qty
        updateQuantity(product.id, qty);
      }
    }

    // Show "Added!" feedback
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (variant === "card") {
    return (
      <button
        onClick={handleAddToCart}
        className={`product-card-cart-btn ${added ? "added" : ""} ${className}`}
        aria-label="Add to cart"
      >
        {added ? (
          <>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Added!
          </>
        ) : (
          <>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Add to Cart
          </>
        )}
      </button>
    );
  }

  if (variant === "secondary") {
    return (
      <Button
        variant="secondary"
        onClick={handleAddToCart}
        className={`${added ? "added" : ""} ${className}`}
      >
        {added ? (
          <>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Added to Cart!
          </>
        ) : (
          <>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Add to Cart
          </>
        )}
      </Button>
    );
  }

  // default 'primary'
  return (
    <Button
      variant="primary"
      onClick={handleAddToCart}
      className={`${added ? "added" : ""} ${className}`}
    >
      {added ? (
        <>
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
          Added to Cart!
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
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Add to Cart
        </>
      )}
    </Button>
  );
}
