'use client'

import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/product-card'
import { ProductGridSkeleton } from '@/components/product-skeleton'
import { productService } from '@/services/product-service'
import { ProductFilters } from '@/types'
import { useCartStore } from '@/store/cart-store'
import { useToast } from '@/hooks/use-toast'
import { ProductFiltersComponent } from '@/features/products/product-filters'

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()
  
  const filters: ProductFilters = {
    category: searchParams.get('category') || undefined,
    search: searchParams.get('search') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sortBy: (searchParams.get('sortBy') as ProductFilters['sortBy']) || undefined,
  }
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
  })
  
  const handleAddToCart = (product: any) => {
    addItem(product)
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    })
  }
  
  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground">Failed to load products. Please try again.</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <ProductFiltersComponent />
        </aside>
        
        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">
              {filters.category ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1) : 'All Products'}
            </h1>
            {data && (
              <p className="text-muted-foreground">
                {data.total} {data.total === 1 ? 'product' : 'products'}
              </p>
            )}
          </div>
          
          {isLoading ? (
            <ProductGridSkeleton />
          ) : data?.data.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.data.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
