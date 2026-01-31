'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ProductCard } from '@/components/product/product-card'
import { ProductSkeleton } from '@/components/product/product-skeleton'
import { useProducts } from '@/hooks/use-products'
import { useCategories } from '@/hooks/use-categories'
import { SearchParams as SearchParamsType, SortOption } from '@/types'
import { ChevronDown, Filter, X } from 'lucide-react'

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<{
    category: string
    priceRange: [number, number]
    rating: number
    inStock: boolean
    featured: boolean
  }>({
    category: '',
    priceRange: [0, 1000],
    rating: 0,
    inStock: false,
    featured: false
  })
  const [sort, setSort] = useState<SortOption>({ field: 'name', direction: 'asc' })
  const [searchQuery, setSearchQuery] = useState('')

  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get('category') || ''
    const rating = parseInt(searchParams.get('rating') || '0')
    const featured = searchParams.get('featured') === 'true'
    const query = searchParams.get('q') || ''
    
    setFilters(prev => ({
      ...prev,
      category,
      rating,
      featured
    }))
    setSearchQuery(query)
  }, [searchParams])

  const searchParamsData: SearchParamsType = {
    query: searchQuery || undefined,
    filters: {
      category: filters.category || undefined,
      priceRange: filters.priceRange[0] === 0 && filters.priceRange[1] === 1000 
        ? undefined 
        : filters.priceRange,
      rating: filters.rating > 0 ? filters.rating : undefined,
      featured: filters.featured || undefined,
      inStock: filters.inStock || undefined
    },
    sort,
    page: 1,
    limit: 12
  }

  const { data: productsData, isLoading, error } = useProducts(searchParamsData)
  const { data: categories } = useCategories()

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: [0, 1000],
      rating: 0,
      inStock: false,
      featured: false
    })
    setSearchQuery('')
  }

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'priceRange') {
      const range = value as [number, number]
      return range[0] > 0 || range[1] < 1000
    }
    if (key === 'rating') return (value as number) > 0
    return value !== '' && value !== false
  }).length

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Products</h1>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <p className="text-muted-foreground">
            {productsData?.pagination.total 
              ? `Showing ${productsData.data.length} of ${productsData.pagination.total} products`
              : 'Loading products...'}
          </p>
          
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <Label htmlFor="sort">Sort by:</Label>
            <select
              id="sort"
              value={`${sort.field}-${sort.direction}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-')
                setSort({
                  field: field as SortOption['field'],
                  direction: direction as SortOption['direction']
                })
              }}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="rating-desc">Rating (High to Low)</option>
              <option value="createdAt-desc">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block lg:w-64`}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  disabled={activeFilterCount === 0}
                >
                  Clear all
                </Button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <Label>Category</Label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full mt-2 border rounded-md px-3 py-2 text-sm"
                >
                  <option value="">All Categories</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <Label>Price Range</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange[0]}
                      onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                      className="flex-1"
                    />
                    <span>-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 1000])}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <Label>Minimum Rating</Label>
                <div className="mt-2 space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.rating === rating}
                        onChange={() => handleFilterChange('rating', rating)}
                        className="text-primary"
                      />
                      <span className="text-sm">
                        {rating}+ Stars
                      </span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === 0}
                      onChange={() => handleFilterChange('rating', 0)}
                      className="text-primary"
                    />
                    <span className="text-sm">All Ratings</span>
                  </label>
                </div>
              </div>

              {/* Additional Filters */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="text-primary"
                  />
                  <span className="text-sm">In Stock Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.featured}
                    onChange={(e) => handleFilterChange('featured', e.target.checked)}
                    className="text-primary"
                  />
                  <span className="text-sm">Featured Products</span>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {searchQuery}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSearchQuery('')}
                  />
                </Badge>
              )}
              {filters.category && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {filters.category}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange('category', '')}
                  />
                </Badge>
              )}
              {filters.rating > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.rating}+ Stars
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange('rating', 0)}
                  />
                </Badge>
              )}
              {filters.inStock && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  In Stock
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange('inStock', false)}
                  />
                </Badge>
              )}
              {filters.featured && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Featured
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange('featured', false)}
                  />
                </Badge>
              )}
            </div>
          )}

          {/* Products Grid */}
          {error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Error loading products</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isLoading
                ? [...Array(12)].map((_, index) => (
                    <ProductSkeleton key={index} />
                  ))
                : productsData?.data.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
            </div>
          )}

          {/* No Products Found */}
          {!isLoading && productsData?.data.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms
              </p>
              <Button onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {productsData && productsData.pagination.totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  disabled={!productsData.pagination.hasPrev}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-sm">
                  Page {productsData.pagination.page} of {productsData.pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={!productsData.pagination.hasNext}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
