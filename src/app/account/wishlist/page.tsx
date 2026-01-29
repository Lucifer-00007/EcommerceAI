'use client'

export const dynamic = 'force-dynamic'

import { useWishlistStore } from '@/store/wishlist-store'
import { useCartStore } from '@/store/cart-store'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { X, ShoppingCart } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore()
  const addToCart = useCartStore((state) => state.addItem)
  const { toast } = useToast()

  const handleMoveToCart = (product: any) => {
    addToCart(product)
    removeItem(product.id)
    toast({
      title: 'Moved to cart',
      description: `${product.name} has been moved to your cart.`,
    })
  }

  if (items.length === 0) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your Wishlist</h1>
          <p className="text-muted-foreground mb-8">Your wishlist is empty</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Your Wishlist ({items.length})</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="relative aspect-square mb-4">
                <Link href={`/products/${product.slug}`}>
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover rounded"
                  />
                </Link>
                <button
                  onClick={() => removeItem(product.id)}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <Link href={`/products/${product.slug}`}>
                <h3 className="font-semibold mb-2 hover:text-primary">{product.name}</h3>
              </Link>
              
              <p className="text-xl font-bold mb-4">{formatPrice(product.price)}</p>
              
              <Button
                className="w-full"
                onClick={() => handleMoveToCart(product)}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.inStock ? 'Move to Cart' : 'Out of Stock'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
