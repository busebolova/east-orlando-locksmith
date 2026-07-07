import React from 'react';

/**
 * Parses plain text with markdown-like formatting into React elements.
 * Supports:
 *   ## Heading
 *   - List item
 *   **bold text**
 *   Blank lines as <br />
 *   Everything else as <p>
 */
export function renderContent(text: string): React.ReactNode[] {
  if (!text) return [];

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
    // Parse **bold** markers by splitting on regex and returning mixed array
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
