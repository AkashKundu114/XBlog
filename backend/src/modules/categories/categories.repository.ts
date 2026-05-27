import { prisma } from '../../database/client';

export class CategoriesRepository {
  findAll() {
    return prisma.category.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: 'asc' },
    });
  }

  findBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
      include: { _count: { select: { posts: true } } },
    });
  }

  findById(id: string) {
    return prisma.category.findUnique({ where: { id } });
  }

  create(data: { name: string; slug: string; description?: string; color?: string }) {
    return prisma.category.create({ data });
  }

  update(id: string, data: { name?: string; slug?: string; description?: string; color?: string }) {
    return prisma.category.update({ where: { id }, data });
  }

  delete(id: string) {
    return prisma.category.delete({ where: { id } });
  }
}

export const categoriesRepository = new CategoriesRepository();
