'use client';

import { useState, useCallback } from 'react';

interface PageEditorClientProps {
  initialContent: string;
  initialTitle: string;
  pageService?: string;
  pageLocation?: string;
}

export default function PageEditorClient({
  initialContent,
  initialTitle,
  pageService,
  pageLocation,
}: PageEditorClientProps) {
  const [content, setContent] = useState(initialContent || '');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [seoError, setSeoError] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [seoLoading, setSeoLoading] = useState(false);

  const getCurrentTitle = useCallback(() => {
    if (typeof document === 'undefined') return initialTitle;
    const input = document.querySelector<HTMLInputElement>('input[name="title"]');
    return input?.value?.trim() || initialTitle;
  }, [initialTitle]);

  const handleGenerateAI = useCallback(async () => {
    setAiLoading(true);
    setAiError('');

    const currentTitle = getCurrentTitle();

    try {
      const prompt = `Write SEO-optimized body content for a locksmith service page titled "${currentTitle}".${pageService ? ` Service: ${pageService}.` : ''}${pageLocation ? ` Location: ${pageLocation}.` : ''} Include 2-3 sections with headings. Write in a professional, trustworthy tone. Focus on what the customer needs to know. Return ONLY plain text content with sections. Use **bold** for emphasis and format section titles with ## on their own line.`;

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
  }, [pageService, pageLocation, getCurrentTitle]);

  const handleGenerateSEO = useCallback(async () => {
    setSeoLoading(true);
    setSeoError('');

    const currentTitle = getCurrentTitle();
    const currentContent = content || initialContent;

    try {
      const prompt = `Generate a list of relevant SEO keywords and phrases for a locksmith page titled "${currentTitle}" serving ${pageLocation || 'Orlando'} area.${pageService ? ` Service: ${pageService}.` : ''} Include location-based keywords, service keywords, and long-tail phrases. Return as a comma-separated list of keywords.`;

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate SEO keywords');

      setSeoKeywords(data.content.replace(/<\/?[^>]+(>|$)/g, '').trim());
    } catch (err) {
      setSeoError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setSeoLoading(false);
    }
  }, [content, initialContent, pageService, pageLocation, getCurrentTitle]);

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
          placeholder="Sayfa içeriğini buraya yazın... Basit metin olarak. ## ile baslik, **kalın** ve - liste elemani kullanabilirsiniz."
          style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 1.6, minHeight: 300 }}
        />

        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
          ## Baslik  **kalin yazi**  - liste elemani  kullanabilirsiniz.
        </div>
      </div>

      <div className="form-group">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <label style={{ margin: 0, fontWeight: 600 }}>SEO Anahtar Kelimeler</label>
          <button
            type="button"
            className="btn btn-sm"
            onClick={handleGenerateSEO}
            disabled={seoLoading}
            style={{ background: '#e6a329', color: '#071321', border: 'none', fontWeight: 600 }}
          >
            {seoLoading ? 'Oluşturuluyor...' : 'AI ile SEO Üret'}
          </button>
        </div>
        <textarea
          name="seoKeywords"
          className="form-control"
          rows={3}
          value={seoKeywords}
          onChange={(e) => setSeoKeywords(e.target.value)}
          placeholder="SEO anahtar kelimeleri (virgülle ayirin)..."
          style={{ fontSize: 13 }}
        />
      </div>

      {aiError && (
        <div className="alert alert-error">{aiError}</div>
      )}
    </>
  );
}
