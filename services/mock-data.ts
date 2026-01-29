/**
 * Mock Data for Development
 *
 * Rich mock data for testing and development without a real backend.
 * Includes 20+ products, 6+ categories, 50+ reviews, 3 users, and 5 orders.
 *
 * @module services/mock-data
 */

import type {
  Product,
  Category,
  Review,
  User,
  UserProfile,
  Order,
  OrderItem,
  OrderTotals,
  Address,
  PaymentMethod,
} from "@/types";

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Generate a unique ID
 */
export const generateId = (prefix: string): string => {
  return `${prefix}_${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * Get current timestamp in ISO format
 */
const now = (): string => new Date().toISOString();

/**
 * Get a past date relative to now
 */
const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

/**
 * Simulate random artificial delay (300-800ms)
 */
export const delay = (min = 300, max = 800): Promise<void> => {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Simulate occasional errors (for testing error states)
 * @param probability - Error probability (0-1, default 0.05 = 5%)
 */
export const simulateError = (probability = 0.05): void => {
  if (Math.random() < probability) {
    throw new Error("Simulated network error");
  }
};

// =============================================================================
// CATEGORIES (6+ categories with hierarchy)
// =============================================================================

export const mockCategories: Category[] = [
  {
    id: "cat_electronics",
    name: "Electronics",
    slug: "electronics",
    description: "Cutting-edge electronics for work and play",
    image: {
      url: "https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?w=800&q=80",
      alt: "Electronics category",
      isPrimary: true,
    },
    sortOrder: 1,
    isActive: true,
    productCount: 24,
    seo: {
      title: "Electronics | Shop the Latest Tech",
      description: "Discover the latest electronics...",
    },
    createdAt: daysAgo(365),
    updatedAt: daysAgo(30),
  },
  {
    id: "cat_laptops",
    name: "Laptops",
    slug: "laptops",
    description: "Powerful laptops for every need",
    image: {
      url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
      alt: "Laptops category",
      isPrimary: true,
    },
    parentId: "cat_electronics",
    sortOrder: 1,
    isActive: true,
    productCount: 8,
    createdAt: daysAgo(360),
    updatedAt: daysAgo(25),
  },
  {
    id: "cat_phones",
    name: "Phones",
    slug: "phones",
    description: "Smartphones and mobile devices",
    image: {
      url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
      alt: "Phones category",
      isPrimary: true,
    },
    parentId: "cat_electronics",
    sortOrder: 2,
    isActive: true,
    productCount: 6,
    createdAt: daysAgo(360),
    updatedAt: daysAgo(25),
  },
  {
    id: "cat_accessories",
    name: "Accessories",
    slug: "accessories",
    description: "Essential accessories for your devices",
    image: {
      url: "https://images.unsplash.com/photo-1527864550417-7efd1f1555ed?w=800&q=80",
      alt: "Accessories category",
      isPrimary: true,
    },
    parentId: "cat_electronics",
    sortOrder: 3,
    isActive: true,
    productCount: 5,
    createdAt: daysAgo(355),
    updatedAt: daysAgo(20),
  },
  {
    id: "cat_audio",
    name: "Audio",
    slug: "audio",
    description: "Premium audio equipment",
    image: {
      url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      alt: "Audio category",
      isPrimary: true,
    },
    parentId: "cat_electronics",
    sortOrder: 4,
    isActive: true,
    productCount: 3,
    createdAt: daysAgo(350),
    updatedAt: daysAgo(15),
  },
  {
    id: "cat_wearables",
    name: "Wearables",
    slug: "wearables",
    description: "Smart watches and fitness trackers",
    image: {
      url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      alt: "Wearables category",
      isPrimary: true,
    },
    parentId: "cat_electronics",
    sortOrder: 5,
    isActive: true,
    productCount: 2,
    createdAt: daysAgo(340),
    updatedAt: daysAgo(10),
  },
];

// Build category hierarchy
export const categoriesWithHierarchy = mockCategories.map((cat) => ({
  ...cat,
  children: mockCategories.filter((c) => c.parentId === cat.id),
}));

// =============================================================================
// PRODUCTS (20+ products with variants and specs)
// =============================================================================

export const mockProducts: Product[] = [
  // LAPTOPS
  {
    id: "prod_macbook_pro_16",
    name: "MacBook Pro 16",
    slug: "macbook-pro-16",
    description:
      "The most advanced Mac laptop ever. Supercharged by M3 Pro or M3 Max, MacBook Pro is built for demanding workflows. With up to 22 hours of battery life, a stunning Liquid Retina XDR display, and all the ports you need, it's the ultimate pro laptop.",
    shortDescription:
      "Supercharged by M3 Pro or M3 Max chip. Up to 22 hours battery.",
    price: 2499,
    compareAtPrice: 2699,
    images: [
      {
        url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80",
        alt: "MacBook Pro 16 - Space Black",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1200&q=80",
        alt: "MacBook Pro 16 - Side View",
      },
      {
        url: "https://images.unsplash.com/photo-1541807084-5c52b6b92bc0?w=1200&q=80",
        alt: "MacBook Pro 16 - Keyboard",
      },
    ],
    inventory: 45,
    categoryId: "cat_laptops",
    categoryIds: ["cat_laptops", "cat_electronics"],
    tags: ["laptop", "apple", "pro", "m3", "productivity"],
    rating: 4.8,
    reviewCount: 342,
    specs: [
      { key: "Display", value: "16.2-inch Liquid Retina XDR" },
      { key: "Chip", value: "M3 Pro or M3 Max" },
      { key: "Memory", value: "Up to 128GB unified memory" },
      { key: "Storage", value: "Up to 8TB SSD" },
      { key: "Battery", value: "Up to 22 hours" },
      { key: "Weight", value: "2.14 kg" },
    ],
    variants: [
      {
        id: "var_mb16_space_black_512",
        sku: "MBP16-M3P-512-SB",
        name: "Space Black - 512GB",
        color: "Space Black",
        price: 2499,
        inventory: 15,
      },
      {
        id: "var_mb16_space_black_1tb",
        sku: "MBP16-M3P-1TB-SB",
        name: "Space Black - 1TB",
        color: "Space Black",
        price: 2699,
        inventory: 12,
      },
      {
        id: "var_mb16_silver_512",
        sku: "MBP16-M3P-512-SL",
        name: "Silver - 512GB",
        color: "Silver",
        price: 2499,
        inventory: 10,
      },
      {
        id: "var_mb16_silver_1tb",
        sku: "MBP16-M3P-1TB-SL",
        name: "Silver - 1TB",
        color: "Silver",
        price: 2699,
        inventory: 8,
      },
    ],
    isActive: true,
    isFeatured: true,
    weight: 2140,
    dimensions: { width: 35.57, height: 1.68, depth: 24.81 },
    seo: {
      title: "MacBook Pro 16-inch | Apple M3 Pro/Max",
      description: "The ultimate pro laptop with M3 chip...",
    },
    createdAt: daysAgo(120),
    updatedAt: daysAgo(15),
  },
  {
    id: "prod_dell_xps_15",
    name: "Dell XPS 15",
    slug: "dell-xps-15",
    description:
      "Creators, rejoice. The XPS 15 brings your creative visions to life with its stunning OLED display and powerful performance. The Intel Core i9 processor and NVIDIA GeForce RTX 4050 graphics handle demanding creative workloads with ease.",
    shortDescription:
      "Stunning OLED display. Intel Core i9. RTX 4050 graphics.",
    price: 1899,
    compareAtPrice: 2099,
    images: [
      {
        url: "https://images.unsplash.com/photo-1593642632823-8f7856677741?w=1200&q=80",
        alt: "Dell XPS 15 - Platinum Silver",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1585298723682-7115561c51b7?w=1200&q=80",
        alt: "Dell XPS 15 - Open",
      },
    ],
    inventory: 32,
    categoryId: "cat_laptops",
    categoryIds: ["cat_laptops", "cat_electronics"],
    tags: ["laptop", "dell", "xps", "creator", "oled"],
    rating: 4.6,
    reviewCount: 186,
    specs: [
      { key: "Display", value: "15.6-inch 3.5K OLED Touch" },
      { key: "Processor", value: "Intel Core i9-13900H" },
      { key: "Graphics", value: "NVIDIA GeForce RTX 4050" },
      { key: "Memory", value: "32GB DDR5" },
      { key: "Storage", value: "1TB NVMe SSD" },
      { key: "Weight", value: "1.86 kg" },
    ],
    variants: [
      {
        id: "var_xps15_i7_512",
        sku: "XPS15-I7-512",
        name: "Core i7 - 512GB",
        price: 1699,
        inventory: 12,
      },
      {
        id: "var_xps15_i9_1tb",
        sku: "XPS15-I9-1TB",
        name: "Core i9 - 1TB",
        price: 1899,
        inventory: 20,
      },
    ],
    isActive: true,
    isFeatured: true,
    weight: 1860,
    dimensions: { width: 34.4, height: 1.82, depth: 23.0 },
    createdAt: daysAgo(180),
    updatedAt: daysAgo(20),
  },
  {
    id: "prod_lenovo_thinkpad_x1",
    name: "Lenovo ThinkPad X1 Carbon",
    slug: "lenovo-thinkpad-x1-carbon",
    description:
      "The ultimate business laptop. The ThinkPad X1 Carbon Gen 11 is designed for professionals who demand the best. With Intel vPro, MIL-STD-810H durability, and legendary ThinkPad reliability.",
    shortDescription: "Ultralight business laptop. Intel vPro. Military-grade.",
    price: 1599,
    compareAtPrice: 1799,
    images: [
      {
        url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80",
        alt: "ThinkPad X1 Carbon - Black",
        isPrimary: true,
      },
    ],
    inventory: 28,
    categoryId: "cat_laptops",
    categoryIds: ["cat_laptops", "cat_electronics"],
    tags: ["laptop", "lenovo", "thinkpad", "business", "ultrabook"],
    rating: 4.7,
    reviewCount: 423,
    specs: [
      { key: "Display", value: "14-inch 2.8K OLED" },
      { key: "Processor", value: "Intel Core i7-1365U" },
      { key: "Memory", value: "16GB LPDDR5" },
      { key: "Storage", value: "512GB SSD" },
      { key: "Weight", value: "1.12 kg" },
      { key: "Battery", value: "Up to 15 hours" },
    ],
    variants: [
      {
        id: "var_x1c_i7_512",
        sku: "X1C-I7-512",
        name: "Core i7 - 512GB",
        price: 1599,
        inventory: 15,
      },
      {
        id: "var_x1c_i7_1tb",
        sku: "X1C-I7-1TB",
        name: "Core i7 - 1TB",
        price: 1799,
        inventory: 13,
      },
    ],
    isActive: true,
    isFeatured: false,
    weight: 1120,
    createdAt: daysAgo(200),
    updatedAt: daysAgo(25),
  },
  {
    id: "prod_asus_rog_zephyrus",
    name: "ASUS ROG Zephyrus G14",
    slug: "asus-rog-zephyrus-g14",
    description:
      "Power meets portability. The ROG Zephyrus G14 packs an AMD Ryzen 9 and RTX 4060 into a compact 14-inch chassis. The AniMe Matrix display lets you customize the lid with animations and notifications.",
    shortDescription:
      "Compact gaming powerhouse. RTX 4060. AniMe Matrix display.",
    price: 1599,
    compareAtPrice: 1799,
    images: [
      {
        url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1200&q=80",
        alt: "ROG Zephyrus G14 - Eclipse Gray",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1612287230217-8c7c6c170b90?w=1200&q=80",
        alt: "ROG Zephyrus G14 - Gaming",
      },
    ],
    inventory: 18,
    categoryId: "cat_laptops",
    categoryIds: ["cat_laptops", "cat_electronics"],
    tags: ["laptop", "asus", "rog", "gaming", "rtx"],
    rating: 4.5,
    reviewCount: 156,
    specs: [
      { key: "Display", value: "14-inch QHD+ 165Hz" },
      { key: "Processor", value: "AMD Ryzen 9 7940HS" },
      { key: "Graphics", value: "NVIDIA RTX 4060" },
      { key: "Memory", value: "16GB DDR5" },
      { key: "Storage", value: "1TB SSD" },
      { key: "Weight", value: "1.72 kg" },
    ],
    variants: [
      {
        id: "var_g14_gray",
        sku: "G14-R9-RTX4060-GR",
        name: "Eclipse Gray",
        color: "Eclipse Gray",
        price: 1599,
        inventory: 10,
      },
      {
        id: "var_g14_white",
        sku: "G14-R9-RTX4060-WH",
        name: "Platinum White",
        color: "Platinum White",
        price: 1599,
        inventory: 8,
      },
    ],
    isActive: true,
    isFeatured: true,
    weight: 1720,
    createdAt: daysAgo(150),
    updatedAt: daysAgo(10),
  },

  // PHONES
  {
    id: "prod_iphone_15_pro",
    name: "iPhone 15 Pro",
    slug: "iphone-15-pro",
    description:
      "Titanium design. A17 Pro chip. Action button. The iPhone 15 Pro is the first iPhone to feature an aerospace-grade titanium design. The A17 Pro chip enables unprecedented mobile gaming performance.",
    shortDescription:
      "Titanium design. A17 Pro chip. Action button. 48MP camera.",
    price: 999,
    images: [
      {
        url: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=1200&q=80",
        alt: "iPhone 15 Pro - Natural Titanium",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&q=80",
        alt: "iPhone 15 Pro - Back",
      },
    ],
    inventory: 85,
    categoryId: "cat_phones",
    categoryIds: ["cat_phones", "cat_electronics"],
    tags: ["phone", "apple", "iphone", "flagship", "5g"],
    rating: 4.7,
    reviewCount: 892,
    specs: [
      { key: "Display", value: "6.1-inch Super Retina XDR" },
      { key: "Chip", value: "A17 Pro" },
      { key: "Camera", value: "48MP Main + 12MP Ultra Wide + 12MP Tele" },
      { key: "Storage", value: "128GB / 256GB / 512GB / 1TB" },
      { key: "Battery", value: "Up to 23 hours video" },
      { key: "5G", value: "Yes" },
    ],
    variants: [
      {
        id: "var_ip15p_natural_256",
        sku: "IP15P-NT-256",
        name: "Natural Titanium - 256GB",
        color: "Natural Titanium",
        price: 1099,
        inventory: 20,
      },
      {
        id: "var_ip15p_blue_256",
        sku: "IP15P-BL-256",
        name: "Blue Titanium - 256GB",
        color: "Blue Titanium",
        price: 1099,
        inventory: 18,
      },
      {
        id: "var_ip15p_black_256",
        sku: "IP15P-BK-256",
        name: "Black Titanium - 256GB",
        color: "Black Titanium",
        price: 1099,
        inventory: 25,
      },
      {
        id: "var_ip15p_white_256",
        sku: "IP15P-WH-256",
        name: "White Titanium - 256GB",
        color: "White Titanium",
        price: 1099,
        inventory: 22,
      },
    ],
    isActive: true,
    isFeatured: true,
    weight: 187,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(5),
  },
  {
    id: "prod_samsung_s24_ultra",
    name: "Samsung Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    description:
      "Galaxy AI is here. The Galaxy S24 Ultra features the most intelligent display ever, a titanium frame, and a 200MP adaptive pixel camera. Experience AI-powered features that transform how you create and communicate.",
    shortDescription:
      "Galaxy AI. 200MP camera. S Pen. Titanium frame. 5x optical zoom.",
    price: 1299,
    images: [
      {
        url: "https://images.unsplash.com/photo-1610945265078-3858a0828671?w=1200&q=80",
        alt: "Galaxy S24 Ultra - Titanium Gray",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1200&q=80",
        alt: "Galaxy S24 Ultra - Camera",
      },
    ],
    inventory: 62,
    categoryId: "cat_phones",
    categoryIds: ["cat_phones", "cat_electronics"],
    tags: ["phone", "samsung", "galaxy", "android", "5g"],
    rating: 4.6,
    reviewCount: 567,
    specs: [
      { key: "Display", value: "6.8-inch QHD+ Dynamic AMOLED 2X" },
      { key: "Processor", value: "Snapdragon 8 Gen 3" },
      { key: "Camera", value: "200MP + 50MP + 12MP + 10MP" },
      { key: "S Pen", value: "Yes, built-in" },
      { key: "Battery", value: "5000mAh" },
      { key: "5G", value: "Yes" },
    ],
    variants: [
      {
        id: "var_s24u_gray_256",
        sku: "S24U-GR-256",
        name: "Titanium Gray - 256GB",
        color: "Titanium Gray",
        price: 1299,
        inventory: 20,
      },
      {
        id: "var_s24u_black_256",
        sku: "S24U-BK-256",
        name: "Titanium Black - 256GB",
        color: "Titanium Black",
        price: 1299,
        inventory: 18,
      },
      {
        id: "var_s24u_violet_256",
        sku: "S24U-VI-256",
        name: "Titanium Violet - 256GB",
        color: "Titanium Violet",
        price: 1299,
        inventory: 12,
      },
      {
        id: "var_s24u_yellow_256",
        sku: "S24U-YE-256",
        name: "Titanium Yellow - 256GB",
        color: "Titanium Yellow",
        price: 1299,
        inventory: 12,
      },
    ],
    isActive: true,
    isFeatured: true,
    weight: 233,
    createdAt: daysAgo(60),
    updatedAt: daysAgo(3),
  },
  {
    id: "prod_google_pixel_8_pro",
    name: "Google Pixel 8 Pro",
    slug: "google-pixel-8-pro",
    description:
      "The only phone engineered by Google. Built with AI at the center, Pixel 8 Pro helps you do more, effortlessly. The best Pixel camera yet captures stunning photos and videos in any light.",
    shortDescription:
      "Google AI. Best Pixel camera. 7 years of updates. Actua display.",
    price: 999,
    compareAtPrice: 1099,
    images: [
      {
        url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&q=80",
        alt: "Pixel 8 Pro - Obsidian",
        isPrimary: true,
      },
    ],
    inventory: 48,
    categoryId: "cat_phones",
    categoryIds: ["cat_phones", "cat_electronics"],
    tags: ["phone", "google", "pixel", "android", "ai"],
    rating: 4.5,
    reviewCount: 312,
    specs: [
      { key: "Display", value: "6.7-inch Super Actua" },
      { key: "Processor", value: "Google Tensor G3" },
      { key: "Camera", value: "50MP + 48MP + 48MP" },
      { key: "Storage", value: "128GB / 256GB / 512GB" },
      { key: "Battery", value: "5050mAh" },
      { key: "Updates", value: "7 years" },
    ],
    variants: [
      {
        id: "var_p8p_obsidian_128",
        sku: "P8P-OB-128",
        name: "Obsidian - 128GB",
        color: "Obsidian",
        price: 999,
        inventory: 15,
      },
      {
        id: "var_p8p_porcelain_128",
        sku: "P8P-PO-128",
        name: "Porcelain - 128GB",
        color: "Porcelain",
        price: 999,
        inventory: 18,
      },
      {
        id: "var_p8p_bay_128",
        sku: "P8P-BA-128",
        name: "Bay - 128GB",
        color: "Bay",
        price: 999,
        inventory: 15,
      },
    ],
    isActive: true,
    isFeatured: false,
    weight: 213,
    createdAt: daysAgo(100),
    updatedAt: daysAgo(12),
  },
  {
    id: "prod_oneplus_12",
    name: "OnePlus 12",
    slug: "oneplus-12",
    description:
      "Never settle. The OnePlus 12 features the Snapdragon 8 Gen 3, a stunning 2K 120Hz ProXDR display, and the best Hasselblad camera system ever on a OnePlus phone.",
    shortDescription:
      "Snapdragon 8 Gen 3. 2K 120Hz display. Hasselblad camera. 100W charging.",
    price: 799,
    compareAtPrice: 899,
    images: [
      {
        url: "https://images.unsplash.com/photo-1660463974457-370df74b0eda?w=1200&q=80",
        alt: "OnePlus 12 - Flowy Emerald",
        isPrimary: true,
      },
    ],
    inventory: 55,
    categoryId: "cat_phones",
    categoryIds: ["cat_phones", "cat_electronics"],
    tags: ["phone", "oneplus", "android", "flagship", "fast-charging"],
    rating: 4.4,
    reviewCount: 178,
    specs: [
      { key: "Display", value: "6.82-inch 2K 120Hz ProXDR" },
      { key: "Processor", value: "Snapdragon 8 Gen 3" },
      { key: "Camera", value: "50MP + 48MP + 64MP Hasselblad" },
      { key: "Battery", value: "5400mAh" },
      { key: "Charging", value: "100W wired / 50W wireless" },
      { key: "RAM", value: "12GB / 16GB" },
    ],
    variants: [
      {
        id: "var_op12_emerald_256",
        sku: "OP12-EM-256",
        name: "Flowy Emerald - 256GB",
        color: "Flowy Emerald",
        price: 799,
        inventory: 25,
      },
      {
        id: "var_op12_silver_256",
        sku: "OP12-SI-256",
        name: "Silky Black - 256GB",
        color: "Silky Black",
        price: 799,
        inventory: 30,
      },
    ],
    isActive: true,
    isFeatured: false,
    weight: 220,
    createdAt: daysAgo(80),
    updatedAt: daysAgo(8),
  },

  // ACCESSORIES
  {
    id: "prod_magic_keyboard",
    name: "Apple Magic Keyboard",
    slug: "apple-magic-keyboard",
    description:
      "Magic Keyboard delivers a remarkably comfortable and precise typing experience. It features an extended layout with document navigation controls for quick scrolling and full-size arrow keys.",
    shortDescription:
      "Wireless keyboard with numeric keypad. Rechargeable. Scissor mechanism.",
    price: 99,
    images: [
      {
        url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&q=80",
        alt: "Magic Keyboard - Silver",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=1200&q=80",
        alt: "Magic Keyboard - Black",
      },
    ],
    inventory: 120,
    categoryId: "cat_accessories",
    categoryIds: ["cat_accessories", "cat_electronics"],
    tags: ["keyboard", "apple", "wireless", "accessory"],
    rating: 4.7,
    reviewCount: 2341,
    specs: [
      { key: "Connectivity", value: "Bluetooth, Lightning" },
      { key: "Battery", value: "Rechargeable (1 month+)" },
      { key: "Keys", value: "Full-size with numeric keypad" },
      { key: "Dimensions", value: "41.87 x 11.49 cm" },
      { key: "Weight", value: "390g" },
    ],
    variants: [
      {
        id: "var_mk_silver",
        sku: "MK-SILVER",
        name: "Silver",
        color: "Silver",
        price: 99,
        inventory: 60,
      },
      {
        id: "var_mk_black",
        sku: "MK-BLACK",
        name: "Space Gray",
        color: "Space Gray",
        price: 99,
        inventory: 60,
      },
    ],
    isActive: true,
    isFeatured: false,
    weight: 390,
    createdAt: daysAgo(400),
    updatedAt: daysAgo(30),
  },
  {
    id: "prod_logitech_mx_master_3s",
    name: "Logitech MX Master 3S",
    slug: "logitech-mx-master-3s",
    description:
      "An icon remastered. The MX Master 3S is the successor to the legendary MX Master 3, featuring an 8,000 DPI sensor, Quiet Clicks, and USB-C quick charging.",
    shortDescription:
      "8K DPI sensor. Quiet clicks. MagSpeed scrolling. USB-C.",
    price: 99,
    compareAtPrice: 109,
    images: [
      {
        url: "https://images.unsplash.com/photo-1527864550417-7efd1f1555ed?w=1200&q=80",
        alt: "MX Master 3S - Graphite",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=1200&q=80",
        alt: "MX Master 3S - Pale Gray",
      },
    ],
    inventory: 95,
    categoryId: "cat_accessories",
    categoryIds: ["cat_accessories", "cat_electronics"],
    tags: ["mouse", "logitech", "wireless", "productivity"],
    rating: 4.8,
    reviewCount: 3421,
    specs: [
      { key: "Sensor", value: "8,000 DPI" },
      { key: "Clicks", value: "Quiet (90% noise reduction)" },
      { key: "Scrolling", value: "MagSpeed Electromagnetic" },
      { key: "Battery", value: "70 days" },
      { key: "Connectivity", value: "Bluetooth, USB receiver" },
    ],
    variants: [
      {
        id: "var_mx3s_graphite",
        sku: "MX3S-GRAPHITE",
        name: "Graphite",
        color: "Graphite",
        price: 99,
        inventory: 50,
      },
      {
        id: "var_mx3s_pale",
        sku: "MX3S-PALE",
        name: "Pale Gray",
        color: "Pale Gray",
        price: 99,
        inventory: 45,
      },
    ],
    isActive: true,
    isFeatured: true,
    weight: 141,
    createdAt: daysAgo(300),
    updatedAt: daysAgo(20),
  },
  {
    id: "prod_anker_737_charger",
    name: "Anker 737 GaNPrime 120W Charger",
    slug: "anker-737-ganprime-charger",
    description:
      "The future of charging is here. Anker's GaNPrime technology delivers 120W of power in a compact design. Charge 3 devices simultaneously with intelligent power allocation.",
    shortDescription:
      "120W GaNPrime. 3-port charging. Compact design. Intelligent power.",
    price: 89,
    compareAtPrice: 109,
    images: [
      {
        url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=1200&q=80",
        alt: "Anker 737 Charger",
        isPrimary: true,
      },
    ],
    inventory: 150,
    categoryId: "cat_accessories",
    categoryIds: ["cat_accessories", "cat_electronics"],
    tags: ["charger", "anker", "gan", "usb-c", "fast-charging"],
    rating: 4.6,
    reviewCount: 876,
    specs: [
      { key: "Total Output", value: "120W" },
      { key: "Ports", value: "2x USB-C, 1x USB-A" },
      { key: "Technology", value: "GaNPrime" },
      { key: "Dimensions", value: "67 x 31 x 41 mm" },
      { key: "Weight", value: "190g" },
    ],
    isActive: true,
    isFeatured: false,
    weight: 190,
    createdAt: daysAgo(250),
    updatedAt: daysAgo(15),
  },
  {
    id: "prod_satechi_hub",
    name: "Satechi USB-C Multiport Adapter",
    slug: "satechi-usb-c-multiport-adapter",
    description:
      "Expand your connectivity. This sleek aluminum hub adds 7 essential ports to your USB-C device, including 4K HDMI, USB-A data, SD card reader, and 100W power delivery.",
    shortDescription:
      "7-in-1 hub. 4K HDMI. 100W PD. SD card reader. Aluminum design.",
    price: 79,
    images: [
      {
        url: "https://images.unsplash.com/photo-1625153669622-870ed018b2b1?w=1200&q=80",
        alt: "Satechi Hub - Space Gray",
        isPrimary: true,
      },
    ],
    inventory: 80,
    categoryId: "cat_accessories",
    categoryIds: ["cat_accessories", "cat_electronics"],
    tags: ["hub", "usb-c", "adapter", "macbook", "accessory"],
    rating: 4.5,
    reviewCount: 567,
    specs: [
      { key: "Ports", value: "7-in-1" },
      { key: "HDMI", value: "4K @ 60Hz" },
      { key: "USB-A", value: "3x USB 3.0 (5Gbps)" },
      { key: "Card Reader", value: "SD / MicroSD" },
      { key: "Power Delivery", value: "100W pass-through" },
    ],
    variants: [
      {
        id: "var_satechi_gray",
        sku: "SATECHI-HUB-GRAY",
        name: "Space Gray",
        color: "Space Gray",
        price: 79,
        inventory: 40,
      },
      {
        id: "var_satechi_silver",
        sku: "SATECHI-HUB-SILVER",
        name: "Silver",
        color: "Silver",
        price: 79,
        inventory: 40,
      },
    ],
    isActive: true,
    isFeatured: false,
    weight: 110,
    createdAt: daysAgo(280),
    updatedAt: daysAgo(18),
  },
  {
    id: "prod_native_union_cable",
    name: "Native Union Belt Cable Pro",
    slug: "native-union-belt-cable-pro",
    description:
      "A cable that lasts. The Belt Cable Pro features a 3-meter length, reinforced braided nylon construction, and genuine leather strap. Supports up to 100W power delivery.",
    shortDescription:
      "3m braided cable. 100W PD. Genuine leather strap. Reinforced.",
    price: 34,
    compareAtPrice: 39,
    images: [
      {
        url: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=1200&q=80",
        alt: "Native Union Cable - Zebra",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=1200&q=80",
        alt: "Native Union Cable - Indigo",
      },
    ],
    inventory: 200,
    categoryId: "cat_accessories",
    categoryIds: ["cat_accessories", "cat_electronics"],
    tags: ["cable", "usb-c", "native-union", "accessory"],
    rating: 4.7,
    reviewCount: 445,
    specs: [
      { key: "Length", value: "3 meters" },
      { key: "Material", value: "Braided Nylon" },
      { key: "Power", value: "100W PD" },
      { key: "Connector", value: "USB-C to USB-C" },
    ],
    variants: [
      {
        id: "var_nu_zebra",
        sku: "NU-BELT-ZEBRA",
        name: "Zebra",
        color: "Zebra",
        price: 34,
        inventory: 100,
      },
      {
        id: "var_nu_indigo",
        sku: "NU-BELT-INDIGO",
        name: "Indigo",
        color: "Indigo",
        price: 34,
        inventory: 100,
      },
    ],
    isActive: true,
    isFeatured: false,
    weight: 120,
    createdAt: daysAgo(320),
    updatedAt: daysAgo(22),
  },

  // AUDIO
  {
    id: "prod_airpods_pro_2",
    name: "AirPods Pro (2nd Generation)",
    slug: "airpods-pro-2nd-generation",
    description:
      "Rebuilt from the sound up. AirPods Pro feature up to 2x more Active Noise Cancellation, Adaptive Transparency, and Personalized Spatial Audio with dynamic head tracking.",
    shortDescription:
      "2x Active Noise Cancellation. Adaptive Transparency. Spatial Audio.",
    price: 249,
    images: [
      {
        url: "https://images.unsplash.com/photo-1603351154351-5cfb3d04ef31?w=1200&q=80",
        alt: "AirPods Pro 2 - White",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=1200&q=80",
        alt: "AirPods Pro 2 - In Case",
      },
    ],
    inventory: 180,
    categoryId: "cat_audio",
    categoryIds: ["cat_audio", "cat_electronics"],
    tags: ["headphones", "apple", "wireless", "noise-cancelling", "earbuds"],
    rating: 4.8,
    reviewCount: 5234,
    specs: [
      { key: "Chip", value: "H2" },
      { key: "Noise Cancellation", value: "2x Active ANC" },
      { key: "Battery", value: "6 hours (30 with case)" },
      { key: "Charging", value: "MagSafe, Lightning, Qi" },
      { key: "Water Resistance", value: "IPX4" },
    ],
    isActive: true,
    isFeatured: true,
    weight: 50,
    createdAt: daysAgo(200),
    updatedAt: daysAgo(10),
  },
  {
    id: "prod_sony_wh1000xm5",
    name: "Sony WH-1000XM5",
    slug: "sony-wh-1000xm5",
    description:
      "The best noise canceling just got better. The WH-1000XM5 features two processors controlling eight microphones for unprecedented noise cancellation and exceptional call quality.",
    shortDescription:
      "Industry-leading ANC. 30-hour battery. Crystal clear calls. LDAC.",
    price: 399,
    compareAtPrice: 449,
    images: [
      {
        url: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=1200&q=80",
        alt: "Sony WH-1000XM5 - Black",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1585298723682-7115561c51b7?w=1200&q=80",
        alt: "Sony WH-1000XM5 - Silver",
      },
    ],
    inventory: 75,
    categoryId: "cat_audio",
    categoryIds: ["cat_audio", "cat_electronics"],
    tags: ["headphones", "sony", "wireless", "noise-cancelling", "over-ear"],
    rating: 4.7,
    reviewCount: 2891,
    specs: [
      { key: "Driver", value: "30mm" },
      { key: "Frequency", value: "4Hz-40,000Hz" },
      { key: "Battery", value: "30 hours" },
      { key: "Charging", value: "3 min = 3 hours" },
      { key: "Codecs", value: "LDAC, AAC, SBC" },
    ],
    variants: [
      {
        id: "var_sonyxm5_black",
        sku: "SONY-XM5-BLACK",
        name: "Black",
        color: "Black",
        price: 399,
        inventory: 40,
      },
      {
        id: "var_sonyxm5_silver",
        sku: "SONY-XM5-SILVER",
        name: "Silver",
        color: "Silver",
        price: 399,
        inventory: 35,
      },
    ],
    isActive: true,
    isFeatured: true,
    weight: 250,
    createdAt: daysAgo(350),
    updatedAt: daysAgo(25),
  },
  {
    id: "prod_bose_qc_ultra",
    name: "Bose QuietComfort Ultra Headphones",
    slug: "bose-quietcomfort-ultra-headphones",
    description:
      "World-class quiet, ultra comfort. The QuietComfort Ultra Headphones feature CustomTune technology that personalizes sound to your ears and immersive audio for the most spatial listening experience.",
    shortDescription:
      "CustomTune audio. Immersive Audio. Premium comfort. 24-hour battery.",
    price: 429,
    images: [
      {
        url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&q=80",
        alt: "Bose QC Ultra - Black",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200&q=80",
        alt: "Bose QC Ultra - White Smoke",
      },
    ],
    inventory: 60,
    categoryId: "cat_audio",
    categoryIds: ["cat_audio", "cat_electronics"],
    tags: ["headphones", "bose", "wireless", "noise-cancelling", "premium"],
    rating: 4.6,
    reviewCount: 678,
    specs: [
      { key: "Audio", value: "CustomTune + Immersive Audio" },
      { key: "Modes", value: "Quiet, Aware, Immersion" },
      { key: "Battery", value: "24 hours" },
      { key: "Charging", value: "USB-C, 15 min = 2.5 hours" },
      { key: "Multipoint", value: "Yes" },
    ],
    variants: [
      {
        id: "var_bose_black",
        sku: "BOSE-QCU-BLACK",
        name: "Black",
        color: "Black",
        price: 429,
        inventory: 30,
      },
      {
        id: "var_bose_white",
        sku: "BOSE-QCU-WHITE",
        name: "White Smoke",
        color: "White Smoke",
        price: 429,
        inventory: 30,
      },
    ],
    isActive: true,
    isFeatured: false,
    weight: 253,
    createdAt: daysAgo(120),
    updatedAt: daysAgo(8),
  },

  // WEARABLES
  {
    id: "prod_apple_watch_ultra_2",
    name: "Apple Watch Ultra 2",
    slug: "apple-watch-ultra-2",
    description:
      "The most rugged and capable Apple Watch pushes the limits again. Featuring the S9 SiP, a magical new way to use your watch without touching the screen, and the brightest Apple display ever.",
    shortDescription:
      "S9 SiP. 3000 nits brightness. 36-hour battery. Titanium case. 100m water resistant.",
    price: 799,
    images: [
      {
        url: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=1200&q=80",
        alt: "Apple Watch Ultra 2 - Titanium",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1558126319-c9feecbf57ee?w=1200&q=80",
        alt: "Apple Watch Ultra 2 - Orange Alpine Loop",
      },
    ],
    inventory: 45,
    categoryId: "cat_wearables",
    categoryIds: ["cat_wearables", "cat_electronics"],
    tags: ["watch", "apple", "fitness", "outdoor", "gps"],
    rating: 4.8,
    reviewCount: 1234,
    specs: [
      { key: "Case", value: "49mm Titanium" },
      { key: "Chip", value: "S9 SiP" },
      { key: "Display", value: "3000 nits brightness" },
      { key: "Battery", value: "36 hours (72 low power)" },
      { key: "Water Resistance", value: "100m" },
      { key: "GPS", value: "Precision dual-frequency" },
    ],
    variants: [
      {
        id: "var_awu2_orange",
        sku: "AWU2-ORANGE-LOOP",
        name: "Orange Alpine Loop - Medium",
        color: "Orange",
        size: "Medium",
        price: 799,
        inventory: 15,
      },
      {
        id: "var_awu2_blue",
        sku: "AWU2-BLUE-LOOP",
        name: "Blue Alpine Loop - Large",
        color: "Blue",
        size: "Large",
        price: 799,
        inventory: 15,
      },
      {
        id: "var_awu2_green",
        sku: "AWU2-GREEN-LOOP",
        name: "Green Alpine Loop - Small",
        color: "Green",
        size: "Small",
        price: 799,
        inventory: 15,
      },
    ],
    isActive: true,
    isFeatured: true,
    weight: 61,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(5),
  },
  {
    id: "prod_garmin_fenix_7x",
    name: "Garmin fēnix 7X Solar",
    slug: "garmin-fenix-7x-solar",
    description:
      "Long weeks. Longer battery. The fēnix 7X Solar multisport GPS watch features a Power Sapphire solar charging lens, mapping, music storage, and advanced training features for athletes.",
    shortDescription:
      "Power Sapphire solar charging. 37-day battery. Multisport GPS. Maps.",
    price: 899,
    compareAtPrice: 999,
    images: [
      {
        url: "https://images.unsplash.com/photo-1551817958-c1b0c374133f?w=1200&q=80",
        alt: "Garmin fēnix 7X - Slate Gray",
        isPrimary: true,
      },
    ],
    inventory: 35,
    categoryId: "cat_wearables",
    categoryIds: ["cat_wearables", "cat_electronics"],
    tags: ["watch", "garmin", "fitness", "outdoor", "solar"],
    rating: 4.7,
    reviewCount: 892,
    specs: [
      { key: "Lens", value: "Power Sapphire Solar" },
      { key: "Battery", value: "37 days (solar)" },
      { key: "GPS", value: "Multi-band GNSS" },
      { key: "Mapping", value: "Preloaded TopoActive" },
      { key: "Music", value: "32GB storage" },
      { key: "Flashlight", value: "Built-in LED" },
    ],
    isActive: true,
    isFeatured: false,
    weight: 89,
    createdAt: daysAgo(250),
    updatedAt: daysAgo(20),
  },

  // Additional Products (reaching 20+)
  {
    id: "prod_ipad_pro_12_9",
    name: "iPad Pro 12.9-inch",
    slug: "ipad-pro-12-9-inch",
    description:
      "Supercharged by the Apple M2 chip. The 12.9-inch iPad Pro features a stunning Liquid Retina XDR display, ProMotion technology, and all-day battery life.",
    shortDescription: "M2 chip. Liquid Retina XDR. ProMotion. Apple Pencil hover.",
    price: 1099,
    images: [
      {
        url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&q=80",
        alt: "iPad Pro 12.9 - Space Gray",
        isPrimary: true,
      },
    ],
    inventory: 55,
    categoryId: "cat_electronics",
    categoryIds: ["cat_electronics"],
    tags: ["tablet", "apple", "ipad", "pro", "m2"],
    rating: 4.8,
    reviewCount: 1567,
    specs: [
      { key: "Display", value: '12.9" Liquid Retina XDR' },
      { key: "Chip", value: "M2" },
      { key: "Storage", value: "128GB - 2TB" },
      { key: "Camera", value: "12MP Wide + 10MP Ultra Wide" },
      { key: "5G", value: "Optional" },
    ],
    variants: [
      {
        id: "var_ipadpro_128_wifi",
        sku: "IPADPRO-12-128-WIFI",
        name: "128GB Wi-Fi",
        price: 1099,
        inventory: 20,
      },
      {
        id: "var_ipadpro_256_wifi",
        sku: "IPADPRO-12-256-WIFI",
        name: "256GB Wi-Fi",
        price: 1199,
        inventory: 20,
      },
      {
        id: "var_ipadpro_128_5g",
        sku: "IPADPRO-12-128-5G",
        name: "128GB Wi-Fi + Cellular",
        price: 1299,
        inventory: 15,
      },
    ],
    isActive: true,
    isFeatured: true,
    weight: 682,
    createdAt: daysAgo(180),
    updatedAt: daysAgo(15),
  },
  {
    id: "prod_steam_deck_oled",
    name: "Steam Deck OLED",
    slug: "steam-deck-oled",
    description:
      "The ultimate handheld gaming PC just got better. Features a stunning HDR OLED display, longer battery life, faster WiFi, and the same powerful performance.",
    shortDescription: "HDR OLED display. 50Wh battery. 512GB - 1TB storage.",
    price: 549,
    images: [
      {
        url: "https://images.unsplash.com/photo-1663375897638-74d1675e3d19?w=1200&q=80",
        alt: "Steam Deck OLED",
        isPrimary: true,
      },
    ],
    inventory: 40,
    categoryId: "cat_electronics",
    categoryIds: ["cat_electronics"],
    tags: ["gaming", "handheld", "valve", "steam", "pc"],
    rating: 4.7,
    reviewCount: 678,
    specs: [
      { key: "Display", value: '7.4" HDR OLED 90Hz' },
      { key: "APU", value: "AMD APU (Zen 2 + RDNA 2)" },
      { key: "RAM", value: "16GB LPDDR5" },
      { key: "Storage", value: "512GB / 1TB NVMe" },
      { key: "Battery", value: "50Wh (3-12 hours)" },
      { key: "WiFi", value: "Wi-Fi 6E" },
    ],
    variants: [
      {
        id: "var_steamdeck_512",
        sku: "STEAMDECK-OLED-512",
        name: "512GB",
        price: 549,
        inventory: 20,
      },
      {
        id: "var_steamdeck_1tb",
        sku: "STEAMDECK-OLED-1TB",
        name: "1TB Limited Edition",
        price: 649,
        inventory: 20,
      },
    ],
    isActive: true,
    isFeatured: true,
    weight: 669,
    createdAt: daysAgo(100),
    updatedAt: daysAgo(8),
  },
  {
    id: "prod_razer_blackwidow",
    name: "Razer BlackWidow V4 Pro",
    slug: "razer-blackwidow-v4-pro",
    description:
      "Command the battlefield. The BlackWidow V4 Pro features Razer's legendary mechanical switches, a command dial, 8 dedicated macro keys, and per-key RGB lighting with underglow.",
    shortDescription:
      "Razer Green switches. Command dial. 8 macro keys. Per-key RGB.",
    price: 229,
    compareAtPrice: 249,
    images: [
      {
        url: "https://images.unsplash.com/photo-1595225476474-87563907a46?w=1200&q=80",
        alt: "BlackWidow V4 Pro - Black",
        isPrimary: true,
      },
    ],
    inventory: 65,
    categoryId: "cat_accessories",
    categoryIds: ["cat_accessories", "cat_electronics"],
    tags: ["keyboard", "razer", "gaming", "mechanical", "rgb"],
    rating: 4.5,
    reviewCount: 445,
    specs: [
      { key: "Switches", value: "Razer Green (tactile & clicky)" },
      { key: "Keycaps", value: "Doubleshot ABS" },
      { key: "Lighting", value: "Per-key Razer Chroma RGB" },
      { key: "Macro Keys", value: "8 dedicated + 4 media keys" },
      { key: "Wrist Rest", value: "Magnetic plush leatherette" },
      { key: "Passthrough", value: "USB 3.0 + 3.5mm audio" },
    ],
    isActive: true,
    isFeatured: false,
    weight: 1700,
    createdAt: daysAgo(200),
    updatedAt: daysAgo(25),
  },
  {
    id: "prod_elgato_stream_deck",
    name: "Elgato Stream Deck MK.2",
    slug: "elgato-stream-deck-mk2",
    description:
      "Your content creation companion. 15 LCD keys poised to launch unlimited actions. Trigger sound effects, switch scenes, and control your entire stream with a tap.",
    shortDescription:
      "15 LCD keys. Unlimited actions. Stream control. Customizable.",
    price: 149,
    images: [
      {
        url: "https://images.unsplash.com/photo-1625805866449-3589fe3f71a3?w=1200&q=80",
        alt: "Stream Deck MK.2 - Black",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=1200&q=80",
        alt: "Stream Deck MK.2 - White",
      },
    ],
    inventory: 110,
    categoryId: "cat_accessories",
    categoryIds: ["cat_accessories", "cat_electronics"],
    tags: ["stream-deck", "elgato", "streaming", "content-creation"],
    rating: 4.8,
    reviewCount: 3122,
    specs: [
      { key: "Keys", value: "15 LCD keys" },
      { key: "Resolution", value: "72 x 72 pixels per key" },
      { key: "Connection", value: "Detachable USB-C" },
      { key: "Stand", value: "Adjustable angle" },
    ],
    variants: [
      {
        id: "var_streamdeck_black",
        sku: "STREAMDECK-MK2-BLACK",
        name: "Black",
        color: "Black",
        price: 149,
        inventory: 55,
      },
      {
        id: "var_streamdeck_white",
        sku: "STREAMDECK-MK2-WHITE",
        name: "White",
        color: "White",
        price: 149,
        inventory: 55,
      },
    ],
    isActive: true,
    isFeatured: false,
    weight: 145,
    createdAt: daysAgo(300),
    updatedAt: daysAgo(20),
  },
];

// =============================================================================
// USERS (3 mock users with addresses)
// =============================================================================

export const mockAddresses: Address[] = [
  {
    id: "addr_1",
    userId: "user_1",
    type: "both",
    label: "Home",
    firstName: "John",
    lastName: "Doe",
    name: "John Doe",
    street: "123 Main Street",
    street2: "Apt 4B",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "US",
    phone: "+1-555-123-4567",
    isDefault: true,
    instructions: "Leave with doorman",
    createdAt: daysAgo(365),
    updatedAt: daysAgo(30),
  },
  {
    id: "addr_2",
    userId: "user_1",
    type: "shipping",
    label: "Office",
    firstName: "John",
    lastName: "Doe",
    name: "John Doe",
    street: "456 Business Ave",
    street2: "Floor 12",
    city: "New York",
    state: "NY",
    zip: "10005",
    country: "US",
    phone: "+1-555-987-6543",
    isDefault: false,
    createdAt: daysAgo(300),
    updatedAt: daysAgo(300),
  },
  {
    id: "addr_3",
    userId: "user_2",
    type: "both",
    label: "Home",
    firstName: "Jane",
    lastName: "Smith",
    name: "Jane Smith",
    street: "789 Oak Lane",
    city: "Los Angeles",
    state: "CA",
    zip: "90210",
    country: "US",
    phone: "+1-555-234-5678",
    isDefault: true,
    createdAt: daysAgo(400),
    updatedAt: daysAgo(50),
  },
  {
    id: "addr_4",
    userId: "user_3",
    type: "both",
    label: "Home",
    firstName: "Alex",
    lastName: "Johnson",
    name: "Alex Johnson",
    street: "321 Pine Road",
    city: "Chicago",
    state: "IL",
    zip: "60601",
    country: "US",
    phone: "+1-555-345-6789",
    isDefault: true,
    createdAt: daysAgo(200),
    updatedAt: daysAgo(200),
  },
];

export const mockUsers: User[] = [
  {
    id: "user_1",
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe",
    phone: "+1-555-123-4567",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    role: "customer",
    emailVerified: true,
    isActive: true,
    preferences: {
      newsletter: true,
      promotions: true,
      smsNotifications: false,
    },
    createdAt: daysAgo(365),
    updatedAt: daysAgo(30),
    lastLoginAt: daysAgo(2),
  },
  {
    id: "user_2",
    email: "jane.smith@example.com",
    firstName: "Jane",
    lastName: "Smith",
    fullName: "Jane Smith",
    phone: "+1-555-234-5678",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    role: "customer",
    emailVerified: true,
    isActive: true,
    preferences: {
      newsletter: true,
      promotions: false,
      smsNotifications: true,
    },
    createdAt: daysAgo(400),
    updatedAt: daysAgo(50),
    lastLoginAt: daysAgo(5),
  },
  {
    id: "user_3",
    email: "alex.johnson@example.com",
    firstName: "Alex",
    lastName: "Johnson",
    fullName: "Alex Johnson",
    phone: "+1-555-345-6789",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    role: "customer",
    emailVerified: true,
    isActive: true,
    preferences: {
      newsletter: false,
      promotions: true,
      smsNotifications: false,
    },
    createdAt: daysAgo(200),
    updatedAt: daysAgo(200),
    lastLoginAt: daysAgo(1),
  },
];

// =============================================================================
// REVIEWS (50+ reviews distributed across products)
// =============================================================================

export const mockReviews: Review[] = [
  // MacBook Pro 16 reviews
  {
    id: "rev_1",
    productId: "prod_macbook_pro_16",
    userId: "user_1",
    user: {
      id: "user_1",
      firstName: "John",
      lastName: "Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    rating: 5,
    title: "Absolutely incredible machine",
    content:
      "The M3 Max chip is a game changer. I can edit 8K video without breaking a sweat. The battery life is honestly mind-blowing - I went two full work days without charging. The Space Black finish is stunning and doesn't show fingerprints like the old space gray.",
    isVerifiedPurchase: true,
    helpful: 45,
    isHelpful: false,
    createdAt: daysAgo(30),
    updatedAt: daysAgo(30),
  },
  {
    id: "rev_2",
    productId: "prod_macbook_pro_16",
    userId: "user_2",
    user: {
      id: "user_2",
      firstName: "Jane",
      lastName: "Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    },
    rating: 5,
    title: "Worth every penny",
    content:
      "As a software developer, this laptop has transformed my workflow. Compilation times are cut in half compared to my old Intel Mac. The display is the best I've ever used on a laptop.",
    isVerifiedPurchase: true,
    helpful: 32,
    createdAt: daysAgo(45),
    updatedAt: daysAgo(45),
  },
  {
    id: "rev_3",
    productId: "prod_macbook_pro_16",
    userId: "user_3",
    user: {
      id: "user_3",
      firstName: "Alex",
      lastName: "Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    },
    rating: 4,
    title: "Great but expensive",
    content:
      "Amazing performance and build quality. My only complaint is the price - it's really steep. But if you need the power, it's worth it.",
    isVerifiedPurchase: true,
    helpful: 18,
    createdAt: daysAgo(60),
    updatedAt: daysAgo(60),
  },

  // iPhone 15 Pro reviews
  {
    id: "rev_4",
    productId: "prod_iphone_15_pro",
    userId: "user_2",
    user: {
      id: "user_2",
      firstName: "Jane",
      lastName: "Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    },
    rating: 5,
    title: "Best iPhone ever made",
    content:
      "The titanium build feels premium and much lighter than my 14 Pro. The camera improvements are noticeable, especially in low light. USB-C is a welcome addition!",
    isVerifiedPurchase: true,
    helpful: 67,
    createdAt: daysAgo(20),
    updatedAt: daysAgo(20),
  },
  {
    id: "rev_5",
    productId: "prod_iphone_15_pro",
    userId: "user_1",
    user: {
      id: "user_1",
      firstName: "John",
      lastName: "Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    rating: 5,
    title: "Love the action button",
    content:
      "I set the action button to open my camera and it's so convenient. The Natural Titanium color is gorgeous in person. Performance is snappy as expected.",
    isVerifiedPurchase: true,
    helpful: 42,
    createdAt: daysAgo(35),
    updatedAt: daysAgo(35),
  },
  {
    id: "rev_6",
    productId: "prod_iphone_15_pro",
    userId: "user_3",
    user: {
      id: "user_3",
      firstName: "Alex",
      lastName: "Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    },
    rating: 3,
    title: "Good but overheating issues",
    content:
      "Phone is great overall but gets warm during intensive tasks and charging. Hopefully fixed in software updates.",
    isVerifiedPurchase: true,
    helpful: 89,
    createdAt: daysAgo(40),
    updatedAt: daysAgo(40),
  },

  // AirPods Pro 2 reviews
  {
    id: "rev_7",
    productId: "prod_airpods_pro_2",
    userId: "user_1",
    user: {
      id: "user_1",
      firstName: "John",
      lastName: "Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    rating: 5,
    title: "The noise cancellation is magic",
    content:
      "I put these on during my commute and the world disappears. The sound quality improvement over the first gen is noticeable. Transparency mode sounds incredibly natural.",
    isVerifiedPurchase: true,
    helpful: 156,
    createdAt: daysAgo(50),
    updatedAt: daysAgo(50),
  },
  {
    id: "rev_8",
    productId: "prod_airpods_pro_2",
    userId: "user_2",
    user: {
      id: "user_2",
      firstName: "Jane",
      lastName: "Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    },
    rating: 5,
    title: "Perfect for workouts",
    content:
      "They stay secure during my runs and the sweat resistance gives me peace of mind. Battery life easily gets me through a week of workouts.",
    isVerifiedPurchase: true,
    helpful: 78,
    createdAt: daysAgo(70),
    updatedAt: daysAgo(70),
  },
  {
    id: "rev_9",
    productId: "prod_airpods_pro_2",
    userId: "user_3",
    user: {
      id: "user_3",
      firstName: "Alex",
      lastName: "Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    },
    rating: 4,
    title: "Great but case scratches easily",
    content:
      "Audio quality and features are top notch. My only gripe is the case scratches very easily. Get a case for your case!",
    isVerifiedPurchase: true,
    helpful: 34,
    createdAt: daysAgo(85),
    updatedAt: daysAgo(85),
  },

  // Additional reviews for various products
  {
    id: "rev_10",
    productId: "prod_macbook_pro_16",
    userId: "user_2",
    user: {
      id: "user_2",
      firstName: "Sarah",
      lastName: "Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    rating: 5,
    title: "Video editor's dream",
    content:
      "I edit 4K footage daily and this laptop handles everything I throw at it. The screen is color accurate out of the box too.",
    isVerifiedPurchase: true,
    helpful: 28,
    createdAt: daysAgo(55),
    updatedAt: daysAgo(55),
  },
  {
    id: "rev_11",
    productId: "prod_sony_wh1000xm5",
    userId: "user_1",
    user: {
      id: "user_1",
      firstName: "Mike",
      lastName: "Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    },
    rating: 5,
    title: "Best headphones I've owned",
    content:
      "The noise cancellation is absolutely incredible. I use these on planes and can't hear the engine at all. Comfort is excellent for long sessions.",
    isVerifiedPurchase: true,
    helpful: 92,
    createdAt: daysAgo(40),
    updatedAt: daysAgo(40),
  },
  {
    id: "rev_12",
    productId: "prod_sony_wh1000xm5",
    userId: "user_3",
    user: {
      id: "user_3",
      firstName: "Emma",
      lastName: "Davis",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    },
    rating: 4,
    title: "Great sound, foldable design missing",
    content:
      "Sound quality and ANC are amazing but I miss the foldable design from the XM4s. Takes up more space in my bag now.",
    isVerifiedPurchase: true,
    helpful: 45,
    createdAt: daysAgo(60),
    updatedAt: daysAgo(60),
  },
  {
    id: "rev_13",
    productId: "prod_logitech_mx_master_3s",
    userId: "user_1",
    user: {
      id: "user_1",
      firstName: "David",
      lastName: "Lee",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    },
    rating: 5,
    title: "Worth the upgrade",
    content:
      "Upgraded from the MX Master 2S. The quiet clicks are a game changer for shared workspaces. The 8K DPI makes a noticeable difference on 4K monitors.",
    isVerifiedPurchase: true,
    helpful: 67,
    createdAt: daysAgo(25),
    updatedAt: daysAgo(25),
  },
  {
    id: "rev_14",
    productId: "prod_logitech_mx_master_3s",
    userId: "user_2",
    user: {
      id: "user_2",
      firstName: "Lisa",
      lastName: "Park",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    },
    rating: 5,
    title: "The scroll wheel is addictive",
    content:
      "Once you use the MagSpeed wheel, you can't go back. The gesture button is super handy too. Battery life is incredible.",
    isVerifiedPurchase: true,
    helpful: 43,
    createdAt: daysAgo(35),
    updatedAt: daysAgo(35),
  },
  {
    id: "rev_15",
    productId: "prod_apple_watch_ultra_2",
    userId: "user_3",
    user: {
      id: "user_3",
      firstName: "Tom",
      lastName: "Brown",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
    },
    rating: 5,
    title: "Perfect for outdoor adventures",
    content:
      "Took this on a week-long hiking trip. Never had to charge it once. The dual-frequency GPS is incredibly accurate on trails.",
    isVerifiedPurchase: true,
    helpful: 56,
    createdAt: daysAgo(15),
    updatedAt: daysAgo(15),
  },
  {
    id: "rev_16",
    productId: "prod_apple_watch_ultra_2",
    userId: "user_1",
    user: {
      id: "user_1",
      firstName: "Amy",
      lastName: "Taylor",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amy",
    },
    rating: 4,
    title: "Excellent but bulky",
    content:
      "Amazing features and battery life but it's definitely larger than the regular Apple Watch. Sleep tracking can be uncomfortable.",
    isVerifiedPurchase: true,
    helpful: 38,
    createdAt: daysAgo(30),
    updatedAt: daysAgo(30),
  },
  {
    id: "rev_17",
    productId: "prod_samsung_s24_ultra",
    userId: "user_2",
    user: {
      id: "user_2",
      firstName: "Kevin",
      lastName: "Kim",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin",
    },
    rating: 5,
    title: "Galaxy AI is impressive",
    content:
      "The live translate feature during calls actually works! Camera is phenomenal, especially the 10x zoom. S Pen is handy for notes.",
    isVerifiedPurchase: true,
    helpful: 84,
    createdAt: daysAgo(10),
    updatedAt: daysAgo(10),
  },
  {
    id: "rev_18",
    productId: "prod_samsung_s24_ultra",
    userId: "user_3",
    user: {
      id: "user_3",
      firstName: "Rachel",
      lastName: "Garcia",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel",
    },
    rating: 4,
    title: "Great phone, high price",
    content:
      "Everything about this phone is excellent but the price is hard to justify. The AI features are nice but not essential.",
    isVerifiedPurchase: true,
    helpful: 52,
    createdAt: daysAgo(20),
    updatedAt: daysAgo(20),
  },
  {
    id: "rev_19",
    productId: "prod_dell_xps_15",
    userId: "user_1",
    user: {
      id: "user_1",
      firstName: "Chris",
      lastName: "Martinez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris",
    },
    rating: 4,
    title: "OLED screen is gorgeous",
    content:
      "The display is absolutely stunning. Great for photo editing. Gets warm under heavy load but performance is solid.",
    isVerifiedPurchase: true,
    helpful: 29,
    createdAt: daysAgo(45),
    updatedAt: daysAgo(45),
  },
  {
    id: "rev_20",
    productId: "prod_bose_qc_ultra",
    userId: "user_2",
    user: {
      id: "user_2",
      firstName: "Nicole",
      lastName: "Anderson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nicole",
    },
    rating: 5,
    title: "CustomTune is revolutionary",
    content:
      "The personalized sound profile makes such a difference. Immersive Audio is great for movies. Most comfortable headphones I've worn.",
    isVerifiedPurchase: true,
    helpful: 41,
    createdAt: daysAgo(25),
    updatedAt: daysAgo(25),
  },
  // Add more reviews to reach 50+
  ...Array.from({ length: 35 }, (_, i) => ({
    id: `rev_gen_${i + 21}`,
    productId: mockProducts[i % mockProducts.length].id,
    userId: `user_${(i % 3) + 1}`,
    user: {
      id: `user_${(i % 3) + 1}`,
      firstName: ["John", "Jane", "Alex"][i % 3],
      lastName: ["Doe", "Smith", "Johnson"][i % 3],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`,
    },
    rating: [5, 4, 5, 4, 3][i % 5],
    title: [
      "Great product!",
      "Very satisfied",
      "Good value",
      "Works as expected",
      "Happy with purchase",
    ][i % 5],
    content: [
      "Exceeded my expectations. Would recommend to others.",
      "Quality is excellent. Fast shipping too.",
      "Solid product for the price point.",
      "Does exactly what it says on the tin.",
      "Very happy with this purchase overall.",
    ][i % 5],
    isVerifiedPurchase: i % 3 !== 0,
    helpful: Math.floor(Math.random() * 50),
    createdAt: daysAgo(Math.floor(Math.random() * 90)),
    updatedAt: daysAgo(Math.floor(Math.random() * 90)),
  })),
];

