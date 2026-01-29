# EcommerceAI - Modern eCommerce Frontend

A complete, production-ready eCommerce website frontend built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: 
  - Server state: TanStack Query (React Query)
  - Client state: Zustand
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Image Optimization**: next/image

## Features

### Pages
- ✅ Home page with hero, categories, and featured products
- ✅ Product listing with filters and sorting
- ✅ Product detail page with image gallery
- ✅ Shopping cart with quantity management
- ✅ Checkout with form validation
- ✅ Authentication (login/register)
- ✅ User account dashboard
- ✅ Orders page
- ✅ Profile settings
- ✅ 404 and error pages

### Key Features
- 🎨 Fully responsive design
- ♿ Accessibility-compliant components
- 🔍 Product search and filtering
- 🛒 Persistent cart (localStorage)
- 🔐 Mock authentication system
- 📱 Mobile-friendly navigation
- ⚡ Optimized images and performance
- 🎯 SEO-ready with metadata API
- 🔄 Loading states and skeletons
- 🎉 Toast notifications
- 📦 Feature-based architecture

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── account/             # User account pages
│   ├── auth/                # Authentication pages
│   ├── cart/                # Shopping cart
│   ├── checkout/            # Checkout flow
│   ├── products/            # Product pages
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── providers.tsx        # React Query provider
│   └── globals.css          # Global styles
├── components/              # Reusable components
│   ├── ui/                  # shadcn/ui components
│   ├── header.tsx           # Site header
│   ├── footer.tsx           # Site footer
│   ├── product-card.tsx     # Product card
│   └── product-skeleton.tsx # Loading skeletons
├── features/                # Feature-specific components
│   └── products/            # Product-related features
├── hooks/                   # Custom React hooks
│   └── use-toast.ts         # Toast notifications
├── lib/                     # Utility libraries
│   ├── utils.ts             # Helper functions
│   └── mock-data.ts         # Mock product data
├── services/                # API service layer
│   ├── product-service.ts   # Product API
│   └── order-service.ts     # Order API
├── store/                   # Zustand stores
│   ├── cart-store.ts        # Cart state
│   └── auth-store.ts        # Auth state
└── types/                   # TypeScript types
    └── index.ts             # Type definitions
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Create environment file:

```bash
cp .env.example .env.local
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

See `.env.example` for required environment variables:

- `NEXT_PUBLIC_API_URL` - API endpoint (currently using mock data)
- `NEXT_PUBLIC_JWT_SECRET` - JWT secret for mock auth
- Feature flags for optional features

## Architecture Decisions

### Why App Router?
- Server Components by default for better performance
- Built-in loading and error states
- Simplified data fetching
- Better SEO with metadata API

### Why Zustand for Cart?
- Minimal boilerplate
- Easy persistence with localStorage
- No provider wrapper needed
- Perfect for simple client state

### Why React Query?
- Automatic caching and revalidation
- Loading and error states
- Optimistic updates support
- Server state synchronization

### Why shadcn/ui?
- Copy-paste components (full control)
- Built on Radix UI (accessible)
- Customizable with Tailwind
- No runtime overhead

## Best Practices Implemented

### Code Quality
- ✅ Strict TypeScript mode
- ✅ Consistent naming conventions
- ✅ Feature-based folder structure
- ✅ Separation of concerns
- ✅ DRY principles

### Performance
- ✅ Server Components where possible
- ✅ Dynamic imports for heavy components
- ✅ Image optimization with next/image
- ✅ React Query caching
- ✅ Minimal client-side JavaScript

### Accessibility
- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Screen reader support

### Security
- ✅ Input validation with Zod
- ✅ XSS prevention
- ✅ Environment variables for secrets
- ✅ No sensitive data in client code

## Mock Data

The application uses mock data for demonstration. In production:

1. Replace `productService` with real API calls
2. Implement actual authentication backend
3. Connect to payment gateway
4. Add real order processing

## Customization

### Changing Theme Colors

Edit `tailwind.config.ts` and `src/app/globals.css` to customize the color scheme.

### Adding New Products

Edit `src/lib/mock-data.ts` to add or modify products and categories.

### Modifying Components

All shadcn/ui components are in `src/components/ui/` and can be customized directly.

## Production Checklist

Before deploying to production:

- [ ] Replace mock APIs with real endpoints
- [ ] Implement real authentication
- [ ] Add payment gateway integration
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure analytics
- [ ] Add rate limiting
- [ ] Implement proper SEO metadata
- [ ] Set up CI/CD pipeline
- [ ] Add comprehensive testing
- [ ] Configure CDN for images
- [ ] Enable security headers
- [ ] Set up monitoring

## Building for Production

```bash
npm run build
npm run start
```

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
