'use client';

// Cart hooks
// Custom hooks for managing cart state and operations

import { useCartStore } from '@/features/cart/store';

/**
 * Hook to access cart state and operations
 * @returns Cart store with state and actions
 */
export function useCart() {
  const cart = useCartStore();

  const isInCart = (productId: string) => {
    return cart.items.some((item) => item.productId === productId);
  };

  return {
    ...cart,
    isInCart,
  };
}

/**
 * Hook to get total number of items in cart
 * @returns Total number of items in cart
 */
export function useCartTotalItems() {
  const items = useCartStore((state) => state.items);
  
  return items.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Hook to get cart total price
 * @returns Total price of all items in cart
 */
export function useCartTotal() {
  const items = useCartStore((state) => state.items);
  
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}
