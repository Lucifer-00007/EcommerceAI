/**
 * Cart Feature Module
 *
 * This module contains all cart-related functionality:
 * - Store: Zustand store for cart state management
 * - Components: Cart-specific UI components
 * - Hooks: Custom hooks for cart operations
 *
 * @example
 * ```typescript
 * import { useCartStore, CartStore } from '@/features/cart';
 * const { items, addItem } = useCartStore();
 * ```
 */

// Export store and types
export { useCartStore } from "./store";
export type { CartStore } from "./store";

// Export components
export * from "./components";
