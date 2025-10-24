import crypto from 'crypto';

// Validate ImageKit configuration
if (!process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT) {
  throw new Error('NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT is not defined');
}

if (!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY) {
  throw new Error('NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY is not defined');
}

if (!process.env.IMAGEKIT_PRIVATE_KEY) {
  throw new Error('IMAGEKIT_PRIVATE_KEY is not defined');
}

export const imagekitConfig = {
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
};

/**
 * Generate authentication parameters for ImageKit uploads
 * Used by the client to authenticate direct uploads
 */
export async function getImageKitAuthParams() {
  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 600; // 10 minutes from now

  const signature = crypto
    .createHmac('sha1', imagekitConfig.privateKey)
    .update(token + expire)
    .digest('hex');

  return {
    token,
    expire,
    signature,
  };
}

/**
 * Get ImageKit URL with transformations
 * Example: getImageKitUrl('/products/image.jpg', 'w-400,h-400,fo-auto')
 */
export function getImageKitUrl(path: string, transformation?: string): string {
  const baseUrl = imagekitConfig.urlEndpoint;

  if (transformation) {
    return `${baseUrl}/tr:${transformation}${path}`;
  }

  return `${baseUrl}${path}`;
}

/**
 * Common transformation presets
 */
export const imageTransformations = {
  thumbnail: 'w-400,h-400,fo-auto,q-80',
  productCard: 'w-600,h-600,fo-auto,q-85',
  productDetail: 'w-1200,h-1200,fo-auto,q-90',
  gallery: 'w-1600,h-1600,fo-auto,q-95',
};
