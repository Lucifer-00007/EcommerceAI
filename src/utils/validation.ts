// Validation schemas
// Validation utilities and schemas using Zod

import { z } from 'zod';

/**
 * Login form validation schema
 * Validates email and password for user authentication
 *
 * @example
 * ```ts
 * const result = loginSchema.safeParse({ email: 'user@example.com', password: 'password123' });
 * if (result.success) {
 *   // Valid login data
 * }
 * ```
 */
export const loginSchema = z.object({
  /**
   * User email address
   * Must be a valid email format
   */
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .min(1, 'Email is required')
    .email('Invalid email address')
    .toLowerCase()
    .trim(),

  /**
   * User password
   * Must be at least 8 characters
   */
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

/**
 * Type for login form data
 */
export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Registration form validation schema
 * Validates user registration data including email, password, and name
 *
 * @example
 * ```ts
 * const result = registerSchema.safeParse({
 *   email: 'user@example.com',
 *   password: 'Password123!',
 *   confirmPassword: 'Password123!',
 *   firstName: 'John',
 *   lastName: 'Doe',
 * });
 * ```
 */
export const registerSchema = z
  .object({
    /**
     * User email address
     * Must be a valid email format
     */
    email: z
      .string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string',
      })
      .min(1, 'Email is required')
      .email('Invalid email address')
      .toLowerCase()
      .trim(),

    /**
     * User password
     * Must be at least 8 characters with at least one uppercase letter,
     * one lowercase letter, one number, and one special character
     */
    password: z
      .string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string',
      })
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        'Password must contain at least one special character',
      ),

    /**
     * Password confirmation
     * Must match the password field
     */
    confirmPassword: z
      .string({
        required_error: 'Please confirm your password',
        invalid_type_error: 'Confirm password must be a string',
      })
      .min(1, 'Please confirm your password'),

    /**
     * User's first name
     */
    firstName: z
      .string({
        required_error: 'First name is required',
        invalid_type_error: 'First name must be a string',
      })
      .min(1, 'First name is required')
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be less than 50 characters')
      .trim(),

    /**
     * User's last name
     */
    lastName: z
      .string({
        required_error: 'Last name is required',
        invalid_type_error: 'Last name must be a string',
      })
      .min(1, 'Last name is required')
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be less than 50 characters')
      .trim(),

    /**
     * Optional phone number
     */
    phone: z
      .string({
        invalid_type_error: 'Phone number must be a string',
      })
      .optional()
      .refine(
        (value) => !value || /^\+?[\d\s-()]+$/.test(value),
        'Invalid phone number format',
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Type for registration form data
 */
export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Checkout form validation schema
 * Validates checkout data including shipping and billing information
 *
 * @example
 * ```ts
 * const result = checkoutSchema.safeParse({
 *   shippingAddress: {
 *     firstName: 'John',
 *     lastName: 'Doe',
 *     address: '123 Main St',
 *     city: 'New York',
 *     state: 'NY',
 *     zipCode: '10001',
 *     country: 'US',
 *   },
 *   paymentMethod: 'credit-card',
 *   savePaymentInfo: false,
 * });
 * ```
 */
export const checkoutSchema = z.object({
  /**
   * Shipping address information
   */
  shippingAddress: z.object({
    /**
     * Recipient's first name
     */
    firstName: z
      .string({
        required_error: 'First name is required',
      })
      .min(1, 'First name is required')
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be less than 50 characters')
      .trim(),

    /**
     * Recipient's last name
     */
    lastName: z
      .string({
        required_error: 'Last name is required',
      })
      .min(1, 'Last name is required')
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be less than 50 characters')
      .trim(),

    /**
     * Street address
     */
    address: z
      .string({
        required_error: 'Address is required',
      })
      .min(1, 'Address is required')
      .min(5, 'Address must be at least 5 characters')
      .max(200, 'Address must be less than 200 characters')
      .trim(),

    /**
     * Apartment, suite, unit, etc. (optional)
     */
    apartment: z
      .string({
        invalid_type_error: 'Apartment must be a string',
      })
      .max(50, 'Apartment must be less than 50 characters')
      .trim()
      .optional(),

    /**
     * City
     */
    city: z
      .string({
        required_error: 'City is required',
      })
      .min(1, 'City is required')
      .min(2, 'City must be at least 2 characters')
      .max(100, 'City must be less than 100 characters')
      .trim(),

    /**
     * State or province
     */
    state: z
      .string({
        required_error: 'State is required',
      })
      .min(1, 'State is required')
      .min(2, 'State must be at least 2 characters')
      .max(100, 'State must be less than 100 characters')
      .trim(),

    /**
     * ZIP or postal code
     */
    zipCode: z
      .string({
        required_error: 'ZIP code is required',
      })
      .min(1, 'ZIP code is required')
      .min(3, 'ZIP code must be at least 3 characters')
      .max(20, 'ZIP code must be less than 20 characters')
      .trim(),

    /**
     * Country code (ISO 3166-1 alpha-2)
     */
    country: z
      .string({
        required_error: 'Country is required',
      })
      .min(1, 'Country is required')
      .length(2, 'Country must be a 2-letter code')
      .toUpperCase()
      .trim(),

    /**
     * Phone number for delivery
     */
    phone: z
      .string({
        required_error: 'Phone number is required',
      })
      .min(1, 'Phone number is required')
      .min(10, 'Phone number must be at least 10 characters')
      .max(20, 'Phone number must be less than 20 characters')
      .trim(),
  }),

  /**
   * Billing address (optional, defaults to shipping address if not provided)
   */
  billingAddress: z
    .object({
      firstName: z.string().min(1, 'First name is required').trim(),
      lastName: z.string().min(1, 'Last name is required').trim(),
      address: z.string().min(1, 'Address is required').trim(),
      apartment: z.string().max(50, 'Apartment must be less than 50 characters').trim().optional(),
      city: z.string().min(1, 'City is required').trim(),
      state: z.string().min(1, 'State is required').trim(),
      zipCode: z.string().min(1, 'ZIP code is required').trim(),
      country: z.string().length(2, 'Country must be a 2-letter code').toUpperCase().trim(),
    })
    .optional(),

  /**
   * Payment method
   */
  paymentMethod: z.enum(['credit-card', 'debit-card', 'paypal', 'apple-pay', 'google-pay'], {
    required_error: 'Payment method is required',
    invalid_type_error: 'Invalid payment method',
  }),

  /**
   * Credit card information (required for card payments)
   */
  cardInfo: z
    .object({
      /**
       * Card number (16 digits)
       */
      cardNumber: z
        .string({
          required_error: 'Card number is required',
        })
        .min(1, 'Card number is required')
        .regex(/^\d{16}$/, 'Card number must be 16 digits'),

      /**
       * Cardholder name
       */
      cardholderName: z
        .string({
          required_error: 'Cardholder name is required',
        })
        .min(1, 'Cardholder name is required')
        .min(2, 'Cardholder name must be at least 2 characters')
        .max(100, 'Cardholder name must be less than 100 characters')
        .trim(),

      /**
       * Expiry date (MM/YY format)
       */
      expiryDate: z
        .string({
          required_error: 'Expiry date is required',
        })
        .min(1, 'Expiry date is required')
        .regex(
          /^(0[1-9]|1[0-2])\/\d{2}$/,
          'Expiry date must be in MM/YY format',
        )
        .refine(
          (value) => {
            const [month, year] = value.split('/').map(Number);
            const now = new Date();
            const expiry = new Date(2000 + year, month - 1);
            return expiry > now;
          },
          'Card has expired',
        ),

      /**
       * CVV/CVC (3 or 4 digits)
       */
      cvv: z
        .string({
          required_error: 'CVV is required',
        })
        .min(1, 'CVV is required')
        .regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
    })
    .optional(),

  /**
   * Whether to save payment information for future use
   */
  savePaymentInfo: z.boolean().default(false),

  /**
   * Order notes (optional)
   */
  notes: z
    .string({
      invalid_type_error: 'Notes must be a string',
    })
    .max(500, 'Notes must be less than 500 characters')
    .trim()
    .optional(),
});

/**
 * Type for checkout form data
 */
export type CheckoutFormData = z.infer<typeof checkoutSchema>;

/**
 * Profile update validation schema
 * Validates user profile update data
 *
 * @example
 * ```ts
 * const result = profileSchema.safeParse({
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'user@example.com',
 *   phone: '+1234567890',
 * });
 * ```
 */
export const profileSchema = z.object({
  /**
   * User's first name
   */
  firstName: z
    .string({
      required_error: 'First name is required',
      invalid_type_error: 'First name must be a string',
    })
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .trim(),

  /**
   * User's last name
   */
  lastName: z
    .string({
      required_error: 'Last name is required',
      invalid_type_error: 'Last name must be a string',
    })
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .trim(),

  /**
   * User email address
   */
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .min(1, 'Email is required')
    .email('Invalid email address')
    .toLowerCase()
    .trim(),

  /**
   * User phone number (optional)
   */
  phone: z
    .string({
      invalid_type_error: 'Phone number must be a string',
    })
    .optional()
    .refine(
      (value) => !value || /^\+?[\d\s-()]+$/.test(value),
      'Invalid phone number format',
    ),

  /**
   * User date of birth (optional)
   */
  dateOfBirth: z
    .string({
      invalid_type_error: 'Date of birth must be a string',
    })
    .optional()
    .refine(
      (value) => !value || !isNaN(Date.parse(value)),
      'Invalid date format',
    )
    .refine(
      (value) => {
        if (!value) return true;
        const dob = new Date(value);
        const now = new Date();
        const age = now.getFullYear() - dob.getFullYear();
        return age >= 13 && age <= 120;
      },
      'You must be between 13 and 120 years old',
    ),

  /**
   * User bio (optional)
   */
  bio: z
    .string({
      invalid_type_error: 'Bio must be a string',
    })
    .max(500, 'Bio must be less than 500 characters')
    .trim()
    .optional(),
});

/**
 * Type for profile form data
 */
export type ProfileFormData = z.infer<typeof profileSchema>;

/**
 * Password change validation schema
 * Validates password change data
 *
 * @example
 * ```ts
 * const result = passwordChangeSchema.safeParse({
 *   currentPassword: 'OldPassword123!',
 *   newPassword: 'NewPassword123!',
 *   confirmPassword: 'NewPassword123!',
 * });
 * ```
 */
export const passwordChangeSchema = z
  .object({
    /**
     * Current password
     */
    currentPassword: z
      .string({
        required_error: 'Current password is required',
        invalid_type_error: 'Current password must be a string',
      })
      .min(1, 'Current password is required'),

    /**
     * New password
     * Must be at least 8 characters with at least one uppercase letter,
     * one lowercase letter, one number, and one special character
     */
    newPassword: z
      .string({
        required_error: 'New password is required',
        invalid_type_error: 'New password must be a string',
      })
      .min(1, 'New password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        'Password must contain at least one special character',
      ),

    /**
     * Confirm new password
     * Must match the new password field
     */
    confirmPassword: z
      .string({
        required_error: 'Please confirm your new password',
        invalid_type_error: 'Confirm password must be a string',
      })
      .min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

/**
 * Type for password change form data
 */
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

/**
 * Email validation helper
 * Validates an email address using a regex pattern
 *
 * @param email - The email address to validate
 * @returns True if the email is valid, false otherwise
 *
 * @example
 * ```ts
 * validateEmail('user@example.com') // true
 * validateEmail('invalid-email') // false
 * ```
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Password strength validation
 * Checks the strength of a password and returns a score
 *
 * @param password - The password to validate
 * @returns Object with strength score (0-4), label, and feedback
 *
 * @example
 * ```ts
 * validatePassword('password') // { score: 1, label: 'Weak', feedback: 'Add uppercase letters' }
 * validatePassword('Password123!') // { score: 4, label: 'Strong', feedback: '' }
 * ```
 */
export function validatePassword(password: string): {
  score: number;
  label: string;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  // Check length
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Use at least 8 characters');
  }

  // Check for lowercase letters
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add lowercase letters');
  }

  // Check for uppercase letters
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add uppercase letters');
  }

  // Check for numbers
  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add numbers');
  }

  // Check for special characters
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add special characters');
  }

  // Determine label based on score
  let label = 'Very Weak';
  if (score >= 4) {
    label = 'Strong';
  } else if (score === 3) {
    label = 'Good';
  } else if (score === 2) {
    label = 'Fair';
  } else if (score === 1) {
    label = 'Weak';
  }

  return {
    score,
    label,
    feedback,
  };
}

