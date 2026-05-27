import { Prisma, PostStatus } from '@prisma/client';
import { prisma } from '../../database/client';

const postInclude = {
  author: { select: { id: true, name: true, avatar: true, bio: true } },
  category: { select: { id: true, name: true, slug: true, color: true } },
  tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
  _count: { select: { views: true, comments: true } },
};

export interface FindPostsQuery {
  page: number;
  limit: number;
  skip: number;
  status?: PostStatus;
  categorySlug?: string;
  tagSlug?: string;
  search?: string;
  featured?: boolean;
  authorId?: string;
}

export class PostsRepository {
  async findMany(query: FindPostsQuery) {
    const where: Prisma.PostWhereInput = {};

    if (query.status) where.status = query.status;
    if (query.featured !== undefined) where.featured = query.featured;
    if (query.authorId) where.authorId = query.authorId;
    if (query.categorySlug) where.category = { slug: query.categorySlug };
    if (query.tagSlug) where.tags = { some: { tag: { slug: query.tagSlug } } };
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { excerpt: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: postInclude,
        orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
        skip: query.skip,
        take: query.limit,
      }),
      prisma.post.count({ where }),
    ]);

    return { posts, total };
  }

  async findBySlug(slug: string) {
    return prisma.post.findUnique({ where: { slug }, include: postInclude });
  }

  async findById(id: string) {
    return prisma.post.findUnique({ where: { id }, include: postInclude });
  }

  async create(data: Prisma.PostCreateInput) {
    return prisma.post.create({ data, include: postInclude });
  }

  async update(id: string, data: Prisma.PostUpdateInput) {
    return prisma.post.update({ where: { id }, data, include: postInclude });
  }

  async delete(id: string) {
    return prisma.post.delete({ where: { id } });
  }

  async incrementView(postId: string, visitorId: string) {
    return prisma.postView.upsert({
      where: { postId_visitorId: { postId, visitorId } },
      update: {},
      create: { postId, visitorId },
    });
  }
}

export const postsRepository = new PostsRepository();
