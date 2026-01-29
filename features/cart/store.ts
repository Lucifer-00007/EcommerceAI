/**
 * Cart Store
 *
 * Production-ready Zustand store for managing shopping cart state.
 * Includes persistence to localStorage, computed selectors, and toast notifications.
 *
 * Features:
 * - Add/remove/update items with quantity bounds (1-10)
 * - Prevent duplicate items (updates quantity instead)
 * - Calculate subtotal, tax, shipping, and total
 * - localStorage persistence with SSR-safe checks
 * - Toast notifications on add/remove
 * - Cart drawer state management
 *
 * @module features/cart/store
 * @example
 * ```typescript
 * const { items, addItem, getTotal } = useCartStore();
 * const subtotal = useCartStore(state => state.getSubtotal());
 * ```
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import type { CartItem, Product, ProductVariant } from "@/types";
import {
  CART_STORAGE_KEY,
  MAX_CART_QUANTITY,
  MIN_CART_QUANTITY,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_COST,
  TAX_RATE,
} from "@/lib/constants";

// =============================================================================
// STORE STATE INTERFACE
// =============================================================================

/**
 * Cart store state and actions interface
 */
export interface CartStore {
  /** Cart items array */
  items: CartItem[];

  /** Whether cart drawer is open */
  isOpen: boolean;

  /** Loading state for async operations */
  isLoading: boolean;

  /** Error message if any operation failed */
  error: string | null;

  // ---------------------------------------------------------------------------
  // Computed Selectors
  // ---------------------------------------------------------------------------

  /**
   * Calculate subtotal (sum of all items price × quantity)
   * @returns Subtotal amount
   */
  getSubtotal: () => number;

  /**
   * Calculate tax (8% of subtotal)
   * @returns Tax amount
   */
  getTax: () => number;

  /**
   * Calculate shipping (free over $50, else $5.99)
   * @returns Shipping cost
   */
  getShipping: () => number;

  /**
   * Calculate total (subtotal + tax + shipping)
   * @returns Total amount
   */
  getTotal: () => number;

  /**
   * Get total item count (sum of all quantities)
   * @returns Total number of items
   */
  getItemCount: () => number;

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  /**
   * Add item to cart
   * If item already exists, updates quantity (max 10 per item)
   * @param product - Product to add
   * @param variantId - Optional variant ID
   * @param quantity - Quantity to add (default: 1)
   */
  addItem: (
    product: Product,
    variantId?: string,
    quantity?: number
  ) => void;

  /**
   * Update item quantity
   * Quantity is clamped between 1-10
   * @param productId - Product ID
   * @param quantity - New quantity
   * @param variantId - Optional variant ID
   */
  updateQuantity: (
    productId: string,
    quantity: number,
    variantId?: string
  ) => void;

  /**
   * Remove item from cart
   * @param productId - Product ID to remove
   * @param variantId - Optional variant ID
   */
  removeItem: (productId: string, variantId?: string) => void;

  /**
   * Clear all items from cart
   */
  clearCart: () => void;

  /**
   * Set cart drawer open state
   * @param open - Whether drawer should be open
   */
  setIsOpen: (open: boolean) => void;

  /**
   * Toggle cart drawer state
   */
  toggleCart: () => void;

  /**
   * Open cart drawer
   */
  openCart: () => void;

  /**
   * Close cart drawer
   */
  closeCart: () => void;

  /**
   * Hydrate cart from storage (called after mount)
   */
  hydrateFromStorage: () => void;

