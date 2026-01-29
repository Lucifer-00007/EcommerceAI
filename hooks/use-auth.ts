/**
 * Auth Hooks
 *
 * React Query hooks for authentication operations.
 *
 * @module hooks/use-auth
 * @example
 * const { mutate: login } = useLogin();
 * login({ email: "user@example.com", password: "password" });
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type {
  User,
  UserProfile,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "@/types";
import {
  mockUsers,
  getUserProfile,
  delay,
  simulateError,
} from "@/services/mock-data";

// =============================================================================
// QUERY KEYS
// =============================================================================

/**
 * Query keys for auth-related queries
 */
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  profile: (userId: string) => [...authKeys.user(), "profile", userId] as const,
  session: () => [...authKeys.all, "session"] as const,
};

// =============================================================================
// TYPES
// =============================================================================

/**
 * Login input
 */
interface LoginInput extends LoginCredentials {
  /** Callback on successful login */
  onSuccess?: (response: AuthResponse) => void;
}

/**
 * Register input
 */
interface RegisterInput extends RegisterData {
  /** Callback on successful registration */
  onSuccess?: (response: AuthResponse) => void;
}

/**
 * Update profile input
 */
interface UpdateProfileInput {
  /** User ID */
  userId: string;
  /** Profile data to update */
  data: Partial<User>;
}

// =============================================================================
// AUTH QUERIES
// =============================================================================

/**
 * Hook to get the current authenticated user
 *
 * @param options - Additional React Query options
 * @returns Query result with user data
 *
 * @example
 * const { data: user, isLoading } = useCurrentUser();
 */
export function useCurrentUser(
  options?: Omit<UseQueryOptions<User | null, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      await delay(200, 400);

      // Check for stored auth token (mock)
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

      if (!token) {
        return null;
      }

      // In a real app, validate token and get user from API
      // For mock, return the first mock user
      simulateError(0.02);

      return mockUsers[0];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000,
    retry: false,
    ...options,
  });
}

/**
 * Hook to get the current user's full profile
 *
 * @param userId - User ID
 * @param options - Additional React Query options
 * @returns Query result with user profile
 *
 * @example
 * const { data: profile } = useUserProfile("user_123");
 */
export function useUserProfile(
  userId: string | undefined,
  options?: Omit<UseQueryOptions<UserProfile, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: authKeys.profile(userId || ""),
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required");
      }

      await delay(300, 500);
      simulateError(0.03);

      const profile = getUserProfile(userId);

      if (!profile) {
        throw new Error(`User with ID "${userId}" not found`);
      }

      return profile;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
}

// =============================================================================
// AUTH MUTATIONS
// =============================================================================

/**
 * Hook to login a user
 *
 * @returns Mutation to login
 *
 * @example
 * const { mutate: login, isPending } = useLogin();
 * login({
 *   email: "john@example.com",
 *   password: "password123",
 *   rememberMe: true
 * });
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, LoginInput>({
    mutationFn: async (input) => {
      const { email, password } = input;

      await delay(500, 1000);
      simulateError(0.05);

      // Find user by email
      const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        throw new Error("Invalid email or password");
      }

      // Mock password check (in real app, this is server-side)
      if (password.length < 6) {
        throw new Error("Invalid email or password");
      }

      // Generate mock token
      const token = `mock_token_${Date.now()}`;

      // Store token
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token);
      }

      const response: AuthResponse = {
        user,
        token,
        refreshToken: `refresh_${Date.now()}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        expiresIn: 86400,
      };

      return response;
    },
    onSuccess: (data, input) => {
      // Update user in cache
      queryClient.setQueryData(authKeys.user(), data.user);

      // Call success callback if provided
      input.onSuccess?.(data);
    },
  });
}

/**
 * Hook to register a new user
 *
 * @returns Mutation to register
 *
 * @example
 * const { mutate: register, isPending } = useRegister();
 * register({
 *   email: "new@example.com",
 *   password: "password123",
 *   confirmPassword: "password123",
 *   firstName: "John",
 *   lastName: "Doe"
 * });
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, RegisterInput>({
    mutationFn: async (input) => {
      const { email, password, firstName, lastName } = input;

      await delay(600, 1200);
      simulateError(0.05);

      // Check if email already exists
      const existingUser = mockUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (existingUser) {
        throw new Error("An account with this email already exists");
      }

      // Validate password
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      // Create new user (mock)
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        role: "customer",
        emailVerified: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Generate token
      const token = `mock_token_${Date.now()}`;

      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token);
      }

      const response: AuthResponse = {
        user: newUser,
        token,
        refreshToken: `refresh_${Date.now()}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        expiresIn: 86400,
      };

      return response;
    },
    onSuccess: (data, input) => {
      // Update user in cache
      queryClient.setQueryData(authKeys.user(), data.user);

      // Call success callback if provided
      input.onSuccess?.(data);
    },
  });
}

/**
 * Hook to logout a user
 *
 * @returns Mutation to logout
 *
 * @example
 * const { mutate: logout } = useLogout();
 * logout();
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { redirectTo?: string } | void>({
    mutationFn: async () => {
      await delay(200, 400);

      // Clear token
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
      }
    },
    onSuccess: () => {
      // Clear user from cache
      queryClient.setQueryData(authKeys.user(), null);

      // Invalidate all auth-related queries
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}

/**
 * Hook to update user profile
 *
 * @returns Mutation to update profile
 *
 * @example
 * const { mutate: updateProfile } = useUpdateProfile();
 * updateProfile({
 *   userId: "user_123",
 *   data: { firstName: "Jane", lastName: "Smith" }
 * });
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, UpdateProfileInput>({
    mutationFn: async (input) => {
      const { userId, data } = input;

      await delay(400, 800);
      simulateError(0.05);

      const user = mockUsers.find((u) => u.id === userId);

      if (!user) {
        throw new Error(`User with ID "${userId}" not found`);
      }

      // Update user (mock)
      const updatedUser: User = {
        ...user,
        ...data,
        fullName:
          data.firstName || data.lastName
            ? `${data.firstName || user.firstName} ${data.lastName || user.lastName}`
            : user.fullName,
        updatedAt: new Date().toISOString(),
      };

      return updatedUser;
    },
    onSuccess: (data, input) => {
      // Update user in cache
      queryClient.setQueryData(authKeys.user(), data);
      queryClient.setQueryData(authKeys.profile(input.userId), data);

      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
}

// =============================================================================
// AUTH UTILITIES
// =============================================================================

/**
 * Hook to check if user is authenticated
 *
 * @returns Boolean indicating authentication status
 *
 * @example
 * const isAuthenticated = useIsAuthenticated();
 */
export function useIsAuthenticated(): boolean {
  const { data: user } = useCurrentUser();
  return !!user;
}

/**
 * Hook to check if user has required role
 *
 * @param allowedRoles - Array of allowed roles
 * @returns Boolean indicating if user has permission
 *
 * @example
 * const canAccess = useHasRole(["admin", "moderator"]);
 */
export function useHasRole(allowedRoles: string[]): boolean {
  const { data: user } = useCurrentUser();
  return user ? allowedRoles.includes(user.role) : false;
}

// =============================================================================
// EXPORTS
// =============================================================================

export type { LoginInput, RegisterInput, UpdateProfileInput };
