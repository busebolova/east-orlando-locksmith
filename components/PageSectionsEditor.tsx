'use client';

import { useState, useCallback } from 'react';
import type { PageSections, PageFaqItem } from '@/lib/data';
import RichTextEditor from '@/components/RichTextEditor';

interface Props {
  initialSections?: PageSections;
  pageTitle?: string;
  pageService?: string;
  pageLocation?: string;
}

const SECTION_STYLE: React.CSSProperties = {
  marginBottom: 24,
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  background: 'white',
  overflow: 'hidden',
};

const HEADER_STYLE: React.CSSProperties = {
  padding: '12px 16px',
  borderBottom: '1px solid #e5e7eb',
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  userSelect: 'none',
  background: '#f9fafb',
};

const BODY_STYLE: React.CSSProperties = {
  padding: 16,
};

const ROW_STYLE: React.CSSProperties = {
  marginBottom: 12,
};

const AI_BTN_STYLE: React.CSSProperties = {
  background: '#e6a329',
  color: '#071321',
  border: 'none',
  borderRadius: 4,
  padding: '4px 10px',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

function renderField(
  label: string,
  value: string | undefined,
  onChange: (v: string) => void,
  opts?: { placeholder?: string; rows?: number; mono?: boolean }
) {
  return (
    <div style={ROW_STYLE}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 3 }}>{label}</label>
      {opts?.rows ? (
        <textarea
          className="form-control"
          rows={opts.rows}
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          placeholder={opts?.placeholder || ''}
          style={{ fontSize: 13, fontFamily: opts?.mono ? 'monospace' : 'inherit' }}
        />
      ) : (
        <input
          type="text"
          className="form-control"
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          placeholder={opts?.placeholder || ''}
          style={{ fontSize: 13, fontFamily: opts?.mono ? 'monospace' : 'inherit' }}
        />
      )}
    </div>
  );
}

function renderRichTextField(label: string, value: string | undefined, onChange: (v: string) => void, placeholder?: string) {
  return (
    <div style={ROW_STYLE}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 3 }}>{label}</label>
      <RichTextEditor value={value ?? ''} onChange={onChange} placeholder={placeholder || ''} minHeight={150} />
    </div>
  );
}

function AiButton({ onClick, loading, label }: { onClick: () => void; loading: boolean; label?: string }) {
  return (
    <button type="button" style={AI_BTN_STYLE} onClick={onClick} disabled={loading}>
      {loading ? <><span className="spinner" />Generating...</> : label || 'AI ile Üret'}
    </button>
  );
}

