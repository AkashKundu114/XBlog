import { tagsRepository } from './tags.repository';
import { ApiError } from '../../shared/utils/ApiError';
import { createSlug } from '../../shared/utils/slugify';

export class TagsService {
  getAll() { return tagsRepository.findAll(); }

  async create(name: string) {
    const slug = createSlug(name);
    return tagsRepository.create(name, slug);
  }

  async update(id: string, name: string) {
    const existing = await tagsRepository.findById(id);
    if (!existing) throw ApiError.notFound('Tag not found');
    return tagsRepository.update(id, { name, slug: createSlug(name) });
  }

  async delete(id: string) {
    const existing = await tagsRepository.findById(id);
    if (!existing) throw ApiError.notFound('Tag not found');
    await tagsRepository.delete(id);
  }
}
export const tagsService = new TagsService();
