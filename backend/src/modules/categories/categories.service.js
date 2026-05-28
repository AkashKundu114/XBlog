const { categoriesRepository } = require('./categories.repository');
const { ApiError } = require('../../shared/utils/ApiError');
const { createSlug } = require('../../shared/utils/slugify');

class CategoriesService {
  getAll() { return categoriesRepository.findAll(); }

  async getBySlug(slug) {
    const cat = await categoriesRepository.findBySlug(slug);
    if (!cat) throw ApiError.notFound('Category not found');
    return cat;
  }

  async create({ name, description, color }) {
    const slug = createSlug(name);
    return categoriesRepository.create({ name, slug, description, color });
  }

  async update(id, data) {
    const existing = await categoriesRepository.findById(id);
    if (!existing) throw ApiError.notFound('Category not found');
    const updates = { ...data };
    if (data.name) updates.slug = createSlug(data.name);
    return categoriesRepository.update(id, updates);
  }

  async delete(id) {
    const existing = await categoriesRepository.findById(id);
    if (!existing) throw ApiError.notFound('Category not found');
    await categoriesRepository.delete(id);
  }
}

const categoriesService = new CategoriesService();
module.exports = { categoriesService };
