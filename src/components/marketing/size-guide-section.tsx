"use client";

import Link from "next/link";

import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { routes } from "@/lib/routes";

const rows = [
  { size: "XS", chest: "32–34", waist: "26–28" },
  { size: "S", chest: "35–37", waist: "29–31" },
  { size: "M", chest: "38–40", waist: "32–34" },
  { size: "L", chest: "41–43", waist: "35–37" },
  { size: "XL", chest: "44–46", waist: "38–40" },
];

export function SizeGuideSection() {
  return (
    <section className="bg-background py-16">
      <div className="mx-auto w-full max-w-[1440px] px-6">
        <Reveal>
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Find Your Size</h2>
              <p className="mt-2 text-muted-foreground">Quick guide to help you choose confidently.</p>
            </div>
            <Button asChild variant="outline" className="h-10 rounded-lg bg-card px-4 font-semibold">
              <Link href={routes.clothes}>Shop with confidence</Link>
            </Button>
          </div>
        </Reveal>

        <Reveal>
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <Tabs defaultValue="mens">
              <TabsList className="bg-secondary">
                <TabsTrigger value="mens">Men’s</TabsTrigger>
                <TabsTrigger value="womens">Women’s</TabsTrigger>
              </TabsList>
              <TabsContent value="mens" className="pt-6">
                <SizeTable />
              </TabsContent>
              <TabsContent value="womens" className="pt-6">
                <SizeTable />
              </TabsContent>
            </Tabs>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SizeTable() {
  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="grid grid-cols-3 bg-secondary px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <div>Size</div>
        <div>Chest (in)</div>
        <div>Waist (in)</div>
      </div>
      {rows.map((r) => (
        <div key={r.size} className="grid grid-cols-3 px-4 py-3 text-sm text-foreground odd:bg-card even:bg-background">
          <div className="font-semibold">{r.size}</div>
          <div className="text-muted-foreground">{r.chest}</div>
          <div className="text-muted-foreground">{r.waist}</div>
        </div>
      ))}
    </div>
  );
}

