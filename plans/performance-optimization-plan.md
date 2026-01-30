# Performance Analysis and Optimization Plan
## EcommerceAI - Next.js E-commerce Application

**Analysis Date:** 2026-01-30
**Current Average Response Time:** 1.4 seconds (1206ms - 1558ms)
**Target Response Time:** < 300ms
**Performance Gap:** ~1.1 seconds (4.7x improvement needed)

---

## Executive Summary

The EcommerceAI application currently experiences significant latency issues with GET requests averaging 1.4 seconds. This analysis identifies the root causes and provides a comprehensive optimization roadmap to achieve the target of under 300ms response time.

### Key Findings
- **Primary Bottleneck:** Mock API delays (500-1500ms) on every request
- **Secondary Issues:** No caching, no request deduplication, client-side filtering
- **Frontend Issues:** Unnecessary re-renders, no code splitting, no lazy loading
- **Infrastructure:** No CDN, no compression optimization, no database indexing

---

## 1. Identified Bottlenecks

### 1.1 Backend/Data Layer Bottlenecks

#### 1.1.1 Mock API Delays (Critical)
**Location:** [`src/lib/constants.ts`](src/lib/constants.ts:168-173)
```typescript
export const MOCK_API_DELAY = {
  MIN_DELAY: 500,
  MAX_DELAY: 1500,
} as const;
```

**Impact:** Every API call waits 500-1500ms before returning data
**Severity:** Critical - This is the primary cause of slow response times

**Affected Services:**
- [`products.service.ts`](src/services/products.service.ts) - All product operations
- [`cart.service.ts`](src/services/cart.service.ts) - All cart operations
- [`orders.service.ts`](src/services/orders.service.ts) - All order operations
- [`auth.service.ts`](src/services/auth.service.ts) - All auth operations

#### 1.1.2 No Caching Layer
**Impact:** Every request fetches fresh data, even for unchanged content
**Severity:** High

**Missing Caching:**
- No in-memory cache for frequently accessed data
- No Redis or similar caching solution
- No HTTP cache headers
- No browser caching strategies

#### 1.1.3 No Request Deduplication
**Location:** [`src/lib/api-client.ts`](src/lib/api-client.ts:279-376)

**Impact:** Multiple identical requests execute independently
**Severity:** Medium

**Example Scenario:**
```typescript
// Home page fetches featured products
const [featuredProducts, categories] = await Promise.all([
  getFeaturedProducts(),  // 500-1500ms
  getCategories(),       // 500-1500ms
]);
// Total: 1000-3000ms (worst case)
```

#### 1.1.4 Client-Side Filtering
**Location:** [`src/services/products.service.ts`](src/services/products.service.ts:28-125)

**Impact:** Fetching all products then filtering on client
**Severity:** High

**Current Implementation:**
```typescript
export async function getProducts(filters?: ProductFilter, ...) {
  await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);
  let filteredProducts = [...MOCK_PRODUCTS]; // All 32 products

  // Apply filters client-side
  if (filters?.category) {
    filteredProducts = filteredProducts.filter(...);
  }
  // ... more filters
}
```

**Problem:** Fetches all products regardless of filters, then filters in memory

#### 1.1.5 No Database Query Optimization
**Impact:** Inefficient data retrieval patterns
**Severity:** Medium (will become Critical with real database)

**Issues:**
- No query batching
- No selective field projection
- No pagination at database level
- No indexing strategy

#### 1.1.6 No Server-Side Rendering Optimization
**Location:** [`src/app/(shop)/page.tsx`](src/app/(shop)/page.tsx:15-20)

**Impact:** Data fetching happens on every page load
**Severity:** Medium

**Current Implementation:**
```typescript
export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);
  // No caching, no ISR, no SSG
}
```

### 1.2 Frontend Bottlenecks

#### 1.2.1 Unnecessary Re-renders
**Location:** [`src/components/layout/header.tsx`](src/components/layout/header.tsx:18-21)

**Impact:** Header re-renders on every cart state change
**Severity:** Medium

```typescript
export default function Header() {
  const totalItems = useCartTotalItems(); // Triggers re-render on every cart change
  // Header has 100+ lines of JSX that re-render unnecessarily
}
```

