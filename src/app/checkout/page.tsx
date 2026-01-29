'use client'

export const dynamic = 'force-dynamic'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCartStore } from '@/store/cart-store'
import { useAuthStore } from '@/store/auth-store'
import { formatPrice } from '@/lib/utils'
import { orderService } from '@/services/order-service'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code is required'),
  country: z.string().min(2, 'Country is required'),
  cardNumber: z.string().min(16, 'Invalid card number'),
  cardExpiry: z.string().regex(/^\d{2}\/\d{2}$/, 'Format: MM/YY'),
  cardCvv: z.string().min(3, 'Invalid CVV'),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      country: 'United States',
    },
  })
  
  if (items.length === 0) {
    router.push('/cart')
    return null
  }
  
  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true)
    
    try {
      // Mock order creation
      await orderService.createOrder(
        user?.id || 'guest',
        items,
        {
          fullName: data.fullName,
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
          phone: data.phone,
        }
      )
      
      clearCart()
      
      toast({
        title: 'Order placed successfully!',
        description: 'Thank you for your purchase.',
      })
      
      router.push('/account/orders')
    } catch (error) {
      toast({
        title: 'Order failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" {...register('fullName')} />
                    {errors.fullName && (
                      <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register('email')} />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" {...register('phone')} />
                  {errors.phone && (
                    <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input id="street" {...register('street')} />
                  {errors.street && (
                    <p className="text-sm text-destructive mt-1">{errors.street.message}</p>
                  )}
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" {...register('city')} />
                    {errors.city && (
                      <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input id="state" {...register('state')} />
                    {errors.state && (
                      <p className="text-sm text-destructive mt-1">{errors.state.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input id="zipCode" {...register('zipCode')} />
                    {errors.zipCode && (
                      <p className="text-sm text-destructive mt-1">{errors.zipCode.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" {...register('country')} />
                  {errors.country && (
                    <p className="text-sm text-destructive mt-1">{errors.country.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" {...register('cardNumber')} />
                  {errors.cardNumber && (
                    <p className="text-sm text-destructive mt-1">{errors.cardNumber.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cardExpiry">Expiry Date</Label>
                    <Input id="cardExpiry" placeholder="MM/YY" {...register('cardExpiry')} />
                    {errors.cardExpiry && (
                      <p className="text-sm text-destructive mt-1">{errors.cardExpiry.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="cardCvv">CVV</Label>
                    <Input id="cardCvv" placeholder="123" {...register('cardCvv')} />
                    {errors.cardCvv && (
                      <p className="text-sm text-destructive mt-1">{errors.cardCvv.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span>
                        {item.product.name} × {item.quantity}
                      </span>
                      <span>{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatPrice(getTotalPrice() * 0.1)}</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(getTotalPrice() * 1.1)}</span>
                  </div>
                </div>
                
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
