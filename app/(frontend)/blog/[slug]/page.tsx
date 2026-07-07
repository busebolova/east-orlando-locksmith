import { getData } from '@/lib/data';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { renderContent } from '@/lib/content-renderer';

export const revalidate = 60;

export async function generateStaticParams() {
  const data = await getData();
  return data.blogPosts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getData();
  const post = data.blogPosts.find(p => p.slug === slug);
  if (!post) return { title: 'Not Found' };

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getData();
  const post = data.blogPosts.find(p => p.slug === slug);

  if (!post) notFound();

  return (
    <div className="seo-page">
      <section style={{
        background: 'linear-gradient(135deg, #071321 0%, #0f2940 100%)',
        color: 'white',
        padding: '64px 32px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: '#e6a329', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            {post.category} &middot; {post.date}
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>
            {post.title}
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
            {post.description}
          </p>
        </div>
      </section>

      <section style={{ padding: '48px 32px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div
            className="blog-content"
            style={{ fontSize: 15, lineHeight: 1.9, color: '#374151' }}
          >
            {renderContent(post.content)}
          </div>

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #e8e9ed' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              {post.tags.map((tag) => (
                <span key={tag} style={{
                  background: '#f3f4f6', padding: '4px 10px', borderRadius: 4,
                  fontSize: 12, color: '#6b7280'
                }}>
                  #{tag}
                </span>
              ))}
            </div>
            <Link href="/blog" style={{ color: '#e6a329', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              &larr; Back to Blog
            </Link>
          </div>
        </div>
      </section>

      <section style={{ background: '#071321', color: 'white', padding: '48px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Need Locksmith Help?</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 20, fontSize: 14 }}>
            Call us for fast, professional service in the Orlando area.
          </p>
          <a href={`tel:${data.phoneRaw}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: '#e6a329', color: '#071321',
            padding: '14px 32px', borderRadius: 8,
            fontSize: 18, fontWeight: 700, textDecoration: 'none'
          }}>
            {data.phone}
          </a>
        </div>
      </section>
    </div>
  );
}
