"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/common/reveal";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

const articles = [
  {
    id: 1,
    title: "The Art of Layering",
    excerpt: "Master the season's transition with lightweight knits and versatile outerwear.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800",
    href: "/blog/art-of-layering",
    date: "May 15, 2024",
  },
  {
    id: 2,
    title: "Sustainable Fabrics 101",
    excerpt: "Understanding the materials that make your clothes last longer and feel better.",
    image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1bbc?auto=format&fit=crop&q=80&w=800",
    href: "/blog/sustainable-fabrics",
    date: "May 12, 2024",
  },
  {
    id: 3,
    title: "Summer Color Trends",
    excerpt: "From earth tones to bold pops of color, see what's trending this season.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800",
    href: "/blog/summer-trends",
    date: "May 08, 2024",
  },
];

export function TrendingNews() {
  return (
    <section className="bg-background py-16">
      <Container>
        <Reveal>
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Trending News</h2>
              <p className="mt-2 text-muted-foreground">The latest trends, tips, and stories.</p>
            </div>
            <div className="flex gap-2">
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-lg bg-card text-muted-foreground" disabled>
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-lg bg-card text-muted-foreground">
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {articles.map((article, i) => (
            <Reveal key={article.id} style={{ transitionDelay: `${i * 100}ms` }}>
              <Link href={article.href} className="group flex flex-col gap-4">
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-secondary">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">{article.date}</div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary group-hover:underline">
                    {article.title}
                  </h3>
                  <p className="line-clamp-2 text-muted-foreground">{article.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
