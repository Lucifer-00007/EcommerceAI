"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type FavoritesState = {
  items: string[];
  hydrated: boolean;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  clear: () => void;
};

function storage() {
  if (typeof window === "undefined") return undefined;
  return createJSONStorage(() => window.localStorage);
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,
      addItem: (productId) => {
        const items = get().items;
        if (!items.includes(productId)) {
          set({ items: [...items, productId] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((id) => id !== productId) });
      },
      toggleItem: (productId) => {
        const items = get().items;
        if (items.includes(productId)) {
          set({ items: items.filter((id) => id !== productId) });
        } else {
          set({ items: [...items, productId] });
        }
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: "favorites-v1",
      storage: storage(),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    },
  ),
);
