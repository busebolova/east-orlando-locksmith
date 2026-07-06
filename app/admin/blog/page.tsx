import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getData, saveData } from '@/lib/data';

async function handleDelete(formData: FormData) {
  'use server';
  const slug = formData.get('slug') as string;
  const data = await getData();
  data.blogPosts = data.blogPosts.filter((p) => p.slug !== slug);
  await saveData(data);
  redirect('/admin/blog');
}

export default async function AdminBlogPage() {
  const data = await getData();

  return (
    <>
      <div className="topbar-admin">
        <h2>Blog Management</h2>
        <Link href="/admin/blog/new" className="btn btn-primary">+ New Post</Link>
      </div>
      <div className="page-content">
        <div className="card">
          <div className="card-header">
            <h3>All Blog Posts</h3>
            <span style={{ fontSize: 13, color: '#6b7280' }}>{data.blogPosts.length} total</span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.blogPosts.map((post) => (
                  <tr key={post.id}>
                    <td style={{ fontWeight: 500 }}>{post.title}</td>
                    <td style={{ color: '#6b7280', fontSize: 13 }}>{post.slug}</td>
                    <td>
                      <span className="badge" style={{ background: '#e0e7ff', color: '#3730a3' }}>
                        {post.category}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${post.published ? 'badge-published' : 'badge-draft'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ color: '#6b7280', fontSize: 13 }}>{post.date}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <Link href={`/admin/blog/${post.id}`} className="btn btn-sm btn-secondary">Edit</Link>
                        <form action={handleDelete} onSubmit={(e) => {
                          if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) {
                            e.preventDefault();
                          }
                        }}>
                          <input type="hidden" name="slug" value={post.id} />
                          <button type="submit" className="btn btn-sm btn-danger">Delete</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {data.blogPosts.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">✦</div>
                <h3>No blog posts yet</h3>
                <p>Create your first blog post to get started.</p>
                <Link href="/admin/blog/new" className="btn btn-primary">Create Post</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
