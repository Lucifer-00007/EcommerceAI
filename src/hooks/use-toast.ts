'use client';

// Toast hooks
// Custom hooks for managing toast notifications

import { useState, useCallback } from 'react';

/**
 * Toast data interface
 */
export interface Toast {
  /** Unique identifier for the toast */
  id: string;
  /** Toast title */
  title?: string;
  /** Toast description/message */
  description?: string;
  /** Toast variant */
  variant?: 'default' | 'destructive';
  /** Action button element */
  action?: React.ReactNode;
}

/**
 * Global toast state (simplified implementation)
 */
let toastState: Toast[] = [];
const toastListeners: Set<() => void> = new Set();

/**
 * Add a toast listener
 */
function addToastListener(listener: () => void) {
  toastListeners.add(listener);
  return () => toastListeners.delete(listener);
}

/**
 * Notify all listeners of state change
 */
function notifyListeners() {
  toastListeners.forEach((listener) => listener());
}

/**
 * Dispatch a toast
 */
function dispatchToast(props: Omit<Toast, 'id'>) {
  const id = Math.random().toString(36).substring(2, 9);
  toastState = [...toastState, { ...props, id }];
  notifyListeners();

  // Auto-remove toast after 5 seconds
  setTimeout(() => {
    toastState = toastState.filter((t) => t.id !== id);
    notifyListeners();
  }, 5000);
  
  return id;
}

/**
 * Hook to access toast functionality
 * @returns Toast functions for showing notifications
 */
export function useToast() {
  const [, forceUpdate] = useState({});

  // Subscribe to toast changes
  useState(() => {
    return addToastListener(() => {
      forceUpdate({});
    });
  });

  return {
    toasts: toastState,
    addToast: useCallback((toast: Omit<Toast, 'id'>) => {
      dispatchToast(toast);
    }, []),
    removeToast: useCallback((id: string) => {
      toastState = toastState.filter((t) => t.id !== id);
      notifyListeners();
    }, []),
  };
}

/**
 * Toast utility function type
 */
interface ToastFunction {
  (props: Omit<Toast, 'id'>): string;
  success: (props: Omit<Toast, 'id'>) => string;
  error: (props: Omit<Toast, 'id'>) => string;
  info: (props: Omit<Toast, 'id'>) => string;
}

/**
 * Toast utility functions
 * Convenience functions for showing different types of toasts
 */
export const toast = ((props: Omit<Toast, 'id'>) => {
  return dispatchToast(props);
}) as ToastFunction;

toast.success = (props: Omit<Toast, 'id'>) => {
  return dispatchToast({ ...props, variant: 'default' });
};

toast.error = (props: Omit<Toast, 'id'>) => {
  return dispatchToast({ ...props, variant: 'destructive' });
};

toast.info = (props: Omit<Toast, 'id'>) => {
  return dispatchToast({ ...props, variant: 'default' });
};