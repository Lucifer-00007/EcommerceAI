// Orders service
// Handles order-related API calls

import type {
  Order,
  CreateOrderInput,
  OrderSummary,
} from '@/types/api.types';
import { OrderStatus } from '@/types/api.types';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS, MOCK_API_DELAY } from '@/lib/constants';
import {
  MOCK_ORDERS,
  MOCK_PRODUCTS,
  mockDelay,
  getOrdersByUserId,
  getProductById,
} from '@/lib/mock-data';

/**
 * Create a new order
 * @param input Order creation input
 * @returns Promise that resolves with created order
 */
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    // Validate input
    if (!input.items || input.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    if (!input.shippingAddress) {
      throw new Error('Shipping address is required');
    }

    if (!input.paymentMethod) {
      throw new Error('Payment method is required');
    }

    // Validate items and calculate totals
    const orderItems = input.items.map((item) => {
      const product = getProductById(item.productId);

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Only ${product.stock} items available for ${product.name}`);
      }

      return {
        id: `order-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        productId: item.productId,
        productName: product.name,
        productImage: product.images[0] || '',
        quantity: item.quantity,
        price: product.price,
        total: product.price * item.quantity,
      };
    });

    // Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
    const discount = 0; // Could be calculated based on promotions
    const shipping = 9.99; // Flat shipping rate
    const tax = subtotal * 0.08; // 8% tax rate
    const total = subtotal - discount + shipping + tax;

    // Create order
    const newOrder: Order = {
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: 'current-user', // In a real app, this would come from auth
      items: orderItems,
      subtotal,
      discount,
      shipping,
      tax,
      total,
      status: 'pending' as OrderStatus,
      shippingAddress: input.shippingAddress,
      paymentMethod: input.paymentMethod,
      notes: input.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    };

    // Add to mock orders
    (MOCK_ORDERS as Order[]).push(newOrder);

    return newOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create order. Please try again.');
  }
}

/**
 * Get orders for a user
 * @param userId User ID
 * @returns Promise that resolves with user's orders
 */
export async function getOrders(userId: string): Promise<Order[]> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    const orders = getOrdersByUserId(userId);

    // Sort by creation date (newest first)
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders. Please try again later.');
  }
}

/**
 * Get order by ID
 * @param orderId Order ID
 * @returns Promise that resolves with order
 */
export async function getOrderById(orderId: string): Promise<Order> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    const order = (MOCK_ORDERS as Order[]).find((o) => o.id === orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch order. Please try again later.');
  }
}

/**
 * Update order status
 * @param orderId Order ID
 * @param status New order status
 * @returns Promise that resolves with updated order
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<Order> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    const orderIndex = (MOCK_ORDERS as Order[]).findIndex((o) => o.id === orderId);

    if (orderIndex < 0) {
      throw new Error('Order not found');
    }

    // Update order status
    const updatedOrder: Order = {
      ...MOCK_ORDERS[orderIndex],
      status,
      updatedAt: new Date().toISOString(),
    };

    // Update delivered date if status is delivered
    if (status === 'delivered') {
      updatedOrder.deliveredAt = new Date().toISOString();
    }

    (MOCK_ORDERS as Order[])[orderIndex] = updatedOrder;

    return updatedOrder;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update order status. Please try again.');
  }
}

/**
 * Get order summaries for a user
 * @param userId User ID
 * @returns Promise that resolves with order summaries
 */
export async function getOrderSummaries(userId: string): Promise<OrderSummary[]> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    const orders = getOrdersByUserId(userId);

    // Sort by creation date (newest first)
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Create summaries
    const summaries: OrderSummary[] = orders.map((order) => ({
      id: order.id,
      createdAt: order.createdAt,
      total: order.total,
      status: order.status,
      itemCount: order.items.length,
    }));

    return summaries;
  } catch (error) {
    console.error('Error fetching order summaries:', error);
    throw new Error('Failed to fetch order summaries. Please try again later.');
  }
}

