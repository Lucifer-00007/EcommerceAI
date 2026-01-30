'use client';

// Theme Provider component
// Manages dark/light theme state with system preference detection and LocalStorage persistence

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

/**
 * Theme type
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Theme Provider context interface
 */
interface ThemeProviderContext {
  /** Current theme */
  theme: Theme;
  /** Set theme function */
  setTheme: (theme: Theme) => void;
  /** Actual resolved theme (light or dark) */
  resolvedTheme: 'light' | 'dark';
}

/**
 * Theme Provider context
 */
const ThemeProviderContext = createContext<ThemeProviderContext | undefined>(undefined);

/**
 * Theme Provider props
 */
interface ThemeProviderProps {
  /** Child components to wrap */
  children: ReactNode;
  /** Default theme (default: 'system') */
  defaultTheme?: Theme;
  /** Storage key for LocalStorage (default: 'theme') */
  storageKey?: string;
}

/**
 * Theme Provider component
 * Manages theme state with system preference detection and LocalStorage persistence
 */
export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme | null;
    const initialTheme = storedTheme || defaultTheme;
    setThemeState(initialTheme);
    setMounted(true);
  }, [defaultTheme, storageKey]);

  // Resolve theme based on system preference
  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    let resolved: 'light' | 'dark';

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      resolved = systemTheme;
    } else {
      resolved = theme;
    }

    root.classList.add(resolved);
    setResolvedTheme(resolved);
  }, [theme, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      const newTheme = e.matches ? 'dark' : 'light';
      root.classList.add(newTheme);
      setResolvedTheme(newTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  /**
   * Set theme function
   * Updates theme state and persists to LocalStorage
   */
  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);
  };

  // Prevent flash of incorrect theme
  if (!mounted) {
    return <>{children}</>;
  }

  const value: ThemeProviderContext = {
    theme,
    setTheme,
    resolvedTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

/**
 * Hook to use theme context
 * @throws Error if used outside ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
