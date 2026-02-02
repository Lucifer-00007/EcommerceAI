"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MessageCircle, Search, ThumbsUp, ThumbsDown, Share2, Facebook, Twitter, Linkedin, Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { routes } from "@/lib/routes";

const faqs = [
  {
    category: "General",
    items: [
      {
        id: "real-store",
        q: "Is this a real store?",
        a: "No, this is a high-fidelity demo storefront designed to showcase modern e-commerce architecture, accessible UI patterns, and production-grade code practices using Next.js 14.",
      },
      {
        id: "technologies",
        q: "What technologies are used?",
        a: "The stack includes Next.js (App Router), TypeScript, Tailwind CSS, Radix UI, React Hook Form, Zod, and TanStack Query.",
      },
      {
        id: "mobile-app",
        q: "Is there a mobile app?",
        a: "Currently, we operate as a responsive web application that works seamlessly on mobile devices. A native app is on our roadmap.",
      },
    ],
  },
  {
    category: "Payment & Shipping",
    items: [
      {
        id: "international-shipping",
        q: "Do you support international shipping?",
        a: "Since this is a demo, we don't ship physical products. However, the address form supports international formats and validation.",
      },
      {
        id: "payment-gateway",
        q: "Can I add a real payment gateway?",
        a: "Yes. The codebase is structured for real integrations. The admin console includes a payments settings page suitable for wiring to Stripe, PayPal, or Lemon Squeezy.",
      },
      {
        id: "refund-policy",
        q: "What is the refund policy?",
        a: "For a demo store, transactions are simulated. In a real deployment, refunds would be processed through the connected payment provider dashboard.",
      },
    ],
  },
  {
    category: "Account",
    items: [
      {
        id: "dark-mode",
        q: "Do you support dark mode?",
        a: "Absolutely. We use a token-based design system that supports system, light, and dark modes seamlessly.",
      },
      {
        id: "reset-password",
        q: "How do I reset my password?",
        a: "In this demo environment, authentication is simplified. You can create a new account or use the pre-configured demo credentials.",
      },
      {
        id: "delete-account",
        q: "Can I delete my account?",
        a: "Yes, you can request account deletion from your profile settings. All personal data will be permanently removed.",
      },
    ],
  },
  {
    category: "Technical",
    items: [
      {
        id: "api-access",
        q: "Is there an API available?",
        a: "Yes, the platform exposes RESTful API endpoints for products, orders, and customer management, fully typed and documented.",
      },
      {
        id: "performance",
        q: "How is performance optimized?",
        a: "We utilize Next.js server components, image optimization, code splitting, and edge caching to ensure sub-second load times.",
      },
    ],
  },
];

export function FaqClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [helpfulFeedback, setHelpfulFeedback] = useState<Record<string, boolean | undefined>>({});

  const categories = ["All", ...faqs.map((f) => f.category)];

  const filteredFaqs = useMemo(() => {
    return faqs
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          const matchesSearch =
            item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.a.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesCategory = activeCategory === "All" || section.category === activeCategory;
          return matchesSearch && matchesCategory;
        }),
      }))
      .filter((section) => section.items.length > 0);
  }, [searchQuery, activeCategory]);

  const handleFeedback = (id: string, isHelpful: boolean) => {
    setHelpfulFeedback((prev) => ({ ...prev, [id]: isHelpful }));
    toast.success("Thanks for your feedback!");
  };

  const handleShare = (q: string, a: string) => {
    if (navigator.share) {
      navigator.share({
        title: q,
        text: a,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${q}\n\n${a}\n\n${window.location.href}`);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Search and Filter Section */}
      <div className="space-y-6">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for answers..."
            className="h-12 w-full rounded-full border-muted-foreground/20 bg-background pl-12 shadow-sm transition-all focus-visible:ring-primary text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search FAQs"
          />
        </div>

        <ScrollArea className="w-full whitespace-nowrap pb-2">
          <div className="flex w-full justify-center space-x-2 px-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className="rounded-full px-6 transition-all hover:scale-105"
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>

      {/* FAQ Content */}
      <div className="mx-auto w-full max-w-3xl space-y-12 min-h-[400px]">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((category) => (
            <div key={category.category} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                {category.category}
                <Badge variant="secondary" className="text-xs font-normal">
                  {category.items.length}
                </Badge>
              </h2>
              <Accordion type="single" className="w-full space-y-4">
                {category.items.map((item) => (
                  <AccordionItem 
                    key={item.id} 
                    value={item.id} 
                    className="border rounded-xl px-6 bg-card transition-all hover:border-primary/50 data-[state=open]:border-primary data-[state=open]:shadow-md"
                  >
                    <AccordionTrigger className="text-left text-base font-medium py-6 hover:no-underline hover:text-primary">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6 space-y-4">
                      <p className="leading-relaxed">{item.a}</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t mt-4">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground mr-2">Was this helpful?</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 w-8 p-0 rounded-full ${helpfulFeedback[item.id] === true ? "text-green-600 bg-green-50" : ""}`}
                            onClick={() => handleFeedback(item.id, true)}
                            aria-label="Mark as helpful"
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 w-8 p-0 rounded-full ${helpfulFeedback[item.id] === false ? "text-red-600 bg-red-50" : ""}`}
                            onClick={() => handleFeedback(item.id, false)}
                            aria-label="Mark as not helpful"
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 gap-2 text-xs text-muted-foreground">
                              <Share2 className="h-3.5 w-3.5" />
                              Share
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleShare(item.q, item.a)}>
                              <Copy className="mr-2 h-4 w-4" /> Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(item.q)}`, '_blank')}>
                              <Twitter className="mr-2 h-4 w-4" /> Twitter
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}>
                              <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}>
                              <Facebook className="mr-2 h-4 w-4" /> Facebook
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))
        ) : (
          <div className="text-center py-20 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No results found</h3>
            <p className="text-muted-foreground">
              We couldn&apos;t find any answers matching &quot;{searchQuery}&quot;. 
              <br />Try adjusting your search or browse categories.
            </p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </div>
        )}
      </div>

      {/* Contact Support Section */}
      <Card className="mt-12 border-none shadow-lg bg-gradient-to-br from-primary/5 to-secondary/10 overflow-hidden">
        <CardContent className="p-8 md:p-12 text-center space-y-6 relative">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4 animate-bounce">
            <MessageCircle className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2 relative z-10">
            <h3 className="text-2xl font-bold">Still have questions?</h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Can&apos;t find the answer you&apos;re looking for? Our friendly team is here to help you with any questions or concerns.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2 relative z-10">
            <Button asChild size="lg" className="rounded-full px-8 shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
              <Link href={routes.contact}>Contact Support</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-background">
              <Link href="/about">About Us</Link>
            </Button>
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        </CardContent>
      </Card>
    </div>
  );
}
