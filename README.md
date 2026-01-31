# EcommerceAI

A modern, responsive eCommerce platform built with Next.js 14, TypeScript, and Tailwind CSS. This project demonstrates best practices in frontend development with a complete shopping experience.

## 🚀 Features

### Core Functionality
- **Product Catalog**: Browse products with advanced filtering and search
- **Product Details**: View detailed product information with image galleries
- **Shopping Cart**: Full cart management with quantity controls and price calculations
- **User Authentication**: Login and registration with form validation
- **Responsive Design**: Mobile-first approach with beautiful UI components

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **Next.js 14 App Router**: Latest Next.js features with server components
- **Tailwind CSS**: Modern utility-first styling
- **shadcn/ui**: Beautiful, accessible UI components
- **Zustand**: Lightweight state management for cart
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling with Zod validation
- **Lucide React**: Beautiful icons

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand (client) + TanStack Query (server)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Images**: next/image optimization

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ecommerce-ai
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (shop)/            # Shop pages
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   └── product/          # Product-specific components
├── features/             # Feature-based modules
│   ├── cart/            # Cart functionality
│   ├── products/        # Product functionality
│   └── auth/            # Authentication functionality
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── services/            # API services
├── stores/              # Zustand stores
├── types/               # TypeScript type definitions
└── utils/               # Helper functions
```

## 🎯 Key Pages

### Home Page (`/`)
- Hero section with call-to-action
- Featured products showcase
- Category browsing
- Feature highlights

### Products Page (`/products`)
- Product grid with pagination
- Advanced filtering (category, price, rating)
- Sorting options
- Search functionality

### Product Detail (`/products/[id]`)
- Image gallery with thumbnails
- Product information and specifications
- Customer reviews
- Add to cart functionality

### Shopping Cart (`/cart`)
- Cart item management
- Quantity controls
- Price breakdown
- Checkout integration

### Authentication
- Login page (`/login`)
- Registration page (`/register`)
- Form validation and error handling

## 🔐 Demo Account

For testing purposes, use these credentials:
- **Email**: john.doe@example.com
- **Password**: password

## 🎨 UI Components

The project uses shadcn/ui components for consistent, accessible design:
- Buttons, inputs, labels
- Cards, badges, skeletons
- Modals, dialogs, toasts
- Forms with validation

## 📱 Responsive Design

- Mobile-first approach
- Responsive breakpoints for all screen sizes
- Touch-friendly interactions
- Optimized images with next/image

## 🚀 Performance

- Image optimization with next/image
- Code splitting with dynamic imports
- Efficient state management
- SEO-friendly with proper metadata

## 🧪 Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

### Environment Variables

Create a `.env.local` file for environment-specific configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 📚 Best Practices Implemented

### Code Quality
- TypeScript strict mode
- ESLint configuration
- Consistent naming conventions
- Component composition

### Performance
- Lazy loading where appropriate
- Image optimization
- Efficient re-renders
- Proper caching strategies

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support

### Security
- Input validation
- XSS prevention
- Secure form handling
- Environment variable usage

## 🔄 State Management

### Client State (Zustand)
- Shopping cart state
- User authentication state
- Local storage persistence

### Server State (TanStack Query)
- Product data caching
- Automatic refetching
- Loading and error states
- Optimistic updates

## 🛒 Shopping Flow

1. Browse products on home or products page
2. View product details
3. Add items to cart
4. Review cart and adjust quantities
5. Proceed to checkout (not implemented in demo)
6. Complete purchase (mock implementation)

## 🚧 Future Enhancements

- Checkout and payment integration
- User account management
- Order history
- Wishlist functionality
- Product reviews and ratings
- Advanced search with filters
- Admin dashboard
- Real-time notifications
- Multi-language support

## 📄 License

This project is for educational purposes. Feel free to use it as a reference for your own projects.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or issues, please open an issue in the repository.

---

Built with ❤️ using modern web technologies