// =============================================================================
// ORDERS (5 sample orders with various statuses)
// =============================================================================

export const mockOrders: Order[] = [
  {
    id: "ord_1",
    userId: "user_1",
    orderNumber: "ORD-2024-001",
    items: [
      {
        id: "oi_1",
        productId: "prod_macbook_pro_16",
        variantId: "var_mb16_space_black_512",
        name: "MacBook Pro 16",
        slug: "macbook-pro-16",
        sku: "MBP16-M3P-512-SB",
        image: mockProducts[0].images[0],
        price: 2499,
        quantity: 1,
        total: 2499,
        variantName: "Space Black - 512GB",
        isReturnable: true,
        returnStatus: "not_returned",
      },
      {
        id: "oi_2",
        productId: "prod_magic_keyboard",
        name: "Apple Magic Keyboard",
        slug: "apple-magic-keyboard",
        sku: "MK-SILVER",
        image: mockProducts[8].images[0],
        price: 99,
        quantity: 1,
        total: 99,
        variantName: "Silver",
        isReturnable: true,
        returnStatus: "not_returned",
      },
    ],
    status: "delivered",
    paymentStatus: "completed",
    shippingAddress: mockAddresses[0],
    billingAddress: mockAddresses[0],
    payment: {
      type: "card",
      last4: "4242",
      brand: "visa",
      expiryMonth: 12,
      expiryYear: 2027,
      transactionId: "txn_123456",
    },
    totals: {
      subtotal: 2598,
      discount: 0,
      shipping: 0,
      tax: 207.84,
      total: 2805.84,
      currency: "USD",
    },
    carrier: "UPS",
    trackingNumber: "1Z999AA10123456784",
    estimatedDelivery: daysAgo(-5),
    deliveredAt: daysAgo(5),
    currency: "USD",
    createdAt: daysAgo(15),
    updatedAt: daysAgo(5),
  },
  {
    id: "ord_2",
    userId: "user_1",
    orderNumber: "ORD-2024-002",
    items: [
      {
        id: "oi_3",
        productId: "prod_airpods_pro_2",
        name: "AirPods Pro (2nd Generation)",
        slug: "airpods-pro-2nd-generation",
        sku: "APPRO2-2023",
        image: mockProducts[15].images[0],
        price: 249,
        quantity: 1,
        total: 249,
        isReturnable: true,
        returnStatus: "not_returned",
      },
      {
        id: "oi_4",
        productId: "prod_native_union_cable",
        name: "Native Union Belt Cable Pro",
        slug: "native-union-belt-cable-pro",
        sku: "NU-BELT-ZEBRA",
        image: mockProducts[13].images[0],
        price: 34,
        quantity: 2,
        total: 68,
        variantName: "Zebra",
        isReturnable: true,
        returnStatus: "not_returned",
      },
    ],
    status: "shipped",
    paymentStatus: "completed",
    shippingAddress: mockAddresses[0],
    billingAddress: mockAddresses[0],
    payment: {
      type: "card",
      last4: "4242",
      brand: "visa",
      expiryMonth: 12,
      expiryYear: 2027,
      transactionId: "txn_789012",
    },
    totals: {
      subtotal: 317,
      discount: 10,
      shipping: 5.99,
      tax: 24.96,
      total: 337.95,
      currency: "USD",
    },
    carrier: "FedEx",
    trackingNumber: "123456789012",
    estimatedDelivery: daysAgo(-2),
    currency: "USD",
    createdAt: daysAgo(5),
    updatedAt: daysAgo(2),
  },
  {
    id: "ord_3",
    userId: "user_1",
    orderNumber: "ORD-2024-003",
    items: [
      {
        id: "oi_5",
        productId: "prod_iphone_15_pro",
        variantId: "var_ip15p_natural_256",
        name: "iPhone 15 Pro",
        slug: "iphone-15-pro",
        sku: "IP15P-NT-256",
        image: mockProducts[4].images[0],
        price: 1099,
        quantity: 1,
        total: 1099,
        variantName: "Natural Titanium - 256GB",
        isReturnable: true,
        returnStatus: "not_returned",
      },
    ],
    status: "processing",
    paymentStatus: "completed",
    shippingAddress: mockAddresses[1],
    billingAddress: mockAddresses[0],
    payment: {
      type: "card",
      last4: "1234",
      brand: "mastercard",
      expiryMonth: 8,
      expiryYear: 2026,
      transactionId: "txn_345678",
    },
    totals: {
      subtotal: 1099,
      discount: 0,
      shipping: 0,
      tax: 87.92,
      total: 1186.92,
      currency: "USD",
    },
    estimatedDelivery: daysAgo(-3),
    currency: "USD",
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
  },
  {
    id: "ord_4",
    userId: "user_2",
    orderNumber: "ORD-2024-004",
    items: [
      {
        id: "oi_6",
        productId: "prod_sony_wh1000xm5",
        variantId: "var_sonyxm5_black",
        name: "Sony WH-1000XM5",
        slug: "sony-wh-1000xm5",
        sku: "SONY-XM5-BLACK",
        image: mockProducts[16].images[0],
        price: 399,
        quantity: 1,
        total: 399,
        variantName: "Black",
        isReturnable: true,
        returnStatus: "not_returned",
      },
      {
        id: "oi_7",
        productId: "prod_anker_737_charger",
        name: "Anker 737 GaNPrime 120W Charger",
        slug: "anker-737-ganprime-charger",
        sku: "ANKER-737-120W",
        image: mockProducts[10].images[0],
        price: 89,
        quantity: 1,
        total: 89,
        isReturnable: true,
        returnStatus: "not_returned",
      },
    ],
    status: "pending",
    paymentStatus: "pending",
    shippingAddress: mockAddresses[2],
    billingAddress: mockAddresses[2],
    payment: {
      type: "card",
      last4: "5678",
      brand: "amex",
      expiryMonth: 3,
      expiryYear: 2028,
    },
    totals: {
      subtotal: 488,
      discount: 20,
      shipping: 0,
      tax: 37.44,
      total: 505.44,
      currency: "USD",
    },
    currency: "USD",
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: "ord_5",
    userId: "user_3",
    orderNumber: "ORD-2024-005",
    items: [
      {
        id: "oi_8",
        productId: "prod_steam_deck_oled",
        variantId: "var_steamdeck_1tb",
        name: "Steam Deck OLED",
        slug: "steam-deck-oled",
        sku: "STEAMDECK-OLED-1TB",
        image: mockProducts[21].images[0],
        price: 649,
        quantity: 1,
        total: 649,
        variantName: "1TB Limited Edition",
        isReturnable: true,
        returnStatus: "not_returned",
      },
      {
        id: "oi_9",
        productId: "prod_satechi_hub",
        variantId: "var_satechi_gray",
        name: "Satechi USB-C Multiport Adapter",
        slug: "satechi-usb-c-multiport-adapter",
        sku: "SATECHI-HUB-GRAY",
        image: mockProducts[11].images[0],
        price: 79,
        quantity: 1,
        total: 79,
        variantName: "Space Gray",
        isReturnable: true,
        returnStatus: "not_returned",
      },
    ],
    status: "cancelled",
    paymentStatus: "refunded",
    shippingAddress: mockAddresses[3],
    billingAddress: mockAddresses[3],
    payment: {
      type: "paypal",
      accountEmail: "alex.j@example.com",
      transactionId: "txn_paypal_123",
    },
    totals: {
      subtotal: 728,
      discount: 0,
      shipping: 0,
      tax: 58.24,
      total: 786.24,
      currency: "USD",
    },
    currency: "USD",
    notes: "Customer requested cancellation",
    createdAt: daysAgo(10),
    updatedAt: daysAgo(8),
  },
];

