# ShopHub - eCommerce Frontend

A complete, production-ready eCommerce frontend built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- **Modern Tech Stack**: Next.js 14+ with App Router, TypeScript, Tailwind CSS
- **UI Components**: 40+ accessible components from shadcn/ui
- **State Management**: Zustand for cart and auth, React Query for server state
- **Forms**: React Hook Form with Zod validation
- **Authentication**: JWT-based auth with protected routes
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: WCAG-compliant components with keyboard navigation
- **Performance**: Optimized images, code splitting, and caching

## Pages

| Page | Description |
|------|-------------|
| `/` | Homepage with hero, featured products, categories |
| `/products` | Product listing with filters, sorting, pagination |
| `/products/[slug]` | Product detail with gallery, reviews, related products |
| `/cart` | Shopping cart with quantity management |
| `/checkout` | Multi-step checkout process |
| `/login` | User login |
| `/register` | User registration |
| `/account` | User profile management |
| `/account/orders` | Order history |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-app
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

- Email: `demo@example.com`
- Password: `password`

## Project Structure

```
my-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   ├── products/           # Product pages
│   │   ├── cart/               # Cart page
│   │   ├── checkout/           # Checkout page
│   │   ├── login/              # Login page
│   │   ├── register/           # Register page
│   │   ├── account/            # Account pages
│   │   ├── not-found.tsx       # 404 page
│   │   ├── error.tsx           # Error boundary
│   │   └── loading.tsx         # Loading state
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── common/             # Shared components
│   │   ├── layout/             # Layout components (Header, Footer)
│   │   └── providers/          # Context providers
│   ├── features/               # Feature-based modules
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   ├── stores/                 # Zustand stores
│   ├── services/               # API services
│   ├── types/                  # TypeScript types
│   └── mock/                   # Mock data
├── public/                     # Static assets
├── .env.example               # Environment variables template
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── package.json               # Dependencies
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |

## Key Technologies

- **Framework**: [Next.js](https://nextjs.org/) - React framework with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- **Components**: [shadcn/ui](https://ui.shadcn.com/) - Accessible UI components
- **State**: [Zustand](https://github.com/pmndrs/zustand) - Lightweight state management
- **Data Fetching**: [TanStack Query](https://tanstack.com/query) - Server state management
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) - Form handling and validation
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful icons

## Architecture Decisions

### State Management

- **Zustand** for client state (cart, auth) - simple, no boilerplate
- **React Query** for server state - caching, optimistic updates, error handling
- **URL params** for filter/sort state - shareable, persistent

### Component Structure

- **UI components** in `components/ui/` - reusable, unstyled primitives
- **Layout components** in `components/layout/` - Header, Footer
- **Feature components** co-located with pages

### Data Fetching

- Server Components for static data (homepage, product listings)
- Client Components with React Query for interactive data (filters, cart)
- Mock API layer for easy backend integration

## Customization

### Theming

Edit `src/app/globals.css` to customize colors:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... */
}
```

### Adding New Pages

1. Create a new folder in `src/app/`
2. Add `page.tsx` with your component
3. Add `layout.tsx` if needed
4. Update navigation in `Header.tsx`

### Connecting to Real API

1. Update `src/services/api.ts` to make real HTTP requests
2. Replace mock data with API calls
3. Update environment variables in `.env.local`

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

```bash
npm run build
```

Then serve the `dist` folder.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

## Support

For support, email support@shophub.com or open an issue on GitHub.
