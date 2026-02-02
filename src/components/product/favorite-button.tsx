"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/features/favorites/store";

export function FavoriteButton({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const items = useFavoritesStore((s) => s.items);
  const toggleItem = useFavoritesStore((s) => s.toggleItem);
  
  const active = items.includes(productId);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "rounded-full bg-card/90 text-muted-foreground shadow-sm opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
        className,
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(productId);
        if (active) {
          toast.success("Removed from favorites");
        } else {
          toast.success("Added to favorites");
        }
      }}
    >
      <Heart className={cn("h-5 w-5", active ? "fill-red-500 text-red-500" : "")} />
    </Button>
  );
}
