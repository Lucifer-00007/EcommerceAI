/**
 * Mock data for the eCommerce application
 * 
 * This file contains sample data used throughout the application
 * for development and testing purposes. In production, this data
 * would come from a backend API.
 */

import { 
  Category, 
  Product, 
  Review, 
  Order, 
  User, 
  Address,
  ShippingMethod 
} from '@/types'

// ============================================================================
// CATEGORIES
// ============================================================================

export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets and electronic devices',
    image: 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?w=400',
    productCount: 45,
  },
  {
    id: 'cat-2',
    name: 'Clothing',
    slug: 'clothing',
    description: 'Fashion for every occasion',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400',
    productCount: 128,
  },
  {
    id: 'cat-3',
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Everything for your living space',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400',
    productCount: 67,
  },
  {
    id: 'cat-4',
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Gear for your active lifestyle',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400',
    productCount: 34,
  },
  {
    id: 'cat-5',
    name: 'Books',
    slug: 'books',
    description: 'Discover your next great read',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
    productCount: 89,
  },
  {
    id: 'cat-6',
    name: 'Beauty & Health',
    slug: 'beauty-health',
    description: 'Look and feel your best',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
    productCount: 56,
  },
]

// ============================================================================
// REVIEWS
// ============================================================================

export const mockReviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userId: 'user-1',
    userName: 'Sarah Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    rating: 5,
    title: 'Absolutely love it!',
    content: 'This product exceeded all my expectations. The quality is outstanding and it arrived quickly. Would definitely recommend to anyone looking for a premium experience.',
    createdAt: '2024-01-15T10:30:00Z',
    isVerified: true,
    helpfulCount: 24,
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    userId: 'user-2',
    userName: 'Michael Chen',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    rating: 4,
    title: 'Great value for money',
    content: 'Really good product for the price. There are some minor issues but overall very satisfied with my purchase.',
    createdAt: '2024-01-10T14:20:00Z',
    isVerified: true,
    helpfulCount: 12,
  },
  {
    id: 'rev-3',
    productId: 'prod-1',
    userId: 'user-3',
    userName: 'Emily Davis',
    rating: 5,
    title: 'Perfect!',
    content: 'Exactly what I was looking for. Fast shipping and excellent customer service.',
    createdAt: '2024-01-05T09:15:00Z',
    isVerified: true,
    helpfulCount: 8,
  },
  {
    id: 'rev-4',
    productId: 'prod-2',
    userId: 'user-4',
    userName: 'James Wilson',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    rating: 3,
    title: 'It\'s okay',
    content: 'Not bad but not great either. Does what it says but I expected more features.',
    createdAt: '2024-01-08T16:45:00Z',
    isVerified: false,
    helpfulCount: 5,
  },
  {
    id: 'rev-5',
    productId: 'prod-3',
    userId: 'user-5',
    userName: 'Amanda Lee',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    rating: 5,
    title: 'Best purchase ever!',
    content: 'I\'ve been using this for a month now and I\'m completely in love. The quality is unmatched.',
    createdAt: '2024-01-20T11:00:00Z',
    isVerified: true,
    helpfulCount: 31,
  },
]