#### 1.2.2 No Code Splitting
**Impact:** Large initial bundle size
**Severity:** Medium

**Issues:**
- No dynamic imports for heavy components
- No route-based code splitting
- All components loaded upfront

#### 1.2.3 No Lazy Loading for Images
**Location:** [`src/components/features/products/product-card.tsx`](src/components/features/products/product-card.tsx:128-134)

**Impact:** All images load immediately, even below the fold
**Severity:** Medium

```typescript
<Image
  src={product.images[0]}
  alt={product.name}
  fill
  // No loading="lazy" for below-fold images
/>
```

#### 1.2.4 No Virtual Scrolling
**Impact:** Performance degrades with large product lists
**Severity:** Low (current dataset is small)

**Problem:** Renders all product cards even when only visible ones are needed

#### 1.2.5 No Memoization for Expensive Computations
**Location:** [`src/components/features/products/product-card.tsx`](src/components/features/products/product-card.tsx:101-117)

**Impact:** Star rendering recalculates on every render
**Severity:** Low

```typescript
const renderStars = (rating: number) => {
  // Recalculates on every render
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  // ...
};
```

#### 1.2.6 No Request Batching
**Location:** [`src/features/cart/store.ts`](src/features/cart/store.ts:119-182)

**Impact:** Multiple cart operations trigger multiple API calls
**Severity:** Low

**Problem:** Each cart action (add, remove, update) makes separate API call

### 1.3 Infrastructure Bottlenecks

#### 1.3.1 No CDN Configuration
**Impact:** Static assets served from origin server
**Severity:** High

**Missing:**
- No CDN for images
- No CDN for static assets
- No edge caching

#### 1.3.2 No Compression Optimization
**Location:** [`next.config.js`](next.config.js:18)

**Impact:** Larger payload sizes
**Severity:** Medium

**Current:**
```javascript
compress: true, // Basic gzip only
```

**Missing:**
- Brotli compression
- Asset-specific compression levels

#### 1.3.3 No Image Optimization Strategy
**Location:** [`next.config.js`](next.config.js:3-15)

**Impact:** Suboptimal image delivery
**Severity:** Medium

**Current Configuration:**
```javascript
images: {
  remotePatterns: [{ protocol: 'https', hostname: '**' }],
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

**Issues:**
- Too many device sizes (increases build time)
- No quality optimization
- No placeholder blur strategy

---

## 2. Optimization Strategies

### 2.1 Backend/Data Layer Optimizations

#### 2.1.1 Remove/Reduce Mock API Delays (Critical)
**Priority:** P0 - Immediate
**Expected Impact:** 500-1500ms reduction per request

**Implementation:**
```typescript
// src/lib/constants.ts
export const MOCK_API_DELAY = {
  MIN_DELAY: 0,    // Remove delay
  MAX_DELAY: 50,   // Minimal delay for realism
} as const;
```

**Alternative:** Use environment-based delays
```typescript
export const MOCK_API_DELAY = {
  MIN_DELAY: process.env.NODE_ENV === 'production' ? 0 : 100,
  MAX_DELAY: process.env.NODE_ENV === 'production' ? 0 : 200,
} as const;
```

#### 2.1.2 Implement Multi-Level Caching (Critical)
**Priority:** P0 - Immediate
**Expected Impact:** 80-90% reduction in response time for cached data

**Strategy:**
1. **In-Memory Cache** (Node.js)
2. **Redis Cache** (Production)
3. **HTTP Cache Headers**
4. **Browser Cache**

**Implementation:**

```typescript
// src/lib/cache.ts
import { LRUCache } from 'lru-cache';

// In-memory cache for development
const memoryCache = new LRUCache<string, any>({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
});

export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 1000 * 60 * 5
): Promise<T> {
  // Check memory cache
  const cached = memoryCache.get(key);
  if (cached) return cached;

  // Fetch data
  const data = await fetcher();

  // Store in cache
  memoryCache.set(key, data, { ttl });

  return data;
}

