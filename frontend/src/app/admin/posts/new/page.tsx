'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { PostEditor } from '@/components/editor/PostEditor';
import api from '@/lib/api';

export default function NewPostPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: any) => api.post('/posts', data).then(r => r.data.data),
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      router.push(`/admin/posts/${post.id}/edit`);
    },
  });

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/posts"
          className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black">New Post</h1>
          <p className="text-sm text-muted-foreground">Draft auto-saves when you click Save Draft.</p>
        </div>
      </div>

      {mutation.error && (
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm">
          {(mutation.error as Error).message}
        </div>
      )}

      <PostEditor
        onSave={async (data) => mutation.mutateAsync(data)}
        isSaving={mutation.isPending}
      />
    </div>
  );
}
