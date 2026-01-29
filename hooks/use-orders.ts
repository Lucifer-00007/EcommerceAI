/**
 * Orders Hooks
 *
 * React Query hooks for order management and history.
 *
 * @module hooks/use-orders
 * @example
 * const { data: orders } = useOrders();
 * const { mutate: createOrder } = useCreateOrder();
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type {
  Order,
  Address,
  PaymentMethod,
  OrderTotals,
  OrderItem,
  Cart,
} from "@/types";
import { mockOrders, delay, simulateError, generateId } from "@/services/mock-data";

// =============================================================================
// QUERY KEYS
// =============================================================================

/**
 * Query keys for order-related queries
 */
export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  userOrders: (userId: string) => [...orderKeys.lists(), "user", userId] as const,
};

// =============================================================================
// TYPES
// =============================================================================

/**
 * Create order input
 */
interface CreateOrderInput {
  /** Cart data */
  cart: Cart;
  /** Shipping address */
  shippingAddress: Address;
  /** Billing address */
  billingAddress: Address;
  /** Payment method */
  payment: PaymentMethod;
  /** Order notes */
  notes?: string;
}

/**
 * Create order response
 */
interface CreateOrderResponse {
  success: boolean;
  order?: Order;
  error?: string;
}

/**
 * Cancel order input
 */
interface CancelOrderInput {
  /** Order ID */
  orderId: string;
  /** Cancellation reason */
  reason?: string;
}

// =============================================================================
// ORDER QUERIES
// =============================================================================

/**
 * Hook to fetch user's orders
 *
 * @param userId - User ID (optional, defaults to current user)
 * @param options - Additional React Query options
 * @returns Query result with orders array
 *
 * @example
 * const { data: orders, isLoading } = useOrders();
 */
