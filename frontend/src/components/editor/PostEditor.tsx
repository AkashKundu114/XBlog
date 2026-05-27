'use client';
import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useQuery } from '@tanstack/react-query';
import {
  Bold, Italic, UnderlineIcon, Link2, Code, Quote,
  List, ListOrdered, Heading2, Heading3, Image as ImageIcon,
  Save, Eye, EyeOff, Loader2
} from 'lucide-react';
import api from '@/lib/api';
import { QUERY_KEYS } from '@/lib/constants';
import { Category, Tag, Post } from '@/types';
import { cn } from '@/lib/utils';

const lowlight = createLowlight(common);

interface PostEditorProps {
  initialData?: Post;
  onSave: (data: any) => Promise<void>;
  isSaving?: boolean;
}

export function PostEditor({ initialData, onSave, isSaving }: PostEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>(initialData?.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT');
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [categoryId, setCategoryId] = useState(initialData?.category?.id || '');
  const [tagIds, setTagIds] = useState<string[]>(initialData?.tags?.map(t => t.id) || []);
  const [preview, setPreview] = useState(false);

  const { data: categories } = useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: () => api.get<{ data: Category[] }>('/categories').then(r => r.data.data),
  });

  const { data: tags } = useQuery({
    queryKey: QUERY_KEYS.tags,
    queryFn: () => api.get<{ data: Tag[] }>('/tags').then(r => r.data.data),
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Placeholder.configure({ placeholder: 'Start writing your post… Use / for commands.' }),
      Underline,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: false, allowBase64: true }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: initialData?.content || '',
    editorProps: { attributes: { class: 'ProseMirror focus:outline-none' } },
  });

  const handleSave = async (saveStatus = status) => {
    if (!editor || !title.trim()) return;
    await onSave({
      title, excerpt, coverImage, status: saveStatus,
      featured, categoryId: categoryId || null,
      tagIds, content: editor.getHTML(),
    });
  };

  const toggleTag = (id: string) => setTagIds(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);

  const toolbarBtn = (active: boolean, action: () => void, icon: React.ReactNode, title: string) => (
    <button type="button" onClick={action} title={title}
      className={cn('p-2 rounded-lg transition-colors text-sm', active ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground hover:text-foreground')}>
      {icon}
    </button>
  );

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-6">
      {/* Main editor */}
      <div className="space-y-4">
        {/* Title */}
        <div className="rounded-2xl border bg-card p-6">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Post title…"
            className="w-full text-3xl font-black placeholder:text-muted-foreground/50 bg-transparent focus:outline-none resize-none"
          />
        </div>

        {/* Toolbar + Editor */}
        <div className="rounded-2xl border bg-card overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-1 p-3 border-b bg-muted/30">
            {editor && <>
              {toolbarBtn(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), <Bold className="w-4 h-4" />, 'Bold')}
              {toolbarBtn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), <Italic className="w-4 h-4" />, 'Italic')}
              {toolbarBtn(editor.isActive('underline'), () => editor.chain().focus().toggleUnderline().run(), <UnderlineIcon className="w-4 h-4" />, 'Underline')}
              <div className="w-px h-5 bg-border mx-1" />
              {toolbarBtn(editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 className="w-4 h-4" />, 'H2')}
              {toolbarBtn(editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), <Heading3 className="w-4 h-4" />, 'H3')}
              <div className="w-px h-5 bg-border mx-1" />
              {toolbarBtn(editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), <List className="w-4 h-4" />, 'Bullet List')}
              {toolbarBtn(editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered className="w-4 h-4" />, 'Ordered List')}
              {toolbarBtn(editor.isActive('blockquote'), () => editor.chain().focus().toggleBlockquote().run(), <Quote className="w-4 h-4" />, 'Quote')}
              {toolbarBtn(editor.isActive('codeBlock'), () => editor.chain().focus().toggleCodeBlock().run(), <Code className="w-4 h-4" />, 'Code Block')}
              <div className="w-px h-5 bg-border mx-1" />
              <button type="button"
                onClick={() => { const url = prompt('Image URL:'); if (url) editor.chain().focus().setImage({ src: url }).run(); }}
                className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <ImageIcon className="w-4 h-4" />
              </button>
              <button type="button"
                onClick={() => { const url = prompt('Link URL:'); if (url) editor.chain().focus().setLink({ href: url }).run(); }}
                className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <Link2 className="w-4 h-4" />
              </button>
            </>}
            <div className="ml-auto">
              <button type="button" onClick={() => setPreview(!preview)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-muted transition-colors text-muted-foreground">
                {preview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {preview ? 'Edit' : 'Preview'}
              </button>
            </div>
          </div>

          {/* Editor */}
          <div className="p-6 min-h-[500px]">
            {preview ? (
              <div className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }} />
            ) : (
              <EditorContent editor={editor} />
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Publish */}
        <div className="rounded-2xl border bg-card p-5">
          <h3 className="font-semibold mb-4">Publish</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured" checked={featured} onChange={e => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded accent-primary" />
              <label htmlFor="featured" className="text-sm">Featured post</label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="button" onClick={() => handleSave('DRAFT')} disabled={isSaving}
              className="flex-1 py-2 px-3 rounded-xl border text-sm font-medium hover:bg-muted transition-colors disabled:opacity-60">
              Save Draft
            </button>
            <button type="button" onClick={() => handleSave('PUBLISHED')} disabled={isSaving}
              className="flex-1 py-2 px-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-1.5">
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {isSaving ? 'Saving…' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Cover Image */}
        <div className="rounded-2xl border bg-card p-5">
          <h3 className="font-semibold mb-3">Cover Image</h3>
          <input value={coverImage} onChange={e => setCoverImage(e.target.value)}
            placeholder="https://... or Cloudinary URL"
            className="w-full px-3 py-2 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
          {coverImage && (
            <img src={coverImage} alt="Cover preview" className="mt-3 w-full rounded-xl object-cover aspect-video" />
          )}
        </div>

        {/* Excerpt */}
        <div className="rounded-2xl border bg-card p-5">
          <h3 className="font-semibold mb-3">Excerpt</h3>
          <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={3}
            placeholder="Brief summary of the post…"
            className="w-full px-3 py-2 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none transition-all" />
        </div>

        {/* Category */}
        <div className="rounded-2xl border bg-card p-5">
          <h3 className="font-semibold mb-3">Category</h3>
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">No category</option>
            {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Tags */}
        <div className="rounded-2xl border bg-card p-5">
          <h3 className="font-semibold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-1.5">
            {tags?.map(tag => (
              <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)}
                className={cn(
                  'px-2.5 py-1 rounded-full text-xs font-medium transition-all border',
                  tagIds.includes(tag.id) ? 'bg-primary text-primary-foreground border-primary' : 'hover:border-primary/50'
                )}>
                #{tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
