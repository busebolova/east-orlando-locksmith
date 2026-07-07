import { getData } from '@/lib/data';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getData();
  return {
    title: data.siteName,
    description: data.siteContent.hero.subtitle,
  };
}

export default async function FrontendHomePage() {
  const data = await getData();
  const { trustSignals } = data.siteContent;

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__content">
          <div className="pill"><span>⚡</span> 24/7 Emergency Locksmith</div>
          <h1>Orlando&rsquo;s Most <span>Trusted</span> Locksmith</h1>
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
            <span>✓ Licensed &amp; Insured</span>
            <span>✓ Fast Response</span>
            <span>✓ Upfront Pricing</span>
          </div>
        </div>

        <div className="hero__media">
          <img src="/assets/hero-locksmith.png" alt="Locksmith repairing a door lock at night" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats" aria-label="Company statistics">
        <div className="stat">
          <span className="stat__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M12 3 5.5 5.8v5.6c0 4.1 2.6 7.7 6.5 9.3 3.9-1.6 6.5-5.2 6.5-9.3V5.8L12 3Z"></path><path d="m8.8 12 2.1 2.1 4.5-4.6"></path></svg>
          </span>
          <div><strong>15+</strong><span>Years Experience</span></div>
        </div>
        <div className="stat">
          <span className="stat__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"></circle><path d="M12 7.5v5l3.5 2"></path></svg>
          </span>
          <div><strong>{trustSignals.responseTime}</strong><span>Min Arrival Time</span></div>
        </div>
        <div className="stat">
          <span className="stat__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M8.5 11a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"></path><path d="M2.8 19c.7-3.1 2.7-4.7 5.7-4.7s5 1.6 5.7 4.7"></path><path d="M16.3 11.2a2.7 2.7 0 1 0 0-5.4"></path><path d="M15.6 14.6c2.5.2 4.1 1.7 4.8 4.4"></path></svg>
          </span>
          <div><strong>{trustSignals.customers}</strong><span>Happy Customers</span></div>
        </div>
        <div className="stat">
          <span className="stat__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="m12 3.8 2.4 4.8 5.3.8-3.8 3.7.9 5.3-4.8-2.5-4.8 2.5.9-5.3-3.8-3.7 5.3-.8L12 3.8Z"></path></svg>
          </span>
          <div><strong>{data.googleRating}</strong><span>Customer Rating</span></div>
        </div>
        <div className="stat">
          <span className="stat__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M6 3.8h8.2L18 7.6v12.6H6V3.8Z"></path><path d="M14 3.8v4h4"></path><path d="m8.6 14 2 2 4.7-5"></path></svg>
          </span>
          <div><strong>{trustSignals.license}</strong><span>&amp; Insured</span></div>
        </div>
      </section>

      {/* Priority / Service Strip */}
      <section className="priority" id="services">
        <p className="eyebrow">Trusted By Thousands</p>
        <h2>Your Security is Our Priority</h2>
        <p className="section-copy">We understand that security and peace of mind are priceless. That&rsquo;s why we deliver exceptional service every time.</p>

        <div className="service-strip">
          <a className="service-point" href={`/${data.navigation.services?.[0]?.slug || 'service-emergency-lockout'}`}>
            <span className="circle-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"></circle><path d="M12 7.5v5l3.5 2"></path></svg>
            </span>
            <strong>24/7</strong>
            <span>Emergency Service</span>
          </a>
          <a className="service-point" href={`/${data.navigation.locations?.[0]?.slug || 'location-winter-park'}`}>
            <span className="circle-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M12 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path><path d="M8.2 13.1 7.2 20l4.8-2.6 4.8 2.6-1-6.9"></path></svg>
            </span>
            <strong>Certified</strong>
            <span>Technicians</span>
          </a>
          <a className="service-point" href="/zip-32801-locksmith">
            <span className="circle-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M12 3 5.5 5.8v5.6c0 4.1 2.6 7.7 6.5 9.3 3.9-1.6 6.5-5.2 6.5-9.3V5.8L12 3Z"></path><path d="m8.8 12 2.1 2.1 4.5-4.6"></path></svg>
            </span>
            <strong>Modern</strong>
            <span>Equipment</span>
          </a>
          <a className="service-point" href={`/${data.navigation.services?.find(s => s.label.toLowerCase().includes('key'))?.slug || 'zip-32803-car-key-replacement'}`}>
            <span className="circle-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M12 4v16"></path><path d="M16.3 7.6c-.8-.8-2-1.3-3.6-1.3-2.1 0-3.6 1-3.6 2.6 0 1.7 1.5 2.3 3.4 2.8 2.1.5 3.8 1.2 3.8 3.1 0 1.7-1.5 2.9-3.8 2.9-1.7 0-3.2-.6-4.3-1.6"></path></svg>
            </span>
            <strong>Upfront</strong>
            <span>Pricing</span>
          </a>
          <a className="service-point" href="/blog">
            <span className="circle-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M7.4 10.6v9H4.2v-9h3.2Z"></path><path d="M7.4 18.9h8.8c1 0 1.8-.6 2-1.6l1.2-5.2c.3-1.2-.6-2.3-1.8-2.3h-4.2l.6-2.9c.2-1-.5-1.9-1.5-1.9h-.4l-4.7 5.6"></path></svg>
            </span>
            <strong>Satisfaction</strong>
            <span>Guaranteed</span>
          </a>
        </div>
      </section>

      {/* Service Cards */}
      <section className="home-section services-overview" aria-labelledby="services-heading">
        <div className="section-heading">
          <p className="eyebrow">Locksmith Services</p>
          <h2 id="services-heading">Complete locksmith support for every urgent moment</h2>
          <p>From car key issues to home lockouts and commercial rekeys, East Orlando Locksmith keeps service focused, local, and easy to act on.</p>
        </div>
        <div className="service-card-grid">
          <article className="service-card">
            <span className="card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M4 15.5V10l2.8-4.1h10.4L20 10v5.5"></path><path d="M6.5 15.5h11"></path><path d="M7 18.3a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z"></path><path d="M17 18.3a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z"></path><path d="M8 10h8"></path></svg>
            </span>
            <h3>Automotive Locksmith</h3>
            <p>Mobile car locksmith help for lockouts, lost keys, fobs, and key programming around Orlando.</p>
            <ul>
              <li>Car lockout service</li>
              <li>Car key replacement</li>
              <li>Ford key programming</li>
              <li>Broken key extraction</li>
            </ul>
            <a className="text-link" href={`/${data.navigation.services?.find(s => s.label.toLowerCase().includes('car key') || s.slug.includes('car-key'))?.slug || 'zip-32803-car-key-replacement'}`}>Learn More <span>›</span></a>
          </article>

          <article className="service-card">
            <span className="card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M4 11.2 12 4l8 7.2"></path><path d="M6.5 10.5v9h11v-9"></path><path d="M10 19.5v-5h4v5"></path><path d="M15.8 8.7V5.2h2.4v5.7"></path></svg>
            </span>
            <h3>Residential Locksmith</h3>
            <p>Clean, careful lock service for homes, condos, apartments, short-term rentals, and move-ins.</p>
            <ul>
              <li>House lockouts</li>
              <li>Home rekey service</li>
              <li>Deadbolt installation</li>
              <li>Smart lock setup</li>
            </ul>
            <a className="text-link" href={`/${data.navigation.services?.[0]?.slug || 'service-emergency-lockout'}`}>Learn More <span>›</span></a>
          </article>

          <article className="service-card">
            <span className="card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M5 20V5.8h14V20"></path><path d="M8 9h2.2"></path><path d="M13.8 9H16"></path><path d="M8 12.5h2.2"></path><path d="M13.8 12.5H16"></path><path d="M10 20v-4h4v4"></path></svg>
            </span>
            <h3>Commercial Locksmith</h3>
            <p>Business-focused locksmith service for offices, storefronts, property managers, and teams.</p>
            <ul>
              <li>Office rekeying</li>
              <li>Storefront locks</li>
              <li>Master key planning</li>
              <li>After-hours lockouts</li>
            </ul>
            <a className="text-link" href={`/${data.navigation.services?.find(s => s.label.toLowerCase().includes('commercial'))?.slug || 'zip-32801-locksmith'}`}>Learn More <span>›</span></a>
          </article>
        </div>
      </section>

      {/* Trust Section */}
      <section className="home-section trust-section" aria-labelledby="why-heading">
        <div className="section-heading">
          <p className="eyebrow">Why Choose Us</p>
          <h2 id="why-heading">Built for urgent calls and long-term trust</h2>
          <p>Every visit is designed around clear communication, local dispatch awareness, and locksmith work that respects your time and property.</p>
        </div>
        <div className="trust-grid">
          <article className="trust-card"><span className="mini-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"></circle><path d="M12 7.5v5l3.5 2"></path></svg></span><h3>24/7 Emergency Service</h3><p>Late night, early morning, weekend, and holiday lock issues are handled with real dispatch.</p></article>
          <article className="trust-card"><span className="mini-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path><path d="M8.2 13.1 7.2 20l4.8-2.6 4.8 2.6-1-6.9"></path></svg></span><h3>Certified Technicians</h3><p>Trained locksmiths arrive prepared for residential, commercial, and automotive situations.</p></article>
          <article className="trust-card"><span className="mini-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 13h7l-1 7 10-11h-7l1-5L4 13Z"></path></svg></span><h3>Fast Response</h3><p>We route calls around Orlando corridors to reduce waiting during stressful lockouts.</p></article>
          <article className="trust-card"><span className="mini-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 4v16"></path><path d="M16.3 7.6c-.8-.8-2-1.3-3.6-1.3-2.1 0-3.6 1-3.6 2.6 0 1.7 1.5 2.3 3.4 2.8 2.1.5 3.8 1.2 3.8 3.1 0 1.7-1.5 2.9-3.8 2.9-1.7 0-3.2-.6-4.3-1.6"></path></svg></span><h3>Upfront Pricing</h3><p>Service ranges are explained before work begins, with no vague surprises at the door.</p></article>
          <article className="trust-card"><span className="mini-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3 5.5 5.8v5.6c0 4.1 2.6 7.7 6.5 9.3 3.9-1.6 6.5-5.2 6.5-9.3V5.8L12 3Z"></path><path d="m8.8 12 2.1 2.1 4.5-4.6"></path></svg></span><h3>Licensed &amp; Insured</h3><p>Authorization checks, clean work, and documented service are part of the process.</p></article>
          <article className="trust-card"><span className="mini-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7.4 10.6v9H4.2v-9h3.2Z"></path><path d="M7.4 18.9h8.8c1 0 1.8-.6 2-1.6l1.2-5.2c.3-1.2-.6-2.3-1.8-2.3h-4.2l.6-2.9c.2-1-.5-1.9-1.5-1.9h-.4l-4.7 5.6"></path></svg></span><h3>Satisfaction Guaranteed</h3><p>We solve the immediate issue and help you choose the safest next step.</p></article>
        </div>
      </section>

      {/* Areas Section */}
      <section className="home-section areas-section" aria-labelledby="areas-heading">
        <div className="areas-copy">
          <p className="eyebrow">Service Areas</p>
          <h2 id="areas-heading">Local locksmith coverage across East Orlando</h2>
          <p>Our dispatch pattern is built around East Orlando streets, residential communities, retail corridors, campus areas, and business districts.</p>
          <div className="area-tags" aria-label="Primary service areas">
            {data.navigation.locations?.map(loc => (
              <Link key={loc.slug} href={`/${loc.slug}`}>{loc.label}</Link>
            ))}
            <span>Oviedo</span>
            <span>Maitland</span>
            <span>Casselberry</span>
            <span>Altamonte Springs</span>
            <span>Baldwin Park</span>
            <span>Waterford Lakes</span>
            <span>Alafaya</span>
            <span>Union Park</span>
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
          <p className="eyebrow">Response Timeline</p>
          <h2 id="timeline-heading">A simple process when every minute matters</h2>
        </div>
        <ol className="timeline-list">
          <li><span>01</span><h3>Call us</h3><p>Tell us the lock issue, your location, and any access details.</p></li>
          <li><span>02</span><h3>We dispatch</h3><p>The closest available technician receives the job and route.</p></li>
          <li><span>03</span><h3>Technician arrives</h3><p>We verify authorization, inspect the lock, and explain the work.</p></li>
          <li><span>04</span><h3>Problem solved</h3><p>You get back inside, back on the road, or back to business.</p></li>
        </ol>
      </section>

      {/* Reviews Section */}
      <section className="home-section reviews-section" aria-labelledby="reviews-heading">
        <div className="section-heading">
          <p className="eyebrow">Customer Reviews</p>
          <h2 id="reviews-heading">Trusted by Orlando homeowners, drivers, and businesses</h2>
        </div>
        <div className="review-card-grid">
          <article className="review-card"><div className="review-top"><span className="stars">★★★★★</span><span>Google</span></div><p>&ldquo;Locked out near Lake Eola after dinner. The technician arrived quickly, opened the door cleanly, and explained the rekey option without pressure.&rdquo;</p><footer><strong>Marissa K.</strong><span>Downtown Orlando · Home Lockout</span></footer></article>
          <article className="review-card"><div className="review-top"><span className="stars">★★★★★</span><span>Yelp</span></div><p>&ldquo;My Ford key stopped working in a 32803 parking lot. They checked the fob, programmed a replacement, and had me moving again.&rdquo;</p><footer><strong>Daniel R.</strong><span>Colonialtown · Ford Key Programming</span></footer></article>
          <article className="review-card"><div className="review-top"><span className="stars">★★★★★</span><span>Google</span></div><p>&ldquo;We needed an office rekey after staff changes. Clear quote, clean work, and they labeled everything before leaving.&rdquo;</p><footer><strong>Angela M.</strong><span>Winter Park · Commercial Rekey</span></footer></article>
        </div>
      </section>

      {/* Brands Section */}
      <section className="home-section brands-section" aria-labelledby="brands-heading">
        <div className="section-heading">
          <p className="eyebrow">Vehicle Brands</p>
          <h2 id="brands-heading">Automotive locksmith support for the brands Orlando drives</h2>
          <p>Key replacement and programming availability depends on model year, key type, and immobilizer system.</p>
        </div>
        <div className="brand-grid" aria-label="Supported vehicle brands">
          <span>Toyota</span><span>Honda</span><span>Ford</span><span>Chevrolet</span><span>Nissan</span><span>Hyundai</span><span>Kia</span><span>BMW</span><span>Mercedes-Benz</span><span>Audi</span><span>Lexus</span>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="home-section faq-home" aria-labelledby="faq-heading">
        <div className="section-heading">
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-heading">Orlando locksmith questions, answered clearly</h2>
        </div>
        <div className="faq-list">
          <details><summary>How fast can a locksmith reach East Orlando?</summary><p>Arrival depends on traffic and call volume, but calls near Downtown Orlando, Winter Park, Baldwin Park, Waterford Lakes, and Alafaya are routed to the closest available technician.</p></details>
          <details><summary>Can you unlock my home or car without damage?</summary><p>Many lockouts can be handled with non-destructive tools. If a lock is damaged, worn, or unsafe, the technician explains repair, rekey, or replacement options before work begins.</p></details>
          <details><summary>Do you provide car key programming?</summary><p>Yes, we support many transponder keys, remote head keys, and smart fobs, including Ford key programming. Compatibility depends on make, model, year, and fob availability.</p></details>
          <details><summary>Should I rekey after losing keys?</summary><p>Rekeying is recommended when keys are lost, stolen, left with a former tenant, or possibly connected to your address or business.</p></details>
          <details><summary>Do you handle commercial locksmith work?</summary><p>Yes. We help offices, storefronts, rental properties, and managers with rekeys, lock changes, lockouts, and key control planning.</p></details>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta" aria-labelledby="final-cta-heading">
        <div>
          <p className="eyebrow">Emergency Ready</p>
          <h2 id="final-cta-heading">Need a locksmith right now?</h2>
          <p>A real technician is ready to help with lockouts, rekeys, car keys, and urgent lock problems across East Orlando.</p>
        </div>
        <div className="final-actions">
          <a className="btn btn-gold btn-large" href={`tel:${data.phoneRaw}`}>Call Now</a>
          <a className="btn btn-light btn-large" href={`tel:${data.phoneRaw}`}>Get Free Quote</a>
        </div>
      </section>
    </>
  );
}
