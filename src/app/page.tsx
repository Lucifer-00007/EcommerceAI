/**
 * Home Page
 * 
 * The main landing page of the eCommerce application.
 * Features hero section, featured products, categories, and promotions.
 * 
 * Sections:
 * 1. Hero - Main banner with call-to-action
 * 2. Featured Products - Grid of featured items
 * 3. Categories - Browse by category
 * 4. Promotions - Special offers and deals
 * 5. Newsletter - Email subscription CTA
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShoppingBag, Truck, Shield, Headphones } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { productApi, categoryApi } from '@/services/api'
import { formatCurrency } from '@/lib/utils'

// ============================================================================
// METADATA
// ============================================================================

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to ShopHub - Your one-stop destination for quality products at unbeatable prices.',
}

// ============================================================================
// HERO SECTION
// ============================================================================

function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="space-y-6">
            <Badge variant="secondary" className="text-sm">
              New Collection 2024
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Discover Quality Products at Unbeatable Prices
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-lg">
              Shop the latest trends in electronics, fashion, home goods, and more. 
              Free shipping on orders over $50.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" variant="secondary" className="gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Shop Now
                </Button>
              </Link>
              <Link href="/categories">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2">
                  Browse Categories
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                <span className="text-sm">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="h-5 w-5" />
                <span className="text-sm">24/7 Support</span>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="hidden lg:block relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800"
                alt="Shopping showcase"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white text-foreground p-4 rounded-lg shadow-lg">
              <p className="text-sm text-muted-foreground">Starting from</p>
              <p className="text-2xl font-bold">$9.99</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// FEATURED PRODUCTS SECTION
// ============================================================================

async function FeaturedProductsSection() {
  // Fetch featured products from API
  const response = await productApi.getFeaturedProducts(8)
  const products = response.success ? response.data : []

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Products</h2>
            <p className="text-muted-foreground">
              Handpicked items just for you
            </p>
          </div>
          <Link href="/products?featured=true">
            <Button variant="outline" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// PRODUCT CARD COMPONENT
// ============================================================================

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    originalPrice?: number
    image: string
    rating: number
    reviewCount: number
    isOnSale: boolean
  }
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {/* Sale Badge */}
          {product.isOnSale && (
            <Badge className="absolute top-3 left-3 bg-destructive">
              Sale
            </Badge>
          )}
        </div>
        
        {/* Content */}
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
          </div>
          
          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// ============================================================================
// CATEGORIES SECTION
// ============================================================================

async function CategoriesSection() {
  // Fetch categories from API
  const response = await categoryApi.getCategories()
  const categories = response.success ? response.data : []

  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Shop by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our wide selection of products organized by category
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={category.image || '/placeholder.jpg'}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm opacity-80">{category.productCount} products</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// PROMOTIONS SECTION
// ============================================================================

function PromotionsSection() {
  const promotions = [
    {
      title: 'Summer Sale',
      subtitle: 'Up to 50% Off',
      description: 'Get amazing deals on selected items. Limited time only!',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600',
      link: '/products?onSale=true',
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'New Arrivals',
      subtitle: 'Check Out the Latest',
      description: 'Discover our newest products and be the first to own them.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600',
      link: '/products?sort=newest',
      color: 'from-blue-500 to-purple-500',
    },
    {
      title: 'Free Shipping',
      subtitle: 'On Orders Over $50',
      description: 'Enjoy free shipping on all qualifying orders. No code needed.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600',
      link: '/shipping',
      color: 'from-green-500 to-teal-500',
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Special Offers</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don&apos;t miss out on these amazing deals
          </p>
        </div>

        {/* Promotions Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {promotions.map((promo) => (
            <Link key={promo.title} href={promo.link}>
              <Card className="group overflow-hidden h-full">
                <div className={`relative h-full min-h-[280px] bg-gradient-to-br ${promo.color} text-white`}>
                  <div className="absolute inset-0">
                    <Image
                      src={promo.image}
                      alt={promo.title}
                      fill
                      className="object-cover opacity-30 mix-blend-overlay"
                    />
                  </div>
                  <div className="relative h-full p-6 flex flex-col justify-between">
                    <div>
                      <Badge variant="secondary" className="mb-4">
                        {promo.subtitle}
                      </Badge>
                      <h3 className="text-2xl font-bold mb-2">{promo.title}</h3>
                      <p className="opacity-90">{promo.description}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-4 font-semibold">
                      Shop Now
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// NEWSLETTER SECTION
// ============================================================================

function NewsletterSection() {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Get the latest updates on new products, sales, and exclusive offers directly to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md text-foreground"
              required
            />
            <Button type="submit" variant="secondary" size="lg">
              Subscribe
            </Button>
          </form>
          <p className="text-sm opacity-70 mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProductsSection />
      <CategoriesSection />
      <PromotionsSection />
      <NewsletterSection />
    </>
  )
}
