import { getData } from '@/lib/data';
import { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 60;

const ICONS: Record<string, string> = {
  // Circle-icon variants (inside a circle `<circle cx="12" cy="12" r="8.5"/>`)
  'circle-icon clock': '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5l3.5 2"/>',
  'circle-icon location': '<circle cx="12" cy="12" r="8.5"/><path d="M12 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="M8.2 13.1 7.2 20l4.8-2.6 4.8 2.6-1-6.9"/>',
  'circle-icon shield': '<circle cx="12" cy="12" r="8.5"/><path d="M12 3 5.5 5.8v5.6c0 4.1 2.6 7.7 6.5 9.3 3.9-1.6 6.5-5.2 6.5-9.3V5.8L12 3Z"/><path d="m8.8 12 2.1 2.1 4.5-4.6"/>',
  'circle-icon dollar': '<circle cx="12" cy="12" r="8.5"/><path d="M12 4v16"/><path d="M16.3 7.6c-.8-.8-2-1.3-3.6-1.3-2.1 0-3.6 1-3.6 2.6 0 1.7 1.5 2.3 3.4 2.8 2.1.5 3.8 1.2 3.8 3.1 0 1.7-1.5 2.9-3.8 2.9-1.7 0-3.2-.6-4.3-1.6"/>',
  'circle-icon thumbs': '<circle cx="12" cy="12" r="8.5"/><path d="M7.4 10.6v9H4.2v-9h3.2Z"/><path d="M7.4 18.9h8.8c1 0 1.8-.6 2-1.6l1.2-5.2c.3-1.2-.6-2.3-1.8-2.3h-4.2l.6-2.9c.2-1-.5-1.9-1.5-1.9h-.4l-4.7 5.6"/>',

  // Service card icons
  car: '<path d="M4 15.5V10l2.8-4.1h10.4L20 10v5.5"/><path d="M6.5 15.5h11"/><path d="M7 18.3a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z"/><path d="M17 18.3a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z"/><path d="M8 10h8"/>',
  home: '<path d="M4 11.2 12 4l8 7.2"/><path d="M6.5 10.5v9h11v-9"/><path d="M10 19.5v-5h4v5"/><path d="M15.8 8.7V5.2h2.4v5.7"/>',
  building: '<path d="M5 20V5.8h14V20"/><path d="M8 9h2.2"/><path d="M13.8 9H16"/><path d="M8 12.5h2.2"/><path d="M13.8 12.5H16"/><path d="M10 20v-4h4v4"/>',

  // Trust card icons
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5l3.5 2"/>',
  'user-check': '<path d="M12 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="M8.2 13.1 7.2 20l4.8-2.6 4.8 2.6-1-6.9"/>',
  zap: '<path d="M4 13h7l-1 7 10-11h-7l1-5L4 13Z"/>',
  'dollar-sign': '<path d="M12 4v16"/><path d="M16.3 7.6c-.8-.8-2-1.3-3.6-1.3-2.1 0-3.6 1-3.6 2.6 0 1.7 1.5 2.3 3.4 2.8 2.1.5 3.8 1.2 3.8 3.1 0 1.7-1.5 2.9-3.8 2.9-1.7 0-3.2-.6-4.3-1.6"/>',
  shield: '<path d="M12 3 5.5 5.8v5.6c0 4.1 2.6 7.7 6.5 9.3 3.9-1.6 6.5-5.2 6.5-9.3V5.8L12 3Z"/><path d="m8.8 12 2.1 2.1 4.5-4.6"/>',
  'thumbs-up': '<path d="M7.4 10.6v9H4.2v-9h3.2Z"/><path d="M7.4 18.9h8.8c1 0 1.8-.6 2-1.6l1.2-5.2c.3-1.2-.6-2.3-1.8-2.3h-4.2l.6-2.9c.2-1-.5-1.9-1.5-1.9h-.4l-4.7 5.6"/>',
};

function SvgIcon({ paths, className }: { paths: string; className?: string }) {
  return (
    <span className={className} aria-hidden="true">
      <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: paths }} />
    </span>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getData();
  return {
    title: data.siteName,
    description: data.siteContent.hero.subtitle,
  };
}

