/**
 * Toast Component
 * 
 * A notification component for displaying temporary messages to users.
 * Built on Radix UI's Toast primitive for accessibility and animations.
 * 
 * Features:
 * - Auto-dismiss with configurable duration
 * - Multiple variants (default, success, error, warning, info)
 * - Keyboard accessible (can be dismissed with Escape)
 * - Screen reader announcements
 * - Action button support
 */

'use client'

import * as React from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { cva, type VariantProps } from 'class-variance-authority'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================================
// CONTEXT
// ============================================================================

/**
 * Toast context for managing toast state globally
 */
interface ToastContextType {
  toasts: ToastProps[]
  addToast: (toast: Omit<ToastProps, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

/**
 * Hook to access toast context
 */
export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// ============================================================================
// PROVIDER
// ============================================================================

/**
 * Toast provider component
 * Wrap your app with this to enable toast notifications
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const addToast = React.useCallback((toast: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        <ToastViewport />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  )
}

// ============================================================================
// VIEWPORT
// ============================================================================

/**
 * Toast viewport - the container where toasts appear
 * Fixed position at the bottom-right of the screen
 */
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      'fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitive.Viewport.displayName

// ============================================================================
// STYLES
// ============================================================================

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        success: 'border-green-500 bg-green-50 text-green-900 dark:bg-green-900 dark:text-green-50',
        error: 'border-destructive bg-destructive text-destructive-foreground',
        warning: 'border-yellow-500 bg-yellow-50 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-50',
        info: 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-900 dark:text-blue-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

// ============================================================================
// TYPES
// ============================================================================

interface ToastProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>,
  VariantProps<typeof toastVariants> {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Individual toast component
 */
const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  ToastProps
>(({ className, variant, title, description, action, ...props }, ref) => {
  // Icon based on variant
  const Icon = {
    default: Info,
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }[variant || 'default']

  return (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="grid gap-1">
          {title && (
            <ToastPrimitive.Title className="text-sm font-semibold">
              {title}
            </ToastPrimitive.Title>
          )}
          {description && (
            <ToastPrimitive.Description className="text-sm opacity-90">
              {description}
            </ToastPrimitive.Description>
          )}
        </div>
      </div>
      {action && (
        <ToastPrimitive.Action altText="Action" asChild>
          {action}
        </ToastPrimitive.Action>
      )}
      <ToastPrimitive.Close
        className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  )
})
Toast.displayName = ToastPrimitive.Root.displayName

// ============================================================================
// TOAST CONTAINER
// ============================================================================

/**
 * Component that renders all active toasts
 * Place this inside your ToastProvider
 */
export function Toasts() {
  const { toasts, removeToast } = useToast()

  return (
    <>
      {toasts.map(({ id, ...props }) => (
        <Toast
          key={id}
          {...props}
          onOpenChange={(open) => {
            if (!open) removeToast(id)
          }}
        />
      ))}
    </>
  )
}

// ============================================================================
// HOOK FOR SHOWING TOASTS
// ============================================================================

/**
 * Hook for showing toast notifications
 * 
 * @example
 * const toast = useShowToast()
 * 
 * // Show success toast
 * toast.success('Item saved!')
 * 
 * // Show error toast
 * toast.error('Something went wrong')
 * 
 * // Show custom toast
 * toast.show({
 *   title: 'Custom Toast',
 *   description: 'This is a custom message',
 *   variant: 'info'
 * })
 */
export function useShowToast() {
  const { addToast } = useToast()

  return {
    show: addToast,
    success: (message: string, title?: string) =>
      addToast({ variant: 'success', title: title || 'Success', description: message }),
    error: (message: string, title?: string) =>
      addToast({ variant: 'error', title: title || 'Error', description: message }),
    warning: (message: string, title?: string) =>
      addToast({ variant: 'warning', title: title || 'Warning', description: message }),
    info: (message: string, title?: string) =>
      addToast({ variant: 'info', title: title || 'Info', description: message }),
  }
}

export { Toast, ToastViewport }
