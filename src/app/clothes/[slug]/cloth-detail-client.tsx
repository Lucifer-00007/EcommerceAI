"use client";

import type { Product } from "@/types/ecommerce";

import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useMemo, useState, useSyncExternalStore } from "react";
import { ChevronDown, Minus, Plus, Search, ShoppingBag, Star } from "lucide-react";
import { toast } from "sonner";

import { FavoriteButton } from "@/components/product/favorite-button";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { routes } from "@/lib/routes";
import { useCartStore } from "@/features/cart/store";
import { getClothImages } from "@/features/clothes/images";
import { formatPrice } from "@/utils/format";
import {
  clothColors,
  clothSizes,
  deriveClothType,
  getAvailableColors,
  getAvailableSizes,
} from "@/features/clothes/utils";
import {
  decrementInventory,
  getInventoryCount,
  subscribeInventory,
  type ClothVariantKey,
} from "@/features/clothes/inventory";

export function ClothDetailClient({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const addItem = useCartStore((s) => s.addItem);

  const gallery = useMemo(() => getClothImages(product), [product]);

  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoomed, setZoomed] = useState(false);

  const availableSizes = useMemo(() => getAvailableSizes(product), [product]);
  const availableColors = useMemo(() => getAvailableColors(product), [product]);

  const initialColor = useMemo<(typeof clothColors)[number]["key"] | null>(() => {
    const first = clothColors.find((c) => availableColors.has(c.key));
    return first?.key ?? null;
  }, [availableColors]);

  const initialSize = useMemo<(typeof clothSizes)[number] | null>(() => {
    if (!initialColor) return "M";
    const preferred = clothSizes.find(
      (s) => availableSizes.has(s) && getInventoryCount({ productId: product.id, size: s, color: initialColor }) > 0,
    );
    return preferred ?? "M";
  }, [availableSizes, initialColor, product.id]);

  const [color, setColor] = useState<(typeof clothColors)[number]["key"] | null>(() => initialColor);
  const [size, setSize] = useState<(typeof clothSizes)[number] | null>(() => initialSize);

  const clothType = deriveClothType(product);
  const selectedVariant = useMemo<ClothVariantKey | null>(() => {
    if (!size || !color) return null;
    return { productId: product.id, size, color };
  }, [color, product.id, size]);

  const selectedVariantKey = useMemo(() => {
    if (!selectedVariant) return null;
    return `${selectedVariant.productId}:${selectedVariant.size}:${selectedVariant.color}`;
  }, [selectedVariant]);

  const inventoryCount = useSyncExternalStore(
    (onStoreChange) => {
      if (!selectedVariantKey) return () => {};
      return subscribeInventory((u) => {
        if (u.key === selectedVariantKey) onStoreChange();
      });
    },
    () => (selectedVariant ? getInventoryCount(selectedVariant) : null),
    () => null,
  );

  const isInStock = inventoryCount !== null && inventoryCount > 0;
  const isLowStock = inventoryCount !== null && inventoryCount > 0 && inventoryCount <= 3;

  const canAdd = Boolean(
    selectedVariant &&
      availableSizes.has(selectedVariant.size) &&
      availableColors.has(selectedVariant.color) &&
      isInStock &&
      quantity <= (inventoryCount ?? 0),
  );

  return (
    <div className="w-full">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <Link href={routes.home} className="font-medium hover:text-foreground">
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-muted-foreground/60">/</span>
              <Link href={routes.clothes} className="font-medium hover:text-foreground">
                Clothes
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-muted-foreground/60">/</span>
              <span className="font-medium text-foreground">{clothType}</span>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="mx-2 text-muted-foreground/60">/</span>
              <span className="line-clamp-1 font-medium text-foreground">{product.name}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-8 pb-16 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-4 lg:col-span-7">
          <Dialog>
            <DialogTrigger asChild>
              <div className="group relative aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-xl bg-secondary">
                <ImageWithFallback
                  src={gallery[imageIndex]?.src ?? product.images[0].src}
                  alt={gallery[imageIndex]?.alt ?? product.images[0].alt}
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                {product.featured ? (
                  <div className="absolute left-4 top-4">
                    <span className="inline-flex items-center rounded-md bg-card/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm ring-1 ring-inset ring-border">
                      New Arrival
                    </span>
                  </div>
                ) : null}
                <div className="absolute right-4 top-4 rounded-md bg-card/90 p-2 text-muted-foreground shadow-sm ring-1 ring-inset ring-border">
                  <Search className="h-4 w-4" />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{product.name}</DialogTitle>
              </DialogHeader>
              <button
                type="button"
                className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                onClick={() => setZoomed((z) => !z)}
                aria-label={zoomed ? "Zoom out" : "Zoom in"}
              >
                <ImageWithFallback
                  src={gallery[imageIndex]?.src ?? product.images[0].src}
                  alt={gallery[imageIndex]?.alt ?? product.images[0].alt}
                  fill
                  className={
                    zoomed
                      ? "object-contain scale-150 transition-transform duration-300"
                      : "object-contain transition-transform duration-300"
                  }
                  sizes="(max-width: 1024px) 100vw, 900px"
                />
              </button>
            </DialogContent>
          </Dialog>

          <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible">
            {gallery.map((img, idx) => {
              const active = idx === imageIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageIndex(idx)}
                  className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-lg bg-secondary ring-offset-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary md:w-auto"
                  style={{
                    boxShadow: active ? "0 0 0 2px var(--color-primary)" : undefined,
                  }}
                  aria-label={`View image ${idx + 1}`}
                >
                  <ImageWithFallback
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="space-y-8 lg:sticky lg:top-24">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span className="text-foreground">{product.rating.toFixed(1)}</span>
                  <span>({product.reviewCount} reviews)</span>
                </div>
              </div>
              <div className="flex items-end justify-between gap-4">
                <p className="text-3xl font-bold text-foreground">
                  {formatPrice(product.price.amount, product.price.currency)}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <Label className="text-sm font-medium text-foreground">Color</Label>
                </div>
                <div className="flex gap-3">
                  {clothColors.map((c) => {
                    const disabled = !availableColors.has(c.key);
                    const active = color === c.key;
                    return (
                      <button
                        key={c.key}
                        type="button"
                        aria-label={`Select ${c.name}`}
                        disabled={disabled}
                        className="h-10 w-10 rounded-full ring-offset-2 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-40"
                        style={{
                          backgroundColor: c.value,
                          boxShadow: active ? "0 0 0 2px var(--color-primary)" : undefined,
                        }}
                        onClick={() => {
                          setColor(c.key);
                          if (!size) return;
                          if (!availableSizes.has(size)) return;
                          const keep = getInventoryCount({ productId: product.id, size, color: c.key }) > 0;
                          if (keep) return;
                          const next = clothSizes.find(
                            (s) =>
                              availableSizes.has(s) &&
                              getInventoryCount({ productId: product.id, size: s, color: c.key }) > 0,
                          );
                          if (next) setSize(next);
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <div className="mb-3 flex items-center justify-between">
                  <Label className="text-sm font-medium text-foreground">Size</Label>
                  <Link href={routes.faq} className="text-sm text-primary hover:underline">
                    Size Guide
                  </Link>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {clothSizes.map((s) => {
                    const variantCount =
                      color && availableColors.has(color)
                        ? getInventoryCount({ productId: product.id, size: s, color })
                        : null;
                    const disabled = !availableSizes.has(s) || (typeof variantCount === "number" && variantCount <= 0);
                    const active = size === s;
                    return (
                      <Button
                        key={s}
                        type="button"
                        variant={active ? "default" : "outline"}
                        className="h-10 rounded-md border-border bg-card text-sm font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={disabled}
                        onClick={() => setSize(s)}
                        aria-pressed={active}
                      >
                        {s}
                      </Button>
                    );
                  })}
                </div>
                <div role="status" className="text-sm font-medium text-muted-foreground" aria-live="polite">
                  {selectedVariant ? (
                    inventoryCount === null ? null : isInStock ? (
                      isLowStock ? (
                        <span className="text-foreground">Low stock: {inventoryCount} left</span>
                      ) : (
                        <span className="text-foreground">In stock</span>
                      )
                    ) : (
                      <span className="text-destructive">Out of stock</span>
                    )
                  ) : (
                    <span>Select color and size</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <div className="flex h-12 w-32 items-center rounded-lg border bg-card">
                <button
                  type="button"
                  className="flex h-full w-10 items-center justify-center rounded-l-lg text-muted-foreground hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  readOnly
                  value={quantity}
                  className="h-full w-full border-none bg-transparent p-0 text-center font-medium text-foreground focus:ring-0"
                  aria-label="Quantity"
                />
                <button
                  type="button"
                  className="flex h-full w-10 items-center justify-center rounded-r-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                  onClick={() =>
                    setQuantity((q) => {
                      if (inventoryCount === null) return q + 1;
                      return Math.min(q + 1, Math.max(1, inventoryCount));
                    })
                  }
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button
                type="button"
                className="h-12 flex-1 rounded-lg font-semibold"
                disabled={!canAdd}
                onClick={() => {
                  if (!selectedVariant) {
                    toast.error("Select color and size");
                    return;
                  }
                  const current = getInventoryCount(selectedVariant);
                  if (current <= 0) {
                    toast.error("This variant is out of stock");
                    return;
                  }
                  if (quantity > current) {
                    toast.error(`Only ${current} left in stock`);
                    return;
                  }
                  addItem(product.id, quantity);
                  decrementInventory(selectedVariant, quantity);
                  toast.success("Added to cart");
                }}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>

              <div className="h-12 w-12">
                <FavoriteButton productId={product.id} className="h-12 w-12 rounded-lg border border-border bg-card opacity-100 shadow-none hover:bg-secondary" />
              </div>
            </div>

            <div className="border-t pt-2">
              <details className="group cursor-pointer border-b py-4">
                <summary className="flex items-center justify-between font-medium text-foreground hover:text-primary">
                  <span>Description</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                  <p>{product.description}</p>
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Breathable fabric</li>
                    <li>Modern fit</li>
                    <li>Everyday comfort</li>
                  </ul>
                </div>
              </details>
              <details className="group cursor-pointer border-b py-4">
                <summary className="flex items-center justify-between font-medium text-foreground hover:text-primary">
                  <span>Fabric &amp; Care</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    Machine wash cold on gentle cycle. Tumble dry low. Do not bleach. Designed for
                    daily wear and easy care.
                  </p>
                </div>
              </details>
              <details className="group cursor-pointer py-4">
                <summary className="flex items-center justify-between font-medium text-foreground hover:text-primary">
                  <span>Shipping &amp; Returns</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    Free shipping on qualifying orders. Returns accepted within 30 days of purchase.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>

      {related.length ? (
        <div className="border-t py-12">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">You might also like</h2>
              <p className="mt-2 text-sm text-muted-foreground">Similar pieces picked for you.</p>
            </div>
            <Button asChild variant="outline" className="rounded-lg bg-card">
              <Link href={routes.clothes}>View all</Link>
            </Button>
          </div>
          <ProductGrid products={related} hrefBase={routes.clothes} />
        </div>
      ) : null}
    </div>
  );
}
