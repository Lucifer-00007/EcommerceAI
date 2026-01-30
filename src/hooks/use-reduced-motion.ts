/**
 * useReducedMotion Hook
 *
 * Detects user's preference for reduced motion (accessibility).
 * Returns true if the user has requested reduced motion.
 *
 * @module hooks
 * @see https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html
 */

import { useEffect, useState } from "react";

/**
 * Hook to detect prefers-reduced-motion media query
 *
 * Safely handles SSR by only accessing window in useEffect.
 * Updates automatically when the preference changes.
 *
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const prefersReducedMotion = useReducedMotion();
 *
 *   return (
 *     <motion.div
 *       animate={prefersReducedMotion ? {} : { opacity: 1 }}
 *       initial={prefersReducedMotion ? {} : { opacity: 0 }}
 *     >
 *       Content
 *     </motion.div>
 *   );
 * }
 * ```
 *
 * @returns {boolean} True if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Add listener (handle both old and new APIs for compatibility)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
}

export default useReducedMotion;
