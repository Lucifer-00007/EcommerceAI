/**
 * Cart Page
 * 
 * Displays the shopping cart with item management and checkout summary.
 * 
 * Features:
 * - List of cart items with images and details
 * - Quantity adjustment
 * - Item removal
 * - Price breakdown (subtotal, shipping, tax, total)
 * - Empty cart state
 * - Proceed to checkout button
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  ArrowRight,
  Truck,
  Shield,
  RotateCcw
} from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'

// ============================================================================
// CART ITEM COMPONENT
// ============================================================================

interface CartItemProps {
  item: {
    id: string
    product: {
      id: string
      name: string
      slug: string
      image: string
      price: number
      originalPrice?: number
      inStock: boolean
      stockQuantity: number
    }
    quantity: number
    priceAtAdd: number
  }
}

function CartItemRow({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()

  const handleIncrease = () => {
    if (item.quantity < item.product.stockQuantity) {
      updateQuantity(item.id, item.quantity + 1)
    }
  }

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1)
    }
  }

  const handleRemove = () => {
    removeItem(item.id)
  }

  const itemTotal = item.priceAtAdd * item.quantity
  const originalTotal = item.product.originalPrice 
    ? item.product.originalPrice * item.quantity 
    : null

  return (
    <div className="flex gap-4 py-4">
      {/* Product Image */}
      <Link href={`/products/${item.product.slug}`}>
        <div className="relative w-24 h-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
          <Image
            src={item.product.image}
            alt={item.product.name}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <Link 
            href={`/products/${item.product.slug}`}
            className="font-medium hover:text-primary transition-colors line-clamp-2"
          >
            {item.product.name}
          </Link>
          <button
            onClick={handleRemove}
            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center border rounded-md">
            <button
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
              className="p-2 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-10 text-center text-sm">{item.quantity}</span>
            <button
              onClick={handleIncrease}
              disabled={item.quantity >= item.product.stockQuantity}
              className="p-2 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="font-semibold">{formatCurrency(itemTotal)}</p>
            {originalTotal && originalTotal > itemTotal && (
              <p className="text-sm text-muted-foreground line-through">
                {formatCurrency(originalTotal)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// EMPTY CART COMPONENT
// ============================================================================

function EmptyCart() {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Looks like you haven&apos;t added anything to your cart yet. 
        Browse our products and find something you&apos;ll love!
      </p>
      <Link href="/products">
        <Button size="lg">
          Continue Shopping
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </Link>
    </div>
  )
}

// ============================================================================
// ORDER SUMMARY COMPONENT
// ============================================================================

function OrderSummary() {
  const totals = useCartStore(state => state.totals)
  const [promoCode, setPromoCode] = React.useState('')
  const [promoApplied, setPromoApplied] = React.useState(false)

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setPromoApplied(true)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(totals.subtotal)}</span>
          </div>
          
          {totals.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>
              <span className="text-green-600">-{formatCurrency(totals.discount)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span>
              {totals.shipping === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                formatCurrency(totals.shipping)
              )}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (8%)</span>
            <span>{formatCurrency(totals.tax)}</span>
          </div>

          {promoApplied && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Promo Code</span>
              <span className="text-green-600">-$10.00</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total</span>
          <span className="text-2xl font-bold">
            {formatCurrency(totals.total - (promoApplied ? 10 : 0))}
          </span>
        </div>

        {/* Promo Code */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Promo Code</label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled={promoApplied}
            />
            <Button 
              variant="outline" 
              onClick={handleApplyPromo}
              disabled={promoApplied || !promoCode.trim()}
            >
              {promoApplied ? 'Applied' : 'Apply'}
            </Button>
          </div>
          {promoApplied && (
            <p className="text-sm text-green-600">
              Promo code applied successfully!
            </p>
          )}
        </div>

        {/* Checkout Button */}
        <Link href="/checkout">
          <Button className="w-full" size="lg">
            Proceed to Checkout
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </Link>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-2 pt-4 text-center text-xs text-muted-foreground">
          <div className="flex flex-col items-center gap-1">
            <Truck className="h-5 w-5" />
            <span>Free Shipping</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Shield className="h-5 w-5" />
            <span>Secure Payment</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <RotateCcw className="h-5 w-5" />
            <span>Easy Returns</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function CartPage() {
  const items = useCartStore(state => state.items)
  const itemCount = useCartStore(state => state.itemCount)

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyCart />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
        <p className="text-muted-foreground">
          You have {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="divide-y">
                {items.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="mt-6 pt-6 border-t">
                <Link href="/products">
                  <Button variant="outline">
                    <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  )
}
