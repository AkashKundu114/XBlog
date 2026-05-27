'use client';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { QUERY_KEYS } from '@/lib/constants';
import { Category } from '@/types';

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get('category') || '';

  const { data: categories } = useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: () => api.get<{ data: Category[] }>('/categories').then(r => r.data.data),
  });

  const handleSelect = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set('category', slug);
    else params.delete('category');
    router.push(`/blog?${params.toString()}`);
  };

  const all = [{ slug: '', name: 'All Posts', color: '#6366f1' }, ...(categories || [])];

  return (
    <div className="flex flex-wrap gap-2">
      {all.map((cat) => {
        const isActive = cat.slug === active;
        return (
          <motion.button
            key={cat.slug}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect(cat.slug)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              backgroundColor: isActive ? cat.color : undefined,
              color: isActive ? 'white' : undefined,
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: isActive ? cat.color : 'hsl(var(--border))',
            }}
          >
            {cat.name}
          </motion.button>
        );
      })}
    </div>
  );
}
