// Mock data for the eCommerce application
// Comprehensive mock data for development and testing

import type { Product, ProductReview } from '@/types/product.types';
import { ProductCategory } from '@/types/product.types';
import type { User, UserRole } from '@/types/user.types';
import type { Order, OrderStatus, OrderItem, ShippingAddress, PaymentMethod } from '@/types/api.types';
import type { CartItem } from '@/types/cart.types';

/**
 * Helper function to generate a random delay to simulate API calls
 * @param min Minimum delay in milliseconds
 * @param max Maximum delay in milliseconds
 * @returns Promise that resolves after a random delay
 */
export const mockDelay = (min: number = 500, max: number = 1500): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

/**
 * Helper function to generate a unique ID
 * @returns A unique string ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Helper function to generate a date string
 * @param daysAgo Number of days ago (default: 0 for today)
 * @returns ISO date string
 */
export const generateDate = (daysAgo: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

/**
 * Mock products data
 * Array of 20+ products across different categories
 */
export const MOCK_PRODUCTS: readonly Product[] = [
  // Electronics
  {
    id: 'prod-001',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life, superior sound quality, and comfortable over-ear design. Perfect for music lovers and professionals.',
    price: 149.99,
    originalPrice: 199.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Headphones+1',
      'https://placehold.co/600x600/16213e/FFF?text=Headphones+2',
      'https://placehold.co/600x600/0f3460/FFF?text=Headphones+3',
    ],
    category: ProductCategory.Electronics,
    rating: 4.5,
    reviewsCount: 128,
    stock: 45,
    tags: ['wireless', 'bluetooth', 'audio', 'noise-cancelling'],
    createdAt: generateDate(30),
    updatedAt: generateDate(5),
  },
  {
    id: 'prod-002',
    name: '4K Ultra HD Smart TV 55"',
    description: 'Experience stunning 4K resolution with this 55-inch smart TV. Features HDR support, built-in streaming apps, voice control, and Dolby Atmos audio.',
    price: 599.99,
    originalPrice: 799.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=TV+1',
      'https://placehold.co/600x600/16213e/FFF?text=TV+2',
    ],
    category: ProductCategory.Electronics,
    rating: 4.7,
    reviewsCount: 256,
    stock: 20,
    tags: ['4k', 'smart-tv', 'hdr', 'streaming'],
    createdAt: generateDate(45),
    updatedAt: generateDate(10),
  },
  {
    id: 'prod-003',
    name: 'Laptop Pro 15" - 16GB RAM, 512GB SSD',
    description: 'Powerful laptop for professionals and creators. Features Intel Core i7 processor, 16GB RAM, 512GB SSD, and stunning 15.6" display.',
    price: 1299.99,
    originalPrice: 1499.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Laptop+1',
      'https://placehold.co/600x600/16213e/FFF?text=Laptop+2',
      'https://placehold.co/600x600/0f3460/FFF?text=Laptop+3',
    ],
    category: ProductCategory.Electronics,
    rating: 4.8,
    reviewsCount: 89,
    stock: 15,
    tags: ['laptop', 'computer', 'work', 'gaming'],
    createdAt: generateDate(60),
    updatedAt: generateDate(15),
  },
  {
    id: 'prod-004',
    name: 'Smart Watch Series 5',
    description: 'Advanced smartwatch with health monitoring, GPS, water resistance, and 7-day battery life. Track your fitness and stay connected.',
    price: 349.99,
    originalPrice: 399.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Watch+1',
      'https://placehold.co/600x600/16213e/FFF?text=Watch+2',
    ],
    category: ProductCategory.Electronics,
    rating: 4.3,
    reviewsCount: 167,
    stock: 60,
    tags: ['smartwatch', 'fitness', 'health', 'wearable'],
    createdAt: generateDate(20),
    updatedAt: generateDate(3),
  },
  {
    id: 'prod-005',
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator and overcharge protection.',
    price: 29.99,
    originalPrice: 39.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Charger+1',
      'https://placehold.co/600x600/16213e/FFF?text=Charger+2',
    ],
    category: ProductCategory.Electronics,
    rating: 4.2,
    reviewsCount: 234,
    stock: 100,
    tags: ['wireless', 'charging', 'accessories'],
    createdAt: generateDate(15),
    updatedAt: generateDate(2),
  },

  // Clothing
  {
    id: 'prod-006',
    name: 'Premium Cotton T-Shirt',
    description: 'Comfortable 100% cotton t-shirt with a modern fit. Available in multiple colors. Perfect for everyday wear.',
    price: 24.99,
    originalPrice: 34.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=T-Shirt+1',
      'https://placehold.co/600x600/16213e/FFF?text=T-Shirt+2',
    ],
    category: ProductCategory.Clothing,
    rating: 4.4,
    reviewsCount: 312,
    stock: 200,
    tags: ['t-shirt', 'cotton', 'casual', 'everyday'],
    createdAt: generateDate(25),
    updatedAt: generateDate(7),
  },
  {
    id: 'prod-007',
    name: 'Classic Denim Jeans',
    description: 'Timeless straight-fit jeans made from premium denim. Features classic five-pocket design and comfortable stretch fabric.',
    price: 69.99,
    originalPrice: 89.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Jeans+1',
      'https://placehold.co/600x600/16213e/FFF?text=Jeans+2',
      'https://placehold.co/600x600/0f3460/FFF?text=Jeans+3',
    ],
    category: ProductCategory.Clothing,
    rating: 4.6,
    reviewsCount: 189,
    stock: 150,
    tags: ['jeans', 'denim', 'casual', 'classic'],
    createdAt: generateDate(40),
    updatedAt: generateDate(12),
  },
  {
    id: 'prod-008',
    name: 'Winter Wool Sweater',
    description: 'Cozy wool blend sweater perfect for cold weather. Features ribbed cuffs and hem, and a comfortable relaxed fit.',
    price: 59.99,
    originalPrice: 79.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Sweater+1',
      'https://placehold.co/600x600/16213e/FFF?text=Sweater+2',
    ],
    category: ProductCategory.Clothing,
    rating: 4.5,
    reviewsCount: 98,
    stock: 80,
    tags: ['sweater', 'wool', 'winter', 'warm'],
    createdAt: generateDate(35),
    updatedAt: generateDate(8),
  },
  {
    id: 'prod-009',
    name: 'Running Sneakers',
    description: 'Lightweight running shoes with advanced cushioning and breathable mesh upper. Perfect for daily runs and workouts.',
    price: 89.99,
    originalPrice: 119.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Sneakers+1',
      'https://placehold.co/600x600/16213e/FFF?text=Sneakers+2',
      'https://placehold.co/600x600/0f3460/FFF?text=Sneakers+3',
    ],
    category: ProductCategory.Clothing,
    rating: 4.7,
    reviewsCount: 276,
    stock: 120,
    tags: ['sneakers', 'running', 'shoes', 'athletic'],
    createdAt: generateDate(28),
    updatedAt: generateDate(6),
  },
  {
    id: 'prod-010',
    name: 'Leather Belt',
    description: 'Genuine leather belt with brushed metal buckle. Classic design that complements any outfit. Available in multiple widths.',
    price: 34.99,
    originalPrice: 44.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Belt+1',
      'https://placehold.co/600x600/16213e/FFF?text=Belt+2',
    ],
    category: ProductCategory.Clothing,
    rating: 4.3,
    reviewsCount: 145,
    stock: 90,
    tags: ['belt', 'leather', 'accessories', 'classic'],
    createdAt: generateDate(22),
    updatedAt: generateDate(4),
  },

  // Home
  {
    id: 'prod-011',
    name: 'Modern Table Lamp',
    description: 'Elegant table lamp with adjustable brightness and color temperature. Features a sleek metal base and fabric shade.',
    price: 49.99,
    originalPrice: 69.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Lamp+1',
      'https://placehold.co/600x600/16213e/FFF?text=Lamp+2',
    ],
    category: ProductCategory.Home,
    rating: 4.4,
    reviewsCount: 87,
    stock: 65,
    tags: ['lamp', 'lighting', 'home-decor', 'modern'],
    createdAt: generateDate(18),
    updatedAt: generateDate(3),
  },
  {
    id: 'prod-012',
    name: 'Ceramic Plant Pot Set',
    description: 'Set of 3 ceramic plant pots in different sizes. Includes drainage holes and saucers. Perfect for indoor plants.',
    price: 39.99,
    originalPrice: 54.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Pots+1',
      'https://placehold.co/600x600/16213e/FFF?text=Pots+2',
    ],
    category: ProductCategory.Home,
    rating: 4.6,
    reviewsCount: 112,
    stock: 75,
    tags: ['plant-pot', 'ceramic', 'home-decor', 'plants'],
    createdAt: generateDate(32),
    updatedAt: generateDate(9),
  },
  {
    id: 'prod-013',
    name: 'Memory Foam Pillow',
    description: 'Premium memory foam pillow with cooling gel layer. Provides optimal neck support and pressure relief for better sleep.',
    price: 44.99,
    originalPrice: 59.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Pillow+1',
      'https://placehold.co/600x600/16213e/FFF?text=Pillow+2',
    ],
    category: ProductCategory.Home,
    rating: 4.8,
    reviewsCount: 203,
    stock: 110,
    tags: ['pillow', 'memory-foam', 'sleep', 'bedding'],
    createdAt: generateDate(26),
    updatedAt: generateDate(5),
  },
  {
    id: 'prod-014',
    name: 'Kitchen Knife Set',
    description: 'Professional 6-piece knife set with stainless steel blades and ergonomic handles. Includes storage block.',
    price: 79.99,
    originalPrice: 99.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Knives+1',
      'https://placehold.co/600x600/16213e/FFF?text=Knives+2',
    ],
    category: ProductCategory.Home,
    rating: 4.5,
    reviewsCount: 156,
    stock: 55,
    tags: ['knives', 'kitchen', 'cookware', 'cutlery'],
    createdAt: generateDate(38),
    updatedAt: generateDate(11),
  },
  {
    id: 'prod-015',
    name: 'Throw Blanket',
    description: 'Soft and cozy throw blanket made from premium microfiber. Perfect for couch, bed, or outdoor use.',
    price: 29.99,
    originalPrice: 39.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Blanket+1',
      'https://placehold.co/600x600/16213e/FFF?text=Blanket+2',
    ],
    category: ProductCategory.Home,
    rating: 4.7,
    reviewsCount: 289,
    stock: 140,
    tags: ['blanket', 'throw', 'cozy', 'home-decor'],
    createdAt: generateDate(21),
    updatedAt: generateDate(4),
  },

  // Sports
  {
    id: 'prod-016',
    name: 'Yoga Mat Premium',
    description: 'Extra thick yoga mat with non-slip surface and carrying strap. Provides excellent cushioning for all yoga poses.',
    price: 34.99,
    originalPrice: 49.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Yoga+Mat+1',
      'https://placehold.co/600x600/16213e/FFF?text=Yoga+Mat+2',
    ],
    category: ProductCategory.Sports,
    rating: 4.6,
    reviewsCount: 178,
    stock: 95,
    tags: ['yoga', 'fitness', 'exercise', 'mat'],
    createdAt: generateDate(24),
    updatedAt: generateDate(6),
  },
  {
    id: 'prod-017',
    name: 'Adjustable Dumbbells Set',
    description: 'Space-saving adjustable dumbbells with weight range from 5 to 52.5 lbs. Quick-change weight system.',
    price: 299.99,
    originalPrice: 399.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Dumbbells+1',
      'https://placehold.co/600x600/16213e/FFF?text=Dumbbells+2',
    ],
    category: ProductCategory.Sports,
    rating: 4.8,
    reviewsCount: 134,
    stock: 35,
    tags: ['dumbbells', 'weights', 'fitness', 'strength'],
    createdAt: generateDate(42),
    updatedAt: generateDate(14),
  },
  {
    id: 'prod-018',
    name: 'Water Bottle Insulated',
    description: 'Double-wall insulated stainless steel water bottle. Keeps drinks cold for 24 hours or hot for 12 hours. 32oz capacity.',
    price: 24.99,
    originalPrice: 34.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Bottle+1',
      'https://placehold.co/600x600/16213e/FFF?text=Bottle+2',
    ],
    category: ProductCategory.Sports,
    rating: 4.5,
    reviewsCount: 267,
    stock: 180,
    tags: ['water-bottle', 'insulated', 'hydration', 'sports'],
    createdAt: generateDate(19),
    updatedAt: generateDate(3),
  },
  {
    id: 'prod-019',
    name: 'Tennis Racket Pro',
    description: 'Professional-grade tennis racket with graphite frame. Perfect for intermediate to advanced players. Includes cover.',
    price: 129.99,
    originalPrice: 169.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Racket+1',
      'https://placehold.co/600x600/16213e/FFF?text=Racket+2',
    ],
    category: ProductCategory.Sports,
    rating: 4.4,
    reviewsCount: 92,
    stock: 45,
    tags: ['tennis', 'racket', 'sports', 'equipment'],
    createdAt: generateDate(33),
    updatedAt: generateDate(8),
  },
  {
    id: 'prod-020',
    name: 'Resistance Bands Set',
    description: 'Complete set of 5 resistance bands with different strength levels. Includes door anchor and handles.',
    price: 19.99,
    originalPrice: 29.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Bands+1',
      'https://placehold.co/600x600/16213e/FFF?text=Bands+2',
    ],
    category: ProductCategory.Sports,
    rating: 4.3,
    reviewsCount: 198,
    stock: 220,
    tags: ['resistance-bands', 'fitness', 'exercise', 'home-workout'],
    createdAt: generateDate(16),
    updatedAt: generateDate(2),
  },

  // Books
  {
    id: 'prod-021',
    name: 'The Art of Programming',
    description: 'Comprehensive guide to modern programming practices. Covers algorithms, data structures, and software design patterns.',
    price: 49.99,
    originalPrice: 64.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Book+1',
      'https://placehold.co/600x600/16213e/FFF?text=Book+2',
    ],
    category: ProductCategory.Books,
    rating: 4.9,
    reviewsCount: 345,
    stock: 85,
    tags: ['programming', 'technology', 'education', 'reference'],
    createdAt: generateDate(50),
    updatedAt: generateDate(15),
  },
  {
    id: 'prod-022',
    name: 'Mindfulness for Beginners',
    description: 'Introduction to mindfulness meditation and its benefits. Includes practical exercises and guided meditations.',
    price: 16.99,
    originalPrice: 21.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Book+2',
      'https://placehold.co/600x600/16213e/FFF?text=Book+3',
    ],
    category: ProductCategory.Books,
    rating: 4.6,
    reviewsCount: 223,
    stock: 130,
    tags: ['mindfulness', 'meditation', 'self-help', 'wellness'],
    createdAt: generateDate(27),
    updatedAt: generateDate(5),
  },
  {
    id: 'prod-023',
    name: 'Cooking Masterclass',
    description: 'Beautiful cookbook with 100+ recipes from around the world. Includes step-by-step instructions and photos.',
    price: 34.99,
    originalPrice: 44.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Book+3',
      'https://placehold.co/600x600/16213e/FFF?text=Book+4',
    ],
    category: ProductCategory.Books,
    rating: 4.7,
    reviewsCount: 187,
    stock: 95,
    tags: ['cooking', 'recipes', 'food', 'cookbook'],
    createdAt: generateDate(31),
    updatedAt: generateDate(7),
  },
  {
    id: 'prod-024',
    name: 'Science Fiction Collection',
    description: 'Three-book collection of award-winning science fiction novels. Perfect for sci-fi enthusiasts.',
    price: 29.99,
    originalPrice: 39.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Book+4',
      'https://placehold.co/600x600/16213e/FFF?text=Book+5',
    ],
    category: ProductCategory.Books,
    rating: 4.5,
    reviewsCount: 156,
    stock: 70,
    tags: ['science-fiction', 'novels', 'fiction', 'collection'],
    createdAt: generateDate(36),
    updatedAt: generateDate(10),
  },

  // Beauty
  {
    id: 'prod-025',
    name: 'Skincare Set Premium',
    description: 'Complete skincare routine set with cleanser, toner, serum, and moisturizer. Suitable for all skin types.',
    price: 59.99,
    originalPrice: 79.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Skincare+1',
      'https://placehold.co/600x600/16213e/FFF?text=Skincare+2',
    ],
    category: ProductCategory.Beauty,
    rating: 4.6,
    reviewsCount: 234,
    stock: 105,
    tags: ['skincare', 'beauty', 'routine', 'premium'],
    createdAt: generateDate(23),
    updatedAt: generateDate(5),
  },
  {
    id: 'prod-026',
    name: 'Hair Dryer Professional',
    description: 'Professional-grade hair dryer with ionic technology. Multiple heat and speed settings for all hair types.',
    price: 79.99,
    originalPrice: 99.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Dryer+1',
      'https://placehold.co/600x600/16213e/FFF?text=Dryer+2',
    ],
    category: ProductCategory.Beauty,
    rating: 4.4,
    reviewsCount: 167,
    stock: 65,
    tags: ['hair-dryer', 'beauty', 'styling', 'professional'],
    createdAt: generateDate(29),
    updatedAt: generateDate(6),
  },
  {
    id: 'prod-027',
    name: 'Makeup Brush Set',
    description: 'Professional 12-piece makeup brush set with premium synthetic bristles. Includes carrying case.',
    price: 29.99,
    originalPrice: 39.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Brushes+1',
      'https://placehold.co/600x600/16213e/FFF?text=Brushes+2',
    ],
    category: ProductCategory.Beauty,
    rating: 4.5,
    reviewsCount: 289,
    stock: 145,
    tags: ['makeup', 'brushes', 'beauty', 'cosmetics'],
    createdAt: generateDate(20),
    updatedAt: generateDate(4),
  },
  {
    id: 'prod-028',
    name: 'Perfume Collection',
    description: 'Set of 3 premium perfumes with different fragrance profiles. Long-lasting scents in elegant bottles.',
    price: 89.99,
    originalPrice: 119.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Perfume+1',
      'https://placehold.co/600x600/16213e/FFF?text=Perfume+2',
    ],
    category: ProductCategory.Beauty,
    rating: 4.7,
    reviewsCount: 198,
    stock: 55,
    tags: ['perfume', 'fragrance', 'beauty', 'luxury'],
    createdAt: generateDate(34),
    updatedAt: generateDate(9),
  },

  // Toys
  {
    id: 'prod-029',
    name: 'Building Blocks Set',
    description: '500-piece building blocks set for creative play. Compatible with major brands. Includes storage container.',
    price: 34.99,
    originalPrice: 44.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Blocks+1',
      'https://placehold.co/600x600/16213e/FFF?text=Blocks+2',
    ],
    category: ProductCategory.Toys,
    rating: 4.8,
    reviewsCount: 312,
    stock: 90,
    tags: ['building-blocks', 'toys', 'creative', 'educational'],
    createdAt: generateDate(25),
    updatedAt: generateDate(5),
  },
  {
    id: 'prod-030',
    name: 'Remote Control Car',
    description: 'High-speed remote control car with rechargeable battery. Features LED lights and durable construction.',
    price: 49.99,
    originalPrice: 69.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=RC+Car+1',
      'https://placehold.co/600x600/16213e/FFF?text=RC+Car+2',
    ],
    category: ProductCategory.Toys,
    rating: 4.5,
    reviewsCount: 178,
    stock: 70,
    tags: ['remote-control', 'car', 'toys', 'outdoor'],
    createdAt: generateDate(21),
    updatedAt: generateDate(4),
  },
  {
    id: 'prod-031',
    name: 'Board Game Collection',
    description: 'Collection of 5 classic board games for family game night. Includes chess, checkers, backgammon, and more.',
    price: 39.99,
    originalPrice: 54.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Board+Games+1',
      'https://placehold.co/600x600/16213e/FFF?text=Board+Games+2',
    ],
    category: ProductCategory.Toys,
    rating: 4.6,
    reviewsCount: 234,
    stock: 85,
    tags: ['board-games', 'family', 'games', 'entertainment'],
    createdAt: generateDate(28),
    updatedAt: generateDate(6),
  },
  {
    id: 'prod-032',
    name: 'Art Supplies Kit',
    description: 'Complete art supplies kit with colored pencils, markers, paints, brushes, and sketchbook. Perfect for young artists.',
    price: 24.99,
    originalPrice: 34.99,
    images: [
      'https://placehold.co/600x600/1a1a2e/FFF?text=Art+Kit+1',
      'https://placehold.co/600x600/16213e/FFF?text=Art+Kit+2',
    ],
    category: ProductCategory.Toys,
    rating: 4.4,
    reviewsCount: 267,
    stock: 120,
    tags: ['art', 'supplies', 'creative', 'educational'],
    createdAt: generateDate(17),
    updatedAt: generateDate(3),
  },
];

