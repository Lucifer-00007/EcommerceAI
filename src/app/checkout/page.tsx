/**
 * Checkout Page
 * 
 * Multi-step checkout process for completing orders.
 * 
 * Features:
 * - Step-by-step checkout flow
 * - Shipping information form
 * - Payment information form
 * - Order review
 * - Order confirmation
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Check, 
  ChevronRight, 
  CreditCard, 
  Truck, 
  Package,
  Lock
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useCartStore } from '@/stores/cartStore'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { useShowToast } from '@/components/ui/toast'

// ============================================================================
// SCHEMAS
// ============================================================================

const shippingSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'Valid ZIP code is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
})

const paymentSchema = z.object({
  cardNumber: z.string().min(16, 'Valid card number is required'),
  cardName: z.string().min(2, 'Cardholder name is required'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Format: MM/YY'),
  cvv: z.string().min(3, 'CVV is required'),
})

type ShippingFormData = z.infer<typeof shippingSchema>
type PaymentFormData = z.infer<typeof paymentSchema>

// ============================================================================
// SHIPPING METHODS
// ============================================================================

const shippingMethods = [
  { id: 'standard', name: 'Standard Shipping', description: '5-7 business days', price: 5 },
  { id: 'express', name: 'Express Shipping', description: '2-3 business days', price: 15 },
  { id: 'overnight', name: 'Overnight Shipping', description: 'Next business day', price: 25 },
]

// ============================================================================
// STEP INDICATOR COMPONENT
// ============================================================================

interface StepIndicatorProps {
  currentStep: number
  steps: string[]
}

function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index < currentStep
                  ? 'bg-primary text-primary-foreground'
                  : index === currentStep
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {index < currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
            <span
              className={`ml-2 text-sm hidden sm:block ${
                index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <ChevronRight className="h-4 w-4 mx-4 text-muted-foreground" />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// ============================================================================
// SHIPPING FORM COMPONENT
// ============================================================================

interface ShippingFormProps {
  onSubmit: (data: ShippingFormData) => void
  defaultValues?: Partial<ShippingFormData>
}

function ShippingForm({ onSubmit, defaultValues }: ShippingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="email" required>Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" required>First Name</Label>
          <Input
            id="firstName"
            placeholder="John"
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            {...register('firstName')}
          />
        </div>
        <div>
          <Label htmlFor="lastName" required>Last Name</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address" required>Address</Label>
        <Input
          id="address"
          placeholder="123 Main Street"
          error={!!errors.address}
          helperText={errors.address?.message}
          {...register('address')}
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city" required>City</Label>
          <Input
            id="city"
            placeholder="New York"
            error={!!errors.city}
            helperText={errors.city?.message}
            {...register('city')}
          />
        </div>
        <div>
          <Label htmlFor="state" required>State</Label>
          <Input
            id="state"
            placeholder="NY"
            error={!!errors.state}
            helperText={errors.state?.message}
            {...register('state')}
          />
        </div>
        <div>
          <Label htmlFor="zipCode" required>ZIP Code</Label>
          <Input
            id="zipCode"
            placeholder="10001"
            error={!!errors.zipCode}
            helperText={errors.zipCode?.message}
            {...register('zipCode')}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="phone" required>Phone</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          error={!!errors.phone}
          helperText={errors.phone?.message}
          {...register('phone')}
        />
      </div>

      <Button type="submit" className="w-full">
        Continue to Shipping
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </form>
  )
}

// ============================================================================
// SHIPPING METHOD COMPONENT
// ============================================================================

interface ShippingMethodProps {
  selectedMethod: string
  onSelect: (methodId: string) => void
}

function ShippingMethodSelector({ selectedMethod, onSelect }: ShippingMethodProps) {
  return (
    <RadioGroup value={selectedMethod} onValueChange={onSelect} className="space-y-3">
      {shippingMethods.map((method) => (
        <div key={method.id}>
          <RadioGroupItem
            value={method.id}
            id={method.id}
            className="peer sr-only"
          />
          <Label
            htmlFor={method.id}
            className="flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{method.name}</p>
                <p className="text-sm text-muted-foreground">{method.description}</p>
              </div>
            </div>
            <span className="font-semibold">
              {method.price === 0 ? 'Free' : formatCurrency(method.price)}
            </span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}

// ============================================================================
// PAYMENT FORM COMPONENT
// ============================================================================

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void
}

function PaymentForm({ onSubmit }: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="cardNumber" required>Card Number</Label>
        <Input
          id="cardNumber"
          placeholder="1234 5678 9012 3456"
          error={!!errors.cardNumber}
          helperText={errors.cardNumber?.message}
          {...register('cardNumber')}
        />
      </div>

      <div>
        <Label htmlFor="cardName" required>Cardholder Name</Label>
        <Input
          id="cardName"
          placeholder="John Doe"
          error={!!errors.cardName}
          helperText={errors.cardName?.message}
          {...register('cardName')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="expiryDate" required>Expiry Date</Label>
          <Input
            id="expiryDate"
            placeholder="MM/YY"
            error={!!errors.expiryDate}
            helperText={errors.expiryDate?.message}
            {...register('expiryDate')}
          />
        </div>
        <div>
          <Label htmlFor="cvv" required>CVV</Label>
          <Input
            id="cvv"
            type="password"
            placeholder="123"
            maxLength={4}
            error={!!errors.cvv}
            helperText={errors.cvv?.message}
            {...register('cvv')}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Lock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Your payment information is secure and encrypted
        </span>
      </div>

      <Button type="submit" className="w-full">
        Complete Order
        <Check className="h-4 w-4 ml-2" />
      </Button>
    </form>
  )
}

// ============================================================================
// ORDER REVIEW COMPONENT
// ============================================================================

interface OrderReviewProps {
  shippingData: ShippingFormData
  shippingMethod: typeof shippingMethods[0]
  onPlaceOrder: () => void
}

function OrderReview({ shippingData, shippingMethod, onPlaceOrder }: OrderReviewProps) {
  const items = useCartStore(state => state.items)
  const totals = useCartStore(state => state.totals)

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <div>
        <h3 className="font-semibold mb-3">Order Items</h3>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-sm">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="font-medium">
                {formatCurrency(item.priceAtAdd * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Shipping Address */}
      <div>
        <h3 className="font-semibold mb-3">Shipping Address</h3>
        <div className="text-sm">
          <p>{shippingData.firstName} {shippingData.lastName}</p>
          <p>{shippingData.address}</p>
          <p>{shippingData.city}, {shippingData.state} {shippingData.zipCode}</p>
          <p>{shippingData.email}</p>
          <p>{shippingData.phone}</p>
        </div>
      </div>

      <Separator />

      {/* Shipping Method */}
      <div>
        <h3 className="font-semibold mb-3">Shipping Method</h3>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{shippingMethod.name}</p>
            <p className="text-sm text-muted-foreground">{shippingMethod.description}</p>
          </div>
          <span className="font-medium">
            {shippingMethod.price === 0 ? 'Free' : formatCurrency(shippingMethod.price)}
          </span>
        </div>
      </div>

      <Separator />

      {/* Totals */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCurrency(totals.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span>{formatCurrency(shippingMethod.price)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax</span>
          <span>{formatCurrency(totals.tax)}</span>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total</span>
          <span className="text-2xl font-bold">
            {formatCurrency(totals.subtotal + shippingMethod.price + totals.tax)}
          </span>
        </div>
      </div>

      <Button onClick={onPlaceOrder} className="w-full">
        Place Order
        <Check className="h-4 w-4 ml-2" />
      </Button>
    </div>
  )
}

// ============================================================================
// ORDER CONFIRMATION COMPONENT
// ============================================================================

function OrderConfirmation() {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
        <Check className="h-10 w-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Thank you for your order. We&apos;ve sent a confirmation email to you.
        Your order will be processed and shipped soon.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/account/orders">
          <Button variant="outline">View Order</Button>
        </Link>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function CheckoutPage() {
  const router = useRouter()
  const toast = useShowToast()
  const items = useCartStore(state => state.items)
  const clearCart = useCartStore(state => state.clearCart)

  const [currentStep, setCurrentStep] = React.useState(0)
  const [shippingData, setShippingData] = React.useState<ShippingFormData>()
  const [shippingMethod, setShippingMethod] = React.useState(shippingMethods[0])
  const [isComplete, setIsComplete] = React.useState(false)

  // Redirect to cart if empty
  React.useEffect(() => {
    if (items.length === 0 && !isComplete) {
      router.push('/cart')
    }
  }, [items.length, isComplete, router])

  const handleShippingSubmit = (data: ShippingFormData) => {
    setShippingData(data)
    setCurrentStep(1)
  }

  const handlePaymentSubmit = () => {
    setCurrentStep(2)
  }

  const handlePlaceOrder = () => {
    // Simulate order placement
    toast.success('Your order has been placed successfully!')
    clearCart()
    setIsComplete(true)
  }

  const steps = ['Information', 'Shipping', 'Payment', 'Review']

  if (isComplete) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <OrderConfirmation />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <StepIndicator currentStep={currentStep} steps={steps} />

      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === 0 && 'Contact Information'}
                {currentStep === 1 && 'Shipping Method'}
                {currentStep === 2 && 'Payment Information'}
                {currentStep === 3 && 'Review Order'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentStep === 0 && (
                <ShippingForm 
                  onSubmit={handleShippingSubmit} 
                  defaultValues={shippingData}
                />
              )}

              {currentStep === 1 && shippingData && (
                <div className="space-y-6">
                  <ShippingMethodSelector
                    selectedMethod={shippingMethod.id}
                    onSelect={(id) => setShippingMethod(shippingMethods.find(m => m.id === id) || shippingMethods[0])}
                  />
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setCurrentStep(0)}>
                      Back
                    </Button>
                    <Button onClick={() => setCurrentStep(2)}>
                      Continue to Payment
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <PaymentForm onSubmit={handlePaymentSubmit} />
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Back
                  </Button>
                </div>
              )}

              {currentStep === 3 && shippingData && (
                <div className="space-y-6">
                  <OrderReview
                    shippingData={shippingData}
                    shippingMethod={shippingMethod}
                    onPlaceOrder={handlePlaceOrder}
                  />
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    Back
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="line-clamp-1">{item.product.name} x {item.quantity}</span>
                      <span>{formatCurrency(item.priceAtAdd * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(useCartStore.getState().totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{currentStep >= 1 ? formatCurrency(shippingMethod.price) : '-'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
