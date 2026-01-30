# Animation & Motion Design Specification

## E-Commerce Next.js Application - WCAG 2.1 Compliant Animation Guidelines

---

## 1. Animation Philosophy & Principles

### 1.1 Purposeful Motion Only

Animation in this e-commerce application serves functional purposes only. Every animation must:

- **Communicate state changes**: Indicate when UI elements appear, disappear, or change status
- **Provide spatial awareness**: Help users understand where elements come from and where they go
- **Guide attention**: Direct focus to important actions or information
- **Reinforce feedback**: Confirm user actions through visual response

**Prohibited Animation Uses:**
- Decorative animations that don't serve functional purposes
- Auto-playing animations that cannot be paused
- Continuous looping animations (with exceptions for loading states)
- Parallax scrolling effects
- Spinning or rotating decorative elements

### 1.2 Performance Targets

All animations MUST meet these performance criteria:

| Target | Requirement | Measurement |
|--------|-------------|-------------|
| Frame Rate | 60fps minimum | Chrome DevTools Performance panel |
| First Paint | < 100ms after trigger | Largest paint during animation |
| Jank | 0 frames dropped | No visible stuttering |
| CPU Usage | < 10% during animation | Chrome Task Manager |

**Compositor-Only Properties:**
All animations MUST use only these properties (GPU-accelerated):
- `transform` (translate, scale, rotate)
- `opacity`

**Avoid Animating:**
- `width`, `height` (triggers layout)
- `top`, `left`, `right`, `bottom` (triggers layout)
- `margin`, `padding` (triggers layout)
- `border-width` (triggers paint)
- `box-shadow` (triggers paint)
- `background-color` (triggers paint)

### 1.3 Accessibility-First Approach

**WCAG 2.1 Compliance:**
- **Level A - Criterion 2.2.2**: All animations respect `prefers-reduced-motion`
- **Level A - Criterion 1.4.2**: No auto-playing audio/video
- **Level AAA - Criterion 2.3.3**: No animation triggers vestibular disorders

**Core Principles:**
1. **Respect user preferences** - `prefers-reduced-motion` is never optional
2. **Never use animation as the only feedback** - Always pair with color, text, or icon changes
3. **Avoid vestibular triggers** - No parallax, spinning, or rapid motion
4. **Preserve focus indicators** - Never animate focus rings away

---

## 2. Global Reduced Motion Support

### 2.1 CSS Reset Implementation

Add this to [`src/app/globals.css`](src/app/globals.css) at the end of the file, AFTER all other styles:

```css
/**
 * Reduced Motion Support - WCAG 2.1 Level A Compliance
 * 
 * This section MUST remain at the end of the stylesheet to ensure
 * it overrides all other animation definitions.
 */

/* Global reduced motion reset */
@media (prefers-reduced-motion: reduce) {
  /* Disable all CSS animations and transitions */
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Preserve essential focus transitions for accessibility */
  :focus-visible {
    transition: outline-offset 0.01ms !important;
  }

  /* Disable transform-based animations */
  * {
    transform: none !important;
  }

  /* Specific component overrides */
  
  /* Accordion - instant state change */
  [data-slot="accordion-content"] {
    animation: none !important;
    transition: none !important;
  }

  /* Dialog/Modal - instant appearance */
  [data-slot="dialog-overlay"],
  [data-slot="dialog-content"] {
    animation: none !important;
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }

  /* Sheet/Drawer - instant slide */
  [data-slot="sheet-overlay"],
  [data-slot="sheet-content"] {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }

  /* Dropdown Menu - instant appearance */
  [data-slot="dropdown-menu-content"],
  [data-slot="dropdown-menu-sub-content"] {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }

  /* Carousel - disable smooth scrolling */
  [data-slot="carousel-content"] {
    scroll-behavior: auto !important;
    transition: none !important;
  }

  /* Product Card hover effects */
  [data-slot="product-card"] img,
  [data-slot="product-card"] .group-hover\:scale-105,
  [data-slot="product-card"] .group-hover\:scale-110 {
    transform: none !important;
    transition: none !important;
  }

  /* Quick add button slide-up */
  [data-slot="product-card"] .translate-y-full,
  [data-slot="product-card"] .group-hover\:translate-y-0 {
    transform: none !important;
    transition: none !important;
  }

  /* Button hover states - instant */
  [data-slot="button"] {
    transition: none !important;
    transform: none !important;
  }

  /* Toast notifications - instant */
  .toaster [data-sonner-toast] {
    animation: none !important;
    transition: none !important;
  }

  /* Loading spinner - preserve but slow down */
  .animate-spin {
    animation-duration: 2s !important;
  }

  /* Progress bars - instant fill */
  [data-slot="progress"] > div {
    transition: none !important;
  }

  /* Free shipping progress bar */
  .bg-primary.transition-all {
    transition: none !important;
  }
}
```

### 2.2 Critical Animations That Persist

The following animations MUST remain functional even with reduced motion, but should be simplified:

