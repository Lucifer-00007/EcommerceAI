import Image from "next/image";
import Link from "next/link";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { RatingStars } from "@/components/product/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { routes } from "@/lib/routes";
import type { Product } from "@/types/ecommerce";
import { formatPrice } from "@/utils/format";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <Link href={`${routes.products}/${product.slug}`} className="block">
          <div className="relative aspect-square bg-muted">
            <Image
              src={product.images[0].src}
              alt={product.images[0].alt}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`${routes.products}/${product.slug}`}
            className="line-clamp-2 font-medium hover:underline"
          >
            {product.name}
          </Link>
          {product.featured ? <Badge variant="secondary">Featured</Badge> : null}
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            {formatPrice(product.price.amount, product.price.currency)}
          </p>
          <RatingStars rating={product.rating} />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <AddToCartButton productId={product.id} />
      </CardFooter>
    </Card>
  );
}

