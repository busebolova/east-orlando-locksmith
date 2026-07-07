'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
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
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Placeholder.configure({
        placeholder: 'Sayfa içeriğini buraya yazın...',
      }),
    ],
    content: initialContent || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  });

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
      const prompt = `Write SEO-optimized body content for a locksmith service page titled "${currentTitle}".${pageService ? ` Service: ${pageService}.` : ''}${pageLocation ? ` Location: ${pageLocation}.` : ''} Include 2-3 sections with headings. Write in a professional, trustworthy tone. Focus on what the customer needs to know. Return ONLY the HTML content with h2, h3, p, ul, li tags.`;

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate content');

      editor?.commands.setContent(data.content);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setAiLoading(false);
    }
  }, [editor, pageService, pageLocation, getCurrentTitle]);

  const tools = [
    { label: 'Bold', action: () => editor?.chain().focus().toggleBold().run(), isActive: () => editor?.isActive('bold') },
    { label: 'Italic', action: () => editor?.chain().focus().toggleItalic().run(), isActive: () => editor?.isActive('italic') },
    { label: 'H2', action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), isActive: () => editor?.isActive('heading', { level: 2 }) },
    { label: 'H3', action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), isActive: () => editor?.isActive('heading', { level: 3 }) },
    { label: 'Bullet List', action: () => editor?.chain().focus().toggleBulletList().run(), isActive: () => editor?.isActive('bulletList') },
    { label: 'Ordered List', action: () => editor?.chain().focus().toggleOrderedList().run(), isActive: () => editor?.isActive('orderedList') },
  ];

  return (
    <div className="form-group">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <label style={{ margin: 0 }}>Sayfa İçeriği</label>
        <button
          type="button"
          className="btn btn-gold btn-sm"
          onClick={handleGenerateAI}
          disabled={aiLoading}
          style={{ background: '#e6a329', color: '#071321', border: 'none', fontWeight: 600, gap: 6 }}
        >
          {aiLoading ? (
            <>
              <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }}></span>
              Oluşturuluyor...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              AI ile Üret
            </>
          )}
        </button>
      </div>

      {/* Toolbar */}
      <div style={{
        display: 'flex', gap: 2, padding: '6px 8px', border: '1px solid #d1d5db', borderBottom: 'none',
        borderTopLeftRadius: 6, borderTopRightRadius: 6, background: '#f9fafb', flexWrap: 'wrap',
      }}>
        {tools.map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={t.action}
            title={t.label}
            style={{
              padding: '4px 10px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              border: '1px solid transparent', borderRadius: 4,
              background: t.isActive() ? '#e6a329' : 'transparent',
              color: t.isActive() ? '#fff' : '#374151',
            }}
          >
            {t.label === 'Bold' ? <strong>B</strong> :
             t.label === 'Italic' ? <em style={{ fontStyle: 'italic' }}>I</em> :
             t.label}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div style={{
        border: '1px solid #d1d5db', borderBottomLeftRadius: 6, borderBottomRightRadius: 6,
        background: '#fff', minHeight: 320,
      }}>
        <style>{`
          .ProseMirror p { margin: 0 0 8px; }
          .ProseMirror h2 { font-size: 1.25rem; font-weight: 700; margin: 16px 0 8px; }
          .ProseMirror h3 { font-size: 1.1rem; font-weight: 600; margin: 12px 0 6px; }
          .ProseMirror ul, .ProseMirror ol { padding-left: 24px; margin: 0 0 8px; }
          .ProseMirror li { margin-bottom: 2px; }
          .ProseMirror ul { list-style-type: disc; }
          .ProseMirror ol { list-style-type: decimal; }
          .ProseMirror p.is-editor-empty:first-child::before {
            content: attr(data-placeholder); float: left; color: #9ca3af; pointer-events: none; height: 0;
          }
        `}</style>
        <EditorContent editor={editor} />
      </div>

      {/* Hidden input to submit HTML content */}
      <input type="hidden" name="content" value={editor?.getHTML() || ''} />

      {aiError && (
        <div style={{ marginTop: 8, padding: '8px 12px', background: '#fef2f2', borderRadius: 6, fontSize: 13, color: '#991b1b' }}>
          {aiError}
        </div>
      )}

      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
        Önce sayfa başlığını girin, ardından "AI ile Üret" butonuyla otomatik içerik oluşturabilirsiniz. Veya manuel olarak yazın.
      </div>
    </div>
  );
}