/**
 * Phone number validation helper
 * Validates a phone number using a regex pattern
 *
 * @param phone - The phone number to validate
 * @param countryCode - The country code for validation (default: 'US')
 * @returns True if the phone number is valid, false otherwise
 *
 * @example
 * ```ts
 * validatePhoneNumber('1234567890') // true
 * validatePhoneNumber('1234567890', 'GB') // false
 * ```
 */
export function validatePhoneNumber(phone: string, countryCode = 'US'): boolean {
  const cleaned = phone.replace(/\D/g, '');

  switch (countryCode) {
    case 'US':
      return cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith('1'));
    case 'GB':
      return cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith('0'));
    default:
      return cleaned.length >= 10 && cleaned.length <= 15;
  }
}

/**
 * ZIP code validation helper
 * Validates a ZIP/postal code based on country
 *
 * @param zipCode - The ZIP code to validate
 * @param countryCode - The country code (default: 'US')
 * @returns True if the ZIP code is valid, false otherwise
 *
 * @example
 * ```ts
 * validateZipCode('12345') // true
 * validateZipCode('12345', 'GB') // false
 * ```
 */
export function validateZipCode(zipCode: string, countryCode = 'US'): boolean {
  switch (countryCode) {
    case 'US':
      return /^\d{5}(-\d{4})?$/.test(zipCode);
    case 'GB':
      return /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(zipCode);
    case 'CA':
      return /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i.test(zipCode);
    default:
      return zipCode.length >= 3 && zipCode.length <= 20;
  }
}

