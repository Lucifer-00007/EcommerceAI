import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { FavoriteButton } from "@/components/product/favorite-button";
import { routes } from "@/lib/routes";
import { categories } from "@/services/mock/db";
import type { Product } from "@/types/ecommerce";
import { formatPrice } from "@/utils/format";

export function ProductCard({ product }: { product: Product }) {
  const categoryName = categories.find((c) => c.id === product.categoryId)?.name ?? "Product";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary">
        <Link href={`${routes.products}/${product.slug}`} className="absolute inset-0">
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 320px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="absolute right-3 top-3">
          <FavoriteButton productId={product.id} className="translate-y-2" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-medium text-foreground">
          <Link href={`${routes.products}/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{categoryName}</p>

        <div className="mt-4 flex flex-1 items-end justify-between gap-3">
          <p className="text-lg font-bold text-foreground">
            {formatPrice(product.price.amount, product.price.currency)}
          </p>
          <div className="flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground">
            <Star className="mr-1 h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            {product.rating.toFixed(1)}
          </div>
        </div>

        <AddToCartButton
          productId={product.id}
          className="mt-4 h-10 w-full rounded-lg border border-primary bg-transparent font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
          variant="outline"
        />
      </div>
    </div>
  );
}
