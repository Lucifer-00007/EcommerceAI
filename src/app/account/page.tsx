'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/auth-store'
import { Package, User as UserIcon, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function AccountPage() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])
  
  if (!user) return null
  
  const handleLogout = () => {
    logout()
    router.push('/')
  }
  
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              {user.avatar && (
                <div className="relative w-20 h-20 rounded-full overflow-hidden">
                  <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/account/orders">
            <Card className="hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  My Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">View and track your orders</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/account/profile">
            <Card className="hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Manage your account information</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
