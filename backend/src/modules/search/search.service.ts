import { prisma } from '../../database/client';
import { getPagination, buildMeta } from '../../shared/utils/paginate';

export class SearchService {
  async search(query: string, page = '1', limit = '10') {
    const { skip, ...pagination } = getPagination({ page, limit });

    const where = {
      status: 'PUBLISHED' as const,
      OR: [
        { title: { contains: query, mode: 'insensitive' as const } },
        { excerpt: { contains: query, mode: 'insensitive' as const } },
        { content: { contains: query, mode: 'insensitive' as const } },
      ],
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: pagination.limit,
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true, title: true, slug: true, excerpt: true,
          coverImage: true, readTime: true, publishedAt: true,
          author: { select: { name: true, avatar: true } },
          category: { select: { name: true, slug: true, color: true } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return { posts, meta: buildMeta(total, pagination.page, pagination.limit) };
  }
}
export const searchService = new SearchService();
