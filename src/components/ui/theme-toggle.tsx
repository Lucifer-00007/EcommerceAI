'use client';

// Theme Toggle component
// Reusable dark mode toggle button with sun/moon icons

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/providers/theme-provider';
import { useEffect, useState } from 'react';

/**
 * Theme Toggle component props
 */
interface ThemeToggleProps {
  /** Additional CSS classes */
  className?: string;
  /** Button variant (default: 'ghost') */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  /** Button size (default: 'icon') */
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

/**
 * Theme Toggle component
 * Displays a button to toggle between light and dark themes
 * Shows appropriate icon based on current theme (sun/moon)
 */
export function ThemeToggle({
  className = '',
  variant = 'ghost',
  size = 'icon',
}: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid SSR issues
  if (!mounted) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="h-5 w-5" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  /**
   * Toggle theme function
   * Cycles through light -> dark -> system
   */
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  /**
   * Get icon based on resolved theme
   */
  const Icon = resolvedTheme === 'dark' ? Sun : Moon;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={className}
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Current theme: ${theme}. Click to switch.`}
    >
      <Icon className="h-5 w-5" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