// ============================================================================
// PRODUCTS
// ============================================================================

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Premium Wireless Headphones',
    slug: 'premium-wireless-headphones',
    description: 'Experience crystal-clear audio with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions for all-day wear. Compatible with all Bluetooth devices.',
    shortDescription: 'Premium wireless headphones with ANC and 30h battery',
    price: 299.99,
    originalPrice: 349.99,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
    ],
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    category: mockCategories[0],
    categoryId: 'cat-1',
    tags: ['wireless', 'headphones', 'audio', 'bluetooth', 'noise-cancelling'],
    rating: 4.8,
    reviewCount: 128,
    reviews: [mockReviews[0], mockReviews[1], mockReviews[2]],
    stockQuantity: 45,
    inStock: true,
    sku: 'WH-001-BLK',
    specifications: {
      'Battery Life': '30 hours',
      'Connectivity': 'Bluetooth 5.0',
      'Weight': '250g',
      'Warranty': '2 years',
      'Color': 'Black',
    },
    weight: 0.25,
    dimensions: { length: 20, width: 18, height: 8 },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    isFeatured: true,
    isOnSale: true,
  },
  {
    id: 'prod-2',
    name: 'Smart Fitness Watch',
    slug: 'smart-fitness-watch',
    description: 'Track your fitness goals with our advanced smartwatch. Features heart rate monitoring, GPS tracking, sleep analysis, and 50+ sport modes. Water-resistant up to 50 meters.',
    shortDescription: 'Advanced fitness tracking with GPS and heart rate monitor',
    price: 199.99,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800',
    ],
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    category: mockCategories[0],
    categoryId: 'cat-1',
    tags: ['smartwatch', 'fitness', 'health', 'wearable'],
    rating: 4.5,
    reviewCount: 89,
    reviews: [mockReviews[3]],
    stockQuantity: 32,
    inStock: true,
    sku: 'SW-002-GRY',
    specifications: {
      'Display': '1.4" AMOLED',
      'Battery': '14 days',
      'Water Resistance': '5ATM',
      'Sensors': 'Heart rate, SpO2, GPS',
      'Compatibility': 'iOS & Android',
    },
    weight: 0.05,
    dimensions: { length: 4.5, width: 3.8, height: 1.2 },
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z',
    isFeatured: true,
    isOnSale: false,
  },
  {
    id: 'prod-3',
    name: 'Minimalist Cotton T-Shirt',
    slug: 'minimalist-cotton-t-shirt',
    description: 'Crafted from 100% organic cotton, this minimalist t-shirt offers exceptional comfort and breathability. Perfect for everyday wear with a modern, clean design.',
    shortDescription: '100% organic cotton minimalist tee',
    price: 29.99,
    originalPrice: 39.99,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800',
    ],
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    category: mockCategories[1],
    categoryId: 'cat-2',
    tags: ['clothing', 't-shirt', 'cotton', 'organic', 'minimalist'],
    rating: 4.7,
    reviewCount: 256,
    reviews: [mockReviews[4]],
    stockQuantity: 150,
    inStock: true,
    sku: 'TS-003-WHT',
    specifications: {
      'Material': '100% Organic Cotton',
      'Fit': 'Regular',
      'Care': 'Machine wash cold',
      'Origin': 'Made in USA',
      'Sizes': 'XS-XXL',
    },
    weight: 0.2,
    dimensions: { length: 30, width: 25, height: 2 },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    isFeatured: true,
    isOnSale: true,
  },
  {
    id: 'prod-4',
    name: 'Ergonomic Office Chair',
    slug: 'ergonomic-office-chair',
    description: 'Transform your workspace with our premium ergonomic office chair. Features adjustable lumbar support, breathable mesh back, and customizable armrests for ultimate comfort during long work sessions.',
    shortDescription: 'Premium ergonomic chair with lumbar support',
    price: 449.99,
    images: [
      'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800',
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800',
    ],
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800',
    category: mockCategories[2],
    categoryId: 'cat-3',
    tags: ['furniture', 'office', 'ergonomic', 'chair'],
    rating: 4.6,
    reviewCount: 67,
    stockQuantity: 18,
    inStock: true,
    sku: 'CH-004-BLK',
    specifications: {
      'Material': 'Mesh & Premium Foam',
      'Weight Capacity': '150kg',
      'Warranty': '5 years',
      'Assembly': 'Required',
      'Color': 'Black',
    },
    weight: 18,
    dimensions: { length: 68, width: 68, height: 110 },
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
    isFeatured: false,
    isOnSale: false,
  },
  {
    id: 'prod-5',
    name: 'Yoga Mat Premium',
    slug: 'yoga-mat-premium',
    description: 'Elevate your yoga practice with our premium non-slip mat. Made from eco-friendly TPE material with excellent cushioning and grip. Includes carrying strap.',
    shortDescription: 'Eco-friendly non-slip yoga mat',
    price: 49.99,
    originalPrice: 69.99,
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
      'https://images.unsplash.com/photo-1592432678016-e910b452f9a9?w=800',
    ],
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
    category: mockCategories[3],
    categoryId: 'cat-4',
    tags: ['yoga', 'fitness', 'mat', 'eco-friendly'],
    rating: 4.9,
    reviewCount: 142,
    stockQuantity: 75,
    inStock: true,
    sku: 'YM-005-PPL',
    specifications: {
      'Material': 'TPE Eco-friendly',
      'Thickness': '6mm',
      'Dimensions': '183cm x 61cm',
      'Weight': '1kg',
      'Care': 'Wipe clean with damp cloth',
    },
    weight: 1,
    dimensions: { length: 183, width: 61, height: 0.6 },
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z',
    isFeatured: true,
    isOnSale: true,
  },
  {
    id: 'prod-6',
    name: 'Bestseller Novel Collection',
    slug: 'bestseller-novel-collection',
    description: 'A curated collection of this year\'s bestselling novels. Includes 5 critically acclaimed books across various genres. Perfect for book lovers and gift-giving.',
    shortDescription: '5 bestselling novels in one collection',
    price: 79.99,
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800',
    ],
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
    category: mockCategories[4],
    categoryId: 'cat-5',
    tags: ['books', 'novels', 'bestseller', 'collection'],
    rating: 4.4,
    reviewCount: 38,
    stockQuantity: 22,
    inStock: true,
    sku: 'BK-006-SET',
    specifications: {
      'Format': 'Hardcover',
      'Language': 'English',
      'Pages': '1200+ total',
      'Publisher': 'Various',
      'ISBN': '978-3-16-148410-0',
    },
    weight: 2.5,
    dimensions: { length: 25, width: 18, height: 12 },
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-19T00:00:00Z',
    isFeatured: false,
    isOnSale: false,
  },
  {
    id: 'prod-7',
    name: 'Organic Face Serum',
    slug: 'organic-face-serum',
    description: 'Revitalize your skin with our organic face serum. Packed with vitamin C, hyaluronic acid, and natural botanical extracts for a radiant, youthful glow.',
    shortDescription: 'Vitamin C serum for radiant skin',
    price: 59.99,
    originalPrice: 79.99,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800',
    ],
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800',
    category: mockCategories[5],
    categoryId: 'cat-6',
    tags: ['beauty', 'skincare', 'organic', 'serum'],
    rating: 4.7,
    reviewCount: 203,
    stockQuantity: 55,
    inStock: true,
    sku: 'SK-007-30ML',
    specifications: {
      'Volume': '30ml',
      'Key Ingredients': 'Vitamin C, Hyaluronic Acid',
      'Skin Type': 'All skin types',
      'Cruelty Free': 'Yes',
      'Origin': 'Made in France',
    },
    weight: 0.1,
    dimensions: { length: 3, width: 3, height: 10 },
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-01-22T00:00:00Z',
    isFeatured: true,
    isOnSale: true,
  },
  {
    id: 'prod-8',
    name: '4K Webcam Pro',
    slug: '4k-webcam-pro',
    description: 'Professional-grade 4K webcam for crystal-clear video calls and streaming. Features auto-focus, noise-canceling microphone, and wide-angle lens.',
    shortDescription: 'Professional 4K webcam with auto-focus',
    price: 149.99,
    images: [
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
    ],
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
    category: mockCategories[0],
    categoryId: 'cat-1',
    tags: ['webcam', '4k', 'streaming', 'video'],
    rating: 4.3,
    reviewCount: 76,
    stockQuantity: 0,
    inStock: false,
    sku: 'WC-008-4K',
    specifications: {
      'Resolution': '4K Ultra HD',
      'Frame Rate': '60fps',
      'Field of View': '90°',
      'Microphone': 'Dual noise-canceling',
      'Connection': 'USB-C',
    },
    weight: 0.3,
    dimensions: { length: 10, width: 4, height: 4 },
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
    isFeatured: false,
    isOnSale: false,
  },
]

