import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getData, savePage } from '@/lib/data';
import PageEditorClient from '../PageEditorClient';
import PageSectionsEditor from '@/components/PageSectionsEditor';

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getData();
  const page = data.pages.find((p) => p.id === id);

  if (!page) notFound();

  async function handleUpdate(formData: FormData) {
    'use server';
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const seoKeywords = formData.get('seoKeywords') as string;
    const published = formData.get('published') === 'on';
    let sections = undefined;
    try {
      const raw = formData.get('pageSections') as string;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Object.keys(parsed).length > 0) sections = parsed;
      }
    } catch { /* invalid JSON, ignore */ }

    await savePage(page!.slug, { title, description, content, seoKeywords, published, sections });
    redirect('/admin/pages');
  }

  return (
    <>
      <div className="topbar-admin">
        <h2>Edit Page: {page.title}</h2>
        <Link href="/admin/pages" className="btn btn-sm btn-secondary">← Back</Link>
      </div>
      <div className="page-content">
        <div className="card">
          <div className="card-body">
            <form action={handleUpdate}>
              <div className="form-group">
                <label>Page Title (H1)</label>
                <input type="text" name="title" className="form-control" defaultValue={page.title} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Slug</label>
                  <input type="text" className="form-control" value={page.slug} disabled style={{ opacity: 0.6 }} />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <input type="text" className="form-control" value={page.type} disabled style={{ opacity: 0.6 }} />
                </div>
              </div>

              <div className="form-group">
                <label>Meta Description (SEO)</label>
                <textarea name="description" className="form-control" rows={3} defaultValue={page.description} required />
              </div>

              <PageEditorClient
                initialContent={page.content || ''}
                initialTitle={page.title}
                pageService={page.service}
                pageLocation={page.location}
              />

              <div style={{ marginTop: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, borderBottom: '2px solid #e6a329', paddingBottom: 8 }}>
                  Sayfa Bölümleri (Sections)
                </h3>
                <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
                  Her sayfanın ön yüzde görünen bölümlerini buradan düzenleyin. Boş bırakılan alanlar varsayılan içerikle gösterilir.
                </p>
                <PageSectionsEditor
                  initialSections={page.sections}
                  pageTitle={page.title}
                  pageService={page.service}
                  pageLocation={page.location}
                />
              </div>

              {page.location && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Location</label>
                    <input type="text" className="form-control" value={page.location} disabled style={{ opacity: 0.6 }} />
                  </div>
                  {page.zip && (
                    <div className="form-group">
                      <label>ZIP Code</label>
                      <input type="text" className="form-control" value={page.zip} disabled style={{ opacity: 0.6 }} />
                    </div>
                  )}
                </div>
              )}

              {page.brand && (
                <div className="form-group">
                  <label>Brand</label>
                  <input type="text" className="form-control" value={page.brand} disabled style={{ opacity: 0.6 }} />
                </div>
              )}

              <div className="form-group">
                <label>
                  <input type="checkbox" name="published" defaultChecked={page.published} />
                  {' '}Published
                </label>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <Link href="/admin/pages" className="btn btn-secondary">Cancel</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
