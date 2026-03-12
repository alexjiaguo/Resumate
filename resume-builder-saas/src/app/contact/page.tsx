'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'general', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would submit to an API endpoint
    setSubmitted(true);
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <Link href="/" className="navbar-brand">
            <img src="/logo.png" alt="ResuMate" className="navbar-brand-icon" />
            <span>resumate</span>
          </Link>
          <div className="navbar-actions">
            <Link href="/editor" className="btn btn-sm btn-primary">Start Building</Link>
          </div>
        </div>
      </nav>

      <section style={{ padding: '140px 0 80px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ marginBottom: '48px' }}>
            <span className="badge">Get in Touch</span>
            <h1 style={{ fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 700, marginTop: '16px', marginBottom: '16px', letterSpacing: '-0.02em' }}>
              Contact Us
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: 1.7, maxWidth: '500px' }}>
              Have a question, feedback, or need help? We&apos;d love to hear from you.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
            {/* Contact Form */}
            <div>
              {submitted ? (
                <div style={{
                  padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(30,142,62,0.2)',
                  background: 'rgba(30,142,62,0.04)', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                  <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Message Sent!</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Your Name</label>
                    <input
                      required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Jane Doe"
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: 'var(--radius)', border: '1px solid var(--border)',
                        fontSize: '15px', background: 'var(--bg)', color: 'var(--text)', outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Email</label>
                    <input
                      required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="jane@example.com"
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: 'var(--radius)', border: '1px solid var(--border)',
                        fontSize: '15px', background: 'var(--bg)', color: 'var(--text)', outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Subject</label>
                    <select
                      value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: 'var(--radius)', border: '1px solid var(--border)',
                        fontSize: '15px', background: 'var(--bg)', color: 'var(--text)', outline: 'none', cursor: 'pointer',
                      }}
                    >
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing & Subscription</option>
                      <option value="feature">Feature Request</option>
                      <option value="bug">Bug Report</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Message</label>
                    <textarea
                      required value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="Tell us what's on your mind..."
                      rows={5}
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: 'var(--radius)', border: '1px solid var(--border)',
                        fontSize: '15px', background: 'var(--bg)', color: 'var(--text)', outline: 'none', resize: 'vertical',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Info cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>📧</div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>Email</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                  <a href="mailto:support@resumate.app" style={{ color: 'var(--primary)' }}>support@resumate.app</a>
                </p>
                <p style={{ color: 'var(--text-dim)', fontSize: '13px', marginTop: '4px' }}>We respond within 24 hours</p>
              </div>

              <div style={{ padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>💬</div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>Community</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                  Join our Discord for tips, feedback, and feature discussions.
                </p>
              </div>

              <div style={{ padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🐛</div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>Bug Reports</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                  Found a bug? File an issue on our <a href="https://github.com" style={{ color: 'var(--primary)' }}>GitHub</a> or use the form.
                </p>
              </div>

              <div style={{ padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(61,77,183,0.12)', background: 'rgba(61,77,183,0.04)' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚡</div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>Pro Support</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                  Pro subscribers get priority support with &lt;6 hour response times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-bottom">
            <span>© 2026 resumate. All rights reserved.</span>
            <Link href="/" style={{ color: 'var(--primary)' }}>← Back to Home</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
