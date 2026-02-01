import type { Product } from "@/types/ecommerce";

import { ProductCard } from "@/components/product/product-card";

export function ProductGrid({ products, hrefBase }: { products: Product[]; hrefBase?: string }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} hrefBase={hrefBase} />
      ))}
    </div>
  );
}
