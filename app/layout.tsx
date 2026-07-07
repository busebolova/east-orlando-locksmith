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
      </head>
      <body>{children}</body>
    </html>
  );
}
