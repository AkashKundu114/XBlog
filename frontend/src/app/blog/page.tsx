import { Suspense } from 'react';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import { PostFeed } from '@/components/blog/PostFeed';

interface BlogPageProps {
  searchParams: { category?: string; tag?: string };
}

export const metadata = {
  title: 'Blog — XBlog',
  description: 'Browse all posts on XBlog.',
};

export default function BlogPage({ searchParams }: BlogPageProps) {
  const { category, tag } = searchParams;

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tight mb-2">All Posts</h1>
        <p className="text-muted-foreground">Browse every article on XBlog.</p>
      </div>

      <div className="mb-8">
        <Suspense fallback={null}>
          <CategoryFilter />
        </Suspense>
      </div>

      <PostFeed category={category} tag={tag} />
    </section>
  );
}
