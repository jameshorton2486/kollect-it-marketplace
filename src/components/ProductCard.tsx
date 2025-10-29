'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import AddToCartButton from './AddToCartButton';
import { useWishlist } from '@/contexts/WishlistContext';
import { BLUR_DATA_URL, transformCloudinary } from '@/lib/image';

export interface ProductCardData {
  id: string;
  title: string;
  price: number;
  slug: string;
  image?: string | null;
  category?: string;
  description?: string | null;
}

export default function ProductCard({ product, variant = 'grid' }: { product: ProductCardData; variant?: 'grid' | 'list' }) {
  const { isInWishlist, toggleWishlist, loading } = useWishlist();
  const [hovered, setHovered] = useState(false);
  const wishlisted = isInWishlist(product.id);

  const imgSrc = product.image ? transformCloudinary(product.image, 'thumbnail') : '/placeholder.jpg';

  if (variant === 'list') {
    return (
      <div className="flex gap-4 rounded border border-[var(--color-gray-light)] bg-white p-3">
        <Link href={`/product/${product.slug}`} className="block h-36 w-36 shrink-0 overflow-hidden rounded">
          <Image src={imgSrc} alt={`${product.title} - ${product.category || 'Product'} thumbnail`} width={150} height={150} className="h-full w-full object-cover" quality={85} loading="lazy" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
        </Link>
        <div className="flex flex-1 items-center justify-between gap-4">
          <div>
            {product.category && (
              <div className="text-[11px] uppercase tracking-wide text-brand-gold">{product.category}</div>
            )}
            <Link href={`/product/${product.slug}`} className="no-underline">
              <h3 className="font-serif text-[20px] leading-snug text-brand-navy line-clamp-2">{product.title}</h3>
            </Link>
            {product.description && (
              <p className="mt-1 text-[14px] text-[var(--color-gray-dark)] line-clamp-2">{product.description}</p>
            )}
            <div className="mt-2 text-[20px] font-semibold text-brand-gold">${product.price.toLocaleString()}</div>
            <div className="mt-3 flex items-center gap-2">
              <AddToCartButton
                variant="secondary"
                product={{
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  slug: product.slug,
                  image: imgSrc,
                  categoryName: product.category || 'General',
                }}
                quantity={1}
              />
              <button
                className={`inline-flex items-center gap-2 rounded border border-[var(--color-gray-light)] px-3 py-2 text-[14px] ${wishlisted ? 'text-brand-gold' : ''}`}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                onClick={async (e) => { e.preventDefault(); await toggleWishlist(product.id); }}
                disabled={loading}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // grid variant
  return (
    <div
      className="group rounded-lg border border-[var(--color-gray-light)] bg-white p-3 transition-transform duration-200 hover:-translate-y-1 hover:shadow-sm"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden rounded">
        <Link href={`/product/${product.slug}`} className="block">
          <Image
            src={imgSrc}
            alt={`${product.title} - ${product.category || 'Product'} image`}
            width={400}
            height={400}
            className={`aspect-square w-full object-cover transition-transform duration-200 ${hovered ? 'scale-[1.02]' : ''}`}
            quality={85}
            loading="lazy"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
          {/* Category tag */}
          {product.category && (
            <span className="absolute left-2 top-2 rounded bg-white/90 px-2 py-1 text-[11px] uppercase tracking-wide text-brand-gold">
              {product.category}
            </span>
          )}
        </Link>
        {/* Wishlist button */}
        <button
          className="absolute right-2 top-2 inline-flex items-center justify-center rounded border border-[var(--color-gray-light)] bg-white/90 p-2 hover:text-brand-gold"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={async (e) => { e.preventDefault(); await toggleWishlist(product.id); }}
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <Link href={`/product/${product.slug}`} className="mt-3 block no-underline">
        <h3 className="font-serif text-[20px] leading-snug text-brand-navy line-clamp-2">{product.title}</h3>
      </Link>
      <div className="text-[20px] font-semibold text-brand-gold">${product.price.toLocaleString()}</div>

      {/* Add to cart on hover */}
      <div className="mt-3 hidden items-center justify-between gap-2 group-hover:flex">
        <AddToCartButton
          variant="card"
          product={{
            id: product.id,
            title: product.title,
            price: product.price,
            slug: product.slug,
            image: imgSrc,
            categoryName: product.category || 'General',
          }}
          quantity={1}
        />
      </div>
    </div>
  );
}
