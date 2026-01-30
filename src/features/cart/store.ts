// Cart store
// Zustand store for managing shopping cart state

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types/cart.types';

/**
 * Cart state interface
 */
interface CartState {
  /** Array of items in the cart */
  items: CartItem[];
  /** Total number of items (sum of quantities) */
  totalItems: number;
  /** Total price of all items in cart */
  totalPrice: number;
  /** Whether the cart drawer/modal is open */
  isCartOpen: boolean;
}

/**
 * Cart actions interface
 */
interface CartActions {
  /**
   * Add an item to the cart or update quantity if it already exists
   * @param product - The product to add to cart
   * @param quantity - The quantity to add (default: 1)
   */
  addItem: (
    product: {
      id: string;
      name: string;
      price: number;
      images: readonly string[];
      stock: number;
    },
    quantity?: number,
  ) => void;

  /**
   * Remove an item from the cart
   * @param itemId - The ID of the cart item to remove
   */
  removeItem: (itemId: string) => void;

  /**
   * Update the quantity of an item in the cart
   * @param itemId - The ID of the cart item to update
   * @param quantity - The new quantity (must be >= 1)
   */
  updateQuantity: (itemId: string, quantity: number) => void;

  /**
   * Clear all items from the cart
   */
  clearCart: () => void;

  /**
   * Toggle the cart drawer/modal visibility
   */
  toggleCart: () => void;

  /**
   * Initialize cart from localStorage (called on app start)
   * This is handled automatically by the persist middleware
   */
  initializeCart: () => void;
}

/**
 * Type for the complete cart store (state + actions)
 */
type CartStore = CartState & CartActions;

/**
 * Calculate total items from cart items array
 * @param items - Array of cart items
 * @returns Total number of items
 */
const calculateTotalItems = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Calculate total price from cart items array
 * @param items - Array of cart items
 * @returns Total price
 */
const calculateTotalPrice = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

/**
 * Generate a unique cart item ID
 * @param productId - The product ID
 * @returns A unique cart item ID
 */
const generateCartItemId = (productId: string): string => {
  return `cart-${productId}-${Date.now()}`;
};

/**
 * Zustand store for cart state management with localStorage persistence
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      totalItems: 0,
      totalPrice: 0,
      isCartOpen: false,

      /**
       * Add an item to the cart or update quantity if it already exists
       */
      addItem: (product, quantity = 1) => {
        const state = get();

        // Validate quantity
        if (quantity <= 0) {
          console.error('Quantity must be greater than 0');
          return;
        }

        // Check if product is in stock
        if (product.stock < quantity) {
          console.error(`Insufficient stock. Available: ${product.stock}, Requested: ${quantity}`);
          return;
        }

        // Check if item already exists in cart
        const existingItemIndex = state.items.findIndex(
          (item) => item.productId === product.id,
        );

        let newItems: CartItem[];

        if (existingItemIndex >= 0) {
          // Update existing item quantity
          const existingItem = state.items[existingItemIndex];
          const newQuantity = existingItem.quantity + quantity;

          // Check if new quantity exceeds stock
          if (newQuantity > product.stock) {
            console.error(
              `Insufficient stock. Available: ${product.stock}, Requested: ${newQuantity}`,
            );
            return;
          }

          newItems = [...state.items];
          newItems[existingItemIndex] = {
            ...existingItem,
            quantity: newQuantity,
          };
        } else {
          // Add new item to cart
          const newItem: CartItem = {
            id: generateCartItemId(product.id),
            productId: product.id,
            product: {
              id: product.id,
              name: product.name,
              price: product.price,
              images: product.images,
              stock: product.stock,
            },
            quantity,
            price: product.price,
          };
          newItems = [...state.items, newItem];
        }

        set({
          items: newItems,
          totalItems: calculateTotalItems(newItems),
          totalPrice: calculateTotalPrice(newItems),
        });
      },

      /**
       * Remove an item from the cart
       */
      removeItem: (itemId) => {
        const state = get();
        const newItems = state.items.filter((item) => item.id !== itemId);

        set({
          items: newItems,
          totalItems: calculateTotalItems(newItems),
          totalPrice: calculateTotalPrice(newItems),
        });
      },

      /**
       * Update the quantity of an item in the cart
       */
      updateQuantity: (itemId, quantity) => {
        const state = get();

        // Validate quantity
        if (quantity <= 0) {
          console.error('Quantity must be greater than 0');
          return;
        }

        const itemIndex = state.items.findIndex((item) => item.id === itemId);

        if (itemIndex < 0) {
          console.error('Item not found in cart');
          return;
        }

        const item = state.items[itemIndex];

        // Check if quantity exceeds stock
        if (quantity > item.product.stock) {
          console.error(
            `Insufficient stock. Available: ${item.product.stock}, Requested: ${quantity}`,
          );
          return;
        }

        const newItems = [...state.items];
        newItems[itemIndex] = {
          ...item,
          quantity,
        };

        set({
          items: newItems,
          totalItems: calculateTotalItems(newItems),
          totalPrice: calculateTotalPrice(newItems),
        });
      },

      /**
       * Clear all items from the cart
       */
      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      },

      /**
       * Toggle the cart drawer/modal visibility
       */
      toggleCart: () => {
        set((state) => ({ isCartOpen: !state.isCartOpen }));
      },

      /**
       * Initialize cart from localStorage
       * This is handled automatically by the persist middleware,
       * but we provide this method for manual initialization if needed
       */
      initializeCart: () => {
        // The persist middleware handles this automatically
        // This method is provided for compatibility and manual control
        const state = get();
        set({
          items: state.items,
          totalItems: calculateTotalItems(state.items),
          totalPrice: calculateTotalPrice(state.items),
        });
      },
    }),
    {
      name: 'cart-storage', // Key for localStorage
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
        // Don't persist isCartOpen - it should reset on page load
      }),
    },
  ),
);

/**
 * Selectors for common cart operations
 */
export const cartSelectors = {
  /**
   * Get all cart items
   */
  items: (state: CartStore) => state.items,

  /**
   * Get total number of items
   */
  totalItems: (state: CartStore) => state.totalItems,

  /**
   * Get total price
   */
  totalPrice: (state: CartStore) => state.totalPrice,

  /**
   * Get cart open state
   */
  isCartOpen: (state: CartStore) => state.isCartOpen,

  /**
   * Check if cart is empty
   */
  isEmpty: (state: CartStore) => state.items.length === 0,

  /**
   * Get cart item count (number of unique items)
   */
  itemCount: (state: CartStore) => state.items.length,
};
