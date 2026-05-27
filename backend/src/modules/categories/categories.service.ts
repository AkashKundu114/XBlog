import { categoriesRepository } from './categories.repository';
import { ApiError } from '../../shared/utils/ApiError';
import { createSlug } from '../../shared/utils/slugify';

export class CategoriesService {
  async getAll() {
    return categoriesRepository.findAll();
  }

  async getBySlug(slug: string) {
    const cat = await categoriesRepository.findBySlug(slug);
    if (!cat) throw ApiError.notFound('Category not found');
    return cat;
  }

  async create(data: { name: string; description?: string; color?: string }) {
    const slug = createSlug(data.name);
    return categoriesRepository.create({ ...data, slug });
  }

  async update(id: string, data: any) {
    const existing = await categoriesRepository.findById(id);
    if (!existing) throw ApiError.notFound('Category not found');
    const updates: any = { ...data };
    if (data.name) updates.slug = createSlug(data.name);
    return categoriesRepository.update(id, updates);
  }

  async delete(id: string) {
    const existing = await categoriesRepository.findById(id);
    if (!existing) throw ApiError.notFound('Category not found');
    await categoriesRepository.delete(id);
  }
}

export const categoriesService = new CategoriesService();
