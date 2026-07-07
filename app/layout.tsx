import type { Metadata } from 'next';
import './globals.css';
import { getData } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Admin Panel - East Orlando Locksmith',
  description: 'Site management admin panel',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let gaId = '';
  let scVerification = '';
  try {
    const data = await getData();
    gaId = data.googleAnalyticsId || '';
    scVerification = data.googleSearchConsoleVerification || '';
  } catch {}

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/styles.css" />
        <link rel="stylesheet" href="/seo-pages.css" />
        {scVerification && (
          <meta name="google-site-verification" content={scVerification} />
        )}
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></script>
            <script dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaId}');`
            }} />
          </>
        )}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Locksmith",
            "name": "East Orlando Locksmith",
            "image": "https://eastorlandolocksmith.com/assets/hero-locksmith.png",
            "telephone": "+14075555625",
            "email": "info@eastorlandolocksmith.com",
            "description": "24/7 emergency locksmith service in East Orlando. Car key replacement, home lockouts, rekeying, and commercial locksmith services.",
            "areaServed": ["Orlando", "Winter Park", "Oviedo", "Maitland", "Casselberry", "Altamonte Springs", "Baldwin Park", "Waterford Lakes"],
            "openingHours": "Mo-Su 00:00-23:59",
            "priceRange": "$$",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Orlando",
              "addressRegion": "FL",
              "addressCountry": "US"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5.0",
              "reviewCount": "1200",
              "bestRating": "5"
            }
          })
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
