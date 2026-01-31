import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/common/empty-state";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import { TestimonialGrid } from "@/components/marketing/testimonial-grid";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { routes } from "@/lib/routes";
import { categories } from "@/services/mock/db";
import { getCatalogProducts } from "@/services/admin/catalog-store";

export default function Home() {
  const featured = getCatalogProducts()
    .filter((p) => p.featured)
    .slice(0, 6);

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
        <section className="rounded-2xl border bg-card p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Trusted by teams building quickly</p>
              <p className="text-lg font-semibold tracking-tight">Design tokens • Typed APIs • Fast UX</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground sm:grid-cols-4">
              <div className="rounded-lg bg-muted px-3 py-2 text-center">Acme</div>
              <div className="rounded-lg bg-muted px-3 py-2 text-center">Northwind</div>
              <div className="rounded-lg bg-muted px-3 py-2 text-center">Umbrella</div>
              <div className="rounded-lg bg-muted px-3 py-2 text-center">Globex</div>
            </div>
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

      <Container>
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight">What customers say</h2>
            <p className="text-sm text-muted-foreground">A few highlights from early users.</p>
          </div>
          <TestimonialGrid />
        </section>
      </Container>

      <Container>
        <section className="rounded-2xl border bg-card p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-tight">Get product drops and updates</h2>
              <p className="text-sm text-muted-foreground">
                Join the newsletter. No spam, unsubscribe anytime.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </section>
      </Container>

      <Container>
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight">Frequently asked</h2>
            <p className="text-sm text-muted-foreground">Quick answers before you checkout.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="space-y-2 p-6">
                <p className="font-medium">Do you support refunds?</p>
                <p className="text-sm text-muted-foreground">
                  This demo includes policy pages and a contact form for support workflows.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 p-6">
                <p className="font-medium">How is shipping calculated?</p>
                <p className="text-sm text-muted-foreground">
                  Shipping is mocked at checkout, but the UI is structured for real integrations.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 p-6">
                <p className="font-medium">Can I manage products?</p>
                <p className="text-sm text-muted-foreground">
                  An admin console provides product CRUD and basic site settings.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </Container>

      <Container>
        <section className="rounded-2xl border bg-card p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 md:items-center">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-tight">Ready to explore?</h2>
              <p className="text-sm text-muted-foreground">
                Browse products, add to cart, and walk through checkout in minutes.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <Button asChild>
                <Link href={routes.products}>Shop now</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href={routes.contact}>Contact</Link>
              </Button>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
