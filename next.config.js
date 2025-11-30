/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignore ESLint during production builds to avoid build-time ESLint failures.
    // This avoids conflicts with local/global ESLint option differences.
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
