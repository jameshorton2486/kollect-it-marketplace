"use client";

import Link from "next/link";
import Image from "next/image";
import { BLUR_DATA_URL, transformCloudinary } from "@/lib/image";
import { useRef } from "react";

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

export default function RelatedProducts({
  products,
  categoryName,
}: RelatedProductsProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollByCards = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card=true]");
    const amount = card ? card.offsetWidth + 16 : 300; // include gap
    el.scrollBy({ left: dir * amount * 1.5, behavior: "smooth" });
  };

  return (
    <div className="related-products-section section-spacing">
      <div className="container">
        <div className="flex items-center justify-between gap-3">
          <h2 className="related-products-title font-serif text-brand-navy text-3xl md:text-4xl">
            You May Also Like
          </h2>
          <div className="hidden md:flex gap-2">
            <button
              className="rounded border border-border-neutral px-3 py-2"
              aria-label="Scroll left"
              onClick={() => scrollByCards(-1)}
            >
              ◀
            </button>
            <button
              className="rounded border border-border-neutral px-3 py-2"
              aria-label="Scroll right"
              onClick={() => scrollByCards(1)}
            >
              ▶
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="mt-4 flex gap-4 overflow-x-auto scroll-smooth snap-x pb-2"
        >
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="related-product-card snap-start shrink-0 w-[240px]"
              data-card="true"
            >
              <div className="related-product-image h-[180px] w-full overflow-hidden rounded">
                {product.images[0] ? (
                  <Image
                    src={transformCloudinary(
                      product.images[0].url,
                      "thumbnail",
                    )}
                    alt={`${product.title} - ${product.category.name} related`}
                    width={300}
                    height={180}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    quality={85}
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                ) : (
                  <div className="related-product-placeholder h-full w-full bg-surface-2" />
                )}
              </div>
              <div className="related-product-info mt-2">
                <h3 className="related-product-title line-clamp-2 min-h-[3rem]">
                  {product.title}
                </h3>
                <p className="related-product-price text-brand-gold font-medium">
                  ${product.price.toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
