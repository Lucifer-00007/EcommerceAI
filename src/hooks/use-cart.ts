// use-cart hook
// Custom hook for cart-related operations

import { useCallback, useMemo } from 'react';
import { useCartStore, cartSelectors } from '@/features/cart/store';
import type { CartItem } from '@/types/cart.types';

/**
 * Custom hook for cart operations
 * Provides convenient access to cart state and actions
 *
 * @returns Cart state and actions
 *
 * @example
 * ```tsx
 * const { items, totalItems, totalPrice, addItem, removeItem } = useCart();
 * ```
 */
export const useCart = () => {
  const store = useCartStore();

  /**
   * Add an item to the cart
   * @param product - The product to add
   * @param quantity - The quantity to add (default: 1)
   */
  const addItem = useCallback(
    (
      product: {
        id: string;
        name: string;
        price: number;
        images: readonly string[];
        stock: number;
      },
      quantity = 1,
    ) => {
      try {
        store.addItem(product, quantity);
      } catch (error) {
        console.error('Failed to add item to cart:', error);
        throw error;
      }
    },
    [store],
  );

  /**
   * Remove an item from the cart
   * @param itemId - The ID of the cart item to remove
   */
  const removeItem = useCallback(
    (itemId: string) => {
      try {
        store.removeItem(itemId);
      } catch (error) {
        console.error('Failed to remove item from cart:', error);
        throw error;
      }
    },
    [store],
  );

  /**
   * Update the quantity of an item in the cart
   * @param itemId - The ID of the cart item to update
   * @param quantity - The new quantity
   */
  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      try {
        store.updateQuantity(itemId, quantity);
      } catch (error) {
        console.error('Failed to update item quantity:', error);
        throw error;
      }
    },
    [store],
  );

  /**
   * Clear all items from the cart
   */
  const clearCart = useCallback(() => {
    try {
      store.clearCart();
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  }, [store]);

  /**
   * Toggle the cart drawer/modal visibility
   */
  const toggleCart = useCallback(() => {
    try {
      store.toggleCart();
    } catch (error) {
      console.error('Failed to toggle cart:', error);
      throw error;
    }
  }, [store]);

  /**
   * Initialize cart from localStorage
   */
  const initializeCart = useCallback(() => {
    try {
      store.initializeCart();
    } catch (error) {
      console.error('Failed to initialize cart:', error);
      throw error;
    }
  }, [store]);

  /**
   * Get a specific cart item by ID
   * @param itemId - The ID of the cart item
   * @returns The cart item or undefined if not found
   */
  const getItem = useCallback(
    (itemId: string): CartItem | undefined => {
      return store.items.find((item) => item.id === itemId);
    },
    [store.items],
  );

  /**
   * Get a cart item by product ID
   * @param productId - The product ID
   * @returns The cart item or undefined if not found
   */
  const getItemByProductId = useCallback(
    (productId: string): CartItem | undefined => {
      return store.items.find((item) => item.productId === productId);
    },
    [store.items],
  );

  /**
   * Check if a product is in the cart
   * @param productId - The product ID
   * @returns True if the product is in the cart
   */
  const isInCart = useCallback(
    (productId: string): boolean => {
      return store.items.some((item) => item.productId === productId);
    },
    [store.items],
  );

  /**
   * Get the quantity of a product in the cart
   * @param productId - The product ID
   * @returns The quantity or 0 if not in cart
   */
  const getProductQuantity = useCallback(
    (productId: string): number => {
      const item = store.items.find((item) => item.productId === productId);
      return item?.quantity ?? 0;
    },
    [store.items],
  );

  /**
   * Calculate the subtotal for a specific item
   * @param itemId - The ID of the cart item
   * @returns The subtotal (price * quantity)
   */
  const getItemSubtotal = useCallback(
    (itemId: string): number => {
      const item = store.items.find((item) => item.id === itemId);
      return item ? item.price * item.quantity : 0;
    },
    [store.items],
  );

  /**
   * Validate cart before checkout
   * @returns Object with isValid flag and errors array
   */
  const validateCart = useCallback((): {
    isValid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];

    if (store.items.length === 0) {
      errors.push('Cart is empty');
    }

    store.items.forEach((item) => {
      if (item.quantity <= 0) {
        errors.push(`Invalid quantity for ${item.product.name}`);
      }
      if (item.quantity > item.product.stock) {
        errors.push(
          `Insufficient stock for ${item.product.name}. Available: ${item.product.stock}, Requested: ${item.quantity}`,
        );
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [store.items]);

  /**
   * Get cart summary for checkout
   * @returns Cart summary object
   */
  const getCartSummary = useCallback(() => {
    const subtotal = store.totalPrice;
    const discount = 0; // TODO: Implement discount logic
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal - discount + shipping + tax;

    return {
      subtotal,
      discount,
      shipping,
      tax,
      total,
      itemCount: store.totalItems,
    };
  }, [store.totalPrice, store.totalItems]);

  return {
    // State
    items: store.items,
    totalItems: store.totalItems,
    totalPrice: store.totalPrice,
    isCartOpen: store.isCartOpen,

    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    initializeCart,

    // Helper functions
    getItem,
    getItemByProductId,
    isInCart,
    getProductQuantity,
    getItemSubtotal,
    validateCart,
    getCartSummary,
  };
};

/**
 * Hook to get cart items only
 * Useful when you only need to display cart items
 *
 * @returns Cart items array
 */
export const useCartItems = (): CartItem[] => {
  return useCartStore(cartSelectors.items);
};

/**
 * Hook to get total items count
 *
 * @returns Total number of items in cart
 */
export const useCartTotalItems = (): number => {
  return useCartStore(cartSelectors.totalItems);
};

/**
 * Hook to get total price
 *
 * @returns Total price of all items in cart
 */
export const useCartTotalPrice = (): number => {
  return useCartStore(cartSelectors.totalPrice);
};

/**
 * Hook to get cart open state
 *
 * @returns Whether the cart drawer is open
 */
export const useCartOpen = (): boolean => {
  return useCartStore(cartSelectors.isCartOpen);
};

/**
 * Hook to check if cart is empty
 *
 * @returns True if cart is empty
 */
export const useCartIsEmpty = (): boolean => {
  return useCartStore(cartSelectors.isEmpty);
};

/**
 * Hook to get cart item count (number of unique items)
 *
 * @returns Number of unique items in cart
 */
export const useCartItemCount = (): number => {
  return useCartStore(cartSelectors.itemCount);
};

/**
 * Hook to get cart actions only
 * Useful when you only need to perform cart actions
 *
 * @returns Cart actions
 */
export const useCartActions = () => {
  const store = useCartStore();

  return {
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    toggleCart: store.toggleCart,
    initializeCart: store.initializeCart,
  };
};
