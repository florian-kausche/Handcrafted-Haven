/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignore ESLint during production builds to avoid build-time ESLint failures.
    // This avoids conflicts with local/global ESLint option differences.
    ignoreDuringBuilds: true,
  },
  images: {
    // Disable image optimization for faster serverless/static hosting
    unoptimized: true,
    // Allow images from these domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
    ],
  },
  // Optimize for serverless
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  // Cache static assets
  async headers() {
    return [
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/products',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
