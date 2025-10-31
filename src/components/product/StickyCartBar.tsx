"use client";

interface Product {
  title: string;
  price: number;
}

interface StickyCartBarProps {
  product: Product;
}

export default function StickyCartBar({ product }: StickyCartBarProps) {
  const handleAddToCart = () => {
    alert(`Added "${product.title}" to cart! (Cart feature coming soon)`);
  };

  return (
    <div className="sticky-cart-bar">
      <div className="sticky-cart-content">
        <div className="sticky-cart-info">
          <p className="sticky-cart-price text-brand-gold font-semibold">
            ${product.price.toLocaleString()}
          </p>
        </div>
        <button
          className="sticky-cart-button btn-primary"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
