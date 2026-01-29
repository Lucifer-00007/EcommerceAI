// Cart type definitions
// TypeScript types for cart-related data structures

/**
 * Represents a single item in the shopping cart
 */
export interface CartItem {
  /** Unique identifier for the cart item */
  readonly id: string;
  /** ID of the product */
  readonly productId: string;
  /** Product details (minimal info needed for cart display) */
  product: {
    readonly id: string;
    readonly name: string;
    readonly price: number;
    readonly images: readonly string[];
    readonly stock: number;
  };
  /** Quantity of the product in cart */
  quantity: number;
  /** Price at the time of adding to cart (snapshot) */
  readonly price: number;
}

/**
 * Represents the complete state of the shopping cart
 */
export interface CartState {
  /** Array of items in the cart */
  items: readonly CartItem[];
  /** Total number of items (sum of quantities) */
  totalItems: number;
  /** Total price of all items in cart */
  totalPrice: number;
  /** Whether the cart drawer/modal is open */
  isCartOpen: boolean;
}

/**
 * Action types for cart state management
 */
export enum CartActionType {
  ADD_ITEM = 'ADD_ITEM',
  REMOVE_ITEM = 'REMOVE_ITEM',
  UPDATE_QUANTITY = 'UPDATE_QUANTITY',
  CLEAR_CART = 'CLEAR_CART',
  TOGGLE_CART = 'TOGGLE_CART',
  SET_CART = 'SET_CART',
}

/**
 * Base action interface for cart state updates
 */
export interface CartAction {
  type: CartActionType;
  payload?: unknown;
}

/**
 * Payload for adding an item to cart
 */
export interface AddItemPayload {
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: readonly string[];
    stock: number;
  };
  quantity?: number;
}

/**
 * Payload for removing an item from cart
 */
export interface RemoveItemPayload {
  productId: string;
}

/**
 * Payload for updating item quantity
 */
export interface UpdateQuantityPayload {
  productId: string;
  quantity: number;
}

/**
 * Payload for setting the entire cart state
 */
export interface SetCartPayload {
  items: readonly CartItem[];
  totalItems: number;
  totalPrice: number;
}

/**
 * Type guard for cart actions
 */
export type CartActions =
  | { type: CartActionType.ADD_ITEM; payload: AddItemPayload }
  | { type: CartActionType.REMOVE_ITEM; payload: RemoveItemPayload }
  | { type: CartActionType.UPDATE_QUANTITY; payload: UpdateQuantityPayload }
  | { type: CartActionType.CLEAR_CART }
  | { type: CartActionType.TOGGLE_CART }
  | { type: CartActionType.SET_CART; payload: SetCartPayload };

/**
 * Represents a cart item for API requests/responses
 */
export interface CartItemDTO {
  productId: string;
  quantity: number;
}

/**
 * Response structure for cart API operations
 */
export interface CartResponse {
  items: readonly CartItem[];
  totalItems: number;
  totalPrice: number;
}

/**
 * Summary of cart for checkout
 */
export interface CartSummary {
  /** Subtotal before discounts */
  subtotal: number;
  /** Discount amount (if any) */
  discount: number;
  /** Shipping cost */
  shipping: number;
  /** Tax amount */
  tax: number;
  /** Final total */
  total: number;
  /** Number of items */
  itemCount: number;
}

/**
 * Validation result for cart operations
 */
export interface CartValidationResult {
  /** Whether the operation is valid */
  isValid: boolean;
  /** Error message if invalid */
  error?: string;
  /** Updated cart item if applicable */
  cartItem?: CartItem;
}
