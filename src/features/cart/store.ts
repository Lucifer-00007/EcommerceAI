"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartLine = {
  productId: string;
  quantity: number;
};

type CartState = {
  items: CartLine[];
  hydrated: boolean;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

function storage() {
  if (typeof window === "undefined") return undefined;
  return createJSONStorage(() => window.localStorage);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,
      addItem: (productId, quantity = 1) => {
        const safeQty = Math.max(1, Math.floor(quantity));
        const existing = get().items.find((i) => i.productId === productId);
        if (!existing) {
          set({ items: [...get().items, { productId, quantity: safeQty }] });
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: i.quantity + safeQty }
              : i,
          ),
        });
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },
      setQuantity: (productId, quantity) => {
        const safeQty = Math.max(1, Math.floor(quantity));
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity: safeQty } : i,
          ),
        });
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: "cart-v1",
      storage: storage(),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    },
  ),
);

