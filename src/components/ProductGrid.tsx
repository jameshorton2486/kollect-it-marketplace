'use client';

import ProductCard, { ProductCardData } from './ProductCard';

interface ProductGridProps {
  products: Array<{
    id: string;
    title: string;
    slug: string;
    price: number;
    condition: string | null;
    images: { url: string }[];
    category: { name: string };
  }>;
  view?: 'grid' | 'list';
}

export default function ProductGrid({ products, view = 'grid' }: ProductGridProps) {
  if (view === 'list') {
    return (
      <div className="space-y-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            variant="list"
            product={{
              id: product.id,
              title: product.title,
              price: product.price,
              slug: product.slug,
              image: product.images[0]?.url || '/placeholder.jpg',
              category: product.category.name,
            }}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="product-grid-category">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={{
            id: product.id,
            title: product.title,
            price: product.price,
            slug: product.slug,
            image: product.images[0]?.url || '/placeholder.jpg',
            category: product.category.name,
          }}
        />
      ))}
    </div>
  );
}