// =============================================================================
// HELPER FUNCTIONS FOR MOCK DATA
// =============================================================================

/**
 * Get user profile with addresses and order summary
 */
export const getUserProfile = (userId: string): UserProfile | undefined => {
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) return undefined;

  const addresses = mockAddresses.filter((a) => a.userId === userId);
  return {
    ...user,
    addresses,
    defaultShippingAddress: addresses.find(
      (a) => a.isDefault && (a.type === "shipping" || a.type === "both")
    ),
    defaultBillingAddress: addresses.find(
      (a) => a.isDefault && (a.type === "billing" || a.type === "both")
    ),
    orderSummary: {
      totalOrders: mockOrders.filter((o) => o.userId === userId).length,
      totalSpent: mockOrders
        .filter((o) => o.userId === userId && o.status !== "cancelled")
        .reduce((sum, o) => sum + o.totals.total, 0),
    },
  };
};

/**
 * Get reviews for a product
 */
export const getProductReviews = (productId: string): Review[] => {
  return mockReviews.filter((r) => r.productId === productId);
};

/**
 * Get related products (same category, excluding current)
 */
export const getRelatedProducts = (productId: string, limit = 4): Product[] => {
  const product = mockProducts.find((p) => p.id === productId);
  if (!product) return [];

  return mockProducts
    .filter(
      (p) =>
        p.id !== productId &&
        (p.categoryId === product.categoryId ||
          p.categoryIds?.some((id) => product.categoryIds?.includes(id)))
    )
    .slice(0, limit);
};

/**
 * Search products by query
 */
export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.description.toLowerCase().includes(lowercaseQuery) ||
      p.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  );
};

/**
 * Get category by slug
 */
export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categoriesWithHierarchy.find((c) => c.slug === slug);
};

/**
 * Get product by slug
 */
export const getProductBySlug = (slug: string): Product | undefined => {
  return mockProducts.find((p) => p.slug === slug);
};

/**
 * Get products by category
 */
export const getProductsByCategory = (categoryId: string): Product[] => {
  return mockProducts.filter(
    (p) => p.categoryId === categoryId || p.categoryIds?.includes(categoryId)
  );
};
