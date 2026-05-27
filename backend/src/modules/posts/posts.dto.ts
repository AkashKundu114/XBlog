import { z } from 'zod';

export const CreatePostDto = z.object({
  body: z.object({
    title: z.string().min(3).max(200),
    content: z.string().min(1),
    excerpt: z.string().max(500).optional(),
    coverImage: z.string().url().optional().or(z.literal('')),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
    featured: z.boolean().default(false),
    categoryId: z.string().optional(),
    tagIds: z.array(z.string()).optional(),
  }),
});

export const UpdatePostDto = z.object({
  body: z.object({
    title: z.string().min(3).max(200).optional(),
    content: z.string().min(1).optional(),
    excerpt: z.string().max(500).optional(),
    coverImage: z.string().url().optional().or(z.literal('')),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    featured: z.boolean().optional(),
    categoryId: z.string().nullable().optional(),
    tagIds: z.array(z.string()).optional(),
  }),
  params: z.object({ id: z.string() }),
});

export const PostQueryDto = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    category: z.string().optional(),
    tag: z.string().optional(),
    search: z.string().optional(),
    featured: z.string().optional(),
  }),
});
