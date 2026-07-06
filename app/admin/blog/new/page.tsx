import Link from 'next/link';
import { getData } from '@/lib/data';
import { redirect } from 'next/navigation';
import { createBlogPost } from '@/lib/data';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function NewBlogPostPage() {
  async function handleCreate(formData: FormData) {
    'use server';

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

  return (
    <>
      <div className="topbar-admin">
        <h2>New Blog Post</h2>
        <Link href="/admin/blog" className="btn btn-sm btn-secondary">← Back</Link>
      </div>
      <div className="page-content">
        <div className="card">
          <div className="card-body">
            <form action={handleCreate}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" name="title" className="form-control" placeholder="e.g., Emergency Lockout Tips for Orlando" required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" className="form-control">
                    <option value="Lockout Guides">Lockout Guides</option>
                    <option value="Automotive Keys">Automotive Keys</option>
                    <option value="Security Tips">Security Tips</option>
                    <option value="Company News">Company News</option>
                    <option value="Uncategorized">Uncategorized</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Tags (comma separated)</label>
                  <input type="text" name="tags" className="form-control" placeholder="Orlando, emergency, lockout" />
                </div>
              </div>

              <div className="form-group">
                <label>Meta Description (for SEO)</label>
                <textarea name="description" className="form-control" rows={2} placeholder="Brief description for search results..." required />
              </div>

              <div className="form-group">
                <label>Content (HTML)</label>
                <textarea name="content" className="form-control" rows={15} placeholder="<p>Write your blog content in HTML...</p>" required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <input type="checkbox" name="published" defaultChecked />
                    {' '}Publish immediately
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button type="submit" className="btn btn-primary">Create Post</button>
                <Link href="/admin/blog" className="btn btn-secondary">Cancel</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
