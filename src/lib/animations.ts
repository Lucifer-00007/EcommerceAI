/**
 * Animation Variants with Reduced Motion Support
 *
 * Provides animation configurations that respect user preferences
 * for reduced motion (WCAG 2.2.2 compliance).
 *
 * These configurations can be used with CSS transitions or
 * any animation library (Framer Motion, GSAP, etc.).
 *
 * @module lib/animations
 * @see https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html
 */

/**
 * Animation variant types for common UI transitions
 */
export type AnimationVariant =
  | "fadeIn"
  | "fadeInUp"
  | "fadeInDown"
  | "fadeInLeft"
  | "fadeInRight"
  | "scale"
  | "scaleIn"
  | "slideIn"
  | "slideUp"
  | "slideDown"
  | "none";

/**
 * Animation state type
 */
export type AnimationState = "hidden" | "visible" | "exit";

/**
 * Duration constants for consistent animation timing (in seconds)
 */
export const durations = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
} as const;

/**
 * Easing functions for smooth animations
 * CSS cubic-bezier values
 */
export const easings = {
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

/**
 * Base animation configuration interface
 */
export interface AnimationConfig {
  /** Initial styles when hidden */
  hidden: React.CSSProperties;
  /** Styles when visible/animated */
  visible: React.CSSProperties;
  /** Styles when exiting */
  exit: React.CSSProperties;
  /** Transition configuration */
  transition: {
    duration: number;
    ease: string;
  };
}

/**
 * Fade in animation configuration
 * Simple opacity transition
 */
export const fadeIn: AnimationConfig = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    duration: durations.normal,
    ease: easings.easeOut,
  },
};

/**
 * Fade in with upward slide animation
 * Good for content that appears below the fold
 */
export const fadeInUp: AnimationConfig = {
  hidden: { opacity: 0, transform: "translateY(20px)" },
  visible: { opacity: 1, transform: "translateY(0)" },
  exit: { opacity: 0, transform: "translateY(10px)" },
  transition: {
    duration: durations.normal,
    ease: easings.easeOut,
  },
};

/**
 * Fade in with downward slide animation
 * Good for dropdowns and overlays from top
 */
export const fadeInDown: AnimationConfig = {
  hidden: { opacity: 0, transform: "translateY(-20px)" },
  visible: { opacity: 1, transform: "translateY(0)" },
  exit: { opacity: 0, transform: "translateY(-10px)" },
  transition: {
    duration: durations.normal,
    ease: easings.easeOut,
  },
};

/**
 * Scale animation configuration
 * Good for modals, dialogs, and popovers
 */
export const scale: AnimationConfig = {
  hidden: { opacity: 0, transform: "scale(0.95)" },
  visible: { opacity: 1, transform: "scale(1)" },
  exit: { opacity: 0, transform: "scale(0.95)" },
  transition: {
    duration: durations.normal,
    ease: easings.easeOut,
  },
};

/**
 * Scale in animation with slight bounce effect
 * Good for buttons and interactive elements
 */
export const scaleIn: AnimationConfig = {
  hidden: { opacity: 0, transform: "scale(0.8)" },
  visible: { opacity: 1, transform: "scale(1)" },
  exit: { opacity: 0, transform: "scale(0.8)" },
  transition: {
    duration: durations.fast,
    ease: easings.easeOut,
  },
};

/**
 * Slide in from right animation
 * Good for side panels and drawers
 */
export const slideIn: AnimationConfig = {
  hidden: { opacity: 0, transform: "translateX(100%)" },
  visible: { opacity: 1, transform: "translateX(0)" },
  exit: { opacity: 0, transform: "translateX(100%)" },
  transition: {
    duration: durations.slow,
    ease: easings.easeOut,
  },
};

/**
 * Slide up animation
 * Good for bottom sheets and modals
 */
export const slideUp: AnimationConfig = {
  hidden: { opacity: 0, transform: "translateY(100%)" },
  visible: { opacity: 1, transform: "translateY(0)" },
  exit: { opacity: 0, transform: "translateY(100%)" },
  transition: {
    duration: durations.slow,
    ease: easings.easeOut,
  },
};

/**
 * Slide down animation
 * Good for dropdown menus
 */
export const slideDown: AnimationConfig = {
  hidden: { opacity: 0, transform: "translateY(-10px)" },
  visible: { opacity: 1, transform: "translateY(0)" },
  exit: { opacity: 0, transform: "translateY(-10px)" },
  transition: {
    duration: durations.fast,
    ease: easings.easeOut,
  },
};

