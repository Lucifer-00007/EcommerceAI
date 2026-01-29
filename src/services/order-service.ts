import { Order, Address, CartItem } from '@/types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const orderService = {
  async createOrder(
    userId: string,
    items: CartItem[],
    shippingAddress: Address
  ): Promise<Order> {
    await delay(1000)
    
    const total = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
    
    const order: Order = {
      id: `ORD-${Date.now()}`,
      userId,
      items,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      shippingAddress,
    }
    
    return order
  },
  
  async getOrders(userId: string): Promise<Order[]> {
    await delay(500)
    
    // Mock orders - in production, fetch from API
    return []
  },
  
  async getOrderById(orderId: string): Promise<Order | null> {
    await delay(300)
    return null
  },
}
