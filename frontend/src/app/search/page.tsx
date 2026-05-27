'use client';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Clock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { formatDate, getInitials } from '@/lib/utils';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedQuery(query), 400);
    return () => window.clearTimeout(timeout);
  }, [query]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const { data, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () =>
      api.get('/search', { params: { q: debouncedQuery, limit: 20 } }).then(r => r.data.data),
    enabled: debouncedQuery.trim().length > 1,
  });

  return (
    <section className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-4xl font-black tracking-tight mb-8">Search</h1>

      {/* Search input */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          autoFocus
          type="search"
          value={query}
          onChange={handleChange}
          placeholder="Search posts, topics…"
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border bg-card text-base focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {debouncedQuery.trim().length > 1 && (
          <motion.div
            key={debouncedQuery}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {data?.length === 0 && (
              <p className="text-center text-muted-foreground py-12">
                No results for &ldquo;{debouncedQuery}&rdquo;
              </p>
            )}

            <ul className="space-y-4">
              {data?.map((post: any) => (
                <li key={post.id}>
                  <Link href={`/blog/${post.slug}`}
                    className="flex gap-4 p-4 rounded-2xl border bg-card hover:shadow-md transition-shadow group">
                    {post.coverImage && (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                        <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">{post.excerpt}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          {post.author?.avatar ? (
                            <Image src={post.author.avatar} alt={post.author.name} width={14} height={14}
                              className="rounded-full" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-[8px] font-bold">
                              {getInitials(post.author?.name || 'U')}
                            </div>
                          )}
                          {post.author?.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {post.readTime}m
                        </span>
                        {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
                        {post.category && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                            style={{ backgroundColor: post.category.color + '22', color: post.category.color }}>
                            {post.category.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {!debouncedQuery && (
        <p className="text-center text-muted-foreground py-16">
          Start typing to search all posts…
        </p>
      )}
    </section>
  );
}
