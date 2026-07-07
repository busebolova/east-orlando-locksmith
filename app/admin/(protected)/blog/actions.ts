'use server';

import { redirect } from 'next/navigation';
import { createBlogPost, getData, saveBlogPost } from '@/lib/data';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const content = formData.get('content') as string;
  const category = formData.get('category') as string;
  const tags = (formData.get('tags') as string || '').split(',').map(t => t.trim()).filter(Boolean);
  const published = formData.get('published') === 'on';

  const slug = slugify(title);
  const id = slug;
  const date = new Date().toISOString().split('T')[0];

  await createBlogPost({
    id,
    slug,
    title,
    description,
    content,
    category: category || 'Uncategorized',
    tags,
    published,
    date,
  });

  redirect('/admin/blog');
}

export async function updatePost(formData: FormData) {
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
