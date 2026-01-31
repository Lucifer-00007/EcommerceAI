import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const testimonials = [
  {
    name: "Ava",
    title: "Founder",
    quote: "Clean UI, fast navigation, and the product pages feel production-ready.",
    verified: true,
    product: "Cloud Hoodie",
  },
  {
    name: "Noah",
    title: "Engineer",
    quote: "Typed APIs + defensive loading states make this a great starter for real commerce.",
    verified: true,
    product: "Everyday Tee",
  },
  {
    name: "Mia",
    title: "Designer",
    quote: "The dark mode tokens are solid and the layout scales beautifully.",
    verified: true,
    product: "Cloud Hoodie",
  },
];

export function TestimonialGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {testimonials.map((t) => (
        <Card key={t.name}>
          <CardContent className="space-y-3 p-6">
            <p className="text-sm text-muted-foreground">“{t.quote}”</p>
            <div className="flex flex-wrap items-center gap-2">
              {t.verified ? <Badge variant="secondary">Verified purchase</Badge> : null}
              <Badge variant="outline">Purchased {t.product}</Badge>
            </div>
            <div className="text-sm">
              <p className="font-medium">{t.name}</p>
              <p className="text-muted-foreground">{t.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
