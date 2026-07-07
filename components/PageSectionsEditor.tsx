'use client';

import { useState, useCallback } from 'react';
import type { PageSections, PageFaqItem } from '@/lib/data';

interface Props {
  initialSections?: PageSections;
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

export default function PageSectionsEditor({ initialSections }: Props) {
  const [data, setData] = useState<PageSections>(initialSections ?? {});
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['intro']));

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

  return (
    <>
      <input type="hidden" name="pageSections" value={JSON.stringify(data)} />

      {/* INTRO */}
      <div style={SECTION_STYLE}>
        <div style={HEADER_STYLE} onClick={() => toggle('intro')}>
          <span>Intro Section</span>
          <span>{openSections.has('intro') ? '▾' : '▸'}</span>
        </div>
        {openSections.has('intro') && (
          <div style={BODY_STYLE}>
            {renderField('Eyebrow', data.introEyebrow, v => setData(prev => ({ ...prev, introEyebrow: v })), { placeholder: 'Overview' })}
            {renderField('Heading', data.introHeading, v => setData(prev => ({ ...prev, introHeading: v })), { placeholder: 'Professional Locksmith Service in Orlando', rows: 2 })}
            {renderField('Text', data.introText, v => setData(prev => ({ ...prev, introText: v })), { placeholder: 'Trusted locksmith service for the Orlando area...', rows: 3 })}
          </div>
        )}
      </div>

      {/* PROBLEM / SOLUTION */}
      <div style={SECTION_STYLE}>
        <div style={HEADER_STYLE} onClick={() => toggle('problem')}>
          <span>Problem / Solution Cards</span>
          <span>{openSections.has('problem') ? '▾' : '▸'}</span>
        </div>
        {openSections.has('problem') && (
          <div style={BODY_STYLE}>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: 12, marginBottom: 12, background: '#fafafa' }}>
              <strong style={{ fontSize: 13 }}>Problem Card</strong>
              {renderField('Heading', data.problemHeading, v => setData(prev => ({ ...prev, problemHeading: v })), { placeholder: 'Problem' })}
              {renderField('Text', data.problemText, v => setData(prev => ({ ...prev, problemText: v })), { placeholder: 'A lock issue usually arrives at the worst possible time...', rows: 4 })}
            </div>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: 12, background: '#fafafa' }}>
              <strong style={{ fontSize: 13 }}>Solution Card</strong>
              {renderField('Heading', data.solutionHeading, v => setData(prev => ({ ...prev, solutionHeading: v })), { placeholder: 'Solution' })}
              {renderField('Text', data.solutionText, v => setData(prev => ({ ...prev, solutionText: v })), { placeholder: 'East Orlando Locksmith dispatches a trained technician...', rows: 4 })}
            </div>
          </div>
        )}
      </div>

      {/* LOCAL PANEL */}
      <div style={SECTION_STYLE}>
        <div style={HEADER_STYLE} onClick={() => toggle('local')}>
          <span>Local Panel</span>
          <span>{openSections.has('local') ? '▾' : '▸'}</span>
        </div>
        {openSections.has('local') && (
          <div style={BODY_STYLE}>
            {renderField('Eyebrow', data.localEyebrow, v => setData(prev => ({ ...prev, localEyebrow: v })), { placeholder: 'Local Coverage' })}
            {renderField('Heading', data.localHeading, v => setData(prev => ({ ...prev, localHeading: v })), { placeholder: 'Local Expertise Matters' })}
            {renderField('Text', data.localText, v => setData(prev => ({ ...prev, localText: v })), { placeholder: 'We regularly route technicians through Orlando...', rows: 3 })}
          </div>
        )}
      </div>

      {/* DETAIL SECTION */}
      <div style={SECTION_STYLE}>
        <div style={HEADER_STYLE} onClick={() => toggle('detail')}>
          <span>Detail Section ({data.detailList?.length || 0})</span>
          <span>{openSections.has('detail') ? '▾' : '▸'}</span>
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
          <span>{openSections.has('trust') ? '▾' : '▸'}</span>
        </div>
        {openSections.has('trust') && (
          <div style={BODY_STYLE}>
            {renderField('Eyebrow', data.trustEyebrow, v => setData(prev => ({ ...prev, trustEyebrow: v })), { placeholder: 'Trust Signals' })}
            {renderField('Heading', data.trustHeading, v => setData(prev => ({ ...prev, trustHeading: v })), { placeholder: 'Why People Choose East Orlando Locksmith' })}
            {renderField('Text', data.trustText, v => setData(prev => ({ ...prev, trustText: v })), { placeholder: 'Licensed and insured service, upfront pricing...', rows: 3 })}
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
          <span>{openSections.has('faq') ? '▾' : '▸'}</span>
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
                  {renderField('Answer', item.answer, v => updateFaqItem(i, 'answer', v), { rows: 3 })}
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
          <span>{openSections.has('cta') ? '▾' : '▸'}</span>
        </div>
        {openSections.has('cta') && (
          <div style={BODY_STYLE}>
            {renderField('Eyebrow', data.ctaEyebrow, v => setData(prev => ({ ...prev, ctaEyebrow: v })), { placeholder: 'Emergency Ready' })}
            {renderField('Heading', data.ctaHeading, v => setData(prev => ({ ...prev, ctaHeading: v })), { placeholder: 'Ready for Locksmith Help?' })}
            {renderField('Text', data.ctaText, v => setData(prev => ({ ...prev, ctaText: v })), { placeholder: 'Call now for professional locksmith service in Orlando.', rows: 3 })}
          </div>
        )}
      </div>
    </>
  );
}
