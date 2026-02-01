"use client";

import Link from "next/link";
import { useState } from "react";
import { Ruler } from "lucide-react";

import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { routes } from "@/lib/routes";

const rows = [
  { size: "XS", chestMin: 32, chestMax: 34, waistMin: 26, waistMax: 28 },
  { size: "S", chestMin: 35, chestMax: 37, waistMin: 29, waistMax: 31 },
  { size: "M", chestMin: 38, chestMax: 40, waistMin: 32, waistMax: 34 },
  { size: "L", chestMin: 41, chestMax: 43, waistMin: 35, waistMax: 37 },
  { size: "XL", chestMin: 44, chestMax: 46, waistMin: 38, waistMax: 40 },
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
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <Tabs defaultValue="chart">
                <TabsList className="bg-secondary">
                  <TabsTrigger value="chart">Size Chart</TabsTrigger>
                  <TabsTrigger value="calculator">Calculator</TabsTrigger>
                </TabsList>
                <TabsContent value="chart" className="pt-6">
                  <Tabs defaultValue="mens">
                    <div className="flex justify-center mb-6">
                      <TabsList className="bg-secondary/50 p-1 rounded-lg inline-flex">
                        <TabsTrigger 
                          value="mens" 
                          className="rounded-md px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground hover:text-foreground"
                        >
                          Men’s
                        </TabsTrigger>
                        <TabsTrigger 
                          value="womens" 
                          className="rounded-md px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground hover:text-foreground"
                        >
                          Women’s
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    <TabsContent value="mens" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <SizeTable />
                    </TabsContent>
                    <TabsContent value="womens" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <SizeTable />
                    </TabsContent>
                  </Tabs>
                </TabsContent>
                <TabsContent value="calculator" className="pt-6">
                  <SizeCalculator />
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex flex-col justify-center rounded-2xl border bg-card p-6 shadow-sm">
               <div className="flex items-center gap-2 mb-6 text-primary">
                 <Ruler className="h-5 w-5" />
                 <h3 className="font-semibold text-lg">How to Measure</h3>
               </div>
               <div className="space-y-4">
                 {[
                   { id: 1, title: "Chest", desc: "Measure around the fullest part of your chest, keeping the tape horizontal." },
                   { id: 2, title: "Waist", desc: "Measure around the narrowest part (typically where your body bends side to side)." },
                   { id: 3, title: "Hips", desc: "Measure around the fullest part of your hips." },
                 ].map((step) => (
                   <div key={step.id} className="group flex gap-4 rounded-xl border bg-secondary/20 p-4 transition-colors hover:border-primary/20 hover:bg-secondary/40">
                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                       {step.id}
                     </div>
                     <div>
                       <h4 className="font-medium text-foreground">{step.title}</h4>
                       <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
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
          <div className="text-muted-foreground">{r.chestMin}–{r.chestMax}</div>
          <div className="text-muted-foreground">{r.waistMin}–{r.waistMax}</div>
        </div>
      ))}
    </div>
  );
}

function SizeCalculator() {
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const c = parseFloat(chest);
    const w = parseFloat(waist);
    if (isNaN(c) || isNaN(w)) {
      setResult("Please enter valid numbers.");
      return;
    }

    const match = rows.find(r => 
      (c >= r.chestMin && c <= r.chestMax) || 
      (w >= r.waistMin && w <= r.waistMax)
    );

    if (match) {
      setResult(`We recommend size ${match.size}`);
    } else {
      setResult("Based on your measurements, please check our detailed fit guide or contact support.");
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Enter your measurements in inches to get a recommendation.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="chest">Chest (in)</Label>
          <Input id="chest" placeholder="e.g. 40" value={chest} onChange={(e) => setChest(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="waist">Waist (in)</Label>
          <Input id="waist" placeholder="e.g. 32" value={waist} onChange={(e) => setWaist(e.target.value)} />
        </div>
      </div>
      <Button onClick={calculate} className="w-full">Calculate My Size</Button>
      {result && (
        <div className="rounded-lg bg-secondary p-4 text-center text-sm font-medium animate-in fade-in slide-in-from-top-2">
          {result}
        </div>
      )}
    </div>
  );
}