/**
 * Mock users data
 * Array of 5 mock users
 */
export const MOCK_USERS: readonly User[] = [
  {
    id: 'user-001',
    email: 'john.doe@example.com',
    name: 'John Doe',
    avatar: 'https://placehold.co/200x200/1a1a2e/FFF?text=JD',
    role: 'customer' as UserRole,
    createdAt: generateDate(90),
    updatedAt: generateDate(5),
  },
  {
    id: 'user-002',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    avatar: 'https://placehold.co/200x200/16213e/FFF?text=JS',
    role: 'customer' as UserRole,
    createdAt: generateDate(75),
    updatedAt: generateDate(10),
  },
  {
    id: 'user-003',
    email: 'admin@ecommerce.com',
    name: 'Admin User',
    avatar: 'https://placehold.co/200x200/0f3460/FFF?text=AU',
    role: 'admin' as UserRole,
    createdAt: generateDate(120),
    updatedAt: generateDate(1),
  },
  {
    id: 'user-004',
    email: 'mike.wilson@example.com',
    name: 'Mike Wilson',
    avatar: 'https://placehold.co/200x200/1a1a2e/FFF?text=MW',
    role: 'customer' as UserRole,
    createdAt: generateDate(60),
    updatedAt: generateDate(15),
  },
  {
    id: 'user-005',
    email: 'sarah.johnson@example.com',
    name: 'Sarah Johnson',
    avatar: 'https://placehold.co/200x200/16213e/FFF?text=SJ',
    role: 'customer' as UserRole,
    createdAt: generateDate(45),
    updatedAt: generateDate(8),
  },
];

