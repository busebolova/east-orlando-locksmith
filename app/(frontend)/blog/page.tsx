import { getData } from '@/lib/data';
import { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getData();
  return {
    title: `Blog - ${data.siteName}`,
    description: `Latest locksmith tips, guides, and news from ${data.siteName}.`,
  };
}

export default async function BlogIndexPage() {
  const data = await getData();
  const posts = data.blogPosts.filter(p => p.published);

  return (
    <div className="seo-page">
      <section className="hero" style={{
        background: 'linear-gradient(135deg, #071321 0%, #0f2940 100%)',
        color: 'white',
        padding: '80px 32px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 12 }}>
            Locksmith Blog
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>
            Tips, guides, and insights from {data.siteName}
          </p>
        </div>
      </section>

      <section style={{ padding: '48px 32px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {posts.length === 0 && (
            <p style={{ textAlign: 'center', color: '#5b6472' }}>No blog posts yet. Check back soon!</p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {posts.map((post) => (
              <article key={post.id} style={{
                background: 'white', border: '1px solid #e8e9ed', borderRadius: 8, overflow: 'hidden'
              }}>
                <Link href={`/blog/${post.slug}`} style={{
                  display: 'block', padding: 24, textDecoration: 'none', color: 'inherit'
                }}>
                  <div style={{ fontSize: 12, color: '#e6a329', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                    {post.category}
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: '#071321', marginBottom: 8 }}>
                    {post.title}
                  </h2>
                  <p style={{ fontSize: 14, color: '#5b6472', lineHeight: 1.6, marginBottom: 8 }}>
                    {post.description}
                  </p>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>
                    {post.date} &middot; {post.tags.join(', ')}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
