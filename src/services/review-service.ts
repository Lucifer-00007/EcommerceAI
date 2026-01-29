import { Review } from '@/types'
import { MOCK_REVIEWS } from '@/lib/mock-data'

export const reviewService = {
  getProductReviews: async (productId: string): Promise<Review[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return MOCK_REVIEWS.filter(r => r.productId === productId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },
}