/**
 * Credit card number validation helper
 * Validates a credit card number using the Luhn algorithm
 *
 * @param cardNumber - The credit card number to validate
 * @returns True if the card number is valid, false otherwise
 *
 * @example
 * ```ts
 * validateCreditCard('4111111111111111') // true (Visa test card)
 * validateCreditCard('1234567890123456') // false
 * ```
 */
export function validateCreditCard(cardNumber: string): boolean {
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '');

  // Check if it's all digits and has valid length
  if (!/^\d{13,19}$/.test(cleaned)) {
    return false;
  }

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * URL validation helper
 * Validates a URL string
 *
 * @param url - The URL to validate
 * @returns True if the URL is valid, false otherwise
 *
 * @example
 * ```ts
 * validateUrl('https://example.com') // true
 * validateUrl('not-a-url') // false
 * ```
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generic validation helper
 * Validates data against a Zod schema
 *
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns Object with success flag and error message if failed
 *
 * @example
 * ```ts
 * const result = validateData(loginSchema, { email: 'invalid', password: 'short' });
 * // { success: false, error: 'Invalid email address' }
 * ```
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): {
  success: boolean;
  data?: T;
  error?: string;
  errors?: z.ZodError;
} {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  // Get the first error message
  const firstError = result.error.errors[0];
  return {
    success: false,
    error: firstError?.message || 'Validation failed',
    errors: result.error,
  };
}
