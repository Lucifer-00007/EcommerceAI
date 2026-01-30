'use client';

// Mobile navigation component
// Mobile-friendly navigation menu with slide-out animation

import Link from 'next/link';
import { X, ShoppingCart, User, Heart, Home, Package, Tag, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartTotalItems } from '@/hooks/use-cart';

/**
 * Mobile navigation component props
 */
interface MobileNavProps {
  /** Whether the mobile menu is open */
  isOpen: boolean;
  /** Callback function to close the menu */
  onClose: () => void;
}

/**
 * Mobile navigation component
 * Slide-out menu for mobile devices with navigation links and quick actions
 */
export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const totalItems = useCartTotalItems();

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/products', label: 'Products', icon: Package },
    { href: '/categories', label: 'Categories', icon: Tag },
    { href: '/deals', label: 'Deals', icon: DollarSign },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile Menu */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 transform bg-background shadow-xl transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-lg font-bold">E</span>
            </div>
            <span className="font-bold">EcommerceAI</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Quick Actions */}
        <div className="border-t p-4">
          <div className="grid grid-cols-3 gap-2">
            <Link
              href="/wishlist"
              onClick={onClose}
              className="flex flex-col items-center space-y-1 rounded-lg p-3 transition-colors hover:bg-accent"
            >
              <Heart className="h-5 w-5" />
              <span className="text-xs">Wishlist</span>
            </Link>
            <Link
              href="/cart"
              onClick={onClose}
              className="relative flex flex-col items-center space-y-1 rounded-lg p-3 transition-colors hover:bg-accent"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
              <span className="text-xs">Cart</span>
            </Link>
            <Link
              href="/account"
              onClick={onClose}
              className="flex flex-col items-center space-y-1 rounded-lg p-3 transition-colors hover:bg-accent"
            >
              <User className="h-5 w-5" />
              <span className="text-xs">Account</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
