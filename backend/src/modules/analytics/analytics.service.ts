import { prisma } from '../../database/client';

export class AnalyticsService {
  async getOverview() {
    const [totalPosts, publishedPosts, draftPosts, totalViews, totalCategories, totalTags, recentPosts] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.post.count({ where: { status: 'DRAFT' } }),
      prisma.postView.count(),
      prisma.category.count(),
      prisma.tag.count(),
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, title: true, slug: true, status: true, createdAt: true,
          coverImage: true,
          _count: { select: { views: true } },
          category: { select: { name: true, color: true } },
        },
      }),
    ]);

    const topPosts = await prisma.post.findMany({
      take: 5,
      where: { status: 'PUBLISHED' },
      orderBy: { views: { _count: 'desc' } },
      select: { id: true, title: true, slug: true, _count: { select: { views: true } } },
    });

    return { totalPosts, publishedPosts, draftPosts, totalViews, totalCategories, totalTags, recentPosts, topPosts };
  }
}
export const analyticsService = new AnalyticsService();
