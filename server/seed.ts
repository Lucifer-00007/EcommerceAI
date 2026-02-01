import { db } from "./db";
import { users, products, categories, reviews, orders, orderItems, wishlists } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(wishlists);
  await db.delete(reviews);
  await db.delete(products);
  await db.delete(categories);
  await db.delete(users);

  // Create users
  const [admin, seller1, seller2, customer1, customer2] = await db.insert(users).values([
    { username: "admin", password: "admin123", name: "Admin User", email: "admin@example.com", role: "admin" },
    { username: "seller1", password: "seller123", name: "Tech Store", email: "seller1@example.com", role: "seller", storeName: "Tech Haven", storeDescription: "Your one-stop shop for electronics" },
    { username: "seller2", password: "seller123", name: "Fashion Store", email: "seller2@example.com", role: "seller", storeName: "Style Hub", storeDescription: "Latest fashion trends" },
    { username: "customer1", password: "customer123", name: "John Doe", email: "john@example.com", role: "customer" },
    { username: "customer2", password: "customer123", name: "Jane Smith", email: "jane@example.com", role: "customer" },
  ]).returning();

  // Create categories
  const [electronics, fashion, home, books] = await db.insert(categories).values([
    { name: "Electronics", slug: "electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400", productCount: 0 },
    { name: "Fashion", slug: "fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400", productCount: 0 },
    { name: "Home & Garden", slug: "home-garden", image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400", productCount: 0 },
    { name: "Books", slug: "books", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400", productCount: 0 },
  ]).returning();

  // Create products
  const productList = await db.insert(products).values([
    {
      sellerId: seller1.id,
      name: "Wireless Headphones",
      description: "Premium noise-cancelling wireless headphones with 30-hour battery life",
      price: "199.99",
      originalPrice: "249.99",
      category: "electronics",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"],
      stock: 50,
      rating: "4.5",
      reviewCount: 128,
      features: ["Noise Cancelling", "30hr Battery", "Bluetooth 5.0"],
      isActive: true,
    },
    {
      sellerId: seller1.id,
      name: "Smart Watch",
      description: "Fitness tracking smartwatch with heart rate monitor and GPS",
      price: "299.99",
      category: "electronics",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"],
      stock: 30,
      rating: "4.7",
      reviewCount: 89,
      features: ["Heart Rate Monitor", "GPS", "Water Resistant"],
      isActive: true,
    },
    {
      sellerId: seller2.id,
      name: "Designer Sunglasses",
      description: "Stylish UV protection sunglasses with polarized lenses",
      price: "149.99",
      originalPrice: "199.99",
      category: "fashion",
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
      images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500"],
      stock: 75,
      rating: "4.3",
      reviewCount: 45,
      features: ["UV Protection", "Polarized", "Lightweight"],
      isActive: true,
    },
    {
      sellerId: seller2.id,
      name: "Leather Backpack",
      description: "Premium leather backpack with laptop compartment",
      price: "129.99",
      category: "fashion",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
      images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"],
      stock: 40,
      rating: "4.6",
      reviewCount: 67,
      features: ["Genuine Leather", "Laptop Compartment", "Water Resistant"],
      isActive: true,
    },
    {
      sellerId: seller1.id,
      name: "4K Webcam",
      description: "Professional 4K webcam with auto-focus and built-in microphone",
      price: "89.99",
      category: "electronics",
      image: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500",
      images: ["https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500"],
      stock: 60,
      rating: "4.4",
      reviewCount: 112,
      features: ["4K Resolution", "Auto Focus", "Built-in Mic"],
      isActive: true,
    },
  ]).returning();

  // Create reviews
  await db.insert(reviews).values([
    { productId: productList[0].id, userId: customer1.id, rating: 5, title: "Amazing sound quality!", comment: "Best headphones I've ever owned. The noise cancellation is incredible." },
    { productId: productList[0].id, userId: customer2.id, rating: 4, title: "Great but pricey", comment: "Excellent quality but a bit expensive. Worth it if you can afford it." },
    { productId: productList[1].id, userId: customer1.id, rating: 5, title: "Perfect fitness companion", comment: "Tracks everything I need. Battery lasts for days!" },
    { productId: productList[2].id, userId: customer2.id, rating: 4, title: "Stylish and functional", comment: "Love the design. Very comfortable to wear." },
  ]);

  // Create wishlist items
  await db.insert(wishlists).values([
    { userId: customer1.id, productId: productList[2].id },
    { userId: customer1.id, productId: productList[3].id },
    { userId: customer2.id, productId: productList[1].id },
  ]);

  // Create orders
  const [order1] = await db.insert(orders).values([
    {
      userId: customer1.id,
      status: "delivered",
      total: "199.99",
      address: { street: "123 Main St", city: "New York", state: "NY", zip: "10001" },
    },
  ]).returning();

  await db.insert(orderItems).values([
    { orderId: order1.id, productId: productList[0].id, quantity: 1, price: "199.99" },
  ]);

  console.log("Database seeded successfully!");
}

seed().catch(console.error).finally(() => process.exit());
