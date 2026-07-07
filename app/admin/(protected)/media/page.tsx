import MediaManagerClient from './MediaManagerClient';

export default function MediaPage() {
  return (
    <>
      <div className="topbar-admin">
        <h2>Media Library</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/admin" className="btn btn-sm btn-secondary">← Dashboard</a>
        </div>
      </div>
      <div className="page-content">
        <MediaManagerClient />
      </div>
    </>
  );
}
