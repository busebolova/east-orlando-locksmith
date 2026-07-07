import { getData } from '@/lib/data';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getData();
  return {
    title: data.siteName,
    description: data.siteContent.hero.title,
  };
}

export default async function FrontendHomePage() {
  const data = await getData();

  return (
    <div className="seo-page">
      {/* Hero Section */}
      <section className="hero" style={{
        background: 'linear-gradient(135deg, #071321 0%, #0f2940 100%)',
        color: 'white',
        padding: '80px 32px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, marginBottom: 16, lineHeight: 1.15 }}>
            {data.siteContent.hero.title}
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', marginBottom: 32, lineHeight: 1.6 }}>
            {data.siteContent.hero.subtitle}
          </p>
          <a href={`tel:${data.phoneRaw}`} className="cta-button" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: '#e6a329', color: '#071321',
            padding: '16px 36px', borderRadius: 8,
            fontSize: 20, fontWeight: 700, textDecoration: 'none'
          }}>
            {data.siteContent.hero.cta}
          </a>
        </div>
      </section>

      {/* Trust Signals */}
      <section style={{ background: '#f8f9fa', padding: '32px', borderBottom: '1px solid #e8e9ed' }}>
        <div className="trust-row" style={{ justifyContent: 'center', gap: 48, flexWrap: 'wrap', maxWidth: 900, margin: '0 auto' }}>
          <div className="trust-item" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#071321' }}>15-30 min</div>
            <div style={{ fontSize: 12, color: '#5b6472', marginTop: 2 }}>Response Time</div>
          </div>
          <div className="trust-item" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#071321' }}>Licensed & Insured</div>
            <div style={{ fontSize: 12, color: '#5b6472', marginTop: 2 }}>FL Certified</div>
          </div>
          <div className="trust-item" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#071321' }}>20,000+</div>
            <div style={{ fontSize: 12, color: '#5b6472', marginTop: 2 }}>Happy Customers</div>
          </div>
          <div className="trust-item" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#071321' }}>5.0</div>
            <div style={{ fontSize: 12, color: '#5b6472', marginTop: 2 }}>Google Rating</div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section style={{ padding: '64px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#071321' }}>Our Locksmith Services</h2>
          <p style={{ color: '#5b6472', marginBottom: 32, fontSize: 15 }}>
            Professional locksmith solutions for every need
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {(data.navigation.services || []).slice(0, 6).map((svc) => (
              <Link key={svc.slug} href={`/${svc.slug}`} style={{
                display: 'block', padding: 20, background: 'white',
                border: '1px solid #e8e9ed', borderRadius: 8,
                textDecoration: 'none', color: 'inherit',
                transition: 'box-shadow 0.2s'
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#071321', marginBottom: 4 }}>{svc.label}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About / CTA */}
      <section style={{ background: '#071321', color: 'white', padding: '64px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Need Help Now?</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 24, fontSize: 15 }}>
            {data.siteContent.hero.subtitle}
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
