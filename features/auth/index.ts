/**
 * Auth Feature Module
 *
 * This module contains all authentication-related functionality:
 * - Store: Zustand store for auth state management
 * - Components: Auth-specific UI components
 * - Hooks: Custom hooks for auth operations
 *
 * @example
 * ```typescript
 * import { useAuthStore, AuthStore } from '@/features/auth';
 * const { user, login, logout } = useAuthStore();
 * ```
 */

// Export store and types
export { useAuthStore } from "./store";
export type { AuthStore } from "./store";

// Export components
export * from "./components";
