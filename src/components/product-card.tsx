import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Star, Heart } from 'lucide-react'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { useWishlistStore } from '@/store/wishlist-store'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { addItem, removeItem, isInWishlist } = useWishlistStore()
  const inWishlist = isInWishlist(product.id)
  
  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    if (inWishlist) {
      removeItem(product.id)
    } else {
      addItem(product)
    }
  }
  
  return (
    <Card className="group overflow-hidden">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.originalPrice && (
            <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-semibold">
              SALE
            </div>
          )}
          <button
            onClick={toggleWishlist}
            className="absolute top-2 left-2 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
          >
            <Heart
              className={`h-5 w-5 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </button>
        </div>
      </Link>
      
      <CardContent className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-1 hover:text-primary">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={() => onAddToCart?.(product)}
          disabled={!product.inStock}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  )
}
