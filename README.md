# EcommerceAI

Production-ready eCommerce website frontend built with Next.js App Router, TypeScript (strict), Tailwind CSS, and shadcn/ui.

## Tech Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query (server state)
- Zustand (cart + auth state, persisted)
- React Hook Form + Zod (forms + validation)
- Lucide React (icons)

## Local Development

1. Install dependencies:

```bash
npm install
```

2. (Optional) create your env file:

```bash
cp .env.example .env.local
```

3. Run the dev server:

```bash
npm run dev
```

Open http://localhost:3000

### Demo Account

- Email: demo@shop.local
- Password: password

## Scripts

- dev: Run local development server
- build: Build production bundle
- build:static: Build static export to `.out/` for Firebase Hosting
- start: Run production server
- lint: Run ESLint

## Architecture Overview

- App Router pages live in src/app and default to Server Components.
- Client Components are used only for interactive features:
  - product filters/sorting/pagination
  - cart state (Zustand, persisted)
  - auth forms and account views
- API is mocked using Next.js route handlers under src/app/api.
- All API responses are runtime-validated with Zod via a shared fetch wrapper.

## Folder Structure (high level)

```
src/
  app/
    api/
    account/
    cart/
    checkout/
    login/
    products/
    register/
  components/
    common/
    cart/
    layout/
    product/
    ui/
  features/
    account/
    auth/
    cart/
    products/
  hooks/
  lib/
  services/
  types/
  utils/
public/
  products/
```

## Production Readiness Checklist

- TypeScript strict mode enabled
- Centralized fetch abstraction with consistent error handling
- Runtime validation of API responses (Zod)
- Defensive UI states (loading/error/empty)
- Accessible inputs, labels, and keyboard-friendly controls
- Next.js metadata API configured (global + per-page)
- Images rendered with next/image (optimized)
