import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, AuthState } from '@/types'

interface AuthStore extends AuthState {
  // Actions
  login: (user: User) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  setLoading: (loading: boolean) => void
  setError: (error?: string) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: undefined,
      isAuthenticated: false,

      login: (user: User) => {
        set({
          user,
          isAuthenticated: true,
          error: undefined,
          isLoading: false
        })
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: undefined,
          isLoading: false
        })
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user
        if (!currentUser) return

        set({
          user: {
            ...currentUser,
            ...userData,
            updatedAt: new Date().toISOString()
          }
        })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setError: (error?: string) => {
        set({ error, isLoading: false })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
