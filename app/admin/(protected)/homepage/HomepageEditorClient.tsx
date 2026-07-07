'use client';

import { useState, useCallback } from 'react';

export default function HomepageEditorClient({
  initialContent,
  initialTitle,
}: {
  initialContent: string;
  initialTitle: string;
}) {
  const [content, setContent] = useState(initialContent || '');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const getCurrentTitle = useCallback(() => {
    if (typeof document === 'undefined') return initialTitle;
    const input = document.querySelector<HTMLInputElement>('input[name="title"]');
    return input?.value?.trim() || initialTitle;
  }, [initialTitle]);

  const handleGenerateAI = useCallback(async () => {
    setAiLoading(true);
    setAiError('');

    try {
      const prompt = `Write SEO-optimized homepage content for "${getCurrentTitle()}" — a professional locksmith in Orlando, FL. Include 2-3 sections with headings about our services, why choose us, and service areas. Write in a professional, trustworthy tone. Return ONLY plain text with ## for headings, **bold** for emphasis, and - for list items. No HTML.`;

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate content');

      const text = data.content
        .replace(/<\/?[^>]+(>|$)/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

      setContent(text);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setAiLoading(false);
    }
  }, [getCurrentTitle]);

  return (
    <>
      <div className="form-group">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <label style={{ margin: 0, fontWeight: 600 }}>Sayfa Icerigi</label>
          <button
            type="button"
            className="btn btn-sm"
            onClick={handleGenerateAI}
            disabled={aiLoading}
            style={{ background: '#e6a329', color: '#071321', border: 'none', fontWeight: 600 }}
          >
            {aiLoading ? 'Oluşturuluyor...' : 'AI ile Üret'}
          </button>
        </div>

        <textarea
          name="content"
          className="form-control"
          rows={16}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Anasayfa içeriğini buraya yazın... ## ile baslik, **kalın** ve - liste elemani kullanabilirsiniz."
          style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 1.6, minHeight: 300 }}
        />

        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
          ## Baslik  **kalin yazi**  - liste elemani  kullanabilirsiniz.
        </div>
      </div>

      {aiError && (
        <div className="alert alert-error">{aiError}</div>
      )}
    </>
  );
}
