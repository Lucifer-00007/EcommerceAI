"use client";

import Link from "next/link";
import { useState } from "react";
import { Ruler, RefreshCcw, History, Shirt } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("chart");
  const [gender, setGender] = useState("mens");

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
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                  <TabsList className="bg-secondary">
                    <TabsTrigger value="chart">Size Chart</TabsTrigger>
                    <TabsTrigger value="calculator">Calculator</TabsTrigger>
                  </TabsList>

                  {activeTab === "chart" && (
                    <Tabs value={gender} onValueChange={setGender}>
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
                    </Tabs>
                  )}
                </div>

                <TabsContent value="chart" className="mt-0">
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300" key={gender}>
                    <SizeTable />
                  </div>
                </TabsContent>
                <TabsContent value="calculator" className="mt-0">
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
  const [fitPreference, setFitPreference] = useState<"slim" | "regular" | "loose">("regular");
  const [history, setHistory] = useState<{ size: string; date: string }[]>([]);

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
      const size = match.size;
      setResult(`We recommend size ${size} (${fitPreference} fit)`);
      setHistory(prev => [{ size, date: new Date().toLocaleTimeString() }, ...prev].slice(0, 3));
    } else {
      setResult("Based on your measurements, please check our detailed fit guide or contact support.");
    }
  };

  const reset = () => {
    setChest("");
    setWaist("");
    setResult(null);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Enter your measurements in inches.</p>
        {result && (
          <Button variant="ghost" size="sm" onClick={reset} className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground">
            <RefreshCcw className="mr-1 h-3 w-3" /> Reset
          </Button>
        )}
      </div>

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="chest" className="flex items-center gap-2">
              <Shirt className="h-3.5 w-3.5 text-muted-foreground" /> Chest
            </Label>
            <div className="relative">
              <Input 
                id="chest" 
                placeholder="40" 
                value={chest} 
                onChange={(e) => setChest(e.target.value)}
                className="pl-9" 
              />
              <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">in</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="waist" className="flex items-center gap-2">
              <Ruler className="h-3.5 w-3.5 text-muted-foreground" /> Waist
            </Label>
            <div className="relative">
              <Input 
                id="waist" 
                placeholder="32" 
                value={waist} 
                onChange={(e) => setWaist(e.target.value)}
                className="pl-9"
              />
              <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">in</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Fit Preference</Label>
          <div className="grid grid-cols-3 gap-2">
            {(["slim", "regular", "loose"] as const).map((fit) => (
              <button
                key={fit}
                type="button"
                onClick={() => setFitPreference(fit)}
                className={`
                  rounded-lg border px-3 py-2 text-xs font-medium capitalize transition-all
                  ${fitPreference === fit 
                    ? "border-primary bg-primary/5 text-primary ring-1 ring-primary" 
                    : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"}
                `}
              >
                {fit}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button onClick={calculate} className="w-full h-11 text-base shadow-lg shadow-primary/20">
        Calculate My Size
      </Button>

      {result && (
        <div className="animate-in fade-in zoom-in-95 duration-300">
          <div className="rounded-xl border bg-secondary/50 p-4 text-center">
            <p className="text-sm font-medium text-foreground">{result}</p>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-2 border-t pt-4 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2 mb-3 text-xs font-medium text-muted-foreground">
            <History className="h-3.5 w-3.5" /> Recent Calculations
          </div>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="font-medium text-foreground">Size {h.size}</span>
                <span className="text-muted-foreground">{h.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