function useAiSection(pageTitle?: string, pageService?: string, pageLocation?: string) {
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const generate = useCallback(async (section: string, prompt: string): Promise<string | null> => {
    setLoading(prev => ({ ...prev, [section]: true }));
    try {
      const ctx = `Page titled "${pageTitle || 'Locksmith Service'}".${pageService ? ` Service: ${pageService}.` : ''}${pageLocation ? ` Location: ${pageLocation}.` : ''}`;
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${ctx}\n\n${prompt}\n\nReturn ONLY the raw content, no HTML, no code blocks, no markdown wrappers.`,
          model: 'claude-opus-4-6',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      let text = (data.content || '').replace(/<\/?[^>]+(>|$)/g, '').replace(/&nbsp;/g, ' ').trim();
      return text;
    } catch {
      return null;
    } finally {
      setLoading(prev => ({ ...prev, [section]: false }));
    }
  }, [pageTitle, pageService, pageLocation]);

  return { generate, loading };
}

export default function PageSectionsEditor({ initialSections, pageTitle, pageService, pageLocation }: Props) {
  const [data, setData] = useState<PageSections>(() => {
    if (initialSections && Object.keys(initialSections).length > 0) return initialSections;
    const loc = pageLocation || 'Orlando';
    const svc = pageService || 'Locksmith';
    return {
      introEyebrow: 'Overview',
      introHeading: `Professional ${svc} Service in ${loc}`,
      introText: `Trusted locksmith service for ${loc} — covering ${svc.toLowerCase()} needs with professional dispatch, modern equipment, and clear communication from the first call to job completion.`,
      problemHeading: 'Problem',
      problemText: `A lock issue usually arrives at the worst possible time. Whether you're locked out of your home or business, dealing with a broken key, or need urgent access after hours, waiting around for uncertain help adds stress to an already frustrating situation. In ${loc}, you need a locksmith who confirms the details, gives a clear estimate, and arrives ready to work.`,
      solutionHeading: 'Solution',
      solutionText: `East Orlando Locksmith dispatches a trained technician with entry tools, key programming equipment, and common lock hardware. We confirm your address, quote the likely service range, and explain whether non-destructive entry, rekeying, repair, or replacement is the right step — before any work begins.`,
      localEyebrow: 'Local Coverage',
      localHeading: 'Local Expertise Matters',
      localText: `We regularly route technicians through ${loc} and surrounding corridors. Our dispatch pattern is built around local streets, residential communities, and business districts so we can provide reliable arrival estimates and professional service every time.`,
      detailEyebrow: 'Service Details',
      detailHeading: `${svc} Work We Handle`,
      detailList: [
        'Emergency lockout service for homes, apartments, and condos',
        'Vehicle lockout assistance and car key replacement',
        'Business lockouts, storefront access, and after-hours rekeying',
        'Broken key extraction, lock repair, and smart lock installation',
        'Master key system planning for property managers',
        'On-site key programming for modern transponder and smart fob systems',
      ],
      trustEyebrow: 'Trust Signals',
      trustHeading: 'Why People Choose East Orlando Locksmith',
      trustText: 'Licensed and insured service, upfront pricing, arrival updates, photo-ready work notes, and technicians who carry common residential, commercial, and automotive tools.',
      trustBadges: [
        'Licensed & Insured',
        '24/7 Dispatch',
        'Upfront Pricing',
        'Local Coverage',
        'GPS Tracking',
        'Satisfaction Guaranteed',
      ],
      faqEyebrow: 'Questions People Search Before Calling',
      faqHeading: 'FAQ',
      faqItems: [
        { question: `How fast can a locksmith reach ${loc}?`, answer: `Most ${loc} calls are routed to the closest available technician. Get instant service — call now for professional locksmith help.` },
        { question: 'Can you unlock my door without replacing the lock?', answer: 'Many house, apartment, and car lockouts can be opened without replacing hardware. If the lock is damaged, worn, or unsafe, the technician will explain repair and replacement options before starting any work.' },
        { question: `Do you provide ${svc.toLowerCase()} services after hours?`, answer: `Yes. We handle ${svc.toLowerCase()} calls, lockouts, rekeys, and lock changes around the clock — including nights, weekends, and holidays.` },
      ],
      ctaEyebrow: 'Emergency Ready',
      ctaHeading: 'Ready for Locksmith Help?',
      ctaText: `Call now for professional ${svc.toLowerCase()} service in ${loc}.`,
    };
  });
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['intro']));
  const { generate, loading } = useAiSection(pageTitle, pageService, pageLocation);

  const toggle = useCallback((key: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const addFaqItem = useCallback(() => {
    setData(prev => ({
      ...prev,
      faqItems: [...(prev.faqItems || []), { question: '', answer: '' }],
    }));
  }, []);

  const removeFaqItem = useCallback((index: number) => {
    setData(prev => {
      const items = [...(prev.faqItems || [])];
      items.splice(index, 1);
      return { ...prev, faqItems: items };
    });
  }, []);

  const updateFaqItem = useCallback((index: number, field: 'question' | 'answer', value: string) => {
    setData(prev => {
      const items = [...(prev.faqItems || [])];
      if (items[index]) {
        items[index] = { ...items[index], [field]: value };
      }
      return { ...prev, faqItems: items };
    });
  }, []);

  const addDetailItem = useCallback(() => {
    setData(prev => ({
      ...prev,
      detailList: [...(prev.detailList || []), ''],
    }));
  }, []);

  const removeDetailItem = useCallback((index: number) => {
    setData(prev => {
      const items = [...(prev.detailList || [])];
      items.splice(index, 1);
      return { ...prev, detailList: items };
    });
  }, []);

  const addBadge = useCallback(() => {
    setData(prev => ({
      ...prev,
      trustBadges: [...(prev.trustBadges || []), ''],
    }));
  }, []);

  const removeBadge = useCallback((index: number) => {
    setData(prev => {
      const items = [...(prev.trustBadges || [])];
      items.splice(index, 1);
      return { ...prev, trustBadges: items };
    });
  }, []);

  const handleAiIntro = useCallback(async () => {
    const text = await generate('intro', `Generate 3 fields for the Intro section of this locksmith page:
- Eyebrow: a short label (1-3 words, e.g. "Overview" or "Service Highlight")
- Heading: a compelling H2 heading (max 10 words)
- Text: a descriptive paragraph (2-3 sentences) about the service

Return in this exact format:
EYEBROW: <value>
HEADING: <value>
TEXT: <value>`);
    if (!text) return;
    const eyebrow = text.match(/EYEBROW:\s*(.+)/)?.[1]?.trim();
    const heading = text.match(/HEADING:\s*(.+)/)?.[1]?.trim();
    const textMatch = text.match(/TEXT:\s*(.+)/)?.[1]?.trim();
    if (eyebrow) setData(prev => ({ ...prev, introEyebrow: eyebrow }));
    if (heading) setData(prev => ({ ...prev, introHeading: heading }));
    if (textMatch) setData(prev => ({ ...prev, introText: textMatch }));
  }, [generate]);

  const handleAiProblem = useCallback(async () => {
    const text = await generate('problem', `Generate content for Problem/Solution cards of this locksmith page. Return 4 fields:

- Problem Heading: a short title (1-4 words)
- Problem Text: 2-3 sentences describing common customer pain points
- Solution Heading: a short title (1-4 words)
- Solution Text: 2-3 sentences describing how the service solves the problem

Return in this exact format:
PROBLEM_HEADING: <value>
PROBLEM_TEXT: <value>
SOLUTION_HEADING: <value>
SOLUTION_TEXT: <value>`);
    if (!text) return;
    const ph = text.match(/PROBLEM_HEADING:\s*(.+)/)?.[1]?.trim();
    const pt = text.match(/PROBLEM_TEXT:\s*(.+)/)?.[1]?.trim();
    const sh = text.match(/SOLUTION_HEADING:\s*(.+)/)?.[1]?.trim();
    const st = text.match(/SOLUTION_TEXT:\s*(.+)/)?.[1]?.trim();
    if (ph) setData(prev => ({ ...prev, problemHeading: ph }));
    if (pt) setData(prev => ({ ...prev, problemText: pt }));
    if (sh) setData(prev => ({ ...prev, solutionHeading: sh }));
    if (st) setData(prev => ({ ...prev, solutionText: st }));
  }, [generate]);

  const handleAiLocal = useCallback(async () => {
    const text = await generate('local', `Generate content for the Local Panel section of this locksmith page. Return 3 fields:
- Eyebrow: a short label (1-3 words)
- Heading: a compelling H2 (max 10 words)
- Text: 2-3 sentences about local expertise and coverage

Return in this exact format:
EYEBROW: <value>
HEADING: <value>
TEXT: <value>`);
    if (!text) return;
    const eyebrow = text.match(/EYEBROW:\s*(.+)/)?.[1]?.trim();
    const heading = text.match(/HEADING:\s*(.+)/)?.[1]?.trim();
    const textMatch = text.match(/TEXT:\s*(.+)/)?.[1]?.trim();
    if (eyebrow) setData(prev => ({ ...prev, localEyebrow: eyebrow }));
    if (heading) setData(prev => ({ ...prev, localHeading: heading }));
    if (textMatch) setData(prev => ({ ...prev, localText: textMatch }));
  }, [generate]);

  const handleAiDetail = useCallback(async () => {
    const text = await generate('detail', `Generate content for the Detail section of this locksmith page. Return:
- Eyebrow: short label (1-3 words)
- Heading: compelling H2 (max 10 words)
- Items: a list of 6 specific service detail items, one per line starting with "- "

Return in this exact format:
EYEBROW: <value>
HEADING: <value>
ITEMS:
- item 1
- item 2
- item 3
- item 4
- item 5
- item 6`);
    if (!text) return;
    const eyebrow = text.match(/EYEBROW:\s*(.+)/)?.[1]?.trim();
    const heading = text.match(/HEADING:\s*(.+)/)?.[1]?.trim();
    const itemsMatch = text.match(/ITEMS:\n([\s\S]+)/);
    if (eyebrow) setData(prev => ({ ...prev, detailEyebrow: eyebrow }));
    if (heading) setData(prev => ({ ...prev, detailHeading: heading }));
    if (itemsMatch) {
      const items = itemsMatch[1].split('\n').map(l => l.replace(/^-\s*/, '').trim()).filter(Boolean);
      if (items.length > 0) setData(prev => ({ ...prev, detailList: items }));
    }
  }, [generate]);

  const handleAiTrust = useCallback(async () => {
    const text = await generate('trust', `Generate content for the Trust Panel section of this locksmith page. Return:
- Eyebrow: short label (1-3 words)
- Heading: compelling H2 (max 10 words)
- Text: 1-2 sentences about why customers choose the service
- Badges: a list of 6 trust badge labels, one per line starting with "- "

Return in this exact format:
EYEBROW: <value>
HEADING: <value>
TEXT: <value>
BADGES:
- badge 1
- badge 2
- badge 3
- badge 4
- badge 5
- badge 6`);
    if (!text) return;
    const eyebrow = text.match(/EYEBROW:\s*(.+)/)?.[1]?.trim();
    const heading = text.match(/HEADING:\s*(.+)/)?.[1]?.trim();
    const textMatch = text.match(/TEXT:\s*(.+)/)?.[1]?.trim();
    const badgesMatch = text.match(/BADGES:\n([\s\S]+)/);
    if (eyebrow) setData(prev => ({ ...prev, trustEyebrow: eyebrow }));
    if (heading) setData(prev => ({ ...prev, trustHeading: heading }));
    if (textMatch) setData(prev => ({ ...prev, trustText: textMatch }));
    if (badgesMatch) {
      const badges = badgesMatch[1].split('\n').map(l => l.replace(/^-\s*/, '').trim()).filter(Boolean);
      if (badges.length > 0) setData(prev => ({ ...prev, trustBadges: badges }));
    }
  }, [generate]);

  const handleAiFaq = useCallback(async () => {
    const text = await generate('faq', `Generate FAQ content for this locksmith page. Return:
- Eyebrow: short label (1-3 words)
- Heading: "FAQ" or similar (1-4 words)
- Items: 4 question/answer pairs

Format each Q&A pair as:
Q1: <question>
A1: <answer>
Q2: <question>
A2: <answer>
Q3: <question>
A3: <answer>
Q4: <question>
A4: <answer>`);
    if (!text) return;
    const eyebrow = text.match(/EYEBROW:\s*(.+)/)?.[1]?.trim();
    const heading = text.match(/HEADING:\s*(.+)/)?.[1]?.trim();
    if (eyebrow) setData(prev => ({ ...prev, faqEyebrow: eyebrow }));
    if (heading) setData(prev => ({ ...prev, faqHeading: heading }));

    const items: PageFaqItem[] = [];
    for (let i = 1; i <= 6; i++) {
      const q = text.match(new RegExp(`Q${i}:\\s*(.+)`))?.[1]?.trim();
      const a = text.match(new RegExp(`A${i}:\\s*(.+)`))?.[1]?.trim();
      if (q && a) items.push({ question: q, answer: a });
    }
    if (items.length > 0) setData(prev => ({ ...prev, faqItems: items }));
  }, [generate]);

  const handleAiCta = useCallback(async () => {
    const text = await generate('cta', `Generate content for the CTA (Call to Action) section of this locksmith page. Return 3 fields:
- Eyebrow: short urgent label (1-3 words, e.g. "Emergency Ready")
- Heading: compelling H2 (max 8 words, e.g. "Ready for Locksmith Help?")
- Text: one sentence encouraging the call to action

Return in this exact format:
EYEBROW: <value>
HEADING: <value>
TEXT: <value>`);
    if (!text) return;
    const eyebrow = text.match(/EYEBROW:\s*(.+)/)?.[1]?.trim();
    const heading = text.match(/HEADING:\s*(.+)/)?.[1]?.trim();
    const textMatch = text.match(/TEXT:\s*(.+)/)?.[1]?.trim();
    if (eyebrow) setData(prev => ({ ...prev, ctaEyebrow: eyebrow }));
    if (heading) setData(prev => ({ ...prev, ctaHeading: heading }));
    if (textMatch) setData(prev => ({ ...prev, ctaText: textMatch }));
  }, [generate]);

  return (
    <>
      <input type="hidden" name="pageSections" value={JSON.stringify(data)} />

      {/* INTRO */}
      <div style={SECTION_STYLE}>
        <div style={HEADER_STYLE} onClick={() => toggle('intro')}>
          <span>Intro Section</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AiButton onClick={handleAiIntro} loading={loading.intro} />
            <span>{openSections.has('intro') ? '▾' : '▸'}</span>
          </span>
        </div>
        {openSections.has('intro') && (
          <div style={BODY_STYLE}>
            {renderField('Eyebrow', data.introEyebrow, v => setData(prev => ({ ...prev, introEyebrow: v })), { placeholder: 'Overview' })}
            {renderField('Heading', data.introHeading, v => setData(prev => ({ ...prev, introHeading: v })), { placeholder: 'Professional Locksmith Service in Orlando', rows: 2 })}
            {renderRichTextField('Text', data.introText, v => setData(prev => ({ ...prev, introText: v })), 'Trusted locksmith service for the Orlando area...')}
          </div>
        )}
      </div>

      {/* PROBLEM / SOLUTION */}
      <div style={SECTION_STYLE}>
        <div style={HEADER_STYLE} onClick={() => toggle('problem')}>
          <span>Problem / Solution Cards</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AiButton onClick={handleAiProblem} loading={loading.problem} />
            <span>{openSections.has('problem') ? '▾' : '▸'}</span>
          </span>
        </div>
        {openSections.has('problem') && (
          <div style={BODY_STYLE}>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: 12, marginBottom: 12, background: '#fafafa' }}>
              <strong style={{ fontSize: 13 }}>Problem Card</strong>
              {renderField('Heading', data.problemHeading, v => setData(prev => ({ ...prev, problemHeading: v })), { placeholder: 'Problem' })}
              {renderRichTextField('Text', data.problemText, v => setData(prev => ({ ...prev, problemText: v })), 'A lock issue usually arrives at the worst possible time...')}
            </div>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: 12, background: '#fafafa' }}>
              <strong style={{ fontSize: 13 }}>Solution Card</strong>
              {renderField('Heading', data.solutionHeading, v => setData(prev => ({ ...prev, solutionHeading: v })), { placeholder: 'Solution' })}
              {renderRichTextField('Text', data.solutionText, v => setData(prev => ({ ...prev, solutionText: v })), 'East Orlando Locksmith dispatches a trained technician...')}
            </div>
          </div>
        )}
      </div>

      {/* LOCAL PANEL */}
      <div style={SECTION_STYLE}>
        <div style={HEADER_STYLE} onClick={() => toggle('local')}>
          <span>Local Panel</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AiButton onClick={handleAiLocal} loading={loading.local} />
            <span>{openSections.has('local') ? '▾' : '▸'}</span>
          </span>
        </div>
        {openSections.has('local') && (
          <div style={BODY_STYLE}>
            {renderField('Eyebrow', data.localEyebrow, v => setData(prev => ({ ...prev, localEyebrow: v })), { placeholder: 'Local Coverage' })}
            {renderField('Heading', data.localHeading, v => setData(prev => ({ ...prev, localHeading: v })), { placeholder: 'Local Expertise Matters' })}
            {renderRichTextField('Text', data.localText, v => setData(prev => ({ ...prev, localText: v })), 'We regularly route technicians through Orlando...')}
          </div>
        )}
      </div>

      {/* DETAIL SECTION */}
      <div style={SECTION_STYLE}>
        <div style={HEADER_STYLE} onClick={() => toggle('detail')}>
          <span>Detail Section ({data.detailList?.length || 0})</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AiButton onClick={handleAiDetail} loading={loading.detail} />
            <span>{openSections.has('detail') ? '▾' : '▸'}</span>
          </span>
        </div>
        {openSections.has('detail') && (
          <div style={BODY_STYLE}>
            {renderField('Eyebrow', data.detailEyebrow, v => setData(prev => ({ ...prev, detailEyebrow: v })), { placeholder: 'Service Details' })}
            {renderField('Heading', data.detailHeading, v => setData(prev => ({ ...prev, detailHeading: v })), { placeholder: 'Locksmith Work We Handle' })}
            <div style={{ borderTop: '1px solid #e5e7eb', marginTop: 12, paddingTop: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Detail List Items</label>
              {(data.detailList || []).map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                  <input
                    type="text"
                    className="form-control"
                    value={item}
                    onChange={e => {
                      const items = [...(data.detailList || [])];
                      items[i] = e.target.value;
                      setData(prev => ({ ...prev, detailList: items }));
                    }}
                    placeholder="Detail item text"
                    style={{ fontSize: 13 }}
                  />
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => removeDetailItem(i)}>×</button>
                </div>
              ))}
              <button type="button" className="btn btn-sm btn-secondary" onClick={addDetailItem}>+ Add Detail Item</button>
            </div>
          </div>
        )}
      </div>

      {/* TRUST PANEL */}
      <div style={SECTION_STYLE}>
        <div style={HEADER_STYLE} onClick={() => toggle('trust')}>
          <span>Trust Panel ({data.trustBadges?.length || 0})</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AiButton onClick={handleAiTrust} loading={loading.trust} />
            <span>{openSections.has('trust') ? '▾' : '▸'}</span>
          </span>
        </div>
        {openSections.has('trust') && (
          <div style={BODY_STYLE}>
            {renderField('Eyebrow', data.trustEyebrow, v => setData(prev => ({ ...prev, trustEyebrow: v })), { placeholder: 'Trust Signals' })}
            {renderField('Heading', data.trustHeading, v => setData(prev => ({ ...prev, trustHeading: v })), { placeholder: 'Why People Choose East Orlando Locksmith' })}
            {renderRichTextField('Text', data.trustText, v => setData(prev => ({ ...prev, trustText: v })), 'Licensed and insured service, upfront pricing...')}
            <div style={{ borderTop: '1px solid #e5e7eb', marginTop: 12, paddingTop: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Trust Badges</label>
              {(data.trustBadges || []).map((badge, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                  <input
                    type="text"
                    className="form-control"
                    value={badge}
                    onChange={e => {
                      const items = [...(data.trustBadges || [])];
                      items[i] = e.target.value;
                      setData(prev => ({ ...prev, trustBadges: items }));
                    }}
                    placeholder="Badge text"
                    style={{ fontSize: 13 }}
                  />
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => removeBadge(i)}>×</button>
                </div>
              ))}
              <button type="button" className="btn btn-sm btn-secondary" onClick={addBadge}>+ Add Trust Badge</button>
            </div>
          </div>
        )}
      </div>

      {/* FAQ */}
      <div style={SECTION_STYLE}>
        <div style={HEADER_STYLE} onClick={() => toggle('faq')}>
          <span>FAQ ({data.faqItems?.length || 0})</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AiButton onClick={handleAiFaq} loading={loading.faq} />
            <span>{openSections.has('faq') ? '▾' : '▸'}</span>
          </span>
        </div>
        {openSections.has('faq') && (
          <div style={BODY_STYLE}>
            {renderField('Eyebrow', data.faqEyebrow, v => setData(prev => ({ ...prev, faqEyebrow: v })), { placeholder: 'Questions People Search Before Calling' })}
            {renderField('Heading', data.faqHeading, v => setData(prev => ({ ...prev, faqHeading: v })), { placeholder: 'FAQ' })}
            <div style={{ borderTop: '1px solid #e5e7eb', marginTop: 12, paddingTop: 12 }}>
              {(data.faqItems || []).map((item, i) => (
                <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: 12, marginBottom: 12, background: '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <strong style={{ fontSize: 13 }}>Q{i + 1}</strong>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => removeFaqItem(i)}>Remove</button>
                  </div>
                  {renderField('Question', item.question, v => updateFaqItem(i, 'question', v))}
                  {renderRichTextField('Answer', item.answer, v => updateFaqItem(i, 'answer', v), 'Answer for this FAQ question')}
                </div>
              ))}
              <button type="button" className="btn btn-sm btn-secondary" onClick={addFaqItem}>+ Add FAQ Item</button>
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={SECTION_STYLE}>
        <div style={HEADER_STYLE} onClick={() => toggle('cta')}>
          <span>CTA Section</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AiButton onClick={handleAiCta} loading={loading.cta} />
            <span>{openSections.has('cta') ? '▾' : '▸'}</span>
          </span>
        </div>
        {openSections.has('cta') && (
          <div style={BODY_STYLE}>
            {renderField('Eyebrow', data.ctaEyebrow, v => setData(prev => ({ ...prev, ctaEyebrow: v })), { placeholder: 'Emergency Ready' })}
            {renderField('Heading', data.ctaHeading, v => setData(prev => ({ ...prev, ctaHeading: v })), { placeholder: 'Ready for Locksmith Help?' })}
            {renderRichTextField('Text', data.ctaText, v => setData(prev => ({ ...prev, ctaText: v })), 'Call now for professional locksmith service in Orlando.')}
          </div>
        )}
      </div>
    </>
  );
}
