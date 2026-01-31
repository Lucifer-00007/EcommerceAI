'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/stores/cart-store'
import { useEffect } from 'react'

export default function CartPage() {
  const { 
    cart, 
    initializeCart, 
    updateQuantity, 
    removeFromCart, 
    toggleItemSelection,
    selectAllItems,
    clearCart 
  } = useCartStore()

  useEffect(() => {
    initializeCart()
  }, [initializeCart])

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity)
    }
  }

  const selectedItems = cart?.items.filter(item => item.selected) || []
  const selectedSubtotal = selectedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const selectedTax = selectedSubtotal * 0.08 // 8% tax rate
  const selectedShipping = selectedSubtotal > 100 ? 0 : 9.99 // Free shipping over $100
  const selectedTotal = selectedSubtotal + selectedTax + selectedShipping

  const allSelected = cart?.items && cart.items.length > 0 && cart.items.every(item => item.selected)

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Looks like you haven't added any products to your cart yet. Start shopping to fill it up!
          </p>
          <div className="space-x-4">
            <Button size="lg" asChild>
              <Link href="/products">
                Continue Shopping
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/">
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Select All */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => selectAllItems(e.target.checked)}
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <span className="font-medium">Select all items ({cart.items.length})</span>
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700"
                >
                  Clear Cart
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cart Items List */}
          {cart.items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Item Selection */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleItemSelection(item.id)}
                      className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                  </div>

                  {/* Product Image */}
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-md"
                      sizes="96px"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-lg mb-1">
                          <Link 
                            href={`/products/${item.product.id}`}
                            className="hover:text-primary transition-colors"
                          >
                            {item.product.name}
                          </Link>
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.product.brand} • {item.product.sku}
                        </p>
                        {item.product.originalPrice && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-muted-foreground line-through">
                              ${item.product.originalPrice.toFixed(2)}
                            </span>
                            <Badge variant="destructive" className="text-xs">
                              {Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex justify-between items-end">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Quantity:</span>
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="h-8 w-8"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        {item.quantity >= item.product.stock && (
                          <span className="text-xs text-orange-600">
                            Max stock reached
                          </span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="font-semibold text-lg">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ${item.product.price.toFixed(2)} each
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Selected Items Count */}
              <div className="flex justify-between text-sm">
                <span>Selected Items ({selectedItems.length})</span>
                <span>${selectedSubtotal.toFixed(2)}</span>
              </div>

              {/* Subtotal */}
              <div className="flex justify-between font-medium">
                <span>Subtotal</span>
                <span>${selectedSubtotal.toFixed(2)}</span>
              </div>

              {/* Tax */}
              <div className="flex justify-between text-sm">
                <span>Tax (8%)</span>
                <span>${selectedTax.toFixed(2)}</span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                {selectedShipping === 0 ? (
                  <span className="text-green-600">FREE</span>
                ) : (
                  <span>${selectedShipping.toFixed(2)}</span>
                )}
              </div>

              {/* Free Shipping Notice */}
              {selectedSubtotal > 0 && selectedSubtotal <= 100 && (
                <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                  Add ${(100 - selectedSubtotal).toFixed(2)} more for free shipping!
                </div>
              )}

              {/* Divider */}
              <hr />

              {/* Total */}
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${selectedTotal.toFixed(2)}</span>
              </div>

              {/* Checkout Button */}
              <Button 
                size="lg" 
                className="w-full"
                disabled={selectedItems.length === 0}
                asChild
              >
                <Link href="/checkout">
                  Proceed to Checkout ({selectedItems.length} items)
                </Link>
              </Button>

              {/* Continue Shopping */}
              <Button variant="outline" size="lg" className="w-full" asChild>
                <Link href="/products">
                  Continue Shopping
                </Link>
              </Button>

              {/* Security Note */}
              <div className="text-xs text-muted-foreground text-center">
                <p>🔒 Secure checkout powered by industry-standard encryption</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
