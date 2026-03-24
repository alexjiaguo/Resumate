import Link from 'next/link';

const steps = [
  { num: '1', title: 'Paste the Job Description', desc: 'Copy the full job posting and paste it into the AI Tailoring panel. The AI analyzes required skills, qualifications, and keywords.' },
  { num: '2', title: 'AI Rewrites Your Bullets', desc: 'Each experience bullet is rewritten to emphasize relevant skills while keeping your authentic voice. The AI matches terminology from the job description for ATS optimization.' },
  { num: '3', title: 'Review & Accept', desc: 'Every suggestion is presented as a diff — you see exactly what changed. Accept all, cherry-pick individual changes, or reject and tweak manually.' },
];

const faqs = [
  { q: 'Which AI models are supported?', a: 'ResuMate supports OpenAI (GPT-4, GPT-4o), Google Gemini, and DeepSeek. Pro users get 1 built-in AI tailoring per week. BYOAPI users get unlimited tailoring at their own API rates.' },
  { q: 'How does BYOAPI work?', a: 'Bring Your Own API Key — enter your OpenAI, Gemini, or DeepSeek API key in the settings. Your key is stored locally in your browser, never on our servers. You pay the provider directly at their rates (typically $0.01-0.05 per tailoring).' },
  { q: 'Does AI replace my original content?', a: 'Never. AI suggestions are always presented as proposals that you review and accept. Your original content is preserved in version history, and you can undo any change.' },
  { q: 'Is AI tailoring just keyword stuffing?', a: 'No. The AI understands context and rewrites your bullets to naturally incorporate relevant terminology. It restructures sentences, emphasizes transferable skills, and adjusts tone — not just inject keywords.' },
  { q: 'Can I tailor the same resume for multiple jobs?', a: 'Absolutely. Duplicate your resume in the dashboard, then tailor each copy for a different role. This is the recommended workflow for active job seekers.' },
];

export default function AITailoringPage() {
  return (
    <>
      <nav className="navbar">
        <div className="container">
          <Link href="/" className="navbar-brand">
            <img src="/logo.png" alt="ResuMate" className="navbar-brand-icon" />
            <span>resumate</span>
          </Link>
          <div className="navbar-actions">
            <Link href="/editor" className="btn btn-sm btn-primary">Try AI Tailoring</Link>
          </div>
        </div>
      </nav>

      <section style={{ padding: '140px 0 60px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="section-header" style={{ textAlign: 'left', marginBottom: '48px' }}>
            <span className="badge">🤖 AI-Powered</span>
            <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, marginTop: '16px', marginBottom: '16px', letterSpacing: '-0.02em' }}>
              AI Resume Tailoring
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: 1.7, maxWidth: '600px' }}>
              Paste a job description and let AI rewrite your resume to match — optimized for both ATS systems and human readers.
            </p>
          </div>

          {/* How it works */}
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '32px' }}>How It Works</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '60px' }}>
            {steps.map(s => (
              <div key={s.num} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '20px', flexShrink: 0,
                }}>{s.num}</div>
                <div style={{ paddingTop: '4px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '6px' }}>{s.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison */}
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>Before & After Example</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '60px' }}>
            <div style={{ padding: '24px', borderRadius: 'var(--radius)', background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#d93025', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Before</div>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text-muted)' }}>
                &ldquo;Helped improve the website performance and worked on various frontend tasks with the team.&rdquo;
              </p>
            </div>
            <div style={{ padding: '24px', borderRadius: 'var(--radius)', background: 'rgba(30,142,62,0.04)', border: '1px solid rgba(30,142,62,0.15)' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--success)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>After AI Tailoring</div>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text-muted)' }}>
                &ldquo;Optimized React application performance, reducing Largest Contentful Paint by 35% and improving Core Web Vitals scores across 12 product pages.&rdquo;
              </p>
            </div>
          </div>

          {/* FAQ */}
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '32px' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '60px' }}>
            {faqs.map(f => (
              <div key={f.q} style={{ padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>{f.q}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7 }}>{f.a}</p>
              </div>
            ))}
          </div>

          <div style={{ padding: '40px', borderRadius: 'var(--radius-lg)', background: 'rgba(61,77,183,0.04)', border: '1px solid rgba(61,77,183,0.12)', textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Try AI Tailoring Now</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Free tier includes manual editing. Pro includes AI tailoring.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link href="/editor" className="btn btn-primary">Open Editor</Link>
              <Link href="/pricing" className="btn btn-secondary">View Pricing</Link>
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