| Animation | Reason | Reduced Motion Behavior |
|-----------|--------|------------------------|
| Loading spinners | Indicate ongoing process | Slow to 2s per rotation (from 1s) |
| Progress bars | Show completion status | Instant fill, no transition |
| Focus rings | Keyboard navigation essential | Instant appearance, no fade |
| Form validation shake | Error indication | Color change only, no shake |

### 2.3 React Hook for Reduced Motion Detection

Create [`src/hooks/use-reduced-motion.ts`](src/hooks/use-reduced-motion.ts):

```typescript
/**
 * useReducedMotion Hook
 * 
 * Detects user's preference for reduced motion.
 * Used for conditionally applying JavaScript-based animations.
 * 
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion();
 * 
 * return (
 *   <motion.div
 *     animate={prefersReducedMotion ? {} : { opacity: 1 }}
 *   />
 * );
 * ```
 */

import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}
```

---

## 3. Component Animation Specifications

### 3.1 Accordion

**Current Implementation:** [`src/components/ui/accordion.tsx`](src/components/ui/accordion.tsx)

| Property | Value |
|----------|-------|
| Animation Type | Height expansion/collapse |
| Duration | 200ms |
| Easing | `ease-out` |
| Properties | `height`, `opacity` |
| Reduced Motion | Instant open/close |

**Animation Details:**
- **Chevron rotation**: 200ms rotate 180°
- **Content expand**: Animate using `animate-accordion-down` (Tailwind)
- **Content collapse**: Animate using `animate-accordion-up` (Tailwind)

**Code Reference:**
```tsx
// AccordionTrigger - Chevron rotation
<ChevronDownIcon className="... transition-transform duration-200" />

// AccordionContent - Height animation
<AccordionPrimitive.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down ..." />
```

**Reduced Motion Override:**
```css
@media (prefers-reduced-motion: reduce) {
  [data-slot="accordion-content"] {
    animation: none !important;
    transition: none !important;
  }
}
```

---

### 3.2 Dialog / Modal

**Current Implementation:** [`src/components/ui/dialog.tsx`](src/components/ui/dialog.tsx)

| Property | Value |
|----------|-------|
| Animation Type | Enter: fade + zoom, Exit: fade + zoom |
| Duration | 200ms |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) |
| Properties | `opacity`, `transform: scale()` |
| Reduced Motion | Instant appearance |

**Animation Sequence:**
1. **Overlay**: Fade in from opacity 0 → 0.5
2. **Content**: Fade in + scale from 0.95 → 1.0
3. **Exit**: Reverse of enter

**Code Reference:**
```tsx
// DialogOverlay
className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 ..."

