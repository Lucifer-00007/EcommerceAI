import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/services/api'
import { User, LoginForm, RegisterForm } from '@/types'
import { useAuthStore } from '@/stores/auth-store'

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  current: () => [...authKeys.all, 'current'] as const,
}

// Hook for getting current user
export function useCurrentUser() {
  const { user, isAuthenticated } = useAuthStore()
  
  return useQuery({
    queryKey: authKeys.current(),
    queryFn: () => apiService.getCurrentUser(),
    enabled: isAuthenticated && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    initialData: user,
  })
}

// Hook for login
export function useLogin() {
  const queryClient = useQueryClient()
  const { login } = useAuthStore()

  return useMutation({
    mutationFn: (credentials: LoginForm) => apiService.login(credentials),
    onSuccess: (data) => {
      if (data.success && data.data) {
        login(data.data)
        queryClient.setQueryData(authKeys.current(), data.data)
      }
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
  })
}

// Hook for registration
export function useRegister() {
  const queryClient = useQueryClient()
  const { login } = useAuthStore()

  return useMutation({
    mutationFn: (userData: RegisterForm) => apiService.register(userData),
    onSuccess: (data) => {
      if (data.success && data.data) {
        login(data.data)
        queryClient.setQueryData(authKeys.current(), data.data)
      }
    },
    onError: (error) => {
      console.error('Registration failed:', error)
    },
  })
}

// Hook for logout
export function useLogout() {
  const queryClient = useQueryClient()
  const { logout } = useAuthStore()

  return useMutation({
    mutationFn: () => apiService.logout(),
    onSuccess: () => {
      logout()
      queryClient.clear()
    },
    onError: (error) => {
      console.error('Logout failed:', error)
      // Still logout locally even if API call fails
      logout()
      queryClient.clear()
    },
  })
}
