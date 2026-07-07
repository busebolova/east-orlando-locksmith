import { getData, saveData } from '@/lib/data';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import SectionsEditorClient from './SectionsEditorClient';

export default async function HomepageSectionsPage() {
  const data = await getData();
  const { homepage } = data.siteContent;

  async function saveSections(formData: FormData) {
    'use server';
    const raw = formData.get('homepageData') as string;
    const sections = JSON.parse(raw);
    const fresh = await getData();
    fresh.siteContent.homepage = sections;
    await saveData(fresh);
    redirect('/admin/homepage/sections');
  }

  return (
    <>
      <div className="topbar-admin">
        <h2>Homepage Sections</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/" className="btn btn-sm btn-secondary" target="_blank">View Site</Link>
          <Link href="/admin" className="btn btn-sm btn-secondary">← Dashboard</Link>
        </div>
      </div>
      <div className="page-content" style={{ maxWidth: 900 }}>
        <form action={saveSections}>
          <SectionsEditorClient initialData={homepage} />
          <div style={{ marginTop: 24, marginBottom: 48, display: 'flex', gap: 8 }}>
            <button type="submit" className="btn btn-primary">Save All Sections</button>
          </div>
        </form>
      </div>
    </>
  );
}