// Usage in services
export async function getFeaturedProducts(): Promise<Product[]> {
  return cachedFetch(
    'products:featured',
    async () => {
      await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);
      return MOCK_PRODUCTS.filter(p => p.rating >= 4.5 && p.reviewsCount >= 100);
    },
    1000 * 60 * 10 // 10 minutes
  );
}
```

**Redis Implementation (Production):**
```typescript
// src/lib/redis.ts
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300
): Promise<T> {
  // Check Redis
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  // Fetch data
  const data = await fetcher();

  // Store in Redis
  await redis.setex(key, ttl, JSON.stringify(data));

  return data;
}
```

#### 2.1.3 Implement Request Deduplication (High)
**Priority:** P1 - High
**Expected Impact:** 30-50% reduction for concurrent requests

**Implementation:**
```typescript
// src/lib/api-client.ts
const pendingRequests = new Map<string, Promise<any>>();

async function request<T>(...) {
  const requestKey = `${method}:${url}:${JSON.stringify(config.params)}`;

  // Check if request is already pending
  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey);
  }

  // Create new request
  const requestPromise = (async () => {
    try {
      // ... existing request logic
    } finally {
      pendingRequests.delete(requestKey);
    }
  })();

  pendingRequests.set(requestKey, requestPromise);
  return requestPromise;
}
```

#### 2.1.4 Server-Side Filtering (High)
**Priority:** P1 - High
**Expected Impact:** 40-60% reduction in data transfer

**Implementation:**
```typescript
// src/services/products.service.ts
export async function getProducts(
  filters?: ProductFilter,
  page: number = 1,
  limit: number = 12
): Promise<ProductListResponse> {
  await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

  // Apply filters BEFORE fetching (simulated)
  let filteredProducts = [...MOCK_PRODUCTS];

  // In real implementation, this would be a database query
  // SELECT * FROM products WHERE category = ? AND price BETWEEN ? AND ?
  // LIMIT ? OFFSET ?

  // ... filter logic

  return {
    products: paginatedProducts,
    total,
    page,
    pageSize: limit,
    hasMore,
  };
}
```

**Database Query Example:**
```typescript
// With Prisma/PostgreSQL
export async function getProducts(filters: ProductFilter, page: number, limit: number) {
  const where: any = {};

  if (filters?.category) where.category = filters.category;
  if (filters?.minPrice) where.price = { ...where.price, gte: filters.minPrice };
  if (filters?.maxPrice) where.price = { ...where.price, lte: filters.maxPrice };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        price: true,
        // Only select needed fields
      },
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, page, pageSize: limit };
}
```

#### 2.1.5 Implement Database Query Optimization (Medium)
**Priority:** P2 - Medium
**Expected Impact:** 20-40% reduction in query time

**Strategies:**
1. **Add Indexes:**
```sql
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_rating ON products(rating);
CREATE INDEX idx_products_created_at ON products(created_at);
```

2. **Query Batching:**
```typescript
// Instead of multiple queries
const product = await getProductById(id);
const reviews = await getProductReviews(id);
const related = await getRelatedProducts(id);

// Use single query with joins
const data = await prisma.product.findUnique({
  where: { id },
  include: {
    reviews: true,
    related: true,
  },
});
```

3. **Selective Field Projection:**
```typescript
// Only fetch needed fields
const products = await prisma.product.findMany({
  select: {
    id: true,
    name: true,
    price: true,
    images: true,
    // Exclude heavy fields like description
  },
});
```

#### 2.1.6 Implement Next.js Caching Strategies (High)
**Priority:** P1 - High
**Expected Impact:** 70-90% reduction for static/semi-static content

**ISR (Incremental Static Regeneration):**
```typescript
// src/app/(shop)/page.tsx
export const revalidate = 300; // Revalidate every 5 minutes

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);
  // ...
}
```

**SSG (Static Site Generation):**
```typescript
// src/app/(shop)/products/page.tsx
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

export const dynamic = 'force-static';
```

**On-Demand Revalidation:**
```typescript
// src/app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path');
  if (path) {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true });
  }
  return NextResponse.json({ revalidated: false }, { status: 400 });
}
```

### 2.2 Frontend Optimizations

#### 2.2.1 Implement React.memo and useMemo (Medium)
**Priority:** P2 - Medium
**Expected Impact:** 10-20% reduction in render time

**ProductCard Optimization:**
```typescript
// src/components/features/products/product-card.tsx
import { memo, useMemo } from 'react';

