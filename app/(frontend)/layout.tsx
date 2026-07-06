import { getData } from '@/lib/data';
import FrontendLayoutClient from './_components/FrontendLayoutClient';

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const data = await getData();

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
