import Link from 'next/link';
import { getBlogPost, saveBlogPost, getData } from '@/lib/data';
import { notFound, redirect } from 'next/navigation';

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) {
    notFound();
  }

  async function handleUpdate(formData: FormData) {
    'use server';
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

  return (
    <>
      <div className="topbar-admin">
        <h2>Edit Post</h2>
        <Link href="/admin/blog" className="btn btn-sm btn-secondary">← Back</Link>
      </div>
      <div className="page-content">
        <div className="card">
          <div className="card-body">
            <form action={handleUpdate}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" name="title" className="form-control" defaultValue={post.title} required />
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
                <textarea name="description" className="form-control" rows={2} defaultValue={post.description} required />
              </div>

              <div className="form-group">
                <label>Content (HTML)</label>
                <textarea name="content" className="form-control" rows={20} defaultValue={post.content} required />
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
