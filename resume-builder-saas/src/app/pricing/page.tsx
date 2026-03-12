'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

const features = {
  free: [
    '9 premium resume templates',
    'Real-time preview',
    'Import PDF, DOCX, TXT',
    'Export to PDF, DOCX, HTML, Markdown',
    'Custom color schemes',
    'Section reordering',
    'LocalStorage save',
  ],
  pro: [
    'Everything in Free, plus:',
    'AI-powered resume tailoring',
    '1 AI resume/week (built-in LLM)',
    'Unlimited AI with your own API key',
    'Cloud save & sync across devices',
    'Priority email support',
    'Early access to new templates',
  ],
};

export default function PricingPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile?.id, userEmail: profile?.email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || 'Failed to start checkout.');
    } catch { alert('Checkout failed.'); }
    finally { setLoading(false); }
  };

  const handleManageBilling = async () => {
    if (!profile?.stripeCustomerId) { alert('No active subscription.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: profile.stripeCustomerId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 32px', borderBottom: '1px solid #dadce0',
        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#202124' }}>
          <img src="/logo.png" alt="ResuMate" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'contain' }} />
          <span style={{ fontSize: '16px', fontWeight: 700 }}>resumate</span>
        </Link>
        <div style={{ display: 'flex', gap: '12px' }}>
          {profile ? (
            <Link href="/dashboard" style={{
              padding: '8px 18px', borderRadius: '100px',
              border: '1px solid #dadce0', color: '#202124', fontSize: '14px',
            }}>Dashboard</Link>
          ) : (
            <Link href="/login" className="btn btn-primary" style={{ fontSize: '14px' }}>Get Started</Link>
          )}
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <span style={{
          display: 'inline-block', padding: '6px 16px', borderRadius: '100px',
          background: 'rgba(61,77,183,0.06)', border: '1px solid rgba(61,77,183,0.15)',
          color: '#3D4DB7', fontSize: '13px', fontWeight: 500, marginBottom: '20px',
        }}>Pricing</span>

        <h1 style={{ fontSize: '40px', fontWeight: 700, marginBottom: '12px', lineHeight: 1.1, color: '#202124', letterSpacing: '-0.02em' }}>
          Simple, Transparent Pricing
        </h1>
        <p style={{ color: '#5f6368', fontSize: '16px', marginBottom: '48px', maxWidth: '500px', margin: '0 auto 48px' }}>
          Start free, upgrade when you need AI. No hidden fees.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
          {/* Free */}
          <div style={{ background: '#fff', border: '1px solid #dadce0', borderRadius: '16px', padding: '32px 28px', textAlign: 'left' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px', color: '#202124' }}>Free</h3>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '36px', fontWeight: 800, color: '#202124' }}>$0</span>
              <span style={{ color: '#5f6368', fontSize: '14px' }}>/forever</span>
            </div>
            <p style={{ color: '#5f6368', fontSize: '13px', marginBottom: '24px' }}>Everything you need to build a professional resume.</p>
            <Link href="/editor" style={{
              display: 'block', textAlign: 'center', padding: '12px',
              borderRadius: '100px', border: '1px solid #dadce0',
              color: '#202124', fontSize: '14px', fontWeight: 500, marginBottom: '24px',
            }}>Start Free</Link>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {features.free.map(f => (
                <div key={f} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#5f6368' }}>
                  <span style={{ color: '#1e8e3e', flexShrink: 0 }}>✓</span> {f}
                </div>
              ))}
            </div>
          </div>

          {/* Pro */}
          <div style={{
            background: '#fff', border: '2px solid #3D4DB7', borderRadius: '16px', padding: '32px 28px', textAlign: 'left',
            position: 'relative', boxShadow: '0 2px 16px rgba(61,77,183,0.08)',
          }}>
            <span style={{
              position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
              padding: '4px 16px', borderRadius: '100px', fontSize: '12px', fontWeight: 600,
              background: 'linear-gradient(135deg, #3D4DB7, #2ECDB0)', color: 'white',
            }}>Most Popular</span>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px', color: '#202124' }}>Pro</h3>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '36px', fontWeight: 800, color: '#202124' }}>$9</span>
              <span style={{ color: '#5f6368', fontSize: '14px' }}>/month</span>
            </div>
            <p style={{ color: '#5f6368', fontSize: '13px', marginBottom: '24px' }}>AI-powered tailoring for the competitive edge.</p>
            {profile?.tier === 'pro' ? (
              <button onClick={handleManageBilling} disabled={loading} style={{
                width: '100%', padding: '12px', borderRadius: '100px',
                border: '1px solid #dadce0', background: '#f1f3f4',
                color: '#202124', fontSize: '14px', fontWeight: 500, cursor: 'pointer', marginBottom: '24px',
              }}>{loading ? 'Loading...' : 'Manage Subscription'}</button>
            ) : (
              <button onClick={handleCheckout} disabled={loading} className="btn btn-primary" style={{
                width: '100%', marginBottom: '24px', opacity: loading ? 0.6 : 1,
              }}>{loading ? 'Loading...' : 'Upgrade to Pro'}</button>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {features.pro.map((f, i) => (
                <div key={f} style={{
                  display: 'flex', gap: '8px', fontSize: '13px',
                  color: i === 0 ? '#202124' : '#5f6368', fontWeight: i === 0 ? 600 : 400,
                }}>{i > 0 && <span style={{ color: '#2ECDB0', flexShrink: 0 }}>✓</span>} {f}</div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: '60px', textAlign: 'left', maxWidth: '600px', margin: '60px auto 0' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', textAlign: 'center', color: '#202124' }}>
            Frequently Asked Questions
          </h2>
          {[
            { q: 'What is "Bring Your Own API Key"?', a: 'Pro users can connect their own OpenAI, Gemini, or other LLM API keys for unlimited AI resume tailoring. You pay the LLM provider directly at their rates.' },
            { q: 'Can I cancel anytime?', a: 'Yes! Cancel your subscription anytime from the billing portal. You keep Pro access until the end of your billing period.' },
            { q: 'Is my data secure?', a: 'Resume data is stored in Supabase with Row Level Security — only you can access your resumes. We never share your data.' },
            { q: 'What templates are included?', a: 'All 9 premium templates are available on both Free and Pro plans: Classic Minimal, Bold Engineer, ATS Executive, Academic, and more.' },
          ].map(({ q, a }) => (
            <div key={q} style={{ padding: '16px 0', borderBottom: '1px solid #f1f3f4' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px', color: '#202124' }}>{q}</h3>
              <p style={{ fontSize: '13px', color: '#5f6368', lineHeight: 1.6 }}>{a}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
