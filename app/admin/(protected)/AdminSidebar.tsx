'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/homepage/sections', label: 'Home Page' },
  { href: '/admin/pages', label: 'Pages' },
  { href: '/admin/blog', label: 'Blog' },
  { href: '/admin/media', label: 'Media' },
  { href: '/admin/seo', label: 'SEO' },
  { href: '/admin/header-settings', label: 'Header Settings' },
  { href: '/admin/settings', label: 'Settings' },
  { href: '/admin/password', label: 'Password' },
  { href: '/admin/guide', label: 'Guide' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className={`sidebar-toggle ${mobileOpen ? 'open' : ''}`}
        type="button"
        aria-label="Toggle sidebar"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-header">
          <h1>East Orlando Locksmith</h1>
          <p>Admin Panel</p>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? 'active' : ''}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
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
    </>
  );
}
