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
            <span className="google-mark">
              <svg viewBox="0 0 48 48" width="24" height="24"><path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/><path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/><path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34A22.96 22.96 0 0 0 2 24c0 3.59.83 7.04 2.34 10.18l7.35-6z"/><path fill="#EA4335" d="M24 9.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 3.18 29.93 1 24 1 15.4 1 7.96 5.93 4.34 13.82l7.35 6c1.73-5.2 6.58-9.07 12.31-9.07z"/></svg>
            </span>
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
            <Link href="/contact">Contact Us</Link>
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
        <a href={`tel:${phoneRaw}`} className="bottom-nav-item bottom-nav-call">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-3.2c.3-.4.7-.5 1.1-.3 1.2.5 2.5.8 3.8.9.5 0 .9.4.9.9v3.3c0 .5-.4 1-.9 1C9.4 20.5 3.5 14.6 3 6.7c0-.5.4-.9.9-.9h3.3c.5 0 .9.4.9.9.1 1.3.4 2.6.9 3.8.1.4 0 .9-.3 1.1L6.6 10.8Z"/></svg>
          <span>Call Now</span>
        </a>
      </nav>
    </>
  );
}
