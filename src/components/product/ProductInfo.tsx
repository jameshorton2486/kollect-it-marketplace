'use client';

import { useState, useEffect } from 'react';
import AddToCartButton from '../AddToCartButton';
import { useWishlist } from '@/contexts/WishlistContext';

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  condition: string | null;
  year: string | null;
  artist: string | null;
  medium: string | null;
  period: string | null;
  category: { name: string };
  images: { url: string }[];
}

interface ProductInfoProps {
  product: Product;
  sku: string;
}

export default function ProductInfo({ product, sku }: ProductInfoProps) {
  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id));
  }, [product.id, isInWishlist]);

  const handleWishlist = async () => {
    await toggleWishlist(product.id);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out ${product.title} on Kollect-It`,
          url: window.location.href,
        });
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Share cancelled');
        }
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="product-info">
      {/* Category Badge */}
      <div className="product-info-category">{product.category.name}</div>

      {/* Title */}
      <h1 className="product-info-title">{product.title}</h1>

      {/* Price */}
      <div className="product-info-price">${product.price.toLocaleString()}</div>

      {/* Details Grid */}
      <div className="product-info-details">
        {product.artist && (
          <div className="product-detail-item">
            <span className="product-detail-label">Artist/Maker:</span>
            <span className="product-detail-value">{product.artist}</span>
          </div>
        )}
        {product.year && (
          <div className="product-detail-item">
            <span className="product-detail-label">Year:</span>
            <span className="product-detail-value">{product.year}</span>
          </div>
        )}
        {product.medium && (
          <div className="product-detail-item">
            <span className="product-detail-label">Medium:</span>
            <span className="product-detail-value">{product.medium}</span>
          </div>
        )}
        {product.period && (
          <div className="product-detail-item">
            <span className="product-detail-label">Period:</span>
            <span className="product-detail-value">{product.period}</span>
          </div>
        )}
        {product.condition && (
          <div className="product-detail-item">
            <span className="product-detail-label">Condition:</span>
            <span className="product-detail-value">{product.condition}</span>
          </div>
        )}
        <div className="product-detail-item">
          <span className="product-detail-label">SKU:</span>
          <span className="product-detail-value">{sku}</span>
        </div>
        <div className="product-detail-item">
          <span className="product-detail-label">Provenance:</span>
          <span className="product-detail-value">Authenticated & Verified</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="product-info-actions">
        <AddToCartButton
          product={{
            id: product.id,
            title: product.title,
            price: product.price,
            slug: product.slug,
            image: product.images[0]?.url || '/placeholder.jpg',
            categoryName: product.category.name,
          }}
        />

        <button
          className={`btn-wishlist ${isWishlisted ? 'active' : ''}`}
          onClick={handleWishlist}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        <button className="btn-share" onClick={handleShare} title="Share this product">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      </div>

      {/* Trust Badges */}
      <div className="product-info-badges">
        <div className="trust-badge">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          <span>Authenticated</span>
        </div>
        <div className="trust-badge">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <span>Free Shipping</span>
        </div>
        <div className="trust-badge">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>30-Day Returns</span>
        </div>
      </div>
    </div>
  );
}
