'use client';

import { useState, FormEvent } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send');
      }

      setStatus('success');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-section">
        <div className="contact-content">
          <p className="eyebrow">Get In Touch</p>
          <h1>Contact Us</h1>
          <p className="contact-desc">
            Have a question or need a quote? Send us a message and we will get back to you as soon as possible.
          </p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(407) 555-1234" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea id="message" rows={5} value={message} onChange={e => setMessage(e.target.value)} required placeholder="How can we help you?"></textarea>
            </div>
            <button className="btn btn-gold btn-large" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>

            {status === 'success' && (
              <div className="form-success">Thanks! Your message has been sent. We will get back to you shortly.</div>
            )}
            {status === 'error' && (
              <div className="form-error">Something went wrong. Please try again or call us directly.</div>
            )}
          </form>
        </div>

        <div className="contact-info">
          <div className="contact-card">
            <h3>Call Us</h3>
            <a className="contact-phone" href={`tel:${process.env.NEXT_PUBLIC_PHONE_RAW || '+14075555625'}`}>{process.env.NEXT_PUBLIC_PHONE || '(407) 555-5625'}</a>
          </div>
          <div className="contact-card">
            <h3>Service Area</h3>
            <p>East Orlando & Surrounding Areas</p>
          </div>
          <div className="contact-card">
            <h3>Hours</h3>
            <p>24/7 Emergency Service</p>
          </div>
        </div>
      </section>
    </div>
  );
}
