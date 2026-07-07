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

export default function HomepageEditorClient({
  initialContent,
  initialTitle,
}: {
  initialContent: string;
  initialTitle: string;
}) {
  const initialHtml = useMemo(() => textToHtml(initialContent || ''), [initialContent]);
  const [htmlContent, setHtmlContent] = useState(initialHtml);
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

      setHtmlContent(textToHtml(text));
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'An error occurred');
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
            {aiLoading ? <><span className="spinner" />Generating...</> : 'AI ile Üret'}
          </button>
        </div>

        <RichTextEditor
          value={htmlContent}
          onChange={(html) => setHtmlContent(html)}
          placeholder="Anasayfa içeriğini buraya yazın..."
          minHeight={300}
        />

        <input type="hidden" name="content" value={htmlContent} />

        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
          Zengin metin düzenleyicisini kullanarak içeriğinizi biçimlendirin.
        </div>
      </div>

      {aiError && (
        <div className="alert alert-error">{aiError}</div>
      )}
    </>
  );
}
