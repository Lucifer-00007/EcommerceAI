import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product-card";
import { ArrowRight, Truck, Shield, Headphones, RefreshCw, Sparkles, Zap, TrendingUp } from "lucide-react";

export default function Home() {
  const { data: featuredProducts, isLoading: loadingFeatured } = useQuery({
    queryKey: ["/api/products/featured"],
  });

  const { data: dealsProducts, isLoading: loadingDeals } = useQuery({
    queryKey: ["/api/products/deals"],
  });

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    retry: false,
  });

  const { data: history } = useQuery({
    queryKey: ["/api/history"],
    enabled: !!user,
  });

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 py-24 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              <Sparkles className="h-3 w-3 mr-1" />
              New Season Collection
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover Quality
              <span className="gradient-text block">Products You'll Love</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
              Shop the latest trends with unbeatable prices, fast delivery, and a seamless shopping experience.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/products">
                <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 border-0 shadow-lg shadow-primary/25 text-base px-8" data-testid="button-shop-now">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="text-base px-8" data-testid="button-become-seller">
                  Become a Seller
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
              { icon: Shield, title: "Secure Payment", desc: "100% protected" },
              { icon: Headphones, title: "24/7 Support", desc: "Dedicated help" },
              { icon: RefreshCw, title: "Easy Returns", desc: "30 day policy" },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold">Shop by Category</h2>
              <p className="text-muted-foreground mt-1">Find exactly what you're looking for</p>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {loadingCategories ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl" />
              ))
            ) : (
              categories?.map((category: any) => (
                <Link
                  key={category.id}
                  href={`/products?category=${encodeURIComponent(category.name)}`}
                >
                  <Card className="group card-hover cursor-pointer overflow-hidden border-0 shadow-sm" data-testid={`card-category-${category.slug}`}>
                    <CardContent className="p-0">
                      <div className="aspect-square relative">
                        <img
                          src={category.image || "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&q=80"}
                          alt={category.name}
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-white font-semibold text-lg">{category.name}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {dealsProducts && dealsProducts.length > 0 && (
        <section className="py-20 bg-gradient-to-r from-red-500/5 via-orange-500/5 to-yellow-500/5">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-red-500 to-orange-500">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Hot Deals</h2>
                  <p className="text-muted-foreground">Limited time offers - Don't miss out!</p>
                </div>
              </div>
              <Link href="/products?sort=price_asc">
                <Button variant="outline" className="border-red-500/30 text-red-600 hover:bg-red-500/10">
                  View All Deals
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {loadingDeals
                ? Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-80 rounded-2xl" />
                  ))
                : dealsProducts?.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-primary to-purple-600">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Featured Products</h2>
                <p className="text-muted-foreground">Top picks from our collection</p>
              </div>
            </div>
            <Link href="/products?sort=rating_desc">
              <Button variant="ghost" className="group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loadingFeatured
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-80 rounded-2xl" />
                ))
              : featuredProducts?.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {user && history && history.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold">Recently Viewed</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {history.slice(0, 6).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto text-lg">
            Subscribe to get special offers, free giveaways, and exclusive updates.
          </p>
          <form className="flex gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 rounded-xl text-foreground bg-background shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
              data-testid="input-newsletter-email"
            />
            <Button variant="secondary" size="lg" className="px-6 shadow-lg" data-testid="button-newsletter-subscribe">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
