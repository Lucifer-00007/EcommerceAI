'use client'

import { useQuery } from '@tanstack/react-query'
import { Star } from 'lucide-react'
import { ReviewCard } from '@/components/review-card'
import { reviewService } from '@/services/review-service'
import { Skeleton } from '@/components/ui/skeleton'

interface ReviewsSectionProps {
  productId: string
  rating: number
  reviewCount: number
}

export function ReviewsSection({ productId, rating, reviewCount }: ReviewsSectionProps) {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => reviewService.getProductReviews(productId),
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  const ratingBreakdown = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews?.filter(r => r.rating === star).length || 0,
  }))

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">{rating}</div>
          <div className="flex items-center justify-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{reviewCount} reviews</p>
        </div>
        
        <div className="md:col-span-2 space-y-2">
          {ratingBreakdown.map(({ star, count }) => (
            <div key={star} className="flex items-center gap-3">
              <span className="text-sm w-12">{star} star</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400"
                  style={{ width: `${reviewCount ? (count / reviewCount) * 100 : 0}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {reviews?.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
}
