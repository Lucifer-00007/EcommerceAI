import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/common/empty-state";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { routes } from "@/lib/routes";
import { categories, products } from "@/services/mock/db";

export default function Home() {
  const featured = products.filter((p) => p.featured).slice(0, 6);

  return (
    <div className="space-y-14 py-10">
      <Container>
        <section className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Modern essentials for everyday life
            </h1>
            <p className="text-muted-foreground">
              A production-ready storefront frontend built with Next.js App Router, Tailwind, and
              shadcn/ui.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href={routes.products}>Shop products</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href={routes.cart}>View cart</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {featured.slice(0, 4).map((p) => (
              <Card key={p.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <Link href={`${routes.products}/${p.slug}`} className="block">
                    <div className="relative aspect-square bg-muted">
                      <Image
                        src={p.images[0].src}
                        alt={p.images[0].alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </Container>

      <Container>
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-semibold tracking-tight">Featured products</h2>
            <Button asChild variant="ghost">
              <Link href={routes.products}>Browse all</Link>
            </Button>
          </div>
          {featured.length ? (
            <ProductGrid products={featured} />
          ) : (
            <EmptyState title="No featured products" description="Try again later." />
          )}
        </section>
      </Container>

      <Container>
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Categories</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Card key={category.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <Link
                    href={`${routes.products}?category=${encodeURIComponent(category.slug)}`}
                    className="block"
                  >
                    <div className="relative aspect-[4/3] bg-muted">
                      <Image
                        src={category.imageSrc}
                        alt={category.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    </div>
                    <div className="p-4">
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-muted-foreground">Shop now</p>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </Container>

      <Container>
        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="space-y-2 p-6">
              <p className="font-medium">Fast shipping</p>
              <p className="text-sm text-muted-foreground">Mocked checkout flow with validation.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2 p-6">
              <p className="font-medium">Secure UX</p>
              <p className="text-sm text-muted-foreground">Defensive UI states and typed API.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2 p-6">
              <p className="font-medium">Accessible components</p>
              <p className="text-sm text-muted-foreground">Keyboard-friendly, WCAG-aligned UI.</p>
            </CardContent>
          </Card>
        </section>
      </Container>
    </div>
  );
}
