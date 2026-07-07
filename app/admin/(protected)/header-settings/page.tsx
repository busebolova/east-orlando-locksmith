import { getData } from '@/lib/data';
import HeaderSettingsClient from './HeaderSettingsClient';

export default async function HeaderSettingsPage() {
  const data = await getData();

  return (
    <>
      <div className="topbar-admin">
        <h2>Header Settings</h2>
        <a href="/admin" className="btn btn-sm btn-secondary">← Dashboard</a>
      </div>
      <div className="page-content" style={{ maxWidth: 800 }}>
        <HeaderSettingsClient
          headerLogo={data.headerLogo || ''}
          headerLogoWidth={data.headerLogoWidth || 315}
          headerLogoHeight={data.headerLogoHeight || 86}
          favicon={data.favicon || ''}
        />
      </div>
    </>
  );
}
