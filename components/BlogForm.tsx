'use client';

import AIContentGenerator from './AIContentGenerator';

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
  const handleAIContent = (content: string, title?: string, description?: string) => {
    const titleEl = document.querySelector<HTMLInputElement>('input[name="title"]');
    const descEl = document.querySelector<HTMLTextAreaElement>('textarea[name="description"]');
    const contentEl = document.querySelector<HTMLTextAreaElement>('textarea[name="content"]');

    if (title && titleEl) titleEl.value = title;
    if (description && descEl) descEl.value = description;
    if (content && contentEl) contentEl.value = content;
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
        <label>Content (HTML)</label>
        <textarea name="content" className="form-control" rows={slug ? 20 : 15} defaultValue={defaultContent} placeholder="<p>Write your blog content in HTML...</p>" required />
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
