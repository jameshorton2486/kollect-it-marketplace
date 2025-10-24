'use client';

import { useState } from 'react';

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
  const [isZoomed, setIsZoomed] = useState(false);

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
      <div className="product-gallery-main">
        <button
          className={`product-gallery-main-image ${isZoomed ? 'zoomed' : ''}`}
          onClick={() => setIsZoomed(!isZoomed)}
          title={isZoomed ? 'Click to zoom out' : 'Click to zoom in'}
        >
          <img
            src={selectedImage.url}
            alt={selectedImage.alt || title}
            loading="eager"
          />
        </button>
        {images.length > 1 && (
          <div className="product-gallery-counter">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="product-gallery-thumbnails">
          {images.map((image, index) => (
            <button
              key={index}
              className={`product-gallery-thumbnail ${
                index === selectedIndex ? 'active' : ''
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              <img src={image.url} alt={`${title} view ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
