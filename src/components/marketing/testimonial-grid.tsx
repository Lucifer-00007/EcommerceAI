import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

const testimonials = [
  {
    name: "Ava",
    title: "Founder",
    quote: "Clean UI, fast navigation, and the product pages feel production-ready. The attention to detail is impressive.",
    verified: true,
    product: "Cloud Hoodie",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
  },
  {
    name: "Noah",
    title: "Engineer",
    quote: "Typed APIs + defensive loading states make this a great starter for real commerce. Highly recommended.",
    verified: true,
    product: "Everyday Tee",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150",
  },
  {
    name: "Mia",
    title: "Designer",
    quote: "The dark mode tokens are solid and the layout scales beautifully across all my devices.",
    verified: true,
    product: "Cloud Hoodie",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150",
  },
];

export function TestimonialGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {testimonials.map((t) => (
        <Card key={t.name} className="h-full border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-md">
          <CardContent className="flex h-full flex-col justify-between gap-6 p-6">
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-primary">
                 {[1, 2, 3, 4, 5].map((i) => (
                   <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                     <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                   </svg>
                 ))}
               </div>
               <p className="text-base leading-relaxed text-muted-foreground">“{t.quote}”</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {t.verified ? (
                  <Badge variant="secondary" className="gap-1 bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 hover:bg-green-500/20">
                    <CheckCircle2 className="h-3 w-3" /> Verified Purchase
                  </Badge>
                ) : null}
                <Badge variant="outline" className="text-xs text-muted-foreground">{t.product}</Badge>
              </div>
              
              <div className="flex items-center gap-4 border-t pt-4">
                <Avatar>
                  <AvatarImage src={t.image} alt={t.name} />
                  <AvatarFallback>{t.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.title}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
