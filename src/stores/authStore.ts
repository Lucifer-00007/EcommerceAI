/**
 * Authentication Store - Zustand
 * 
 * Manages user authentication state with persistence to localStorage.
 * This store handles login, logout, and user profile management.
 * 
 * Key features:
 * - Persistent storage via localStorage (token and user data)
 * - Authentication state tracking
 * - User profile management
 * - Type-safe actions and state
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User, LoginCredentials, RegisterData } from '@/types'
import { authApi } from '@/services/api'

// ============================================================================
// TYPES
// ============================================================================

interface AuthState {
  /** Current authenticated user (null if not logged in) */
  user: User | null
  /** JWT access token */
  accessToken: string | null
  /** Whether authentication state is being initialized/loaded */
  isLoading: boolean
  /** Whether user is currently authenticated */
  isAuthenticated: boolean
}

interface AuthActions {
  /** Log in with credentials */
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>
  /** Register a new account */
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string; errors?: Record<string, string[]> }>
  /** Log out the current user */
  logout: () => Promise<void>
  /** Update user profile */
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>
  /** Set loading state */
  setLoading: (isLoading: boolean) => void
  /** Initialize auth state from storage */
  initialize: () => Promise<void>
}

// Combine all interfaces for the complete store type
type AuthStore = AuthState & AuthActions

// ============================================================================
// STORE CREATION
// ============================================================================

/**
 * Creates the authentication store with persistence middleware
 * 
 * The persist middleware automatically saves the auth state to localStorage
 * and restores it when the app reloads. This ensures the user stays logged in
 * across browser sessions.
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // ======================================================================
      // INITIAL STATE
      // ======================================================================
      user: null,
      accessToken: null,
      isLoading: true,
      isAuthenticated: false,

      // ======================================================================
      // ACTIONS
      // ======================================================================

      /**
       * Initializes authentication state
       * 
       * Called on app startup to check if user has a valid session.
       * Validates the stored token and fetches current user data.
       */
      initialize: async () => {
        const { accessToken } = get()
        
        if (!accessToken) {
          set({ isLoading: false, isAuthenticated: false })
          return
        }

        try {
          // Validate token and get current user
          const response = await authApi.getCurrentUser()
          
          if (response.success && response.data) {
            set({
              user: response.data,
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            // Token invalid - clear auth state
            set({
              user: null,
              accessToken: null,
              isAuthenticated: false,
              isLoading: false,
            })
          }
        } catch {
          // Error validating token - clear auth state
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      /**
       * Authenticates a user with email and password
       * 
       * @param credentials - Login credentials
       * @returns Object with success status and optional error message
       */
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true })

        try {
          const response = await authApi.login(credentials)

          if (response.success && response.data) {
            set({
              user: response.data.user,
              accessToken: response.data.token,
              isAuthenticated: true,
              isLoading: false,
            })
            return { success: true }
          } else {
            set({ isLoading: false })
            return { 
              success: false, 
              error: response.error || 'Login failed' 
            }
          }
        } catch (error) {
          set({ isLoading: false })
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'An unexpected error occurred' 
          }
        }
      },

      /**
       * Registers a new user account
       * 
       * @param data - Registration data
       * @returns Object with success status and optional error/validation messages
       */
      register: async (data: RegisterData) => {
        set({ isLoading: true })

        try {
          const response = await authApi.register(data)

          if (response.success && response.data) {
            set({
              user: response.data.user,
              accessToken: response.data.token,
              isAuthenticated: true,
              isLoading: false,
            })
            return { success: true }
          } else {
            set({ isLoading: false })
            return { 
              success: false, 
              error: response.error,
              errors: response.errors 
            }
          }
        } catch (error) {
          set({ isLoading: false })
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'An unexpected error occurred' 
          }
        }
      },

      /**
       * Logs out the current user
       * 
       * Clears all authentication state and calls the logout API.
       */
      logout: async () => {
        set({ isLoading: true })

        try {
          await authApi.logout()
        } finally {
          // Always clear local state even if API call fails
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      /**
       * Updates the current user's profile
       * 
       * @param data - Partial user data to update
       * @returns Object with success status and optional error message
       */
      updateProfile: async (data: Partial<User>) => {
        set({ isLoading: true })

        try {
          const response = await authApi.updateProfile(data)

          if (response.success && response.data) {
            set({
              user: response.data,
              isLoading: false,
            })
            return { success: true }
          } else {
            set({ isLoading: false })
            return { 
              success: false, 
              error: response.error || 'Failed to update profile' 
            }
          }
        } catch (error) {
          set({ isLoading: false })
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'An unexpected error occurred' 
          }
        }
      },

      /**
       * Sets the loading state directly
       * 
       * @param isLoading - New loading state
       */
      setLoading: (isLoading: boolean) => {
        set({ isLoading })
      },
    }),
    {
      // ====================================================================
      // PERSISTENCE CONFIGURATION
      // ====================================================================
      name: 'auth-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      
      // Only persist these fields
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        // Don't persist isLoading - should always start as true
      }),

      // Version for migration handling
      version: 1,
    }
  )
)

// ============================================================================
// SELECTOR HOOKS
// ============================================================================

/**
 * Hook to get current user
 */
export function useCurrentUser() {
  return useAuthStore(state => state.user)
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated() {
  return useAuthStore(state => state.isAuthenticated)
}

/**
 * Hook to get auth loading state
 */
export function useAuthLoading() {
  return useAuthStore(state => state.isLoading)
}

/**
 * Hook to get auth actions only
 * Useful when you only need to dispatch actions, not read state
 */
export function useAuthActions() {
  return useAuthStore(state => ({
    login: state.login,
    register: state.register,
    logout: state.logout,
    updateProfile: state.updateProfile,
    initialize: state.initialize,
  }))
}

// ============================================================================
// DEBUGGING
// ============================================================================

// Expose store to window for debugging in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).authStore = useAuthStore
}
