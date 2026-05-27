'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import api from '@/lib/api';
import { Category } from '@/types';
import { QUERY_KEYS } from '@/lib/constants';

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', description: '', color: '#6366f1' });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', color: '' });

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: QUERY_KEYS.categories,
    queryFn: () => api.get('/categories').then(r => r.data.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof form) => api.post('/categories', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
      setForm({ name: '', description: '', color: '#6366f1' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof editForm }) => api.patch(`/categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
      setEditId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories }),
  });

  const startEdit = (cat: Category) => {
    setEditId(cat.id);
    setEditForm({ name: cat.name, description: cat.description || '', color: cat.color });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-black">Categories</h1>

      {/* Create form */}
      <div className="rounded-2xl border bg-card p-6">
        <h2 className="font-semibold mb-4">New Category</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Name" className="px-3 py-2 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Description (optional)" className="px-3 py-2 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <div className="flex gap-2">
            <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })}
              className="w-10 h-10 rounded-xl border cursor-pointer bg-background p-1" />
            <button onClick={() => createMutation.mutate(form)} disabled={!form.name || createMutation.isPending}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-muted animate-pulse rounded-xl" />)}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">No categories yet.</p>
        ) : (
          <ul className="divide-y">
            {categories.map(cat => (
              <li key={cat.id} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />

                {editId === cat.id ? (
                  <div className="flex-1 flex gap-2 items-center">
                    <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      className="flex-1 px-3 py-1.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    <input type="color" value={editForm.color} onChange={e => setEditForm({ ...editForm, color: e.target.value })}
                      className="w-8 h-8 rounded-lg border cursor-pointer bg-background p-0.5" />
                    <button onClick={() => updateMutation.mutate({ id: cat.id, data: editForm })}
                      className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditId(null)}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <p className="font-medium">{cat.name}</p>
                      {cat.description && <p className="text-xs text-muted-foreground">{cat.description}</p>}
                    </div>
                    <span className="text-xs text-muted-foreground">{cat._count?.posts ?? 0} posts</span>
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(cat)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => confirm(`Delete "${cat.name}"?`) && deleteMutation.mutate(cat.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
