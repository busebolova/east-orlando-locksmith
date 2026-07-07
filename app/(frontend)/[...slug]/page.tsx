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

function getSeoImage(slug: string): string {
  const imageMap: Record<string, string> = {
    'service-emergency-lockout': 'seo-emergency-hallway.png',
    'location-winter-park': 'seo-location-winter-park.png',
    'winter-park-emergency-lockout': 'seo-winter-park-lockout.png',
    'ford-key-programming': 'seo-ford-programming-interior.png',
    'brand-ford-locksmith': 'seo-ford-locksmith.png',
    'zip-32801-locksmith': 'seo-downtown-access.png',
    'zip-32803-car-key-replacement': 'seo-32803-car-key.png',
    'seo-index': 'seo-commercial-locksmith.png',
  };
  return imageMap[slug] || 'seo-commercial-locksmith.png';
}

function getPill(pageType: string): string {
  const labels: Record<string, string> = {
    service: 'Service Page',
    location: 'Location Page',
    'location-service': 'Service Page',
    'brand-service': 'Service Page',
    brand: 'Service Page',
    zip: 'Location Page',
    'zip-service': 'Service Page',
    'landing-index': 'Overview',
  };
  return labels[pageType] || 'Service Page';
}

export default async function FrontendPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const slugStr = slug.join('/');
  const data = await getData();
  const page = data.pages.find(p => p.slug === slugStr);

  if (!page) notFound();

  const services = data.navigation.services || [];
  const locations = data.navigation.locations || [];
  const otherPages = data.pages.filter(p => p.slug !== 'index' && p.slug !== slugStr);

  return (
    <main className="seo-page">
      {/* SEO Hero */}
      <section className="seo-hero seo-hero--page">
        <div className="seo-hero__copy">
          <p className="eyebrow">{getPill(page.type)}</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
          <div className="local-tags">
            <span>{page.location || 'Orlando'}</span>
            {page.zip && <span>ZIP {page.zip}</span>}
          </div>
          <div className="seo-actions">
            <a className="btn btn-light btn-large" href={`tel:${data.phoneRaw}`}>
              <span className="header-phone" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8.2 5.2 10 9.3l-2 1.4c1.3 2.7 3.5 4.9 6.3 6.3l1.4-2 4.1 1.8c.5.2.7.7.6 1.2l-.5 2.2c-.1.6-.7 1-1.3.9C10.5 20.5 3.5 13.5 2.9 5.4c-.1-.6.3-1.2.9-1.3L6 3.6c.5-.1 1 .1 1.2.6Z"></path></svg></span>
              Call {data.phone}
            </a>
            <a className="btn btn-outline btn-large" href="/seo-index">View Services <span className="arrow">›</span></a>
          </div>
        </div>
        <figure className="seo-visual-card">
          <img src={`/assets/${getSeoImage(slugStr)}`} alt={`${page.title} - East Orlando Locksmith`} />
          <figcaption>
            <span>{page.service || 'Locksmith'}</span>
            <strong>{page.location || 'Orlando'} · {page.zip || 'FL'}</strong>
          </figcaption>
        </figure>
      </section>

      {/* SEO Proof Strip */}
      <section className="seo-proof-strip" aria-label="Company trust signals">
        <div><span className="stat__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"></circle><path d="M12 7.5v5l3.5 2"></path></svg></span><strong>{data.siteContent.trustSignals.responseTime}</strong><small>Min Arrival Target</small></div>
        <div><span className="stat__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3 5.5 5.8v5.6c0 4.1 2.6 7.7 6.5 9.3 3.9-1.6 6.5-5.2 6.5-9.3V5.8L12 3Z"></path><path d="m8.8 12 2.1 2.1 4.5-4.6"></path></svg></span><strong>Licensed</strong><small>&amp; Insured</small></div>
        <div><span className="stat__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8.5 11a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"></path><path d="M2.8 19c.7-3.1 2.7-4.7 5.7-4.7s5 1.6 5.7 4.7"></path><path d="M16.3 11.2a2.7 2.7 0 1 0 0-5.4"></path><path d="M15.6 14.6c2.5.2 4.1 1.7 4.8 4.4"></path></svg></span><strong>{data.siteContent.trustSignals.customers}</strong><small>Customers Helped</small></div>
        <div><span className="stat__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m12 3.8 2.4 4.8 5.3.8-3.8 3.7.9 5.3-4.8-2.5-4.8 2.5.9-5.3-3.8-3.7 5.3-.8L12 3.8Z"></path></svg></span><strong>{data.googleRating}</strong><small>Google Rating</small></div>
      </section>

      {/* Intro */}
      <section className="content-band intro seo-intro">
        <h2>Professional {page.service || 'Locksmith'} Service in {page.location || 'Orlando'}</h2>
        <p>{page.description}</p>
        <p>Trusted locksmith service for {page.location || 'the Orlando area'} — covering {page.service ? page.service.toLowerCase() : 'locksmith'} needs with professional dispatch, modern equipment, and clear communication from the first call to job completion.</p>
      </section>

      {/* Editable Content */}
      {page.content && (
        <section className="content-band editable-content">
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </section>
      )}

      {/* Problem / Solution Cards */}
      <section className="content-grid seo-card-pair">
        <article className="premium-content-card">
          <h2>Problem</h2>
          <p>A lock issue usually arrives at the worst possible time. Whether you&rsquo;re locked out of your {page.type?.includes('car') ? 'vehicle' : 'home or business'}, dealing with a broken key, or need urgent access after hours, waiting around for uncertain help adds stress to an already frustrating situation. {page.location ? `In ${page.location}, ` : ''}you need a locksmith who confirms the details, gives a clear estimate, and arrives ready to work.</p>
        </article>
        <article className="premium-content-card">
          <h2>Solution</h2>
          <p>East Orlando Locksmith dispatches a trained technician with entry tools, key programming equipment, and common lock hardware. We confirm your address, quote the likely service range, and explain whether non-destructive entry, rekeying, repair, or replacement is the right step — before any work begins.</p>
        </article>
      </section>

      {/* Local Panel */}
      <section className="content-band local-panel">
        <div>
          <p className="eyebrow">Local Coverage</p>
          <h2>Local Expertise Matters</h2>
          <p>We regularly route technicians through {page.location || 'Orlando'}{page.zip ? ` (ZIP ${page.zip})` : ''} and surrounding corridors. Our dispatch pattern is built around local streets, residential communities, and business districts so we can provide reliable arrival estimates and professional service every time.</p>
          <p className="internal-copy">
            {otherPages.slice(0, 3).map((p, i) => (
              <span key={p.slug}>{i > 0 && ' · '}<Link href={`/${p.slug}`}>{p.title}</Link></span>
            ))}
          </p>
        </div>
      </section>

      {/* Detail Section */}
      <section className="content-band detail-section">
        <div className="section-heading">
          <p className="eyebrow">Service Details</p>
          <h2>{page.service || 'Locksmith'} Work We Handle</h2>
        </div>
        <ul className="detail-list">
          <li>Emergency lockout service for homes, apartments, and condos</li>
          <li>Vehicle lockout assistance and car key replacement</li>
          <li>Business lockouts, storefront access, and after-hours rekeying</li>
          <li>Broken key extraction, lock repair, and smart lock installation</li>
          <li>Master key system planning for property managers</li>
          <li>On-site key programming for modern transponder and smart fob systems</li>
        </ul>
      </section>

      {/* Trust Panel */}
      <section className="trust-panel">
        <div>
          <p className="eyebrow">Trust Signals</p>
          <h2>Why People Choose East Orlando Locksmith</h2>
          <p>Licensed and insured service, upfront pricing, arrival updates, photo-ready work notes, and technicians who carry common residential, commercial, and automotive tools.</p>
        </div>
        <div className="trust-badges">
          <span>Licensed &amp; Insured</span>
          <span>24/7 Dispatch</span>
          <span>Upfront Pricing</span>
          <span>Local Coverage</span>
          <span>GPS Tracking</span>
          <span>Satisfaction Guaranteed</span>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <p className="eyebrow">Questions People Search Before Calling</p>
        <h2>FAQ</h2>
        <details><summary>How fast can a locksmith reach {page.location || 'Orlando'}?</summary><p>Most {page.location ? page.location : 'Orlando'} calls are routed to the closest available technician. Arrival depends on traffic and call volume, but jobs in and around {page.location || 'East Orlando'} typically fit a 15 to 30 minute arrival target.</p></details>
        <details><summary>Can you unlock my door without replacing the lock?</summary><p>Many house, apartment, and car lockouts can be opened without replacing hardware. If the lock is damaged, worn, or unsafe, the technician will explain repair and replacement options before starting any work.</p></details>
        <details><summary>Do you provide {page.service || 'locksmith'} services after hours?</summary><p>Yes. We handle {page.service ? page.service.toLowerCase() : 'locksmith'} calls, lockouts, rekeys, and lock changes around the clock — including nights, weekends, and holidays.</p></details>
      </section>

      {/* Related Grid */}
      <section className="related-grid">
        <div>
          <h2>Related Services</h2>
          <div className="related-links">
            {services.slice(0, 4).map(s => (
              <span key={s.slug}><Link href={`/${s.slug}`}>{s.label}</Link><br /></span>
            ))}
          </div>
        </div>
        <div>
          <h2>Related Locations</h2>
          <div className="related-links">
            {locations.slice(0, 3).map(l => (
              <span key={l.slug}><Link href={`/${l.slug}`}>{l.label}</Link><br /></span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="cta-band cta-band--simple">
        <p className="eyebrow">Emergency Ready</p>
        <h2>Ready for Locksmith Help?</h2>
        <p>Call now for professional {page.service ? page.service.toLowerCase() : 'locksmith'} service in {page.location || 'Orlando'}.</p>
        <div className="seo-actions seo-actions--center">
          <a className="btn btn-gold btn-large" href={`tel:${data.phoneRaw}`}>Call {data.phone}</a>
          <a className="btn btn-light btn-large" href={`tel:${data.phoneRaw}`}>Get Free Quote</a>
        </div>
      </section>
    </main>
  );
}
