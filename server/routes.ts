import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Middleware helpers
function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
  next();
}

function requireSeller(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
  if (req.user.role !== 'seller' && req.user.role !== 'admin') {
    return res.status(403).json({ message: "Seller access required" });
  }
  next();
}

function requireAdmin(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Session & Auth Setup
  app.use(
    session({
      store: storage.sessionStore,
      secret: process.env.SESSION_SECRET || "secret",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // === AUTH ROUTES ===
  app.post(api.auth.register.path, async (req, res, next) => {
    try {
      if (await storage.getUserByUsername(req.body.username)) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const hashedPassword = await hashPassword(req.body.password);
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword,
      });
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({ id: user.id, username: user.username, role: user.role });
      });
    } catch (err) {
      res.status(400).json({ message: "Registration failed" });
    }
  });

  app.post(api.auth.login.path, (req, res, next) => {
    passport.authenticate("local", (err: any, user: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
      req.login(user, (err) => {
        if (err) return next(err);
        res.json({ id: user.id, username: user.username, role: user.role });
      });
    })(req, res, next);
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.logout(() => res.status(200).send());
  });

  app.get(api.auth.me.path, (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const { password, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });

  // === PRODUCTS ROUTES ===
  app.get('/api/products/featured', async (req, res) => {
    const products = await storage.getFeaturedProducts();
    res.json(products);
  });

  app.get('/api/products/deals', async (req, res) => {
    const products = await storage.getDealsProducts();
    res.json(products);
  });

  app.get(api.products.list.path, async (req, res) => {
    const filters = req.query as any;
    const result = await storage.getProducts({
      category: filters.category,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      search: filters.search,
      sort: filters.sort,
      sellerId: filters.sellerId ? Number(filters.sellerId) : undefined,
      page: filters.page ? Number(filters.page) : 1,
      pageSize: filters.pageSize ? Number(filters.pageSize) : 12,
    });
    res.json(result);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Track history if user logged in
    if (req.isAuthenticated()) {
      await storage.addToHistory((req.user as any).id, product.id);
    }

    res.json(product);
  });

  app.post(api.products.create.path, requireSeller, async (req, res) => {
    try {
      const product = await storage.createProduct({
        ...req.body,
        sellerId: (req.user as any).id,
      });
      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ message: "Failed to create product" });
    }
  });

  app.put(api.products.update.path, requireSeller, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Only owner or admin can update
    const user = req.user as any;
    if (product.sellerId !== user.id && user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await storage.updateProduct(Number(req.params.id), req.body);
    res.json(updated);
  });

  app.delete(api.products.delete.path, requireSeller, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = req.user as any;
    if (product.sellerId !== user.id && user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized" });
    }

    await storage.deleteProduct(Number(req.params.id));
    res.status(204).send();
  });

  // === CATEGORIES ===
  app.get(api.categories.list.path, async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  // === REVIEWS ===
  app.get(api.reviews.list.path, async (req, res) => {
    const reviews = await storage.getProductReviews(Number(req.params.productId));
    res.json(reviews);
  });

  app.post(api.reviews.create.path, requireAuth, async (req, res) => {
    try {
      const review = await storage.createReview((req.user as any).id, {
        ...req.body,
        productId: Number(req.params.productId),
      });
      res.status(201).json(review);
    } catch (err) {
      res.status(400).json({ message: "Failed to create review" });
    }
  });

  // === WISHLIST ===
  app.get(api.wishlist.list.path, requireAuth, async (req, res) => {
    const items = await storage.getWishlist((req.user as any).id);
    res.json(items);
  });

  app.post(api.wishlist.add.path, requireAuth, async (req, res) => {
    await storage.addToWishlist((req.user as any).id, req.body.productId);
    res.status(201).json({ success: true });
  });

  app.delete(api.wishlist.remove.path, requireAuth, async (req, res) => {
    await storage.removeFromWishlist((req.user as any).id, Number(req.params.productId));
    res.status(204).send();
  });

  // === HISTORY ===
  app.get(api.history.list.path, requireAuth, async (req, res) => {
    const items = await storage.getBrowseHistory((req.user as any).id);
    res.json(items);
  });

  app.post(api.history.add.path, async (req, res) => {
    if (req.isAuthenticated()) {
      await storage.addToHistory((req.user as any).id, req.body.productId);
    }
    res.status(201).json({ success: true });
  });

  // === ORDERS ===
  app.post(api.orders.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.orders.create.input.parse(req.body);
      const order = await storage.createOrder((req.user as any).id, input);
      res.status(201).json(order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      } else {
        res.status(500).json({ message: "Order failed" });
      }
    }
  });

  app.get(api.orders.list.path, requireAuth, async (req, res) => {
    const orders = await storage.getOrders((req.user as any).id);
    res.json(orders);
  });

  app.patch(api.orders.updateStatus.path, requireSeller, async (req, res) => {
    const updated = await storage.updateOrderStatus(Number(req.params.id), req.body.status);
    if (!updated) return res.status(404).json({ message: "Order not found" });
    res.json(updated);
  });

  // === SELLER ROUTES ===
  app.get(api.seller.dashboard.path, requireSeller, async (req, res) => {
    const stats = await storage.getSellerStats((req.user as any).id);
    res.json(stats);
  });

  app.get(api.seller.products.path, requireSeller, async (req, res) => {
    const products = await storage.getSellerProducts((req.user as any).id);
    res.json(products);
  });

  app.get(api.seller.orders.path, requireSeller, async (req, res) => {
    const orders = await storage.getSellerOrders((req.user as any).id);
    res.json(orders);
  });

  // === ADMIN ROUTES ===
  app.get(api.admin.stats.path, requireAdmin, async (req, res) => {
    const stats = await storage.getAdminStats();
    res.json(stats);
  });

  app.get(api.admin.users.path, requireAdmin, async (req, res) => {
    const users = await storage.getUsers();
    res.json(users.map(({ password, ...u }) => u));
  });

  app.get(api.admin.allOrders.path, requireAdmin, async (req, res) => {
    const orders = await storage.getAllOrders();
    res.json(orders);
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingCategories = await storage.getCategories();
  if (existingCategories.length === 0) {
    console.log("Seeding categories...");
    await storage.createCategory("Electronics", "electronics", "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80");
    await storage.createCategory("Fashion", "fashion", "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80");
    await storage.createCategory("Furniture", "furniture", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80");
    await storage.createCategory("Sports", "sports", "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80");
    await storage.createCategory("Books", "books", "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80");
    await storage.createCategory("Home & Kitchen", "home-kitchen", "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80");
  }

  // Seed admin user
  const existingAdmin = await storage.getUserByUsername("admin");
  if (!existingAdmin) {
    console.log("Creating admin user...");
    const salt = randomBytes(16).toString("hex");
    const buf = (await promisify(scrypt)("admin123", salt, 64)) as Buffer;
    const hashedPassword = `${buf.toString("hex")}.${salt}`;
    await storage.createUser({
      username: "admin",
      password: hashedPassword,
      name: "Administrator",
      email: "admin@store.com",
      role: "admin",
    });
  }

  // Seed seller user
  const existingSeller = await storage.getUserByUsername("seller");
  if (!existingSeller) {
    console.log("Creating seller user...");
    const salt = randomBytes(16).toString("hex");
    const buf = (await promisify(scrypt)("seller123", salt, 64)) as Buffer;
    const hashedPassword = `${buf.toString("hex")}.${salt}`;
    await storage.createUser({
      username: "seller",
      password: hashedPassword,
      name: "Demo Seller",
      email: "seller@store.com",
      role: "seller",
      storeName: "Demo Electronics Store",
      storeDescription: "Quality electronics at great prices",
    });
  }

  // Seed products
  const { items: existingProducts } = await storage.getProducts({ page: 1, pageSize: 1 });
  if (existingProducts.length === 0) {
    console.log("Seeding products...");
    const seller = await storage.getUserByUsername("seller");
    const sellerId = seller?.id;

    const productsData = [
      {
        sellerId,
        name: "Wireless Noise Cancelling Headphones",
        description: "Experience world-class silence and superior sound with our premium headphones. Features advanced noise cancellation technology and 30-hour battery life.",
        price: "299.99",
        originalPrice: "399.99",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        stock: 50,
        rating: "4.8",
        reviewCount: 124,
        features: ["Active Noise Cancellation", "30-hour battery life", "Bluetooth 5.0", "Premium leather pads"],
      },
      {
        sellerId,
        name: "Smart Watch Series 7",
        description: "Stay connected, active, and healthy with the latest smart watch technology. Always-on retina display with health monitoring features.",
        price: "399.00",
        originalPrice: "449.00",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
        stock: 30,
        rating: "4.9",
        reviewCount: 89,
        features: ["Always-on Retina display", "ECG app", "Blood oxygen sensor", "Water resistant"],
      },
      {
        sellerId,
        name: "Ergonomic Office Chair",
        description: "Work in comfort with this fully adjustable mesh office chair. Designed for long hours of comfortable sitting.",
        price: "199.50",
        category: "Furniture",
        image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80",
        stock: 20,
        rating: "4.5",
        reviewCount: 67,
        features: ["Lumbar support", "Adjustable armrests", "Breathable mesh", "360-degree swivel"],
      },
      {
        sellerId,
        name: "Professional DSLR Camera",
        description: "Capture stunning photos and videos with this high-performance camera. Perfect for professionals and enthusiasts.",
        price: "1299.00",
        originalPrice: "1499.00",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
        stock: 10,
        rating: "4.9",
        reviewCount: 203,
        features: ["24.2MP sensor", "4K video", "WiFi connectivity", "Weather sealed"],
      },
      {
        sellerId,
        name: "Running Shoes Pro",
        description: "Lightweight and comfortable running shoes for your daily jog. Advanced cushioning for maximum comfort.",
        price: "89.99",
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
        stock: 100,
        rating: "4.6",
        reviewCount: 156,
        features: ["Breathable mesh", "Cushioned sole", "Durable rubber outsole", "Lightweight design"],
      },
      {
        sellerId,
        name: "Minimalist Backpack",
        description: "A stylish and functional backpack for your daily commute. Water-resistant with multiple compartments.",
        price: "59.99",
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
        stock: 45,
        rating: "4.4",
        reviewCount: 78,
        features: ["Water-resistant", "Laptop compartment", "Hidden pockets", "Ergonomic straps"],
      },
      {
        sellerId,
        name: "Mechanical Keyboard RGB",
        description: "Premium mechanical keyboard with customizable RGB lighting and tactile switches.",
        price: "149.99",
        originalPrice: "179.99",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
        stock: 35,
        rating: "4.7",
        reviewCount: 92,
        features: ["Cherry MX switches", "Full RGB", "USB-C", "Programmable keys"],
      },
      {
        sellerId,
        name: "Yoga Mat Premium",
        description: "Extra thick yoga mat with non-slip surface. Perfect for yoga, pilates, and floor exercises.",
        price: "39.99",
        category: "Sports",
        image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80",
        stock: 80,
        rating: "4.5",
        reviewCount: 134,
        features: ["6mm thickness", "Non-slip surface", "Eco-friendly", "Carrying strap included"],
      },
      {
        sellerId,
        name: "Coffee Maker Deluxe",
        description: "Programmable coffee maker with built-in grinder. Wake up to freshly ground coffee every morning.",
        price: "179.00",
        originalPrice: "219.00",
        category: "Home & Kitchen",
        image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&q=80",
        stock: 25,
        rating: "4.6",
        reviewCount: 88,
        features: ["Built-in grinder", "Programmable timer", "12-cup capacity", "Keep warm function"],
      },
      {
        sellerId,
        name: "Wireless Earbuds Pro",
        description: "True wireless earbuds with active noise cancellation and premium sound quality.",
        price: "199.00",
        originalPrice: "249.00",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
        stock: 60,
        rating: "4.7",
        reviewCount: 245,
        features: ["Active noise cancellation", "24hr battery", "Wireless charging", "IPX4 water resistant"],
      },
      {
        sellerId,
        name: "Standing Desk Electric",
        description: "Electric height adjustable standing desk. Switch between sitting and standing with one touch.",
        price: "499.00",
        originalPrice: "599.00",
        category: "Furniture",
        image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800&q=80",
        stock: 15,
        rating: "4.8",
        reviewCount: 67,
        features: ["Electric motor", "Memory presets", "Cable management", "Weight capacity 150kg"],
      },
      {
        sellerId,
        name: "Fitness Tracker Band",
        description: "Slim fitness tracker with heart rate monitoring and sleep tracking capabilities.",
        price: "79.99",
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80",
        stock: 90,
        rating: "4.3",
        reviewCount: 312,
        features: ["Heart rate monitor", "Sleep tracking", "7-day battery", "Water resistant"],
      },
    ];

    for (const p of productsData) {
      await storage.createProduct(p);
    }
    console.log("Seeding complete!");
  }
}

import { scrypt as scryptOriginal, randomBytes } from "crypto";
