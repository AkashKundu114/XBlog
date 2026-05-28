const { prisma } = require('../../database/client');

const postInclude = {
  author: { select: { id: true, name: true, avatar: true, bio: true } },
  category: { select: { id: true, name: true, slug: true, color: true } },
  tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
  _count: { select: { views: true, comments: true } },
};

class PostsRepository {
  async findMany({ page, limit, skip, status, categorySlug, tagSlug, search, featured, authorId }) {
    const where = {};
    if (status) where.status = status;
    if (featured !== undefined) where.featured = featured;
    if (authorId) where.authorId = authorId;
    if (categorySlug) where.category = { slug: categorySlug };
    if (tagSlug) where.tags = { some: { tag: { slug: tagSlug } } };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: postInclude,
        orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return { posts, total };
  }

  findBySlug(slug) {
    return prisma.post.findUnique({ where: { slug }, include: postInclude });
  }

  findById(id) {
    return prisma.post.findUnique({ where: { id }, include: postInclude });
  }

  create(data) {
    return prisma.post.create({ data, include: postInclude });
  }

  update(id, data) {
    return prisma.post.update({ where: { id }, data, include: postInclude });
  }

  delete(id) {
    return prisma.post.delete({ where: { id } });
  }

  incrementView(postId, visitorId) {
    return prisma.postView.upsert({
      where: { postId_visitorId: { postId, visitorId } },
      update: {},
      create: { postId, visitorId },
    });
  }
}

const postsRepository = new PostsRepository();
module.exports = { postsRepository };