export function useOrders(
  userId?: string,
  options?: Omit<UseQueryOptions<Order[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: orderKeys.userOrders(userId || "current"),
    queryFn: async () => {
      await delay(400, 800);
      simulateError(0.03);

      // Filter orders by user ID (in real app, this would come from auth context)
      const targetUserId = userId || "user_1"; // Default to mock user
      const orders = mockOrders.filter((order) => order.userId === targetUserId);

      // Sort by created date (newest first)
      return orders.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook to fetch a single order by ID
 *
 * @param orderId - Order ID
 * @param options - Additional React Query options
 * @returns Query result with order details
 *
 * @example
 * const { data: order } = useOrder("ord_123");
 */
export function useOrder(
  orderId: string | undefined,
  options?: Omit<UseQueryOptions<Order, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: orderKeys.detail(orderId || ""),
    queryFn: async () => {
      if (!orderId) {
        throw new Error("Order ID is required");
      }

      await delay(300, 600);
      simulateError(0.05);

      const order = mockOrders.find((o) => o.id === orderId);

      if (!order) {
        throw new Error(`Order with ID "${orderId}" not found`);
      }

      return order;
    },
    enabled: !!orderId,
    staleTime: 1 * 60 * 1000,
    ...options,
  });
}

// =============================================================================
// ORDER MUTATIONS
// =============================================================================

/**
 * Hook to create a new order
 *
 * @returns Mutation to create order
 *
 * @example
 * const { mutate: createOrder, isPending } = useCreateOrder();
 * createOrder({
 *   cart: cartData,
 *   shippingAddress: shipping,
 *   billingAddress: billing,
 *   payment: paymentMethod,
 *   notes: "Please gift wrap"
 * });
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation<CreateOrderResponse, Error, CreateOrderInput>({
    mutationFn: async (input) => {
      const { cart, shippingAddress, billingAddress, payment, notes } = input;

      await delay(800, 1500); // Longer delay for order creation
      simulateError(0.05);

      // Validate cart has items
      if (!cart.items.length) {
        throw new Error("Cart is empty");
      }

      // Create order items from cart
      const orderItems: OrderItem[] = cart.items.map((item, index) => ({
        id: `oi_${Date.now()}_${index}`,
        productId: item.productId,
        name: item.product.name,
        slug: item.product.slug,
        sku: `${item.productId}-SKU`,
        image: item.product.images[0],
        price: item.product.price,
        compareAtPrice: item.product.compareAtPrice,
        quantity: item.quantity,
        total: item.product.price * item.quantity,
        isReturnable: true,
        returnStatus: "not_returned",
      }));

      // Calculate totals
      const subtotal = cart.subtotal;
      const discount = cart.discountAmount || 0;
      const shipping = subtotal > 50 ? 0 : 5.99;
      const tax = (subtotal - discount + shipping) * 0.08;
      const total = subtotal - discount + shipping + tax;

      const totals: OrderTotals = {
        subtotal,
        discount,
        shipping,
        tax,
        total,
        currency: cart.currency,
      };

      // Create new order
      const newOrder: Order = {
        id: generateId("ord"),
        userId: "user_1", // In real app, get from auth context
        orderNumber: `ORD-${new Date().getFullYear()}-${String(mockOrders.length + 1).padStart(3, "0")}`,
        items: orderItems,
        status: "pending",
        paymentStatus: payment.type === "cod" ? "pending" : "completed",
        shippingAddress,
        billingAddress,
        payment,
        totals,
        notes,
        carrier: undefined,
        trackingNumber: undefined,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        currency: cart.currency,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // In real app, this would POST to API
      // For mock, we just return the order
      return {
        success: true,
        order: newOrder,
      };
    },
    onSuccess: (data) => {
      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });

      // Add new order to cache
      if (data.order) {
        queryClient.setQueryData(orderKeys.detail(data.order.id), data.order);
      }
    },
  });
}

/**
 * Hook to cancel an order
 *
 * @returns Mutation to cancel order
 *
 * @example
 * const { mutate: cancelOrder } = useCancelOrder();
 * cancelOrder({ orderId: "ord_123", reason: "Changed my mind" });
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation<{
    success: boolean;
    order?: Order;
  }, Error, CancelOrderInput>({
    mutationFn: async (input) => {
      const { orderId, reason } = input;

      await delay(400, 800);
      simulateError(0.03);

      const order = mockOrders.find((o) => o.id === orderId);

      if (!order) {
        throw new Error(`Order with ID "${orderId}" not found`);
      }

      // Check if order can be cancelled
      if (order.status === "delivered" || order.status === "cancelled") {
        throw new Error(`Cannot cancel order with status "${order.status}"`);
      }

      if (order.status === "shipped") {
        throw new Error("Cannot cancel order that has already shipped");
      }

      // Update order status
      const updatedOrder: Order = {
        ...order,
        status: "cancelled",
        paymentStatus: order.paymentStatus === "completed" ? "refunded" : "pending",
        internalNotes: reason ? `Cancellation reason: ${reason}` : undefined,
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        order: updatedOrder,
      };
    },
    onSuccess: (data, variables) => {
      // Update order in cache
      if (data.order) {
        queryClient.setQueryData(orderKeys.detail(variables.orderId), data.order);
      }

      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}

// =============================================================================
// ORDER UTILITIES
// =============================================================================

/**
 * Hook to get order status color
 *
 * @param status - Order status
 * @returns Color string for the status
 *
 * @example
 * const color = useOrderStatusColor("delivered"); // "green"
 */
export function useOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "yellow",
    processing: "blue",
    shipped: "indigo",
    delivered: "green",
    cancelled: "red",
    refunded: "gray",
  };

  return colors[status] || "gray";
}

/**
 * Hook to get order status label
 *
 * @param status - Order status
 * @returns Human-readable status label
 *
 * @example
 * const label = useOrderStatusLabel("delivered"); // "Delivered"
 */
export function useOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "Pending",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    refunded: "Refunded",
  };

  return labels[status] || status;
}

// =============================================================================
// EXPORTS
// =============================================================================

export type { CreateOrderInput, CreateOrderResponse, CancelOrderInput };
