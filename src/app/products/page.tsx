/**
 * Products Listing Page
 * 
 * Displays a grid of products with filtering, sorting, and pagination.
 * 
 * Features:
 * - Product grid with responsive layout
 * - Filter sidebar (category, price, rating, stock)
 * - Sort dropdown
 * - Pagination
 * - Search functionality
 * - Active filter badges
 */

'use client'

import * as React from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Filter, 
  X, 
  ChevronDown, 
  Grid3X3, 
  LayoutList,
  SlidersHorizontal
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { productApi, categoryApi } from '@/services/api'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Product, ProductSortOption, ProductFilters } from '@/types'

// ============================================================================
// TYPES
// ============================================================================

type ViewMode = 'grid' | 'list'

// ============================================================================
// PRODUCT CARD COMPONENT
// ============================================================================

interface ProductCardProps {
  product: Product
  viewMode: ViewMode
}

function ProductCard({ product, viewMode }: ProductCardProps) {
  if (viewMode === 'list') {
    return (
      <Link href={`/products/${product.slug}`}>
        <Card className="group overflow-hidden transition-all hover:shadow-lg">
          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            <div className="relative sm:w-48 aspect-square sm:aspect-auto overflow-hidden bg-muted">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              {product.isOnSale && (
                <Badge className="absolute top-3 left-3 bg-destructive">
                  Sale
                </Badge>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="secondary" className="text-sm">Out of Stock</Badge>
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 p-4 sm:p-6">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{product.category.name}</p>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {product.shortDescription || product.description}
                  </p>
                </div>
                
                <div className="flex items-end justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold">{formatCurrency(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button disabled={!product.inStock}>
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  // Grid view
  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {product.isOnSale && (
            <Badge className="absolute top-3 left-3 bg-destructive">
              Sale
            </Badge>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary" className="text-sm">Out of Stock</Badge>
            </div>
          )}
        </div>
        
        {/* Content */}
        <CardContent className="p-4 flex flex-col flex-1">
          <p className="text-xs text-muted-foreground mb-1">{product.category.name}</p>
          <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors flex-1">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>
          
          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// ============================================================================
// FILTER SIDEBAR COMPONENT
// ============================================================================

interface FilterSidebarProps {
  filters: ProductFilters
  onFilterChange: (filters: ProductFilters) => void
  categories: { id: string; name: string }[]
  priceRange: [number, number]
}

function FilterSidebar({ filters, onFilterChange, categories, priceRange }: FilterSidebarProps) {
  const [localPriceRange, setLocalPriceRange] = React.useState([filters.minPrice || 0, filters.maxPrice || 1000])

  const handlePriceChange = (value: number[]) => {
    setLocalPriceRange(value)
    onFilterChange({
      ...filters,
      minPrice: value[0],
      maxPrice: value[1],
    })
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    onFilterChange({
      ...filters,
      category: checked ? categoryId : undefined,
    })
  }

  const handleRatingChange = (rating: number, checked: boolean) => {
    onFilterChange({
      ...filters,
      minRating: checked ? rating : undefined,
    })
  }

  const handleStockChange = (checked: boolean) => {
    onFilterChange({
      ...filters,
      inStock: checked || undefined,
    })
  }

  const handleSaleChange = (checked: boolean) => {
    onFilterChange({
      ...filters,
      onSale: checked || undefined,
    })
  }

  const clearFilters = () => {
    onFilterChange({})
    setLocalPriceRange([0, 1000])
  }

  const hasActiveFilters = Object.keys(filters).length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        )}
      </div>

      <Separator />

      {/* Categories */}
      <div>
        <h4 className="font-medium mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={filters.category === category.id}
                onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
              />
              <label
                htmlFor={`category-${category.id}`}
                className="text-sm cursor-pointer"
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h4 className="font-medium mb-3">Price Range</h4>
        <Slider
          value={localPriceRange}
          max={1000}
          step={10}
          onValueChange={handlePriceChange}
          className="mb-4"
        />
        <div className="flex items-center justify-between text-sm">
          <span>{formatCurrency(localPriceRange[0])}</span>
          <span>{formatCurrency(localPriceRange[1])}</span>
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <h4 className="font-medium mb-3">Minimum Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={filters.minRating === rating}
                onCheckedChange={(checked) => handleRatingChange(rating, checked as boolean)}
              />
              <label
                htmlFor={`rating-${rating}`}
                className="text-sm cursor-pointer flex items-center gap-1"
              >
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${i < rating ? 'fill-current' : 'text-gray-300'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span>& Up</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Other Filters */}
      <div>
        <h4 className="font-medium mb-3">Other</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={filters.inStock}
              onCheckedChange={(checked) => handleStockChange(checked as boolean)}
            />
            <label htmlFor="in-stock" className="text-sm cursor-pointer">
              In Stock Only
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="on-sale"
              checked={filters.onSale}
              onCheckedChange={(checked) => handleSaleChange(checked as boolean)}
            />
            <label htmlFor="on-sale" className="text-sm cursor-pointer">
              On Sale
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ACTIVE FILTERS COMPONENT
// ============================================================================

interface ActiveFiltersProps {
  filters: ProductFilters
  onFilterChange: (filters: ProductFilters) => void
  categories: { id: string; name: string }[]
}

function ActiveFilters({ filters, onFilterChange, categories }: ActiveFiltersProps) {
  const removeFilter = (key: keyof ProductFilters) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    onFilterChange(newFilters)
  }

  const activeFilters: { key: keyof ProductFilters; label: string }[] = []

  if (filters.category) {
    const category = categories.find(c => c.id === filters.category)
    if (category) {
      activeFilters.push({ key: 'category', label: `Category: ${category.name}` })
    }
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const min = filters.minPrice || 0
    const max = filters.maxPrice || 1000
    activeFilters.push({ key: 'minPrice', label: `Price: $${min} - $${max}` })
  }

  if (filters.minRating) {
    activeFilters.push({ key: 'minRating', label: `Rating: ${filters.minRating}+ stars` })
  }

  if (filters.inStock) {
    activeFilters.push({ key: 'inStock', label: 'In Stock' })
  }

  if (filters.onSale) {
    activeFilters.push({ key: 'onSale', label: 'On Sale' })
  }

  if (filters.search) {
    activeFilters.push({ key: 'search', label: `Search: "${filters.search}"` })
  }

  if (activeFilters.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm text-muted-foreground">Active filters:</span>
      {activeFilters.map(({ key, label }) => (
        <Badge key={key} variant="secondary" className="gap-1">
          {label}
          <button
            onClick={() => removeFilter(key)}
            className="ml-1 hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Button variant="ghost" size="sm" onClick={() => onFilterChange({})}>
        Clear all
      </Button>
    </div>
  )
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // View mode state
  const [viewMode, setViewMode] = React.useState<ViewMode>('grid')
  
  // Parse URL params into filters
  const [filters, setFilters] = React.useState<ProductFilters>(() => ({
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
    minRating: searchParams.get('minRating') ? parseInt(searchParams.get('minRating')!) : undefined,
    inStock: searchParams.get('inStock') === 'true' || undefined,
    onSale: searchParams.get('onSale') === 'true' || undefined,
    featured: searchParams.get('featured') === 'true' || undefined,
  }))

  const [sort, setSort] = React.useState<ProductSortOption>(
    (searchParams.get('sort') as ProductSortOption) || 'featured'
  )
  
  const [page, setPage] = React.useState(1)

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories(),
  })

  // Fetch products
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', filters, sort, page],
    queryFn: () => productApi.getProducts(filters, sort, page, 12),
  })

  // Update URL when filters change
  const updateFilters = (newFilters: ProductFilters) => {
    setFilters(newFilters)
    setPage(1)
    
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, String(value))
      }
    })
    if (sort !== 'featured') params.set('sort', sort)
    
    router.push(`/products?${params.toString()}`, { scroll: false })
  }

  const handleSortChange = (value: ProductSortOption) => {
    setSort(value)
    const params = new URLSearchParams(searchParams)
    if (value === 'featured') {
      params.delete('sort')
    } else {
      params.set('sort', value)
    }
    router.push(`/products?${params.toString()}`, { scroll: false })
  }

  const categories = categoriesData?.data || []
  const products = productsData?.data?.data || []
  const pagination = productsData?.data

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">All Products</h1>
        <p className="text-muted-foreground">
          Browse our collection of quality products
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search products..."
          value={filters.search || ''}
          onChange={(e) => updateFilters({ ...filters, search: e.target.value || undefined })}
          className="max-w-md"
        />
      </div>

      {/* Active Filters */}
      <ActiveFilters 
        filters={filters} 
        onFilterChange={updateFilters} 
        categories={categories} 
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={updateFilters}
                  categories={categories}
                  priceRange={[0, 1000]}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground">
            {isLoading ? 'Loading...' : `${pagination?.total || 0} products found`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="name-asc">Name: A-Z</SelectItem>
              <SelectItem value="name-desc">Name: Z-A</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <FilterSidebar
              filters={filters}
              onFilterChange={updateFilters}
              categories={categories}
              priceRange={[0, 1000]}
            />
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {isLoading ? (
            // Loading Skeleton
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="aspect-square" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-1/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length === 0 ? (
            // Empty State
            <div className="text-center py-16">
              <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search query
              </p>
              <Button onClick={() => updateFilters({})}>Clear Filters</Button>
            </div>
          ) : (
            // Products Grid
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={!pagination.hasNextPage}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
