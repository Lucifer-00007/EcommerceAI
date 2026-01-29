// Cart service
// Handles shopping cart API calls

import type { CartResponse, CartItem } from '@/types/cart.types';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS, MOCK_API_DELAY, STORAGE_KEYS } from '@/lib/constants';
import { MOCK_PRODUCTS, MOCK_CART_ITEMS, mockDelay, getProductById } from '@/lib/mock-data';

/**
 * In-memory cart storage for mock purposes
 */
let mockCart: CartItem[] = [...MOCK_CART_ITEMS];

/**
 * Get current cart
 * @returns Promise that resolves with cart response
 */
export async function getCart(): Promise<CartResponse> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    // Calculate totals
    const totalItems = mockCart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = mockCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items: mockCart,
      totalItems,
      totalPrice,
    };
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw new Error('Failed to fetch cart. Please try again later.');
  }
}

/**
 * Add item to cart
 * @param productId Product ID
 * @param quantity Quantity to add (default: 1)
 * @returns Promise that resolves with updated cart response
 */
export async function addToCart(
  productId: string,
  quantity: number = 1,
): Promise<CartResponse> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    // Validate quantity
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    // Get product
    const product = getProductById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    // Check if product is in stock
    if (product.stock < quantity) {
      throw new Error(`Only ${product.stock} items available in stock`);
    }

    // Check if item already exists in cart
    const existingItemIndex = mockCart.findIndex((item) => item.productId === productId);

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      const existingItem = mockCart[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;

      // Check stock
      if (product.stock < newQuantity) {
        throw new Error(`Only ${product.stock} items available in stock`);
      }

      mockCart[existingItemIndex] = {
        ...existingItem,
        quantity: newQuantity,
      };
    } else {
      // Add new item to cart
      const newItem: CartItem = {
        id: `cart-item-${Date.now()}`,
        productId,
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

      mockCart.push(newItem);
    }

    // Save cart to storage
    saveCartToStorage();

    // Calculate totals
    const totalItems = mockCart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = mockCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items: mockCart,
      totalItems,
      totalPrice,
    };
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to add item to cart. Please try again.');
  }
}

/**
 * Remove item from cart
 * @param itemId Cart item ID
 * @returns Promise that resolves with updated cart response
 */
export async function removeFromCart(itemId: string): Promise<CartResponse> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    // Find item
    const itemIndex = mockCart.findIndex((item) => item.id === itemId);

    if (itemIndex < 0) {
      throw new Error('Item not found in cart');
    }

    // Remove item from cart
    mockCart.splice(itemIndex, 1);

    // Save cart to storage
    saveCartToStorage();

    // Calculate totals
    const totalItems = mockCart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = mockCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items: mockCart,
      totalItems,
      totalPrice,
    };
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to remove item from cart. Please try again.');
  }
}

/**
 * Update cart item quantity
 * @param itemId Cart item ID
 * @param quantity New quantity
 * @returns Promise that resolves with updated cart response
 */
export async function updateCartItem(
  itemId: string,
  quantity: number,
): Promise<CartResponse> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    // Validate quantity
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    // Find item
    const itemIndex = mockCart.findIndex((item) => item.id === itemId);

    if (itemIndex < 0) {
      throw new Error('Item not found in cart');
    }

    const item = mockCart[itemIndex];

    // Check stock
    if (item.product.stock < quantity) {
      throw new Error(`Only ${item.product.stock} items available in stock`);
    }

    // Update item quantity
    mockCart[itemIndex] = {
      ...item,
      quantity,
    };

    // Save cart to storage
    saveCartToStorage();

    // Calculate totals
    const totalItems = mockCart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = mockCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items: mockCart,
      totalItems,
      totalPrice,
    };
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update cart item. Please try again.');
  }
}

/**
 * Clear all items from cart
 * @returns Promise that resolves when cart is cleared
 */
export async function clearCart(): Promise<void> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    // Clear cart
    mockCart = [];

    // Save cart to storage
    saveCartToStorage();
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw new Error('Failed to clear cart. Please try again.');
  }
}

/**
 * Get cart item count
 * @returns Promise that resolves with cart item count
 */
export async function getCartItemCount(): Promise<number> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    const totalItems = mockCart.reduce((sum, item) => sum + item.quantity, 0);
    return totalItems;
  } catch (error) {
    console.error('Error getting cart item count:', error);
    throw new Error('Failed to get cart item count. Please try again.');
  }
}

/**
 * Check if product is in cart
 * @param productId Product ID
 * @returns Promise that resolves with boolean indicating if product is in cart
 */
export async function isProductInCart(productId: string): Promise<boolean> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    return mockCart.some((item) => item.productId === productId);
  } catch (error) {
    console.error('Error checking if product is in cart:', error);
    throw new Error('Failed to check if product is in cart. Please try again.');
  }
}

/**
 * Get cart item by product ID
 * @param productId Product ID
 * @returns Promise that resolves with cart item or undefined
 */
export async function getCartItemByProductId(
  productId: string,
): Promise<CartItem | undefined> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    return mockCart.find((item) => item.productId === productId);
  } catch (error) {
    console.error('Error getting cart item by product ID:', error);
    throw new Error('Failed to get cart item. Please try again.');
  }
}

/**
 * Save cart to local storage
 */
function saveCartToStorage(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.CART_DATA, JSON.stringify(mockCart));
  }
}

/**
 * Load cart from local storage
 * @returns Cart items from storage or empty array
 */
function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];

  const cartData = localStorage.getItem(STORAGE_KEYS.CART_DATA);

  if (!cartData) return [];

  try {
    return JSON.parse(cartData);
  } catch {
    return [];
  }
}

/**
 * Initialize cart from storage
 */
export function initializeCart(): void {
  mockCart = loadCartFromStorage();
}

/**
 * Merge cart with stored cart
 * @param items Cart items to merge
 * @returns Promise that resolves with merged cart response
 */
export async function mergeCart(items: CartItem[]): Promise<CartResponse> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    // Merge items with existing cart
    items.forEach((item) => {
      const existingItemIndex = mockCart.findIndex(
        (existing) => existing.productId === item.productId,
      );

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        mockCart[existingItemIndex] = {
          ...mockCart[existingItemIndex],
          quantity: mockCart[existingItemIndex].quantity + item.quantity,
        };
      } else {
        // Add new item
        mockCart.push(item);
      }
    });

    // Save cart to storage
    saveCartToStorage();

    // Calculate totals
    const totalItems = mockCart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = mockCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items: mockCart,
      totalItems,
      totalPrice,
    };
  } catch (error) {
    console.error('Error merging cart:', error);
    throw new Error('Failed to merge cart. Please try again.');
  }
}
