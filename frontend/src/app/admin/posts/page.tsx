'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Eye, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Post } from '@/types';

export default function AdminPostsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-posts', search, status],
    queryFn: () =>
      api.get('/posts', { params: { search: search || undefined, status: status || undefined, limit: 50 } })
        .then(r => r.data.data as Post[]),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/posts/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-posts'] }),
  });

  const handleDelete = (post: Post) => {
    if (confirm(`Delete "${post.title}"? This cannot be undone.`)) {
      deleteMutation.mutate(post.id);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black">Posts</h1>
        <Link href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search posts…"
            className="w-full pl-9 pr-4 py-2 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="px-3 py-2 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Title</th>
                <th className="text-left px-4 py-4 font-semibold text-muted-foreground hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-4 font-semibold text-muted-foreground hidden lg:table-cell">Author</th>
                <th className="text-left px-4 py-4 font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-4 py-4 font-semibold text-muted-foreground hidden lg:table-cell">Date</th>
                <th className="text-right px-6 py-4 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="h-5 bg-muted animate-pulse rounded-lg" />
                    </td>
                  </tr>
                ))
              ) : data?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-muted-foreground">
                    No posts found.{' '}
                    <Link href="/admin/posts/new" className="text-primary hover:underline">Create one</Link>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {data?.map(post => (
                    <motion.tr
                      key={post.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium line-clamp-1 max-w-xs">{post.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">/{post.slug}</p>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        {post.category ? (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                            style={{ backgroundColor: post.category.color + '22', color: post.category.color }}>
                            {post.category.name}
                          </span>
                        ) : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell text-muted-foreground">
                        {post.author.name}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          post.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : post.status === 'DRAFT' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-muted text-muted-foreground'
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell text-muted-foreground text-xs">
                        {formatDate(post.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {post.status === 'PUBLISHED' && (
                            <Link href={`/blog/${post.slug}`} target="_blank"
                              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                              <Eye className="w-4 h-4" />
                            </Link>
                          )}
                          <Link href={`/admin/posts/${post.id}/edit`}
                            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(post)}
                            className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
