import { Product, Category, Review, User, Address } from '@/types'

// Mock categories
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest electronic gadgets and devices',
    image: 'https://picsum.photos/seed/electronics/400/300.jpg',
    productCount: 156,
    children: [
      {
        id: '11',
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Latest smartphones and accessories',
        image: 'https://picsum.photos/seed/smartphones/400/300.jpg',
        parentId: '1',
        productCount: 45
      },
      {
        id: '12',
        name: 'Laptops',
        slug: 'laptops',
        description: 'Professional and gaming laptops',
        image: 'https://picsum.photos/seed/laptops/400/300.jpg',
        parentId: '1',
        productCount: 38
      }
    ]
  },
  {
    id: '2',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Trendy clothing and accessories',
    image: 'https://picsum.photos/seed/fashion/400/300.jpg',
    productCount: 234,
    children: [
      {
        id: '21',
        name: "Men's Clothing",
        slug: 'mens-clothing',
        description: 'Stylish clothing for men',
        image: 'https://picsum.photos/seed/mens-clothing/400/300.jpg',
        parentId: '2',
        productCount: 89
      },
      {
        id: '22',
        name: "Women's Clothing",
        slug: 'womens-clothing',
        description: 'Fashionable clothing for women',
        image: 'https://picsum.photos/seed/womens-clothing/400/300.jpg',
        parentId: '2',
        productCount: 145
      }
    ]
  },
  {
    id: '3',
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Everything for your home and garden',
    image: 'https://picsum.photos/seed/home-garden/400/300.jpg',
    productCount: 178
  }
]

// Mock reviews
export const mockReviews: Review[] = [
  {
    id: 'r1',
    productId: 'p1',
    userId: 'u1',
    userName: 'John Doe',
    rating: 5,
    title: 'Excellent product!',
    content: 'This product exceeded my expectations. Great quality and fast shipping.',
    verified: true,
    helpful: 12,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'r2',
    productId: 'p1',
    userId: 'u2',
    userName: 'Jane Smith',
    rating: 4,
    title: 'Good value for money',
    content: 'Nice product, works as described. Would recommend to others.',
    verified: true,
    helpful: 8,
    createdAt: '2024-01-10T14:20:00Z'
  }
]

// Mock products
export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with active noise cancellation and premium sound quality.',
    price: 199.99,
    originalPrice: 299.99,
    images: [
      'https://picsum.photos/seed/headphones1/800/600.jpg',
      'https://picsum.photos/seed/headphones2/800/600.jpg',
      'https://picsum.photos/seed/headphones3/800/600.jpg'
    ],
    category: 'Electronics',
    subcategory: 'Audio',
    brand: 'AudioTech',
    sku: 'AT-WH-001',
    stock: 45,
    rating: 4.5,
    reviews: mockReviews,
    tags: ['wireless', 'noise-cancelling', 'premium'],
    featured: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'p2',
    name: 'Smart Watch Pro',
    description: 'Advanced smartwatch with health tracking, GPS, and smartphone integration.',
    price: 349.99,
    originalPrice: 449.99,
    images: [
      'https://picsum.photos/seed/smartwatch1/800/600.jpg',
      'https://picsum.photos/seed/smartwatch2/800/600.jpg'
    ],
    category: 'Electronics',
    subcategory: 'Wearables',
    brand: 'TechWatch',
    sku: 'TW-SW-002',
    stock: 23,
    rating: 4.7,
    reviews: [],
    tags: ['smartwatch', 'health', 'fitness'],
    featured: true,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-12T15:45:00Z'
  },
  {
    id: 'p3',
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable organic cotton t-shirt available in multiple colors.',
    price: 29.99,
    images: [
      'https://picsum.photos/seed/tshirt1/800/600.jpg',
      'https://picsum.photos/seed/tshirt2/800/600.jpg'
    ],
    category: 'Fashion',
    subcategory: "Men's Clothing",
    brand: 'EcoWear',
    sku: 'EW-TS-003',
    stock: 120,
    rating: 4.2,
    reviews: [],
    tags: ['organic', 'cotton', 'sustainable'],
    featured: false,
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z'
  },
  {
    id: 'p4',
    name: 'Professional Laptop Backpack',
    description: 'Durable and stylish backpack designed for professionals with laptop compartment.',
    price: 79.99,
    originalPrice: 99.99,
    images: [
      'https://picsum.photos/seed/backpack1/800/600.jpg',
      'https://picsum.photos/seed/backpack2/800/600.jpg'
    ],
    category: 'Fashion',
    subcategory: 'Accessories',
    brand: 'ProGear',
    sku: 'PG-BP-004',
    stock: 67,
    rating: 4.6,
    reviews: [],
    tags: ['backpack', 'laptop', 'professional'],
    featured: false,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'p5',
    name: 'Smart Home Security Camera',
    description: 'WiFi-enabled security camera with night vision and motion detection.',
    price: 129.99,
    images: [
      'https://picsum.photos/seed/camera1/800/600.jpg',
      'https://picsum.photos/seed/camera2/800/600.jpg'
    ],
    category: 'Electronics',
    subcategory: 'Smart Home',
    brand: 'SecureCam',
    sku: 'SC-CM-005',
    stock: 34,
    rating: 4.4,
    reviews: [],
    tags: ['security', 'camera', 'smart-home'],
    featured: true,
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z'
  },
  {
    id: 'p6',
    name: 'Yoga Mat Premium',
    description: 'Extra thick, non-slip yoga mat for comfortable practice.',
    price: 49.99,
    images: [
      'https://picsum.photos/seed/yogamat1/800/600.jpg',
      'https://picsum.photos/seed/yogamat2/800/600.jpg'
    ],
    category: 'Home & Garden',
    subcategory: 'Fitness',
    brand: 'FitGear',
    sku: 'FG-YM-006',
    stock: 89,
    rating: 4.8,
    reviews: [],
    tags: ['yoga', 'fitness', 'exercise'],
    featured: false,
    createdAt: '2024-01-14T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z'
  }
]

// Mock user
export const mockUser: User = {
  id: 'u1',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  avatar: 'https://picsum.photos/seed/avatar1/200/200.jpg',
  phone: '+1 (555) 123-4567',
  addresses: [
    {
      id: 'a1',
      userId: 'u1',
      type: 'shipping',
      firstName: 'John',
      lastName: 'Doe',
      company: 'Tech Corp',
      address1: '123 Main Street',
      address2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States',
      phone: '+1 (555) 123-4567',
      isDefault: true
    },
    {
      id: 'a2',
      userId: 'u1',
      type: 'billing',
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Main Street',
      address2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States',
      phone: '+1 (555) 123-4567',
      isDefault: true
    }
  ],
  createdAt: '2023-06-15T00:00:00Z',
  updatedAt: '2024-01-20T10:30:00Z'
}
