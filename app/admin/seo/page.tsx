import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getData, saveData } from '@/lib/data';

export default async function SEOPage() {
  const data = await getData();

  async function handlePageMetaUpdate(formData: FormData) {
    'use server';
    const pageId = formData.get('pageId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const slug = formData.get('slug') as string;
    const published = formData.get('published') === 'on';

    const allData = await getData();
    const idx = allData.pages.findIndex((p) => p.id === pageId);
    if (idx !== -1) {
      allData.pages[idx] = { ...allData.pages[idx], title, description, slug, published };
      await saveData(allData);
    }
    redirect('/admin/seo');
  }

  return (
    <>
      <div className="topbar-admin">
        <h2>SEO Management</h2>
      </div>
      <div className="page-content">
        <div className="ai-generator" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #bbf7d0' }}>
          <h3>SEO Best Practices</h3>
          <ul style={{ fontSize: 13, lineHeight: 2, color: '#166534', paddingLeft: 20, margin: 0 }}>
            <li><strong>Title tags</strong> should be 50-60 characters — include primary keyword + brand name</li>
            <li><strong>Meta descriptions</strong> should be 150-160 characters — compelling call-to-action</li>
            <li><strong>Use descriptive slugs</strong> with hyphens (e.g., orlando-emergency-locksmith)</li>
            <li><strong>Publish only</strong> completed pages — drafts won't appear in sitemap</li>
            <li><strong>Internal links</strong> between related pages improve rankings</li>
          </ul>
        </div>

        {data.pages.map((page) => (
          <div className="card" key={page.id} style={{ marginBottom: 16 }}>
            <div className="card-header">
              <h3>{page.title}</h3>
              <span style={{ fontSize: 12, color: '#6b7280' }}>
                <span className={`badge ${page.published ? 'badge-published' : 'badge-draft'}`}>
                  {page.published ? 'Published' : 'Draft'}
                </span>
                {' '}/{page.type}
              </span>
            </div>
            <div className="card-body">
              <form action={handlePageMetaUpdate}>
                <input type="hidden" name="pageId" value={page.id} />

                <div className="form-row">
                  <div className="form-group">
                    <label>Meta Title (SEO Title)</label>
                    <input type="text" name="title" className="form-control" defaultValue={page.title} required />
                    <small style={{ fontSize: 11, color: '#9ca3af' }}>
                      {page.title.length}/60 chars — {page.title.length > 60 ? <span style={{ color: '#ef4444' }}>too long</span> : 'good'}
                    </small>
                  </div>
                  <div className="form-group">
                    <label>Slug / URL</label>
                    <input type="text" name="slug" className="form-control" defaultValue={page.slug} />
                    <small style={{ fontSize: 11, color: '#9ca3af' }}>https://eastorlandolocksmith.com/{page.slug}</small>
                  </div>
                </div>

                <div className="form-group">
                  <label>Meta Description</label>
                  <textarea name="description" className="form-control" rows={2} defaultValue={page.description} required />
                  <small style={{ fontSize: 11, color: '#9ca3af' }}>
                    {page.description.length}/160 chars — {page.description.length > 160 ? <span style={{ color: '#ef4444' }}>too long</span> : 'good'}
                  </small>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                    <input type="checkbox" name="published" defaultChecked={page.published} />
                    Published
                  </label>
                  <button type="submit" className="btn btn-sm btn-primary">Save SEO</button>
                </div>
              </form>
            </div>
          </div>
        ))}

        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-header"><h3>Sitemap & Schema</h3></div>
          <div className="card-body" style={{ fontSize: 13, lineHeight: 1.8 }}>
            <p><strong>Sitemap:</strong> <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>/sitemap.xml</code>
              {' — '}Next.js otomatik olarak tüm sayfaları sitemap'te toplar. Draft durumundaki sayfalar <code>noindex</code> olarak işaretlenmelidir.</p>
            <p><strong>Robots.txt:</strong> <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>/robots.txt</code>
              {' — '}Varsayılan olarak tüm sayfalara izin verir.</p>
            <p><strong>Schema Markup:</strong> Her sayfa LocalBusiness + Service schema'sı içerir. Blog yazılarında Article schema'sı bulunur.</p>
            <p><strong>Canonical URL:</strong> Her sayfa için <code>rel="canonical"</code> etiketi eklenir. Çakışan içerikleri önler.</p>
            <div style={{ marginTop: 12, padding: 12, background: '#fef3c7', borderRadius: 6, fontSize: 12, color: '#92400e' }}>
              <strong>SEO İpucu:</strong> Her sayfanın meta title ve description'ını benzersiz yapın. Kopya içerikler Google'da cezalandırılabilir. Her sayfa için farklı anahtar kelimeler kullanın.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
