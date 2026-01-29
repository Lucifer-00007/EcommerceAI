'use client'

import { useQuery } from '@tanstack/react-query'
import { useSearchParams, useRouter } from 'next/navigation'
import { ProductCard } from '@/components/product-card'
import { ProductGridSkeleton } from '@/components/product-skeleton'
import { Pagination } from '@/components/pagination'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { productService } from '@/services/product-service'
import { ProductFilters } from '@/types'
import { useCartStore } from '@/store/cart-store'
import { useToast } from '@/hooks/use-toast'
import { ProductFiltersComponent } from '@/features/products/product-filters'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 6

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()
  
  const currentPage = Number(searchParams.get('page')) || 1
  
  const filters: ProductFilters = {
    category: searchParams.get('category') || undefined,
    search: searchParams.get('search') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sortBy: (searchParams.get('sortBy') as ProductFilters['sortBy']) || undefined,
  }
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', filters, currentPage],
    queryFn: () => productService.getProducts(filters, currentPage, PAGE_SIZE),
  })
  
  const handleAddToCart = (product: any) => {
    addItem(product)
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    })
  }
  
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/products?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0
  
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
      <Breadcrumbs
        items={[
          { label: 'Products', href: filters.category ? '/products' : undefined },
          ...(filters.category ? [{ label: filters.category.charAt(0).toUpperCase() + filters.category.slice(1) }] : []),
        ]}
      />
      
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
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.data.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
              
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
