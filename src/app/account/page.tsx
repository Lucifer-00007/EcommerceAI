/**
 * Account Profile Page
 * 
 * User profile management page.
 * 
 * Features:
 * - View and edit profile information
 * - Change password
 * - View account statistics
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { 
  User, 
  Mail, 
  Phone, 
  Package, 
  Heart, 
  MapPin, 
  CreditCard,
  Settings,
  ChevronRight
} from 'lucide-react'
import { useCurrentUser, useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useShowToast } from '@/components/ui/toast'

// ============================================================================
// SCHEMAS
// ============================================================================

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

// ============================================================================
// NAVIGATION ITEMS
// ============================================================================

const navItems = [
  { href: '/account', label: 'Profile', icon: User },
  { href: '/account/orders', label: 'Orders', icon: Package },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/account/payment', label: 'Payment Methods', icon: CreditCard },
  { href: '/account/settings', label: 'Settings', icon: Settings },
]

// ============================================================================
// PROFILE FORM COMPONENT
// ============================================================================

function ProfileForm() {
  const user = useCurrentUser()
  const { updateProfile } = useAuthStore()
  const toast = useShowToast()
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    const result = await updateProfile(data)
    setIsLoading(false)

    if (result.success) {
      toast.success('Profile updated successfully')
    } else {
      toast.error(result.error || 'Failed to update profile')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" required>Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="name"
            className="pl-10"
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register('name')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" required>Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            className="pl-10"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            className="pl-10"
            placeholder="+1 (555) 123-4567"
            error={!!errors.phone}
            helperText={errors.phone?.message}
            {...register('phone')}
          />
        </div>
      </div>

      <Button type="submit" isLoading={isLoading}>
        Save Changes
      </Button>
    </form>
  )
}

// ============================================================================
// PASSWORD FORM COMPONENT
// ============================================================================

function PasswordForm() {
  const toast = useShowToast()
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  const onSubmit = async (data: PasswordFormData) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    
    toast.success('Password updated successfully')
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword" required>Current Password</Label>
        <Input
          id="currentPassword"
          type="password"
          error={!!errors.currentPassword}
          helperText={errors.currentPassword?.message}
          {...register('currentPassword')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword" required>New Password</Label>
        <Input
          id="newPassword"
          type="password"
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message}
          {...register('newPassword')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" required>Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
      </div>

      <Button type="submit" isLoading={isLoading}>
        Update Password
      </Button>
    </form>
  )
}

// ============================================================================
// SIDEBAR COMPONENT
// ============================================================================

function AccountSidebar() {
  // This would normally check the current path
  const currentPath = '/account'

  return (
    <Card>
      <CardContent className="p-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPath === item.href
            
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

export default function AccountPage() {
  const user = useCurrentUser()

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="text-muted-foreground mb-6">
          You need to be signed in to view your account.
        </p>
        <Link href="/login">
          <Button>Sign In</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Account</h1>
        <p className="text-muted-foreground">
          Manage your profile and account settings
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* User Card */}
            <Card>
              <CardContent className="p-6 text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="font-semibold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </CardContent>
            </Card>

            {/* Navigation */}
            <AccountSidebar />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PasswordForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
