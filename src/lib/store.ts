import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Cart, CartItem, Product } from '@/types';
import { CART_STORAGE_KEY } from '@/lib/constants';

interface CartStore {
  cart: Cart;
  loading: boolean;
  error: string | null;
  
  // Actions
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Getters
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
  getCartItemCount: () => number;
  
  // Utility
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetError: () => void;
}

const calculateCartTotals = (items: CartItem[]): { total: number; itemCount: number } => {
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: { items: [], total: 0, itemCount: 0 },
      loading: false,
      error: null,

      addToCart: async (product: Product, quantity = 1) => {
        try {
          set({ loading: true, error: null });
          
          const { cart } = get();
          const existingItemIndex = cart.items.findIndex(item => item.product.id === product.id);
          
          let updatedItems: CartItem[];
          
          if (existingItemIndex >= 0) {
            // Update existing item quantity
            updatedItems = [...cart.items];
            updatedItems[existingItemIndex].quantity += quantity;
          } else {
            // Add new item
            const newItem: CartItem = {
              id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              product,
              quantity,
              addedAt: new Date().toISOString(),
            };
            updatedItems = [...cart.items, newItem];
          }
          
          const { total, itemCount } = calculateCartTotals(updatedItems);
          const updatedCart = { items: updatedItems, total, itemCount };
          
          set({ cart: updatedCart, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add to cart',
            loading: false 
          });
          throw error;
        }
      },

      removeFromCart: async (itemId: string) => {
        try {
          set({ loading: true, error: null });
          
          const { cart } = get();
          const updatedItems = cart.items.filter(item => item.id !== itemId);
          const { total, itemCount } = calculateCartTotals(updatedItems);
          const updatedCart = { items: updatedItems, total, itemCount };
          
          set({ cart: updatedCart, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to remove from cart',
            loading: false 
          });
          throw error;
        }
      },

      updateQuantity: async (itemId: string, quantity: number) => {
        try {
          set({ loading: true, error: null });
          
          if (quantity <= 0) {
            await get().removeFromCart(itemId);
            return;
          }
          
          const { cart } = get();
          const itemIndex = cart.items.findIndex(item => item.id === itemId);
          
          if (itemIndex >= 0) {
            const updatedItems = [...cart.items];
            updatedItems[itemIndex].quantity = quantity;
            const { total, itemCount } = calculateCartTotals(updatedItems);
            const updatedCart = { items: updatedItems, total, itemCount };
            
            set({ cart: updatedCart, loading: false });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update quantity',
            loading: false 
          });
          throw error;
        }
      },

      clearCart: async () => {
        try {
          set({ loading: true, error: null });
          const emptyCart = { items: [], total: 0, itemCount: 0 };
          set({ cart: emptyCart, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to clear cart',
            loading: false 
          });
          throw error;
        }
      },

      isInCart: (productId: string) => {
        const { cart } = get();
        return cart.items.some(item => item.product.id === productId);
      },

      getItemQuantity: (productId: string) => {
        const { cart } = get();
        const item = cart.items.find(item => item.product.id === productId);
        return item?.quantity || 0;
      },

      getCartItemCount: () => {
        const { cart } = get();
        return cart.itemCount;
      },

      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
      resetError: () => set({ error: null }),
    }),
    {
      name: CART_STORAGE_KEY,
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        // Fallback for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);