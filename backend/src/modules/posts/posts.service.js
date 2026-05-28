const { postsRepository } = require('./posts.repository');
const { ApiError } = require('../../shared/utils/ApiError');
const { generateUniqueSlug } = require('../../shared/utils/slugify');
const { calculateReadTime } = require('../../shared/utils/readTime');
const { getPagination, buildMeta } = require('../../shared/utils/paginate');

class PostsService {
  async getPosts(query) {
    const { page, limit, skip } = getPagination(query);
    const { posts, total } = await postsRepository.findMany({
      page, limit, skip,
      status: query.status,
      categorySlug: query.category,
      tagSlug: query.tag,
      search: query.search,
      featured: query.featured === 'true' ? true : undefined,
    });
    return { posts: posts.map(this.formatPost), meta: buildMeta(total, page, limit) };
  }

  async getPostBySlug(slug) {
    const post = await postsRepository.findBySlug(slug);
    if (!post) throw ApiError.notFound('Post not found');
    return this.formatPost(post);
  }

  async getPostById(id) {
    const post = await postsRepository.findById(id);
    if (!post) throw ApiError.notFound('Post not found');
    return this.formatPost(post);
  }

  async createPost(data, authorId) {
    const { tagIds, ...postData } = data;
    const slug = await generateUniqueSlug(postData.title);
    const readTime = calculateReadTime(postData.content);
    const publishedAt = postData.status === 'PUBLISHED' ? new Date() : undefined;

    const post = await postsRepository.create({
      ...postData,
      slug,
      readTime,
      publishedAt,
      author: { connect: { id: authorId } },
      ...(postData.categoryId && { category: { connect: { id: postData.categoryId } } }),
      ...(tagIds?.length && {
        tags: { create: tagIds.map(tagId => ({ tag: { connect: { id: tagId } } })) },
      }),
    });
    return this.formatPost(post);
  }

  async updatePost(id, data) {
    const existing = await postsRepository.findById(id);
    if (!existing) throw ApiError.notFound('Post not found');

    const { tagIds, categoryId, ...postData } = data;
    const updates = { ...postData };

    if (postData.title && postData.title !== existing.title) {
      updates.slug = await generateUniqueSlug(postData.title, id);
    }
    if (postData.content) {
      updates.readTime = calculateReadTime(postData.content);
    }
    if (postData.status === 'PUBLISHED' && !existing.publishedAt) {
      updates.publishedAt = new Date();
    }
    if (categoryId !== undefined) {
      updates.category = categoryId ? { connect: { id: categoryId } } : { disconnect: true };
    }
    if (tagIds !== undefined) {
      updates.tags = { deleteMany: {}, create: tagIds.map(tagId => ({ tag: { connect: { id: tagId } } })) };
    }

    const post = await postsRepository.update(id, updates);
    return this.formatPost(post);
  }

  async deletePost(id) {
    const existing = await postsRepository.findById(id);
    if (!existing) throw ApiError.notFound('Post not found');
    await postsRepository.delete(id);
  }

  async trackView(postId, visitorId) {
    const post = await postsRepository.findById(postId);
    if (!post) return;
    postsRepository.incrementView(postId, visitorId).catch(() => {});
  }

  formatPost(post) {
    return {
      ...post,
      tags: post.tags?.map(pt => pt.tag) || [],
      viewCount: post._count?.views || 0,
      commentCount: post._count?.comments || 0,
      _count: undefined,
    };
  }
}

const postsService = new PostsService();
module.exports = { postsService };
