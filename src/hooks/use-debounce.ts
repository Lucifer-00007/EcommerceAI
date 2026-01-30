// use-debounce hook
// Custom hook for debouncing values

import { useEffect, useState } from 'react';

/**
 * Custom hook for debouncing a value
 * Delays updating the returned value until after a specified delay has passed
 * since the last time the value changed
 *
 * @template T - The type of the value to debounce
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (default: 500)
 * @returns The debounced value
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 * useEffect(() => {
 *   // This will only run 500ms after searchTerm stops changing
 *   if (debouncedSearchTerm) {
 *     performSearch(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 * ```
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value changes before the delay has passed
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for debouncing a value with immediate callback execution
 * Executes the callback immediately on the first change, then debounces subsequent changes
 *
 * @template T - The type of the value to debounce
 * @param value - The value to debounce
 * @param callback - The callback to execute
 * @param delay - The delay in milliseconds (default: 500)
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 *
 * useDebounceWithCallback(searchTerm, (term) => {
 *   performSearch(term);
 * }, 500);
 * ```
 */
export function useDebounceWithCallback<T>(
  value: T,
  callback: (value: T) => void,
  delay = 500,
): void {
  const [firstRun, setFirstRun] = useState(true);

  useEffect(() => {
    if (firstRun) {
      // Execute immediately on first run
      callback(value);
      setFirstRun(false);
      return;
    }

    // Debounce subsequent changes
    const timer = setTimeout(() => {
      callback(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay, callback, firstRun]);
}

/**
 * Custom hook for debouncing a function
 * Returns a debounced version of the provided function
 *
 * @template T - The function type to debounce
 * @param func - The function to debounce
 * @param delay - The delay in milliseconds (default: 500)
 * @returns The debounced function
 *
 * @example
 * ```tsx
 * const debouncedSearch = useDebounceFn((term: string) => {
 *   performSearch(term);
 * }, 500);
 *
 * <input onChange={(e) => debouncedSearch(e.target.value)} />
 * ```
 */
export function useDebounceFn<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay = 500,
): T {
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      // Clean up any pending timeout on unmount
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return ((...args: Parameters<T>) => {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout
    const newTimeoutId = setTimeout(() => {
      func(...args);
    }, delay);

    setTimeoutId(newTimeoutId);
  }) as T;
}

/**
 * Custom hook for debouncing with leading edge execution
 * Executes the callback immediately, then debounces subsequent calls
 *
 * @template T - The function type to debounce
 * @param func - The function to debounce
 * @param delay - The delay in milliseconds (default: 500)
 * @returns The debounced function
 *
 * @example
 * ```tsx
 * const debouncedSearch = useDebounceLeading((term: string) => {
 *   performSearch(term);
 * }, 500);
 * ```
 */
export function useDebounceLeading<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay = 500,
): T {
  const [lastCallTime, setLastCallTime] = useState<number>(0);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return ((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;

    if (timeSinceLastCall >= delay) {
      // Execute immediately if enough time has passed
      func(...args);
      setLastCallTime(now);
    } else {
      // Debounce if called too soon
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const newTimeoutId = setTimeout(() => {
        func(...args);
        setLastCallTime(Date.now());
      }, delay - timeSinceLastCall);

      setTimeoutId(newTimeoutId);
    }
  }) as T;
}

/**
 * Custom hook for throttling a value
 * Updates the returned value at most once every specified delay
 *
 * @template T - The type of the value to throttle
 * @param value - The value to throttle
 * @param delay - The delay in milliseconds (default: 500)
 * @returns The throttled value
 *
 * @example
 * ```tsx
 * const [scrollPosition, setScrollPosition] = useState(0);
 * const throttledScrollPosition = useThrottle(scrollPosition, 100);
 * ```
 */
export function useThrottle<T>(value: T, delay = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdated;

    if (timeSinceLastUpdate >= delay) {
      // Update immediately if enough time has passed
      setThrottledValue(value);
      setLastUpdated(now);
    } else {
      // Schedule update for later
      const timer = setTimeout(() => {
        setThrottledValue(value);
        setLastUpdated(Date.now());
      }, delay - timeSinceLastUpdate);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [value, delay, lastUpdated]);

  return throttledValue;
}
