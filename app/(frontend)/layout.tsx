import { getData } from '@/lib/data';
import FrontendLayoutClient from './_components/FrontendLayoutClient';

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const data = await getData();

  if (data.maintenanceMode) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#071321',
        color: 'white',
        padding: 32,
        textAlign: 'center',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔧</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Bakım Modu</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, maxWidth: 400 }}>
          Sitemiz şu anda bakım çalışmaları nedeniyle geçici olarak hizmet dışıdır. Kısa süre içinde tekrar yayında olacağız.
        </p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 24 }}>
          {data.siteName} &mdash; {data.phone}
        </p>
      </div>
    );
  }

  return (
    <FrontendLayoutClient
      siteName={data.siteName}
      phone={data.phone}
      phoneRaw={data.phoneRaw}
      address={data.address}
      hours={data.hours}
      googleRating={data.googleRating}
      reviewCount={data.reviewCount}
      serviceArea={data.serviceArea}
      navigation={data.navigation}
      footerDesc={data.siteContent.footer.description}
      copyright={data.siteContent.footer.copyright}
    >
      {children}
    </FrontendLayoutClient>
  );
}
