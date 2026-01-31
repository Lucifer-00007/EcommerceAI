"use client";

import { useQuery } from "@tanstack/react-query";

import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { EmptyState } from "@/components/common/empty-state";
import { RatingStars } from "@/components/product/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProductDetail } from "@/features/products/api";
import { formatPrice } from "@/utils/format";

export function ProductDetailClient({ slug }: { slug: string }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductDetail(slug),
  });

  if (isLoading) {
    return (
      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square rounded-xl bg-muted" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 rounded bg-muted" />
          <div className="h-4 w-1/3 rounded bg-muted" />
          <div className="h-10 w-40 rounded bg-muted" />
          <div className="h-24 w-full rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (isError) {
    return <EmptyState title="Failed to load product" description={String((error as Error)?.message ?? "")} />;
  }

  if (!data) {
    return <EmptyState title="Product not found" description="This product may have been removed." />;
  }

  const { product, reviews } = data;

  return (
    <div className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-square bg-muted">
              <ImageWithFallback
                src={product.images[0].src}
                alt={product.images[0].alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
            {product.featured ? <Badge variant="secondary">Featured</Badge> : null}
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-lg font-medium">
              {formatPrice(product.price.amount, product.price.currency)}
            </p>
            <div className="flex items-center gap-2">
              <RatingStars rating={product.rating} />
              <p className="text-sm text-muted-foreground">({product.reviewCount})</p>
            </div>
          </div>

          <Separator />

          <p className="text-muted-foreground">{product.description}</p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <AddToCartButton productId={product.id} label="Add to cart" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-3">
          <Card>
            <CardContent className="space-y-2 p-6">
              <p className="font-medium">What you get</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li>Modern, responsive layout</li>
                <li>Accessible interactions</li>
                <li>Typed data contracts</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews" className="space-y-3">
          {reviews.length ? (
            <div className="space-y-3">
              {reviews.map((r) => (
                <Card key={r.id}>
                  <CardContent className="space-y-2 p-6">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-medium">{r.title}</p>
                      <RatingStars rating={r.rating} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {r.authorName} • {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm">{r.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState title="No reviews yet" description="Be the first to review this product." />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

