/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    // Enable experimental features if needed
  },
  images: {
    domains: [],
    unoptimized: true
  }
};

module.exports = nextConfig;