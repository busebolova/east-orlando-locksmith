'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SearchItem {
  title: string;
  slug: string;
  description: string;
  type: string;
  _type: 'page' | 'post';
}

export function SearchClient({ pages, posts }: { pages: any[]; posts: any[] }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const items: SearchItem[] = useMemo(() => {
    const all: SearchItem[] = [
      ...pages.map(p => ({ title: p.title, slug: p.slug, description: p.description, type: p.type || 'page', _type: 'page' as const })),
      ...posts.map(p => ({ title: p.title, slug: `blog/${p.slug}`, description: p.description, type: p.category || 'blog', _type: 'post' as const })),
    ];
    return all;
  }, [pages, posts]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return items.filter(
      i =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.type.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [query, items]);

  return (
    <main className="seo-page">
      <section className="seo-hero seo-hero--page">
        <div className="seo-hero__copy">
          <p className="eyebrow">Search</p>
          <h1>Search Our Site</h1>
          <div style={{ marginTop: 20 }}>
            <input
              type="text"
              placeholder="Search services, locations, blog posts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                maxWidth: 500,
                padding: '14px 18px',
                fontSize: 16,
                borderRadius: 8,
                border: '2px solid #e6a329',
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                outline: 'none',
              }}
            />
          </div>
        </div>
      </section>

      <section className="content-band" style={{ padding: '40px 24px', maxWidth: 800, margin: '0 auto' }}>
        {query.trim() && results.length === 0 && (
          <p style={{ textAlign: 'center', color: '#6b7280', padding: 40 }}>
            No results found for &ldquo;{query}&rdquo;
          </p>
        )}

        {results.map((item) => (
          <Link
            key={item.slug}
            href={`/${item.slug}`}
            style={{
              display: 'block',
              padding: '16px 20px',
              marginBottom: 12,
              background: '#fff',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'box-shadow 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
          >
            <div style={{ fontSize: 12, color: '#e6a329', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {item._type === 'post' ? 'Blog' : item.type.replace(/-/g, ' ')}
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{item.title}</h3>
            <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>{item.description}</p>
          </Link>
        ))}

        {!query.trim() && (
          <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
            <p style={{ fontSize: 18, marginBottom: 8 }}>🔍</p>
            <p>Type above to search our services, locations, and blog posts.</p>
          </div>
        )}
      </section>
    </main>
  );
}
