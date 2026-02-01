import Link from "next/link";
import { Star } from "lucide-react";

import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { FavoriteButton } from "@/components/product/favorite-button";
import { getClothImages } from "@/features/clothes/images";
import { routes } from "@/lib/routes";
import { categories } from "@/services/mock/db";
import type { Product } from "@/types/ecommerce";
import { formatPrice } from "@/utils/format";

export function ProductCard({ product, hrefBase }: { product: Product; hrefBase?: string }) {
  const categoryName = categories.find((c) => c.id === product.categoryId)?.name ?? "Product";
  const base = hrefBase ?? routes.products;
  const primaryImage =
    product.categoryId === "cat_apparel" ? getClothImages(product)[0] ?? product.images[0] : product.images[0];

  return (
    <div className="group relative flex flex-col rounded-xl border bg-card p-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-secondary">
        <Link href={`${base}/${product.slug}`} className="absolute inset-0">
          <ImageWithFallback
            src={primaryImage?.src ?? product.images[0].src}
            alt={primaryImage?.alt ?? product.images[0].alt}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 320px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="absolute right-3 top-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <FavoriteButton productId={product.id} className="h-9 w-9 rounded-full bg-white/90 shadow-sm hover:bg-white" />
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-medium text-foreground">
              <Link href={`${base}/${product.slug}`} className="hover:underline">
                {product.name}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{categoryName}</p>
          </div>
          <div className="flex items-center rounded-full bg-secondary/50 px-2 py-1 text-xs font-medium">
            <Star className="mr-1 h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            {product.rating.toFixed(1)}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-bold text-foreground">
            {formatPrice(product.price.amount, product.price.currency)}
          </p>
        </div>

        <div className="mt-4 h-10">
           <AddToCartButton
            productId={product.id}
            className="h-full w-full rounded-full border-primary bg-background font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground opacity-0 group-hover:opacity-100 duration-300"
            variant="outline"
          />
        </div>
      </div>
    </div>
  );
}