/**
 * Mock orders data
 * Array of 8 mock orders
 */
export const MOCK_ORDERS: readonly Order[] = [
  {
    id: 'order-001',
    userId: 'user-001',
    items: [
      {
        id: 'item-001',
        productId: 'prod-001',
        productName: 'Wireless Bluetooth Headphones',
        productImage: 'https://placehold.co/600x600/1a1a2e/FFF?text=Headphones+1',
        quantity: 1,
        price: 149.99,
        total: 149.99,
      },
      {
        id: 'item-002',
        productId: 'prod-005',
        productName: 'Wireless Charging Pad',
        productImage: 'https://placehold.co/600x600/1a1a2e/FFF?text=Charger+1',
        quantity: 2,
        price: 29.99,
        total: 59.98,
      },
    ],
    subtotal: 209.97,
    discount: 20.0,
    shipping: 9.99,
    tax: 15.99,
    total: 215.95,
    status: 'delivered' as OrderStatus,
    shippingAddress: {
      fullName: 'John Doe',
      address: '123 Main Street',
      apartment: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '+1 555-123-4567',
    },
    paymentMethod: {
      type: 'credit_card',
      last4: '4242',
      brand: 'visa',
      displayName: 'Visa ending in 4242',
    },
    notes: 'Please deliver after 5 PM',
    createdAt: generateDate(30),
    updatedAt: generateDate(25),
    estimatedDelivery: generateDate(25),
    deliveredAt: generateDate(25),
  },
  {
    id: 'order-002',
    userId: 'user-001',
    items: [
      {
        id: 'item-003',
        productId: 'prod-006',
        productName: 'Premium Cotton T-Shirt',
        productImage: 'https://placehold.co/600x600/1a1a2e/FFF?text=T-Shirt+1',
        quantity: 3,
        price: 24.99,
        total: 74.97,
      },
    ],
    subtotal: 74.97,
    discount: 0,
    shipping: 4.99,
    tax: 5.99,
    total: 85.95,
    status: 'shipped' as OrderStatus,
    shippingAddress: {
      fullName: 'John Doe',
      address: '123 Main Street',
      apartment: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '+1 555-123-4567',
    },
    paymentMethod: {
      type: 'paypal',
      displayName: 'PayPal',
    },
    createdAt: generateDate(10),
    updatedAt: generateDate(5),
    estimatedDelivery: generateDate(2),
  },
  {
    id: 'order-003',
    userId: 'user-002',
    items: [
      {
        id: 'item-004',
        productId: 'prod-013',
        productName: 'Memory Foam Pillow',
        productImage: 'https://placehold.co/600x600/1a1a2e/FFF?text=Pillow+1',
        quantity: 2,
        price: 44.99,
        total: 89.98,
      },
      {
        id: 'item-005',
        productId: 'prod-015',
        productName: 'Throw Blanket',
        productImage: 'https://placehold.co/600x600/1a1a2e/FFF?text=Blanket+1',
        quantity: 1,
        price: 29.99,
        total: 29.99,
      },
    ],
    subtotal: 119.97,
    discount: 10.0,
    shipping: 7.99,
    tax: 8.99,
    total: 126.95,
    status: 'processing' as OrderStatus,
    shippingAddress: {
      fullName: 'Jane Smith',
      address: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
      phone: '+1 555-987-6543',
    },
    paymentMethod: {
      type: 'credit_card',
      last4: '5555',
      brand: 'mastercard',
      displayName: 'Mastercard ending in 5555',
    },
    createdAt: generateDate(5),
    updatedAt: generateDate(3),
    estimatedDelivery: generateDate(-2),
  },
  {
    id: 'order-004',
    userId: 'user-002',
    items: [
      {
        id: 'item-006',
        productId: 'prod-021',
        productName: 'The Art of Programming',
        productImage: 'https://placehold.co/600x600/1a1a2e/FFF?text=Book+1',
        quantity: 1,
        price: 49.99,
        total: 49.99,
      },
    ],
    subtotal: 49.99,
    discount: 0,
    shipping: 3.99,
    tax: 3.99,
    total: 57.97,
    status: 'pending' as OrderStatus,
    shippingAddress: {
      fullName: 'Jane Smith',
      address: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
      phone: '+1 555-987-6543',
    },
    paymentMethod: {
      type: 'credit_card',
      last4: '5555',
      brand: 'mastercard',
      displayName: 'Mastercard ending in 5555',
    },
    createdAt: generateDate(2),
    updatedAt: generateDate(1),
  },
  {
    id: 'order-005',
    userId: 'user-004',
    items: [
      {
        id: 'item-007',
        productId: 'prod-016',
        productName: 'Yoga Mat Premium',
        productImage: 'https://placehold.co/600x600/1a1a2e/FFF?text=Yoga+Mat+1',
        quantity: 1,
        price: 34.99,
        total: 34.99,
      },
      {
        id: 'item-008',
        productId: 'prod-018',
        productName: 'Water Bottle Insulated',
        productImage: 'https://placehold.co/600x600/1a1a2e/FFF?text=Bottle+1',
        quantity: 2,
        price: 24.99,
        total: 49.98,
      },
    ],
    subtotal: 84.97,
    discount: 5.0,
    shipping: 5.99,
    tax: 6.49,
    total: 92.45,
    status: 'delivered' as OrderStatus,
    shippingAddress: {
      fullName: 'Mike Wilson',
      address: '789 Pine Road',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
      phone: '+1 555-456-7890',
    },
    paymentMethod: {
      type: 'debit_card',
      last4: '1234',
      brand: 'visa',
      displayName: 'Visa Debit ending in 1234',
    },
    createdAt: generateDate(45),
    updatedAt: generateDate(40),
    estimatedDelivery: generateDate(40),
    deliveredAt: generateDate(40),
  },
  {
    id: 'order-006',
    userId: 'user-005',
    items: [
      {
        id: 'item-009',
        productId: 'prod-025',
        productName: 'Skincare Set Premium',
        productImage: 'https://placehold.co/600x600/1a1a2e/FFF?text=Skincare+1',
        quantity: 1,
        price: 59.99,
        total: 59.99,
      },
      {
        id: 'item-010',
        productId: 'prod-027',
        productName: 'Makeup Brush Set',
        productImage: 'https://placehold.co/600x600/1a1a2e/FFF?text=Brushes+1',
        quantity: 1,
        price: 29.99,
        total: 29.99,
      },
    ],
    subtotal: 89.98,
    discount: 0,
    shipping: 6.99,
    tax: 7.19,
    total: 104.16,
    status: 'shipped' as OrderStatus,
    shippingAddress: {
      fullName: 'Sarah Johnson',
      address: '321 Elm Street',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'USA',
      phone: '+1 555-789-0123',
    },
    paymentMethod: {
      type: 'credit_card',
      last4: '9876',
      brand: 'amex',
      displayName: 'American Express ending in 9876',
    },
    createdAt: generateDate(7),
    updatedAt: generateDate(4),
    estimatedDelivery: generateDate(1),
  },
  {
    id: 'order-007',
    userId: 'user-001',
    items: [
      {
        id: 'item-011',
        productId: 'prod-029',
        productName: 'Building Blocks Set',
        productImage: 'https://placehold.co/600x600/1a1a2e/FFF?text=Blocks+1',
        quantity: 2,
        price: 34.99,
        total: 69.98,
      },
    ],
    subtotal: 69.98,
    discount: 7.0,
    shipping: 4.99,
    tax: 5.19,
    total: 73.16,
    status: 'cancelled' as OrderStatus,
    shippingAddress: {
      fullName: 'John Doe',
      address: '123 Main Street',
      apartment: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '+1 555-123-4567',
    },
    paymentMethod: {
      type: 'credit_card',
      last4: '4242',
      brand: 'visa',
      displayName: 'Visa ending in 4242',
    },
    notes: 'Customer requested cancellation',
    createdAt: generateDate(15),
    updatedAt: generateDate(14),
  },
  {
    id: 'order-008',
    userId: 'user-004',
    items: [
      {
        id: 'item-012',
        productId: 'prod-003',
        productName: 'Laptop Pro 15" - 16GB RAM, 512GB SSD',
        productImage: 'https://placehold.co/600x600/1a1a2e/FFF?text=Laptop+1',
        quantity: 1,
        price: 1299.99,
        total: 1299.99,
      },
    ],
    subtotal: 1299.99,
    discount: 100.0,
    shipping: 0,
    tax: 95.99,
    total: 1295.98,
    status: 'processing' as OrderStatus,
    shippingAddress: {
      fullName: 'Mike Wilson',
      address: '789 Pine Road',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
      phone: '+1 555-456-7890',
    },
    paymentMethod: {
      type: 'credit_card',
      last4: '1234',
      brand: 'visa',
      displayName: 'Visa Debit ending in 1234',
    },
    createdAt: generateDate(3),
    updatedAt: generateDate(2),
    estimatedDelivery: generateDate(-3),
  },
];

