/**
 * Root Layout
 * 
 * The main layout component that wraps all pages in the application.
 * Provides global providers, metadata, and common UI elements.
 * 
 * Features:
 * - Global font configuration
 * - Metadata for SEO
 * - Toast notification provider
 * - React Query provider
 * - Common layout elements (Header, Footer)
 */

import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ToastProvider } from '@/components/ui/toast'
import { QueryProvider } from '@/components/providers/QueryProvider'

// ============================================================================
// FONT CONFIGURATION
// ============================================================================

/**
 * Inter font from Google Fonts
 * A modern, highly readable sans-serif font perfect for UI design
 */
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Improves initial load performance
  variable: '--font-inter', // CSS variable for use in Tailwind
})

// ============================================================================
// METADATA
// ============================================================================

/**
 * Global metadata for the application
 * These values are used for SEO and social sharing
 */
export const metadata: Metadata = {
  // Default title template - page titles will be "Page Name | ShopHub"
  title: {
    default: 'ShopHub - Your Online Store',
    template: '%s | ShopHub',
  },
  
  // Default description
  description: 'ShopHub is your one-stop destination for quality products at unbeatable prices. Discover our wide range of electronics, clothing, home goods, and more.',
  
  // Keywords for SEO
  keywords: ['ecommerce', 'online store', 'shopping', 'electronics', 'clothing', 'home goods'],
  
  // Author information
  authors: [{ name: 'ShopHub' }],
  
  // Open Graph metadata for social sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://shophub.com',
    siteName: 'ShopHub',
    title: 'ShopHub - Your Online Store',
    description: 'ShopHub is your one-stop destination for quality products at unbeatable prices.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ShopHub',
      },
    ],
  },
  
  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: 'ShopHub - Your Online Store',
    description: 'ShopHub is your one-stop destination for quality products at unbeatable prices.',
    images: ['/og-image.jpg'],
  },
  
  // Robots directives
  robots: {
    index: true,
    follow: true,
  },
  
  // Icons
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  
  // Manifest for PWA
  manifest: '/site.webmanifest',
}

/**
 * Viewport configuration
 * Separated from metadata for better Next.js optimization
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

// ============================================================================
// LAYOUT COMPONENT
// ============================================================================

/**
 * Root layout component
 * 
 * This component wraps all pages and provides:
 * - Global styles and fonts
 * - Query client provider for data fetching
 * - Toast notification provider
 * - Common layout elements (Header, Footer)
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {/* Query Provider for React Query */}
        <QueryProvider>
          {/* Toast Provider for notifications */}
          <ToastProvider>
            {/* Header Navigation */}
            <Header />
            
            {/* Main Content Area */}
            <main className="flex-1">
              {children}
            </main>
            
            {/* Footer */}
            <Footer />
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
