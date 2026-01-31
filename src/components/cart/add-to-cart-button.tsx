"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/store";

export function AddToCartButton({
  productId,
  quantity = 1,
  label = "Add to cart",
}: {
  productId: string;
  quantity?: number;
  label?: string;
}) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <Button
      type="button"
      onClick={() => {
        addItem(productId, quantity);
        toast.success("Added to cart");
      }}
    >
      {label}
    </Button>
  );
}

