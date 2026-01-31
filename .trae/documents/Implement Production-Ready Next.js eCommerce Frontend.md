## Goal
Build a complete, production-ready eCommerce frontend per [main-plan.md](file:///Users/ani/Developer/ANI/%F0%9F%8D%80%20Projects&Orgs/1VibeCodeAI/AmazonQAI/EcommerceAI/plans/main-plan.md) using Next.js App Router + TypeScript strict + Tailwind + shadcn/ui + TanStack Query + Zustand + RHF + Zod.

## Project Scaffolding
1. Initialize a new Next.js (latest stable) app with App Router and TypeScript, enabling strict type-checking.
2. Add and configure:
   - Tailwind CSS (including typographic defaults and consistent container/breakpoints)
   - shadcn/ui (including cn helper, component registry, and Radix primitives)
   - TanStack Query (QueryClient, dehydrated/dev-friendly defaults)
   - Zustand + persist (cart + auth) with safe SSR/CSR hydration
   - React Hook Form + Zod + @hookform/resolvers
   - Lucide React
3. Add baseline quality tooling:
   - ESLint (Next.js), optional Prettier, and consistent import/alias conventions
   - Basic error reporting utilities (non-secret, user-safe)

## Architecture & Folder Structure
Create a feature-based structure aligned to the plan:
- src/app
  - (marketing)/ (home)
  - (shop)/products, products/[slug], cart, checkout
  - (auth)/login, register
  - account/profile, account/orders
  - api/ (mock endpoints)
  - error.tsx, not-found.tsx, layout.tsx
- src/components (shared UI composition components)
- src/features (domain features: cart, products, auth, checkout, account)
- src/hooks (shared hooks)
- src/lib (core libs: api client, query client, env, utils)
- src/services (API/service layer, Zod parsing)
- src/types (domain types)
- src/utils (formatters, guards)

## Mock Data & API Layer
1. Define canonical domain types (Product, Category, Review, Order, User, CartItem) with Zod schemas.
2. Add mock data sources (JSON/TS modules) for products, categories, reviews, orders.
3. Implement Next.js Route Handlers under src/app/api:
   - GET /api/products (supports filters/sort/pagination)
   - GET /api/products/[slug]
   - GET /api/categories
   - GET/POST /api/auth/login, /api/auth/register (mock session/JWT)
   - GET /api/account/profile, /api/account/orders (mock)
4. Build a typed fetch abstraction (apiClient) with:
   - consistent error shape
   - request cancellation support
   - runtime validation via Zod

## State Management
1. Cart store (Zustand):
   - add/remove/update quantity
   - derived totals
   - persistence to localStorage
   - safe hydration (no mismatch)
2. Auth store (Zustand):
   - mock login/register/logout
   - store minimal user/session state
   - protect account routes via client gate in layout (and optionally middleware if cookie-based)

## UI System (shadcn/ui-first)
1. Establish app shell:
   - Header (nav, search, cart badge)
   - Footer
   - Responsive layout container
2. Reusable components:
   - ProductCard, ProductGrid
   - Filters (category/price/rating) + SortSelect
   - Pagination (or infinite scroll; choose pagination first for deterministic SEO)
   - Skeleton loaders and empty states
   - Toast notifications and confirmation dialog patterns
3. Accessibility:
   - keyboard-friendly controls
   - proper form labels/aria
   - focus-visible styling

## Pages & Flows
1. Home
   - Hero, Featured products, Categories, Promotions
2. Product listing (/products)
   - filters + sorting + pagination
   - URL-driven state (search params) for shareability/SEO
3. Product detail (/products/[slug])
   - image gallery, price/description
   - add to cart
   - mocked reviews
4. Cart (/cart)
   - quantity management, remove
   - price breakdown
5. Checkout (/checkout)
   - shipping form (RHF + Zod)
   - payment form (mock)
   - order summary
6. Auth (/login, /register)
   - validated forms, mock API
7. Account
   - profile
   - orders list (mocked)
8. Error handling
   - app/not-found.tsx (404)
   - app/error.tsx (route segment error boundary)
   - defensive UI states for failed requests

## Performance & SEO
1. Use Server Components by default; introduce Client Components only for interactivity (filters UI, cart, forms, query provider).
2. Use next/image for all product imagery, with stable sizes and priority only where needed.
3. Add per-page metadata using Next.js metadata API (title, description, OG/Twitter).
4. Use dynamic imports only for heavy/rare UI (e.g., image gallery lightbox).

## Security & Best Practices
1. Keep business logic in services/features, not in presentational components.
2. No secrets in client; add .env.example for public config only.
3. Centralize error mapping; never surface raw stack traces to users.

## Documentation & Verification
1. Update README with:
   - prerequisites
   - environment variables
   - run/build steps
2. Add .env.example.
3. Verify locally by running typecheck, lint, and a production build.

## Deliverables Output (as implemented)
- Complete folder structure and all pages
- Fully typed components/hooks/services with Zod validation
- Mock endpoints and data
- Inline comments limited to “why” only where necessary
- Production readiness checklist included in README
