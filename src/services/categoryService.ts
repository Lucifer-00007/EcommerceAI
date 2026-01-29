import { ApiResponse, Category } from '@/types';
import { mockCategories } from '@/data/mock';
import { sleep } from '@/lib/utils';

class CategoryService {
  private categories = mockCategories;

  async getCategories(): Promise<Category[]> {
    await sleep(300);
    return this.categories;
  }

  async getCategory(slug: string): Promise<Category | null> {
    await sleep(200);
    const category = this.categories.find(c => c.slug === slug);
    return category || null;
  }

  async getCategoryById(id: string): Promise<Category | null> {
    await sleep(200);
    const category = this.categories.find(c => c.id === id);
    return category || null;
  }
}

export const categoryService = new CategoryService();