// DialogContent
className="... data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 ... duration-200"
```

**Reduced Motion Override:**
```css
@media (prefers-reduced-motion: reduce) {
  [data-slot="dialog-overlay"],
  [data-slot="dialog-content"] {
    animation: none !important;
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

---

### 3.3 Sheet / Drawer

**Current Implementation:** [`src/components/ui/sheet.tsx`](src/components/ui/sheet.tsx)

| Property | Value |
|----------|-------|
| Animation Type | Slide from edge |
| Duration (Open) | 500ms |
| Duration (Close) | 300ms |
| Easing | `ease-in-out` |
| Properties | `transform: translateX/Y()` |
| Reduced Motion | Instant appearance |

**Animation Variants:**

| Side | Transform | Description |
|------|-----------|-------------|
| `right` | `translateX(100%)` → `translateX(0)` | Slide from right |
| `left` | `translateX(-100%)` → `translateX(0)` | Slide from left |
| `top` | `translateY(-100%)` → `translateY(0)` | Slide from top |
| `bottom` | `translateY(100%)` → `translateY(0)` | Slide from bottom |

**Code Reference:**
```tsx
className="... data-[state=open]:animate-in data-[state=closed]:animate-out ... data-[state=closed]:duration-300 data-[state=open]:duration-500"

// Right side
"data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"

// Left side
"data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left"
```

**Reduced Motion Override:**
```css
@media (prefers-reduced-motion: reduce) {
  [data-slot="sheet-content"] {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }
}
```

---

### 3.4 Dropdown Menu

**Current Implementation:** [`src/components/ui/dropdown-menu.tsx`](src/components/ui/dropdown-menu.tsx)

| Property | Value |
|----------|-------|
| Animation Type | Fade + zoom + slide |
| Duration | 150ms |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Properties | `opacity`, `transform: scale(), translate()` |
| Reduced Motion | Instant appearance |

**Animation Details:**
- **Fade**: 0 → 1 opacity
- **Zoom**: 0.95 → 1.0 scale
- **Slide**: 8px offset toward placement side

**Code Reference:**
```tsx
className="... data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 ..."
```

**Reduced Motion Override:**
```css
@media (prefers-reduced-motion: reduce) {
  [data-slot="dropdown-menu-content"] {
    animation: none !important;
    transition: none !important;
    transform: none !important;
    opacity: 1 !important;
  }
}
```

---

### 3.5 Carousel

**Current Implementation:** [`src/components/ui/carousel.tsx`](src/components/ui/carousel.tsx)

| Property | Value |
|----------|-------|
| Animation Type | Smooth scroll |
| Duration | Embla default (controlled by library) |
| Easing | Embla default |
| Properties | `scrollLeft` / `scrollTop` |
| Reduced Motion | Instant scroll |

**Animation Details:**
- Uses `embla-carousel-react` for smooth scrolling
- Keyboard navigation (ArrowLeft/ArrowRight)
- Snap to slides

**Reduced Motion Override:**
```css
@media (prefers-reduced-motion: reduce) {
  [data-slot="carousel-content"] {
    scroll-behavior: auto !important;
    transition: none !important;
  }
}
```

**Recommended Enhancement - Disable Embla Animation:**
```tsx
// In carousel.tsx, add reduced motion detection
const prefersReducedMotion = useReducedMotion();

const [carouselRef, api] = useEmblaCarousel(
  {
    ...opts,
    axis: orientation === "horizontal" ? "x" : "y",
    // Disable smooth scroll when reduced motion is preferred
    skipSnaps: prefersReducedMotion,
  },
  plugins
);
```

---

### 3.6 Product Cards (Hover)

**Current Implementation:** [`src/components/common/product-card.tsx`](src/components/common/product-card.tsx)

| Property | Default Variant | Compact Variant |
|----------|-----------------|-----------------|
| Image Scale | 1.0 → 1.10 | 1.0 → 1.05 |
| Duration | 500ms | 300ms |
| Easing | `ease-out` | `ease-out` |
| Properties | `transform: scale()` | `transform: scale()` |
| Shadow | `shadow-lg` on hover | `shadow-md` on hover |
| Reduced Motion | No scale, instant shadow |

**Quick Add Button Animation:**

| Property | Value |
|----------|-------|
| Animation Type | Slide up from bottom |
| Transform | `translateY(100%)` → `translateY(0)` |
| Duration | 300ms |
| Easing | `ease-out` |
| Reduced Motion | Always visible (no transform) |

**Code Reference:**
```tsx
// Default variant image
<img className="... transition-transform duration-500 group-hover:scale-110" />

// Compact variant image
<img className="... transition-transform duration-300 group-hover:scale-105" />

// Quick add button
<div className="... translate-y-full transition-transform duration-300 group-hover:translate-y-0">
```

**Reduced Motion Override:**
```css
@media (prefers-reduced-motion: reduce) {
  [data-slot="product-card"] img,
  [data-slot="product-card"] .group-hover\:scale-105,
  [data-slot="product-card"] .group-hover\:scale-110 {
    transform: none !important;
    transition: none !important;
  }
  
  /* Make quick add always visible */
  [data-slot="product-card"] .translate-y-full {
    transform: none !important;
  }
}
```

---

### 3.7 Buttons (Hover / Active)

**Current Implementation:** [`src/components/ui/button.tsx`](src/components/ui/button.tsx)

| Property | Value |
|----------|-------|
| Animation Type | Color/background transition |
| Duration | 150ms (Tailwind default) |
| Easing | `ease-in-out` |
| Properties | `background-color`, `color`, `border-color` |
| Reduced Motion | Instant state change |

**Hover States:**

| Variant | Default State | Hover State |
|---------|---------------|-------------|
| `default` | `bg-primary` | `hover:bg-primary/90` |
| `destructive` | `bg-destructive` | `hover:bg-destructive/90` |
| `outline` | `bg-background` | `hover:bg-accent` |
| `secondary` | `bg-secondary` | `hover:bg-secondary/80` |
| `ghost` | Transparent | `hover:bg-accent` |
| `link` | Text only | `hover:underline` |

**Code Reference:**
```tsx
const buttonVariants = cva(
  "... transition-all ...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        // ... other variants
      }
    }
  }
);
```

**Reduced Motion Override:**
```css
@media (prefers-reduced-motion: reduce) {
  [data-slot="button"] {
    transition: none !important;
  }
}
```

---

### 3.8 Toast Notifications

**Current Implementation:** [`src/components/ui/sonner.tsx`](src/components/ui/sonner.tsx)

| Property | Value |
|----------|-------|
| Animation Type | Slide in + fade |
| Duration | 300ms (Sonner default) |
| Easing | `ease-out` |
| Properties | `transform`, `opacity` |
| Reduced Motion | Instant appearance |

**Animation Details:**
- **Enter**: Slide from right + fade in
- **Exit**: Slide to right + fade out
- **Loading spinner**: Continuous rotate animation

**Reduced Motion Override:**
```css
@media (prefers-reduced-motion: reduce) {
  .toaster [data-sonner-toast] {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }
  
  /* Slow down loading spinner but keep it */
  .animate-spin {
    animation-duration: 2s !important;
  }
}
```

**Recommended Enhancement:**
Add `prefersReducedMotion` prop to Toaster configuration:

```tsx
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      // Disable animations when reduced motion is preferred
      toastOptions={{
        className: prefersReducedMotion ? "animate-none" : "",
      }}
      // ... rest of configuration
    />
  );
};
```

---

## 4. Duration Guidelines

### 4.1 Standardized Timing Scale

All animations MUST use values from this timing scale:

| Token | Duration | Use Case |
|-------|----------|----------|
| `instant` | 0ms | Reduced motion fallback |
| `micro` | 100ms | Micro-interactions (checkbox, radio) |
| `fast` | 150ms | Hover states, button transitions |
| `normal` | 200ms | Accordion, dropdown, small components |
| `medium` | 300ms | Dialog open, sheet close, cards |
| `slow` | 500ms | Sheet open, page transitions |

### 4.2 Duration by Animation Type

| Animation Category | Duration Range | Examples |
|-------------------|----------------|----------|
| **Micro-interactions** (hover, focus) | 100-150ms | Button hover, link underline, checkbox |
| **Component transitions** | 150-300ms | Accordion, dropdown, dialog, sheet close |
| **Page transitions** | 300-500ms | Sheet open, route transitions |
| **Emphasis animations** | 200-400ms | Success states, important notifications |

### 4.3 Duration Guidelines by Component

| Component | Enter | Exit | Hover | Reduced Motion |
|-----------|-------|------|-------|----------------|
| Accordion | 200ms | 200ms | - | 0ms |
| Dialog | 200ms | 200ms | - | 0ms |
| Sheet | 500ms | 300ms | - | 0ms |
| Dropdown | 150ms | 150ms | - | 0ms |
| Toast | 300ms | 300ms | - | 0ms |
| Button | - | - | 150ms | 0ms |
| Product Card | - | - | 300-500ms | 0ms |
| Carousel | - | - | - | 0ms (instant snap) |

---

## 5. Easing Guidelines

### 5.1 Standard Easing Functions

All animations MUST use these predefined easing functions:

| Name | CSS Value | Use Case |
|------|-----------|----------|
| `ease-linear` | `linear` | Continuous animations (spinners) |
| `ease-out` | `ease-out` | Elements entering (natural deceleration) |
| `ease-in` | `ease-in` | Elements exiting (natural acceleration) |
| `ease-in-out` | `ease-in-out` | Bidirectional animations (hover) |
| `ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Dialogs, emphasis (snappy) |
| `ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful interactions (overshoot) |

### 5.2 Easing by Animation Direction

```
┌─────────────────────────────────────────────────────────────┐
│  ENTER ANIMATIONS          │  EXIT ANIMATIONS               │
│  (elements appearing)      │  (elements disappearing)       │
├─────────────────────────────────────────────────────────────┤
│  Use EASE-OUT variants     │  Use EASE-IN variants          │
│  • Natural deceleration    │  • Natural acceleration        │
│  • Feels responsive        │  • Feels like releasing        │
│  • Quick start, slow end   │  • Slow start, quick end       │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 Easing by Component

| Component | Enter Easing | Exit Easing | Hover Easing |
|-----------|--------------|-------------|--------------|
| Accordion | `ease-out` | `ease-in` | - |
| Dialog | `ease-out-expo` | `ease-in` | - |
| Sheet | `ease-out-expo` | `ease-in` | - |
| Dropdown | `ease-out-expo` | `ease-in` | - |
| Toast | `ease-out` | `ease-in` | - |
| Button | - | - | `ease-in-out` |
| Product Card | - | - | `ease-out` |

### 5.4 Easing CSS Variables (Optional Enhancement)

Add to [`src/app/globals.css`](src/app/globals.css):

```css
:root {
  /* Easing Functions */
  --ease-linear: linear;
  --ease-out: ease-out;
  --ease-in: ease-in;
  --ease-in-out: ease-in-out;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  
  /* Duration Scale */
  --duration-instant: 0ms;
  --duration-micro: 100ms;
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-medium: 300ms;
  --duration-slow: 500ms;
}
```

---

## 6. Performance Best Practices

### 6.1 Property Performance Hierarchy

```
┌──────────────────────────────────────────────────────────────────┐
│  RENDERING LAYER PERFORMANCE (Best to Worst)                     │
├──────────────────────────────────────────────────────────────────┤
│  🟢 COMPOSITOR LAYER (GPU-accelerated, 60fps guaranteed)         │
│     • transform (translate, scale, rotate)                       │
│     • opacity                                                    │
│     • filter (with caution)                                      │
├──────────────────────────────────────────────────────────────────┤
│  🟡 PAINT LAYER (GPU-assisted, may cause jank)                   │
│     • color                                                      │
│     • background-color                                           │
│     • box-shadow (expensive!)                                    │
│     • border-color                                               │
├──────────────────────────────────────────────────────────────────┤
│  🔴 LAYOUT LAYER (CPU-intensive, avoid animating)                │
│     • width, height                                              │
│     • top, left, right, bottom                                   │
│     • margin, padding                                            │
│     • display, position                                          │
│     • font-size                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 6.2 `will-change` Usage Guidelines

**When to use:**
- Elements that animate frequently
- Complex animations during user interaction
- Remove after animation completes

**Syntax:**
```css
/* Before animation starts */
.animating-element {
  will-change: transform, opacity;
}

/* After animation completes (remove to free memory) */
.animation-complete {
  will-change: auto;
}
```

**Example in React:**
```tsx
function AnimatedComponent({ isAnimating }) {
  return (
    <div
      style={{
        willChange: isAnimating ? "transform, opacity" : "auto",
      }}
      className="transform transition-transform duration-300"
    />
  );
}
```

**WARNING:** Overuse of `will-change` causes:
- Increased memory usage
- Slower initial render
- Potential layer explosion

### 6.3 Transform vs Layout Properties

**AVOID - Layout-Triggering Animation:**
```css
/* DON'T DO THIS - Triggers layout recalculation */
.card {
  width: 100px;
  transition: width 0.3s ease;
}
.card:hover {
  width: 200px; /* Triggers layout! */
}
```

**PREFER - Transform-Based Animation:**
```css
/* DO THIS - GPU accelerated */
.card {
  transform: scale(1);
  transition: transform 0.3s ease;
}
.card:hover {
  transform: scale(1.1); /* Compositor only! */
}
```

### 6.4 Animation Containment

Use CSS containment to limit animation scope:

```css
.animated-container {
  /* Isolate this element's rendering */
  contain: layout style paint;
  
  /* For animations, also use: */
  contain: strict;
}
```

### 6.5 Performance Checklist

Before implementing any animation, verify:

- [ ] Only `transform` and `opacity` are animated
- [ ] Duration is between 100-500ms
- [ ] `prefers-reduced-motion` is respected
- [ ] `will-change` is applied only during animation
- [ ] Animation doesn't trigger on every frame unnecessarily
- [ ] Tested at 60fps in Chrome DevTools

---

## 7. Accessibility Requirements

### 7.1 Never Animation-Only Feedback

**REQUIRED:** Every animated state change MUST have a non-animation indicator:

| Animation | Required Non-Animation Fallback |
|-----------|--------------------------------|
| Button press | Visual color change + focus state |
| Form error | Red border + error text + icon |
| Loading state | Text label + disabled state |
| Success state | Green checkmark + text confirmation |
| Menu open | Visible expanded state attribute |

### 7.2 Vestibular Disorder Triggers to Avoid

**NEVER USE:**

| Prohibited Effect | Reason | Alternative |
|-------------------|--------|-------------|
| Parallax scrolling | Creates disorientation | Static layers |
| Spinning/rotating elements | Triggers vertigo | Static icons with optional slow pulse |
| Rapid flashing (>3Hz) | Can trigger seizures | Static or slow transitions |
| Large scale movements | Causes nausea | Subtle, small movements |
| 3D perspective shifts | Disorienting | 2D transforms only |
| Auto-playing motion | No user control | Only animate on user interaction |

### 7.3 Focus Indicator Requirements

Focus indicators MUST NOT be animated away:

```css
/* CORRECT - Focus ring is always visible */
:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

/* WRONG - Never hide or animate focus rings */
:focus-visible {
  outline: none; /* NEVER DO THIS */
  transition: outline 0.2s; /* Risky - keep instant */
}
```

### 7.4 Screen Reader Considerations

Animations should not interfere with screen reader announcements:

```tsx
// Use aria-live for important dynamic content
<div aria-live="polite" aria-atomic="true">
  {notification && (
    <div className="animate-in fade-in">
      {notification.message}
    </div>
  )}
</div>

// Disable animation for screen reader users
const prefersReducedMotion = useReducedMotion();
const isScreenReader = useIsScreenReader(); // Custom detection

const shouldAnimate = !prefersReducedMotion && !isScreenReader;
```

### 7.5 Keyboard Navigation Support

All animated components MUST support keyboard interaction:

| Component | Keyboard Support |
|-----------|------------------|
| Accordion | Enter/Space to toggle, Tab to navigate |
| Dialog | Escape to close, Tab trap inside |
| Sheet | Escape to close, Tab trap inside |
| Dropdown | Arrow keys to navigate, Escape to close |
| Carousel | ArrowLeft/ArrowRight to navigate |

---

## 8. Implementation Code Examples

### 8.1 Global Reduced Motion CSS (Complete)

Add to the END of [`src/app/globals.css`](src/app/globals.css):

```css
/**
 * ================================================================
 * REDUCED MOTION SUPPORT - WCAG 2.1 LEVEL A COMPLIANCE
 * ================================================================
 * 
 * This section MUST remain at the end of the stylesheet to ensure
 * it takes precedence over all other animation definitions.
 * 
 * Requirements addressed:
 * - WCAG 2.1 Level A - Criterion 2.2.2 (Pause, Stop, Hide)
 * - WCAG 2.1 Level AAA - Criterion 2.3.3 (Animation from Interactions)
 */

@media (prefers-reduced-motion: reduce) {
  /* 
   * GLOBAL RESET
   * Disable all CSS animations and transitions by default
   */
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* 
   * PRESERVE ESSENTIAL FOCUS TRANSITIONS
   * Focus indicators must remain visible for accessibility
   */
  :focus-visible {
    transition: outline-offset 0.01ms !important;
  }

  /* 
   * COMPONENT-SPECIFIC OVERRIDES
   * Ensure instant state changes for all animated components
   */

  /* Accordion - Instant expand/collapse */
  [data-slot="accordion-content"] {
    animation: none !important;
    transition: none !important;
  }

  /* Dialog/Modal - Instant appearance */
  [data-slot="dialog-overlay"] {
    animation: none !important;
    transition: opacity 0.01ms !important;
    opacity: 1 !important;
  }

  [data-slot="dialog-content"] {
    animation: none !important;
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }

  /* Sheet/Drawer - Instant slide */
  [data-slot="sheet-overlay"] {
    animation: none !important;
    transition: opacity 0.01ms !important;
    opacity: 1 !important;
  }

  [data-slot="sheet-content"] {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }

  /* Dropdown Menu - Instant appearance */
  [data-slot="dropdown-menu-content"],
  [data-slot="dropdown-menu-sub-content"] {
    animation: none !important;
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }

  /* Carousel - Instant scroll */
  [data-slot="carousel-content"] {
    scroll-behavior: auto !important;
  }

  /* Product Cards - Disable hover animations */
  [data-slot="product-card"] img,
  [data-slot="product-card"] .group-hover\:scale-105,
  [data-slot="product-card"] .group-hover\:scale-110 {
    transform: none !important;
    transition: none !important;
  }

  /* Quick add button always visible */
  [data-slot="product-card"] .translate-y-full,
  [data-slot="product-card"] .group-hover\:translate-y-0 {
    transform: none !important;
    transition: none !important;
  }

  /* Buttons - Instant state changes */
  [data-slot="button"] {
    transition: none !important;
  }

  /* Toast notifications - Instant appearance */
  .toaster [data-sonner-toast] {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }

  /* 
   * PRESERVE FUNCTIONAL ANIMATIONS
   * These are essential for usability and remain active
   */

  /* Loading spinners - Slow rotation but visible */
  .animate-spin {
    animation: spin 2s linear infinite !important;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* Progress bars - Instant fill */
  [data-slot="progress"] > div,
  .bg-primary.transition-all {
    transition: none !important;
  }

  /* Skeleton loading - Slow pulse */
  [data-slot="skeleton"] {
    animation-duration: 2s !important;
  }
}
```

### 8.2 Animation Wrapper Component

Create [`src/components/ui/animation-wrapper.tsx`](src/components/ui/animation-wrapper.tsx):

```tsx
/**
 * Animation Wrapper Component
 * 
 * Wraps children with animation support that respects reduced motion preferences.
 * Use this component for any custom animations throughout the application.
 * 
 * @example
 * ```tsx
 * <AnimationWrapper
 *   animate={{ opacity: 1, y: 0 }}
 *   initial={{ opacity: 0, y: 20 }}
 *   transition={{ duration: 0.3 }}
 * >
 *   <MyComponent />
 * </AnimationWrapper>
 * ```
 */

"use client";

import * as React from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface AnimationWrapperProps {
  children: React.ReactNode;
  className?: string;
  initial?: React.CSSProperties;
  animate?: React.CSSProperties;
  exit?: React.CSSProperties;
  transition?: {
    duration?: number;
    delay?: number;
    easing?: string;
  };
  as?: keyof JSX.IntrinsicElements;
}

export function AnimationWrapper({
  children,
  className,
  initial,
  animate,
  exit,
  transition,
  as: Component = "div",
}: AnimationWrapperProps) {
  const prefersReducedMotion = useReducedMotion();
  const [style, setStyle] = React.useState<React.CSSProperties>(initial || {});
  const [isExiting, setIsExiting] = React.useState(false);

  React.useEffect(() => {
    if (prefersReducedMotion) {
      setStyle(animate || {});
      return;
    }

    // Apply animation after mount
    const timer = setTimeout(() => {
      setStyle({
        ...animate,
        transition: transition
          ? `all ${transition.duration || 0.3}s ${transition.easing || "ease-out"} ${transition.delay || 0}s`
          : undefined,
      });
    }, 10);

    return () => clearTimeout(timer);
  }, [prefersReducedMotion, animate, transition]);

  // Handle exit animation
  const handleExit = React.useCallback(() => {
    if (prefersReducedMotion || !exit) return;
    
    setIsExiting(true);
    setStyle({
      ...exit,
      transition: transition
        ? `all ${transition.duration || 0.3}s ${transition.easing || "ease-in"}`
        : undefined,
    });
  }, [prefersReducedMotion, exit, transition]);

  return React.createElement(
    Component,
    {
      className: cn(className),
      style: {
        ...style,
        willChange: isExiting ? "transform, opacity" : "auto",
      },
      "data-reduced-motion": prefersReducedMotion ? "true" : "false",
    },
    children
  );
}

/**
 * Staggered animation container for lists
 */
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  baseDelay?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.05,
  baseDelay = 0,
}: StaggerContainerProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={cn(className)} data-stagger-container>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        const delay = prefersReducedMotion
          ? 0
          : baseDelay + index * staggerDelay;

        return React.cloneElement(child as React.ReactElement, {
          style: {
            ...((child as React.ReactElement).props.style || {}),
            animationDelay: `${delay}s`,
            transitionDelay: `${delay}s`,
          },
        });
      })}
    </div>
  );
}
```

### 8.3 useReducedMotion Hook

Create [`src/hooks/use-reduced-motion.ts`](src/hooks/use-reduced-motion.ts):

```tsx
/**
 * useReducedMotion Hook
 * 
 * Detects user's preference for reduced motion using the
 * prefers-reduced-motion media query.
 * 
 * WCAG 2.1 Compliance: Level A - Criterion 2.2.2
 * 
 * @returns {boolean} True if user prefers reduced motion
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const prefersReducedMotion = useReducedMotion();
 *   
 *   return (
 *     <div
 *       style={{
 *         transform: prefersReducedMotion ? 'none' : 'translateX(100px)',
 *         transition: prefersReducedMotion ? 'none' : 'transform 0.3s ease',
 *       }}
 *     />
 *   );
 * }
 * ```
 */

import { useEffect, useState } from "react";

const REDUCED_MEDIA_QUERY = "(prefers-reduced-motion: reduce)";

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(REDUCED_MEDIA_QUERY);
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Use addEventListener with fallback for older browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      // @ts-expect-error - Deprecated API for older browsers
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        // @ts-expect-error - Deprecated API for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook for animating only when reduced motion is not preferred
 */
export function useAnimationPreference() {
  const prefersReducedMotion = useReducedMotion();

  return {
    shouldAnimate: !prefersReducedMotion,
    prefersReducedMotion,
    /**
     * Returns the appropriate value based on motion preference
     */
    withMotionPreference: <T,>(
      animatedValue: T,
      staticValue: T
    ): T => (prefersReducedMotion ? staticValue : animatedValue),
    /**
     * Returns transition style or none based on preference
     */
    getTransition: (
      duration: number = 0.3,
      easing: string = "ease"
    ): string | undefined => {
      return prefersReducedMotion ? undefined : `${duration}s ${easing}`;
    },
  };
}
```

### 8.4 Component Animation Variants

Create [`src/lib/animations.ts`](src/lib/animations.ts):

```typescript
/**
 * Animation Variants Library
 * 
 * Standardized animation configurations for consistent motion design.
 * All animations respect reduced motion preferences.
 * 
 * Usage:
 * ```tsx
 * import { fadeIn, slideIn } from "@/lib/animations";
 * 
 * // With Tailwind
 * <div className={fadeIn} />
 * 
 * // With inline styles
 * <div style={fadeInStyle} />
 * ```
 */

// ============================================================================
// CSS CLASS VARIANTS (for Tailwind)
// ============================================================================

export const fadeIn = "animate-in fade-in duration-200";
export const fadeOut = "animate-out fade-out duration-200";

export const slideInFromBottom = "animate-in slide-in-from-bottom-4 duration-300";
export const slideInFromTop = "animate-in slide-in-from-top-4 duration-300";
export const slideInFromLeft = "animate-in slide-in-from-left-4 duration-300";
export const slideInFromRight = "animate-in slide-in-from-right-4 duration-300";

export const zoomIn = "animate-in zoom-in-95 duration-200";
export const zoomOut = "animate-out zoom-out-95 duration-200";

// Combined variants
export const dialogEnter = "animate-in fade-in zoom-in-95 duration-200";
export const dialogExit = "animate-out fade-out zoom-out-95 duration-200";

export const sheetEnterRight = "animate-in slide-in-from-right duration-500";
export const sheetExitRight = "animate-out slide-out-to-right duration-300";

export const dropdownEnter = "animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-150";
export const dropdownExit = "animate-out fade-out zoom-out-95 slide-out-to-top-2 duration-150";

// ============================================================================
// CSS-IN-JS STYLE VARIANTS
// ============================================================================

export const fadeInStyle = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2, ease: "easeOut" },
};