const StarRating = memo(({ rating }: { rating: number }) => {
  const stars = useMemo(() => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return { fullStars, hasHalfStar, emptyStars };
  }, [rating]);

  return (
    <div className="flex items-center space-x-0.5">
      {[...Array(stars.fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
      {stars.hasHalfStar && <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
      {[...Array(stars.emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      ))}
    </div>
  );
});

export default memo(function ProductCard({ product, ...props }: ProductCardProps) {
  const discount = useMemo(() =>
    product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0,
    [product.originalPrice, product.price]
  );

  // ... rest of component
});
```

**Header Optimization:**
```typescript
// src/components/layout/header.tsx
const CartBadge = memo(({ totalItems }: { totalItems: number }) => {
  return (
    <Link href="/cart">
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </Button>
    </Link>
  );
});

export default function Header() {
  const totalItems = useCartTotalItems();
  // ... rest of component
  return (
    // ...
    <CartBadge totalItems={totalItems} />
    // ...
  );
}
```

#### 2.2.2 Implement Code Splitting (Medium)
**Priority:** P2 - Medium
**Expected Impact:** 30-40% reduction in initial bundle size

**Dynamic Imports:**
```typescript
// src/app/(shop)/page.tsx
import dynamic from 'next/dynamic';

// Lazy load heavy components
const ProductCard = dynamic(() => import('@/components/features/products/product-card'), {
  loading: () => <ProductCardSkeleton />,
  ssr: true,
});

const TestimonialsSection = dynamic(
  () => import('@/components/sections/testimonials-section'),
  { loading: () => <SectionSkeleton /> }
);

export default async function HomePage() {
  // ...
}
```

**Route-Based Splitting:**
```typescript
// Already handled by Next.js App Router
// Each route is automatically code-split
```

#### 2.2.3 Implement Image Lazy Loading (Medium)
**Priority:** P2 - Medium
**Expected Impact:** 20-30% reduction in initial page load

**Implementation:**
```typescript
// src/components/features/products/product-card.tsx
<Image
  src={product.images[0]}
  alt={product.name}
  fill
  loading="lazy" // Add this
  className="object-cover transition-transform duration-300 group-hover:scale-105"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
  placeholder="blur" // Add blur placeholder
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD/2g=="
/>
```

**Priority Loading for Above-Fold Images:**
```typescript
// src/app/(shop)/page.tsx
<Image
  src="https://placehold.co/800x800/1a1a2e/FFF?text=Shopping+Experience"
  alt="Shopping Experience"
  fill
  priority // Load immediately (above the fold)
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

#### 2.2.4 Implement Virtual Scrolling (Low)
**Priority:** P3 - Low
**Expected Impact:** Significant improvement for large lists (100+ items)

**Implementation:**
```typescript
// Using react-window or react-virtual
import { FixedSizeGrid } from 'react-window';

export default function ProductList({ products }: { products: Product[] }) {
  return (
    <FixedSizeGrid
      columnCount={4}
      columnWidth={300}
      height={600}
      rowCount={Math.ceil(products.length / 4)}
      rowHeight={400}
      width={1200}
    >
      {({ columnIndex, rowIndex, style }) => {
        const index = rowIndex * 4 + columnIndex;
        const product = products[index];
        if (!product) return null;
        return (
          <div style={style}>
            <ProductCard product={product} />
          </div>
        );
      }}
    </FixedSizeGrid>
  );
}
```

#### 2.2.5 Implement Request Batching (Low)
**Priority:** P3 - Low
**Expected Impact:** 10-20% reduction for multiple cart operations

**Implementation:**
```typescript
// src/features/cart/store.ts
import { debounce } from 'lodash-es';

// Debounce cart sync to server
const syncCart = debounce(async (items: CartItem[]) => {
  await fetch('/api/cart/sync', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
}, 1000);

addItem: (product, quantity = 1) => {
  // ... existing logic
  set({ items: newItems, ... });
  syncCart(newItems); // Debounced sync
}
```

### 2.3 Infrastructure Optimizations

#### 2.3.1 Implement CDN (High)
**Priority:** P1 - High
**Expected Impact:** 50-70% reduction in asset load time

**Strategy:**
1. **Image CDN:** Use Cloudinary, Imgix, or Vercel Image Optimization
2. **Static Asset CDN:** Use Cloudflare, AWS CloudFront, or Vercel Edge Network
3. **API CDN:** Use Vercel Edge Functions or Cloudflare Workers

**Vercel Image Optimization:**
```typescript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
    // Vercel automatically optimizes images
  },
};
```

**Cloudinary Integration:**
```typescript
// src/lib/image.ts
import { ImageLoader } from 'next/image';

export const cloudinaryLoader: ImageLoader = ({ src, width, quality }) => {
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`];
  return `https://res.cloudinary.com/demo/image/upload/${params.join(',')}${src}`;
};

// Usage
<Image
  loader={cloudinaryLoader}
  src="/products/headphones.jpg"
  alt="Headphones"
  width={600}
  height={600}
/>
```

#### 2.3.2 Implement Brotli Compression (Medium)
**Priority:** P2 - Medium
**Expected Impact:** 15-25% reduction in payload size

**Implementation:**
```javascript
// next.config.js
const nextConfig = {
  compress: true,
  // Next.js automatically uses Brotli when available
  // Ensure server has Brotli enabled
};

// For custom server (Express)
import compression from 'compression';
import brotli from 'compression';

app.use(compression());
app.use(brotli({
  threshold: 1024,
  level: 6,
}));
```

#### 2.3.3 Optimize Image Configuration (Medium)
**Priority:** P2 - Medium
**Expected Impact:** 20-30% reduction in image load time

**Optimized Configuration:**
```javascript
// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200], // Reduced from 8 sizes
    imageSizes: [16, 32, 64, 96, 128, 256], // Reduced from 8 sizes
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 60, // Cache images for 60 seconds
  },
};
```

**Image Quality Optimization:**
```typescript
// src/lib/image.ts
export const getImageQuality = (width: number): number => {
  if (width < 640) return 75;
  if (width < 1080) return 80;
  return 85;
};

