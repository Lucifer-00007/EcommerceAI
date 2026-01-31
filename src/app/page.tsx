'use client'

import Link from 'next/link'
import { ArrowRight, Star, Truck, Shield, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useFeaturedProducts } from '@/hooks/use-products'
import { useCategories } from '@/hooks/use-categories'
import { ProductCard } from '@/components/product/product-card'
import { ProductSkeleton } from '@/components/product/product-skeleton'

export default function Home() {
  const { data: featuredProducts, isLoading: productsLoading } = useFeaturedProducts()
  const { data: categories, isLoading: categoriesLoading } = useCategories()

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-secondary/20 dark:from-primary/10 dark:via-background dark:to-secondary/10 py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
              Discover Amazing Products
              <span className="text-primary block md:inline"> at Great Prices</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Shop the latest trends in electronics, fashion, and more. Quality guaranteed, fast delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/categories">
                  Browse Categories
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30 dark:bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-3 group">
              <div className="mx-auto w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Truck className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">On orders over $100</p>
            </div>
            <div className="text-center space-y-3 group">
              <div className="mx-auto w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Secure Payment</h3>
              <p className="text-sm text-muted-foreground">100% secure transactions</p>
            </div>
            <div className="text-center space-y-3 group">
              <div className="mx-auto w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <RefreshCw className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Easy Returns</h3>
              <p className="text-sm text-muted-foreground">30-day return policy</p>
            </div>
            <div className="text-center space-y-3 group">
              <div className="mx-auto w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Star className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Best Quality</h3>
              <p className="text-sm text-muted-foreground">Premium products only</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
              Check out our hand-picked selection of premium products
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productsLoading
              ? [...Array(8)].map((_, index) => (
                  <ProductSkeleton key={index} />
                ))
              : featuredProducts?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
          
          {!productsLoading && featuredProducts && featuredProducts.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" asChild>
                <Link href="/products?featured=true">
                  View All Featured Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-muted/30 dark:bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
              Browse our wide selection of products by category
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesLoading
              ? [...Array(6)].map((_, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-gray-200 animate-pulse" />
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              : categories?.map((category) => (
                  <Link key={category.id} href={`/categories/${category.slug}`}>
                    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-105">
                      <CardContent className="p-0">
                        <div className="relative aspect-square overflow-hidden">
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="text-center text-white">
                              <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                              <p className="text-sm opacity-90">{category.productCount} products</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {category.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary to-primary/90 dark:from-primary/90 dark:to-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">Ready to Start Shopping?</h2>
          <p className="text-xl max-w-2xl mx-auto opacity-90 text-balance">
            Join thousands of satisfied customers who trust us for quality products and excellent service.
          </p>
          <Button size="lg" variant="secondary" asChild className="shadow-lg hover:shadow-xl transition-shadow">
            <Link href="/products">
              Start Shopping Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
