import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ArticleBody } from '@/components/blog/ArticleBody';
import { PostMeta } from '@/components/blog/PostMeta';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { ReadingProgress } from '@/components/atoms/ReadingProgress';
import { Badge } from '@/components/atoms/Badge';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getPost(slug: string) {
  const res = await fetch(`${API_URL}/posts/slug/${slug}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Post not found' };
  return {
    title: `${post.title} — XBlog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <>
      <ReadingProgress />

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back link */}
        <Link href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {/* Category + tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {post.category && (
            <Badge style={{ backgroundColor: post.category.color + 'cc', color: 'white' }} className="border-0">
              {post.category.name}
            </Badge>
          )}
          {post.tags?.map((tag: { id: string; name: string }) => (
            <Badge key={tag.id} variant="outline">#{tag.name}</Badge>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-6">
          {post.title}
        </h1>

        {/* Meta */}
        <PostMeta post={post} />
        <ShareButtons title={post.title} />

        {/* Cover image */}
        {post.coverImage && (
          <div className="relative aspect-[21/9] mt-8 rounded-2xl overflow-hidden">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        {/* Body */}
        <div className="mt-10">
          <ArticleBody content={post.content} />
        </div>

        {/* Bottom share */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-2">Enjoyed this article? Share it.</p>
          <ShareButtons title={post.title} />
        </div>
      </article>
    </>
  );
}