// Usage
<Image
  src={product.images[0]}
  quality={getImageQuality(600)} // Dynamic quality based on size
/>
```

#### 2.3.4 Implement Edge Caching (High)
**Priority:** P1 - High
**Expected Impact:** 60-80% reduction in API response time

**Vercel Edge Config:**
```typescript
// vercel.json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=300, stale-while-revalidate=600"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600, immutable"
        }
      ]
    }
  ]
}
```

**Next.js API Route Caching:**
```typescript
// src/app/api/products/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache for 60 seconds

export async function GET(request: Request) {
  const products = await getProducts();
  return NextResponse.json(products, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
```

---

## 3. Prioritized Implementation Roadmap

### Phase 1: Quick Wins (Week 1)
**Goal:** Reduce response time to < 800ms

| Priority | Task | Impact | Effort | Expected Improvement |
|----------|-------|---------|----------|-------------------|
| P0 | Remove mock API delays | Critical | Low | 500-1500ms |
| P0 | Implement in-memory caching | Critical | Medium | 400-800ms |
| P1 | Add ISR to home page | High | Low | 300-500ms |
| P1 | Implement request deduplication | High | Medium | 100-200ms |
| P2 | Add React.memo to ProductCard | Medium | Low | 20-50ms |

**Total Expected Improvement:** ~1.3-3.0 seconds reduction

### Phase 2: Backend Optimization (Week 2-3)
**Goal:** Reduce response time to < 500ms

| Priority | Task | Impact | Effort | Expected Improvement |
|----------|-------|---------|----------|-------------------|
| P1 | Implement Redis caching | High | High | 200-400ms |
| P1 | Server-side filtering | High | Medium | 100-200ms |
| P2 | Add database indexes | Medium | Low | 50-100ms |
| P2 | Optimize database queries | Medium | Medium | 50-150ms |
| P2 | Implement query batching | Medium | Medium | 50-100ms |

**Total Expected Improvement:** ~450-950ms reduction

### Phase 3: Frontend Optimization (Week 3-4)
**Goal:** Reduce response time to < 350ms

| Priority | Task | Impact | Effort | Expected Improvement |
|----------|-------|---------|----------|-------------------|
| P2 | Implement code splitting | Medium | Medium | 100-200ms |
| P2 | Add image lazy loading | Medium | Low | 50-100ms |
| P2 | Optimize image configuration | Medium | Low | 30-80ms |
| P3 | Implement virtual scrolling | Low | High | 50-150ms |
| P3 | Add request batching | Low | Medium | 20-50ms |

**Total Expected Improvement:** ~250-580ms reduction

### Phase 4: Infrastructure Optimization (Week 4-6)
**Goal:** Reduce response time to < 300ms

| Priority | Task | Impact | Effort | Expected Improvement |
|----------|-------|---------|----------|-------------------|
| P1 | Implement CDN | High | High | 200-400ms |
| P1 | Implement edge caching | High | Medium | 150-300ms |
| P2 | Add Brotli compression | Medium | Low | 30-80ms |
| P2 | Optimize image delivery | Medium | Medium | 50-150ms |

**Total Expected Improvement:** ~430-930ms reduction

---

## 4. Code Examples

### 4.1 Optimized API Client with Caching

```typescript
// src/lib/api-client-optimized.ts
import { LRUCache } from 'lru-cache';

const requestCache = new LRUCache<string, Promise<any>>({
  max: 1000,
  ttl: 1000 * 60, // 1 minute
});

const pendingRequests = new Map<string, Promise<any>>();

export async function cachedRequest<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 60000
): Promise<T> {
  // Check cache
  const cached = requestCache.get(key);
  if (cached) return cached;

  // Check pending requests
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key) as Promise<T>;
  }

  // Create new request
  const promise = fetcher().finally(() => {
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, promise);
  requestCache.set(key, promise, { ttl });

  return promise;
}

