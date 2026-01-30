// Home page component
// Main landing page for the e-commerce application

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Truck, Shield, HeadphonesIcon, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/features/products/product-card';
import { getFeaturedProducts, getCategories } from '@/services/products.service';

/**
 * Home page component
 * Main landing page with hero, featured products, categories, promotions, and more
 */
export default async function HomePage() {
  // Fetch data in parallel
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  // Get new arrivals (products sorted by creation date)
  const newProducts = [...featuredProducts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  ).slice(0, 4);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="container-custom section-spacing">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                <span>AI-Powered Shopping</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Discover Products
                <br />
                <span className="gradient-text">Tailored for You</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Experience the future of online shopping with our AI-powered recommendations.
                Find exactly what you need, faster and easier than ever before.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/products">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/categories">Browse Categories</Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-square lg:aspect-auto">
              <Image
                src="https://placehold.co/800x800/1a1a2e/FFF?text=Shopping+Experience"
                alt="Shopping Experience"
                fill
                className="rounded-2xl object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/30">
        <div className="container-custom section-spacing">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center space-y-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">
                On orders over $100
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Secure Payment</h3>
              <p className="text-sm text-muted-foreground">
                100% secure transactions
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <HeadphonesIcon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">
                Dedicated customer service
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Best Quality</h3>
              <p className="text-sm text-muted-foreground">
                Premium products only
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section-spacing">
        <div className="container-custom">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <p className="mt-2 text-muted-foreground">
                Handpicked products just for you
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/products?sort=rating">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid-products">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-muted/30">
        <div className="container-custom section-spacing">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Shop by Category</h2>
            <p className="mt-2 text-muted-foreground">
              Browse our wide range of categories
            </p>
          </div>
          <div className="grid-categories">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/products?category=${category}`}
                className="group flex flex-col items-center space-y-3 rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <span className="text-2xl font-bold">
                    {category.charAt(0)}
                  </span>
                </div>
                <span className="font-medium">{category}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions/Banners Section */}
      <section className="section-spacing">
        <div className="container-custom">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Promotion Banner 1 */}
            <Link
              href="/deals"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-purple-600 p-8 text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              <div className="relative z-10 space-y-4">
                <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
                  Limited Time
                </span>
                <h3 className="text-3xl font-bold">
                  Summer Sale
                  <br />
                  Up to 50% Off
                </h3>
                <p className="text-lg opacity-90">
                  Don't miss out on amazing deals
                </p>
                <Button
                  variant="secondary"
                  className="bg-white text-primary hover:bg-white/90"
                  asChild
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="absolute right-0 top-0 h-full w-1/2 bg-white/10" />
            </Link>

            {/* Promotion Banner 2 */}
            <Link
              href="/products?category=Electronics"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 p-8 text-white transition-transform hover:scale-[1.02]"
            >
              <div className="relative z-10 space-y-4">
                <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
                  New Arrivals
                </span>
                <h3 className="text-3xl font-bold">
                  Tech Essentials
                  <br />
                  Latest Gadgets
                </h3>
                <p className="text-lg opacity-90">
                  Discover the newest electronics
                </p>
                <Button
                  variant="secondary"
                  className="bg-white text-orange-600 hover:bg-white/90"
                  asChild
                >
                  Explore
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="absolute right-0 top-0 h-full w-1/2 bg-white/10" />
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="bg-muted/30">
        <div className="container-custom section-spacing">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">New Arrivals</h2>
              <p className="mt-2 text-muted-foreground">
                Fresh products just added
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/products?sort=newest">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-spacing">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">What Our Customers Say</h2>
            <p className="mt-2 text-muted-foreground">
              Real reviews from real customers
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'Sarah Johnson',
                rating: 5,
                comment: 'Amazing shopping experience! The AI recommendations were spot on and I found exactly what I was looking for.',
                avatar: 'SJ',
              },
              {
                name: 'Michael Chen',
                rating: 5,
                comment: 'Fast shipping and excellent customer service. The product quality exceeded my expectations.',
                avatar: 'MC',
              },
              {
                name: 'Emily Davis',
                rating: 4,
                comment: 'Great selection of products and very competitive prices. Will definitely shop here again!',
                avatar: 'ED',
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-primary text-primary-foreground">
        <div className="container-custom section-spacing">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">
              Stay Updated with Our Newsletter
            </h2>
            <p className="mt-4 text-lg opacity-90">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form className="mt-8 flex flex-col gap-4 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 rounded-lg bg-white/10 px-6 py-3 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                required
              />
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
                type="submit"
              >
                Subscribe Now
              </Button>
            </form>
            <p className="mt-4 text-sm opacity-75">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
