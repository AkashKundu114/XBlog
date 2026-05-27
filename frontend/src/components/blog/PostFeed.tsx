'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useInfinitePosts } from '@/hooks/usePosts';
import { PostCard } from './PostCard';
import { PostCardSkeleton } from './PostCardSkeleton';

interface PostFeedProps {
  category?: string;
  tag?: string;
}

export function PostFeed({ category, tag }: PostFeedProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfinitePosts({ category, tag });

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage(); },
      { threshold: 0.1 }
    );
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const posts = data?.pages.flatMap((p) => p.data) || [];

  if (isLoading) {
    return (
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => <PostCardSkeleton key={i} />)}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        <p className="text-2xl font-bold mb-2">No posts found</p>
        <p className="text-sm">Check back soon for new content.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.06, 0.4), duration: 0.4, ease: 'easeOut' }}
          >
            <PostCard post={post} />
          </motion.div>
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={bottomRef} className="flex justify-center mt-12 h-12">
        {isFetchingNextPage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading more...</span>
          </motion.div>
        )}
        {!hasNextPage && posts.length > 0 && (
          <p className="text-sm text-muted-foreground self-center">You&apos;ve seen all posts ✦</p>
        )}
      </div>
    </div>
  );
}
