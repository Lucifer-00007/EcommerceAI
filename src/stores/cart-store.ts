import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Cart, CartItem, Product } from '@/types'

interface CartStore {
  cart: Cart | null
  isLoading: boolean
  error?: string
  
  // Actions
  initializeCart: () => void
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  toggleItemSelection: (itemId: string) => void
  selectAllItems: (selected: boolean) => void
  clearCart: () => void
  calculateTotals: () => void
}

const calculateCartTotals = (items: CartItem[]): Omit<Cart, 'id' | 'items'> => {
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const tax = subtotal * 0.08 // 8% tax rate
  const shipping = subtotal > 100 ? 0 : 9.99 // Free shipping over $100
  const discount = 0 // Could implement discount logic here
  const total = subtotal + tax + shipping - discount

  return {
    subtotal,
    tax,
    shipping,
    total,
    discount
  }
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,

      initializeCart: () => {
        const state = get()
        if (!state.cart) {
          set({
            cart: {
              id: `cart_${Date.now()}`,
              items: [],
              ...calculateCartTotals([])
            }
          })
        }
      },

      addToCart: (product: Product, quantity = 1) => {
        set({ isLoading: true })
        
        try {
          const state = get()
          if (!state.cart) {
            state.initializeCart()
          }

          const cart = get().cart!
          const existingItemIndex = cart.items.findIndex(
            item => item.productId === product.id
          )

          let updatedItems: CartItem[]

          if (existingItemIndex >= 0) {
            // Update existing item quantity
            updatedItems = cart.items.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          } else {
            // Add new item
            const newItem: CartItem = {
              id: `cart_item_${Date.now()}_${Math.random()}`,
              productId: product.id,
              product,
              quantity,
              selected: true
            }
            updatedItems = [...cart.items, newItem]
          }

          const totals = calculateCartTotals(updatedItems)
          
          set({
            cart: {
              ...cart,
              items: updatedItems,
              ...totals
            },
            isLoading: false
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to add item to cart',
            isLoading: false
          })
        }
      },

      removeFromCart: (itemId: string) => {
        set({ isLoading: true })
        
        try {
          const cart = get().cart
          if (!cart) return

          const updatedItems = cart.items.filter(item => item.id !== itemId)
          const totals = calculateCartTotals(updatedItems)

          set({
            cart: {
              ...cart,
              items: updatedItems,
              ...totals
            },
            isLoading: false
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to remove item from cart',
            isLoading: false
          })
        }
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity < 1) return

        set({ isLoading: true })
        
        try {
          const cart = get().cart
          if (!cart) return

          const updatedItems = cart.items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          )
          const totals = calculateCartTotals(updatedItems)

          set({
            cart: {
              ...cart,
              items: updatedItems,
              ...totals
            },
            isLoading: false
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update quantity',
            isLoading: false
          })
        }
      },

      toggleItemSelection: (itemId: string) => {
        const cart = get().cart
        if (!cart) return

        const updatedItems = cart.items.map(item =>
          item.id === itemId ? { ...item, selected: !item.selected } : item
        )
        const totals = calculateCartTotals(updatedItems)

        set({
          cart: {
            ...cart,
            items: updatedItems,
            ...totals
          }
        })
      },

      selectAllItems: (selected: boolean) => {
        const cart = get().cart
        if (!cart) return

        const updatedItems = cart.items.map(item => ({ ...item, selected }))
        const totals = calculateCartTotals(updatedItems)

        set({
          cart: {
            ...cart,
            items: updatedItems,
            ...totals
          }
        })
      },

      clearCart: () => {
        set({
          cart: {
            id: `cart_${Date.now()}`,
            items: [],
            ...calculateCartTotals([])
          }
        })
      },

      calculateTotals: () => {
        const cart = get().cart
        if (!cart) return

        const totals = calculateCartTotals(cart.items)
        set({
          cart: {
            ...cart,
            ...totals
          }
        })
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cart: state.cart })
    }
  )
)
