import { prisma } from '../../database/client';

export class TagsRepository {
  findAll() {
    return prisma.tag.findMany({ include: { _count: { select: { posts: true } } }, orderBy: { name: 'asc' } });
  }
  findBySlug(slug: string) {
    return prisma.tag.findUnique({ where: { slug } });
  }
  findById(id: string) {
    return prisma.tag.findUnique({ where: { id } });
  }
  create(name: string, slug: string) {
    return prisma.tag.create({ data: { name, slug } });
  }
  update(id: string, data: { name?: string; slug?: string }) {
    return prisma.tag.update({ where: { id }, data });
  }
  delete(id: string) {
    return prisma.tag.delete({ where: { id } });
  }
}
export const tagsRepository = new TagsRepository();
