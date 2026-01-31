import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, Boxes, Footprints, Shirt, Star } from "lucide-react";

import { Container } from "@/components/layout/container";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import { Reveal } from "@/components/common/reveal";
import { StyleInspiration } from "@/components/marketing/style-inspiration";
import { TestimonialGrid } from "@/components/marketing/testimonial-grid";
import { TrendingSocial } from "@/components/marketing/trending-social";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { getCatalogProducts } from "@/services/admin/catalog-store";

const FeaturedCollections = dynamic(
  () => import("@/components/marketing/featured-collections").then((m) => m.FeaturedCollections),
  { loading: () => <div className="h-48 rounded-2xl bg-muted" /> },
);

const SizeGuideSection = dynamic(
  () => import("@/components/marketing/size-guide-section").then((m) => m.SizeGuideSection),
  { loading: () => <div className="mx-auto w-full max-w-[1440px] px-6 py-16"><div className="h-64 rounded-2xl bg-muted" /></div> },
);

export default function Home() {
  const products = getCatalogProducts();
  const featured = products.filter((p) => p.featured);
  const heroProduct = featured.find(p => p.name.includes("Tee")) ?? products[0];

  const categories = [
    { id: "apparel", name: "Apparel", icon: <Shirt className="h-6 w-6" />, href: `${routes.products}?category=cat_apparel` },
    { id: "accessories", name: "Accessories", icon: <Boxes className="h-6 w-6" />, href: `${routes.products}?category=cat_accessories` },
    { id: "shoes", name: "Shoes", icon: <Footprints className="h-6 w-6" />, href: `${routes.products}?category=cat_shoes` },
    { id: "bestsellers", name: "Best Sellers", icon: <Star className="h-6 w-6" />, href: `${routes.products}?sort=rating` },
  ];

  return (
    <div>
      <section className="relative overflow-hidden bg-card">
        <Container className="py-12 lg:py-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
            <div className="flex max-w-2xl flex-col gap-6">
              <div className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/15">
                New Arrivals
              </div>
              <h1 className="text-5xl font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Summer Collection <br /><span className="text-primary">2024</span>
              </h1>
              <p className="text-lg leading-8 text-muted-foreground max-w-md">
                All-weather materials that endure. Discover our latest items included designed for comfort, elegance, and everyday living.
              </p>
              <div className="mt-2 flex items-center gap-4">
                <Button asChild className="h-12 rounded-full px-8 text-sm font-bold shadow-lg shadow-primary/20">
                  <Link href={routes.products}>Explore Collection</Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  className="h-12 rounded-full px-6 text-sm font-bold text-secondary-foreground border border-transparent hover:border-primary/20 transition-all"
                >
                  <Link href={routes.clothes}>
                    What&apos;s new <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative lg:col-span-1 lg:translate-x-12">
              <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:mx-0 overflow-hidden rounded-3xl bg-[#111] shadow-2xl ring-1 ring-white/10 lg:aspect-square">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                {heroProduct ? (
                  <>
                    <Image
                      src={heroProduct.images[0].src}
                      alt={heroProduct.images[0].alt}
                      fill
                      className="object-contain p-12"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                    <div className="absolute bottom-8 left-0 right-0 z-20 text-center">
                       <h3 className="text-2xl font-bold text-white">{heroProduct.name}</h3>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 bg-background">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Browse by Category</h2>
            <Link
              href={routes.products}
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 md:gap-8 justify-between lg:justify-start">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.href}
                className="group flex flex-1 min-w-[140px] flex-col items-center justify-center gap-4 rounded-xl border bg-card p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-md"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  {category.icon}
                </div>
                <span className="font-semibold text-foreground group-hover:text-primary">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <FeaturedCollections products={products} />

      <StyleInspiration products={products} />

      <TrendingSocial products={products} />

      <section className="bg-card py-20 border-t">
        <Container>
          <Reveal className="mb-12">
             <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">What Customers Say</h2>
             <p className="text-muted-foreground">Feedback from verified purchasers.</p>
          </Reveal>
          <TestimonialGrid />
        </Container>
      </section>

      <SizeGuideSection />

      <section className="bg-primary/5 py-24">
        <Container className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Get style drops and early access
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Join the list for new arrivals, exclusive collections, and limited-time offers.
          </p>
          <div className="mt-10">
            <NewsletterForm />
          </div>
        </Container>
      </section>
    </div>
  );
}
