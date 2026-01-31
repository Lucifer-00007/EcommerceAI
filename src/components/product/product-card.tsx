'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/stores/cart-store'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart } = useCartStore()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Card
      className={cn(
        "group overflow-hidden border-border/60 bg-card/95 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-within:ring-2 focus-within:ring-primary/30",
        className
      )}
    >
      <CardContent className="p-0">
        <Link href={`/products/${product.id}`}>
          <div className="relative">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden bg-muted/50">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Discount Badge */}
              {discountPercentage > 0 && (
                <Badge variant="destructive" className="absolute left-2 top-2">
                  -{discountPercentage}%
                </Badge>
              )}
              
              {/* Featured Badge */}
              {product.featured && (
                <Badge className="absolute left-2 top-8">
                  Featured
                </Badge>
              )}
              
              {/* Action Buttons */}
              <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-full shadow-sm"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    // Add to wishlist logic here
                  }}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            {/* Product Info */}
            <div className="space-y-2">
              {/* Brand */}
              <p className="text-xs text-muted-foreground">{product.brand}</p>
              
              {/* Product Name */}
              <h3 className="line-clamp-2 text-sm font-semibold leading-tight">
                {product.name}
              </h3>
              
              {/* Rating */}
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3 w-3",
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({product.reviews.length})
                </span>
              </div>
              
              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              
              {/* Stock Status */}
              {product.stock <= 5 && product.stock > 0 && (
                <p className="text-xs text-orange-600">
                  Only {product.stock} left in stock
                </p>
              )}
              
              {product.stock === 0 && (
                <p className="text-xs text-red-600">
                  Out of stock
                </p>
              )}
            </div>
            
            {/* Add to Cart Button */}
            <Button
              className="mt-3 w-full"
              size="sm"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
