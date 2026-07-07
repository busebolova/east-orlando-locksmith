'use client';

import { useState, useEffect, useCallback } from 'react';

type ImageAsset = { name: string; url: string };

export default function MediaManagerClient() {
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadImages = useCallback(async () => {
    try {
      const res = await fetch('/api/assets');
      if (res.ok) {
        const data = await res.json();
        setImages(data.images || []);
      }
    } catch {}
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/assets', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: `Uploaded: ${data.fileName}` });
        await loadImages();
      } else {
        setMessage({ type: 'error', text: data.error || 'Upload failed' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Upload failed' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleDelete(url: string) {
    if (!confirm('Delete this image?')) return;
    try {
      const res = await fetch('/api/assets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Image deleted' });
        await loadImages();
      } else {
        setMessage({ type: 'error', text: 'Delete failed' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Delete failed' });
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setMessage({ type: 'success', text: 'URL copied to clipboard!' });
  }

  return (
    <div>
      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message.text}
        </div>
      )}

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h3>Upload New Image</h3>
        </div>
        <div className="card-body">
          <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
            {uploading ? 'Uploading...' : 'Choose File & Upload'}
            <input
              type="file"
              accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
              onChange={handleUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </label>
          <p style={{ marginTop: 8, fontSize: 12, color: 'var(--gray-500)' }}>
            Allowed: PNG, JPG, GIF, WebP, SVG — Max 5MB
          </p>
        </div>
      </div>

      {images.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🖼️</div>
          <h3>No images yet</h3>
          <p>Upload your first image above.</p>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 16,
      }}>
        {images.map((img) => (
          <div key={img.name} className="card" style={{ overflow: 'hidden' }}>
            <div style={{
              height: 140,
              background: 'var(--gray-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <img
                src={img.url}
                alt={img.name}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            </div>
            <div style={{ padding: '8px 10px' }}>
              <p style={{ fontSize: 11, color: 'var(--gray-500)', wordBreak: 'break-all', marginBottom: 6 }}>
                {img.name}
              </p>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => copyUrl(img.url)}
                  style={{ flex: 1, fontSize: 11 }}
                >
                  Copy URL
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(img.url)}
                  style={{ fontSize: 11 }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
