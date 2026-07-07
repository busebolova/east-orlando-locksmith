import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { validateSession } from '@/lib/auth';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (!validateSession(token)) {
    redirect('/admin/login');
  }

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>East Orlando Locksmith</h1>
          <p>Admin Panel</p>
        </div>
        <nav className="sidebar-nav">
          <Link href="/admin">
            Dashboard
          </Link>
          <Link href="/admin/pages">
            Pages
          </Link>
          <Link href="/admin/homepage">
            Homepage
          </Link>
          <Link href="/admin/homepage/sections">
            Homepage Sections
          </Link>
          <Link href="/admin/media">
            Media
          </Link>
          <Link href="/admin/blog">
            Blog
          </Link>
          <Link href="/admin/seo">
            SEO
          </Link>
          <Link href="/admin/settings">
            Settings
          </Link>
          <Link href="/admin/password">
            Password
          </Link>
          <Link href="/admin/guide">
            Guide
          </Link>
        </nav>
        <div className="sidebar-footer">
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.7 }}>
            ← View Site
          </Link>
          <Link href="/admin/logout" style={{ color: '#ef4444', textDecoration: 'none', opacity: 0.8, fontSize: 13, marginTop: 8, display: 'block' }}>
            Logout
          </Link>
        </div>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