// ============================================================================
// USERS
// ============================================================================

export const mockUser: User = {
  id: 'user-1',
  email: 'john.doe@example.com',
  name: 'John Doe',
  firstName: 'John',
  lastName: 'Doe',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
  phone: '+1 (555) 123-4567',
  role: 'customer',
  emailVerified: true,
  createdAt: '2023-12-01T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
}

// ============================================================================
// ADDRESSES
// ============================================================================

export const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    label: 'Home',
    name: 'John Doe',
    street1: '123 Main Street',
    street2: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'USA',
    phone: '+1 (555) 123-4567',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Work',
    name: 'John Doe',
    street1: '456 Business Ave',
    city: 'New York',
    state: 'NY',
    postalCode: '10002',
    country: 'USA',
    phone: '+1 (555) 987-6543',
    isDefault: false,
  },
]

// ============================================================================
// ORDERS
// ============================================================================

export const mockOrders: Order[] = [
  {
    id: 'ord-1',
    orderNumber: 'ORD-2024-0001',
    userId: 'user-1',
    items: [
      {
        id: 'oi-1',
        productId: 'prod-1',
        productName: 'Premium Wireless Headphones',
        productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
        quantity: 1,
        unitPrice: 299.99,
        total: 299.99,
      },
      {
        id: 'oi-2',
        productId: 'prod-3',
        productName: 'Minimalist Cotton T-Shirt',
        productImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200',
        quantity: 2,
        unitPrice: 29.99,
        total: 59.98,
      },
    ],
    shippingAddress: mockAddresses[0],
    billingAddress: mockAddresses[0],
    status: 'delivered',
    paymentStatus: 'completed',
    paymentMethod: 'Credit Card (ending in 4242)',
    subtotal: 359.97,
    shipping: 15.00,
    tax: 30.00,
    discount: 0,
    total: 404.97,
    notes: 'Please leave at the front door',
    trackingNumber: 'TRK123456789',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    estimatedDelivery: '2024-01-15',
    deliveredAt: '2024-01-15T12:00:00Z',
  },
  {
    id: 'ord-2',
    orderNumber: 'ORD-2024-0002',
    userId: 'user-1',
    items: [
      {
        id: 'oi-3',
        productId: 'prod-5',
        productName: 'Yoga Mat Premium',
        productImage: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=200',
        quantity: 1,
        unitPrice: 49.99,
        total: 49.99,
      },
    ],
    shippingAddress: mockAddresses[0],
    billingAddress: mockAddresses[0],
    status: 'shipped',
    paymentStatus: 'completed',
    paymentMethod: 'PayPal',
    subtotal: 49.99,
    shipping: 5.00,
    tax: 4.00,
    discount: 0,
    total: 58.99,
    trackingNumber: 'TRK987654321',
    createdAt: '2024-01-20T15:00:00Z',
    updatedAt: '2024-01-22T09:00:00Z',
    estimatedDelivery: '2024-01-25',
  },
  {
    id: 'ord-3',
    orderNumber: 'ORD-2024-0003',
    userId: 'user-1',
    items: [
      {
        id: 'oi-4',
        productId: 'prod-7',
        productName: 'Organic Face Serum',
        productImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200',
        quantity: 1,
        unitPrice: 59.99,
        total: 59.99,
      },
    ],
    shippingAddress: mockAddresses[1],
    billingAddress: mockAddresses[1],
    status: 'processing',
    paymentStatus: 'completed',
    paymentMethod: 'Credit Card (ending in 4242)',
    subtotal: 59.99,
    shipping: 0,
    tax: 5.00,
    discount: 10.00,
    total: 54.99,
    createdAt: '2024-01-25T11:00:00Z',
    updatedAt: '2024-01-25T11:00:00Z',
    estimatedDelivery: '2024-01-30',
  },
]

