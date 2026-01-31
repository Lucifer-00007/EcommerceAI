"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const storageKey = "ecommerceai:favorites";

function readFavorites() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return new Set<string>();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set<string>();
    return new Set(parsed.filter((v) => typeof v === "string"));
  } catch {
    return new Set<string>();
  }
}

function writeFavorites(favs: Set<string>) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(Array.from(favs)));
  } catch {}
}

export function FavoriteButton({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(readFavorites().has(productId));
  }, [productId]);

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
      onClick={() => {
        const favs = readFavorites();
        const next = new Set(favs);
        if (next.has(productId)) {
          next.delete(productId);
          setActive(false);
          toast.success("Removed from favorites");
        } else {
          next.add(productId);
          setActive(true);
          toast.success("Added to favorites");
        }
        writeFavorites(next);
      }}
    >
      <Heart className={cn("h-5 w-5", active ? "fill-red-500 text-red-500" : "")} />
    </Button>
  );
}

