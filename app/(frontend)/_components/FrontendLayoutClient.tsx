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
  headerLogo: string;
  headerLogoWidth: number;
  headerLogoHeight: number;
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
  headerLogo,
  headerLogoWidth,
  headerLogoHeight,
}: FrontendLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.style.display = 'none';
  }, []);

  const navGroups = Object.entries(navigation);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

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
            <img src={headerLogo || '/assets/logo-crop.png'} alt={siteName} width={headerLogoWidth || 315} height={headerLogoHeight || 86} />
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

          <div className={`nav-links ${menuOpen ? 'is-open' : ''}`} id="navLinks">
            {navGroups.map(([groupName, items]) => (
              <div key={groupName} className={`nav-item ${openDropdown === groupName ? 'dropdown-open' : ''}`}>
                <a
                  href={items.length === 1 ? `/${items[0].slug}` : '#'}
                  onClick={(e) => {
                    if (items.length > 1) {
                      e.preventDefault();
                      toggleDropdown(groupName);
                    }
                  }}
                >
                  {groupName.charAt(0).toUpperCase() + groupName.slice(1)} <span>{openDropdown === groupName ? '⌃' : '⌄'}</span>
                </a>
                <div className={`dropdown ${openDropdown === groupName ? 'is-open' : ''}`}>
                  {items.map((item) => (
                    <Link key={item.slug} href={`/${item.slug}`}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <Link className="nav-blog-link" href="/blog">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M4 4h16v2H4V4zm0 4h16v2H4V8zm0 4h10v2H4v-2zm0 4h16v2H4v-2zm13-4h3v6h-3v-6z"/></svg>
              <span>Blog</span>
            </Link>
          </div>
        </nav>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <img src={headerLogo || '/assets/logo-crop.png'} alt={siteName} width={headerLogoWidth || 315} height={headerLogoHeight || 86} style={{ maxWidth: 220, height: 'auto' }} />
            <p>{footerDesc}</p>
            <a className="footer-phone" href={`tel:${phoneRaw}`}>{phone}</a>
          </div>
          <nav aria-label="Footer services">
            <h3>Services</h3>
            {(navigation.services || []).map((item) => (
              <Link key={item.slug} href={`/${item.slug}`}>{item.label}</Link>
            ))}
          </nav>
          <nav aria-label="Footer locations">
            <h3>Locations</h3>
            {(navigation.locations || []).slice(0, 4).map((item) => (
              <Link key={item.slug} href={`/${item.slug}`}>{item.label}</Link>
            ))}
          </nav>
          <nav aria-label="Footer company">
            <h3>Company</h3>
            <Link href="/seo-index">Landing Pages</Link>
            <Link href="/blog">Blog</Link>
            <a href={`tel:${phoneRaw}`}>Get Free Quote</a>
            <div className="social-links"><a href="#" aria-label="Google profile">G</a><a href="#" aria-label="Yelp profile">Y</a></div>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>{siteName} · {address}</span>
          <span>&copy; {copyright}</span>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <nav className="bottom-nav" aria-label="Mobile navigation">
        <Link href="/" className={`bottom-nav-item ${pathname === '/' ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span>Home</span>
        </Link>
        <a href={`tel:${phoneRaw}`} className="bottom-nav-item bottom-nav-call">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-3.2c.3-.4.7-.5 1.1-.3 1.2.5 2.5.8 3.8.9.5 0 .9.4.9.9v3.3c0 .5-.4 1-.9 1C9.4 20.5 3.5 14.6 3 6.7c0-.5.4-.9.9-.9h3.3c.5 0 .9.4.9.9.1 1.3.4 2.6.9 3.8.1.4 0 .9-.3 1.1L6.6 10.8Z"/></svg>
          <span>Call Now</span>
        </a>
      </nav>
    </>
  );
}