/**
 * Cancel an order
 * @param orderId Order ID
 * @returns Promise that resolves with cancelled order
 */
export async function cancelOrder(orderId: string): Promise<Order> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    const order = await getOrderById(orderId);

    // Check if order can be cancelled
    if (order.status === OrderStatus.Shipped || order.status === OrderStatus.Delivered) {
      throw new Error('Cannot cancel an order that has been shipped or delivered');
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new Error('Order is already cancelled');
    }

    // Update order status to cancelled
    return updateOrderStatus(orderId, OrderStatus.Cancelled);
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to cancel order. Please try again.');
  }
}

/**
 * Track order status
 * @param orderId Order ID
 * @returns Promise that resolves with order status and tracking info
 */
export async function trackOrder(orderId: string): Promise<{
  order: Order;
  trackingInfo: {
    status: string;
    message: string;
    timestamp: string;
  }[];
}> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    const order = await getOrderById(orderId);

    // Generate mock tracking info based on order status
    const trackingInfo = generateTrackingInfo(order);

    return {
      order,
      trackingInfo,
    };
  } catch (error) {
    console.error('Error tracking order:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to track order. Please try again later.');
  }
}

/**
 * Generate tracking information for an order
 * @param order Order
 * @returns Array of tracking info
 */
function generateTrackingInfo(order: Order): {
  status: string;
  message: string;
  timestamp: string;
}[] {
  const trackingInfo: {
    status: string;
    message: string;
    timestamp: string;
  }[] = [];

  // Add order placed
  trackingInfo.push({
    status: 'Order Placed',
    message: 'Your order has been placed successfully.',
    timestamp: order.createdAt,
  });

  // Add status-specific tracking
  switch (order.status) {
    case 'processing':
      trackingInfo.push({
        status: 'Processing',
        message: 'Your order is being processed.',
        timestamp: new Date(new Date(order.createdAt).getTime() + 60 * 60 * 1000).toISOString(),
      });
      break;

    case 'shipped':
      trackingInfo.push({
        status: 'Processing',
        message: 'Your order is being processed.',
        timestamp: new Date(new Date(order.createdAt).getTime() + 60 * 60 * 1000).toISOString(),
      });
      trackingInfo.push({
        status: 'Shipped',
        message: 'Your order has been shipped.',
        timestamp: new Date(new Date(order.createdAt).getTime() + 24 * 60 * 60 * 1000).toISOString(),
      });
      break;

    case 'delivered':
      trackingInfo.push({
        status: 'Processing',
        message: 'Your order is being processed.',
        timestamp: new Date(new Date(order.createdAt).getTime() + 60 * 60 * 1000).toISOString(),
      });
      trackingInfo.push({
        status: 'Shipped',
        message: 'Your order has been shipped.',
        timestamp: new Date(new Date(order.createdAt).getTime() + 24 * 60 * 60 * 1000).toISOString(),
      });
      trackingInfo.push({
        status: 'Delivered',
        message: 'Your order has been delivered.',
        timestamp: order.deliveredAt || new Date().toISOString(),
      });
      break;

    case 'cancelled':
      trackingInfo.push({
        status: 'Cancelled',
        message: 'Your order has been cancelled.',
        timestamp: order.updatedAt,
      });
      break;
  }

  return trackingInfo;
}

/**
 * Get order statistics for a user
 * @param userId User ID
 * @returns Promise that resolves with order statistics
 */
export async function getOrderStatistics(userId: string): Promise<{
  totalOrders: number;
  totalSpent: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}> {
  try {
    await mockDelay(MOCK_API_DELAY.MIN_DELAY, MOCK_API_DELAY.MAX_DELAY);

    const orders = getOrdersByUserId(userId);

    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter((order) => order.status === 'pending').length;
    const deliveredOrders = orders.filter((order) => order.status === 'delivered').length;
    const cancelledOrders = orders.filter((order) => order.status === 'cancelled').length;

    return {
      totalOrders,
      totalSpent,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
    };
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    throw new Error('Failed to fetch order statistics. Please try again later.');
  }
}
