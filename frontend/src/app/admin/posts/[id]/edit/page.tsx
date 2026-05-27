'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { PostEditor } from '@/components/editor/PostEditor';
import api from '@/lib/api';

interface EditPostPageProps {
  params: { id: string };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const { id } = params;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => api.get(`/posts/${id}`).then(r => r.data.data),
  });

  const mutation = useMutation({
    mutationFn: (data: any) => api.patch(`/posts/${id}`, data).then(r => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-xl" />
        <div className="h-[600px] bg-muted animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!post) return <p className="text-muted-foreground">Post not found.</p>;

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/posts"
          className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-black line-clamp-1">Edit: {post.title}</h1>
          <p className="text-sm text-muted-foreground">Last updated {new Date(post.updatedAt).toLocaleString()}</p>
        </div>
        {post.status === 'PUBLISHED' && (
          <Link href={`/blog/${post.slug}`} target="_blank"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> View live
          </Link>
        )}
      </div>

      {mutation.error && (
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm">
          {(mutation.error as Error).message}
        </div>
      )}

      {mutation.isSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm">
          Post saved successfully ✓
        </div>
      )}

      <PostEditor
        initialData={post}
        onSave={async (data) => mutation.mutateAsync(data)}
        isSaving={mutation.isPending}
      />
    </div>
  );
}
