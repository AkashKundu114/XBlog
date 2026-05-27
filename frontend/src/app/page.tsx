import { Suspense } from 'react';
import { HeroSection } from '@/components/blog/HeroSection';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import { PostFeed } from '@/components/blog/PostFeed';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Latest Posts</h2>
            <p className="mt-2 text-muted-foreground">Browse fresh writing from the XBlog team.</p>
          </div>
        </div>
        <div className="mb-8">
          <Suspense fallback={null}>
            <CategoryFilter />
          </Suspense>
        </div>
        <PostFeed />
      </section>
    </>
  );
}
