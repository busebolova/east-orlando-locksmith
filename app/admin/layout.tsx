import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // For now, allow access without strict auth check during development
  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>East Orlando Locksmith</h1>
          <p>Admin Panel</p>
        </div>
        <nav className="sidebar-nav">
          <Link href="/admin">
            <span className="nav-icon">◉</span> Dashboard
          </Link>
          <Link href="/admin/pages">
            <span className="nav-icon">◻</span> Pages
          </Link>
          <Link href="/admin/blog">
            <span className="nav-icon">✦</span> Blog
          </Link>
          <Link href="/admin/seo">
            <span className="nav-icon">◎</span> SEO
          </Link>
          <Link href="/admin/settings">
            <span className="nav-icon">⚙</span> Settings
          </Link>
          <Link href="/admin/guide">
            <span className="nav-icon">?</span> Guide
          </Link>
        </nav>
        <div className="sidebar-footer">
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.7 }}>
            ← View Site
          </Link>
        </div>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
