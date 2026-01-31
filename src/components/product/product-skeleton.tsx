import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ProductSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          {/* Image skeleton */}
          <Skeleton className="aspect-square w-full" />
        </div>
        
        <div className="p-4 space-y-3">
          {/* Brand skeleton */}
          <Skeleton className="h-3 w-16" />
          
          {/* Title skeleton */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          
          {/* Rating skeleton */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-3 w-3" />
              ))}
            </div>
            <Skeleton className="h-3 w-8" />
          </div>
          
          {/* Price skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          
          {/* Button skeleton */}
          <Skeleton className="h-8 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
