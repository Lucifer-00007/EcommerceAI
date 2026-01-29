import { Review } from '@/types'
import { Star } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="border-b pb-6 last:border-0">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-medium">{review.userName}</p>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < review.rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm">{review.comment}</p>
    </div>
  )
}
