import React from 'react';

/**
 * Renders content to React elements. Supports both HTML (from TipTap editor)
 * and plain text with markdown-like formatting (## headings, **bold**, - lists).
 */
export function renderContent(text: string): React.ReactNode {
  if (!text) return null;

  // Detect HTML content (from TipTap / RichTextEditor)
  if (text.trim().startsWith('<') || /<[a-z][\s\S]*>/i.test(text)) {
    return <div dangerouslySetInnerHTML={{ __html: text }} />;
  }

  // Plain text with markdown-like formatting
  return text.split('\n').map((line, i) => {
    if (line.startsWith('## ')) {
      return <h3 key={i} style={{ marginTop: 24, marginBottom: 8 }}>{line.slice(3)}</h3>;
    }
    if (line.startsWith('- ')) {
      return <li key={i} style={{ marginLeft: 20 }}>{line.slice(2)}</li>;
    }
    if (line.trim() === '') {
      return <br key={i} />;
    }
    const parts = line.split(/(\*\*.+?\*\*)/g);
    const children = parts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
    return <p key={i} style={{ marginBottom: 8 }}>{children}</p>;
  });
}
