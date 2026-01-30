/**
 * Product Detail Page
 * 
 * Displays detailed information about a single product.
 * 
 * Features:
 * - Image gallery with zoom
 * - Product details and specifications
 * - Add to cart functionality
 * - Related products
 * - Customer reviews
 * - Breadcrumb navigation
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { 
  Minus, 
  Plus, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Check, 
  Truck,
  Shield,
  RotateCcw,
  Star
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { productApi } from '@/services/api'
import { useCartStore } from '@/stores/cartStore'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

// ============================================================================
// IMAGE GALLERY COMPONENT
// ============================================================================

interface ImageGalleryProps {
  images: string[]
  productName: string
}

function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = React.useState(0)

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
        <Image
          src={images[selectedImage]}
          alt={productName}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors ${
                selectedImage === index ? 'border-primary' : 'border-transparent'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} - view ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// QUANTITY SELECTOR COMPONENT
// ============================================================================

interface QuantitySelectorProps {
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
  max?: number
}

function QuantitySelector({ quantity, onIncrease, onDecrease, max }: QuantitySelectorProps) {
  return (
    <div className="flex items-center border rounded-md">
      <button
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="p-3 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-12 text-center font-medium">{quantity}</span>
      <button
        onClick={onIncrease}
        disabled={max !== undefined && quantity >= max}
        className="p-3 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}

// ============================================================================
// REVIEW CARD COMPONENT
// ============================================================================

interface Review {
  id: string
  userName: string
  userAvatar?: string
  rating: number
  title?: string
  content: string
  createdAt: string
  isVerified: boolean
}

interface ReviewCardProps {
  review: Review
}

function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {review.userAvatar ? (
              <Image
                src={review.userAvatar}
                alt={review.userName}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <span className="text-sm font-medium">
                  {review.userName.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <p className="font-medium">{review.userName}</p>
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                {review.isVerified && (
                  <Badge variant="secondary" className="text-xs">
                    <Check className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <span className="text-sm text-muted-foreground">
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
        </div>
        {review.title && (
          <h4 className="font-semibold mb-2">{review.title}</h4>
        )}
        <p className="text-muted-foreground">{review.content}</p>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// RELATED PRODUCTS COMPONENT
// ============================================================================

function RelatedProducts({ productId }: { productId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['related-products', productId],
    queryFn: () => productApi.getRelatedProducts(productId, 4),
  })

  const products = data?.data || []

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="aspect-square" />
        ))}
      </div>
    )
  }

  if (products.length === 0) return null

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <Link key={product.id} href={`/products/${product.slug}`}>
          <Card className="group overflow-hidden transition-all hover:shadow-lg">
            <div className="relative aspect-square overflow-hidden bg-muted">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-sm font-semibold mt-1">
                {formatCurrency(product.price)}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [quantity, setQuantity] = React.useState(1)
  const [isInWishlist, setIsInWishlist] = React.useState(false)
  
  const addItem = useCartStore(state => state.addItem)

  // Fetch product data
  const { data: productData, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productApi.getProductBySlug(slug),
  })

  const product = productData?.data

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity)
    }
  }

  const handleIncreaseQuantity = () => {
    if (product && quantity < product.stockQuantity) {
      setQuantity(q => q + 1)
    }
  }

  const handleDecreaseQuantity = () => {
    setQuantity(q => Math.max(1, q - 1))
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-square" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The product you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    )
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-foreground">Products</Link>
        <span>/</span>
        <Link 
          href={`/categories/${product.category.slug}`} 
          className="hover:text-foreground"
        >
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      {/* Product Details */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Image Gallery */}
        <ImageGallery 
          images={product.images} 
          productName={product.name} 
        />

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{product.category.name}</Badge>
              {product.isOnSale && <Badge variant="destructive">Sale</Badge>}
              {!product.inStock && <Badge variant="outline">Out of Stock</Badge>}
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
                <Badge variant="destructive">-{discount}%</Badge>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground">
            {product.description}
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span>Free shipping over $50</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>2-year warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
              <span>30-day returns</span>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-4">
            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantity:</span>
              <QuantitySelector
                quantity={quantity}
                onIncrease={handleIncreaseQuantity}
                onDecrease={handleDecreaseQuantity}
                max={product.stockQuantity}
              />
              {product.inStock && (
                <span className="text-sm text-muted-foreground">
                  {product.stockQuantity} available
                </span>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsInWishlist(!isInWishlist)}
              >
                <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* SKU */}
          <div className="text-sm text-muted-foreground">
            SKU: <span className="font-mono">{product.sku}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="mb-12">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews ({product.reviewCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Product Details</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
              {product.tags.length > 0 && (
                <div className="mt-4">
                  <span className="text-sm font-medium">Tags: </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specs" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Specifications</h3>
              {product.specifications ? (
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-sm text-muted-foreground">{key}</dt>
                      <dd className="font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-muted-foreground">No specifications available.</p>
              )}
              {product.weight && (
                <div className="mt-4 pt-4 border-t">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm text-muted-foreground">Weight</dt>
                      <dd className="font-medium">{product.weight} kg</dd>
                    </div>
                    {product.dimensions && (
                      <div>
                        <dt className="text-sm text-muted-foreground">Dimensions</dt>
                        <dd className="font-medium">
                          {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} cm
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-4">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No reviews yet.</p>
                  <Button className="mt-4">Write a Review</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      <div>
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <RelatedProducts productId={product.id} />
      </div>
    </div>
  )
}
