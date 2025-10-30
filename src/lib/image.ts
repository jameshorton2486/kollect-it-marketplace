// Image helpers (compat shim) and placeholders

export type TransformVariant = 'thumbnail' | 'detail' | 'banner' | 'custom';

interface TransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'thumb';
  quality?: number | 'auto';
}

const CLOUDINARY_HOST = 'res.cloudinary.com';
const IMAGEKIT_HOST = 'ik.imagekit.io';

export function isCloudinary(url?: string | null): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.hostname.includes(CLOUDINARY_HOST);
  } catch {
    return false;
  }
}

function isImageKit(url?: string | null): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.hostname.includes(IMAGEKIT_HOST);
  } catch {
    return false;
  }
}

// Backward-compatible name used throughout the app. Now supports ImageKit.
export function transformCloudinary(url: string, variant: TransformVariant | TransformOptions): string {
  if (!url) return url;
  // Transform ImageKit URLs
  if (isImageKit(url)) {
    let options: TransformOptions;
    if (typeof variant === 'string') {
      switch (variant) {
        case 'thumbnail':
          options = { width: 400, height: 400, quality: 80, crop: 'fill' };
          break;
        case 'detail':
          options = { width: 1200, height: 1200, quality: 90, crop: 'fit' };
          break;
        case 'banner':
          options = { width: 1600, height: 600, quality: 85, crop: 'fill' };
          break;
        default:
          options = {};
      }
    } else {
      options = variant;
    }

    const txParts: string[] = [];
    if (options.width) txParts.push(`w-${options.width}`);
    if (options.height) txParts.push(`h-${options.height}`);
    // Use focal optimization to preserve subject where possible
    txParts.push('fo-auto');
    if (options.quality) txParts.push(`q-${options.quality}`);
    const tx = txParts.join(',');

    try {
      const u = new URL(url);
      // Strip an existing /tr: segment if present
      const cleanedPath = u.pathname.replace(/\/tr:[^/]+/, '');
      u.pathname = `/tr:${tx}${cleanedPath}`;
      return u.toString();
    } catch {
      return url;
    }
  }

  // Leave non-ImageKit URLs untouched
  return url;
}

// Tiny blur data URL (soft cream tone to match brand)
// Pre-encoded tiny SVG blur placeholder (no Buffer usage for client compatibility)
export const BLUR_DATA_URL =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%2210%22%3E%3Crect width=%2210%22 height=%2210%22 fill=%22%23f6f3ed%22/%3E%3C/svg%3E';
