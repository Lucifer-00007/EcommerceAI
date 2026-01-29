/**
 * Next.js Configuration
 * 
 * Configuration options for the Next.js application.
 * Includes image optimization, redirects, rewrites, and experimental features.
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Image Optimization Configuration
   * Configures remote image domains and image formats
   */
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.unsplash.com",
      },
      // Add more image domains as needed for product images
    ],
  },

  /**
   * Experimental Features
   * Enable new Next.js features for better performance
   */
  experimental: {
    // Enable optimized package imports for faster builds
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },

  /**
   * Redirects
   * Define URL redirects for SEO and user experience
   */
  async redirects() {
    return [
      {
        source: "/product/:id",
        destination: "/products/:id",
        permanent: true,
      },
    ];
  },

  /**
   * Headers
   * Add custom headers for security and caching
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
