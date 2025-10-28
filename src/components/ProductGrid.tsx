'use client';

import Link from 'next/link';
import { useState } from 'react';
import AddToCartButton from './AddToCartButton';

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  condition: string | null;
  images: { url: string }[];
  category: { name: string };
}

interface ProductGridProps {
  products: Product[];
  view?: 'grid' | 'list';
}

export default function ProductGrid({ products, view = 'grid' }: ProductGridProps) {
  if (view === 'list') {
    return (
      <div className="divide-y divide-[var(--color-border)]">
        {products.map((product) => (
          <ProductRow key={product.id} product={product} />
        ))}
      </div>
    );
  }
  return (
    <div className="product-grid-category">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="product-card-category"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.slug}`} className="product-card-link">
        <div className="product-card-image">
          {product.images[0] ? (
            <img
              src={product.images[0].url}
              alt={product.title}
              loading="lazy"
              className={isHovered ? 'zoomed' : ''}
            />
          ) : (
            <div className="product-card-placeholder">No Image</div>
          )}
          {/* Authenticated badge for all products */}
          <span className="badge badge-authenticated">Authenticated</span>
        </div>

        <div className="product-card-info">
          <p className="product-card-category">{product.category.name}</p>
          <h3 className="product-card-title">{product.title}</h3>
          <p className="product-card-price">${product.price.toLocaleString()}</p>
        </div>
      </Link>

      <AddToCartButton
        variant="card"
        product={{
          id: product.id,
          title: product.title,
          price: product.price,
          slug: product.slug,
          image: product.images[0]?.url || '/placeholder.jpg',
          categoryName: product.category.name,
        }}
      />
    </div>
  );
}

function ProductRow({ product }: { product: Product }) {
  return (
    <div className="flex gap-4 py-4">
      <Link href={`/product/${product.slug}`} className="block h-28 w-28 shrink-0 overflow-hidden rounded">
        {product.images[0] ? (
          <img src={product.images[0].url} alt={product.title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-[var(--color-gray-light)]" />
        )}
      </Link>
      <div className="flex flex-1 items-center justify-between gap-4">
        <div>
          <Link href={`/product/${product.slug}`} className="no-underline">
            <p className="text-xs uppercase tracking-wider text-[var(--color-charcoal)]">{product.category.name}</p>
            <h3 className="font-medium">{product.title}</h3>
          </Link>
          <p className="text-brand-gold font-medium">${product.price.toLocaleString()}</p>
        </div>
        <AddToCartButton
          variant="secondary"
          product={{
            id: product.id,
            title: product.title,
            price: product.price,
            slug: product.slug,
            image: product.images[0]?.url || '/placeholder.jpg',
            categoryName: product.category.name,
          }}
        />
      </div>
    </div>
  );
}