/**
 * Mock reviews data
 * Array of reviews for products
 */
export const MOCK_REVIEWS: readonly ProductReview[] = [
  {
    id: 'review-001',
    productId: 'prod-001',
    userId: 'user-001',
    userName: 'John Doe',
    rating: 5,
    comment: 'Amazing sound quality! The noise cancellation is incredible and the battery life is exactly as advertised. Highly recommend!',
    createdAt: generateDate(25),
  },
  {
    id: 'review-002',
    productId: 'prod-001',
    userId: 'user-002',
    userName: 'Jane Smith',
    rating: 4,
    comment: 'Great headphones overall. Very comfortable for long listening sessions. Only minor issue is the case could be smaller.',
    createdAt: generateDate(20),
  },
  {
    id: 'review-003',
    productId: 'prod-002',
    userId: 'user-004',
    userName: 'Mike Wilson',
    rating: 5,
    comment: 'Best TV I\'ve ever owned! The 4K picture is stunning and the smart features work flawlessly. Worth every penny.',
    createdAt: generateDate(30),
  },
  {
    id: 'review-004',
    productId: 'prod-003',
    userId: 'user-001',
    userName: 'John Doe',
    rating: 5,
    comment: 'This laptop is a beast! Handles everything I throw at it. The display is beautiful and the keyboard is comfortable.',
    createdAt: generateDate(35),
  },
  {
    id: 'review-005',
    productId: 'prod-006',
    userId: 'user-005',
    userName: 'Sarah Johnson',
    rating: 4,
    comment: 'Very comfortable t-shirt. The fabric is soft and breathable. Fits true to size. Will buy more colors!',
    createdAt: generateDate(15),
  },
  {
    id: 'review-006',
    productId: 'prod-007',
    userId: 'user-002',
    userName: 'Jane Smith',
    rating: 5,
    comment: 'Perfect fit and great quality denim. These jeans are now my go-to pair. Love the classic style.',
    createdAt: generateDate(22),
  },
  {
    id: 'review-007',
    productId: 'prod-013',
    userId: 'user-004',
    userName: 'Mike Wilson',
    rating: 5,
    comment: 'Best pillow I\'ve ever slept on! The cooling gel really works and the memory foam provides perfect support.',
    createdAt: generateDate(18),
  },
  {
    id: 'review-008',
    productId: 'prod-016',
    userId: 'user-005',
    userName: 'Sarah Johnson',
    rating: 4,
    comment: 'Excellent yoga mat. Thick enough for comfortable poses and the non-slip surface really works. Great value!',
    createdAt: generateDate(12),
  },
  {
    id: 'review-009',
    productId: 'prod-021',
    userId: 'user-001',
    userName: 'John Doe',
    rating: 5,
    comment: 'A must-read for any programmer! The explanations are clear and the examples are practical. Changed how I think about code.',
    createdAt: generateDate(40),
  },
  {
    id: 'review-010',
    productId: 'prod-025',
    userId: 'user-002',
    userName: 'Jane Smith',
    rating: 4,
    comment: 'Great skincare set! My skin feels amazing after using this routine. The products are gentle yet effective.',
    createdAt: generateDate(10),
  },
  {
    id: 'review-011',
    productId: 'prod-029',
    userId: 'user-004',
    userName: 'Mike Wilson',
    rating: 5,
    comment: 'My kids love these building blocks! They play with them for hours. Great quality and compatible with other brands.',
    createdAt: generateDate(20),
  },
  {
    id: 'review-012',
    productId: 'prod-001',
    userId: 'user-005',
    userName: 'Sarah Johnson',
    rating: 4,
    comment: 'Good headphones for the price. Sound quality is solid and they\'re very comfortable. Would recommend.',
    createdAt: generateDate(8),
  },
  {
    id: 'review-013',
    productId: 'prod-004',
    userId: 'user-001',
    userName: 'John Doe',
    rating: 4,
    comment: 'Great smartwatch! Tracks all my fitness activities accurately. Battery life is impressive. Minor learning curve.',
    createdAt: generateDate(14),
  },
  {
    id: 'review-014',
    productId: 'prod-009',
    userId: 'user-002',
    userName: 'Jane Smith',
    rating: 5,
    comment: 'Best running shoes I\'ve ever owned! So comfortable and lightweight. My feet don\'t get tired on long runs.',
    createdAt: generateDate(16),
  },
  {
    id: 'review-015',
    productId: 'prod-018',
    userId: 'user-004',
    userName: 'Mike Wilson',
    rating: 5,
    comment: 'This water bottle is amazing! Keeps my water ice cold all day. The design is sleek and it\'s very durable.',
    createdAt: generateDate(11),
  },
];

