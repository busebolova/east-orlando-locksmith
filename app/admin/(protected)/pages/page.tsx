import Link from 'next/link';
import { getPages } from '@/lib/data';

export default async function AdminPagesPage() {
  const pages = await getPages();

  return (
    <>
      <div className="topbar-admin">
        <h2>Pages Management</h2>
      </div>
      <div className="page-content">
        <div className="card">
          <div className="card-header">
            <h3>All Pages</h3>
            <span style={{ fontSize: 13, color: '#6b7280' }}>{pages.length} total</span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug / URL</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr key={page.id}>
                    <td style={{ fontWeight: 500 }}>{page.title}</td>
                    <td style={{ color: '#6b7280', fontSize: 13 }}>/{page.slug}</td>
                    <td>
                      <span className="badge" style={{
                        background: page.type === 'homepage' ? '#fef3c7' :
                          page.type === 'service' ? '#dbeafe' :
                          page.type === 'location' ? '#ede9fe' :
                          page.type === 'brand' ? '#fce7f3' : '#f3f4f6',
                        color: page.type === 'homepage' ? '#92400e' :
                          page.type === 'service' ? '#1e40af' :
                          page.type === 'location' ? '#5b21b6' :
                          page.type === 'brand' ? '#9d174d' : '#374151'
                      }}>
                        {page.type}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${page.published ? 'badge-published' : 'badge-draft'}`}>
                        {page.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/pages/${page.id}`} className="btn btn-sm btn-secondary">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
