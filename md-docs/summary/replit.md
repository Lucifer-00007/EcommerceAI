# ShopHub - eCommerce Platform

## Overview

ShopHub is a full-stack eCommerce web application built with React and Express. It provides a complete online shopping experience with support for multiple user roles (customers, sellers, and admins). The platform includes product browsing, shopping cart, wishlist, order management, and dedicated dashboards for sellers and administrators.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter (lightweight React router)
- **State Management**: 
  - Server state: TanStack Query (React Query) for API data fetching and caching
  - Client state: Zustand with persistence for shopping cart
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theme configuration supporting light/dark modes
- **Forms**: React Hook Form with Zod schema validation

### Backend Architecture
- **Framework**: Express.js (v5) running on Node.js
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas for type-safe request/response validation
- **Authentication**: Session-based authentication using Passport.js with local strategy
- **Password Security**: Scrypt hashing with salt for password storage

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` - contains all table definitions (users, products, orders, reviews, wishlists, categories, browse history)
- **Session Storage**: PostgreSQL via connect-pg-simple
- **Migrations**: Managed via drizzle-kit with migrations stored in `/migrations`

### Project Structure
```
├── client/           # Frontend React application
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/        # Route page components
│       ├── hooks/        # Custom React hooks
│       ├── stores/       # Zustand state stores
│       └── lib/          # Utilities and configurations
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Database operations layer
│   └── db.ts         # Database connection
├── shared/           # Shared code between client/server
│   ├── schema.ts     # Drizzle database schema
│   └── routes.ts     # API route type definitions
└── migrations/       # Database migrations
```

### Key Design Decisions

1. **Shared Schema Pattern**: The database schema and API route definitions are in `/shared`, allowing type-safe communication between frontend and backend.

2. **Role-Based Access Control**: Three user roles (customer, seller, admin) with middleware guards for protected routes. Sellers can manage their own products; admins have full system access.

3. **Cart Persistence**: Shopping cart uses Zustand with localStorage persistence, allowing cart data to survive page refreshes without requiring authentication.

4. **Theme Support**: Built-in light/dark mode theming with CSS variables, stored in localStorage.

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Database toolkit for schema management and queries

### Authentication
- **Passport.js**: Authentication middleware with local username/password strategy
- **express-session**: Session management with PostgreSQL session store

### Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **zustand**: Client-side state management
- **react-hook-form**: Form handling with validation
- **zod**: Schema validation for forms and API contracts
- **lucide-react**: Icon library
- **wouter**: Lightweight client-side routing

### UI Framework
- **shadcn/ui**: Component library (installed components in `client/src/components/ui/`)
- **Radix UI**: Headless UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Component variant styling

### Build Tools
- **Vite**: Frontend build tool and dev server
- **esbuild**: Server bundling for production
- **tsx**: TypeScript execution for development