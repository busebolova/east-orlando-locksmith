'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface HeaderSettingsProps {
  headerLogo: string;
  headerLogoWidth: number;
  headerLogoHeight: number;
  favicon: string;
}

export default function HeaderSettingsClient({ headerLogo, headerLogoWidth, headerLogoHeight, favicon }: HeaderSettingsProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [logo, setLogo] = useState(headerLogo);
  const [logoW, setLogoW] = useState(headerLogoWidth);
  const [logoH, setLogoH] = useState(headerLogoHeight);
  const [fav, setFav] = useState(favicon);

  async function handleSave(formData: FormData) {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch('/admin/header-settings/api', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Save failed');
      setMsg({ type: 'success', text: 'Header settings saved!' });
      router.refresh();
    } catch {
      setMsg({ type: 'error', text: 'Failed to save settings.' });
    } finally {
      setSaving(false);
    }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/assets', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setLogo(data.url);
        setMsg({ type: 'success', text: 'Logo uploaded!' });
      } else {
        setMsg({ type: 'error', text: data.error || 'Upload failed' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Upload failed' });
    }
  }

  async function handleFaviconUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/assets', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setFav(data.url);
        setMsg({ type: 'success', text: 'Favicon uploaded!' });
      } else {
        setMsg({ type: 'error', text: data.error || 'Upload failed' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Upload failed' });
    }
  }

  return (
    <form action={handleSave}>
      {msg && (
        <div className={`alert ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {msg.text}
        </div>
      )}

      {/* Header Logo */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header"><h3>Header Logo</h3></div>
        <div className="card-body">
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
              Current logo preview:
            </p>
            <div style={{ background: '#071321', borderRadius: 8, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 100 }}>
              {logo ? (
                <img src={logo} alt="Header logo" style={{ maxWidth: 300, maxHeight: 80, objectFit: 'contain' }} />
              ) : (
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>No custom logo set</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Upload New Logo</label>
            <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={handleLogoUpload} style={{ fontSize: 13 }} />
            <small style={{ fontSize: 11, color: '#9ca3af', display: 'block', marginTop: 4 }}>
              Recommended: transparent PNG or SVG. Max 5MB.
            </small>
          </div>

          <div className="form-group">
            <label>Or Enter Logo URL</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://example.com/logo.png"
              value={logo}
              onChange={e => setLogo(e.target.value)}
            />
            <small style={{ fontSize: 11, color: '#9ca3af', display: 'block', marginTop: 4 }}>
              Paste an external image URL, or upload above to auto-fill this field.
            </small>
          </div>

          <input type="hidden" name="headerLogo" value={logo} />

          <div className="form-row">
            <div className="form-group">
              <label>Logo Width (px)</label>
              <input type="number" name="headerLogoWidth" className="form-control" value={logoW} onChange={e => setLogoW(Number(e.target.value))} min={20} max={800} />
            </div>
            <div className="form-group">
              <label>Logo Height (px)</label>
              <input type="number" name="headerLogoHeight" className="form-control" value={logoH} onChange={e => setLogoH(Number(e.target.value))} min={10} max={400} />
            </div>
          </div>
        </div>
      </div>

      {/* Favicon */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header"><h3>Favicon</h3></div>
        <div className="card-body">
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, border: '1px solid #e5e7eb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
              {fav ? (
                <img src={fav} alt="Favicon preview" style={{ width: 32, height: 32, objectFit: 'contain' }} />
              ) : (
                <span style={{ color: '#d1d5db', fontSize: 20 }}>?</span>
              )}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>
                {fav ? fav.split('/').pop() : 'Default favicon (/favicon.ico)'}
              </div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Upload a 32x32 or 64x64 ICO or PNG</div>
            </div>
          </div>

          <div className="form-group">
            <label>Upload New Favicon</label>
            <input type="file" accept="image/png,image/x-icon,image/vnd.microsoft.icon" onChange={handleFaviconUpload} style={{ fontSize: 13 }} />
          </div>

          <div className="form-group">
            <label>Or Enter Favicon URL</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://example.com/favicon.ico"
              value={fav}
              onChange={e => setFav(e.target.value)}
            />
            <small style={{ fontSize: 11, color: '#9ca3af', display: 'block', marginTop: 4 }}>
              Paste an external favicon URL, or upload above to auto-fill this field.
            </small>
          </div>

          <input type="hidden" name="favicon" value={fav} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Header Settings'}
        </button>
      </div>
    </form>
  );
}
