'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useInfinitePosts } from '@/hooks/usePosts';
import { PostCardSkeleton } from './PostCardSkeleton';

export function HeroSection() {
  const { data, isLoading } = useInfinitePosts({ featured: true });
  const featured = data?.pages[0]?.data[0];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-16 pb-8">
        <PostCardSkeleton />
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-purple-50/30 to-transparent dark:from-blue-950/20 dark:via-purple-950/10 dark:to-transparent">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 relative">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" /> Premium Tech Blog
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
            <span className="text-gradient">Ideas Worth</span>
            <br />
            <span className="text-foreground">Reading.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Deep dives into technology, design, and software development. Written by practitioners, for practitioners.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex items-center justify-center gap-4"
          >
            <Link href="/blog"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 flex items-center gap-2">
              Start Reading <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/search"
              className="px-6 py-3 rounded-xl font-semibold border hover:bg-muted transition-colors">
              Search Posts
            </Link>
          </motion.div>
        </motion.div>

        {/* Featured post */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border bg-card">
                <div className="relative aspect-[21/9] md:aspect-[3/1]">
                  {featured.coverImage && (
                    <Image src={featured.coverImage} alt={featured.title} fill
                      className="object-cover group-hover:scale-103 transition-transform duration-700" priority />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm">
                        ✦ Featured
                      </span>
                      {featured.category && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: featured.category.color + '99' }}>
                          {featured.category.name}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl md:text-4xl font-black leading-tight mb-3 group-hover:text-blue-200 transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-white/70 text-sm md:text-base line-clamp-2 max-w-3xl">{featured.excerpt}</p>
                    <div className="mt-4 flex items-center gap-4 text-white/60 text-sm">
                      <span>{featured.author.name}</span>
                      <span>·</span>
                      <span>{featured.readTime} min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
