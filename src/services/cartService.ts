import { ApiResponse, Cart, CartItem, Product } from '@/types';
import { CART_STORAGE_KEY } from '@/lib/constants';
import { sleep } from '@/lib/utils';

class CartService {
  private getStorageCart(): Cart {
    if (typeof window === 'undefined') return { items: [], total: 0, itemCount: 0 };
    
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return { items: [], total: 0, itemCount: 0 };
    
    try {
      return JSON.parse(stored);
    } catch {
      return { items: [], total: 0, itemCount: 0 };
    }
  }

  private setStorageCart(cart: Cart): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }

  private calculateCartTotals(items: CartItem[]): { total: number; itemCount: number } {
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { total, itemCount };
  }

  async getCart(): Promise<Cart> {
    await sleep(200);
    return this.getStorageCart();
  }

  async addToCart(product: Product, quantity = 1): Promise<Cart> {
    await sleep(300);
    
    const cart = this.getStorageCart();
    const existingItemIndex = cart.items.findIndex(item => item.product.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        product,
        quantity,
        addedAt: new Date().toISOString(),
      };
      cart.items.push(newItem);
    }
    
    // Recalculate totals
    const { total, itemCount } = this.calculateCartTotals(cart.items);
    const updatedCart = { ...cart, total, itemCount };
    
    this.setStorageCart(updatedCart);
    return updatedCart;
  }

  async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
    await sleep(200);
    
    if (quantity <= 0) {
      return this.removeFromCart(itemId);
    }
    
    const cart = this.getStorageCart();
    const itemIndex = cart.items.findIndex(item => item.id === itemId);
    
    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity = quantity;
      const { total, itemCount } = this.calculateCartTotals(cart.items);
      const updatedCart = { ...cart, total, itemCount };
      this.setStorageCart(updatedCart);
      return updatedCart;
    }
    
    return cart;
  }

  async removeFromCart(itemId: string): Promise<Cart> {
    await sleep(200);
    
    const cart = this.getStorageCart();
    const filteredItems = cart.items.filter(item => item.id !== itemId);
    const { total, itemCount } = this.calculateCartTotals(filteredItems);
    const updatedCart = { items: filteredItems, total, itemCount };
    
    this.setStorageCart(updatedCart);
    return updatedCart;
  }

  async clearCart(): Promise<Cart> {
    await sleep(200);
    
    const emptyCart = { items: [], total: 0, itemCount: 0 };
    this.setStorageCart(emptyCart);
    return emptyCart;
  }

  async getCartItemCount(): Promise<number> {
    await sleep(100);
    const cart = this.getStorageCart();
    return cart.itemCount;
  }
}

export const cartService = new CartService();