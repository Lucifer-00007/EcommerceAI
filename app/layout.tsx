/**
 * Root Layout
 * 
 * The root layout wraps all pages in the application.
 * It includes:
 * - Font configuration (Geist Sans & Mono)
 * - Global metadata for SEO
 * - Theme provider for dark/light mode
 * - Toast notifications
 */

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

/**
 * Geist Sans - Primary font for UI elements
 * Variable font for optimal performance
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Improves initial page load performance
});

/**
 * Geist Mono - Monospace font for code/technical content
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Viewport Configuration
 * Controls mobile viewport behavior and theme color
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
};

/**
 * Global Metadata
 * SEO configuration applied to all pages (can be overridden per page)
 */
export const metadata: Metadata = {
  title: {
    default: "ShopNext | Modern eCommerce",
    template: "%s | ShopNext",
  },
  description:
    "Discover amazing products at great prices. ShopNext offers a curated selection of quality items with fast shipping and excellent customer service.",
  keywords: [
    "ecommerce",
    "online shopping",
    "retail",
    "products",
    "shop",
  ],
  authors: [{ name: "ShopNext" }],
  creator: "ShopNext",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ShopNext",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/**
 * Root Layout Component
 * Wraps all pages with global providers and fonts
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Providers>
          {/* Main content wrapper */}
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
