'use client';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { FileText, Eye, FolderOpen, Tag, TrendingUp, Plus } from 'lucide-react';
import { AnalyticsCard } from '@/components/admin/AnalyticsCard';
import { QUERY_KEYS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { AnalyticsOverview } from '@/types';
import api from '@/lib/api';

export default function DashboardPage() {
  const { data, isLoading } = useQuery<AnalyticsOverview>({
    queryKey: QUERY_KEYS.analytics,
    queryFn: () => api.get('/analytics/overview').then(r => r.data.data),
  });

  const cards = [
    { title: 'Total Posts', value: data?.totalPosts ?? 0, icon: FileText, color: '#6366f1' },
    { title: 'Published', value: data?.publishedPosts ?? 0, icon: TrendingUp, color: '#10b981' },
    { title: 'Total Views', value: data?.totalViews ?? 0, icon: Eye, color: '#f59e0b' },
    { title: 'Categories', value: data?.totalCategories ?? 0, icon: FolderOpen, color: '#3b82f6' },
    { title: 'Tags', value: data?.totalTags ?? 0, icon: Tag, color: '#8b5cf6' },
    { title: 'Drafts', value: data?.draftPosts ?? 0, icon: FileText, color: '#64748b' },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Your blog at a glance.</p>
        </div>
        <Link href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map(card => (
          <AnalyticsCard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent posts */}
        <div className="rounded-2xl border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Recent Posts</h2>
            <Link href="/admin/posts" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <ul className="space-y-3">
              {data?.recentPosts.map(post => (
                <li key={post.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{post.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    post.status === 'PUBLISHED'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {post.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Top posts by views */}
        <div className="rounded-2xl border bg-card p-6">
          <h2 className="font-bold text-lg mb-4">Top Posts</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="h-10 rounded-xl bg-muted animate-pulse" />)}
            </div>
          ) : (
            <ul className="space-y-3">
              {data?.topPosts.map((post, i) => (
                <li key={post.id} className="flex items-center gap-3">
                  <span className="w-5 text-xs font-bold text-muted-foreground">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <Link href={`/blog/${post.slug}`} target="_blank"
                      className="text-sm font-medium line-clamp-1 hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="w-3 h-3" /> {post._count.views}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
