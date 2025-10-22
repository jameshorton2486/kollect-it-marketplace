'use client';

import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  images: { url: string }[];
  category: { name: string };
}

interface RelatedProductsProps {
  products: Product[];
  categoryName: string;
}

export default function RelatedProducts({ products, categoryName }: RelatedProductsProps) {
  return (
    <div className="related-products-section">
      <div className="container">
        <h2 className="related-products-title">More from {categoryName}</h2>

        <div className="related-products-grid">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="related-product-card"
            >
              <div className="related-product-image">
                {product.images[0] ? (
                  <img src={product.images[0].url} alt={product.title} loading="lazy" />
                ) : (
                  <div className="related-product-placeholder">No Image</div>
                )}
              </div>
              <div className="related-product-info">
                <h3 className="related-product-title">{product.title}</h3>
                <p className="related-product-price">${product.price.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
