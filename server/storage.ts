import { db } from "./db";
import {
  users,
  products,
  orders,
  orderItems,
  reviews,
  wishlists,
  browseHistory,
  categories,
  type User,
  type InsertUser,
  type Product,
  type InsertProduct,
  type Order,
  type CreateOrderRequest,
  type Review,
  type InsertReview,
  type Category,
  type PaginatedResponse,
  type ReviewWithUser,
} from "@shared/schema";
import { eq, like, and, gte, lte, desc, asc, sql, count } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;

  // Products
  getProducts(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: 'price_asc' | 'price_desc' | 'rating_desc' | 'newest';
    sellerId?: number;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Product>>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<void>;
  getFeaturedProducts(): Promise<Product[]>;
  getDealsProducts(): Promise<Product[]>;
  getSellerProducts(sellerId: number): Promise<Product[]>;

  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(name: string, slug: string, image?: string): Promise<Category>;

  // Reviews
  getProductReviews(productId: number): Promise<ReviewWithUser[]>;
  createReview(userId: number, review: InsertReview): Promise<Review>;

  // Wishlist
  getWishlist(userId: number): Promise<Product[]>;
  addToWishlist(userId: number, productId: number): Promise<void>;
  removeFromWishlist(userId: number, productId: number): Promise<void>;
  isInWishlist(userId: number, productId: number): Promise<boolean>;

  // History
  getBrowseHistory(userId: number): Promise<Product[]>;
  addToHistory(userId: number, productId: number): Promise<void>;

  // Orders
  createOrder(userId: number, orderData: CreateOrderRequest): Promise<Order>;
  getOrders(userId: number): Promise<(Order & { items: any[] })[]>;
  getAllOrders(): Promise<(Order & { items: any[]; user?: User })[]>;
  getSellerOrders(sellerId: number): Promise<any[]>;
  updateOrderStatus(orderId: number, status: string): Promise<Order | undefined>;

  // Stats
  getAdminStats(): Promise<{ totalUsers: number; totalProducts: number; totalOrders: number; totalRevenue: number }>;
  getSellerStats(sellerId: number): Promise<{ totalProducts: number; totalOrders: number; totalRevenue: number }>;

  // Session
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Products
  async getProducts(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: 'price_asc' | 'price_desc' | 'rating_desc' | 'newest';
    sellerId?: number;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Product>> {
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 12;
    const offset = (page - 1) * pageSize;

    const conditions = [eq(products.isActive, true)];

    if (filters?.category) {
      conditions.push(eq(products.category, filters.category));
    }
    if (filters?.minPrice !== undefined) {
      conditions.push(gte(products.price, filters.minPrice.toString()));
    }
    if (filters?.maxPrice !== undefined) {
      conditions.push(lte(products.price, filters.maxPrice.toString()));
    }
    if (filters?.search) {
      conditions.push(like(products.name, `%${filters.search}%`));
    }
    if (filters?.sellerId) {
      conditions.push(eq(products.sellerId, filters.sellerId));
    }

    // Get total count
    const [{ count: totalCount }] = await db
      .select({ count: count() })
      .from(products)
      .where(and(...conditions));

    // Build query with sorting
    let query = db.select().from(products).where(and(...conditions)).$dynamic();

    if (filters?.sort) {
      switch (filters.sort) {
        case 'price_asc':
          query = query.orderBy(asc(products.price));
          break;
        case 'price_desc':
          query = query.orderBy(desc(products.price));
          break;
        case 'rating_desc':
          query = query.orderBy(desc(products.rating));
          break;
        case 'newest':
          query = query.orderBy(desc(products.createdAt));
          break;
      }
    }

    const items = await query.limit(pageSize).offset(offset);

    return {
      items,
      total: Number(totalCount),
      page,
      pageSize,
      totalPages: Math.ceil(Number(totalCount) / pageSize),
    };
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db.update(products).set(updates).where(eq(products.id, id)).returning();
    return updated;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.update(products).set({ isActive: false }).where(eq(products.id, id));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products)
      .where(eq(products.isActive, true))
      .orderBy(desc(products.rating))
      .limit(8);
  }

  async getDealsProducts(): Promise<Product[]> {
    return await db.select().from(products)
      .where(and(eq(products.isActive, true), sql`${products.originalPrice} IS NOT NULL`))
      .limit(6);
  }

  async getSellerProducts(sellerId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.sellerId, sellerId));
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async createCategory(name: string, slug: string, image?: string): Promise<Category> {
    const [cat] = await db.insert(categories).values({ name, slug, image }).returning();
    return cat;
  }

  // Reviews
  async getProductReviews(productId: number): Promise<ReviewWithUser[]> {
    const result = await db
      .select({
        id: reviews.id,
        productId: reviews.productId,
        userId: reviews.userId,
        rating: reviews.rating,
        title: reviews.title,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        user: {
          id: users.id,
          name: users.name,
          username: users.username,
        },
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt));

    return result as ReviewWithUser[];
  }

  async createReview(userId: number, review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values({ ...review, userId }).returning();

    // Update product rating
    const productReviews = await db.select().from(reviews).where(eq(reviews.productId, review.productId));
    const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    await db.update(products).set({
      rating: avgRating.toFixed(1),
      reviewCount: productReviews.length,
    }).where(eq(products.id, review.productId));

    return newReview;
  }

  // Wishlist
  async getWishlist(userId: number): Promise<Product[]> {
    const result = await db
      .select({ product: products })
      .from(wishlists)
      .innerJoin(products, eq(wishlists.productId, products.id))
      .where(eq(wishlists.userId, userId));
    return result.map(r => r.product);
  }

  async addToWishlist(userId: number, productId: number): Promise<void> {
    await db.insert(wishlists).values({ userId, productId }).onConflictDoNothing();
  }

  async removeFromWishlist(userId: number, productId: number): Promise<void> {
    await db.delete(wishlists).where(and(eq(wishlists.userId, userId), eq(wishlists.productId, productId)));
  }

  async isInWishlist(userId: number, productId: number): Promise<boolean> {
    const [item] = await db.select().from(wishlists)
      .where(and(eq(wishlists.userId, userId), eq(wishlists.productId, productId)));
    return !!item;
  }

  // History
  async getBrowseHistory(userId: number): Promise<Product[]> {
    const result = await db
      .select({ product: products })
      .from(browseHistory)
      .innerJoin(products, eq(browseHistory.productId, products.id))
      .where(eq(browseHistory.userId, userId))
      .orderBy(desc(browseHistory.viewedAt))
      .limit(20);
    return result.map(r => r.product);
  }

  async addToHistory(userId: number, productId: number): Promise<void> {
    // Remove existing entry and add new one to update timestamp
    await db.delete(browseHistory).where(and(eq(browseHistory.userId, userId), eq(browseHistory.productId, productId)));
    await db.insert(browseHistory).values({ userId, productId });
  }

  // Orders
  async createOrder(userId: number, orderData: CreateOrderRequest): Promise<Order> {
    let total = 0;
    const itemsWithPrice = [];

    for (const item of orderData.items) {
      const product = await this.getProduct(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      const price = Number(product.price);
      total += price * item.quantity;
      itemsWithPrice.push({ ...item, price: price.toString() });
    }

    const [newOrder] = await db.insert(orders).values({
      userId,
      total: total.toString(),
      status: "pending",
      address: orderData.address,
    }).returning();

    for (const item of itemsWithPrice) {
      await db.insert(orderItems).values({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
    }

    return newOrder;
  }

  async getOrders(userId: number): Promise<(Order & { items: any[] })[]> {
    const userOrders = await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
    return await this.enrichOrdersWithItems(userOrders);
  }

  async getAllOrders(): Promise<(Order & { items: any[]; user?: User })[]> {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    const enriched = await this.enrichOrdersWithItems(allOrders);

    // Add user info
    for (const order of enriched) {
      if (order.userId) {
        const user = await this.getUser(order.userId);
        (order as any).user = user;
      }
    }
    return enriched;
  }

  async getSellerOrders(sellerId: number): Promise<any[]> {
    // Get orders that contain products from this seller
    const sellerProductIds = (await this.getSellerProducts(sellerId)).map(p => p.id);
    if (sellerProductIds.length === 0) return [];

    const items = await db.select().from(orderItems)
      .where(sql`${orderItems.productId} = ANY(${sellerProductIds})`);

    const orderIds = [...new Set(items.map(i => i.orderId))];
    const relevantOrders = await db.select().from(orders)
      .where(sql`${orders.id} = ANY(${orderIds})`)
      .orderBy(desc(orders.createdAt));

    return await this.enrichOrdersWithItems(relevantOrders);
  }

  async updateOrderStatus(orderId: number, status: string): Promise<Order | undefined> {
    const [updated] = await db.update(orders).set({ status }).where(eq(orders.id, orderId)).returning();
    return updated;
  }

  private async enrichOrdersWithItems(ordersList: Order[]): Promise<(Order & { items: any[] })[]> {
    const result = [];
    for (const order of ordersList) {
      const items = await db.select({
        id: orderItems.id,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        price: orderItems.price,
        productName: products.name,
        productImage: products.image,
      })
        .from(orderItems)
        .leftJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, order.id));

      result.push({ ...order, items });
    }
    return result;
  }

  // Stats
  async getAdminStats(): Promise<{ totalUsers: number; totalProducts: number; totalOrders: number; totalRevenue: number }> {
    const [{ count: totalUsers }] = await db.select({ count: count() }).from(users);
    const [{ count: totalProducts }] = await db.select({ count: count() }).from(products);
    const [{ count: totalOrders }] = await db.select({ count: count() }).from(orders);
    const [{ sum: totalRevenue }] = await db.select({ sum: sql<string>`COALESCE(SUM(${orders.total}::numeric), 0)` }).from(orders);

    return {
      totalUsers: Number(totalUsers),
      totalProducts: Number(totalProducts),
      totalOrders: Number(totalOrders),
      totalRevenue: Number(totalRevenue) || 0,
    };
  }

  async getSellerStats(sellerId: number): Promise<{ totalProducts: number; totalOrders: number; totalRevenue: number }> {
    const sellerProducts = await this.getSellerProducts(sellerId);
    const sellerOrders = await this.getSellerOrders(sellerId);

    let totalRevenue = 0;
    for (const order of sellerOrders) {
      for (const item of order.items) {
        if (sellerProducts.some(p => p.id === item.productId)) {
          totalRevenue += Number(item.price) * item.quantity;
        }
      }
    }

    return {
      totalProducts: sellerProducts.length,
      totalOrders: sellerOrders.length,
      totalRevenue,
    };
  }
}

export const storage = new DatabaseStorage();
