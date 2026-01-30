// Root layout component
// Wraps all pages with common layout structure and providers

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/components/providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'EcommerceAI - Your AI-Powered Shopping Experience',
    template: '%s | EcommerceAI',
  },
  description: 'An intelligent e-commerce platform powered by AI. Discover amazing products with personalized recommendations.',
  keywords: ['ecommerce', 'shopping', 'AI', 'online store', 'products'],
  authors: [{ name: 'EcommerceAI' }],
  creator: 'EcommerceAI',
  publisher: 'EcommerceAI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'EcommerceAI - Your AI-Powered Shopping Experience',
    description: 'An intelligent e-commerce platform powered by AI',
    siteName: 'EcommerceAI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EcommerceAI - Your AI-Powered Shopping Experience',
    description: 'An intelligent e-commerce platform powered by AI',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
