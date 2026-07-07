'use client';

import { useState } from 'react';

interface Props {
  onContentGenerated: (content: string, title?: string, description?: string) => void;
  initialPrompt?: string;
}

export default function AIContentGenerator({ onContentGenerated, initialPrompt = '' }: Props) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError('');

    try {
      const seoPrompt = `Write an SEO-optimized blog post for a locksmith company in Orlando, Florida.

Topic: ${prompt}

Requirements:
- Title
- Meta description (150-160 characters)
- Content with plain text formatting: use ## for section headings, **bold** for emphasis, - for list items
- Include relevant local keywords naturally
- Minimum 500 words
- Use British/American English as appropriate
- Include a call to action to call the locksmith
- Do NOT use HTML tags at all — plain text only with ## headings, **bold**, and - lists

Return the response in this exact format:
TITLE: <the title>
DESCRIPTION: <meta description>
---CONTENT---
<plain text content with ## headings, **bold**, and - list items>`;

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: seoPrompt }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || `API error: ${res.status}`);
      }

      const data = await res.json();
      const fullContent: string = data.content || '';

      const titleMatch = fullContent.match(/TITLE:\s*(.+)/);
      const descMatch = fullContent.match(/DESCRIPTION:\s*(.+)/);
      const contentMatch = fullContent.split('---CONTENT---')[1];

      const title = titleMatch?.[1]?.trim();
      const description = descMatch?.[1]?.trim();
      let content = contentMatch?.trim() || fullContent;
      // Strip any HTML that might still be returned
      content = content.replace(/<\/?[^>]+(>|$)/g, '').replace(/&nbsp;/g, ' ').replace(/\n{3,}/g, '\n\n').trim();

      onContentGenerated(content, title, description);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="ai-generator" style={{
      background: '#f0f4f8',
      border: '1px solid #dce3ed',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#071321' }}>AI Content Generator</span>
        <span style={{ fontSize: 11, color: '#e6a329', fontWeight: 600, background: '#fff3dc', padding: '2px 8px', borderRadius: 4 }}>
          Claude Opus 4.6
        </span>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <input
          type="text"
          className="form-control"
          placeholder="e.g., Emergency lockout tips for Winter Park homeowners"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ flex: 1 }}
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleGenerate}
          disabled={generating || !prompt.trim()}
          style={{ whiteSpace: 'nowrap', background: '#e6a329', color: '#071321', fontWeight: 600 }}
        >
          {generating ? <><span className="spinner" />Generating...</> : 'Generate with AI'}
        </button>
      </div>
      {error && (
        <div style={{ color: '#dc2626', fontSize: 13, marginTop: 8 }}>{error}</div>
      )}
      <div style={{ fontSize: 11, color: '#5b6472', marginTop: 6 }}>
        Describe what you want to write about and AI will generate SEO-optimized content using Zentio API (Claude Opus 4.6).
      </div>
    </div>
  );
}
