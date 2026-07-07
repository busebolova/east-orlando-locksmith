'use client';

import { useState, useCallback, useMemo } from 'react';
import RichTextEditor from '@/components/RichTextEditor';

function textToHtml(text: string): string {
  if (!text) return '';
  if (/<[a-z][\s\S]*>/i.test(text)) return text;
  return text.split('\n').map((line) => {
    if (line.startsWith('## ')) return `<h3>${line.slice(3)}</h3>`;
    if (line.startsWith('- ')) return `<li>${line.slice(2)}</li>`;
    if (line.trim() === '') return '<br />';
    return `<p>${line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>`;
  }).join('\n');
}

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
  const initialHtml = useMemo(() => textToHtml(initialContent || ''), [initialContent]);
  const [htmlContent, setHtmlContent] = useState(initialHtml);
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
      const prompt = `Write SEO-optimized body content for a locksmith service page titled "${currentTitle}".${pageService ? ` Service: ${pageService}.` : ''}${pageLocation ? ` Location: ${pageLocation}.` : ''} Include 2-3 sections with headings. Write in a professional, trustworthy tone. Focus on what the customer needs to know. Return ONLY plain text with ## for headings, **bold** for emphasis, and - for list items. No HTML.`;

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

      setHtmlContent(textToHtml(text));
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
  }, [pageLocation, pageService, getCurrentTitle]);

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

        <RichTextEditor
          value={htmlContent}
          onChange={(html) => setHtmlContent(html)}
          placeholder="Sayfa içeriğini buraya yazın..."
          minHeight={300}
        />

        <input type="hidden" name="content" value={htmlContent} />

        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
          Zengin metin düzenleyicisini kullanarak içeriğinizi biçimlendirin.
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
