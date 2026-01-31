import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Armchair, Boxes, Laptop, Shirt, ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";

import { Container } from "@/components/layout/container";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { categories } from "@/services/mock/db";
import { getCatalogProducts } from "@/services/admin/catalog-store";

export default function Home() {
  const products = getCatalogProducts();
  const featured = products.filter((p) => p.featured);
  const heroProduct = featured[0] ?? products[0];

  const iconByCategorySlug: Record<string, ReactNode> = {
    apparel: <Shirt className="h-5 w-5" />,
    electronics: <Laptop className="h-5 w-5" />,
    home: <Armchair className="h-5 w-5" />,
    accessories: <Boxes className="h-5 w-5" />,
  };

  return (
    <div>
      <section className="relative overflow-hidden bg-card">
        <Container className="py-12 lg:py-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
            <div className="flex max-w-2xl flex-col gap-6">
              <div className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/15">
                New Arrivals
              </div>
              <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-6xl lg:text-5xl xl:text-6xl">
                Summer Collection <span className="text-primary">2024</span>
              </h1>
              <p className="text-lg leading-8 text-muted-foreground">
                Minimalist styles for the modern home. Discover our latest arrivals designed for
                comfort, elegance, and everyday living.
              </p>
              <div className="mt-2 flex items-center gap-4">
                <Button asChild className="h-12 rounded-lg px-8 text-sm font-semibold">
                  <Link href={routes.products}>Explore Collection</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="h-12 rounded-lg px-6 text-sm font-semibold text-foreground hover:bg-secondary"
                >
                  <Link href={routes.about}>
                    Watch Video <PlayCircle className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative lg:col-span-1">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-secondary shadow-xl lg:aspect-square">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent mix-blend-multiply" />
                {heroProduct ? (
                  <Image
                    src={heroProduct.images[0].src}
                    alt={heroProduct.images[0].alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : null}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y bg-card py-12">
        <Container>
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Browse by Category</h2>
            <Link href={routes.products} className="flex items-center gap-1 text-sm font-semibold text-primary hover:opacity-90">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`${routes.products}?category=${encodeURIComponent(category.slug)}`}
                className="group flex flex-col items-center justify-center gap-3 rounded-xl border bg-secondary p-6 transition-all duration-300 hover:border-primary/50 hover:bg-primary/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm transition-transform group-hover:scale-110 group-hover:text-primary">
                  {iconByCategorySlug[category.slug] ?? <Boxes className="h-5 w-5" />}
                </div>
                <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-background py-16">
        <Container>
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Trending Now</h2>
              <p className="mt-2 text-muted-foreground">Handpicked items popular this week.</p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-lg bg-card text-muted-foreground"
                aria-label="Previous"
                disabled
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-lg bg-card text-muted-foreground"
                aria-label="Next"
                disabled
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="space-y-12">
            <ProductGrid products={(featured.length ? featured : products).slice(0, 4)} />
            <div className="flex justify-center">
              <Button asChild variant="outline" className="h-12 rounded-lg bg-card px-6 text-sm font-semibold text-foreground">
                <Link href={routes.products}>Load More Products</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-primary/5 py-16">
        <Container className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Subscribe to our newsletter
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Get the latest updates on new products and upcoming sales.
          </p>
          <div className="mt-8">
            <NewsletterForm />
          </div>
        </Container>
      </section>
    </div>
  );
}
