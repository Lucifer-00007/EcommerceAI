'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'
import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/product-service'
import { ProductGridSkeleton } from '@/components/product-skeleton'
import { useCartStore } from '@/store/cart-store'
import { useToast } from '@/hooks/use-toast'

export default function HomePage() {
  const { data: featuredProducts = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productService.getFeaturedProducts(),
  })
  
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
  })
  
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()
  
  const handleAddToCart = (product: any) => {
    addItem(product)
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    })
  }
  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-20">
        <div className="container">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold tracking-tight mb-6">
              Discover Amazing Products
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Shop the latest trends with unbeatable prices and fast shipping.
            </p>
            <Link href="/products">
              <Button size="lg">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Categories */}
      <section className="py-16 bg-muted/40">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
          {loadingCategories ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-lg mb-2" />
                  <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="group"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 16vw"
                    />
                  </div>
                  <p className="text-center font-medium group-hover:text-primary">
                    {category.name}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link href="/products">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {loadingProducts ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Promo Banner */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            Get 20% Off Your First Order
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Sign up for our newsletter and receive exclusive deals
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
