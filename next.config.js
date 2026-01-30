/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,
  
  // Image optimization configuration
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Experimental features for App Router optimization
  experimental: {
    // Enable typed routes for better type safety
    typedRoutes: true,
  },
  
  // ESLint configuration - run during build
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // TypeScript configuration - fail build on errors
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
