'use client';

import { useState, useCallback } from 'react';

type HeroImage = { src: string; alt: string };
type TrustItem = { text: string };
type ServicePoint = { icon: string; title: string; subtitle: string; link: string };
type ServiceCard = { icon: string; title: string; description: string; features: string[]; link: string };
type TrustCard = { icon: string; title: string; description: string };
type TimelineItem = { title: string; description: string };
type Review = { name: string; text: string; source: string; location: string };
type Brand = { name: string };
type Faq = { question: string; answer: string };

interface HomepageData {
  pill: string;
  heading: string;
  heroImage: HeroImage;
  trustItems: TrustItem[];
  priorityEyebrow: string;
  priorityHeading: string;
  priorityText: string;
  servicePoints: ServicePoint[];
  servicesEyebrow: string;
  servicesHeading: string;
  servicesText: string;
  serviceCards: ServiceCard[];
  trustEyebrow: string;
  trustHeading: string;
  trustText: string;
  trustCards: TrustCard[];
  areasEyebrow: string;
  areasHeading: string;
  areasText: string;
  extraAreas: string[];
  responseEyebrow: string;
  responseHeading: string;
  timeline: TimelineItem[];
  reviewsEyebrow: string;
  reviewsHeading: string;
  reviews: Review[];
  brandsEyebrow: string;
  brandsHeading: string;
  brandsText: string;
  brands: Brand[];
  faqEyebrow: string;
  faqHeading: string;
  faq: Faq[];
  ctaEyebrow: string;
  ctaHeading: string;
  ctaText: string;
}