  /**
   * Clear any error message
   */
  clearError: () => void;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Find item index in cart
 */
const findItemIndex = (
  items: CartItem[],
  productId: string,
  variantId?: string
): number => {
  return items.findIndex((item) =>
    variantId
      ? item.productId === productId && item.variantId === variantId
      : item.productId === productId && !item.variantId
  );
};

/**
 * Find variant by ID from product variants
 */
const findVariant = (
  product: Product,
  variantId: string
): ProductVariant | undefined => {
  return product.variants?.find((v) => v.id === variantId);
};

// =============================================================================
// STORE CREATION
// =============================================================================

/**
 * Cart store hook with persistence
 *
 * @example
 * ```typescript
 * // Get all state
 * const cart = useCartStore();
 *
 * // Get specific selectors (performance optimized)
 * const itemCount = useCartStore(state => state.getItemCount());
 * const total = useCartStore(state => state.getTotal());
 *
 * // Use actions
 * const { addItem, removeItem } = useCartStore();
 * ```
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // -------------------------------------------------------------------------
      // Initial State
      // -------------------------------------------------------------------------
      items: [] as CartItem[],
      isOpen: false,
      isLoading: false,
      error: null,

      // -------------------------------------------------------------------------
      // Computed Selectors
      // -------------------------------------------------------------------------

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.variant?.price ?? item.product.price;
          return total + price * item.quantity;
        }, 0);
      },

      getTax: () => {
        const subtotal = get().getSubtotal();
        return Math.round(subtotal * TAX_RATE * 100) / 100;
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
      },

      getTotal: () => {
        return (
          get().getSubtotal() + get().getTax() + get().getShipping()
        );
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // -------------------------------------------------------------------------
      // Actions
      // -------------------------------------------------------------------------

      addItem: (product, variantId, quantity = 1) => {
        const items = get().items;
        const existingIndex = findItemIndex(items, product.id, variantId);

        // Validate quantity bounds
        const qtyToAdd = Math.max(MIN_CART_QUANTITY, Math.min(quantity, MAX_CART_QUANTITY));

        if (existingIndex >= 0) {
          // Item exists - update quantity
          const existingItem = items[existingIndex];
          const newQuantity = Math.min(
            existingItem.quantity + qtyToAdd,
            MAX_CART_QUANTITY
          );

          if (newQuantity === existingItem.quantity) {
            toast.error(`Maximum ${MAX_CART_QUANTITY} items allowed per product`);
            return;
          }

          const updatedItems = [...items];
          updatedItems[existingIndex] = {
            ...existingItem,
            quantity: newQuantity,
          };

          set({ items: updatedItems });

          const variant = variantId
            ? findVariant(product, variantId)
            : undefined;
          toast.success(
            `Updated ${product.name}${variant ? ` (${variant.name})` : ""} quantity to ${newQuantity}`
          );
        } else {
          // Add new item
          const variant = variantId
            ? findVariant(product, variantId)
            : undefined;

          const newItem: CartItem = {
            productId: product.id,
            variantId,
            quantity: qtyToAdd,
            product,
            variant,
            addedAt: new Date().toISOString(),
          };

          set({ items: [...items, newItem] });

          toast.success(
            `Added ${product.name}${variant ? ` (${variant.name})` : ""} to cart`
          );
        }

        // Open cart drawer on add
        set({ isOpen: true });
      },

      updateQuantity: (productId, quantity, variantId) => {
        const items = get().items;
        const index = findItemIndex(items, productId, variantId);

        if (index < 0) {
          set({ error: "Item not found in cart" });
          return;
        }

        // Clamp quantity to valid range
        const clampedQuantity = Math.max(
          MIN_CART_QUANTITY,
          Math.min(quantity, MAX_CART_QUANTITY)
        );

        if (quantity < MIN_CART_QUANTITY) {
          // Remove item if quantity below minimum
          get().removeItem(productId, variantId);
          return;
        }

        const updatedItems = [...items];
        updatedItems[index] = {
          ...items[index],
          quantity: clampedQuantity,
        };

        set({ items: updatedItems, error: null });
      },

      removeItem: (productId, variantId) => {
        const items = get().items;
        const index = findItemIndex(items, productId, variantId);

        if (index < 0) return;

        const item = items[index];
        const variantName = item.variant?.name;

        const updatedItems = items.filter((_, i) => i !== index);
        set({ items: updatedItems });

        toast.success(
          `Removed ${item.product.name}${variantName ? ` (${variantName})` : ""} from cart`
        );
      },

      clearCart: () => {
        set({ items: [] as CartItem[] });
        toast.success("Cart cleared");
      },

      setIsOpen: (open) => {
        set({ isOpen: open });
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      hydrateFromStorage: () => {
        // This is handled by Zustand's persist middleware automatically
        // We provide this action for explicit hydration control if needed
        set({ isLoading: false });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: CART_STORAGE_KEY,
      // SSR-safe storage - only use localStorage on client
      storage: createJSONStorage(() => localStorage),
      // Only persist cart items, not UI state
      partialize: (state) => ({
        items: state.items,
      }),
      // SSR-safe: skip hydration on server
      skipHydration: true,
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error("Failed to rehydrate cart:", error);
          }
        };
      },
    }
  )
);

// =============================================================================
// SELECTOR HOOKS (for optimized re-renders)
// =============================================================================

/**
 * Hook to get cart items count (optimized selector)
 * @returns Total number of items in cart
 */
export const useCartItemCount = () =>
  useCartStore((state) => state.getItemCount());

/**
 * Hook to get cart total (optimized selector)
 * @returns Total price including tax and shipping
 */
export const useCartTotal = () => useCartStore((state) => state.getTotal());

/**
 * Hook to get cart subtotal (optimized selector)
 * @returns Subtotal before tax and shipping
 */
export const useCartSubtotal = () =>
  useCartStore((state) => state.getSubtotal());

/**
 * Hook to check if cart is empty (optimized selector)
 * @returns True if cart has no items
 */
export const useIsCartEmpty = () =>
  useCartStore((state) => state.items.length === 0);

// Default export for convenience
export default useCartStore;
