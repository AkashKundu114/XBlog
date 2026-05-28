const { prisma } = require('../../database/client');
const { getPagination, buildMeta } = require('../../shared/utils/paginate');

class SearchService {
  async search(query, page = '1', limit = '10') {
    const pagination = getPagination({ page, limit });
    const where = {
      status: 'PUBLISHED',
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ],
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where, skip: pagination.skip, take: pagination.limit,
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
const searchService = new SearchService();
module.exports = { searchService };
