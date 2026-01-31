"use client";

import type { ComponentProps } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/store";

export function AddToCartButton({
  productId,
  quantity = 1,
  label = "Add to cart",
  className,
  variant,
  size,
}: {
  productId: string;
  quantity?: number;
  label?: string;
  className?: string;
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
}) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={() => {
        addItem(productId, quantity);
        toast.success("Added to cart");
      }}
    >
      {label}
    </Button>
  );
}
