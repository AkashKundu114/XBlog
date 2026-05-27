export const SITE_CONFIG = {
  name: 'XBlog',
  description: 'Deep dives into technology, design, and software development.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};

export const QUERY_KEYS = {
  posts: ['posts'] as const,
  featuredPosts: ['posts', 'featured'] as const,
  categories: ['categories'] as const,
  tags: ['tags'] as const,
  analytics: ['analytics'] as const,
};
