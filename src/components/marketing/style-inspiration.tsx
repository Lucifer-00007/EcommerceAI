import type { Product } from "@/types/ecommerce";

import Link from "next/link";

import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { getClothImages } from "@/features/clothes/images";

export function StyleInspiration({ products }: { products: Product[] }) {
  const apparel = products.filter((p) => p.categoryId === "cat_apparel");
  const picks = apparel.slice(0, 2);
  const hero = apparel[0];
  const heroImages = hero ? getClothImages(hero) : [];
  const tileImages = heroImages.length ? heroImages : [{ src: "/products/category-apparel.svg", alt: "Lookbook" }];

  return (
    <section className="bg-card py-16">
      <div className="mx-auto w-full max-w-[1440px] px-6">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Style Inspiration</h2>
            <p className="mt-2 text-muted-foreground">Outfit ideas, curated with matching pieces.</p>
          </div>
          <Button asChild variant="outline" className="h-10 rounded-lg bg-background px-4 font-semibold">
            <Link href={routes.clothes}>Browse outfits</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
              <ImageWithFallback
                src={tileImages[0]?.src ?? "/products/category-apparel.svg"}
                alt={tileImages[0]?.alt ?? "Style inspiration"}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/80">Lookbook</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-white">Weekend Layers</p>
                <p className="mt-2 max-w-md text-sm text-white/80">
                  Pair cozy layers with essentials for an effortless off-duty fit.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border bg-background p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground">Outfit Recommendations</h3>
              <p className="mt-1 text-sm text-muted-foreground">Shop the pieces featured in this look.</p>
              <div className="mt-6 space-y-3">
                {picks.map((p) => (
                  <Link
                    key={p.id}
                    href={`${routes.clothes}/${p.slug}`}
                    className="flex items-center gap-4 rounded-xl border bg-card p-3 transition-colors hover:bg-secondary"
                  >
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-secondary">
                      <ImageWithFallback
                        src={getClothImages(p)[0]?.src ?? p.images[0].src}
                        alt={getClothImages(p)[0]?.alt ?? p.images[0].alt}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">Tap to view details</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[tileImages[1], tileImages[2]].map((img, idx) => (
                <div key={idx} className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
                  <ImageWithFallback
                    src={img?.src ?? tileImages[0]?.src ?? "/products/category-apparel.svg"}
                    alt={img?.alt ?? "Inspiration photo"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 320px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

