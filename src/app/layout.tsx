import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'ECommerce - Shop Quality Products Online',
    template: '%s | ECommerce'
  },
  description: 'Discover amazing products at great prices. Shop our wide selection of electronics, fashion, home goods, and more.',
  keywords: ['ecommerce', 'online shopping', 'products', 'deals', 'shopping'],
  authors: [{ name: 'ECommerce Team' }],
  creator: 'ECommerce',
  publisher: 'ECommerce',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ecommerce.com'),
  openGraph: {
    title: 'ECommerce - Shop Quality Products Online',
    description: 'Discover amazing products at great prices. Shop our wide selection of electronics, fashion, home goods, and more.',
    type: 'website',
    locale: 'en_US',
    url: 'https://ecommerce.com',
    siteName: 'ECommerce',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ECommerce - Shop Quality Products Online',
    description: 'Discover amazing products at great prices. Shop our wide selection of electronics, fashion, home goods, and more.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}