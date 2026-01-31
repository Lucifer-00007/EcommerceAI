'use client'

import Link from 'next/link'
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/stores/cart-store'
import { useAuthStore } from '@/stores/auth-store'
import { ThemeToggle } from '@/components/theme/theme-toggle'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const { cart } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()
  
  const cartItemsCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-primary-foreground font-bold text-sm">EA</span>
            </div>
            <span className="font-bold text-xl">EcommerceAI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="text-foreground/80 hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-foreground/80 hover:text-foreground transition-colors">
              Products
            </Link>
            <Link href="/categories" className="text-foreground/80 hover:text-foreground transition-colors">
              Categories
            </Link>
            <Link href="/deals" className="text-foreground/80 hover:text-foreground transition-colors">
              Deals
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 bg-background/80"
              />
            </div>
          </form>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart */}
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon" aria-label="Open cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Account */}
            {isAuthenticated ? (
              <Link href="/account">
                <Button variant="ghost" size="icon" aria-label="Account">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm" className="px-3">
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Toggle menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4"
                  />
                </div>
              </form>

              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-2 px-4">
                <div onClick={() => setIsMobileMenuOpen(false)}>
                  <Link 
                    href="/" 
                    className="text-sm font-medium hover:text-primary transition-colors py-2 block"
                  >
                    Home
                  </Link>
                </div>
                <div onClick={() => setIsMobileMenuOpen(false)}>
                  <Link 
                    href="/products" 
                    className="text-sm font-medium hover:text-primary transition-colors py-2 block"
                  >
                    Products
                  </Link>
                </div>
                <div onClick={() => setIsMobileMenuOpen(false)}>
                  <Link 
                    href="/categories" 
                    className="text-sm font-medium hover:text-primary transition-colors py-2 block"
                  >
                    Categories
                  </Link>
                </div>
                <div onClick={() => setIsMobileMenuOpen(false)}>
                  <Link 
                    href="/deals" 
                    className="text-sm font-medium hover:text-primary transition-colors py-2 block"
                  >
                    Deals
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