/**
 * Mock cart data
 * Array of cart items
 */
export const MOCK_CART_ITEMS: readonly CartItem[] = [
  {
    id: 'cart-item-001',
    productId: 'prod-001',
    product: {
      id: 'prod-001',
      name: 'Wireless Bluetooth Headphones',
      price: 149.99,
      images: ['https://placehold.co/600x600/1a1a2e/FFF?text=Headphones+1'],
      stock: 45,
    },
    quantity: 1,
    price: 149.99,
  },
  {
    id: 'cart-item-002',
    productId: 'prod-006',
    product: {
      id: 'prod-006',
      name: 'Premium Cotton T-Shirt',
      price: 24.99,
      images: ['https://placehold.co/600x600/1a1a2e/FFF?text=T-Shirt+1'],
      stock: 200,
    },
    quantity: 2,
    price: 24.99,
  },
  {
    id: 'cart-item-003',
    productId: 'prod-013',
    product: {
      id: 'prod-013',
      name: 'Memory Foam Pillow',
      price: 44.99,
      images: ['https://placehold.co/600x600/1a1a2e/FFF?text=Pillow+1'],
      stock: 110,
    },
    quantity: 1,
    price: 44.99,
  },
];

/**
 * Helper function to get product by ID
 * @param id Product ID
 * @returns Product or undefined
 */
