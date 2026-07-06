import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getData, getPage, savePage } from '@/lib/data';

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getData();
  const page = data.pages.find((p) => p.id === id);

  if (!page) notFound();

  async function handleUpdate(formData: FormData) {
    'use server';
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const published = formData.get('published') === 'on';

    const currentPage = await getPage(page.slug);
    if (!currentPage) throw new Error('Page not found');
    await savePage(currentPage.slug, { title, description, published });
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

        <div style={{ marginTop: 16, padding: 16, background: '#fef3c7', borderRadius: 8, border: '1px solid #fde68a', fontSize: 13, color: '#92400e' }}>
          <strong>Note:</strong> Page content is currently managed through the static HTML files. The admin panel controls page metadata (title, description, publish status). Full content editing from the panel requires the Next.js dynamic renderer to be active.
        </div>
      </div>
    </>
  );
}
