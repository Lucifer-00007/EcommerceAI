import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  const safe = Number.isFinite(rating) ? Math.max(0, Math.min(5, rating)) : 0;
  const fullStars = Math.round(safe);

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      aria-label={`Rated ${safe.toFixed(1)} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < fullStars;
        return (
          <Star
            key={index}
            className={cn("h-4 w-4", filled ? "fill-primary text-primary" : "text-muted-foreground")}
          />
        );
      })}
    </div>
  );
}

