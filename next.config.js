/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignore ESLint during production builds to avoid build-time ESLint failures.
    // This avoids conflicts with local/global ESLint option differences.
    ignoreDuringBuilds: true,
  },
  images: {
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
    ]
  },
}

module.exports = nextConfig
