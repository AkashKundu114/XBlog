const { prisma } = require('../../database/client');

class CategoriesRepository {
  findAll() {
    return prisma.category.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: 'asc' },
    });
  }
  findBySlug(slug) {
    return prisma.category.findUnique({ where: { slug }, include: { _count: { select: { posts: true } } } });
  }
  findById(id) {
    return prisma.category.findUnique({ where: { id } });
  }
  create(data) {
    return prisma.category.create({ data });
  }
  update(id, data) {
    return prisma.category.update({ where: { id }, data });
  }
  delete(id) {
    return prisma.category.delete({ where: { id } });
  }
}

const categoriesRepository = new CategoriesRepository();
module.exports = { categoriesRepository };
