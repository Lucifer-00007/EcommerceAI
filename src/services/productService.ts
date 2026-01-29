import { ApiResponse, Product, ProductListResponse, SearchParams } from '@/types';
import { mockProducts } from '@/data/mock';
import { PAGINATION } from '@/lib/constants';
import { sleep } from '@/lib/utils';

class ProductService {
  private products = mockProducts;

  async getProducts(params: SearchParams = {}): Promise<ProductListResponse> {
    await sleep(500); // Simulate network delay

    let filteredProducts = [...this.products];

    // Apply filters
    if (params.q) {
      const query = params.q.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (params.category) {
      filteredProducts = filteredProducts.filter(product =>
        product.category.toLowerCase() === params.category.toLowerCase()
      );
    }

    if (params.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.price >= params.minPrice!);
    }

    if (params.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.price <= params.maxPrice!);
    }

    if (params.rating !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.rating >= params.rating!);
    }

    // Apply sorting
    if (params.sort) {
      const [field, order] = params.sort.split('-');
      filteredProducts.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (field) {
          case 'name':
            aValue = a.name;
            bValue = b.name;
            break;
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          case 'rating':
            aValue = a.rating;
            bValue = b.rating;
            break;
          case 'createdAt':
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          default:
            return 0;
        }

        if (order === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || PAGINATION.DEFAULT_PAGE_SIZE;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / limit),
      },
      filters: {
        categories: [],
        priceRange: [0, 1000],
        rating: 0,
        inStock: false,
        tags: [],
      },
      sort: {
        field: 'createdAt',
        order: 'desc',
      },
    };
  }

  async getProduct(id: string): Promise<Product | null> {
    await sleep(300);
    const product = this.products.find(p => p.id === id);
    return product || null;
  }

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    await sleep(400);
    return this.products
      .filter(product => product.featured)
      .slice(0, limit);
  }

  async searchProducts(query: string, limit = 10): Promise<Product[]> {
    await sleep(300);
    const lowercaseQuery = query.toLowerCase();
    return this.products
      .filter(product =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
      .slice(0, limit);
  }

  async getRelatedProducts(productId: string, limit = 4): Promise<Product[]> {
    await sleep(400);
    const product = this.products.find(p => p.id === productId);
    if (!product) return [];

    return this.products
      .filter(p => p.id !== productId && p.category === product.category)
      .slice(0, limit);
  }
}

export const productService = new ProductService();