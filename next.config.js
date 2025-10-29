/* eslint-disable */
/** @type {import('next').NextConfig} */

// Only relax type/lint checks in local dev, enforce in CI
const isCI = process.env.CI === 'true';

let withBundleAnalyzer = (config) => config;
if (process.env.ANALYZE === 'true') {
  try {
    const analyzer = require('@next/bundle-analyzer');
    withBundleAnalyzer = analyzer({ enabled: true, openAnalyzer: true });
  } catch (_e) {
    // Analyzer not available; proceed without wrapping
    withBundleAnalyzer = (config) => config;
  }
}

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: !isCI,
  },
  typescript: {
    ignoreBuildErrors: !isCI,
  },
  // Ensure Next.js treats this project folder as the workspace root
  outputFileTracingRoot: __dirname,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'ik.imagekit.io', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'ext.same-assets.com', pathname: '/**' },
    ]
  }
};

module.exports = withBundleAnalyzer(nextConfig);
