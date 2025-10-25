/** @type {import('next').NextConfig} */

// Only relax type/lint checks in local dev, enforce in CI
const isCI = process.env.CI === 'true';

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: !isCI,
  },
  typescript: {
    ignoreBuildErrors: !isCI,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'ik.imagekit.io', pathname: '/**' },
    ]
  }
};

module.exports = nextConfig;
