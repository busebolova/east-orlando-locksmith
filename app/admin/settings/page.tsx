import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getData, saveData } from '@/lib/data';

export default async function SettingsPage() {
  const data = await getData();

  async function handleUpdate(formData: FormData) {
    'use server';
    const fresh = await getData();
    fresh.siteName = formData.get('siteName') as string;
    fresh.phone = formData.get('phone') as string;
    fresh.phoneRaw = formData.get('phoneRaw') as string;
    fresh.address = formData.get('address') as string;
    fresh.email = formData.get('email') as string;
    fresh.serviceArea = formData.get('serviceArea') as string;
    fresh.hours = formData.get('hours') as string;
    fresh.googleRating = formData.get('googleRating') as string;
    fresh.reviewCount = formData.get('reviewCount') as string;
    fresh.siteContent.hero.title = formData.get('heroTitle') as string;
    fresh.siteContent.hero.subtitle = formData.get('heroSubtitle') as string;
    fresh.siteContent.hero.cta = formData.get('heroCta') as string;
    fresh.siteContent.footer.description = formData.get('footerDesc') as string;
    fresh.siteContent.footer.copyright = formData.get('footerCopyright') as string;
    await saveData(fresh);
    redirect('/admin/settings');
  }

  async function handleNavUpdate(formData: FormData) {
    'use server';
    const group = formData.get('navGroup') as string;
    const label = formData.get('navLabel') as string;
    const slug = formData.get('navSlug') as string;
    const action = formData.get('navAction') as string;

    const fresh = await getData();
    const nav = fresh.navigation[group as keyof typeof fresh.navigation] || [];

    if (action === 'add') {
      nav.push({ label, slug });
    } else if (action === 'remove') {
      const idx = parseInt(formData.get('navIndex') as string);
      nav.splice(idx, 1);
    }
    fresh.navigation[group as keyof typeof fresh.navigation] = nav;
    await saveData(fresh);
    redirect('/admin/settings');
  }

  return (
    <>
      <div className="topbar-admin">
        <h2>Site Settings</h2>
        <Link href="/admin" className="btn btn-sm btn-secondary">← Dashboard</Link>
      </div>
      <div className="page-content" style={{ maxWidth: 800 }}>

        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header"><h3>Business Information</h3></div>
          <div className="card-body">
            <form action={handleUpdate}>
              <div className="form-row">
                <div className="form-group">
                  <label>Business Name</label>
                  <input type="text" name="siteName" className="form-control" defaultValue={data.siteName} required />
                </div>
                <div className="form-group">
                  <label>Display Phone</label>
                  <input type="text" name="phone" className="form-control" defaultValue={data.phone} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Raw Phone (tel: link)</label>
                  <input type="text" name="phoneRaw" className="form-control" defaultValue={data.phoneRaw} required />
                </div>
                <div className="form-group">
                  <label>Hours</label>
                  <input type="text" name="hours" className="form-control" defaultValue={data.hours} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" className="form-control" defaultValue={data.email} />
                </div>
                <div className="form-group">
                  <label>Google Rating</label>
                  <input type="text" name="googleRating" className="form-control" defaultValue={data.googleRating} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Review Count</label>
                  <input type="text" name="reviewCount" className="form-control" defaultValue={data.reviewCount} />
                </div>
                <div className="form-group">
                  <label>Service Area</label>
                  <input type="text" name="serviceArea" className="form-control" defaultValue={data.serviceArea} />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <input type="text" name="address" className="form-control" defaultValue={data.address} required />
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', marginTop: 16, paddingTop: 16 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Hero Section</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Hero Title</label>
                    <input type="text" name="heroTitle" className="form-control" defaultValue={data.siteContent.hero.title} />
                  </div>
                  <div className="form-group">
                    <label>Hero CTA</label>
                    <input type="text" name="heroCta" className="form-control" defaultValue={data.siteContent.hero.cta} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Hero Subtitle</label>
                  <textarea name="heroSubtitle" className="form-control" rows={2} defaultValue={data.siteContent.hero.subtitle} />
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', marginTop: 16, paddingTop: 16 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Footer</h4>
                <div className="form-group">
                  <label>Footer Description</label>
                  <textarea name="footerDesc" className="form-control" rows={2} defaultValue={data.siteContent.footer.description} />
                </div>
                <div className="form-group">
                  <label>Copyright</label>
                  <input type="text" name="footerCopyright" className="form-control" defaultValue={data.siteContent.footer.copyright} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }}>Save All Settings</button>
            </form>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header"><h3>Navigation Editor</h3></div>
          <div className="card-body">
            {Object.entries(data.navigation).map(([group, items]) => (
              <div key={group} style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #f3f4f6' }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, textTransform: 'capitalize', marginBottom: 8, color: '#374151' }}>
                  {group} ({items.length} items)
                </h4>
                <table className="data-table" style={{ fontSize: 13, marginBottom: 8 }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '6px 10px', fontSize: 11 }}>Label</th>
                      <th style={{ padding: '6px 10px', fontSize: 11 }}>Slug</th>
                      <th style={{ padding: '6px 10px', fontSize: 11, width: 80 }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item: { label: string; slug: string }, idx: number) => (
                      <tr key={idx}>
                        <td style={{ padding: '6px 10px' }}>{item.label}</td>
                        <td style={{ padding: '6px 10px', color: '#6b7280' }}>/{item.slug}</td>
                        <td style={{ padding: '6px 10px' }}>
                          <form action={handleNavUpdate}>
                            <input type="hidden" name="navGroup" value={group} />
                            <input type="hidden" name="navIndex" value={idx} />
                            <input type="hidden" name="navAction" value="remove" />
                            <button type="submit" className="btn btn-sm btn-danger" style={{ padding: '2px 6px', fontSize: 11 }}>Remove</button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <form action={handleNavUpdate} style={{ display: 'flex', gap: 8, alignItems: 'end' }}>
                  <input type="hidden" name="navGroup" value={group} />
                  <input type="hidden" name="navAction" value="add" />
                  <div>
                    <input type="text" name="navLabel" className="form-control" placeholder="Label" required style={{ padding: '6px 10px', fontSize: 13 }} />
                  </div>
                  <div>
                    <input type="text" name="navSlug" className="form-control" placeholder="page-slug" required style={{ padding: '6px 10px', fontSize: 13 }} />
                  </div>
                  <button type="submit" className="btn btn-sm btn-primary">Add</button>
                </form>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header"><h3>AI Content Generation</h3></div>
          <div className="card-body">
            <div className="ai-generator" style={{ marginBottom: 0 }}>
              <h3>AI API Key (Anthropic / OpenRouter)</h3>
              <p style={{ fontSize: 13, marginBottom: 12, color: '#6b7280' }}>
                AI içerik üretimi için bir API anahtarı girin. Anthropic Claude API veya OpenRouter üzerinden çalışır.
              </p>
              <div className="form-group">
                <label>API Key</label>
                <input type="password" name="aiApiKey" className="form-control" placeholder="sk-ant-... or sk-or-..." defaultValue="" />
                <small style={{ fontSize: 11, color: '#9ca3af' }}>
                  Anahtar sunucuda saklanır, her kullanımda API'ye gönderilir. <Link href="/admin/guide" style={{ color: '#2563eb' }}>Kullanım kılavuzu</Link>
                </small>
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
                <p><strong>AI Prompt Template Örnekleri:</strong></p>
                <ul style={{ paddingLeft: 20, marginTop: 4 }}>
                  <li><code style={{ fontSize: 12 }}>Write a blog post about emergency lockout service in {`{location}`}</code></li>
                  <li><code style={{ fontSize: 12 }}>Write a blog post about {`{brand}`} key replacement in Orlando</code></li>
                  <li><code style={{ fontSize: 12 }}>Write SEO metadata for a locksmith page in {`{zip}`}</code></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header"><h3>Google Services</h3></div>
          <div className="card-body">
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Google Search Console & Analytics</h3>
              <div style={{ fontSize: 13, lineHeight: 1.8, color: '#374151' }}>
                <p><strong>Google Hesabı:</strong> theeastorlandolocksmith@gmail.com</p>
                <ol style={{ paddingLeft: 20, marginTop: 4 }}>
                  <li>Search Console: <a href="https://search.google.com/search-console" target="_blank" style={{ color: '#2563eb' }}>search.google.com/search-console</a></li>
                  <li>"URL prefix" ile <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>https://eastorlandolocksmith.com</code> ekleyin</li>
                  <li>Vercel &gt; Domain ayarlarından TXT kaydı doğrulayın</li>
                  <li>Analytics: <a href="https://analytics.google.com" target="_blank" style={{ color: '#2563eb' }}>analytics.google.com</a></li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>Deployment Info</h3></div>
          <div className="card-body">
            <table className="data-table">
              <tbody>
                <tr><td style={{ fontWeight: 600, width: 160 }}>GitHub Repo</td><td>busebolova/east-orlando-locksmith</td></tr>
                <tr><td style={{ fontWeight: 600 }}>Vercel Project</td><td>east-orlando-locksmith</td></tr>
                <tr><td style={{ fontWeight: 600 }}>Admin Login</td><td><Link href="/admin/login" style={{ color: '#2563eb' }}>/admin</Link></td></tr>
                <tr><td style={{ fontWeight: 600 }}>Admin Credentials</td><td>admin / eoladmin2026</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
