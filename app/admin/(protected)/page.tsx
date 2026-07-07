import Link from 'next/link';
import { getData } from '@/lib/data';

export default async function AdminDashboard() {
  const data = await getData();
  const totalPages = data.pages.filter(p => p.published).length;
  const totalBlog = data.blogPosts.filter(p => p.published).length;
  const draftBlog = data.blogPosts.filter(p => !p.published).length;

  return (
    <>
      <div className="topbar-admin">
        <h2>Dashboard</h2>
        <span style={{ fontSize: 13, color: '#6b7280' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
      <div className="page-content">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Pages</div>
            <div className="stat-value">{totalPages}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Published Posts</div>
            <div className="stat-value">{totalBlog}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Draft Posts</div>
            <div className="stat-value">{draftBlog}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Phone</div>
            <div className="stat-value" style={{ fontSize: 18 }}>{data.phone}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <Link href="/admin/blog/new" className="quick-action-btn">
            <span className="qa-icon">✎</span>
            New Blog Post
          </Link>
          <Link href="/admin/blog" className="quick-action-btn">
            <span className="qa-icon">✦</span>
            Manage Blog
          </Link>
          <Link href="/admin/pages" className="quick-action-btn">
            <span className="qa-icon">◻</span>
            Edit Pages
          </Link>
          <Link href="/admin/seo" className="quick-action-btn">
            <span className="qa-icon">◎</span>
            SEO Settings
          </Link>
          <Link href="/admin/settings" className="quick-action-btn">
            <span className="qa-icon">⚙</span>
            Site Settings
          </Link>
        </div>

        {/* Recent Blog Posts */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Blog Posts</h3>
            <Link href="/admin/blog" className="btn btn-sm btn-secondary">View All</Link>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Category</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.blogPosts.slice(0, 5).map((post) => (
                  <tr key={post.id}>
                    <td>
                      <Link href={`/admin/blog/${post.id}`} style={{ color: '#071321', textDecoration: 'none', fontWeight: 500 }}>
                        {post.title}
                      </Link>
                    </td>
                    <td>
                      <span className={`badge ${post.published ? 'badge-published' : 'badge-draft'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ color: '#6b7280' }}>{post.category}</td>
                    <td style={{ color: '#6b7280' }}>{post.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