interface Props {
  initialData: HomepageData;
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

export default function SectionsEditorClient({ initialData }: Props) {
  const [data, setData] = useState<HomepageData>(structuredClone(initialData));
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['hero']));
  const [saving, setSaving] = useState(false);

  const toggle = useCallback((key: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const updateSimple = useCallback((section: string, field: string, value: string) => {
    setData(prev => {
      const next = structuredClone(prev);
      (next as any)[field] = value;
      return next;
    });
  }, []);

  const updateNestedText = useCallback((section: string, field: string, sub: string, value: string) => {
    setData(prev => {
      const next = structuredClone(prev);
      (next as any)[field] = value;
      return next;
    });
  }, []);

  const updateObject = useCallback((objPath: string, field: string, value: string) => {
    setData(prev => {
      const next = structuredClone(prev);
      if (objPath === 'heroImage') {
        (next.heroImage as any)[field] = value;
      }
      return next;
    });
  }, []);

  const updateArrayItem = useCallback((arr: keyof HomepageData, index: number, field: string, value: string) => {
    setData(prev => {
      const next = structuredClone(prev);
      const items = next[arr] as any[];
      if (items[index]) {
        items[index][field] = value;
      }
      return next;
    });
  }, []);

  const updateNestedArrayItem = useCallback((arr: 'serviceCards' | 'timeline' | 'reviews' | 'faq', index: number, field: string, value: string) => {
    setData(prev => {
      const next = structuredClone(prev);
      const items = next[arr] as any[];
      if (items[index]) {
        items[index][field] = value;
      }
      return next;
    });
  }, []);

  const updateFeatures = useCallback((cardIndex: number, featureIndex: number, value: string) => {
    setData(prev => {
      const next = structuredClone(prev);
      if (next.serviceCards[cardIndex]?.features[featureIndex] !== undefined) {
        next.serviceCards[cardIndex].features[featureIndex] = value;
      }
      return next;
    });
  }, []);

  const addFeature = useCallback((cardIndex: number) => {
    setData(prev => {
      const next = structuredClone(prev);
      next.serviceCards[cardIndex].features.push('');
      return next;
    });
  }, []);

  const removeFeature = useCallback((cardIndex: number, featureIndex: number) => {
    setData(prev => {
      const next = structuredClone(prev);
      next.serviceCards[cardIndex].features.splice(featureIndex, 1);
      return next;
    });
  }, []);

  const addArrayItem = useCallback((arr: keyof HomepageData, template: any) => {
    setData(prev => {
      const next = structuredClone(prev);
      (next[arr] as any[]).push(template);
      return next;
    });
  }, []);

  const addServicePoint = useCallback(() => {
    setData(prev => {
      const next = structuredClone(prev);
      next.servicePoints.push({ icon: 'circle-icon clock', title: '', subtitle: '', link: '' });
      return next;
    });
  }, []);

  const addServiceCard = useCallback(() => {
    setData(prev => {
      const next = structuredClone(prev);
      next.serviceCards.push({ icon: 'car', title: '', description: '', features: [''], link: '' });
      return next;
    });
  }, []);

  const addTrustCard = useCallback(() => {
    setData(prev => {
      const next = structuredClone(prev);
      next.trustCards.push({ icon: 'clock', title: '', description: '' });
      return next;
    });
  }, []);

  const addTimeline = useCallback(() => {
    setData(prev => {
      const next = structuredClone(prev);
      next.timeline.push({ title: '', description: '' });
      return next;
    });
  }, []);

  const addReview = useCallback(() => {
    setData(prev => {
      const next = structuredClone(prev);
      next.reviews.push({ name: '', text: '', source: '', location: '' });
      return next;
    });
  }, []);

  const addBrand = useCallback(() => {
    setData(prev => {
      const next = structuredClone(prev);
      next.brands.push({ name: '' });
      return next;
    });
  }, []);

  const addFaq = useCallback(() => {
    setData(prev => {
      const next = structuredClone(prev);
      next.faq.push({ question: '', answer: '' });
      return next;
    });
  }, []);

  const addExtraArea = useCallback(() => {
    setData(prev => {
      const next = structuredClone(prev);
      next.extraAreas.push('');
      return next;
    });
  }, []);

  const removeArrayItem = useCallback((arr: keyof HomepageData, index: number) => {
    setData(prev => {
      const next = structuredClone(prev);
      (next[arr] as any[]).splice(index, 1);
      return next;
    });
  }, []);

  const removeServicePoint = useCallback((index: number) => {
    setData(prev => {
      const next = structuredClone(prev);
      next.servicePoints.splice(index, 1);
      return next;
    });
  }, []);

  const removeServiceCard = useCallback((index: number) => {
    setData(prev => {
      const next = structuredClone(prev);
      next.serviceCards.splice(index, 1);
      return next;
    });
  }, []);

  const removeTrustCard = useCallback((index: number) => {
    setData(prev => {
      const next = structuredClone(prev);
      next.trustCards.splice(index, 1);
      return next;
    });
  }, []);

  const removeTimeline = useCallback((index: number) => {
    setData(prev => {
      const next = structuredClone(prev);
      next.timeline.splice(index, 1);
      return next;
    });
  }, []);

  const removeReview = useCallback((index: number) => {
    setData(prev => {
      const next = structuredClone(prev);
      next.reviews.splice(index, 1);
      return next;
    });
  }, []);

  const removeBrand = useCallback((index: number) => {
    setData(prev => {
      const next = structuredClone(prev);
      next.brands.splice(index, 1);
      return next;
    });
  }, []);

  const removeFaq = useCallback((index: number) => {
    setData(prev => {
      const next = structuredClone(prev);
      next.faq.splice(index, 1);
      return next;
    });
  }, []);

  const removeExtraArea = useCallback((index: number) => {
    setData(prev => {
      const next = structuredClone(prev);
      next.extraAreas.splice(index, 1);
      return next;
    });
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    setSaving(true);
    // Data is already in state, will be serialized by the hidden input
  }, []);

  const renderField = (label: string, value: string, onChange: (v: string) => void, opts?: { placeholder?: string; rows?: number; mono?: boolean }) => (
    <div style={ROW_STYLE}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 3 }}>{label}</label>
      {opts?.rows ? (
        <textarea
          className="form-control"
          rows={opts.rows}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={opts?.placeholder || ''}
          style={{ fontSize: 13, fontFamily: opts?.mono ? 'monospace' : 'inherit' }}
        />
      ) : (
        <input
          type="text"
          className="form-control"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={opts?.placeholder || ''}
          style={{ fontSize: 13, fontFamily: opts?.mono ? 'monospace' : 'inherit' }}
        />
      )}
    </div>
  );

  return (
    <>
      <input type="hidden" name="homepageData" value={JSON.stringify(data)} />

      {/* HERO */}
      <div style={SECTION_STYLE}>
        <div style={HEADER_STYLE} onClick={() => toggle('hero')}>
          <span>Hero Section</span>
          <span>{openSections.has('hero') ? '▾' : '▸'}</span>
        </div>
        {openSections.has('hero') && (
          <div style={BODY_STYLE}>
            {renderField('Pill Text (first character = icon/emoji)', data.pill, v => { setData(prev => ({ ...prev, pill: v })) }, { placeholder: '⚡ 24/7 Emergency Locksmith' })}
            {renderField('Heading (use <span> for gold text)', data.heading, v => { setData(prev => ({ ...prev, heading: v })) }, { placeholder: "Orlando's Most <span>Trusted</span> Locksmith", rows: 2 })}
            {renderField('Hero Image Src', data.heroImage.src, v => { setData(prev => ({ ...prev, heroImage: { ...prev.heroImage, src: v } })) }, { placeholder: '/assets/hero-locksmith.png', mono: true })}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 3 }}>Upload Hero Image</label>
              <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const fd = new FormData();
                fd.append('file', file);
                const res = await fetch('/api/assets', { method: 'POST', body: fd });
                const data = await res.json();
                if (data.success) setData(prev => ({ ...prev, heroImage: { ...prev.heroImage, src: data.url } }));
              }} style={{ fontSize: 13 }} />
            </div>
            {renderField('Hero Image Alt', data.heroImage.alt, v => { setData(prev => ({ ...prev, heroImage: { ...prev.heroImage, alt: v } })) }, { placeholder: 'Locksmith repairing a door lock at night' })}
          </div>
        )}
      </div>

      {/* TRUST ITEMS */}
      <div style={SECTION_STYLE}>
        <div style={HEADER_STYLE} onClick={() => toggle('trustItems')}>
          <span>Trust Items ({data.trustItems.length})</span>
          <span>{openSections.has('trustItems') ? '▾' : '▸'}</span>
        </div>
        {openSections.has('trustItems') && (
          <div style={BODY_STYLE}>
            {data.trustItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <input
                  type="text"
                  className="form-control"
                  value={item.text}
                  onChange={e => updateArrayItem('trustItems', i, 'text', e.target.value)}
                  placeholder="Trust item text"
                  style={{ fontSize: 13 }}
                />
                <button type="button" className="btn btn-sm btn-danger" onClick={() => removeArrayItem('trustItems', i)}>×</button>
              </div>
            ))}
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => addArrayItem('trustItems', { text: '' })}>+ Add Trust Item</button>
          </div>
        )}
      </div>

      {/* PRIORITY SECTION */}
      <div style={SECTION_STYLE}>
        <div style={HEADER_STYLE} onClick={() => toggle('priority')}>
          <span>Priority Section</span>
          <span>{openSections.has('priority') ? '▾' : '▸'}</span>
        </div>
        {openSections.has('priority') && (
          <div style={BODY_STYLE}>
            {renderField('Eyebrow', data.priorityEyebrow, v => { setData(prev => ({ ...prev, priorityEyebrow: v })) }, { placeholder: 'Trusted By Thousands' })}
            {renderField('Heading', data.priorityHeading, v => { setData(prev => ({ ...prev, priorityHeading: v })) }, { placeholder: 'Your Security is Our Priority' })}
            {renderField('Text', data.priorityText, v => { setData(prev => ({ ...prev, priorityText: v })) }, { placeholder: 'We understand that security...', rows: 3 })}
          </div>
        )}
      </div>

      {/* SERVICE POINTS */}
      <div style={SECTION_STYLE}>
        <div style={HEADER_STYLE} onClick={() => toggle('servicePoints')}>
          <span>Service Points ({data.servicePoints.length})</span>
          <span>{openSections.has('servicePoints') ? '▾' : '▸'}</span>
        </div>
        {openSections.has('servicePoints') && (
          <div style={BODY_STYLE}>
            {data.servicePoints.map((sp, i) => (
              <div key={i} style={{ border: '1px solid #f3f4f6', borderRadius: 6, padding: 12, marginBottom: 12, background: '#fafafa' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <strong style={{ fontSize: 13 }}>Point #{i + 1}</strong>
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => removeServicePoint(i)}>Remove</button>
                </div>
                <div className="form-row">
                  {renderField('Icon', sp.icon, v => updateArrayItem('servicePoints', i, 'icon', v), { placeholder: 'circle-icon clock' })}
                  {renderField('Title', sp.title, v => updateArrayItem('servicePoints', i, 'title', v))}
                </div>
                <div className="form-row">
                  {renderField('Subtitle', sp.subtitle, v => updateArrayItem('servicePoints', i, 'subtitle', v))}
                  {renderField('Link', sp.link, v => updateArrayItem('servicePoints', i, 'link', v))}
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-sm btn-secondary" onClick={addServicePoint}>+ Add Service Point</button>
          </div>
        )}
      </div>

      {/* SERVICES SECTION */}
      <div style={SECTION_STYLE}>
        <div style={HEADER_STYLE} onClick={() => toggle('services')}>
          <span>Services Section</span>
          <span>{openSections.has('services') ? '▾' : '▸'}</span>
        </div>
        {openSections.has('services') && (
          <div style={BODY_STYLE}>
            {renderField('Eyebrow', data.servicesEyebrow, v => { setData(prev => ({ ...prev, servicesEyebrow: v })) }, { placeholder: 'Locksmith Services' })}
            {renderField('Heading', data.servicesHeading, v => { setData(prev => ({ ...prev, servicesHeading: v })) }, { placeholder: 'Complete locksmith support...' })}
            {renderField('Text', data.servicesText, v => { setData(prev => ({ ...prev, servicesText: v })) }, { placeholder: 'From car key issues...', rows: 3 })}

            <div style={{ borderTop: '1px solid #e5e7eb', marginTop: 16, paddingTop: 12 }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Service Cards ({data.serviceCards.length})</h4>
              {data.serviceCards.map((card, i) => (
                <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: 12, marginBottom: 12, background: '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <strong style={{ fontSize: 13 }}>Card #{i + 1}</strong>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => removeServiceCard(i)}>Remove</button>
                  </div>
                  {renderField('Icon', card.icon, v => updateNestedArrayItem('serviceCards', i, 'icon', v), { placeholder: 'car / home / building' })}
                  {renderField('Title', card.title, v => updateNestedArrayItem('serviceCards', i, 'title', v))}
                  {renderField('Description', card.description, v => updateNestedArrayItem('serviceCards', i, 'description', v), { rows: 2 })}
                  {renderField('Link', card.link, v => updateNestedArrayItem('serviceCards', i, 'link', v))}
                  <div style={{ marginTop: 8 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Features</label>
                    {card.features.map((f, fi) => (
                      <div key={fi} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                        <input type="text" className="form-control" value={f} onChange={e => updateFeatures(i, fi, e.target.value)} placeholder="Feature" style={{ fontSize: 13 }} />
                        <button type="button" className="btn btn-sm btn-danger" onClick={() => removeFeature(i, fi)}>×</button>
                      </div>
                    ))}
                    <button type="button" className="btn btn-sm btn-secondary" onClick={() => addFeature(i)}>+ Feature</button>
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-sm btn-secondary" onClick={addServiceCard}>+ Add Service Card</button>
            </div>
          </div>
        )}
      </div>

      {/* TRUST CARDS */}
      <div style={SECTION_STYLE}>
        <div style={HEADER_STYLE} onClick={() => toggle('trustCards')}>
          <span>Trust / Why Choose Us ({data.trustCards.length})</span>
          <span>{openSections.has('trustCards') ? '▾' : '▸'}</span>
        </div>
        {openSections.has('trustCards') && (
          <div style={BODY_STYLE}>
            {renderField('Eyebrow', data.trustEyebrow, v => { setData(prev => ({ ...prev, trustEyebrow: v })) }, { placeholder: 'Why Choose Us' })}
            {renderField('Heading', data.trustHeading, v => { setData(prev => ({ ...prev, trustHeading: v })) }, { placeholder: 'Built for urgent calls...' })}
            {renderField('Text', data.trustText, v => { setData(prev => ({ ...prev, trustText: v })) }, { placeholder: 'Every visit is designed...', rows: 3 })}
            <div style={{ borderTop: '1px solid #e5e7eb', marginTop: 16, paddingTop: 12 }}>
              {data.trustCards.map((card, i) => (
                <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: 12, marginBottom: 12, background: '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <strong style={{ fontSize: 13 }}>Card #{i + 1}</strong>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => removeTrustCard(i)}>Remove</button>
                  </div>
                  {renderField('Icon', card.icon, v => updateNestedArrayItem('trustCards', i, 'icon', v), { placeholder: 'clock / user-check / zap / dollar-sign / shield / thumbs-up' })}
                  {renderField('Title', card.title, v => updateNestedArrayItem('trustCards', i, 'title', v))}
                  {renderField('Description', card.description, v => updateNestedArrayItem('trustCards', i, 'description', v), { rows: 2 })}
                </div>
              ))}
              <button type="button" className="btn btn-sm btn-secondary" onClick={addTrustCard}>+ Add Trust Card</button>
            </div>
          </div>
        )}
      </div>

      {/* SERVICE AREAS */}
      <div style={SECTION_STYLE}>
        <div style={HEADER_STYLE} onClick={() => toggle('areas')}>
          <span>Service Areas</span>
          <span>{openSections.has('areas') ? '▾' : '▸'}</span>
        </div>
        {openSections.has('areas') && (
          <div style={BODY_STYLE}>
            {renderField('Eyebrow', data.areasEyebrow, v => { setData(prev => ({ ...prev, areasEyebrow: v })) }, { placeholder: 'Service Areas' })}
            {renderField('Heading', data.areasHeading, v => { setData(prev => ({ ...prev, areasHeading: v })) }, { placeholder: 'Local locksmith coverage...' })}
            {renderField('Text', data.areasText, v => { setData(prev => ({ ...prev, areasText: v })) }, { placeholder: 'Our dispatch pattern...', rows: 2 })}
            <div style={{ borderTop: '1px solid #e5e7eb', marginTop: 12, paddingTop: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Extra Areas</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {data.extraAreas.map((area, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#f3f4f6', borderRadius: 4, padding: '2px 8px', fontSize: 13 }}>
                    {area}
                    <button type="button" onClick={() => removeExtraArea(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 14, padding: 0, lineHeight: 1 }}>×</button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Area name"
                  id="new-area-input"
                  style={{ fontSize: 13, width: 200 }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      if (input.value.trim()) {
                        setData(prev => ({ ...prev, extraAreas: [...prev.extraAreas, input.value.trim()] }));
                        input.value = '';
                      }
                    }
                  }}
                />
                <button type="button" className="btn btn-sm btn-secondary" onClick={addExtraArea}>+</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RESPONSE TIMELINE */}
      <div style={SECTION_STYLE}>
        <div style={HEADER_STYLE} onClick={() => toggle('timeline')}>
          <span>Response Timeline ({data.timeline.length})</span>
          <span>{openSections.has('timeline') ? '▾' : '▸'}</span>
        </div>
        {openSections.has('timeline') && (
          <div style={BODY_STYLE}>
            {renderField('Eyebrow', data.responseEyebrow, v => { setData(prev => ({ ...prev, responseEyebrow: v })) }, { placeholder: 'Response Timeline' })}
            {renderField('Heading', data.responseHeading, v => { setData(prev => ({ ...prev, responseHeading: v })) }, { placeholder: 'A simple process...' })}
            <div style={{ borderTop: '1px solid #e5e7eb', marginTop: 12, paddingTop: 12 }}>
              {data.timeline.map((item, i) => (
                <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: 12, marginBottom: 12, background: '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <strong style={{ fontSize: 13 }}>Step {i + 1}</strong>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => removeTimeline(i)}>Remove</button>
                  </div>
                  {renderField('Title', item.title, v => updateNestedArrayItem('timeline', i, 'title', v))}
                  {renderField('Description', item.description, v => updateNestedArrayItem('timeline', i, 'description', v), { rows: 2 })}
                </div>
              ))}
              <button type="button" className="btn btn-sm btn-secondary" onClick={addTimeline}>+ Add Step</button>
            </div>
          </div>
        )}
      </div>

      {/* REVIEWS */}
      <div style={SECTION_STYLE}>
        <div style={HEADER_STYLE} onClick={() => toggle('reviews')}>
          <span>Reviews ({data.reviews.length})</span>
          <span>{openSections.has('reviews') ? '▾' : '▸'}</span>
        </div>
        {openSections.has('reviews') && (
          <div style={BODY_STYLE}>
            {renderField('Eyebrow', data.reviewsEyebrow, v => { setData(prev => ({ ...prev, reviewsEyebrow: v })) }, { placeholder: 'Customer Reviews' })}
            {renderField('Heading', data.reviewsHeading, v => { setData(prev => ({ ...prev, reviewsHeading: v })) }, { placeholder: 'Trusted by Orlando...' })}
            <div style={{ borderTop: '1px solid #e5e7eb', marginTop: 12, paddingTop: 12 }}>
              {data.reviews.map((review, i) => (
                <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: 12, marginBottom: 12, background: '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <strong style={{ fontSize: 13 }}>Review #{i + 1}</strong>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => removeReview(i)}>Remove</button>
                  </div>
                  <div className="form-row">
                    {renderField('Name', review.name, v => updateNestedArrayItem('reviews', i, 'name', v))}
                    {renderField('Source', review.source, v => updateNestedArrayItem('reviews', i, 'source', v), { placeholder: 'Google / Yelp' })}
                  </div>
                  {renderField('Review Text', review.text, v => updateNestedArrayItem('reviews', i, 'text', v), { rows: 3 })}
                  {renderField('Location / Context', review.location, v => updateNestedArrayItem('reviews', i, 'location', v), { placeholder: 'Downtown Orlando · Home Lockout' })}
                </div>
              ))}
              <button type="button" className="btn btn-sm btn-secondary" onClick={addReview}>+ Add Review</button>
            </div>
          </div>
        )}
      </div>

      {/* BRANDS */}
      <div style={SECTION_STYLE}>
        <div style={HEADER_STYLE} onClick={() => toggle('brands')}>
          <span>Vehicle Brands ({data.brands.length})</span>
          <span>{openSections.has('brands') ? '▾' : '▸'}</span>
        </div>
        {openSections.has('brands') && (
          <div style={BODY_STYLE}>
            {renderField('Eyebrow', data.brandsEyebrow, v => { setData(prev => ({ ...prev, brandsEyebrow: v })) }, { placeholder: 'Vehicle Brands' })}
            {renderField('Heading', data.brandsHeading, v => { setData(prev => ({ ...prev, brandsHeading: v })) }, { placeholder: 'Automotive locksmith support...' })}
            {renderField('Text', data.brandsText, v => { setData(prev => ({ ...prev, brandsText: v })) }, { placeholder: 'Key replacement and programming...', rows: 2 })}
            <div style={{ borderTop: '1px solid #e5e7eb', marginTop: 12, paddingTop: 12 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {data.brands.map((brand, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#f3f4f6', borderRadius: 4, padding: '4px 10px', fontSize: 13 }}>
                    {brand.name}
                    <button type="button" onClick={() => removeBrand(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 14, padding: 0, lineHeight: 1 }}>×</button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Brand name"
                  id="new-brand-input"
                  style={{ fontSize: 13, width: 200 }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      if (input.value.trim()) {
                        setData(prev => ({ ...prev, brands: [...prev.brands, { name: input.value.trim() }] }));
                        input.value = '';
                      }
                    }
                  }}
                />
                <button type="button" className="btn btn-sm btn-secondary" onClick={addBrand}>+</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FAQ */}
      <div style={SECTION_STYLE}>
        <div style={HEADER_STYLE} onClick={() => toggle('faq')}>
          <span>FAQ ({data.faq.length})</span>
          <span>{openSections.has('faq') ? '▾' : '▸'}</span>
        </div>
        {openSections.has('faq') && (
          <div style={BODY_STYLE}>
            {renderField('Eyebrow', data.faqEyebrow, v => { setData(prev => ({ ...prev, faqEyebrow: v })) }, { placeholder: 'FAQ' })}
            {renderField('Heading', data.faqHeading, v => { setData(prev => ({ ...prev, faqHeading: v })) }, { placeholder: 'Orlando locksmith questions...' })}
            <div style={{ borderTop: '1px solid #e5e7eb', marginTop: 12, paddingTop: 12 }}>
              {data.faq.map((item, i) => (
                <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: 12, marginBottom: 12, background: '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <strong style={{ fontSize: 13 }}>Q{i + 1}</strong>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => removeFaq(i)}>Remove</button>
                  </div>
                  {renderField('Question', item.question, v => updateNestedArrayItem('faq', i, 'question', v))}
                  {renderField('Answer', item.answer, v => updateNestedArrayItem('faq', i, 'answer', v), { rows: 3 })}
                </div>
              ))}
              <button type="button" className="btn btn-sm btn-secondary" onClick={addFaq}>+ Add FAQ</button>
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
            {renderField('Eyebrow', data.ctaEyebrow, v => { setData(prev => ({ ...prev, ctaEyebrow: v })) }, { placeholder: 'Emergency Ready' })}
            {renderField('Heading', data.ctaHeading, v => { setData(prev => ({ ...prev, ctaHeading: v })) }, { placeholder: 'Need a locksmith right now?' })}
            {renderField('Text', data.ctaText, v => { setData(prev => ({ ...prev, ctaText: v })) }, { placeholder: 'A real technician is ready to help...', rows: 3 })}
          </div>
        )}
      </div>
    </>
  );
}