export const getProductById = (id: string): Product | undefined => {
  return MOCK_PRODUCTS.find((product) => product.id === id);
};

/**
 * Helper function to get products by category
 * @param category Product category
 * @returns Array of products
 */
export const getProductsByCategory = (category: ProductCategory): Product[] => {
  return MOCK_PRODUCTS.filter((product) => product.category === category);
};

/**
 * Helper function to get reviews by product ID
 * @param productId Product ID
 * @returns Array of reviews
 */
export const getReviewsByProductId = (productId: string): ProductReview[] => {
  return MOCK_REVIEWS.filter((review) => review.productId === productId);
};

/**
 * Helper function to get orders by user ID
 * @param userId User ID
 * @returns Array of orders
 */
export const getOrdersByUserId = (userId: string): Order[] => {
  return MOCK_ORDERS.filter((order) => order.userId === userId);
};

/**
 * Helper function to get user by ID
 * @param id User ID
 * @returns User or undefined
 */
export const getUserById = (id: string): User | undefined => {
  return MOCK_USERS.find((user) => user.id === id);
};

/**
 * Helper function to get user by email
 * @param email User email
 * @returns User or undefined
 */
export const getUserByEmail = (email: string): User | undefined => {
  return MOCK_USERS.find((user) => user.email === email);
};
