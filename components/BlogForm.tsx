'use client';

import { useState, useMemo } from 'react';
import AIContentGenerator from './AIContentGenerator';
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

interface Props {
  defaultTitle?: string;
  defaultDescription?: string;
  defaultContent?: string;
  defaultCategory?: string;
  defaultTags?: string;
  defaultPublished?: boolean;
  slug?: string;
  date?: string;
  postId?: string;
  formAction: (formData: FormData) => void;
}

export default function BlogForm({
  defaultTitle = '',
  defaultDescription = '',
  defaultContent = '',
  defaultCategory = 'Uncategorized',
  defaultTags = '',
  defaultPublished = true,
  slug,
  date,
  postId,
  formAction,
}: Props) {
  const initialHtml = useMemo(() => textToHtml(defaultContent || ''), [defaultContent]);
  const [htmlContent, setHtmlContent] = useState(initialHtml);

  const handleAIContent = (content: string, title?: string, description?: string) => {
    const titleEl = document.querySelector<HTMLInputElement>('input[name="title"]');
    const descEl = document.querySelector<HTMLTextAreaElement>('textarea[name="description"]');

    if (title && titleEl) titleEl.value = title;
    if (description && descEl) descEl.value = description;
    if (content) setHtmlContent(textToHtml(content));
  };

  return (
    <form action={formAction}>
      {postId && <input type="hidden" name="postId" value={postId} />}

      <div className="form-group">
        <label>Title</label>
        <input type="text" name="title" className="form-control" defaultValue={defaultTitle} placeholder="e.g., Emergency Lockout Tips for Orlando" required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Category</label>
          <select name="category" className="form-control" defaultValue={defaultCategory}>
            <option value="Lockout Guides">Lockout Guides</option>
            <option value="Automotive Keys">Automotive Keys</option>
            <option value="Security Tips">Security Tips</option>
            <option value="Company News">Company News</option>
            <option value="Uncategorized">Uncategorized</option>
          </select>
        </div>
        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input type="text" name="tags" className="form-control" defaultValue={defaultTags} placeholder="Orlando, emergency, lockout" />
        </div>
      </div>

      {slug && (
        <div className="form-row">
          <div className="form-group">
            <label>Slug</label>
            <input type="text" className="form-control" value={slug} disabled style={{ opacity: 0.6 }} />
          </div>
          {date && (
            <div className="form-group">
              <label>Date</label>
              <input type="text" className="form-control" value={date} disabled style={{ opacity: 0.6 }} />
            </div>
          )}
        </div>
      )}

      <div className="form-group">
        <label>Meta Description (for SEO)</label>
        <textarea name="description" className="form-control" rows={2} defaultValue={defaultDescription} placeholder="Brief description for search results..." required />
      </div>

      <AIContentGenerator onContentGenerated={handleAIContent} initialPrompt="" />

      <div className="form-group">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <label style={{ margin: 0, fontWeight: 600 }}>Blog Icerigi</label>
        </div>
        <RichTextEditor
          value={htmlContent}
          onChange={(html) => setHtmlContent(html)}
          placeholder="Blog içeriğini buraya yazın..."
          minHeight={300}
        />
        <input type="hidden" name="content" value={htmlContent} />
        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
          Zengin metin düzenleyicisini kullanarak içeriğinizi biçimlendirin.
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>
            <input type="checkbox" name="published" defaultChecked={defaultPublished} />
            {' '}{slug ? 'Published' : 'Publish immediately'}
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button type="submit" className="btn btn-primary">{slug ? 'Save Changes' : 'Create Post'}</button>
      </div>
    </form>
  );
}
