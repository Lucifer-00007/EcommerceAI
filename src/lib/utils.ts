import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 * 
 * @param inputs - Class values to merge (strings, objects, arrays)
 * @returns Merged class string
 * 
 * @example
 * cn("px-2 py-1", "px-4") // Returns "py-1 px-4" (px-2 is overridden by px-4)
 * cn("base-class", isActive && "active-class") // Returns "base-class active-class" when isActive is true
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
