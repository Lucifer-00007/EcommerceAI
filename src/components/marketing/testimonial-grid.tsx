import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Ava",
    title: "Founder",
    quote: "Clean UI, fast navigation, and the product pages feel production-ready.",
  },
  {
    name: "Noah",
    title: "Engineer",
    quote: "Typed APIs + defensive loading states make this a great starter for real commerce.",
  },
  {
    name: "Mia",
    title: "Designer",
    quote: "The dark mode tokens are solid and the layout scales beautifully.",
  },
];

export function TestimonialGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {testimonials.map((t) => (
        <Card key={t.name}>
          <CardContent className="space-y-3 p-6">
            <p className="text-sm text-muted-foreground">“{t.quote}”</p>
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

