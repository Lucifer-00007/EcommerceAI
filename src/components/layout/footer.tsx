/**
 * Footer Component
 *
 * Site footer with multiple columns, newsletter signup, and social links.
 * Responsive design with 4 columns on desktop and stacked layout on mobile.
 *
 * @module components/layout
 */

"use client";

import * as React from "react";
import Link from "next/link";
import {
  Laptop,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Truck,
  Shield,
  Headphones,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SOCIAL_LINKS } from "@/lib/constants";

/**
 * Footer component with multiple sections
 *
 * Features:
 * - 4-column layout on desktop (About, Shop, Support, Account)
 * - Newsletter email signup form
 * - Social media links
 * - Payment method icons
 * - Copyright notice
 * - Stacked layout on mobile
 */
export function Footer() {
  const [email, setEmail] = React.useState("");
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock newsletter subscription
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  // Footer columns data
  const footerColumns = [
    {
      title: "Shop",
      links: [
        { label: "All Products", href: "/products" },
        { label: "Categories", href: "/categories" },
        { label: "Deals", href: "/deals" },
        { label: "New Arrivals", href: "/products?sort=newest" },
        { label: "Featured", href: "/products?featured=true" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact Us", href: "/contact" },
        { label: "FAQ", href: "/faq" },
        { label: "Shipping Info", href: "/shipping" },
        { label: "Returns", href: "/returns" },
        { label: "Track Order", href: "/track-order" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Blog", href: "/blog" },
        { label: "Press", href: "/press" },
        { label: "Partners", href: "/partners" },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "My Account", href: "/account" },
        { label: "Order History", href: "/account/orders" },
        { label: "Wishlist", href: "/account/wishlist" },
        { label: "Settings", href: "/account/settings" },
      ],
    },
  ];

  // Trust badges
  const trustBadges = [
    { icon: Truck, label: "Free Shipping", sublabel: "On orders over $50" },
    { icon: Shield, label: "Secure Payment", sublabel: "100% protected" },
    { icon: Headphones, label: "24/7 Support", sublabel: "Dedicated support" },
  ];

  // Social links with icons
  const socialLinks = [
    { icon: Facebook, href: SOCIAL_LINKS.facebook, label: "Facebook" },
    { icon: Twitter, href: SOCIAL_LINKS.twitter, label: "Twitter" },
    { icon: Instagram, href: SOCIAL_LINKS.instagram, label: "Instagram" },
    { icon: Youtube, href: SOCIAL_LINKS.youtube, label: "YouTube" },
  ];

  return (
    <footer className="bg-muted/50 border-t" role="contentinfo">
      {/* Trust Badges */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {trustBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div key={badge.label} className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{badge.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {badge.sublabel}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Laptop className="h-5 w-5 text-primary-foreground" />
              </div>
              TechStore
            </Link>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              Your one-stop destination for the latest tech products. Quality
              electronics at unbeatable prices with exceptional customer service.
            </p>

            {/* Newsletter */}
            <div className="space-y-3">
              <h4 className="font-semibold">Subscribe to our newsletter</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <Button type="submit" disabled={isSubscribed}>
                  {isSubscribed ? "Subscribed!" : "Subscribe"}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground">
                By subscribing, you agree to our Privacy Policy and consent to
                receive updates.
              </p>
            </div>
          </div>

          {/* Footer Columns */}
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h4 className="font-semibold mb-4">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Bottom Bar */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} TechStore. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>

          {/* Payment Icons */}
          <div className="flex items-center gap-2">
            <div
              className="h-8 w-12 bg-muted rounded flex items-center justify-center text-xs font-medium"
              title="Visa"
            >
              VISA
            </div>
            <div
              className="h-8 w-12 bg-muted rounded flex items-center justify-center text-xs font-medium"
              title="Mastercard"
            >
              MC
            </div>
            <div
              className="h-8 w-12 bg-muted rounded flex items-center justify-center text-xs font-medium"
              title="PayPal"
            >
              PP
            </div>
            <div
              className="h-8 w-12 bg-muted rounded flex items-center justify-center text-xs font-medium"
              title="Apple Pay"
            >
              AP
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <Link href="/cookies" className="hover:text-foreground transition-colors">
            Cookie Policy
          </Link>
          <Link href="/sitemap" className="hover:text-foreground transition-colors">
            Sitemap
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
