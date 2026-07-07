import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getData, saveData } from '@/lib/data';
import { renderContent } from '@/lib/content-renderer';
import HomepageEditorClient from './HomepageEditorClient';

export default async function HomepageEditorPage() {
  const data = await getData();
  const page = data.pages.find(p => p.type === 'homepage' && p.slug === 'index');
  if (!page) notFound();

  async function handleUpdate(formData: FormData) {
    'use server';
    const fresh = await getData();
    const idx = fresh.pages.findIndex(p => p.id === 'index');
    if (idx === -1) throw new Error('Homepage not found');

    fresh.pages[idx].title = formData.get('title') as string;
    fresh.pages[idx].description = formData.get('description') as string;
    fresh.pages[idx].content = formData.get('content') as string;
    fresh.pages[idx].seoKeywords = formData.get('seoKeywords') as string;
    fresh.pages[idx].published = formData.get('published') === 'on';

    await saveData(fresh);
    redirect('/admin/homepage');
  }

  return (
    <>
      <div className="topbar-admin">
        <h2>Homepage Editor</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/" className="btn btn-sm btn-secondary" target="_blank">View Site</Link>
          <Link href="/admin" className="btn btn-sm btn-secondary">← Dashboard</Link>
        </div>
      </div>
      <div className="page-content">
        <div className="card">
          <div className="card-header"><h3>Homepage Content</h3></div>
          <div className="card-body">
            <form action={handleUpdate}>
              <div className="form-group">
                <label>Page Title (H1)</label>
                <input type="text" name="title" className="form-control" defaultValue={page.title} required />
              </div>

              <div className="form-group">
                <label>Meta Description (SEO)</label>
                <textarea name="description" className="form-control" rows={3} defaultValue={page.description} required />
              </div>

              <HomepageEditorClient initialContent={page.content || ''} initialTitle={page.title} />

              <div className="form-group">
                <label>SEO Anahtar Kelimeler</label>
                <textarea name="seoKeywords" className="form-control" rows={3} defaultValue={page.seoKeywords || ''} placeholder="SEO anahtar kelimeleri (virgülle ayirin)..." style={{ fontSize: 13 }} />
              </div>

              <div className="form-group">
                <label>
                  <input type="checkbox" name="published" defaultChecked={page.published} />
                  {' '}Published
                </label>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>

        {/* Preview */}
        {page.content && (
          <div className="card" style={{ marginTop: 24 }}>
            <div className="card-header"><h3>Content Preview</h3></div>
            <div className="card-body" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
              {renderContent(page.content)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
