import Link from "next/link";
import {
  ArrowRight,
  Headphones,
  Laptop,
  Package,
  RefreshCw,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  Smartphone,
  Truck,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/common/product-card";
import { mockProducts } from "@/services/mock-data";

/**
 * Home Page - E-commerce Landing Page
 *
 * Features:
 * - Hero section with gradient background and CTAs
 * - Featured categories grid
 * - Featured products showcase
 * - Value proposition section
 * - Newsletter signup
 */
export default function HomePage() {
  // Get featured products (first 4 with isFeatured flag)
  const featuredProducts = mockProducts
    .filter((product) => product.isFeatured)
    .slice(0, 4);

  // Category data
  const categories = [
    {
      id: "electronics",
      name: "Electronics",
      description: "Latest gadgets and tech",
      itemCount: 156,
      icon: Laptop,
      href: "/products?category=electronics",
      gradient: "from-blue-500/20 to-purple-500/20",
    },
    {
      id: "fashion",
      name: "Fashion",
      description: "Trendy styles for everyone",
      itemCount: 243,
      icon: Shirt,
      href: "/products?category=fashion",
      gradient: "from-pink-500/20 to-rose-500/20",
    },
    {
      id: "home-living",
      name: "Home & Living",
      description: "Everything for your home",
      itemCount: 189,
      icon: ShoppingBag,
      href: "/products?category=home",
      gradient: "from-emerald-500/20 to-teal-500/20",
    },
    {
      id: "sports",
      name: "Sports",
      description: "Gear for active lifestyles",
      itemCount: 124,
      icon: Zap,
      href: "/products?category=sports",
      gradient: "from-orange-500/20 to-amber-500/20",
    },
  ];

  // Value propositions
  const valueProps = [
    {
      id: "shipping",
      title: "Free Shipping",
      description: "On all orders over $50",
      icon: Truck,
    },
    {
      id: "support",
      title: "24/7 Support",
      description: "Always here to help",
      icon: Headphones,
    },
    {
      id: "secure",
      title: "Secure Payment",
      description: "100% secure checkout",
      icon: ShieldCheck,
    },
    {
      id: "returns",
      title: "Easy Returns",
      description: "30-day return policy",
      icon: RefreshCw,
    },
  ];

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[600px] items-center justify-center overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        {/* Gradient Background */}
        <div className="gradient-primary absolute inset-0 opacity-95" />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30" />
        
        {/* Dark mode overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background dark:from-background/0 dark:via-background/0 dark:to-background/50" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Discover Premium Tech
            <br />
            <span className="text-white/90">For Every Lifestyle</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-primary-foreground/80 sm:text-xl">
            Explore our curated collection of cutting-edge electronics, from
            powerful laptops to smart wearables. Quality products, unbeatable
            prices, delivered to your door.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="min-w-[160px] gap-2 bg-white text-primary hover:bg-white/90"
            >
              <Link href="/products">
                <ShoppingBag className="h-5 w-5" />
                Shop Now
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-[160px] border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            >
              <Link href="#features">Learn More</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/20 pt-8">
            <div>
              <div className="text-3xl font-bold text-white sm:text-4xl">20K+</div>
              <div className="mt-1 text-sm text-white/70">Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white sm:text-4xl">50K+</div>
              <div className="mt-1 text-sm text-white/70">Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white sm:text-4xl">4.9</div>
              <div className="mt-1 text-sm text-white/70">Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Section */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Shop by Category
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Browse our wide range of carefully curated categories
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.id} href={category.href}>
                  <Card className="group h-full cursor-pointer overflow-hidden border bg-gradient-to-br from-card to-muted/50 transition-all hover:shadow-lg hover:-translate-y-1">
                    <CardHeader className="pb-4">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${category.gradient} transition-transform group-hover:scale-110`}
                      >
                        <Icon className="h-7 w-7 text-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-xl">{category.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {category.description}
                      </CardDescription>
                      <p className="mt-3 text-sm font-medium text-muted-foreground">
                        {category.itemCount} items
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-muted/30 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Featured Products
              </h2>
              <p className="mt-2 text-lg text-muted-foreground">
                Handpicked selections just for you
              </p>
            </div>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/products">
                View All Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section id="features" className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why Choose Us
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We're committed to providing the best shopping experience
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {valueProps.map((prop) => {
              const Icon = prop.icon;
              return (
                <div
                  key={prop.id}
                  className="flex flex-col items-center text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {prop.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {prop.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 sm:px-16 sm:py-20">
            {/* Background decoration */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                <Smartphone className="h-7 w-7 text-white" />
              </div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Subscribe to Our Newsletter
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-primary-foreground/80">
                Stay updated with the latest products, exclusive deals, and tech
                news delivered straight to your inbox.
              </p>

              <form
                className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
                action="#"
                method="POST"
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="h-12 border-white/20 bg-white/10 text-white placeholder:text-white/60 focus-visible:ring-white/30"
                  required
                />
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 bg-white text-primary hover:bg-white/90"
                >
                  Subscribe
                </Button>
              </form>

              <p className="mt-4 text-sm text-primary-foreground/60">
                No spam, unsubscribe at any time. Read our{" "}
                <Link href="/privacy" className="underline hover:text-white">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-t px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-50 grayscale transition-opacity hover:opacity-100 hover:grayscale-0">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="h-6 w-6" />
              <span className="font-semibold">Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package className="h-6 w-6" />
              <span className="font-semibold">Fast Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <RefreshCw className="h-6 w-6" />
              <span className="font-semibold">Easy Returns</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
