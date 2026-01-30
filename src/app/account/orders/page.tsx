/**
 * Orders Page
 * 
 * Displays order history for the authenticated user.
 * 
 * Features:
 * - List of past orders
 * - Order status tracking
 * - Order details view
 * - Reorder functionality
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Package, 
  ChevronRight, 
  Truck, 
  CheckCircle, 
  Clock,
  XCircle,
  RotateCcw
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { orderApi } from '@/services/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Order } from '@/types'

// ============================================================================
// STATUS CONFIG
// ============================================================================

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-500', icon: Clock },
  processing: { label: 'Processing', color: 'bg-blue-500', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-purple-500', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-500', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-500', icon: XCircle },
  refunded: { label: 'Refunded', color: 'bg-gray-500', icon: RotateCcw },
}

// ============================================================================
// ORDER CARD COMPONENT
// ============================================================================

interface OrderCardProps {
  order: Order
}

function OrderCard({ order }: OrderCardProps) {
  const status = statusConfig[order.status]
  const StatusIcon = status.icon

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-semibold">{order.orderNumber}</h3>
              <Badge className={`${status.color} text-white`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {status.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{formatCurrency(order.total)}</p>
            <p className="text-sm text-muted-foreground">
              {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Items Preview */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex -space-x-2">
            {order.items.slice(0, 3).map((item, index) => (
              <div
                key={item.id}
                className="relative w-12 h-12 rounded-md overflow-hidden border-2 border-background"
                style={{ zIndex: 3 - index }}
              >
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center border-2 border-background">
                <span className="text-sm font-medium">+{order.items.length - 3}</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground line-clamp-1">
              {order.items.map(i => i.productName).join(', ')}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Order {order.orderNumber}</DialogTitle>
              </DialogHeader>
              <OrderDetails order={order} />
            </DialogContent>
          </Dialog>

          {order.status === 'delivered' && (
            <Button variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reorder
            </Button>
          )}

          {(order.status === 'pending' || order.status === 'processing') && (
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
              Cancel Order
            </Button>
          )}

          {order.trackingNumber && (
            <Button variant="outline" size="sm">
              <Truck className="h-4 w-4 mr-2" />
              Track
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// ORDER DETAILS COMPONENT
// ============================================================================

function OrderDetails({ order }: { order: Order }) {
  const status = statusConfig[order.status]
  const StatusIcon = status.icon

  return (
    <div className="space-y-6">
      {/* Status */}
      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
        <div className={`w-10 h-10 rounded-full ${status.color} flex items-center justify-center`}>
          <StatusIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-medium">{status.label}</p>
          <p className="text-sm text-muted-foreground">
            Updated on {formatDate(order.updatedAt)}
          </p>
        </div>
      </div>

      {/* Items */}
      <div>
        <h4 className="font-semibold mb-3">Order Items</h4>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted">
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity} x {formatCurrency(item.unitPrice)}
                </p>
              </div>
              <p className="font-semibold">{formatCurrency(item.total)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address */}
      <div>
        <h4 className="font-semibold mb-3">Shipping Address</h4>
        <div className="p-3 border rounded-lg text-sm">
          <p className="font-medium">{order.shippingAddress.name}</p>
          <p>{order.shippingAddress.street1}</p>
          {order.shippingAddress.street2 && <p>{order.shippingAddress.street2}</p>}
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </p>
          <p>{order.shippingAddress.country}</p>
          {order.shippingAddress.phone && (
            <p className="mt-2 text-muted-foreground">{order.shippingAddress.phone}</p>
          )}
        </div>
      </div>

      {/* Payment */}
      <div>
        <h4 className="font-semibold mb-3">Payment</h4>
        <div className="p-3 border rounded-lg">
          <p className="text-sm">{order.paymentMethod}</p>
          <p className="text-sm text-muted-foreground capitalize">
            Payment Status: {order.paymentStatus}
          </p>
        </div>
      </div>

      {/* Totals */}
      <div>
        <h4 className="font-semibold mb-3">Order Total</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>{formatCurrency(order.shipping)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span>{formatCurrency(order.tax)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span className="text-green-600">-{formatCurrency(order.discount)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Tracking */}
      {order.trackingNumber && (
        <div>
          <h4 className="font-semibold mb-3">Tracking</h4>
          <div className="p-3 border rounded-lg">
            <p className="text-sm font-medium">Tracking Number</p>
            <p className="text-sm">{order.trackingNumber}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// SIDEBAR COMPONENT
// ============================================================================

function AccountSidebar() {
  const navItems = [
    { href: '/account', label: 'Profile', icon: Package },
    { href: '/account/orders', label: 'Orders', icon: Package },
    { href: '/account/addresses', label: 'Addresses', icon: Package },
    { href: '/account/wishlist', label: 'Wishlist', icon: Package },
  ]

  return (
    <Card>
      <CardContent className="p-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.href === '/account/orders'
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </Link>
            )
          })}
        </nav>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function OrdersPage() {
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderApi.getOrders(),
  })

  const orders = ordersData?.data || []

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">
          View and track your order history
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <AccountSidebar />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven&apos;t placed any orders yet. Start shopping to see your orders here.
                </p>
                <Link href="/products">
                  <Button>Browse Products</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
