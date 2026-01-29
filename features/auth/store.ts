/**
 * Auth Store
 *
 * Production-ready Zustand store for managing authentication state.
 * Includes persistence to localStorage and mock authentication.
 *
 * Features:
 * - Mock login/register (accepts any email + "password")
 * - JWT-like token storage
 * - localStorage persistence with SSR-safe checks
 * - User state management with partial updates
 * - Error handling
 *
 * @module features/auth/store
 * @example
 * ```typescript
 * const { user, isAuthenticated, login } = useAuthStore();
 * await login({ email: "user@example.com", password: "password" });
 * ```
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, LoginCredentials, RegisterData, AuthResponse } from "@/types";
import { AUTH_STORAGE_KEY } from "@/lib/constants";

// =============================================================================
// STORE STATE INTERFACE
// =============================================================================

/**
 * Auth store state and actions interface
 */
export interface AuthStore {
  /** Current authenticated user */
  user: User | null;

  /** JWT or session token */
  token: string | null;

  /** Whether user is authenticated */
  isAuthenticated: boolean;

  /** Whether auth check is in progress */
  isLoading: boolean;

  /** Error message from last auth operation */
  error: string | null;

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  /**
   * Login with credentials
   * Mock implementation - accepts any email + "password"
   * @param credentials - Login credentials
   * @returns Promise with auth response
   */
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;

  /**
   * Register new user
   * Mock implementation - creates new user
   * @param data - Registration data
   * @returns Promise with auth response
   */
  register: (data: RegisterData) => Promise<AuthResponse>;

  /**
   * Logout current user
   * Clears auth state and storage
   */
  logout: () => void;

  /**
   * Set user directly (e.g., from session restore)
   * @param user - User to set
   */
  setUser: (user: User | null) => void;

  /**
   * Update user data partially
   * @param updates - Partial user updates
   */
  updateUser: (updates: Partial<User>) => void;

  /**
   * Clear any error message
   */
  clearError: () => void;

  /**
   * Set loading state
   * @param loading - Loading state
   */
  setLoading: (loading: boolean) => void;

  /**
   * Hydrate auth from storage (called after mount)
   */
  hydrateFromStorage: () => void;
}

// =============================================================================
// MOCK AUTH HELPERS
// =============================================================================

/**
 * Generate a JWT-like mock token
 */
const generateToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      iat: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    })
  );
  const signature = btoa("mock-signature");
  return `${header}.${payload}.${signature}`;
};

/**
 * Simulate network delay
 */
const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// =============================================================================
// STORE CREATION
// =============================================================================

/**
 * Auth store hook with persistence
 *
 * @example
 * ```typescript
 * // Get auth state
 * const { user, isAuthenticated } = useAuthStore();
 *
 * // Use actions
 * const { login, logout, register } = useAuthStore();
 *
 * // Login
 * await login({ email: "user@example.com", password: "password" });
 * ```
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // -------------------------------------------------------------------------
      // Initial State
      // -------------------------------------------------------------------------
      user: null as User | null,
      token: null as string | null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // -------------------------------------------------------------------------
      // Actions
      // -------------------------------------------------------------------------

      login: async (credentials) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API delay
          await delay(800);

          const { email, password } = credentials;

          // Mock validation: accept any email with password "password"
          if (password !== "password") {
            throw new Error("Invalid email or password");
          }

          // Create mock user from email
          const userId = `user_${btoa(email).slice(0, 12)}`;
          const nameParts = email.split("@")[0].split(".");
          const firstName =
            nameParts[0]?.charAt(0).toUpperCase() + nameParts[0]?.slice(1) || "User";
          const lastName =
            nameParts[1]?.charAt(0).toUpperCase() + nameParts[1]?.slice(1) || "";

          const user: User = {
            id: userId,
            email: email.toLowerCase(),
            firstName,
            lastName: lastName || "User",
            fullName: `${firstName} ${lastName || "User"}`,
            role: "customer",
            emailVerified: true,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const token = generateToken(userId);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          const response: AuthResponse = {
            user,
            token,
            refreshToken: generateToken(`refresh_${userId}`),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            expiresIn: 86400,
          };

          return response;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Login failed";
          set({ isLoading: false, error: errorMessage });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API delay
          await delay(1000);

          const { email, password, firstName, lastName } = data;

          // Mock validation
          if (password.length < 6) {
            throw new Error("Password must be at least 6 characters");
          }

          if (password !== "password") {
            throw new Error("Please use 'password' as the password for demo");
          }

          const userId = `user_${Date.now()}`;

          const user: User = {
            id: userId,
            email: email.toLowerCase(),
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`,
            role: "customer",
            emailVerified: false,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const token = generateToken(userId);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          const response: AuthResponse = {
            user,
            token,
            refreshToken: generateToken(`refresh_${userId}`),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            expiresIn: 86400,
          };

          return response;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Registration failed";
          set({ isLoading: false, error: errorMessage });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedUser: User = {
          ...currentUser,
          ...updates,
          fullName:
            updates.firstName || updates.lastName
              ? `${updates.firstName || currentUser.firstName} ${updates.lastName || currentUser.lastName}`
              : currentUser.fullName,
          updatedAt: new Date().toISOString(),
        };

        set({ user: updatedUser });
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      hydrateFromStorage: () => {
        // This is handled by Zustand's persist middleware automatically
        // We provide this action for explicit hydration control if needed
        set({ isLoading: false });
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      // SSR-safe storage - only use localStorage on client
      storage: createJSONStorage(() => localStorage),
      // Only persist user and token, not UI state
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      // SSR-safe: skip hydration on server
      skipHydration: true,
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error("Failed to rehydrate auth:", error);
          }
        };
      },
    }
  )
);

// =============================================================================
// SELECTOR HOOKS (for optimized re-renders)
// =============================================================================

/**
 * Hook to check if user is authenticated (optimized selector)
 * @returns True if authenticated
 */
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);

/**
 * Hook to get current user (optimized selector)
 * @returns Current user or null
 */
export const useCurrentUser = () => useAuthStore((state) => state.user);

/**
 * Hook to get auth token (optimized selector)
 * @returns Auth token or null
 */
export const useAuthToken = () => useAuthStore((state) => state.token);

/**
 * Hook to check if auth is loading (optimized selector)
 * @returns True if loading
 */
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);

/**
 * Hook to get auth error (optimized selector)
 * @returns Error message or null
 */
export const useAuthError = () => useAuthStore((state) => state.error);

// Default export for convenience
export default useAuthStore;
