'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

type NavGroup = Record<string, { label: string; slug: string }[]>;

interface FrontendLayoutProps {
  children: React.ReactNode;
  siteName: string;
  phone: string;
  phoneRaw: string;
  address: string;
  hours: string;
  googleRating: string;
  reviewCount: string;
  serviceArea: string;
  navigation: NavGroup;
  footerDesc: string;
  copyright: string;
}

export default function FrontendLayoutClient({
  children,
  siteName,
  phone,
  phoneRaw,
  address,
  hours,
  googleRating,
  reviewCount,
  serviceArea,
  navigation,
  footerDesc,
  copyright,
}: FrontendLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.style.display = 'none';
  }, []);

  const navGroups = Object.entries(navigation);

  return (
    <>
      <div id="preloader"><div className="preloader-spinner"></div></div>
      <header className="site-header">
        <div className="topbar">
          <div className="topbar__item">
            <span className="header-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 21s7-6.1 7-12a7 7 0 0 0-14 0c0 5.9 7 12 7 12Z"></path><circle cx="12" cy="9" r="2.4"></circle></svg>
            </span>
            <span>Serving {serviceArea}</span>
          </div>
          <div className="topbar__right">
            <div className="topbar__item">
              <span className="header-icon header-icon--gold" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="8.5"></circle><path d="M12 7.5v5l3.5 2"></path></svg>
              </span>
              <span>{hours}</span>
            </div>
            <div className="review-mini">
              <span className="stars">★★★★★</span>
              <strong>{googleRating}</strong>
              <span>({reviewCount} Reviews)</span>
            </div>
            <span className="google-mark">G</span>
            <span className="social-dot">✣</span>
          </div>
        </div>

        <nav className="navbar" aria-label="Primary navigation">
          <Link className="brand" href="/" aria-label={`${siteName} home`}>
            <img src="/assets/logo-crop.png" alt={siteName} />
          </Link>

          <button
            className={`menu-toggle ${menuOpen ? 'open' : ''}`}
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={`nav-links ${menuOpen ? 'open' : ''}`} id="navLinks">
            {navGroups.map(([groupName, items]) => (
              <div key={groupName} className="nav-item">
                <a href={`/${items[0]?.slug || '#'}`}>
                  {groupName.charAt(0).toUpperCase() + groupName.slice(1)} <span>⌄</span>
                </a>
                <div className="dropdown">
                  {items.map((item) => (
                    <Link key={item.slug} href={`/${item.slug}`}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <a className="nav-phone" href={`tel:${phoneRaw}`}>
              <span className="header-phone" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6 19.7 19.7 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.4 1.4 1 2.8 1.7 4a.5.5 0 0 1-.2.7l-1.3 1.2a16 16 0 0 0 6 6l1.2-1.2a.5.5 0 0 1 .7-.2c1.2.7 2.5 1.3 4 1.7a2 2 0 0 1 1.6 2z"></path></svg>
              </span>
              {phone}
            </a>
          </div>
        </nav>
      </header>

      <main style={{ paddingTop: 142 }}>{children}</main>

      <footer className="site-footer" style={{ background: '#071321', color: 'rgba(255,255,255,0.8)', padding: '48px 0 24px' }}>
        <div style={{ width: 'min(1320px, calc(100% - 64px))', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, marginBottom: 32 }}>
            <div>
              <img src="/assets/logo-crop.png" alt={siteName} style={{ height: 48, marginBottom: 16, filter: 'brightness(0) invert(1)' }} />
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.65)' }}>{footerDesc}</p>
            </div>
            <div>
              <h4 style={{ color: '#e6a329', fontSize: 14, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Services</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(navigation.services || []).map((item) => (
                  <Link key={item.slug} href={`/${item.slug}`} style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ color: '#e6a329', fontSize: 14, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Contact</h4>
              <div style={{ fontSize: 13, lineHeight: 2, color: 'rgba(255,255,255,0.65)' }}>
                <div>{address}</div>
                <div><a href={`tel:${phoneRaw}`} style={{ color: '#e6a329', textDecoration: 'none' }}>{phone}</a></div>
                <div>{hours}</div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            &copy; {copyright}
          </div>
        </div>
      </footer>
    </>
  );
}
