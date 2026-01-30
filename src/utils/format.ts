// Formatting utilities
// Helper functions for formatting data (currency, dates, etc.)

/**
 * Format a price with currency symbol
 * @param price - The price to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale for formatting (default: 'en-US')
 * @returns Formatted price string
 *
 * @example
 * ```ts
 * formatPrice(1234.56) // "$1,234.56"
 * formatPrice(1234.56, 'EUR', 'de-DE') // "1.234,56 €"
 * ```
 */
export function formatPrice(
  price: number,
  currency = 'USD',
  locale = 'en-US',
): string {
  if (typeof price !== 'number' || isNaN(price)) {
    return `$0.00`;
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Format a price with discount percentage
 * Shows original price with strikethrough and current price with discount badge
 * @param price - The current price
 * @param originalPrice - The original price before discount
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale for formatting (default: 'en-US')
 * @returns Object with formatted prices and discount percentage
 *
 * @example
 * ```ts
 * formatPriceWithDiscount(80, 100)
 * // { currentPrice: "$80.00", originalPrice: "$100.00", discount: "20%" }
 * ```
 */
export function formatPriceWithDiscount(
  price: number,
  originalPrice: number,
  currency = 'USD',
  locale = 'en-US',
): {
  currentPrice: string;
  originalPrice: string;
  discount: string;
  discountAmount: string;
} {
  if (typeof price !== 'number' || isNaN(price)) {
    return {
      currentPrice: formatPrice(0, currency, locale),
      originalPrice: formatPrice(0, currency, locale),
      discount: '0%',
      discountAmount: formatPrice(0, currency, locale),
    };
  }

  const discountPercentage =
    originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;
  const discountAmount = originalPrice - price;

  return {
    currentPrice: formatPrice(price, currency, locale),
    originalPrice: formatPrice(originalPrice, currency, locale),
    discount: `${discountPercentage}%`,
    discountAmount: formatPrice(discountAmount, currency, locale),
  };
}

/**
 * Format a date to a readable string
 * @param date - The date to format (Date object, timestamp, or ISO string)
 * @param locale - The locale for formatting (default: 'en-US')
 * @returns Formatted date string
 *
 * @example
 * ```ts
 * formatDate(new Date('2024-01-15')) // "January 15, 2024"
 * formatDate(1705276800000) // "January 15, 2024"
 * ```
 */
export function formatDate(
  date: Date | string | number,
  locale = 'en-US',
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Format a date and time to a readable string
 * @param date - The date to format (Date object, timestamp, or ISO string)
 * @param locale - The locale for formatting (default: 'en-US')
 * @param includeSeconds - Whether to include seconds (default: false)
 * @returns Formatted date and time string
 *
 * @example
 * ```ts
 * formatDateTime(new Date('2024-01-15T14:30:00')) // "January 15, 2024 at 2:30 PM"
 * formatDateTime(new Date('2024-01-15T14:30:00'), 'en-US', true) // "January 15, 2024 at 2:30:00 PM"
 * ```
 */
export function formatDateTime(
  date: Date | string | number,
  locale = 'en-US',
  includeSeconds = false,
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: includeSeconds ? 'numeric' : undefined,
  }).format(dateObj);
}

/**
 * Format a date to a short string (e.g., "Jan 15, 2024")
 * @param date - The date to format (Date object, timestamp, or ISO string)
 * @param locale - The locale for formatting (default: 'en-US')
 * @returns Formatted short date string
 *
 * @example
 * ```ts
 * formatShortDate(new Date('2024-01-15')) // "Jan 15, 2024"
 * ```
 */
export function formatShortDate(
  date: Date | string | number,
  locale = 'en-US',
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Format a date to a relative time string (e.g., "2 hours ago")
 * @param date - The date to format (Date object, timestamp, or ISO string)
 * @param locale - The locale for formatting (default: 'en-US')
 * @returns Relative time string
 *
 * @example
 * ```ts
 * formatRelativeTime(new Date(Date.now() - 3600000)) // "1 hour ago"
 * formatRelativeTime(new Date(Date.now() - 86400000)) // "1 day ago"
 * ```
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale = 'en-US',
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
  }
}

/**
 * Format a number with commas
 * @param num - The number to format
 * @param locale - The locale for formatting (default: 'en-US')
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted number string
 *
 * @example
 * ```ts
 * formatNumber(1234567) // "1,234,567"
 * formatNumber(1234.5678, 'en-US', 2) // "1,234.57"
 * ```
 */
