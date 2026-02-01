import { z } from 'zod';
import { insertUserSchema, insertProductSchema, insertReviewSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

// Pagination schema
const paginationInput = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(50).default(12),
});

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/register',
      input: insertUserSchema,
      responses: {
        201: z.object({ id: z.number(), username: z.string(), role: z.string() }),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.object({ id: z.number(), username: z.string(), role: z.string() }),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: {
        200: z.void(),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.any(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products',
      input: z.object({
        category: z.string().optional(),
        minPrice: z.string().optional(),
        maxPrice: z.string().optional(),
        search: z.string().optional(),
        sort: z.enum(['price_asc', 'price_desc', 'rating_desc', 'newest']).optional(),
        sellerId: z.string().optional(),
        page: z.string().optional(),
        pageSize: z.string().optional(),
      }).optional(),
      responses: {
        200: z.any(), // PaginatedResponse<Product>
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/products/:id',
      responses: {
        200: z.any(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/products',
      input: insertProductSchema.omit({ sellerId: true }),
      responses: {
        201: z.any(),
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/products/:id',
      input: insertProductSchema.partial(),
      responses: {
        200: z.any(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/products/:id',
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    featured: {
      method: 'GET' as const,
      path: '/api/products/featured',
      responses: {
        200: z.any(),
      },
    },
    deals: {
      method: 'GET' as const,
      path: '/api/products/deals',
      responses: {
        200: z.any(),
      },
    },
  },
  categories: {
    list: {
      method: 'GET' as const,
      path: '/api/categories',
      responses: {
        200: z.any(),
      },
    },
  },
  reviews: {
    list: {
      method: 'GET' as const,
      path: '/api/products/:productId/reviews',
      responses: {
        200: z.any(),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/products/:productId/reviews',
      input: insertReviewSchema.omit({ productId: true }),
      responses: {
        201: z.any(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  wishlist: {
    list: {
      method: 'GET' as const,
      path: '/api/wishlist',
      responses: {
        200: z.any(),
        401: errorSchemas.unauthorized,
      },
    },
    add: {
      method: 'POST' as const,
      path: '/api/wishlist',
      input: z.object({ productId: z.number() }),
      responses: {
        201: z.any(),
        401: errorSchemas.unauthorized,
      },
    },
    remove: {
      method: 'DELETE' as const,
      path: '/api/wishlist/:productId',
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  history: {
    list: {
      method: 'GET' as const,
      path: '/api/history',
      responses: {
        200: z.any(),
        401: errorSchemas.unauthorized,
      },
    },
    add: {
      method: 'POST' as const,
      path: '/api/history',
      input: z.object({ productId: z.number() }),
      responses: {
        201: z.any(),
      },
    },
  },
  orders: {
    create: {
      method: 'POST' as const,
      path: '/api/orders',
      input: z.object({
        items: z.array(z.object({ productId: z.number(), quantity: z.number() })),
        address: z.object({ street: z.string(), city: z.string(), state: z.string(), zip: z.string() }),
      }),
      responses: {
        201: z.any(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/orders',
      responses: {
        200: z.any(),
        401: errorSchemas.unauthorized,
      },
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/orders/:id/status',
      input: z.object({ status: z.string() }),
      responses: {
        200: z.any(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  seller: {
    dashboard: {
      method: 'GET' as const,
      path: '/api/seller/dashboard',
      responses: {
        200: z.any(),
        401: errorSchemas.unauthorized,
      },
    },
    products: {
      method: 'GET' as const,
      path: '/api/seller/products',
      responses: {
        200: z.any(),
        401: errorSchemas.unauthorized,
      },
    },
    orders: {
      method: 'GET' as const,
      path: '/api/seller/orders',
      responses: {
        200: z.any(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  admin: {
    stats: {
      method: 'GET' as const,
      path: '/api/admin/stats',
      responses: {
        200: z.any(),
        401: errorSchemas.unauthorized,
      },
    },
    users: {
      method: 'GET' as const,
      path: '/api/admin/users',
      responses: {
        200: z.any(),
        401: errorSchemas.unauthorized,
      },
    },
    allOrders: {
      method: 'GET' as const,
      path: '/api/admin/orders',
      responses: {
        200: z.any(),
        401: errorSchemas.unauthorized,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
