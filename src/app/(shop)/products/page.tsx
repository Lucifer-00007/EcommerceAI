/**
 * Products Listing Page
 * 
 * Displays a grid of products with filtering, sorting, and pagination.
 * 
 * Server Component by default - data fetching happens server-side.
 */

import { Metadata } from "next";
import { APP_CONFIG } from "@/lib/constants";

/**
 * Products Page Metadata
 */
export const metadata: Metadata = {
  title: "Products",
  description: `Browse our collection of quality products at ${APP_CONFIG.name}.`,
};

/**
 * Products Page Component
 */
export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
        <p className="mt-2 text-muted-foreground">
          Discover our curated collection of quality items
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Filters Sidebar - Placeholder */}
        <aside className="w-full lg:w-64">
          <div className="rounded-lg border bg-card p-4">
            <h2 className="mb-4 font-semibold">Filters</h2>
            <p className="text-sm text-muted-foreground">
              Filter options will appear here...
            </p>
          </div>
        </aside>

        {/* Products Grid - Placeholder */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing all products
            </p>
            <div className="text-sm text-muted-foreground">
              Sort: Featured
            </div>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <p className="col-span-full py-12 text-center text-muted-foreground">
              Products will be displayed here...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