export default async function FrontendHomePage() {
  const data = await getData();
  const { trustSignals, homepage } = data.siteContent;

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__content">
          {homepage.pill && (() => {
            const first = homepage.pill.charAt(0);
            const rest = homepage.pill.slice(1).trim();
            return <div className="pill"><span>{first}</span> {rest}</div>;
          })()}
          <h1 dangerouslySetInnerHTML={{ __html: homepage.heading }} />
          <p>{data.siteContent.hero.subtitle}</p>

          <div className="rating-row">
            <span className="google-mark">G</span>
            <span className="stars">★★★★★</span>
            <strong>{data.googleRating}</strong>
            <span>({data.reviewCount} Reviews)</span>
          </div>

          <div className="hero-actions">
            <a className="btn btn-light btn-large" href={`tel:${data.phoneRaw}`}>
              <span className="header-phone" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M8.2 5.2 10 9.3l-2 1.4c1.3 2.7 3.5 4.9 6.3 6.3l1.4-2 4.1 1.8c.5.2.7.7.6 1.2l-.5 2.2c-.1.6-.7 1-1.3.9C10.5 20.5 3.5 13.5 2.9 5.4c-.1-.6.3-1.2.9-1.3L6 3.6c.5-.1 1 .1 1.2.6Z"></path></svg>
              </span>
              Call {data.phone}
            </a>
            <a className="btn btn-light btn-large" href="/seo-index">
              View Services
              <span className="arrow">›</span>
            </a>
          </div>

          <div className="trust-row">
            {homepage.trustItems.map((item, i) => (
              <span key={i}>✓ {item.text}</span>
            ))}
          </div>
        </div>

        <div className="hero__media">
          <img src={homepage.heroImage.src} alt={homepage.heroImage.alt} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats" aria-label="Company statistics">
        <div className="stat">
          <SvgIcon className="stat__icon" paths={ICONS.shield} />
          <div><strong>15+</strong><span>Years Experience</span></div>
        </div>
        <div className="stat">
          <SvgIcon className="stat__icon" paths={ICONS.clock} />
          <div><strong>{trustSignals.responseTime}</strong><span>Min Arrival Time</span></div>
        </div>
        <div className="stat">
          <SvgIcon className="stat__icon" paths={ICONS['user-check']} />
          <div><strong>{trustSignals.customers}</strong><span>Happy Customers</span></div>
        </div>
        <div className="stat">
          <SvgIcon className="stat__icon" paths={ICONS['dollar-sign']} />
          <div><strong>{data.googleRating}</strong><span>Customer Rating</span></div>
        </div>
        <div className="stat">
          <SvgIcon className="stat__icon" paths={ICONS['thumbs-up']} />
          <div><strong>{trustSignals.license}</strong><span>&amp; Insured</span></div>
        </div>
      </section>

      {/* Priority / Service Strip */}
      <section className="priority" id="services">
        <p className="eyebrow">{homepage.priorityEyebrow}</p>
        <h2>{homepage.priorityHeading}</h2>
        <p className="section-copy">{homepage.priorityText}</p>

        <div className="service-strip">
          {homepage.servicePoints.map((pt, i) => (
            <a key={i} className="service-point" href={`/${pt.link}`}>
              <SvgIcon className="circle-icon" paths={ICONS[pt.icon] || ICONS['circle-icon clock']} />
              <strong>{pt.title}</strong>
              <span>{pt.subtitle}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Service Cards */}
      <section className="home-section services-overview" aria-labelledby="services-heading">
        <div className="section-heading">
          <p className="eyebrow">{homepage.servicesEyebrow}</p>
          <h2 id="services-heading">{homepage.servicesHeading}</h2>
          <p>{homepage.servicesText}</p>
        </div>
        <div className="service-card-grid">
          {homepage.serviceCards.map((card, i) => (
            <article key={i} className="service-card">
              <SvgIcon className="card-icon" paths={ICONS[card.icon] || ''} />
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <ul>
                {card.features.map((f, j) => <li key={j}>{f}</li>)}
              </ul>
              <a className="text-link" href={`/${card.link}`}>Learn More <span>›</span></a>
            </article>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="home-section trust-section" aria-labelledby="why-heading">
        <div className="section-heading">
          <p className="eyebrow">{homepage.trustEyebrow}</p>
          <h2 id="why-heading">{homepage.trustHeading}</h2>
          <p>{homepage.trustText}</p>
        </div>
        <div className="trust-grid">
          {homepage.trustCards.map((card, i) => (
            <article key={i} className="trust-card">
              <SvgIcon className="mini-icon" paths={ICONS[card.icon] || ''} />
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Areas Section */}
      <section className="home-section areas-section" aria-labelledby="areas-heading">
        <div className="areas-copy">
          <p className="eyebrow">{homepage.areasEyebrow}</p>
          <h2 id="areas-heading">{homepage.areasHeading}</h2>
          <p>{homepage.areasText}</p>
          <div className="area-tags" aria-label="Primary service areas">
            {data.navigation.locations?.map(loc => (
              <Link key={loc.slug} href={`/${loc.slug}`}>{loc.label}</Link>
            ))}
            {homepage.extraAreas.map((area, i) => (
              <span key={i}>{area}</span>
            ))}
          </div>
        </div>
        <div className="map-card" aria-label="East Orlando coverage visual">
          <img src="/assets/service-area-visual.png" alt="Premium East Orlando locksmith service area coverage visual" />
          <div className="map-ring ring-one"></div>
          <div className="map-ring ring-two"></div>
          <div className="map-pin main-pin"><span>East Orlando</span></div>
          <div className="map-pin pin-a"><span>Winter Park</span></div>
          <div className="map-pin pin-b"><span>Waterford Lakes</span></div>
          <div className="map-pin pin-c"><span>Oviedo</span></div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="home-section timeline-section" aria-labelledby="timeline-heading">
        <div className="section-heading">
          <p className="eyebrow">{homepage.responseEyebrow}</p>
          <h2 id="timeline-heading">{homepage.responseHeading}</h2>
        </div>
        <ol className="timeline-list">
          {homepage.timeline.map((step, i) => (
            <li key={i}>
              <span>0{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Reviews Section */}
      <section className="home-section reviews-section" aria-labelledby="reviews-heading">
        <div className="section-heading">
          <p className="eyebrow">{homepage.reviewsEyebrow}</p>
          <h2 id="reviews-heading">{homepage.reviewsHeading}</h2>
        </div>
        <div className="review-card-grid">
          {homepage.reviews.map((review, i) => (
            <article key={i} className="review-card">
              <div className="review-top">
                <span className="stars">★★★★★</span>
                <span>{review.source}</span>
              </div>
              <p>&ldquo;{review.text}&rdquo;</p>
              <footer>
                <strong>{review.name}</strong>
                <span>{review.location}</span>
              </footer>
            </article>
          ))}
        </div>
      </section>

      {/* Brands Section */}
      <section className="home-section brands-section" aria-labelledby="brands-heading">
        <div className="section-heading">
          <p className="eyebrow">{homepage.brandsEyebrow}</p>
          <h2 id="brands-heading">{homepage.brandsHeading}</h2>
          <p>{homepage.brandsText}</p>
        </div>
        <div className="brand-grid" aria-label="Supported vehicle brands">
          {homepage.brands.map((b, i) => <span key={i}>{b.name}</span>)}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="home-section faq-home" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">{homepage.faqEyebrow}</p>
          <h2 id="faq-heading">{homepage.faqHeading}</h2>
        </div>
        <div className="faq-list">
          {homepage.faq.map((item, i) => (
            <details key={i}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta" aria-labelledby="final-cta-heading">
        <div>
          <p className="eyebrow">{homepage.ctaEyebrow}</p>
          <h2 id="final-cta-heading">{homepage.ctaHeading}</h2>
          <p>{homepage.ctaText}</p>
        </div>
        <div className="final-actions">
          <a className="btn btn-gold btn-large" href={`tel:${data.phoneRaw}`}>Call Now</a>
          <a className="btn btn-light btn-large" href={`tel:${data.phoneRaw}`}>Get Free Quote</a>
        </div>
      </section>
    </>
  );
}
