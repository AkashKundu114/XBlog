import { PostStatus } from '@prisma/client';
import { postsRepository } from './posts.repository';
import { ApiError } from '../../shared/utils/ApiError';
import { generateUniqueSlug } from '../../shared/utils/slugify';
import { calculateReadTime } from '../../shared/utils/readTime';
import { getPagination, buildMeta } from '../../shared/utils/paginate';

export class PostsService {
  async getPosts(query: any) {
    const { page, limit, skip } = getPagination(query);
    const { posts, total } = await postsRepository.findMany({
      page, limit, skip,
      status: query.status,
      categorySlug: query.category,
      tagSlug: query.tag,
      search: query.search,
      featured: query.featured === 'true' ? true : undefined,
    });

    const formatted = posts.map(this.formatPost);
    return { posts: formatted, meta: buildMeta(total, page, limit) };
  }

  async getPostBySlug(slug: string) {
    const post = await postsRepository.findBySlug(slug);
    if (!post) throw ApiError.notFound('Post not found');
    return this.formatPost(post);
  }

  async getPostById(id: string) {
    const post = await postsRepository.findById(id);
    if (!post) throw ApiError.notFound('Post not found');
    return this.formatPost(post);
  }

  async createPost(data: any, authorId: string) {
    const { tagIds, ...postData } = data;
    const slug = await generateUniqueSlug(postData.title);
    const readTime = calculateReadTime(postData.content);
    const publishedAt = postData.status === PostStatus.PUBLISHED ? new Date() : undefined;

    const post = await postsRepository.create({
      ...postData,
      slug,
      readTime,
      publishedAt,
      author: { connect: { id: authorId } },
      ...(postData.categoryId && { category: { connect: { id: postData.categoryId } } }),
      ...(tagIds?.length && {
        tags: { create: tagIds.map((tagId: string) => ({ tag: { connect: { id: tagId } } })) },
      }),
    });
    return this.formatPost(post);
  }

  async updatePost(id: string, data: any) {
    const existing = await postsRepository.findById(id);
    if (!existing) throw ApiError.notFound('Post not found');

    const { tagIds, categoryId, ...postData } = data;
    const updates: any = { ...postData };

    if (postData.title && postData.title !== existing.title) {
      updates.slug = await generateUniqueSlug(postData.title, id);
    }
    if (postData.content) {
      updates.readTime = calculateReadTime(postData.content);
    }
    if (postData.status === PostStatus.PUBLISHED && !existing.publishedAt) {
      updates.publishedAt = new Date();
    }
    if (categoryId !== undefined) {
      updates.category = categoryId ? { connect: { id: categoryId } } : { disconnect: true };
    }
    if (tagIds !== undefined) {
      updates.tags = { deleteMany: {}, create: tagIds.map((tagId: string) => ({ tag: { connect: { id: tagId } } })) };
    }

    const post = await postsRepository.update(id, updates);
    return this.formatPost(post);
  }

  async deletePost(id: string) {
    const existing = await postsRepository.findById(id);
    if (!existing) throw ApiError.notFound('Post not found');
    await postsRepository.delete(id);
  }

  async trackView(postId: string, visitorId: string) {
    const post = await postsRepository.findById(postId);
    if (!post) return;
    await postsRepository.incrementView(postId, visitorId).catch(() => {});
  }

  private formatPost(post: any) {
    return {
      ...post,
      tags: post.tags?.map((pt: any) => pt.tag) || [],
      viewCount: post._count?.views || 0,
      commentCount: post._count?.comments || 0,
      _count: undefined,
    };
  }
}

export const postsService = new PostsService();