export const slideUpStyle = {
  initial: { opacity: 0, transform: "translateY(10px)" },
  animate: { opacity: 1, transform: "translateY(0)" },
  exit: { opacity: 0, transform: "translateY(10px)" },
  transition: { duration: 0.3, ease: "easeOut" },
};

export const scaleInStyle = {
  initial: { opacity: 0, transform: "scale(0.95)" },
  animate: { opacity: 1, transform: "scale(1)" },
  exit: { opacity: 0, transform: "scale(0.95)" },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }, // ease-out-expo
};

export const slideFromRightStyle = {
  initial: { transform: "translateX(100%)" },
  animate: { transform: "translateX(0)" },
  exit: { transform: "translateX(100%)" },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

// ============================================================================
// EASING FUNCTIONS
// ============================================================================

export const easings = {
  linear: "linear",
  easeOut: "ease-out",
  easeIn: "ease-in",
  easeInOut: "ease-in-out",
  easeOutExpo: "cubic-bezier(0.16, 1, 0.3, 1)",
  easeSpring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

// ============================================================================
// DURATION CONSTANTS (in seconds)
// ============================================================================

export const durations = {
  instant: 0,
  micro: 0.1,
  fast: 0.15,
  normal: 0.2,
  medium: 0.3,
  slow: 0.5,
} as const;

// ============================================================================
// COMPONENT-SPECIFIC ANIMATIONS
// ============================================================================

export const componentAnimations = {
  accordion: {
    content: "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    chevron: "transition-transform duration-200",
  },
  
  button: {
    base: "transition-all duration-150",
    hover: "hover:scale-[1.02] active:scale-[0.98]",
  },
  
  card: {
    hover: "transition-shadow duration-300 hover:shadow-lg",
    image: "transition-transform duration-500 group-hover:scale-110",
    quickAdd: "transition-transform duration-300 translate-y-full group-hover:translate-y-0",
  },
  
  dialog: {
    overlay: "animate-in fade-in data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    content: "animate-in fade-in zoom-in-95 data-[state=open]:animate-in data-[state=closed]:animate-out duration-200",
  },
  
  sheet: {
    overlay: "animate-in fade-in data-[state=open]:animate-in data-[state=closed]:animate-out",
    content: "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  },
  
  dropdown: {
    content: "animate-in fade-in zoom-in-95 data-[state=open]:animate-in data-[state=closed]:animate-out duration-150",
  },
  
  toast: {
    enter: "animate-in slide-in-from-right-full fade-in duration-300",
    exit: "animate-out slide-out-to-right-full fade-out duration-300",
  },
} as const;
```

### 8.5 Example: Updating Existing Components

#### Accordion Update

```tsx
// In src/components/ui/accordion.tsx
// Add data-slot for reduced motion targeting

function AccordionTrigger({ ... }) {
  return (
    <AccordionPrimitive.Trigger
      data-slot="accordion-trigger"
      className={cn(
        "... [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon 
        className="... transition-transform duration-200" 
      />
    </AccordionPrimitive.Trigger>
  );
}

function AccordionContent({ ... }) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content" // Already present
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
```

#### Product Card Update

```tsx
// In src/components/common/product-card.tsx
// Add data-slot and consider reduced motion for quick-add

export function ProductCard({ ... }) {
  // Optional: Make quick add always visible for reduced motion
  return (
    <Link
      href={`/products/${product.slug}`}
      data-slot="product-card" // Add for reduced motion targeting
      className={cn(
        "group relative flex flex-col gap-3 overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg",
        className
      )}
    >
      {/* Image with scale animation */}
      <img
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      
      {/* Quick add with slide animation */}
      <div 
        className="absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0"
      >
        <Button className="w-full gap-2">
          <ShoppingCart className="h-4 w-4" />
          Quick Add
        </Button>
      </div>
    </Link>
  );
}
```

#### Button Enhancement

```tsx
// In src/components/ui/button.tsx
// Add data-slot and active state animation

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[0.98]",
  {
    // ... variants
  }
);

function Button({ ... }) {
  return (
    <Comp
      data-slot="button" // Add for reduced motion targeting
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

---

## 9. Testing & Validation

### 9.1 Manual Testing Checklist

- [ ] Enable "Reduce motion" in OS settings
- [ ] Verify all animations become instant
- [ ] Verify loading spinners still work (slower)
- [ ] Verify focus indicators remain visible
- [ ] Test keyboard navigation on all animated components
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Verify no vestibular triggers present

### 9.2 Automated Testing

Add to your test suite:

```tsx
// tests/animation-a11y.test.tsx
import { render, screen } from "@testing-library/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: query === "(prefers-reduced-motion: reduce)",
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })),
});

describe("Animation Accessibility", () => {
  it("respects reduced motion preference", () => {
    const Component = () => {
      const prefersReducedMotion = useReducedMotion();
      return <div data-testid="result">{prefersReducedMotion ? "reduced" : "full"}</div>;
    };

    render(<Component />);
    expect(screen.getByTestId("result")).toHaveTextContent("reduced");
  });
});
```

### 9.3 Performance Testing

Use Chrome DevTools:

1. Open Performance tab
2. Enable "Screenshots" and "Web Vitals"
3. Record while triggering animations
4. Verify:
   - No layout thrashing
   - 60fps maintained
   - Only compositor properties animated

---

## 10. Migration Checklist

To implement this specification in the project:

- [ ] 1. Add the `useReducedMotion` hook to [`src/hooks/use-reduced-motion.ts`](src/hooks/use-reduced-motion.ts)
- [ ] 2. Add the global reduced motion CSS to the END of [`src/app/globals.css`](src/app/globals.css)
- [ ] 3. Add `data-slot` attributes to all animated components for CSS targeting
- [ ] 4. Test all components with reduced motion enabled
- [ ] 5. Update `src/hooks/index.ts` to export the new hook
- [ ] 6. Run accessibility audit to verify compliance

---

## References

- [WCAG 2.1 - Criterion 2.2.2: Pause, Stop, Hide](https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html)
- [WCAG 2.1 - Criterion 2.3.3: Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [Google Web Fundamentals: Animations](https://developers.google.com/web/fundamentals/design-and-ux/animations)
- [Tailwind CSS Animation](https://tailwindcss.com/docs/animation)

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-30  
**WCAG Compliance Target:** Level A (with Level AAA considerations)
