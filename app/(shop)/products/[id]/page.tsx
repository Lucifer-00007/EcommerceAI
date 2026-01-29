/**
 * Product Detail Page
 * 
 * Displays detailed information about a single product.
 * Features: Image gallery, price, description, add to cart, reviews.
 * 
 * This is a Server Component that receives the product ID from the URL.
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

/**
 * Product Page Props
 */
interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Generate Metadata for Product Page
 */
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  
  // In a real app, fetch product data to generate metadata
  return {
    title: `Product ${id}`,
    description: "Product details page",
  };
}

/**
 * Product Detail Page Component
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  // Validate ID format
  if (!id || isNaN(Number(id))) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumbs - Placeholder */}
      <nav className="mb-6 text-sm text-muted-foreground">
        Home / Products / Product {id}
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery - Placeholder */}
        <div className="aspect-square rounded-lg bg-muted">
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Product Image {id}
          </div>
        </div>

        {/* Product Info - Placeholder */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Product Title {id}
            </h1>
            <p className="mt-2 text-2xl font-semibold">$99.99</p>
          </div>

          <p className="text-muted-foreground">
            Product description will appear here...
          </p>

          {/* Add to Cart - Placeholder */}
          <div className="flex gap-4">
            <Button size="lg" className="flex-1">
              Add to Cart
            </Button>
            <Button size="lg" variant="outline">
              Add to Wishlist
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews Section - Placeholder */}
      <section className="mt-16 border-t pt-16">
        <h2 className="mb-8 text-2xl font-bold">Customer Reviews</h2>
        <p className="text-muted-foreground">Reviews will appear here...</p>
      </section>
    </div>
  );
}
