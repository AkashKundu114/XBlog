'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, Eye } from 'lucide-react';
import { Post } from '@/types';
import { formatDate, getInitials } from '@/lib/utils';
import { Badge } from '@/components/atoms/Badge';

export function PostCard({ post }: { post: Post }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group rounded-2xl border bg-card overflow-hidden hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 transition-shadow"
    >
      <Link href={`/blog/${post.slug}`}>
        {/* Cover Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <span className="text-4xl font-black text-muted-foreground/30">
                {post.title.charAt(0)}
              </span>
            </div>
          )}
          {post.featured && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-md text-xs">
                ✦ Featured
              </Badge>
            </div>
          )}
          {post.category && (
            <div className="absolute top-3 right-3">
              <Badge style={{ backgroundColor: post.category.color + 'cc', color: 'white' }} className="border-0 text-xs shadow-sm">
                {post.category.name}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h2 className="font-bold text-lg leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
              {post.excerpt}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              {post.author.avatar ? (
                <Image src={post.author.avatar} alt={post.author.name} width={24} height={24}
                  className="rounded-full object-cover" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {getInitials(post.author.name)}
                </div>
              )}
              <span className="text-xs font-medium text-muted-foreground">{post.author.name}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}m</span>
              {post.viewCount > 0 && (
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.viewCount}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
