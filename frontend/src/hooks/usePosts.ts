import { useInfiniteQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { QUERY_KEYS } from '@/lib/constants';
import { ApiResponse, Post } from '@/types';

interface UsePostsParams {
  category?: string;
  tag?: string;
  featured?: boolean;
  limit?: number;
}

export function useInfinitePosts({ category, tag, featured, limit = 9 }: UsePostsParams = {}) {
  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.posts, { category, tag, featured, limit }],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await api.get<ApiResponse<Post[]>>('/posts', {
        params: { page: pageParam, limit, category, tag, featured },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta || lastPage.meta.page >= lastPage.meta.totalPages) return undefined;
      return lastPage.meta.page + 1;
    },
  });
}
