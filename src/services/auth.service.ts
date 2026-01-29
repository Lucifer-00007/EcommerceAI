// Authentication service
// Handles user authentication and authorization

import type {
  User,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from '@/types/user.types';
import { UserRole } from '@/types/user.types';
import { apiClient, authUtils } from '@/lib/api-client';
import { API_ENDPOINTS, MOCK_API_DELAY, STORAGE_KEYS } from '@/lib/constants';
import { MOCK_USERS, mockDelay, getUserByEmail } from '@/lib/mock-data';

/**
 * Login with email and password
 * @param credentials Login credentials
 * @returns Promise that resolves with auth response
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    // Find user by email
    const user = getUserByEmail(credentials.email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // In a real app, we would verify the password here
    // For mock purposes, we'll accept any password

    // Generate mock tokens
    const token = `mock-access-token-${Date.now()}`;
    const refreshToken = `mock-refresh-token-${Date.now()}`;

    // Store tokens
    authUtils.setToken(token);
    authUtils.setRefreshToken(refreshToken);

    // Store user data
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    }

    return {
      user,
      token,
      refreshToken,
      expiresIn: 3600, // 1 hour
    };
  } catch (error) {
    console.error('Error logging in:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to login. Please try again.');
  }
}

/**
 * Register a new user
 * @param credentials Registration credentials
 * @returns Promise that resolves with auth response
 */
export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    // Check if user already exists
    const existingUser = getUserByEmail(credentials.email);

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user (in a real app, this would be done on the server)
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: credentials.email,
      name: credentials.name,
      role: UserRole.Customer,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Generate mock tokens
    const token = `mock-access-token-${Date.now()}`;
    const refreshToken = `mock-refresh-token-${Date.now()}`;

    // Store tokens
    authUtils.setToken(token);
    authUtils.setRefreshToken(refreshToken);

    // Store user data
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(newUser));
    }

    return {
      user: newUser,
      token,
      refreshToken,
      expiresIn: 3600, // 1 hour
    };
  } catch (error) {
    console.error('Error registering:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to register. Please try again.');
  }
}

/**
 * Logout current user
 * @returns Promise that resolves when logout is complete
 */
export async function logout(): Promise<void> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    // Clear tokens
    authUtils.clearTokens();

    // Clear user data
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  } catch (error) {
    console.error('Error logging out:', error);
    throw new Error('Failed to logout. Please try again.');
  }
}

/**
 * Get current authenticated user
 * @returns Promise that resolves with user data
 */
export async function getCurrentUser(): Promise<User> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    // Check if user is authenticated
    if (!authUtils.isAuthenticated()) {
      throw new Error('User is not authenticated');
    }

    // Get user data from storage
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);

      if (!userData) {
        throw new Error('User data not found');
      }

      return JSON.parse(userData);
    }

    throw new Error('Failed to get current user');
  } catch (error) {
    console.error('Error getting current user:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to get current user. Please try again.');
  }
}

/**
 * Refresh authentication token
 * @returns Promise that resolves with new auth response
 */
export async function refreshToken(): Promise<AuthResponse> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    // Get current refresh token
    const currentRefreshToken = authUtils.getRefreshToken();

    if (!currentRefreshToken) {
      throw new Error('No refresh token available');
    }

    // Get current user
    const user = await getCurrentUser();

    // Generate new tokens
    const newToken = `mock-access-token-${Date.now()}`;
    const newRefreshToken = `mock-refresh-token-${Date.now()}`;

    // Store new tokens
    authUtils.setToken(newToken);
    authUtils.setRefreshToken(newRefreshToken);

    return {
      user,
      token: newToken,
      refreshToken: newRefreshToken,
      expiresIn: 3600, // 1 hour
    };
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to refresh token. Please login again.');
  }
}

/**
 * Request password reset email
 * @param email User email
 * @returns Promise that resolves when email is sent
 */
export async function forgotPassword(email: string): Promise<void> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    // Check if user exists
    const user = getUserByEmail(email);

    if (!user) {
      // For security reasons, we don't reveal if the user exists
      // We'll just return success
      return;
    }

    // In a real app, we would send an email with a reset token
    // For mock purposes, we'll just log it
    console.log(`Password reset email sent to: ${email}`);
  } catch (error) {
    console.error('Error requesting password reset:', error);
    throw new Error('Failed to request password reset. Please try again.');
  }
}

/**
 * Reset password with token
 * @param token Password reset token
 * @param password New password
 * @returns Promise that resolves when password is reset
 */
export async function resetPassword(token: string, password: string): Promise<void> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    // In a real app, we would verify the token and update the password
    // For mock purposes, we'll just log it
    console.log(`Password reset with token: ${token}`);

    // Validate password
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
  } catch (error) {
    console.error('Error resetting password:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to reset password. Please try again.');
  }
}

/**
 * Check if user is authenticated
 * @returns Whether user is authenticated
 */
export function isAuthenticated(): boolean {
  return authUtils.isAuthenticated();
}

/**
 * Get stored auth token
 * @returns Auth token or undefined
 */
export function getAuthToken(): string | undefined {
  return authUtils.getToken();
}

/**
 * Get stored refresh token
 * @returns Refresh token or undefined
 */
export function getRefreshToken(): string | undefined {
  return authUtils.getRefreshToken();
}

/**
 * Initialize auth state from storage
 * @returns User data if authenticated, undefined otherwise
 */
export function initializeAuth(): User | undefined {
  if (typeof window === 'undefined') return undefined;

  const token = authUtils.getToken();
  if (!token) return undefined;

  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  if (!userData) return undefined;

  try {
    return JSON.parse(userData);
  } catch {
    return undefined;
  }
}

/**
 * Update user profile
 * @param updates User profile updates
 * @returns Promise that resolves with updated user
 */
export async function updateProfile(updates: {
  name?: string;
  avatar?: string;
}): Promise<User> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    // Get current user
    const currentUser = await getCurrentUser();

    // Update user data
    const updatedUser: User = {
      ...currentUser,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Store updated user data
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
    }

    return updatedUser;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error('Failed to update profile. Please try again.');
  }
}

/**
 * Change user password
 * @param currentPassword Current password
 * @param newPassword New password
 * @returns Promise that resolves when password is changed
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    // Validate passwords
    if (newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long');
    }

    if (currentPassword === newPassword) {
      throw new Error('New password must be different from current password');
    }

    // In a real app, we would verify the current password and update it
    // For mock purposes, we'll just log it
    console.log('Password changed successfully');
  } catch (error) {
    console.error('Error changing password:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to change password. Please try again.');
  }
}
