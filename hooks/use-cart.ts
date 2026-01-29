/**
 * Cart Hooks
 *
 * React Query hooks for cart operations with Zustand integration.
 *
 * @module hooks/use-cart
 * @example
 * const { mutate: addToCart } = useAddToCart();
 * addToCart({ product, variant, quantity: 1 });
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { useCartStore } from "@/features/cart/store";
import type { Product, ProductVariant, Cart, CartItem } from "@/types";
import { delay } from "@/services/mock-data";
import { TAX_RATE, FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/constants";

// =============================================================================
// QUERY KEYS
// =============================================================================

/**
 * Query keys for cart-related queries
 */
export const cartKeys = {
  all: ["cart"] as const,
  detail: () => [...cartKeys.all, "detail"] as const,
  items: () => [...cartKeys.all, "items"] as const,
  item: (id: string) => [...cartKeys.items(), id] as const,
};

// =============================================================================
// TYPES
// =============================================================================

/**
 * Add to cart input
 */
interface AddToCartInput {
  /** Product to add */
  product: Product;
  /** Selected variant (if applicable) */
  variant?: ProductVariant;
  /** Quantity to add */
  quantity?: number;
}

/**
 * Update cart item input
 */
interface UpdateCartItemInput {
  /** Product ID */
  productId: string;
  /** Variant ID (if applicable) */
  variantId?: string;
  /** New quantity */
  quantity: number;
}

/**
 * Remove from cart input
 */
interface RemoveFromCartInput {
  /** Product ID to remove */
  productId: string;
  /** Variant ID (if applicable) */
  variantId?: string;
}

// =============================================================================
// CART QUERIES
// =============================================================================

/**
 * Hook to get the current cart
 *
 * Combines Zustand cart state with server sync capability.
 * Returns the cart from local state (Zustand) for immediate access.
 *
 * @param options - Additional React Query options
 * @returns Query result with cart data
 *
 * @example
 * const { data: cart, isLoading } = useCart();
 * console.log(cart.items.length);
 */
export function useCart(options?: Omit<UseQueryOptions<Cart, Error>, "queryKey" | "queryFn">) {
  const cartStore = useCartStore();

  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: async () => {
      // Simulate API delay for cart sync
      await delay(100, 200);

      // Build cart object from Zustand store
      const items = cartStore.items;

      const subtotal = cartStore.getSubtotal();
      const itemCount = cartStore.getItemCount();
      const tax = cartStore.getTax();
      const shipping = cartStore.getShipping();
      const total = cartStore.getTotal();

      return {
        items,
        subtotal,
        tax,
        shipping,
        total,
        itemCount,
        currency: "USD",
        updatedAt: new Date().toISOString(),
      } as Cart;
    },
    // Cart data is always fresh since it comes from Zustand
    staleTime: 0,
    // Don't refetch on window focus for cart
    refetchOnWindowFocus: false,
    // Initial data from Zustand store
    initialData: () => {
      const items = cartStore.items;

      const subtotal = cartStore.getSubtotal();
      const itemCount = cartStore.getItemCount();
      const tax = cartStore.getTax();
      const shipping = cartStore.getShipping();
      const total = cartStore.getTotal();

      return {
        items,
        subtotal,
        tax,
        shipping,
        total,
        itemCount,
        currency: "USD",
        updatedAt: new Date().toISOString(),
      } as Cart;
    },
    ...options,
  });
}

// =============================================================================
// CART MUTATIONS
// =============================================================================

/**
 * Hook to add an item to the cart
 *
 * @returns Mutation to add item to cart
 *
 * @example
 * const { mutate: addToCart, isPending } = useAddToCart();
 * addToCart({
 *   product: productData,
 *   variant: selectedVariant,
 *   quantity: 2
 * });
 */
export function useAddToCart() {
  const queryClient = useQueryClient();
  const cartStore = useCartStore();

  return useMutation({
    mutationFn: async (input: AddToCartInput) => {
      const { product, variant, quantity = 1 } = input;

      // Simulate API delay
      await delay(200, 400);

      // Simulate occasional stock check failure
      if (Math.random() < 0.02) {
        throw new Error("Item is out of stock");
      }

      // Add to Zustand store
      cartStore.addItem(product, variant?.id, quantity);

      return { success: true, productId: product.id };
    },
    onSuccess: () => {
      // Invalidate cart query to trigger re-fetch
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      // Open cart drawer
      cartStore.openCart();
    },
    onError: (error) => {
      console.error("Failed to add item to cart:", error);
    },
  });
}

/**
 * Hook to update a cart item quantity
 *
 * @returns Mutation to update cart item
 *
 * @example
 * const { mutate: updateCartItem } = useUpdateCartItem();
 * updateCartItem({ productId: "prod_123", variantId: "var_456", quantity: 3 });
 */
export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const cartStore = useCartStore();

  return useMutation({
    mutationFn: async (input: UpdateCartItemInput) => {
      const { productId, variantId, quantity } = input;

      await delay(150, 300);

      if (quantity < 1) {
        throw new Error("Quantity must be at least 1");
      }

      cartStore.updateQuantity(productId, quantity, variantId);

      return { success: true, productId, quantity };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });
}

/**
 * Hook to remove an item from the cart
 *
 * @returns Mutation to remove item from cart
 *
 * @example
 * const { mutate: removeFromCart } = useRemoveFromCart();
 * removeFromCart({ productId: "prod_123", variantId: "var_456" });
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  const cartStore = useCartStore();

  return useMutation({
    mutationFn: async (input: RemoveFromCartInput) => {
      const { productId, variantId } = input;

      await delay(150, 300);

      cartStore.removeItem(productId, variantId);

      return { success: true, productId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });
}

/**
 * Hook to clear the entire cart
 *
 * @returns Mutation to clear cart
 *
 * @example
 * const { mutate: clearCart } = useClearCart();
 * clearCart();
 */
export function useClearCart() {
  const queryClient = useQueryClient();
  const cartStore = useCartStore();

  return useMutation({
    mutationFn: async () => {
      await delay(200, 400);

      cartStore.clearCart();

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });
}

// =============================================================================
// CART ACTIONS
// =============================================================================

/**
 * Hook to toggle cart drawer visibility
 *
 * @returns Object with toggle, open, and close functions
 *
 * @example
 * const { toggleCart, openCart, closeCart } = useCartDrawer();
 */
export function useCartDrawer() {
  const cartStore = useCartStore();

  return {
    isOpen: cartStore.isOpen,
    toggleCart: cartStore.toggleCart,
    openCart: cartStore.openCart,
    closeCart: cartStore.closeCart,
  };
}

/**
 * Hook to get cart totals
 *
 * @returns Object with cart totals
 *
 * @example
 * const { itemCount, totalPrice, isEmpty } = useCartTotals();
 */
export function useCartTotals() {
  const cartStore = useCartStore();

  return {
    itemCount: cartStore.getItemCount(),
    totalPrice: cartStore.getTotal(),
    subtotal: cartStore.getSubtotal(),
    tax: cartStore.getTax(),
    shipping: cartStore.getShipping(),
    isEmpty: cartStore.items.length === 0,
    items: cartStore.items,
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export type { AddToCartInput, UpdateCartItemInput, RemoveFromCartInput };
