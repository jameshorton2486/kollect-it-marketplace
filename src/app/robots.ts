import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/admin'] },
    ],
    sitemap: 'https://kollect-it.com/sitemap.xml',
    host: 'https://kollect-it.com',
  };
}
