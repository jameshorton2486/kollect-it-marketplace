// Image helpers for Cloudinary and placeholders

export type TransformVariant = 'thumbnail' | 'detail' | 'banner' | 'custom';

interface TransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'thumb';
  quality?: number | 'auto';
}

const CLOUDINARY_HOST = 'res.cloudinary.com';

export function isCloudinary(url?: string | null): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.hostname.includes(CLOUDINARY_HOST);
  } catch {
    return false;
  }
}

export function transformCloudinary(url: string, variant: TransformVariant | TransformOptions): string {
  if (!isCloudinary(url)) return url;
  const u = new URL(url);
  const parts = u.pathname.split('/');
  const uploadIdx = parts.findIndex((p) => p === 'upload');
  if (uploadIdx === -1) return url;

  let options: TransformOptions;
  if (typeof variant === 'string') {
    switch (variant) {
      case 'thumbnail':
        options = { width: 400, height: 400, crop: 'fill', quality: 85 };
        break;
      case 'detail':
        options = { width: 1200, height: 1200, crop: 'fit', quality: 85 };
        break;
      case 'banner':
        options = { width: 1600, height: 600, crop: 'fill', quality: 85 };
        break;
      default:
        options = {};
    }
  } else {
    options = variant;
  }

  const tx = [
    options.width ? `w_${options.width}` : null,
    options.height ? `h_${options.height}` : null,
    options.crop ? `c_${options.crop}` : null,
    options.quality ? `q_${options.quality}` : null,
  ]
    .filter(Boolean)
    .join(',');

  // Inject transformation right after /upload/
  const prefix = parts.slice(0, uploadIdx + 1).join('/');
  const suffix = parts.slice(uploadIdx + 1).join('/');
  u.pathname = `${prefix}/${tx}/${suffix}`.replace(/\/+/, '/');
  return u.toString();
}

// Tiny blur data URL (soft cream tone to match brand)
// Pre-encoded tiny SVG blur placeholder (no Buffer usage for client compatibility)
export const BLUR_DATA_URL =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%2210%22%3E%3Crect width=%2210%22 height=%2210%22 fill=%22%23f6f3ed%22/%3E%3C/svg%3E';
