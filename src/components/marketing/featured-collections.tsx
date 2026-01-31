"use client";

import type { Product } from "@/types/ecommerce";

import Link from "next/link";
import { useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Reveal } from "@/components/common/reveal";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Experiment } from "@/components/common/experiment";
import { routes } from "@/lib/routes";
import { deriveClothType } from "@/features/clothes/utils";

type Collection = {
  key: string;
  title: string;
  description: string;
  productFilter: (p: Product) => boolean;
};

function scrollBy(container: HTMLDivElement | null, direction: -1 | 1) {
  if (!container) return;
  const amount = Math.floor(container.clientWidth * 0.9) * direction;
  container.scrollBy({ left: amount, behavior: "smooth" });
}

export function FeaturedCollections({ products }: { products: Product[] }) {
  const apparel = useMemo(() => products.filter((p) => p.categoryId === "cat_apparel"), [products]);

  const collections: Collection[] = useMemo(
    () => [
      {
        key: "essentials",
        title: "Everyday Essentials",
        description: "Staples designed for comfort, fit, and repeat wear.",
        productFilter: (p) => deriveClothType(p) === "T-Shirts",
      },
      {
        key: "layers",
        title: "Cozy Layers",
        description: "Soft layers built for cool mornings and late nights.",
        productFilter: (p) => deriveClothType(p) === "Hoodies",
      },
      {
        key: "outerwear",
        title: "Outerwear Edit",
        description: "Performance-driven pieces with a clean silhouette.",
        productFilter: (p) => deriveClothType(p) === "Jackets",
      },
    ],
    [],
  );

  return (
    <section className="bg-background py-16">
      <div className="mx-auto w-full max-w-[1440px] px-6">
        <Reveal>
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Featured Collections</h2>
              <p className="mt-2 text-muted-foreground">Curated edits to help you shop faster.</p>
            </div>
            <Button asChild variant="outline" className="h-10 rounded-lg bg-card px-4 font-semibold">
              <Link href={routes.clothes}>Shop all clothes</Link>
            </Button>
          </div>
        </Reveal>

        <Experiment experimentKey="collections_layout">
          {(variant) => (
            <div className="space-y-14">
              {collections.map((c) => (
                <CollectionRow key={c.key} collection={c} products={apparel} variant={variant} />
              ))}
            </div>
          )}
        </Experiment>
      </div>
    </section>
  );
}

function CollectionRow({
  collection,
  products,
  variant,
}: {
  collection: Collection;
  products: Product[];
  variant: "A" | "B";
}) {
  const list = useMemo(() => products.filter(collection.productFilter).slice(0, 8), [collection, products]);
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <Reveal>
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-foreground">{collection.title}</h3>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{collection.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-lg bg-card"
              aria-label="Scroll left"
              onClick={() => scrollBy(ref.current, -1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-lg bg-card"
              aria-label="Scroll right"
              onClick={() => scrollBy(ref.current, 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {variant === "A" ? (
          <div
            ref={ref}
            className="mt-6 grid auto-cols-[minmax(240px,1fr)] grid-flow-col gap-6 overflow-x-auto pb-2"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {list.map((p) => (
              <div key={p.id} style={{ scrollSnapAlign: "start" }}>
                <ProductCard product={p} hrefBase={routes.clothes} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {list.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} hrefBase={routes.clothes} />
            ))}
          </div>
        )}
      </div>
    </Reveal>
  );
}