// Usage
export async function getFeaturedProducts(): Promise<Product[]> {
  return cachedRequest(
    'products:featured',
    async () => {
      const response = await apiClient.get<Product[]>('/products/featured');
      return response.data;
    },
    600000 // 10 minutes
  );
}
```

### 4.2 Optimized Product Service

```typescript
// src/services/products.service-optimized.ts
import { cachedRequest } from '@/lib/api-client-optimized';

export async function getProducts(
  filters?: ProductFilter,
  page: number = 1,
  limit: number = 12
): Promise<ProductListResponse> {
  const cacheKey = `products:${JSON.stringify(filters)}:${page}:${limit}`;

  return cachedRequest(
    cacheKey,
    async () => {
      // Server-side filtering
      const where = buildWhereClause(filters);
      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            rating: true,
            reviewsCount: true,
            stock: true,
            category: true,
          },
          orderBy: buildOrderBy(filters),
        }),
        prisma.product.count({ where }),
      ]);

      return {
        products,
        total,
        page,
        pageSize: limit,
        hasMore: page * limit < total,
      };
    },
    300000 // 5 minutes
  );
}

function buildWhereClause(filters?: ProductFilter) {
  const where: any = {};

  if (filters?.category) where.category = filters.category;
  if (filters?.minPrice || filters?.maxPrice) {
    where.price = {};
    if (filters.minPrice) where.price.gte = filters.minPrice;
    if (filters.maxPrice) where.price.lte = filters.maxPrice;
  }
  if (filters?.minRating) where.rating = { gte: filters.minRating };
  if (filters?.searchQuery) {
    where.OR = [
      { name: { contains: filters.searchQuery, mode: 'insensitive' } },
      { description: { contains: filters.searchQuery, mode: 'insensitive' } },
    ];
  }

  return where;
}

function buildOrderBy(filters?: ProductFilter) {
  if (!filters?.sortBy) return { createdAt: 'desc' };

  const sortOrder = filters.sortOrder === 'desc' ? 'desc' : 'asc';
  return { [filters.sortBy]: sortOrder };
}
```

### 4.3 Optimized Home Page with ISR

```typescript
// src/app/(shop)/page.tsx
import { getFeaturedProducts, getCategories } from '@/services/products.service';
import ProductCard from '@/components/features/products/product-card';

