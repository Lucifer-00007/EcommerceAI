'use client'

export const dynamic = 'force-dynamic'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Star, ShoppingCart, Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { productService } from '@/services/product-service'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart-store'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { ReviewsSection } from '@/features/products/reviews-section'
import { Breadcrumbs } from '@/components/breadcrumbs'

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()
  
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getProductBySlug(slug),
  })
  
  const handleAddToCart = () => {
    if (!product) return
    
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    
    toast({
      title: 'Added to cart',
      description: `${quantity} × ${product.name} added to your cart.`,
    })
  }
  
  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    )
  }
  
  if (!product) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Product not found</h2>
          <p className="text-muted-foreground">The product you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container py-8">
      <Breadcrumbs
        items={[
          { label: 'Products', href: '/products' },
          { label: product.category.charAt(0).toUpperCase() + product.category.slice(1), href: `/products?category=${product.category}` },
          { label: product.name },
        ]}
      />
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden border">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{product.rating}</span>
              </div>
              <span className="text-muted-foreground">
                ({product.reviewCount} reviews)
              </span>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            <p className="text-muted-foreground">{product.description}</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
          
          <div className="border-t pt-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span className="font-medium capitalize">{product.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Availability</span>
              <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <ReviewsSection 
        productId={product.id}
        rating={product.rating}
        reviewCount={product.reviewCount}
      />
    </div>
  )
}
