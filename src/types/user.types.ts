// User type definitions
// TypeScript types for user-related data structures

/**
 * Enumeration of user roles in the system
 */
export enum UserRole {
  Customer = 'customer',
  Admin = 'admin',
}

/**
 * Represents a user account in the system
 */
export interface User {
  /** Unique identifier for the user */
  readonly id: string;
  /** User's email address */
  readonly email: string;
  /** User's display name */
  name: string;
  /** URL to user's avatar image (optional) */
  avatar?: string;
  /** User's role in the system */
  role: UserRole;
  /** Timestamp when the user account was created */
  readonly createdAt: string;
  /** Timestamp when the user account was last updated */
  readonly updatedAt: string;
}

/**
 * Extended user profile information
 */
export interface UserProfile {
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** Phone number (optional) */
  phone?: string;
  /** Street address */
  address: string;
  /** City */
  city: string;
  /** State/Province */
  state: string;
  /** Postal/ZIP code */
  zipCode: string;
  /** Country */
  country: string;
}

/**
 * Combined user with profile information
 */
export interface UserWithProfile extends User {
  /** Extended profile information */
  profile?: UserProfile;
}

/**
 * Authentication response containing user and tokens
 */
export interface AuthResponse {
  /** Authenticated user information */
  user: User;
  /** JWT access token */
  token: string;
  /** Refresh token for obtaining new access tokens */
  refreshToken: string;
  /** Token expiration time in seconds (optional) */
  expiresIn?: number;
}

/**
 * Credentials for user login
 */
export interface LoginCredentials {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
}

/**
 * Credentials for user registration
 */
export interface RegisterCredentials {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
  /** User's display name */
  name: string;
}

/**
 * Parameters for updating user profile
 */
export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  avatar?: string;
}

/**
 * Parameters for changing user password
 */
export interface ChangePasswordInput {
  /** Current password */
  currentPassword: string;
  /** New password */
  newPassword: string;
  /** Confirmation of new password */
  confirmPassword: string;
}

/**
 * Parameters for password reset request
 */
export interface ForgotPasswordInput {
  /** User's email address */
  email: string;
}

/**
 * Parameters for completing password reset
 */
export interface ResetPasswordInput {
  /** Reset token from email */
  token: string;
  /** New password */
  password: string;
  /** Confirmation of new password */
  confirmPassword: string;
}

/**
 * User session information
 */
export interface UserSession {
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Current user (if authenticated) */
  user?: User;
  /** Authentication token (if authenticated) */
  token?: string;
  /** Refresh token (if authenticated) */
  refreshToken?: string;
}

/**
 * Validation result for user operations
 */
export interface UserValidationResult {
  /** Whether the operation is valid */
  isValid: boolean;
  /** Error message if invalid */
  error?: string;
  /** Field-specific errors */
  fieldErrors?: Record<string, string>;
}

/**
 * User preferences and settings
 */
export interface UserPreferences {
  /** Preferred currency */
  currency?: string;
  /** Preferred language/locale */
  locale?: string;
  /** Email notification preferences */
  emailNotifications?: {
    orderUpdates?: boolean;
    promotions?: boolean;
    newsletter?: boolean;
  };
  /** Theme preference */
  theme?: 'light' | 'dark' | 'auto';
}