// Revalidate every 5 minutes
export const revalidate = 300;

// Generate static params for categories
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ category }));
}

export default async function HomePage() {
  // Data is cached at the edge
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  const newProducts = [...featuredProducts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        {/* ... */}
      </section>

      {/* Featured Products */}
      <section className="section-spacing">
        <div className="container-custom">
          <div className="grid-products">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ... other sections */}
    </main>
  );
}
```

### 4.4 Optimized Product Card with Memo

```typescript
// src/components/features/products/product-card.tsx
'use client';

import { memo, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye, Heart, Star, StarHalf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Product } from '@/types/product.types';
import { useCart } from '@/hooks/use-cart';
import { toast } from '@/hooks/use-toast';

const StarRating = memo(({ rating }: { rating: number }) => {
  const stars = useMemo(() => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return { fullStars, hasHalfStar, emptyStars };
  }, [rating]);

  return (
    <div className="flex items-center space-x-0.5">
      {[...Array(stars.fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
      {stars.hasHalfStar && <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
      {[...Array(stars.emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      ))}
    </div>
  );
});

StarRating.displayName = 'StarRating';

export default memo(function ProductCard({
  product,
  showAddToCart = true,
  showQuickView = true,
  showWishlist = true,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem, isInCart } = useCart();

  const discount = useMemo(() =>
    product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0,
    [product.originalPrice, product.price]
  );

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding) return;

    setIsAdding(true);
    try {
      addItem(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          images: product.images,
          stock: product.stock,
        },
        1,
      );
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add product to cart.',
        variant: 'destructive',
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: 'Quick View',
      description: 'Quick view feature coming soon!',
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: 'Wishlist',
      description: 'Wishlist feature coming soon!',
    });
  };

  return (
    <Link href={`/products/${product.id}`} className="group">
      <Card
        className="overflow-hidden transition-all duration-300 hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute left-2 top-2 rounded-full bg-destructive px-2 py-1 text-xs font-bold text-destructive-foreground">
              -{discount}%
            </div>
          )}

          {/* Quick Actions Overlay */}
          <div
            className={`absolute right-2 top-2 flex flex-col space-y-2 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {showQuickView && (
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full"
                onClick={handleQuickView}
                aria-label="Quick view"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {showWishlist && (
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full"
                onClick={handleWishlist}
                aria-label="Add to wishlist"
              >
                <Heart className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded bg-background px-3 py-1 text-sm font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <p className="mb-1 text-xs text-muted-foreground">{product.category}</p>

          {/* Product Name */}
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-tight group-hover:text-primary">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="mb-2 flex items-center space-x-2">
            <StarRating rating={product.rating} />
            <span className="text-xs text-muted-foreground">
              ({product.reviewsCount})
            </span>
          </div>

          {/* Price */}
          <div className="mb-3 flex items-center space-x-2">
            <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          {showAddToCart && product.stock > 0 && (
            <Button
              className="w-full"
              onClick={handleAddToCart}
              disabled={isAdding || isInCart(product.id)}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {isAdding
                ? 'Adding...'
                : isInCart(product.id)
                ? 'In Cart'
                : 'Add to Cart'}
            </Button>
          )}
        </div>
      </Card>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';
```

### 4.5 Optimized Next.js Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 64, 96, 128, 256],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 60,
  },

  // Performance optimizations
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,

  // Experimental optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    // Enable SWC minification
    swcMinify: true,
  },

  // Headers for caching
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

---

## 5. Expected Performance Improvements

### 5.1 Cumulative Impact

| Phase | Current Time | Target Time | Expected Time | Improvement |
|--------|-------------|--------------|----------------|-------------|
| Initial | 1400ms | - | - | - |
| Phase 1 | 1400ms | 800ms | 400-600ms | 57-71% |
| Phase 2 | 500ms | 500ms | 200-300ms | 40-60% |
| Phase 3 | 300ms | 350ms | 150-200ms | 33-50% |
| Phase 4 | 200ms | 300ms | 100-150ms | 25-50% |
| **Final** | **1400ms** | **<300ms** | **100-200ms** | **86-93%** |