/**
 * Stagger container configuration for animating children
 */
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    duration: durations.normal,
    ease: easings.easeOut,
  },
  /** Delay between each child animation (in seconds) */
  staggerChildren: 0.1,
  /** Initial delay before starting animations (in seconds) */
  delayChildren: 0.1,
};

/**
 * Stagger item for use within stagger container
 */
export const staggerItem: AnimationConfig = {
  hidden: { opacity: 0, transform: "translateY(20px)" },
  visible: { opacity: 1, transform: "translateY(0)" },
  exit: { opacity: 0, transform: "translateY(10px)" },
  transition: {
    duration: durations.normal,
    ease: easings.easeOut,
  },
};

/**
 * No animation configuration for reduced motion preference
 * Instantly shows/hides without transition
 */
export const noAnimation: AnimationConfig = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    duration: 0,
    ease: easings.easeOut,
  },
};

/**
 * Get animation configuration based on reduced motion preference
 *
 * @param variant - The animation variant to use
 * @param reducedMotion - Whether reduced motion is preferred
 * @returns The appropriate animation configuration
 *
 * @example
 * ```tsx
 * import { useReducedMotion } from "@/hooks/use-reduced-motion";
 * import { getAnimationVariant } from "@/lib/animations";
 *
 * function AnimatedComponent() {
 *   const prefersReducedMotion = useReducedMotion();
 *   const animation = getAnimationVariant("fadeInUp", prefersReducedMotion);
 *
 *   return (
 *     <div
 *       style={{
 *         ...animation.visible,
 *         transition: `all ${animation.transition.duration}s ${animation.transition.ease}`
 *       }}
 *     >
 *       Content
 *     </div>
 *   );
 * }
 * ```
 */
export function getAnimationVariant(
  variant: AnimationVariant,
  reducedMotion: boolean = false
): AnimationConfig {
  if (reducedMotion) {
    return noAnimation;
  }

  const variants: Record<AnimationVariant, AnimationConfig> = {
    fadeIn,
    fadeInUp,
    fadeInDown,
    fadeInLeft: fadeInUp,
    fadeInRight: fadeInUp,
    scale,
    scaleIn,
    slideIn,
    slideUp,
    slideDown,
    none: noAnimation,
  };

  return variants[variant] || fadeIn;
}

/**
 * Get CSS transition string for an animation config
 *
 * @param config - Animation configuration
 * @param properties - CSS properties to animate (default: "all")
 * @returns CSS transition string
 *
 * @example
 * ```tsx
 * const animation = getAnimationVariant("fadeInUp", false);
 * const transition = getTransitionString(animation, "opacity, transform");
 * // Returns: "opacity, transform 0.3s cubic-bezier(0, 0, 0.2, 1)"
 * ```
 */
export function getTransitionString(
  config: AnimationConfig,
  properties: string = "all"
): string {
  return `${properties} ${config.transition.duration}s ${config.transition.ease}`;
}

/**
 * Default transition settings
 */
export const defaultTransition = {
  duration: durations.normal,
  ease: easings.easeOut,
};

/**
 * CSS class strings for common transitions
 * Can be used with Tailwind's transition utilities
 */
export const transitionClasses = {
  /** Fast transition for hover states */
  fast: "transition-all duration-150 ease-out",
  /** Normal transition for most UI elements */
  normal: "transition-all duration-300 ease-out",
  /** Slow transition for page transitions */
  slow: "transition-all duration-500 ease-out",
  /** Reduced motion - instant changes */
  reduced: "transition-none",
} as const;

/**
 * Get appropriate transition class based on reduced motion preference
 *
 * @param speed - Transition speed (fast, normal, slow)
 * @param reducedMotion - Whether reduced motion is preferred
 * @returns Tailwind transition class string
 *
 * @example
 * ```tsx
 * import { useReducedMotion } from "@/hooks/use-reduced-motion";
 * import { getTransitionClass } from "@/lib/animations";
 *
 * function Button() {
 *   const prefersReducedMotion = useReducedMotion();
 *   const transitionClass = getTransitionClass("normal", prefersReducedMotion);
 *
 *   return (
 *     <button className={`${transitionClass} hover:scale-105`}>
 *       Click me
 *     </button>
 *   );
 * }
 * ```
 */
export function getTransitionClass(
  speed: "fast" | "normal" | "slow" = "normal",
  reducedMotion: boolean = false
): string {
  if (reducedMotion) {
    return transitionClasses.reduced;
  }
  return transitionClasses[speed];
}
