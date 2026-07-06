'use client';

import Link from 'next/link';
import { getBlogPost, saveBlogPost, getData } from '@/lib/data';
import { notFound, redirect } from 'next/navigation';
import { useEffect, useRef, useActionState, useState } from 'react';
import AIContentGenerator from '@/components/AIContentGenerator';

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const [post, setPost] = useState<{
    id: string; slug: string; title: string; description: string;
    content: string; category: string; tags: string[];
    published: boolean; date: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    params.then(async ({ id }) => {
      const { getBlogPost } = await import('@/lib/data');
      const p = await getBlogPost(id);
      if (!p) {
        notFound();
        return;
      }
      setPost(p);
      setLoading(false);
    });
  }, [params]);

  async function handleUpdate(_prev: unknown, formData: FormData) {
    'use server';
    const id = formData.get('postId') as string;
    if (!id) throw new Error('Missing postId');

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const tags = (formData.get('tags') as string || '').split(',').map(t => t.trim()).filter(Boolean);
    const published = formData.get('published') === 'on';

    const data = await getData();
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');

    await saveBlogPost(id, {
      title,
      slug,
      description,
      content,
      category,
      tags,
      published,
    });

    redirect('/admin/blog');
  }

  const [, formAction] = useActionState(handleUpdate, null);

  const handleAIContent = (content: string, title?: string, description?: string) => {
    if (title && titleRef.current) {
      titleRef.current.value = title;
    }
    if (description && descRef.current) {
      descRef.current.value = description;
    }
    if (contentRef.current) {
      contentRef.current.value = content;
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <p>Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="page-content">
        <p>Post not found.</p>
        <Link href="/admin/blog" className="btn btn-secondary">← Back</Link>
      </div>
    );
  }

  return (
    <>
      <div className="topbar-admin">
        <h2>Edit Post</h2>
        <Link href="/admin/blog" className="btn btn-sm btn-secondary">← Back</Link>
      </div>
      <div className="page-content">
        <div className="card">
          <div className="card-body">
            <form action={formAction}>
              <input type="hidden" name="postId" value={post.id} />
              <div className="form-group">
                <label>Title</label>
                <input ref={titleRef} type="text" name="title" className="form-control" defaultValue={post.title} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Slug</label>
                  <input type="text" className="form-control" value={post.slug} disabled style={{ opacity: 0.6 }} />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input type="text" className="form-control" value={post.date} disabled style={{ opacity: 0.6 }} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" className="form-control" defaultValue={post.category}>
                    <option value="Lockout Guides">Lockout Guides</option>
                    <option value="Automotive Keys">Automotive Keys</option>
                    <option value="Security Tips">Security Tips</option>
                    <option value="Company News">Company News</option>
                    <option value="Uncategorized">Uncategorized</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Tags (comma separated)</label>
                  <input type="text" name="tags" className="form-control" defaultValue={post.tags.join(', ')} placeholder="Orlando, emergency, lockout" />
                </div>
              </div>

              <div className="form-group">
                <label>Meta Description (SEO)</label>
                <textarea ref={descRef} name="description" className="form-control" rows={2} defaultValue={post.description} required />
              </div>

              <AIContentGenerator onContentGenerated={handleAIContent} initialPrompt="" />

              <div className="form-group">
                <label>Content (HTML)</label>
                <textarea ref={contentRef} name="content" className="form-control" rows={20} defaultValue={post.content} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <input type="checkbox" name="published" defaultChecked={post.published} />
                    {' '}Published
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <Link href="/admin/blog" className="btn btn-secondary">Cancel</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
