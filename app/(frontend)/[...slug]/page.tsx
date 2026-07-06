import { getData } from '@/lib/data';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateStaticParams() {
  const data = await getData();
  return data.pages
    .filter(p => p.slug !== 'index')
    .map(p => ({ slug: [p.slug] }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const slugStr = slug.join('/');
  const data = await getData();
  const page = data.pages.find(p => p.slug === slugStr);
  if (!page) return { title: 'Not Found' };

  return {
    title: page.title,
    description: page.description,
  };
}

export default async function FrontendPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const slugStr = slug.join('/');
  const data = await getData();
  const page = data.pages.find(p => p.slug === slugStr);

  if (!page) notFound();

  return (
    <div className="seo-page">
      <section className="hero" style={{
        background: 'linear-gradient(135deg, #071321 0%, #0f2940 100%)',
        color: 'white',
        padding: '80px 32px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 16, lineHeight: 1.15 }}>
            {page.title}
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 32, lineHeight: 1.6 }}>
            {page.description}
          </p>
          <a href={`tel:${data.phoneRaw}`} className="cta-button" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: '#e6a329', color: '#071321',
            padding: '14px 32px', borderRadius: 8,
            fontSize: 18, fontWeight: 700, textDecoration: 'none'
          }}>
            Call {data.phone}
          </a>
        </div>
      </section>

      <section style={{ padding: '48px 32px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ fontSize: 15, lineHeight: 1.8, color: '#374151' }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#071321', marginBottom: 16 }}>About This Service</h2>
            <p>{page.description}</p>
            {page.location && (
              <p style={{ marginTop: 16 }}>Serving <strong>{page.location}</strong>{page.zip ? ` (ZIP ${page.zip})` : ''} and surrounding areas.</p>
            )}
            {page.brand && (
              <p style={{ marginTop: 16 }}>Specializing in <strong>{page.brand}</strong> vehicles and equipment.</p>
            )}
            {page.service && (
              <p style={{ marginTop: 16 }}>Professional <strong>{page.service}</strong> services available 24/7.</p>
            )}
          </div>
        </div>
      </section>

      <section style={{ background: '#f8f9fa', padding: '48px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#071321', marginBottom: 12 }}>Ready to Get Help?</h2>
          <p style={{ color: '#5b6472', marginBottom: 24, fontSize: 14 }}>
            Call us now for fast, professional service. We&apos;re available 24/7.
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
