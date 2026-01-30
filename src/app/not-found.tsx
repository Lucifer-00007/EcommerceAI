/**
 * 404 Not Found Page
 * 
 * Displayed when a user navigates to a non-existent route.
 * 
 * Features:
 * - Friendly error message
 * - Navigation options
 * - Search functionality
 */

'use client'

import Link from 'next/link'
import { Search, Home, ArrowLeft, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative w-48 h-48 mx-auto">
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
            <div className="absolute inset-4 bg-primary/20 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="h-20 w-20 text-primary" />
            </div>
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
        
        {/* Message */}
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. 
          It might have been moved, deleted, or never existed.
        </p>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-3">
              Looking for something specific?
            </p>
            <form className="flex gap-2" action="/products">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="search"
                  placeholder="Search products..."
                  className="pl-9"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </CardContent>
        </Card>

        {/* Navigation Options */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Link href="/">
            <Button>
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12">
          <p className="text-sm text-muted-foreground mb-4">Popular pages:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/products">
              <Button variant="outline" size="sm">All Products</Button>
            </Link>
            <Link href="/categories">
              <Button variant="outline" size="sm">Categories</Button>
            </Link>
            <Link href="/cart">
              <Button variant="outline" size="sm">Shopping Cart</Button>
            </Link>
            <Link href="/account">
              <Button variant="outline" size="sm">My Account</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