### 5.2 Per-Optimization Impact

| Optimization | Expected Reduction | Notes |
|-------------|-------------------|--------|
| Remove mock delays | 500-1500ms | Immediate impact |
| In-memory caching | 400-800ms | For repeated requests |
| Redis caching | 200-400ms | Production only |
| ISR | 300-500ms | For static/semi-static content |
| Request deduplication | 100-200ms | For concurrent requests |
| Server-side filtering | 100-200ms | Reduced data transfer |
| Code splitting | 100-200ms | Reduced bundle size |
| Image lazy loading | 50-100ms | Reduced initial load |
| CDN | 200-400ms | Reduced latency |
| Edge caching | 150-300ms | Reduced API response time |
| Brotli compression | 30-80ms | Reduced payload size |

---

## 6. Monitoring and Measurement

### 6.1 Key Performance Metrics

| Metric | Current | Target | Measurement Tool |
|--------|----------|---------|-----------------|
| Time to First Byte (TTFB) | ~800ms | <100ms | Lighthouse, WebPageTest |
| First Contentful Paint (FCP) | ~1200ms | <800ms | Lighthouse |
| Largest Contentful Paint (LCP) | ~2000ms | <1200ms | Lighthouse |
| Time to Interactive (TTI) | ~2500ms | <1500ms | Lighthouse |
| Cumulative Layout Shift (CLS) | <0.1 | <0.1 | Lighthouse |
| First Input Delay (FID) | <100ms | <50ms | Lighthouse |
| API Response Time | 1400ms | <300ms | Custom logging |

### 6.2 Implementation Monitoring

```typescript
// src/lib/performance.ts
export function measurePerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  return fn().finally(() => {
    const duration = performance.now() - start;
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);

    // Send to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'timing_complete', {
        name,
        value: Math.round(duration),
      });
    }
  });
}

// Usage
export async function getProducts() {
  return measurePerformance('getProducts', async () => {
    // ... existing logic
  });
}
```

### 6.3 Real User Monitoring (RUM)

```typescript
// src/lib/rum.ts
import { getCLS, getFID, getLCP } from 'web-vitals';

export function reportWebVitals() {
  getCLS((metric) => {
    console.log('CLS:', metric);
    // Send to analytics
  });

  getFID((metric) => {
    console.log('FID:', metric);
    // Send to analytics
  });

  getLCP((metric) => {
    console.log('LCP:', metric);
    // Send to analytics
  });
}

// Initialize in app/layout.tsx
if (typeof window !== 'undefined') {
  reportWebVitals();
}
```

---

## 7. Conclusion

This performance analysis identifies the primary bottlenecks in the EcommerceAI application and provides a comprehensive optimization roadmap. The key findings are:

1. **Primary Issue:** Mock API delays of 500-1500ms on every request
2. **Secondary Issues:** No caching, no request deduplication, client-side filtering
3. **Frontend Issues:** Unnecessary re-renders, no code splitting, no lazy loading
4. **Infrastructure Issues:** No CDN, no compression optimization

By implementing the recommended optimizations in the prioritized roadmap, the application can achieve the target response time of under 300ms, representing an 86-93% improvement from the current 1.4-second average.

The quick wins in Phase 1 can provide immediate relief, while the subsequent phases build upon each other to create a highly performant, scalable e-commerce platform.

---

## Appendix A: Dependencies to Install

```bash
# Caching
npm install lru-cache ioredis

# Performance monitoring
npm install web-vitals

# Virtual scrolling (optional)
npm install react-window

# Debouncing
npm install lodash-es @types/lodash-es
```

## Appendix B: Environment Variables

```env
# Redis
REDIS_URL=redis://localhost:6379

# CDN (optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## Appendix C: Additional Resources

- [Next.js Performance Optimization](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web Vitals](https://web.dev/vitals/)
- [React Performance](https://react.dev/learn/render-and-commit#optimizing-performance)
- [Image Optimization](https://nextjs.org/docs/app/api-reference/components/image)
- [Caching Strategies](https://web.dev/http-cache/)
