# Ecommerce Application - Endpoints & Pages Documentation

## Table of Contents

- [Overview](#overview)
- [Route Groups](#route-groups)
- [Public Pages](#public-pages)
- [Authentication Pages](#authentication-pages)
- [Shop Pages](#shop-pages)
- [API Integration Points](#api-integration-points)
- [Component Structure](#component-structure)

---

## Overview

This document provides a comprehensive overview of all pages (endpoints) in the eCommerce application, their purposes, and how they function. The application is built with Next.js 14+ using the App Router architecture.

**Project Structure**: All source code is organized under the `src/` directory following Next.js best practices:
```
src/
├── app/           # Next.js App Router pages
├── components/    # React components
├── features/      # Feature-based modules (auth, cart, products)
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and constants
├── services/      # API services and mock data
├── types/         # TypeScript type definitions
└── utils/         # Additional utilities
```

---

## Route Groups

The application uses Next.js route groups to organize related pages:

| Route Group | Path Pattern | Purpose |
|-------------|--------------|---------|
| `(auth)` | `/login`, `/register` | Authentication pages with shared layout |
| `(shop)` | `/`, `/products`, `/cart`, etc. | Main shop pages with header/footer |

---

## Public Pages

### 1. Root Layout
**File**: [`src/app/layout.tsx`](src/app/layout.tsx)

| Attribute | Value |
|-----------|-------|
| **Route** | N/A (Root Layout) |
| **Type** | Server Component |
| **Purpose** | Application-wide layout wrapper |

**Description**: The root layout wraps the entire application and provides:
- HTML document structure
- Global metadata configuration
- Font loading and styling
- React Query provider setup
- Toast notification provider (Sonner)

**Key Features**:
- Sets up global context providers
- Configures SEO metadata defaults
- Applies global CSS styles

---

### 2. 404 Not Found Page
**File**: [`src/app/not-found.tsx`](src/app/not-found.tsx)

| Attribute | Value |
|-----------|-------|
| **Route** | Automatic on unmatched routes |
| **Type** | Server Component |
| **Purpose** | Display friendly error when page not found |

**Description**: Displayed when users navigate to non-existent routes. Features:
- Clean, centered error message
- 404 error icon using SearchX from Lucide
- Navigation links back to Home and Products pages
- Responsive design with action buttons

**Working**:
1. Renders automatically when no matching route exists
2. Uses Next.js `not-found` convention
3. Metadata sets page title to "Page Not Found"

---

### 3. Error Boundary
**File**: [`src/app/error.tsx`](src/app/error.tsx)

| Attribute | Value |
|-----------|-------|
| **Route** | Automatic on errors in route segments |
| **Type** | Client Component ("use client") |
| **Purpose** | Catch and display runtime errors gracefully |

**Description**: Error boundary that catches JavaScript errors in child components. Provides:
- Error fallback UI with AlertTriangle icon
- Retry functionality to reset error state
- Clean error messaging

**Working**:
1. Catches errors in route segment
2. Displays user-friendly error message
3. Provides "Try Again" button to reset

---

## Authentication Pages

### 4. Login Page
**File**: [`src/app/(auth)/login/page.tsx`](src/app/(auth)/login/page.tsx)

| Attribute | Value |
|-----------|-------|
| **Route** | `/login` |
| **Layout** | `(auth)/layout.tsx` |
| **Type** | Client Component ("use client") |
| **Purpose** | User authentication for existing customers |

**Description**: Login page with email/password form for existing customers. Features a centered card layout with form inputs and navigation to registration.

**UI Components**:
- Card with header, content, and footer
- Email input field
- Password input field
- Submit button with loading state
- Link to registration page

**Working**:
1. Displays email and password input fields
2. Validates required fields
3. Shows loading state during submission
4. Simulates authentication delay (1 second)
5. Redirects to home on success (future implementation)

**Form Fields**:
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Email | email | Yes | Valid email format |
| Password | password | Yes | Non-empty |

---

### 5. Register Page
**File**: [`src/app/(auth)/register/page.tsx`](src/app/(auth)/register/page.tsx)

| Attribute | Value |
|-----------|-------|
| **Route** | `/register` |
| **Layout** | `(auth)/layout.tsx` |
| **Type** | Client Component ("use client") |
| **Purpose** | New user account creation |

**Description**: Registration page for new customers to create accounts. Features a form with personal details and password setup.

**UI Components**:
- Card layout with form sections
- Two-column layout for name fields
- Email and password fields
- Password confirmation field
- Submit button with loading state
- Link to login page

**Working**:
1. Collects first name, last name, email, password
2. Validates password confirmation match
3. Shows loading state during submission
4. Simulates registration delay
5. Redirects to login on success (future)

**Form Fields**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| First Name | text | Yes | - |
| Last Name | text | Yes | - |
| Email | email | Yes | Valid email format |
| Password | password | Yes | Min strength required |
| Confirm Password | password | Yes | Must match password |

---

### 6. Auth Layout
**File**: [`src/app/(auth)/layout.tsx`](src/app/(auth)/layout.tsx)

| Attribute | Value |
|-----------|-------|
| **Route** | Wraps `/login` and `/register` |
| **Type** | Server Component |
| **Purpose** | Shared layout for authentication pages |

**Description**: Provides a centered, minimal layout for authentication pages with:
- Centered card container
- Brand/logo display
- Footer with links
- Responsive padding

---

## Shop Pages

### 7. Home Page (Landing)
**File**: [`src/app/(shop)/page.tsx`](src/app/(shop)/page.tsx)

| Attribute | Value |
|-----------|-------|
| **Route** | `/` |
| **Layout** | `(shop)/layout.tsx` |
| **Type** | Server Component |
| **Purpose** | Landing page showcasing featured content |

**Description**: The main landing page featuring hero section, featured products, and category browsing. Optimized for SEO and conversion.

**Sections**:
1. **Hero Section**: Full-width banner with CTA buttons
   - Welcome headline with app name
   - Description text
   - "Shop Now" and "Browse Categories" buttons

2. **Featured Products Section**: Grid of highlighted products
   - Section title
   - Product cards (placeholder)

3. **Categories Section**: Browse by category
   - Section title
   - Category cards (placeholder)

**SEO Metadata**:
- Title: App name from config
- Description: App description
- OpenGraph tags for social sharing

**Working**:
1. Renders server-side for optimal performance
2. Loads static content immediately
3. CTAs navigate to `/products` and `/categories`

---

### 8. Products Listing Page
**File**: [`src/app/(shop)/products/page.tsx`](src/app/(shop)/products/page.tsx)

| Attribute | Value |
|-----------|-------|
| **Route** | `/products` |
| **Layout** | `(shop)/layout.tsx` |
| **Type** | Server Component |
| **Purpose** | Display product catalog with filtering and sorting |

**Description**: Product listing page with sidebar filters and product grid. Supports server-side filtering and pagination.

**Layout**:
```
┌─────────────────────────────────────────┐
│  Header: Title + Description            │
├──────────────────┬──────────────────────┤
│                  │                      │
│  Filters Sidebar │   Products Grid      │
│  - Categories    │   - Sort dropdown    │
│  - Price Range   │   - Product cards    │
│  - Rating        │   - Pagination       │
│  - etc.          │                      │
│                  │                      │
└──────────────────┴──────────────────────┘
```

**Working**:
1. Fetches products server-side
2. Applies URL query parameters for filters
3. Renders filter sidebar
4. Displays product grid
5. Supports sorting and pagination

**Query Parameters** (Future Implementation):
| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category slug |
| `min_price` | number | Minimum price filter |
| `max_price` | number | Maximum price filter |
| `sort` | string | Sort order (featured, price-asc, price-desc, newest) |
| `page` | number | Page number for pagination |

---

### 9. Product Detail Page
**File**: [`src/app/(shop)/products/[id]/page.tsx`](src/app/(shop)/products/[id]/page.tsx)

| Attribute | Value |
|-----------|-------|
| **Route** | `/products/[id]` |
| **Layout** | `(shop)/layout.tsx` |
| **Type** | Server Component (Async) |
| **Purpose** | Display detailed product information |

**Description**: Dynamic product detail page showing comprehensive product information with image gallery, pricing, description, and reviews.

**Layout**:
```
┌─────────────────────────────────────────┐
│  Breadcrumbs: Home / Products / [Name]  │
├──────────────────┬──────────────────────┤
│                  │                      │
│  Image Gallery   │   Product Info       │
│  - Main image    │   - Title            │
│  - Thumbnails    │   - Price            │
│                  │   - Description      │
│                  │   - Add to Cart      │
│                  │   - Add to Wishlist  │
│                  │                      │
├──────────────────┴──────────────────────┤
│                                         │
│  Reviews Section                        │
│  - Average rating                       │
│  - Individual reviews                   │
│  - Write review form                    │
│                                         │
└─────────────────────────────────────────┘
```

**Working**:
1. Receives `id` parameter from URL
2. Validates ID format (numeric)
3. Fetches product data server-side
4. Generates dynamic metadata
5. Renders product information
6. Displays image gallery
7. Shows customer reviews

**Dynamic Metadata**:
- Title: Product name
- Description: Product description excerpt

**Error Handling**:
- Returns 404 if product not found
- Validates ID format before fetching

---

### 10. Shopping Cart Page
**File**: [`src/app/(shop)/cart/page.tsx`](src/app/(shop)/cart/page.tsx)

| Attribute | Value |
|-----------|-------|
| **Route** | `/cart` |
| **Layout** | `(shop)/layout.tsx` |
| **Type** | Client Component ("use client") |
| **Purpose** | Display and manage cart contents |

**Description**: Shopping cart page allowing users to review items, adjust quantities, and proceed to checkout.

**States**:

**Empty Cart**:
- Friendly message "Your cart is empty"
- "Continue Shopping" button linking to products

**Cart with Items**:
```
┌─────────────────────────────┬──────────────┐
│                             │              │
│  Cart Items List            │  Order       │
│  - Product image            │  Summary     │
│  - Name & variant           │  - Subtotal  │
│  - Price                    │  - Shipping  │
│  - Quantity controls        │  - Tax       │
│  - Remove button            │  - Total     │
│                             │              │
│                             │  [Checkout]  │
│                             │              │
└─────────────────────────────┴──────────────┘
```

**Working**:
1. Connects to cart store (Zustand)
2. Lists all cart items
3. Allows quantity adjustment
4. Calculates totals (subtotal, shipping, tax)
5. Provides checkout button

**Features**:
- Real-time price calculations
- Quantity increment/decrement
- Item removal
- Persistent cart state

---

### 11. Checkout Page
**File**: [`src/app/(shop)/checkout/page.tsx`](src/app/(shop)/checkout/page.tsx)

| Attribute | Value |
|-----------|-------|
| **Route** | `/checkout` |
| **Layout** | `(shop)/layout.tsx` |
| **Type** | Client Component ("use client") |
| **Purpose** | Multi-step checkout process |

**Description**: Multi-step checkout wizard guiding users through shipping, payment, and order review.

**Checkout Steps**:

| Step | Name | Description |
|------|------|-------------|
| 1 | Shipping | Collect shipping address and method |
| 2 | Payment | Payment method and card details |
| 3 | Review | Final order review and confirmation |

**Layout**:
```
┌─────────────────────────────────────────┐
│  ← Back to Cart                         │
│  Checkout                               │
├─────────────────────────────────────────┤
│  [1. Shipping] → [2. Payment] → [3. Review] │
├─────────────────────────────┬───────────┤
│                             │           │
│  Step Content               │  Order    │
│  - Form fields              │  Summary  │
│  - Navigation buttons       │  - Items  │
│                             │  - Total  │
│                             │           │
└─────────────────────────────┴───────────┘
```

**Working**:
1. Validates cart is not empty
2. Progresses through 3-step wizard
3. Saves data at each step
4. Calculates final totals
5. Places order on final step
6. Redirects to order confirmation

**State Management**:
- Current step tracking
- Form data persistence
- Validation at each step

---

### 12. Account Dashboard Page
**File**: [`src/app/(shop)/account/page.tsx`](src/app/(shop)/account/page.tsx)

| Attribute | Value |
|-----------|-------|
| **Route** | `/account` |
| **Layout** | `(shop)/layout.tsx` |
| **Type** | Client Component ("use client") |
| **Purpose** | User account management dashboard |

**Description**: User account dashboard with tabs for profile, orders, and settings. Requires authentication.

**Tabs**:

| Tab | Content |
|-----|---------|
| **Profile** | Personal information display and editing |
| **Orders** | Order history with status tracking |
| **Settings** | Password, newsletter, and preferences |

**Layout**:
```
┌─────────────────────────────────────────┐
│  My Account                             │
├─────────────────────────────────────────┤
│  [Profile] [Orders] [Settings]          │
├─────────────────────────────────────────┤
│                                         │
│  Tab Content                            │
│  - Profile: Name, Email, Phone          │
│  - Orders: List with status             │
│  - Settings: Password, Newsletter       │
│                                         │
└─────────────────────────────────────────┘
```

**Working**:
1. Verifies user authentication
2. Fetches user profile data
3. Displays editable profile information
4. Shows order history
5. Allows settings management

---

### 13. Shop Layout
**File**: [`src/app/(shop)/layout.tsx`](src/app/(shop)/layout.tsx)

| Attribute | Value |
|-----------|-------|
| **Route** | Wraps all shop pages |
| **Type** | Server Component |
| **Purpose** | Shared layout with navigation and footer |

**Description**: Main application layout providing consistent header, navigation, and footer across all shop pages.

**Structure**:
```
┌─────────────────────────────────────────┐
│  Header                                 │
│  - Logo (links to /)                    │
│  - Navigation (Home, Products, Cart)    │
│  - Sign In link                         │
├─────────────────────────────────────────┤
│                                         │
│  Main Content (children)                │
│                                         │
├─────────────────────────────────────────┤
│  Footer                                 │
│  - Copyright notice                     │
└─────────────────────────────────────────┘
```

**Components Used**:
- Header with logo and navigation
- Main content area
- Footer with copyright

---

## API Integration Points

### Data Fetching Patterns

**Server Components** (Products Page, Home):
```typescript
// Direct data fetching
const products = await getProducts();
```

**Client Components** (Cart, Checkout):
```typescript
// React Query hooks
const { data: cart } = useCart();
const { mutate: addToCart } = useAddToCart();
```

### Key Services

| Service | File | Purpose |
|---------|------|---------|
| Products | [`src/services/products.ts`](src/services/products.ts) | Product CRUD operations |
| Mock Data | [`src/services/mock-data.ts`](src/services/mock-data.ts) | Development data |
| API | [`src/services/api.ts`](src/services/api.ts) | API client setup |

---

## Component Structure

### Common Components
Located in [`src/components/common/`](src/components/common/)

| Component | Purpose |
|-----------|---------|
| `breadcrumb.tsx` | Navigation breadcrumbs |
| `empty-state.tsx` | Empty state placeholder |
| `error-fallback.tsx` | Error display component |
| `filters.tsx` | Product filter controls |
| `pagination.tsx` | Pagination controls |
| `price.tsx` | Price display with formatting |
| `product-card.tsx` | Product grid card |
| `product-skeleton.tsx` | Loading skeleton |
| `quantity-selector.tsx` | Quantity input control |
| `sort-select.tsx` | Sorting dropdown |
| `star-rating.tsx` | Star rating display |

### Layout Components
Located in [`src/components/layout/`](src/components/layout/)

| Component | Purpose |
|-----------|---------|
| `cart-drawer.tsx` | Slide-out cart drawer |
| `footer.tsx` | Site footer |
| `header.tsx` | Site header with navigation |
| `mobile-menu.tsx` | Mobile navigation menu |
| `navigation.tsx` | Desktop navigation |
| `search-bar.tsx` | Product search with suggestions |
| `user-menu.tsx` | User dropdown menu |

### Feature Modules
Located in [`src/features/`](src/features/)

| Feature | Purpose |
|---------|---------|
| `auth/` | Authentication state and components |
| `cart/` | Cart state management (Zustand) |
| `products/` | Product-related features |
| `user/` | User-related features |

---

## Future Endpoints (Planned)

| Route | Purpose | Status |
|-------|---------|--------|
| `/categories` | Category browsing page | Planned |
| `/categories/[slug]` | Category detail page | Planned |
| `/deals` | Promotions and deals | Planned |
| `/account/orders` | Order history (dedicated) | Planned |
| `/account/wishlist` | Saved items | Planned |
| `/contact` | Contact form | Planned |
| `/about` | About page | Planned |

---

## Technical Notes

### Server vs Client Components

**Server Components** (Default):
- Home page (`/`)
- Products listing (`/products`)
- Product detail (`/products/[id]`)
- Layouts

**Client Components** ("use client"):
- Login/Register pages
- Cart page
- Checkout page
- Account page
- Interactive components

### Data Flow

```
User Request
    ↓
Next.js Router
    ↓
Layout (Server)
    ↓
Page Component
    ↓
Server: Direct data fetch
Client: React Query hook
    ↓
Render UI
```

### State Management

| State Type | Solution | Usage |
|------------|----------|-------|
| Server State | React Query | API data, caching |
| Client State | Zustand | Cart, UI state |
| Form State | React Hook Form | Form handling |

---

*Document Version: 1.0*
*Last Updated: 2026-01-29*
