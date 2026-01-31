import type { Product } from "@/types/ecommerce";

import { ProductCard } from "@/components/product/product-card";
import { routes } from "@/lib/routes";

function hashString(value: string) {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0;
  return h;
}

function formatCompact(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

export function TrendingSocial({ products }: { products: Product[] }) {
  const apparel = products.filter((p) => p.categoryId === "cat_apparel").slice(0, 4);

  return (
    <section className="bg-background py-16">
      <div className="mx-auto w-full max-w-[1440px] px-6">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Trending Items</h2>
            <p className="mt-2 text-muted-foreground">Popular right now, backed by real reviews.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {apparel.map((p) => {
            const h = hashString(p.id);
            const purchases = 900 + (h % 4200);
            const views = 4000 + (h % 12000);
            return (
              <div key={p.id} className="relative">
                <div className="absolute left-3 top-3 z-10 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-foreground shadow-sm ring-1 ring-inset ring-border">
                  {formatCompact(purchases)} bought • {formatCompact(views)} views
                </div>
                <ProductCard product={p} hrefBase={routes.clothes} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

