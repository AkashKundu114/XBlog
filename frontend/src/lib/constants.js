export const QUERY_KEYS = {
  posts: ['posts'],
  post: (slug) => ['posts', slug],
  postById: (id) => ['posts', 'id', id],
  categories: ['categories'],
  tags: ['tags'],
  analytics: ['analytics'],
  search: (q) => ['search', q],
};

export const SITE_CONFIG = {
  name: 'DevBlog',
  description: 'A premium blog platform for developers and designers.',
  url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
};

export const POSTS_PER_PAGE = 9;
