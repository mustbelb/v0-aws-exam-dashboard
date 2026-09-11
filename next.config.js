/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_BUILD_DIRECTORY || ".next",
  // Enable experimental features if needed
  experimental: {
    // serverActions: true, // Already enabled by default in Next.js 14
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
