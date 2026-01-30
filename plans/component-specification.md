# Component Specification Document

## Next.js E-Commerce Application - WCAG 2.1 AA Compliant Component System

---

## Table of Contents

1. [Component Architecture Overview](#1-component-architecture-overview)
2. [UI Primitive Components](#2-ui-primitive-components)
3. [Common Components](#3-common-components)
4. [Layout Components](#4-layout-components)
5. [Design Tokens Reference](#5-design-tokens-reference)
6. [Accessibility Standards](#6-accessibility-standards)
7. [Component Patterns](#7-component-patterns)
8. [Implementation Guidelines](#8-implementation-guidelines)

---

## 1. Component Architecture Overview

### 1.1 Component Categorization

The component architecture follows a three-tier hierarchy:

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  UI PRIMITIVES  │  │ COMMON COMPONENTS│  │ LAYOUT COMPONENTS│ │
│  │   (Foundation)  │  │   (Domain)      │  │   (Structure)   │ │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘ │
│           │                    │                    │          │
│  • Button │           • ProductCard      │  • Header         │ │
│  • Input  │           • Price            │  • Footer         │ │
│  • Card   │           • StarRating       │  • Navigation     │ │
│  • Badge  │           • Filters          │  • CartDrawer     │ │
│  • Dialog │           • Breadcrumb       │  • SearchBar      │ │
│  • Sheet  │           • QuantitySelector │  • UserMenu       │ │
│  • Select │           • Pagination       │                   │ │
│  • Tabs   │           • SortSelect       │                   │ │
│  • Toast  │           • SkeletonLoaders  │                   │ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| Tier | Purpose | Examples | Dependencies |
|------|---------|----------|--------------|
| **UI Primitives** | Atomic, reusable UI elements with no business logic | Button, Input, Card, Badge | Radix UI primitives |
| **Common Components** | Domain-specific components for e-commerce | ProductCard, Price, StarRating | UI Primitives |
| **Layout Components** | Structural components that organize the page | Header, Footer, Navigation | UI Primitives + Common |

### 1.2 Naming Conventions

#### File Naming
- **Components**: PascalCase (`Button.tsx`, `ProductCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useCart.ts`, `useProducts.ts`)
- **Utilities**: camelCase (`utils.ts`, `constants.ts`)
- **Types**: camelCase (`types/index.ts`)

#### Component Naming
- Use descriptive, semantic names
- Suffix with component type when ambiguous (`CartDrawer`, `SearchBar`)
- Avoid generic names like `Component`, `Item`, `Wrapper`

#### CSS Class Naming
- Use Tailwind's utility-first approach
- Custom classes use kebab-case (`product-card`, `cart-drawer`)
- State classes use data attributes (`data-state="open"`, `data-active`)

### 1.3 File Organization

```
src/
├── components/
│   ├── ui/              # UI Primitives (shadcn/ui based)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── common/          # E-commerce common components
│   │   ├── product-card.tsx
│   │   ├── price.tsx
│   │   ├── star-rating.tsx
│   │   └── ...
│   └── layout/          # Layout components
│       ├── header.tsx
│       ├── footer.tsx
│       ├── navigation.tsx
│       └── ...
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and constants
├── types/               # TypeScript type definitions
└── features/            # Feature-based modules
```

### 1.4 Props Interface Standards

All components MUST follow these interface standards:

```typescript
// Standard component props pattern
interface ComponentProps {
  // Required props first
  
  // Optional props with defaults
  variant?: "default" | "secondary" | "destructive";
  size?: "sm" | "md" | "lg";
  
  // Event handlers
  onAction?: (value: string) => void;
  
  // Accessibility
  "aria-label"?: string;
  "aria-describedby"?: string;
  
  // Styling extension
  className?: string;
  
  // Children (if applicable)
  children?: React.ReactNode;
}

// Default values should be defined in destructuring
function Component({ 
  variant = "default",
  size = "md",
  className,
  children,
  ...props 
}: ComponentProps) {
  // Implementation
}
```

**Props Ordering Convention:**
1. Required functional props
2. Variant/size props with defaults
3. Event handlers
4. Accessibility attributes
5. `className` for style extension
6. `children` (if applicable)
7. Spread rest props last

---

## 2. UI Primitive Components

### 2.1 Button

**Location:** `src/components/ui/button.tsx`

#### Purpose and Use Cases
- Primary action trigger for user interactions
- Used for form submission, navigation, and action execution
- Supports multiple visual variants for different semantic purposes

#### Props Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link"` | `"default"` | Visual style variant |
| `size` | `"default" \| "xs" \| "sm" \| "lg" \| "icon" \| "icon-xs" \| "icon-sm" \| "icon-lg"` | `"default"` | Size variant |
| `asChild` | `boolean` | `false` | Use child element as button root |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Button content |

#### Visual Specifications

**Variant Styles:**

| Variant | Background | Text | Border | Hover State |
|---------|------------|------|--------|-------------|
| `default` | `--primary` | `--primary-foreground` | none | `opacity: 0.9` |
| `destructive` | `--destructive` | white | none | `opacity: 0.9` |
| `outline` | `--background` | `--foreground` | `--border` | `--accent` bg |
| `secondary` | `--secondary` | `--secondary-foreground` | none | `opacity: 0.8` |
| `ghost` | transparent | `--foreground` | none | `--accent` bg |
| `link` | transparent | `--primary` | none | underline |

**Size Specifications:**

| Size | Height | Padding | Font Size | Use Case |
|------|--------|---------|-----------|----------|
| `xs` | 24px | 8px | 12px | Compact actions |
| `sm` | 32px | 12px | 14px | Secondary actions |
| `default` | 36px | 16px | 14px | Primary actions |
| `lg` | 40px | 24px | 16px | Prominent CTAs |
| `icon` | 36x36px | 0 | - | Icon-only buttons |

#### Accessibility Requirements

- **Keyboard**: Must be focusable and activatable with Enter/Space
- **ARIA**: Must include `data-slot="button"` for reduced motion targeting
- **Focus Ring**: 2px solid `--ring` with 2px offset
- **Touch Target**: Minimum 44x44px for icon buttons

#### Animation Specs

| Property | Value |
|----------|-------|
| Hover transition | `150ms ease-in-out` |
| Active scale | `0.98` (optional) |
| Focus ring | Instant appearance |

```css
/* Reduced motion override */
@media (prefers-reduced-motion: reduce) {
  [data-slot="button"] {
    transition: none !important;
  }
}
```

#### Example Usage

```tsx
// Primary action
<Button>Shop Now</Button>

// Destructive action
<Button variant="destructive">Remove Item</Button>

// With icon
<Button>
  <ShoppingCart className="mr-2 h-4 w-4" />
  Add to Cart
</Button>

// Icon only
<Button size="icon" aria-label="Close dialog">
  <X className="h-4 w-4" />
</Button>

// As link
<Button asChild variant="link">
  <Link href="/products">View All</Link>
</Button>
```

---

### 2.2 Card

**Location:** `src/components/ui/card.tsx`

#### Purpose and Use Cases
- Container for related content and actions
- Used for product cards, information panels, and form containers
- Supports subcomponents for consistent structure

#### Subcomponents

| Component | Purpose |
|-----------|---------|
| `Card` | Root container |
| `CardHeader` | Top section with title and actions |
| `CardTitle` | Card heading |
| `CardDescription` | Secondary text below title |
| `CardAction` | Action button area in header |
| `CardContent` | Main content area |
| `CardFooter` | Bottom section for actions |

#### Props Interface

**Card:**
| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Additional CSS classes |
| `children` | `React.ReactNode` | Card content |

**CardTitle (FIXED - see typography spec):**
| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Additional CSS classes |
| `children` | `React.ReactNode` | Title content |

#### Visual Specifications

| Property | Value |
|----------|-------|
| Background | `--card` |
| Text color | `--card-foreground` |
| Border | 1px solid `--border` |
| Border radius | `--radius-xl` (0.625rem + 4px) |
| Shadow | `shadow-sm` default, `shadow-lg` on hover |
| Padding | 24px (py-6) |
| Gap | 24px between sections |

#### Typography Specifications (FIXED)

| Element | Font Size | Line Height | Weight |
|---------|-----------|-------------|--------|
| Card Title | 1.25rem (20px) | 1.3 | 600 |
| Card Description | 0.875rem (14px) | 1.5 | 400 |

**CRITICAL FIX:** `CardTitle` must use `leading-tight` (1.25) instead of `leading-none`.

#### Example Usage

```tsx
<Card>
  <CardHeader>
    <CardTitle>Order Summary</CardTitle>
    <CardDescription>Review your items before checkout</CardDescription>
    <CardAction>
      <Button variant="ghost" size="sm">Edit</Button>
    </CardAction>
  </CardHeader>
  <CardContent>
    {/* Order items */}
  </CardContent>
  <CardFooter className="flex justify-between">
    <span>Total</span>
    <span className="font-bold">$99.99</span>
  </CardFooter>
</Card>
```

---

### 2.3 Input

**Location:** `src/components/ui/input.tsx`

#### Purpose and Use Cases
- Text entry field for forms
- Supports various input types (text, email, password, number)
- CRITICAL: Must prevent iOS zoom on focus

#### Props Interface

| Prop | Type | Description |
|------|------|-------------|
| `type` | `string` | Input type (text, email, password, etc.) |
| `className` | `string` | Additional CSS classes |
| `...props` | `React.InputHTMLAttributes` | All native input props |

#### Visual Specifications

| Property | Value |
|----------|-------|
| Height | 36px (h-9) default, 44px (h-11) for mobile |
| Font size | **16px (text-base) ALWAYS** - no exceptions |
| Background | transparent |
| Border | 1px solid `--input` |
| Border radius | `--radius-md` |
| Padding | 12px horizontal, 8px vertical |
| Placeholder color | `--muted-foreground` |

#### Accessibility Requirements

- **Focus ring**: 3px solid `--ring` with 50% opacity
- **Error state**: `--destructive` border with `aria-invalid`
- **Label association**: Must be used with `<Label>` component

#### Animation Specs

| Property | Value |
|----------|-------|
| Border transition | `150ms ease-in-out` |
| Focus ring | Instant appearance |

#### Example Usage

```tsx
// Basic usage
<Input placeholder="Enter your email" />

// With label (required for accessibility)
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" aria-describedby="email-error" />

// Error state
<Input aria-invalid="true" />

// With icon
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input className="pl-10" placeholder="Search..." />
</div>
```

---

### 2.4 Badge

**Location:** `src/components/ui/badge.tsx`

#### Purpose and Use Cases
- Status indicators and labels
- Used for stock status, sale badges, category tags
- Should be readable at small sizes

#### Props Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "secondary" \| "destructive" \| "outline" \| "ghost" \| "link"` | `"default"` | Visual style |
| `asChild` | `boolean` | `false` | Use child as root element |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Badge content |

#### Visual Specifications (FIXED)

| Property | Value |
|----------|-------|
| Font size | **14px (text-sm) minimum** - never 12px for critical info |
| Font weight | 500 (medium) |
| Line height | 1.25rem (20px) |
| Letter spacing | 0.01em |
| Padding | 8px horizontal, 4px vertical (px-2.5 py-1) |
| Border radius | full (rounded-full) |

**CRITICAL FIX:** Badge must use `text-sm` (14px) minimum, not `text-xs` (12px).

#### Variant Styles

| Variant | Background | Text | Border |
|---------|------------|------|--------|
| `default` | `--primary` | `--primary-foreground` | transparent |
| `secondary` | `--secondary` | `--secondary-foreground` | transparent |
| `destructive` | `--destructive` | `--destructive-foreground` | transparent |
| `outline` | transparent | `--foreground` | `--border` |

#### Example Usage

```tsx
// Status badges
<Badge>In Stock</Badge>
<Badge variant="destructive">Out of Stock</Badge>
<Badge variant="secondary">Sale</Badge>

// As link
<Badge asChild>
  <Link href="/category/electronics">Electronics</Link>
</Badge>

// With icon
<Badge className="gap-1">
  <Check className="h-3 w-3" />
  Verified
</Badge>
```

---

### 2.5 Dialog

**Location:** `src/components/ui/dialog.tsx`

#### Purpose and Use Cases
- Modal dialogs for important decisions
- Form submissions requiring user confirmation
- Information display that requires dismissal

#### Subcomponents

| Component | Purpose |
|-----------|---------|
| `Dialog` | Root container with state management |
| `DialogTrigger` | Element that opens the dialog |
| `DialogContent` | Modal content container |
| `DialogHeader` | Top section with title |
| `DialogFooter` | Bottom section with actions |
| `DialogTitle` | Accessible dialog title (required) |
| `DialogDescription` | Additional context text |
| `DialogClose` | Close button trigger |

#### Props Interface

**DialogContent:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showCloseButton` | `boolean` | `true` | Show X close button |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Dialog content |

#### Visual Specifications

| Property | Value |
|----------|-------|
| Overlay | `bg-black/50` |
| Content background | `--background` |
| Content max-width | calc(100% - 2rem), 512px on sm+ |
| Border radius | `--radius-lg` |
| Padding | 24px |
| Shadow | `shadow-lg` |

#### Animation Specs

| Phase | Animation | Duration | Easing |
|-------|-----------|----------|--------|
| Enter | Fade + Zoom (0.95 → 1.0) | 200ms | `ease-out-expo` |
| Exit | Fade + Zoom (1.0 → 0.95) | 200ms | `ease-in` |

```css
/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  [data-slot="dialog-overlay"],
  [data-slot="dialog-content"] {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

#### Accessibility Requirements

- **Focus trap**: Must trap focus within dialog when open
- **Escape key**: Must close on Escape key press
- **ARIA**: Must have `DialogTitle` for screen readers
- **Click outside**: Optional close on overlay click

#### Example Usage

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Delete Account</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. Your account will be permanently deleted.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete Account</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### 2.6 Sheet

**Location:** `src/components/ui/sheet.tsx`

#### Purpose and Use Cases
- Slide-out panels for secondary content
- Mobile navigation drawer
- Cart drawer, filters panel

#### Subcomponents

| Component | Purpose |
|-----------|---------|
| `Sheet` | Root container |
| `SheetTrigger` | Element that opens the sheet |
| `SheetContent` | Slide-out panel content |
| `SheetHeader` | Top section |
| `SheetFooter` | Bottom section |
| `SheetTitle` | Accessible title |
| `SheetDescription` | Additional context |

#### Props Interface

**SheetContent:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"right"` | Slide direction |
| `showCloseButton` | `boolean` | `true` | Show X close button |
| `className` | `string` | - | Additional CSS classes |

#### Visual Specifications

| Side | Width/Height | Transform |
|------|--------------|-----------|
| `right` | 75% (max 384px) | `translateX(100%)` → `translateX(0)` |
| `left` | 75% (max 384px) | `translateX(-100%)` → `translateX(0)` |
| `top` | auto | `translateY(-100%)` → `translateY(0)` |
| `bottom` | auto | `translateY(100%)` → `translateY(0)` |

#### Animation Specs

| Phase | Duration | Easing |
|-------|----------|--------|
| Open | 500ms | `ease-out-expo` |
| Close | 300ms | `ease-in` |

#### Accessibility Requirements

- Same as Dialog (focus trap, Escape key, etc.)
- Swipe gesture support on mobile (optional)

#### Example Usage

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">View Cart</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Shopping Cart</SheetTitle>
    </SheetHeader>
    {/* Cart items */}
    <SheetFooter>
      <Button className="w-full">Checkout</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

---

### 2.7 Accordion

**Location:** `src/components/ui/accordion.tsx`

#### Purpose and Use Cases
- Collapsible content sections
- FAQ sections, product details, filter groups
- Space-efficient content organization

#### Subcomponents

| Component | Purpose |
|-----------|---------|
| `Accordion` | Root container (supports single/multiple) |
| `AccordionItem` | Individual collapsible section |
| `AccordionTrigger` | Clickable header |
| `AccordionContent` | Expandable content area |

#### Props Interface

**Accordion:**
| Prop | Type | Description |
|------|------|-------------|
| `type` | `"single" \| "multiple"` | Expansion mode |
| `defaultValue` | `string` | Initially open item(s) |
| `value` | `string` | Controlled open item |
| `onValueChange` | `(value: string) => void` | Change callback |
| `collapsible` | `boolean` | Allow all closed |

#### Animation Specs

| Property | Value |
|----------|-------|
| Content expand/collapse | 200ms |
| Chevron rotation | 200ms |
| Easing | `ease-out` |

```css
/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  [data-slot="accordion-content"] {
    animation: none !important;
    transition: none !important;
  }
}
```

#### Example Usage

```tsx
<Accordion type="single" collapsible>
  <AccordionItem value="shipping">
    <AccordionTrigger>Shipping Information</AccordionTrigger>
    <AccordionContent>
      Free shipping on orders over $50. Delivery in 3-5 business days.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="returns">
    <AccordionTrigger>Returns Policy</AccordionTrigger>
    <AccordionContent>
      30-day return window for all unused items.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

---

### 2.8 Dropdown Menu

**Location:** `src/components/ui/dropdown-menu.tsx`

#### Purpose and Use Cases
- Contextual action menus
- User menus, sort options, category navigation
- Submenu support for nested options

#### Subcomponents

| Component | Purpose |
|-----------|---------|
| `DropdownMenu` | Root container |
| `DropdownMenuTrigger` | Element that opens menu |
| `DropdownMenuContent` | Menu container |
| `DropdownMenuItem` | Selectable menu item |
| `DropdownMenuCheckboxItem` | Toggle item |
| `DropdownMenuRadioGroup` | Radio selection group |
| `DropdownMenuRadioItem` | Radio option |
| `DropdownMenuSeparator` | Visual divider |
| `DropdownMenuLabel` | Non-interactive label |
| `DropdownMenuShortcut` | Keyboard shortcut display |
| `DropdownMenuSub` | Submenu container |
| `DropdownMenuSubTrigger` | Submenu opener |
| `DropdownMenuSubContent` | Submenu content |

#### Visual Specifications

| Property | Value |
|----------|-------|
| Background | `--popover` |
| Border radius | `--radius-md` |
| Shadow | `shadow-md` |
| Min width | 8rem |
| Max height | Available viewport height |
| Padding | 4px |

#### Animation Specs

| Property | Value |
|----------|-------|
| Enter animation | Fade + Zoom + Slide |
| Duration | 150ms |
| Easing | `ease-out-expo` |

#### Accessibility Requirements

- **Arrow keys**: Navigate items
- **Enter/Space**: Select item
- **Escape**: Close menu
- **Home/End**: First/last item
- **Letter keys**: Typeahead search

#### Example Usage

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Sort By</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
    <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
    <DropdownMenuItem>Rating</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

### 2.9 Select

**Location:** `src/components/ui/select.tsx`

#### Purpose and Use Cases
- Single selection from predefined options
- Form inputs with limited choices
- More compact than radio buttons for many options

#### Subcomponents

| Component | Purpose |
|-----------|---------|
| `Select` | Root container |
| `SelectTrigger` | Clickable trigger button |
| `SelectValue` | Displays selected value |
| `SelectContent` | Options dropdown |
| `SelectItem` | Individual option |
| `SelectGroup` | Option grouping |
| `SelectLabel` | Group label |
| `SelectSeparator` | Visual divider |

#### Props Interface

**SelectTrigger:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"default" \| "sm"` | `"default"` | Trigger size |

#### Visual Specifications

| Property | Value |
|----------|-------|
| Trigger height | 36px (default), 32px (sm) |
| Trigger padding | 12px |
| Content min-width | Matches trigger |
| Border radius | `--radius-md` |

#### Example Usage

```tsx
<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select category" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Electronics</SelectLabel>
      <SelectItem value="phones">Phones</SelectItem>
      <SelectItem value="laptops">Laptops</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Clothing</SelectLabel>
      <SelectItem value="shirts">Shirts</SelectItem>
      <SelectItem value="pants">Pants</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

---

### 2.10 Tabs

**Location:** `src/components/ui/tabs.tsx`

#### Purpose and Use Cases
- Content organization into switchable panels
- Product details (description, specs, reviews)
- Settings pages, dashboard sections

#### Subcomponents

| Component | Purpose |
|-----------|---------|
| `Tabs` | Root container |
| `TabsList` | Tab button container |
| `TabsTrigger` | Individual tab button |
| `TabsContent` | Panel content |

#### Props Interface

**Tabs:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout direction |
| `defaultValue` | `string` | - | Initially active tab |
| `value` | `string` | - | Controlled active tab |

**TabsList:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "line"` | `"default"` | Visual style |

#### Visual Specifications

**Default Variant:**
| Property | Value |
|----------|-------|
| List background | `--muted` |
| List padding | 3px |
| List border radius | `--radius-lg` |
| Active tab | `--background` with shadow |
| Inactive tab | transparent |

**Line Variant:**
| Property | Value |
|----------|-------|
| List background | transparent |
| Active indicator | 2px bottom border on `--foreground` |

#### Animation Specs

| Property | Value |
|----------|-------|
| Active indicator | `transition-all duration-200` |

#### Accessibility Requirements

- **Arrow keys**: Navigate tabs
- **Enter/Space**: Activate tab
- **Home/End**: First/last tab
- **Tab key**: Move focus into panel

#### Example Usage

```tsx
<Tabs defaultValue="description" className="w-full">
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="description">Description</TabsTrigger>
    <TabsTrigger value="specs">Specifications</TabsTrigger>
    <TabsTrigger value="reviews">Reviews</TabsTrigger>
  </TabsList>
  <TabsContent value="description">
    {/* Product description */}
  </TabsContent>
  <TabsContent value="specs">
    {/* Product specifications */}
  </TabsContent>
  <TabsContent value="reviews">
    {/* Product reviews */}
  </TabsContent>
</Tabs>
```

---

### 2.11 Toast / Sonner

**Location:** `src/components/ui/sonner.tsx`

#### Purpose and Use Cases
- Non-blocking notifications
- Success/error feedback
- Action confirmations

#### Props Interface

| Prop | Type | Description |
|------|------|-------------|
| `theme` | `"light" \| "dark" \| "system"` | Color theme |
| `position` | `ToasterPosition` | Screen position |
| `duration` | `number` | Auto-dismiss duration |
| `closeButton` | `boolean` | Show close button |

#### Visual Specifications

| Property | Value |
|----------|-------|
| Position | Top-right default |
| Max width | 356px |
| Border radius | `--radius-lg` |
| Shadow | `shadow-lg` |
| Background | `--popover` |

#### Animation Specs

| Phase | Animation | Duration |
|-------|-----------|----------|
| Enter | Slide from right + fade | 300ms |
| Exit | Slide to right + fade | 300ms |

```css
/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .toaster [data-sonner-toast] {
    animation: none !important;
    transform: none !important;
  }
}
```

#### Example Usage

```tsx
// In layout.tsx
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }) {
  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  );
}

// Usage in components
import { toast } from "sonner";

toast.success("Item added to cart");
toast.error("Failed to add item");
toast.info("Only 3 items left in stock");
toast.promise(saveData(), {
  loading: "Saving...",
  success: "Saved!",
  error: "Failed to save",
});
```

---

## 3. Common Components

### 3.1 Product Card

**Location:** `src/components/common/product-card.tsx`

#### Purpose and Use Cases
- Display product information in grid/list views
- Primary product discovery component
- Supports quick add to cart and wishlist actions

#### Props Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `product` | `Product` | required | Product data |
| `variant` | `"default" \| "compact"` | `"default"` | Card size variant |
| `className` | `string` | - | Additional CSS classes |
| `onQuickAdd` | `(product: Product) => void` | - | Quick add callback |
| `onWishlistToggle` | `(product: Product) => void` | - | Wishlist toggle callback |
| `isWishlisted` | `boolean` | `false` | Wishlist state |

#### Visual Specifications

**Default Variant:**
| Property | Value |
|----------|-------|
| Image aspect ratio | 4:3 |
| Image hover scale | 1.10 |
| Animation duration | 500ms |
| Border radius | `--radius-xl` |
| Shadow | `shadow-sm` → `shadow-lg` on hover |

**Compact Variant:**
| Property | Value |
|----------|-------|
| Image aspect ratio | 1:1 (square) |
| Image hover scale | 1.05 |
| Animation duration | 300ms |
| Padding | 12px |

#### Animation Specs

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Image | Scale on hover | 300-500ms | `ease-out` |
| Quick add button | Slide up | 300ms | `ease-out` |
| Wishlist button | Fade in | 200ms | `ease-in-out` |

```css
/* Reduced motion - quick add always visible */
@media (prefers-reduced-motion: reduce) {
  [data-slot="product-card"] .translate-y-full {
    transform: none !important;
  }
}
```

#### Accessibility Requirements

- Product name must be heading element (h3)
- Image must have descriptive alt text
- Interactive elements must have aria-labels
- Price must be announced by screen readers

#### Typography (FIXED)

| Element | Font Size | Line Height | Weight |
|---------|-----------|-------------|--------|
| Product name | 1rem (16px) | 1.4 | 500 |
| Product name (compact) | 0.875rem (14px) | 1.4 | 500 |
| Price | 1.125rem (18px) | 1.3 | 700 |
| Review count | 0.75rem (12px) | 1.4 | 400 |

#### Example Usage

```tsx
<ProductCard
  product={product}
  variant="default"
  onQuickAdd={(product) => addToCart(product)}
  onWishlistToggle={(product) => toggleWishlist(product)}
  isWishlisted={wishlist.includes(product.id)}
/>
```

---

### 3.2 Price Display

**Location:** `src/components/common/price.tsx`

#### Purpose and Use Cases
- Display formatted currency amounts
- Show sale prices with compare-at prices
- Display savings percentages

#### Props Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `amount` | `number` | required | Current price |
| `currency` | `string` | `"USD"` | Currency code |
| `compareAtPrice` | `number` | - | Original price |
| `showSavings` | `boolean` | `false` | Show savings badge |
| `className` | `string` | - | Additional CSS classes |

#### Visual Specifications

| State | Current Price | Compare Price | Color |
|-------|---------------|---------------|-------|
| Regular | `--foreground` | none | normal |
| Sale | `--destructive` | strikethrough | sale |

#### Typography

| Element | Font Size | Weight |
|---------|-----------|--------|
| Current price | 1.125rem (18px) | 700 |
| Compare price | 0.875rem (14px) | 400 |

#### Example Usage

```tsx
// Regular price
<Price amount={99.99} />

// Sale price
<Price 
  amount={79.99} 
  compareAtPrice={99.99}
  showSavings 
/>

// With custom styling
<Price amount={price} className="text-lg" />
```

---

### 3.3 Star Rating

**Location:** `src/components/common/star-rating.tsx`

#### Purpose and Use Cases
- Display product ratings
- Interactive rating input for reviews
- Review count display

#### Props Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rating` | `number` | required | Current rating (0-5) |
| `max` | `number` | `5` | Maximum stars |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Star size |
| `interactive` | `boolean` | `false` | Allow user rating |
| `onRate` | `(rating: number) => void` | - | Rating callback |
| `showValue` | `boolean` | `false` | Show numeric value |
| `reviewCount` | `number` | - | Number of reviews |
| `className` | `string` | - | Additional CSS classes |

#### Visual Specifications (FIXED)

| Property | Value |
|----------|-------|
| Filled star color | `#facc15` (yellow-400) |
| Empty star color | `--muted-foreground` (solid, no opacity) |
| Size sm | 12x12px |
| Size md | 16x16px |
| Size lg | 24x24px |

**CRITICAL FIX:** Empty stars must use `text-muted-foreground` (solid), NOT `text-muted-foreground/30`.

#### Accessibility Requirements

- **Interactive mode**: Use `role="radiogroup"` with `role="radio"` buttons
- **Display mode**: Use `role="img"` with `aria-label` describing rating
- **Keyboard**: Arrow keys to change rating (interactive mode)

#### Example Usage

```tsx
// Display only
<StarRating rating={4.5} reviewCount={128} />

// With numeric value
<StarRating rating={4.5} showValue reviewCount={128} />

// Interactive
<StarRating 
  rating={currentRating} 
  interactive 
  onRate={setRating}
  size="lg"
/>

// Small size for compact displays
<StarRating rating={4} size="sm" />
```

---

### 3.4 Quantity Selector

**Location:** `src/components/common/quantity-selector.tsx`

#### Purpose and Use Cases
- Cart item quantity adjustment
- Product page quantity selection
- Quick add quantity control

#### Props Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | required | Current quantity |
| `min` | `number` | `1` | Minimum quantity |
| `max` | `number` | `99` | Maximum quantity |
| `onChange` | `(value: number) => void` | required | Change callback |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Selector size |
| `disabled` | `boolean` | `false` | Disabled state |
| `className` | `string` | - | Additional CSS classes |

#### Visual Specifications

| Size | Height | Button Size | Input Width |
|------|--------|-------------|-------------|
| `sm` | 28px | 28x28px | 40px |
| `md` | 36px | 36x36px | 48px |
| `lg` | 44px | 44x44px | 56px |

#### Accessibility Requirements

- Input must have `role="spinbutton"`
- Must support `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- Buttons must have aria-labels
- Min/max bounds must be enforced

#### Example Usage

```tsx
<QuantitySelector
  value={quantity}
  min={1}
  max={10}
  onChange={setQuantity}
  size="md"
/>
```

---

### 3.5 Breadcrumb

**Location:** `src/components/common/breadcrumb.tsx`

#### Purpose and Use Cases
- Page hierarchy navigation
- SEO enhancement
- User orientation

#### Props Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BreadcrumbItem[]` | required | Navigation items |
| `showHomeIcon` | `boolean` | `true` | Show home icon |
| `className` | `string` | - | Additional CSS classes |

**BreadcrumbItem:**
| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Display text |
| `href` | `string` | Link URL (undefined for current page) |
| `icon` | `string` | Optional icon identifier |

#### Visual Specifications

| Property | Value |
|----------|-------|
| Separator | ChevronRight icon |
| Separator color | `--muted-foreground` at 50% opacity |
| Active item | `--foreground` with `font-medium` |
| Inactive items | `--muted-foreground` |

#### Accessibility Requirements

- Must use `<nav aria-label="Breadcrumb">`
- Must use `<ol>` for item list
- Current page must have `aria-current="page"`
- Home icon must have `aria-label="Home"`

#### Example Usage

```tsx
<Breadcrumb
  items={[
    { label: "Products", href: "/products" },
    { label: "Electronics", href: "/products/electronics" },
    { label: "Laptops" }, // Current page, no href
  ]}
/>
```

---

### 3.6 Filters

**Location:** `src/components/common/filters.tsx`

#### Purpose and Use Cases
- Product filtering panel
- Price range selection
- Category, rating, and stock filters

#### Props Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `filters` | `ProductFilters` | required | Current filter state |
| `onChange` | `(filters: ProductFilters) => void` | required | Filter change callback |
| `categories` | `Category[]` | required | Available categories |
| `showClearButton` | `boolean` | `true` | Show clear all button |
| `className` | `string` | - | Additional CSS classes |

#### Visual Specifications

| Section | Component |
|---------|-----------|
| Header | Filter count badge, clear button |
| Price Range | Min/max inputs with apply button |
| Categories | Checkbox list with counts |
| Rating | Star rating options (4+, 3+, etc.) |
| In Stock | Single checkbox toggle |

#### Example Usage

```tsx
<Filters
  filters={currentFilters}
  onChange={setFilters}
  categories={categories}
/>
```

---

### 3.7 Pagination

**Location:** `src/components/common/pagination.tsx`

#### Purpose and Use Cases
- Page navigation for product lists
- Large dataset browsing
- SEO-friendly URL structure

#### Props Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | `number` | required | Current page number |
| `totalPages` | `number` | required | Total number of pages |
| `onPageChange` | `(page: number) => void` | required | Page change callback |
| `maxVisible` | `number` | `5` | Maximum visible page numbers |
| `className` | `string` | - | Additional CSS classes |

#### Visual Specifications

| Element | Style |
|---------|-------|
| Previous/Next | Button with chevron icon |
| Page numbers | Text buttons |
| Active page | `--primary` background |
| Ellipsis | Text only, non-interactive |

#### Accessibility Requirements

- Must use `<nav aria-label="Pagination">`
- Active page must have `aria-current="page"`
- Previous/Next must indicate disabled state

---

### 3.8 Sort Select

**Location:** `src/components/common/sort-select.tsx`

#### Purpose and Use Cases
- Product sorting dropdown
- Sort by price, rating, newest, etc.

#### Props Interface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `SortOption` | required | Current sort value |
| `onChange` | `(value: SortOption) => void` | required | Change callback |
| `options` | `SortOption[]` | default options | Available sort options |
| `className` | `string` | - | Additional CSS classes |

#### Example Usage

```tsx
<SortSelect
  value={sortBy}
  onChange={setSortBy}
  options={[
    { value: "featured", label: "Featured" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ]}
/>
```

---

### 3.9 Skeleton Loaders

**Location:** `src/components/ui/skeleton.tsx`

#### Purpose and Use Cases
- Loading state placeholders
- Reduce layout shift during data fetch
- Perceived performance improvement

#### Props Interface

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Additional CSS classes |

#### Visual Specifications

| Property | Value |
|----------|-------|
| Background | `--accent` |
| Animation | `animate-pulse` |
| Border radius | `--radius-md` |

#### Animation Specs

| Property | Value |
|----------|-------|
| Pulse duration | 2s |
| Reduced motion | Slow to 2s, preserve animation |

#### Example Usage

```tsx
// Product card skeleton
<div className="space-y-3">
  <Skeleton className="h-[200px] w-full" />
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
</div>

// Text skeleton
<Skeleton className="h-4 w-full" />
<Skeleton className="h-4 w-5/6" />
<Skeleton className="h-4 w-4/6" />
```

---

## 4. Layout Components

### 4.1 Header

**Location:** `src/components/layout/header.tsx`

#### Purpose and Use Cases
- Site-wide navigation container
- Logo, search, cart, user menu
- Sticky positioning on scroll

#### Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Header                                                     │
│  ┌─────────┬─────────────────────────┬──────────────────┐   │
│  │ Logo    │    Search Bar           │ Cart | User ☰   │   │
│  │    +    │    (expandable mobile)  │                  │   │
│  │   Nav   │                         │                  │   │
│  └─────────┴─────────────────────────┴──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

#### Components Included

| Component | Purpose |
|-----------|---------|
| Logo | Brand home link |
| Navigation | Desktop nav links |
| SearchBar | Product search input |
| Cart Button | Cart drawer trigger |
| UserMenu | User actions dropdown |
| Mobile Menu | Sheet-based mobile nav |

#### Visual Specifications

| Property | Value |
|----------|-------|
| Height | 64px (h-16) |
| Position | sticky, top-0 |
| Z-index | 40 |
| Background | `--background` with 95% opacity |
| Backdrop blur | `blur` with 60% opacity support |
| Border | 1px bottom border `--border` |

#### Accessibility Requirements

- Must have `role="banner"`
- Navigation must have `role="navigation"` with aria-label
- Cart button must announce item count
- Mobile menu toggle must have aria-label

---

### 4.2 Footer

**Location:** `src/components/layout/footer.tsx`

#### Purpose and Use Cases
- Site-wide footer with links
- Newsletter signup
- Trust badges
- Social links and copyright

#### Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Trust Badges (Free Shipping, Secure, Support)              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┬────────┬──────────┬──────────┬─────────┐   │
│  │ Brand +     │ Shop   │ Support  │ Company  │ Account │   │
│  │ Newsletter  │        │          │          │         │   │
│  └─────────────┴────────┴──────────┴──────────┴─────────┘   │
├─────────────────────────────────────────────────────────────┤
│  Copyright | Social Icons | Payment Icons | Legal Links     │
└─────────────────────────────────────────────────────────────┘
```

#### Visual Specifications

| Property | Value |
|----------|-------|
| Background | `--muted` at 50% opacity |
| Border | 1px top border `--border` |
| Padding | 48px vertical |
| Columns | 1 (mobile) → 2 (tablet) → 6 (desktop) |

#### Accessibility Requirements

- Must have `role="contentinfo"`
- Newsletter form must have proper labeling
- Social links must have aria-labels

---

### 4.3 Navigation

**Location:** `src/components/layout/navigation.tsx`

#### Purpose and Use Cases
- Main site navigation
- Desktop horizontal menu
- Category dropdown menus
- Mobile accordion menu

#### Components Included

| Component | Purpose |
|-----------|---------|
| Navigation | Desktop nav with category dropdown |
| MobileNavigation | Mobile accordion menu |
| CategoriesDropdown | Mega menu for categories |
| NavLink | Individual nav link with active state |

#### Visual Specifications

| Property | Value |
|----------|-------|
| Desktop | Horizontal flex layout |
| Mobile | Vertical accordion |
| Active state | `--accent` background |
| Hover state | `--accent` at 50% opacity |

---

### 4.4 Cart Drawer

**Location:** `src/components/layout/cart-drawer.tsx`

#### Purpose and Use Cases
- Slide-out cart panel
- Item management (quantity, remove)
- Checkout progression
- Free shipping progress indicator

#### Components Included

| Component | Purpose |
|-----------|---------|
| Sheet | Drawer container |
| Cart Items List | Scrollable item list |
| Quantity Controls | +/- buttons per item |
| Totals Section | Subtotal, shipping, total |
| Free Shipping Bar | Progress indicator |
| Empty State | When cart is empty |

#### Visual Specifications

| Property | Value |
|----------|-------|
| Width | 100% mobile, 448px (max-w-lg) desktop |
| Side | right |
| Content height | Full height |
| Footer | Sticky at bottom |

---

### 4.5 Search Bar

**Location:** `src/components/layout/search-bar.tsx`

#### Purpose and Use Cases
- Product search input
- Search suggestions dropdown
- Mobile expandable search

#### Visual Specifications

| Property | Value |
|----------|-------|
| Desktop | Always visible in header |
| Mobile | Expandable on search icon click |
| Max width | 448px (max-w-md) |
| Placeholder | "Search products..." |

---

### 4.6 User Menu

**Location:** `src/components/layout/user-menu.tsx`

#### Purpose and Use Cases
- Authenticated user actions
- Account links dropdown
- Logout action

#### Visual Specifications

| Property | Value |
|----------|-------|
| Trigger | User avatar or icon button |
| Content | Dropdown menu with links |
| Items | Account, Orders, Settings, Logout |

---

## 5. Design Tokens Reference

### 5.1 Color Tokens

#### Base Colors

| Token | Light Theme | Dark Theme | Contrast Ratio |
|-------|-------------|------------|----------------|
| `--background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` | 10.2:1 |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | 10.2:1 |

#### Semantic Colors

| Token | Light Theme | Dark Theme | Usage |
|-------|-------------|------------|-------|
| `--primary` | `oklch(0.205 0 0)` | `oklch(0.922 0 0)` | Primary actions |
| `--primary-foreground` | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` | Text on primary |
| `--secondary` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | Secondary actions |
| `--accent` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | Hover states |
| `--muted` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | Muted backgrounds |
| `--muted-foreground` | `oklch(0.45 0 0)` | `oklch(0.75 0 0)` | Secondary text |

#### State Colors (FIXED)

| Token | Light Theme | Dark Theme | Usage |
|-------|-------------|------------|-------|
| `--destructive` | `oklch(0.55 0.22 25)` | `oklch(0.65 0.20 25)` | Errors, delete |
| `--success` | `oklch(0.55 0.15 145)` | `oklch(0.65 0.15 145)` | Success states |
| `--warning` | `oklch(0.60 0.14 75)` | `oklch(0.70 0.14 75)` | Warnings |
| `--info` | `oklch(0.55 0.1 250)` | `oklch(0.65 0.1 250)` | Information |

#### Border & Input

| Token | Light Theme | Dark Theme |
|-------|-------------|------------|
| `--border` | `oklch(0.85 0 0)` | `oklch(1 0 0 / 15%)` |
| `--input` | `oklch(0.85 0 0)` | `oklch(1 0 0 / 15%)` |
| `--ring` | `oklch(0.55 0 0)` | `oklch(0.65 0 0)` |

### 5.2 Typography Tokens

#### Font Family

| Token | Value |
|-------|-------|
| `--font-sans` | `var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif` |
| `--font-mono` | `var(--font-geist-mono), ui-monospace, monospace` |

#### Font Size Scale

| Token | Mobile | Tablet | Desktop | Line Height |
|-------|--------|--------|---------|-------------|
| `--font-size-display` | 2.25rem | 2.5rem | 3rem | 1.1 |
| `--font-size-h1` | 1.875rem | 2rem | 2.25rem | 1.2 |
| `--font-size-h2` | 1.5rem | 1.625rem | 1.875rem | 1.2 |
| `--font-size-h3` | 1.25rem | 1.375rem | 1.5rem | 1.25 |
| `--font-size-h4` | 1.125rem | 1.125rem | 1.25rem | 1.3 |
| `--font-size-body` | 1rem | 1rem | 1rem | 1.6 |
| `--font-size-body-sm` | 0.875rem | 0.875rem | 0.875rem | 1.5 |
| `--font-size-caption` | 0.75rem | 0.75rem | 0.75rem | 1.4 |

#### Font Weight Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--font-weight-light` | 300 | Large display text |
| `--font-weight-normal` | 400 | Body text |
| `--font-weight-medium` | 500 | UI elements, buttons |
| `--font-weight-semibold` | 600 | Headings |
| `--font-weight-bold` | 700 | Strong emphasis, prices |

#### Line Height Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--line-height-none` | 1 | Headlines |
| `--line-height-tight` | 1.25 | Headings (FIXED minimum) |
| `--line-height-normal` | 1.5 | Body text minimum (WCAG) |
| `--line-height-relaxed` | 1.625 | Comfortable reading |

### 5.3 Spacing Scale

| Token | Value | Pixels |
|-------|-------|--------|
| `--space-1` | 0.25rem | 4px |
| `--space-2` | 0.5rem | 8px |
| `--space-3` | 0.75rem | 12px |
| `--space-4` | 1rem | 16px |
| `--space-6` | 1.5rem | 24px |
| `--space-8` | 2rem | 32px |
| `--space-12` | 3rem | 48px |
| `--space-16` | 4rem | 64px |

### 5.4 Border Radius Scale

| Token | Value | Calculation |
|-------|-------|-------------|
| `--radius-sm` | 0.125rem | `--radius` - 4px |
| `--radius-md` | 0.375rem | `--radius` - 2px |
| `--radius-lg` | 0.625rem | `--radius` |
| `--radius-xl` | 1.125rem | `--radius` + 4px |
| `--radius-2xl` | 1.625rem | `--radius` + 8px |
| `--radius-3xl` | 2.125rem | `--radius` + 12px |
| `--radius-4xl` | 2.625rem | `--radius` + 16px |

### 5.5 Shadow Scale

| Token | Value |
|-------|-------|
| `shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` |
| `shadow` | `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` |
| `shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` |
| `shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` |
| `shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` |

### 5.6 Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--z-base` | 0 | Default layer |
| `--z-dropdown` | 50 | Dropdown menus |
| `--z-sticky` | 40 | Sticky header |
| `--z-drawer` | 50 | Sheet/drawer |
| `--z-modal` | 50 | Modal/dialog |
| `--z-popover` | 50 | Popover |
| `--z-tooltip` | 60 | Tooltip |
| `--z-toast` | 70 | Toast notifications |

### 5.7 Animation Timing

#### Duration Scale

| Token | Value | Use Case |
|-------|-------|----------|
| `duration-instant` | 0ms | Reduced motion |
| `duration-fast` | 150ms | Hover states |
| `duration-normal` | 200ms | Accordion, dropdown |
| `duration-medium` | 300ms | Dialog close, cards |
| `duration-slow` | 500ms | Sheet open |

#### Easing Functions

| Token | Value | Use Case |
|-------|-------|----------|
| `--ease-out` | `ease-out` | Elements entering |
| `--ease-in` | `ease-in` | Elements exiting |
| `--ease-in-out` | `ease-in-out` | Bidirectional |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Dialogs, emphasis |

---

## 6. Accessibility Standards

### 6.1 WCAG 2.1 AA Compliance Requirements

#### Color Contrast

| Element Type | Minimum Ratio |
|--------------|---------------|
| Normal text (< 18pt) | 4.5:1 |
| Large text (≥ 18pt or ≥ 14pt bold) | 3:1 |
| UI Components & Graphical Objects | 3:1 |
| Focus indicators | 3:1 |

#### Focus Management

| Requirement | Implementation |
|-------------|----------------|
| Visible focus indicators | 2px solid `--ring` with 2px offset |
| Focus trap in modals | Radix Dialog/Sheet handles this |
| Return focus on close | Must return to trigger element |
| Skip links | Provide skip-to-content link |

#### Keyboard Navigation

| Component | Key Support |
|-----------|-------------|
| Button | Enter, Space |
| Link | Enter |
| Checkbox | Space |
| Radio | Arrow keys, Space |
| Select | Enter, Arrow keys, Typeahead |
| Dialog | Escape, Tab trap |
| Menu | Arrow keys, Enter, Escape |
| Tabs | Arrow keys, Home, End |
| Accordion | Enter, Space |

### 6.2 Screen Reader Support

#### Required ARIA Attributes

| Component | Required ARIA |
|-----------|---------------|
| Button | `aria-label` (if no text), `aria-disabled` |
| Dialog | `aria-labelledby` (title), `aria-describedby` (description) |
| Navigation | `role="navigation"`, `aria-label` |
| Menu | `role="menu"`, `aria-haspopup`, `aria-expanded` |
| Tabs | `role="tablist"`, `role="tab"`, `role="tabpanel"` |
| Accordion | `aria-expanded`, `aria-controls` |
| Live regions | `aria-live="polite"` for updates |

#### Screen Reader Testing Checklist

- [ ] All interactive elements are focusable
- [ ] All images have alt text
- [ ] Form inputs have associated labels
- [ ] Error messages are announced
- [ ] Dynamic content uses aria-live
- [ ] Page title updates on navigation

### 6.3 Touch Target Sizes

| Element | Minimum Size |
|---------|--------------|
| Buttons | 44x44px |
| Icon buttons | 44x44px |
| Form inputs | 44px height |
| Navigation links | 44px height |
| Checkbox/Radio | 44x44px touch area |

### 6.4 Reduced Motion Support

```css
/**
 * Global reduced motion support
 * MUST be at end of globals.css
 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  :focus-visible {
    transition: outline-offset 0.01ms !important;
  }

  /* Preserve functional animations */
  .animate-spin {
    animation-duration: 2s !important;
  }
}
```

---

## 7. Component Patterns

### 7.1 Loading States

| Pattern | Implementation |
|---------|----------------|
| Skeleton | Use `Skeleton` component with pulse animation |
| Spinner | Use `Loader2` icon with `animate-spin` |
| Button loading | Show spinner, disable button, preserve width |
| Page loading | Use Suspense boundaries with fallback UI |

**Button Loading Pattern:**
```tsx
<Button disabled={isLoading}>
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {isLoading ? "Loading..." : "Submit"}
</Button>
```

### 7.2 Empty States

**EmptyState Component Pattern:**
```tsx
interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}
```

### 7.3 Error States

| Element | Error State |
|---------|-------------|
| Input | Red border, error message below |
| Form | Alert banner at top |
| Button | Disabled with error message |
| Toast | Error toast notification |

**Input Error Pattern:**
```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email"
    aria-invalid={!!error}
    aria-describedby={error ? "email-error" : undefined}
  />
  {error && (
    <p id="email-error" className="text-sm text-destructive">
      {error}
    </p>
  )}
</div>
```

### 7.4 Disabled States

| Component | Disabled Style |
|-----------|----------------|
| Button | `opacity: 50%`, `pointer-events: none` |
| Input | `opacity: 50%`, `cursor: not-allowed` |
| Link | Remove href, apply muted styles |
| Checkbox/Radio | `opacity: 50%`, `cursor: not-allowed` |

### 7.5 Hover/Focus/Active States

| State | Implementation |
|-------|----------------|
| Hover | Color/background change, `transition-all duration-150` |
| Focus | `focus-visible:ring-2 focus-visible:ring-ring` |
| Active | `active:scale-[0.98]` for buttons (optional) |
| Disabled | `opacity-50 pointer-events-none` |

---

## 8. Implementation Guidelines

### 8.1 How to Extend Components

**Pattern: Composition with className**
```tsx
// Good - allows extension
function MyButton({ className, ...props }: ButtonProps) {
  return (
    <Button 
      className={cn("my-custom-class", className)}
      {...props}
    />
  );
}

// Avoid - hardcoded styles
function MyButton(props: ButtonProps) {
  return <Button className="my-custom-class" {...props} />;
}
```

**Pattern: Variant Extension**
```tsx
const myButtonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        ...buttonVariants.variants.variant,
        custom: "custom-classes",
      },
    },
  }
);
```

### 8.2 When to Create New vs Modify Existing

| Scenario | Action |
|----------|--------|
| One-off style change | Extend via className |
| Reusable style pattern | Create variant |
| New component type | Create new component |
| Domain-specific component | Create in common/ |
| Layout structure | Create in layout/ |

### 8.3 Testing Checklist for New Components

#### Visual Testing
- [ ] Renders correctly in light mode
- [ ] Renders correctly in dark mode
- [ ] Responsive at all breakpoints
- [ ] All variants render correctly
- [ ] All sizes render correctly

#### Accessibility Testing
- [ ] Keyboard navigable
- [ ] Focus indicators visible
- [ ] Screen reader friendly
- [ ] Color contrast compliant (4.5:1)
- [ ] Touch targets 44x44px minimum

#### Animation Testing
- [ ] Animations work with reduced motion
- [ ] No layout shift during animations
- [ ] 60fps performance
- [ ] Proper easing functions

#### Code Quality
- [ ] TypeScript types complete
- [ ] Props interface documented
- [ ] JSDoc comments for complex props
- [ ] Forward refs properly
- [ ] Handles edge cases (empty, loading, error)

### 8.4 Component File Template

```tsx
/**
 * ComponentName Component
 *
 * Brief description of what this component does.
 *
 * @module components/[category]
 * @example
 * ```tsx
 * <ComponentName prop="value" />
 * ```
 */

"use client"; // if needed

import * as React from "react";
import { cn } from "@/lib/utils";

// Types
export interface ComponentNameProps {
  /** Description of prop */
  prop: string;
  /** Optional prop with default */
  optionalProp?: boolean;
  /** Callback when something happens */
  onAction?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Child elements */
  children?: React.ReactNode;
}

/**
 * ComponentName description
 */
export function ComponentName({
  prop,
  optionalProp = false,
  onAction,
  className,
  children,
  ...props
}: ComponentNameProps) {
  return (
    <div
      data-slot="component-name"
      className={cn("base-classes", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export default ComponentName;
```

---

## Appendix A: Quick Reference

### Color Classes

| Token | Tailwind Class |
|-------|----------------|
| `--background` | `bg-background` |
| `--foreground` | `text-foreground` |
| `--primary` | `bg-primary text-primary-foreground` |
| `--destructive` | `bg-destructive text-destructive-foreground` |
| `--muted-foreground` | `text-muted-foreground` |
| `--border` | `border-border` |
| `--ring` | `ring-ring` |

### Typography Classes

| Element | Recommended Classes |
|---------|---------------------|
| Page Title | `text-h1 font-bold leading-tight tracking-tight` |
| Section Heading | `text-h2 font-semibold leading-tight` |
| Card Title | `text-h4 font-semibold leading-snug` |
| Body Text | `text-base leading-relaxed` |
| Secondary Text | `text-sm text-muted-foreground` |
| Button | `text-sm font-medium tracking-wide` |

### Spacing Classes

| Context | Recommended Gap |
|---------|-----------------|
| Card padding | `p-6` (24px) |
| Section gaps | `gap-6` (24px) |
| Form field gaps | `space-y-4` (16px) |
| Tight groups | `gap-2` (8px) |

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-30  
**WCAG Compliance Target:** 2.1 Level AA  
**Compatibility:** Next.js 15, Tailwind CSS v4, React 19
