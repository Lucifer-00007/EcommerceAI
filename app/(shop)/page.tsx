/**
 * Home Page
 * 
 * The landing page of the eCommerce application.
 * Features: Hero section, featured products, categories, promotions.
 * 
 * This is a Server Component by default for optimal performance.
 */

import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/lib/constants";

/**
 * Home Page Metadata
 * SEO configuration for the landing page
 */
export const metadata = {
  title: APP_CONFIG.name,
  description: APP_CONFIG.description,
  openGraph: {
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
    type: "website",
  },
};

/**
 * Home Page Component
 */
export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-muted py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Welcome to {APP_CONFIG.name}
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              {APP_CONFIG.description}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <a href="/products">Shop Now</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/categories">Browse Categories</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section - Placeholder */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">
            Featured Products
          </h2>
          <p className="text-center text-muted-foreground">
            Products will be displayed here...
          </p>
        </div>
      </section>

      {/* Categories Section - Placeholder */}
      <section className="border-t bg-muted py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">
            Shop by Category
          </h2>
          <p className="text-center text-muted-foreground">
            Categories will be displayed here...
          </p>
        </div>
      </section>
    </div>
  );
}
