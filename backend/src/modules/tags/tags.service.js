const { tagsRepository } = require('./tags.repository');
const { ApiError } = require('../../shared/utils/ApiError');
const { createSlug } = require('../../shared/utils/slugify');

class TagsService {
  getAll() { return tagsRepository.findAll(); }
  async create(name) { return tagsRepository.create(name, createSlug(name)); }
  async update(id, name) {
    const existing = await tagsRepository.findById(id);
    if (!existing) throw ApiError.notFound('Tag not found');
    return tagsRepository.update(id, { name, slug: createSlug(name) });
  }
  async delete(id) {
    const existing = await tagsRepository.findById(id);
    if (!existing) throw ApiError.notFound('Tag not found');
    await tagsRepository.delete(id);
  }
}
const tagsService = new TagsService();
module.exports = { tagsService };
