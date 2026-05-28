const { prisma } = require('../../database/client');

class TagsRepository {
  findAll() { return prisma.tag.findMany({ include: { _count: { select: { posts: true } } }, orderBy: { name: 'asc' } }); }
  findById(id) { return prisma.tag.findUnique({ where: { id } }); }
  create(name, slug) { return prisma.tag.create({ data: { name, slug } }); }
  update(id, data) { return prisma.tag.update({ where: { id }, data }); }
  delete(id) { return prisma.tag.delete({ where: { id } }); }
}
const tagsRepository = new TagsRepository();
module.exports = { tagsRepository };
