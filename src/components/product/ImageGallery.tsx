"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BLUR_DATA_URL, transformCloudinary } from "@/lib/image";

interface ProductImage {
  url: string;
  alt?: string | null;
}

interface ImageGalleryProps {
  images: ProductImage[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHoverZoom, setIsHoverZoom] = useState(false);
  const [showImage, setShowImage] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);

  // Fade-in on image change
  useEffect(() => {
    setShowImage(false);
    const t = setTimeout(() => setShowImage(true), 10);
    return () => clearTimeout(t);
  }, [selectedIndex]);

  // If no images, show placeholder
  if (images.length === 0) {
    return (
      <div className="product-gallery">
        <div className="product-gallery-main">
          <div className="product-gallery-placeholder">
            <span>No Image Available</span>
          </div>
        </div>
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="product-gallery">
      {/* Main Image */}
      <div
        className="product-gallery-main relative"
        ref={mainRef}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          const start = touchStartX.current;
          if (start == null) return;
          const end = e.changedTouches[0].clientX;
          const dx = end - start;
          const threshold = 40; // swipe threshold in px
          if (dx > threshold) {
            setSelectedIndex((i) => (i > 0 ? i - 1 : images.length - 1));
          } else if (dx < -threshold) {
            setSelectedIndex((i) => (i < images.length - 1 ? i + 1 : 0));
          }
          touchStartX.current = null;
        }}
      >
        <div
          className="group relative overflow-hidden rounded"
          onMouseEnter={() => setIsHoverZoom(true)}
          onMouseLeave={() => setIsHoverZoom(false)}
          title={isHoverZoom ? "Zooming" : "Hover to zoom"}
        >
          <Image
            key={`img-${selectedIndex}`}
            src={transformCloudinary(selectedImage.url, "detail")}
            alt={selectedImage.alt || title}
            width={1200}
            height={1200}
            priority
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className={`h-full w-full object-contain transition-all duration-300 ${
              showImage ? "opacity-100" : "opacity-0"
            } ${isHoverZoom ? "scale-[1.6]" : "scale-100"}`}
          />
        </div>

        {images.length > 1 && (
          <div className="product-gallery-counter">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="product-gallery-thumbnails mt-3 flex gap-2 overflow-x-auto py-1 snap-x">
          {images.map((image, index) => (
            <button
              key={index}
              className={`product-gallery-thumbnail shrink-0 snap-start rounded border ${
                index === selectedIndex
                  ? "border-brand-gold"
                  : "border-border-neutral"
              }`}
              onClick={() => setSelectedIndex(index)}
              title={`View ${index + 1}`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={transformCloudinary(image.url, "thumbnail")}
                alt={`${title} view ${index + 1}`}
                width={64}
                height={64}
                className="h-16 w-16 object-cover"
                loading="lazy"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
