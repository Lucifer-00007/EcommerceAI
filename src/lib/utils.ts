import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines multiple class names using clsx and tailwind-merge
 * This allows for conditional classes and proper Tailwind CSS merging
 * 
 * @example
 * cn('text-red-500', 'bg-blue-500', { 'opacity-50': isDisabled })
 * // Returns: 'text-red-500 bg-blue-500 opacity-50' (if isDisabled is true)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as currency
 * 
 * @param amount - The amount to format
 * @param currency - The currency code (default: USD)
 * @param locale - The locale to use (default: en-US)
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(99.99) // Returns: "$99.99"
 * formatCurrency(99.99, 'EUR', 'de-DE') // Returns: "99,99 €"
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Formats a date string or Date object to a localized date string
 * 
 * @param date - The date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 * 
 * @example
 * formatDate(new Date()) // Returns: "1/30/2026"
 * formatDate(new Date(), { dateStyle: 'long' }) // Returns: "January 30, 2026"
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', options).format(d)
}

/**
 * Truncates a string to a specified length with an ellipsis
 * 
 * @param str - The string to truncate
 * @param length - Maximum length before truncation
 * @returns Truncated string
 * 
 * @example
 * truncate('Hello World', 5) // Returns: "Hello..."
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length).trim() + '...'
}

/**
 * Generates a unique ID
 * Useful for React keys when you don't have a stable ID
 * 
 * @returns Unique string ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

/**
 * Debounces a function call
 * 
 * @param fn - The function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 * 
 * @example
 * const debouncedSearch = debounce((query) => searchAPI(query), 300)
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Creates a slug from a string
 * Converts to lowercase, removes special characters, replaces spaces with hyphens
 * 
 * @param str - The string to slugify
 * @returns URL-friendly slug
 * 
 * @example
 * slugify('Hello World!') // Returns: "hello-world"
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Calculates the discount percentage between original and sale price
 * 
 * @param originalPrice - Original price
 * @param salePrice - Sale price
 * @returns Discount percentage (0-100)
 * 
 * @example
 * calculateDiscount(100, 75) // Returns: 25
 */
export function calculateDiscount(originalPrice: number, salePrice: number): number {
  if (originalPrice <= 0 || salePrice >= originalPrice) return 0
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

/**
 * Groups an array of items by a key function
 * 
 * @param array - Array to group
 * @param keyFn - Function to extract the key from each item
 * @returns Object with keys mapped to arrays of items
 * 
 * @example
 * groupBy([{category: 'A', name: 'Item 1'}, {category: 'B', name: 'Item 2'}], item => item.category)
 * // Returns: { A: [{category: 'A', name: 'Item 1'}], B: [{category: 'B', name: 'Item 2'}] }
 */
export function groupBy<T>(
  array: T[],
  keyFn: (item: T) => string
): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item)
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
    return groups
  }, {} as Record<string, T[]>)
}