// ============================================================================
// SHIPPING METHODS
// ============================================================================

export const mockShippingMethods: ShippingMethod[] = [
  {
    id: 'ship-1',
    name: 'Standard Shipping',
    description: 'Economy shipping via ground transport',
    estimatedDays: '5-7 business days',
    cost: 5.00,
  },
  {
    id: 'ship-2',
    name: 'Express Shipping',
    description: 'Fast delivery via air transport',
    estimatedDays: '2-3 business days',
    cost: 15.00,
  },
  {
    id: 'ship-3',
    name: 'Next Day Delivery',
    description: 'Overnight delivery for urgent orders',
    estimatedDays: '1 business day',
    cost: 25.00,
  },
  {
    id: 'ship-4',
    name: 'Free Shipping',
    description: 'Complimentary shipping on orders over $50',
    estimatedDays: '7-10 business days',
    cost: 0,
  },
]

// ============================================================================
// PROMOTIONS
// ============================================================================

export interface Promotion {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  buttonText: string
  link: string
  discount?: string
  bgColor?: string
}

export const mockPromotions: Promotion[] = [
  {
    id: 'promo-1',
    title: 'Summer Sale',
    subtitle: 'Up to 50% Off',
    description: 'Get amazing deals on selected items. Limited time only!',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
    buttonText: 'Shop Now',
    link: '/products?onSale=true',
    discount: '50%',
    bgColor: 'bg-orange-500',
  },
  {
    id: 'promo-2',
    title: 'New Arrivals',
    subtitle: 'Check Out the Latest',
    description: 'Discover our newest products and be the first to own them.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
    buttonText: 'Explore',
    link: '/products?sort=newest',
  },
  {
    id: 'promo-3',
    title: 'Free Shipping',
    subtitle: 'On Orders Over $50',
    description: 'Enjoy free shipping on all qualifying orders. No code needed.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200',
    buttonText: 'Learn More',
    link: '/shipping',
  },
]
