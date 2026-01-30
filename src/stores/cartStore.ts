/**
 * Cart Store - Zustand
 * 
 * Manages the shopping cart state with persistence to localStorage.
 * This store handles all cart operations including adding items,
 * removing items, updating quantities, and calculating totals.
 * 
 * Key features:
 * - Persistent storage via localStorage
 * - Optimistic updates for UI responsiveness
 * - Computed totals (subtotal, tax, shipping, total)
 * - Type-safe actions and state
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CartItem, Product, CartTotals } from '@/types'
import { generateId } from '@/lib/utils'

// ============================================================================
// TYPES
// ============================================================================

interface CartState {
  /** Array of items in the cart */
  items: CartItem[]
  /** Unique cart identifier */
  cartId: string
  /** Date cart was created */
  createdAt: string
}

interface CartActions {
  /** Add a product to the cart */
  addItem: (product: Product, quantity?: number) => void
  /** Remove an item from the cart */
  removeItem: (itemId: string) => void
  /** Update the quantity of a cart item */
  updateQuantity: (itemId: string, quantity: number) => void
  /** Clear all items from the cart */
  clearCart: () => void
  /** Check if a product is in the cart */
  hasItem: (productId: string) => boolean
  /** Get the quantity of a specific product in cart */
  getItemQuantity: (productId: string) => number
}

interface CartComputed {
  /** Total number of unique items */
  itemCount: number
  /** Total quantity of all items */
  totalQuantity: number
  /** Cart totals (subtotal, tax, shipping, total) */
  totals: CartTotals
}

// Combine all interfaces for the complete store type
type CartStore = CartState & CartActions & CartComputed

// ============================================================================
// CONSTANTS
// ============================================================================

/** Tax rate as a decimal (e.g., 0.08 = 8%) */
const TAX_RATE = 0.08

/** Free shipping threshold */
const FREE_SHIPPING_THRESHOLD = 50

/** Standard shipping cost */
const STANDARD_SHIPPING = 5

// ============================================================================
// STORE CREATION
// ============================================================================

/**
 * Creates the cart store with persistence middleware
 * 
 * The persist middleware automatically saves the cart state to localStorage
 * and restores it when the app reloads. This ensures the cart persists
 * across browser sessions.
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // ======================================================================
      // INITIAL STATE
      // ======================================================================
      items: [],
      cartId: generateId(),
      createdAt: new Date().toISOString(),

      // ======================================================================
      // ACTIONS
      // ======================================================================

      /**
       * Adds a product to the cart
       * 
       * If the product is already in the cart, increments the quantity.
       * Otherwise, creates a new cart item.
       * 
       * @param product - The product to add
       * @param quantity - Quantity to add (default: 1)
       */
      addItem: (product: Product, quantity: number = 1) => {
        set(state => {
          // Check if product already exists in cart
          const existingItemIndex = state.items.findIndex(
            item => item.product.id === product.id
          )

          if (existingItemIndex >= 0) {
            // Product exists - update quantity
            const updatedItems = [...state.items]
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + quantity,
            }
            return { items: updatedItems }
          } else {
            // Product doesn't exist - add new item
            const newItem: CartItem = {
              id: generateId(),
              product,
              quantity,
              priceAtAdd: product.isOnSale && product.originalPrice 
                ? product.price 
                : product.price,
            }
            return { items: [...state.items, newItem] }
          }
        })
      },

      /**
       * Removes an item from the cart
       * 
       * @param itemId - The cart item ID to remove
       */
      removeItem: (itemId: string) => {
        set(state => ({
          items: state.items.filter(item => item.id !== itemId),
        }))
      },

      /**
       * Updates the quantity of a cart item
       * 
       * If quantity is 0 or less, removes the item from cart.
       * 
       * @param itemId - The cart item ID
       * @param quantity - New quantity
       */
      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }

        set(state => ({
          items: state.items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }))
      },

      /**
       * Clears all items from the cart
       * Useful after successful checkout
       */
      clearCart: () => {
        set({ items: [] })
      },

      /**
       * Checks if a product is in the cart
       * 
       * @param productId - Product ID to check
       * @returns True if product is in cart
       */
      hasItem: (productId: string) => {
        return get().items.some(item => item.product.id === productId)
      },

      /**
       * Gets the quantity of a specific product in the cart
       * 
       * @param productId - Product ID
       * @returns Quantity (0 if not in cart)
       */
      getItemQuantity: (productId: string) => {
        const item = get().items.find(item => item.product.id === productId)
        return item?.quantity || 0
      },

      // ======================================================================
      // COMPUTED VALUES
      // These are calculated on-demand when accessed
      // ======================================================================

      /** Total number of unique items in cart */
      get itemCount() {
        return get().items.length
      },

      /** Total quantity of all items (sum of all quantities) */
      get totalQuantity() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      /** Calculated cart totals */
      get totals(): CartTotals {
        const items = get().items

        // Calculate subtotal
        const subtotal = items.reduce((sum, item) => {
          return sum + item.priceAtAdd * item.quantity
        }, 0)

        // Calculate discount (difference between original and sale prices)
        const discount = items.reduce((sum, item) => {
          const originalPrice = item.product.originalPrice || item.product.price
          const currentPrice = item.priceAtAdd
          return sum + (originalPrice - currentPrice) * item.quantity
        }, 0)

        // Calculate shipping (free over threshold)
        const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING

        // Calculate tax
        const tax = subtotal * TAX_RATE

        // Calculate final total
        const total = subtotal + shipping + tax - discount

        return {
          itemCount: items.length,
          totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: Math.round(subtotal * 100) / 100,
          discount: Math.round(discount * 100) / 100,
          tax: Math.round(tax * 100) / 100,
          shipping: Math.round(shipping * 100) / 100,
          total: Math.round(total * 100) / 100,
        }
      },
    }),
    {
      // ====================================================================
      // PERSISTENCE CONFIGURATION
      // ====================================================================
      name: 'cart-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      
      // Only persist these fields (not computed values)
      partialize: (state) => ({
        items: state.items,
        cartId: state.cartId,
        createdAt: state.createdAt,
      }),

      // Version for migration handling
      version: 1,

      // Optional: Handle version migrations
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0) {
          // Migration from version 0 to 1
          // Add any necessary transformations here
        }
        return persistedState as CartState
      },
    }
  )
)

// ============================================================================
// SELECTOR HOOKS
// ============================================================================

/**
 * Hook to get cart items
 * Use this instead of useCartStore for better performance
 */
export function useCartItems() {
  return useCartStore(state => state.items)
}

/**
 * Hook to get cart totals
 */
export function useCartTotals() {
  return useCartStore(state => state.totals)
}

/**
 * Hook to check if cart is empty
 */
export function useIsCartEmpty() {
  return useCartStore(state => state.items.length === 0)
}

/**
 * Hook to get cart actions only
 * Useful when you only need to dispatch actions, not read state
 */
export function useCartActions() {
  return useCartStore(state => ({
    addItem: state.addItem,
    removeItem: state.removeItem,
    updateQuantity: state.updateQuantity,
    clearCart: state.clearCart,
    hasItem: state.hasItem,
    getItemQuantity: state.getItemQuantity,
  }))
}

// ============================================================================
// DEBUGGING
// ============================================================================

// Expose store to window for debugging in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).cartStore = useCartStore
}
