import Image from 'next/image';
import { Calendar, Clock, Eye } from 'lucide-react';
import { Post } from '@/types';
import { formatDate, getInitials } from '@/lib/utils';

export function PostMeta({ post }: { post: Post }) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      {/* Author */}
      <div className="flex items-center gap-2">
        {post.author.avatar ? (
          <Image src={post.author.avatar} alt={post.author.name} width={28} height={28}
            className="rounded-full object-cover" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            {getInitials(post.author.name)}
          </div>
        )}
        <span className="font-medium text-foreground">{post.author.name}</span>
      </div>

      {/* Date */}
      {post.publishedAt && (
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(post.publishedAt)}</span>
        </div>
      )}

      {/* Read time */}
      <div className="flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5" />
        <span>{post.readTime} min read</span>
      </div>

      {/* Views */}
      {post.viewCount > 0 && (
        <div className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5" />
          <span>{post.viewCount.toLocaleString()} views</span>
        </div>
      )}
    </div>
  );
}