export function formatNumber(
  num: number,
  locale = 'en-US',
  decimals = 0,
): string {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0';
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format a rating with stars
 * @param rating - The rating value (0-5)
 * @param maxRating - The maximum rating (default: 5)
 * @returns Object with star representation and formatted rating
 *
 * @example
 * ```ts
 * formatRating(4.5)
 * // { stars: "★★★★½", fullStars: 4, halfStar: true, emptyStars: 0, formatted: "4.5" }
 * ```
 */
export function formatRating(
  rating: number,
  maxRating = 5,
): {
  stars: string;
  fullStars: number;
  halfStar: boolean;
  emptyStars: number;
  formatted: string;
} {
  const clampedRating = Math.max(0, Math.min(maxRating, rating));
  const fullStars = Math.floor(clampedRating);
  const hasHalfStar = clampedRating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  const stars =
    '★'.repeat(fullStars) + (hasHalfStar ? '½' : '') + '☆'.repeat(emptyStars);

  return {
    stars,
    fullStars,
    halfStar: hasHalfStar,
    emptyStars,
    formatted: clampedRating.toFixed(1),
  };
}

/**
 * Format a percentage
 * @param value - The value to format as percentage (0-1 or 0-100)
 * @param decimals - Number of decimal places (default: 1)
 * @param locale - The locale for formatting (default: 'en-US')
 * @returns Formatted percentage string
 *
 * @example
 * ```ts
 * formatPercentage(0.75) // "75%"
 * formatPercentage(75, 1) // "75.0%"
 * ```
 */
export function formatPercentage(
  value: number,
  decimals = 1,
  locale = 'en-US',
): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0%';
  }

  // If value is greater than 1, assume it's already a percentage
  const normalizedValue = value > 1 ? value / 100 : value;

  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(normalizedValue);
}

/**
 * Format a file size
 * @param bytes - The file size in bytes
 * @param locale - The locale for formatting (default: 'en-US')
 * @returns Formatted file size string
 *
 * @example
 * ```ts
 * formatFileSize(1024) // "1 KB"
 * formatFileSize(1048576) // "1 MB"
 * formatFileSize(1073741824) // "1 GB"
 * ```
 */
export function formatFileSize(bytes: number, locale = 'en-US'): string {
  if (typeof bytes !== 'number' || isNaN(bytes) || bytes < 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const size = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, size);

  return `${formatNumber(value, locale, size === 0 ? 0 : 2)} ${units[size]}`;
}

/**
 * Format a phone number
 * @param phone - The phone number to format
 * @param countryCode - The country code (default: 'US')
 * @returns Formatted phone number string
 *
 * @example
 * ```ts
 * formatPhoneNumber('1234567890') // "(123) 456-7890"
 * formatPhoneNumber('1234567890', 'GB') // "0123 456 7890"
 * ```
 */
export function formatPhoneNumber(phone: string, countryCode = 'US'): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 0) {
    return '';
  }

  switch (countryCode) {
    case 'US':
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      }
      if (cleaned.length === 11 && cleaned.startsWith('1')) {
        return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
      }
      break;
    case 'GB':
      if (cleaned.length === 10) {
        return `0${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
      }
      if (cleaned.length === 11 && cleaned.startsWith('0')) {
        return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
      }
      break;
    default:
      break;
  }

  // Return original if no format matches
  return phone;
}

/**
 * Truncate text to a specified length
 * @param text - The text to truncate
 * @param maxLength - The maximum length
 * @param suffix - The suffix to add (default: '...')
 * @returns Truncated text
 *
 * @example
 * ```ts
 * truncateText('Hello world', 5) // "Hello..."
 * truncateText('Hello world', 8, '...') // "Hello..."
 * ```
 */
export function truncateText(
  text: string,
  maxLength: number,
  suffix = '...',
): string {
  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitalize the first letter of a string
 * @param text - The text to capitalize
 * @returns Capitalized text
 *
 * @example
 * ```ts
 * capitalize('hello') // "Hello"
 * capitalize('hello world') // "Hello world"
 * ```
 */
export function capitalize(text: string): string {
  if (!text) {
    return '';
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Convert a string to title case
 * @param text - The text to convert
 * @returns Title case text
 *
 * @example
 * ```ts
 * toTitleCase('hello world') // "Hello World"
 * toTitleCase('HELLO WORLD') // "Hello World"
 * ```
 */
export function toTitleCase(text: string): string {
  if (!text) {
    return '';
  }

  return text
    .toLowerCase()
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
}

/**
 * Format a duration in milliseconds to a readable string
 * @param milliseconds - The duration in milliseconds
 * @returns Formatted duration string
 *
 * @example
 * ```ts
 * formatDuration(3600000) // "1h"
 * formatDuration(3661000) // "1h 1m 1s"
 * formatDuration(1000) // "1s"
 * ```
 */
export function formatDuration(milliseconds: number): string {
  if (typeof milliseconds !== 'number' || isNaN(milliseconds) || milliseconds < 0) {
    return '0s';
  }

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days}d`);
  }
  if (hours % 24 > 0) {
    parts.push(`${hours % 24}h`);
  }
  if (minutes % 60 > 0) {
    parts.push(`${minutes % 60}m`);
  }
  if (seconds % 60 > 0 || parts.length === 0) {
    parts.push(`${seconds % 60}s`);
  }

  return parts.join(' ');
}
