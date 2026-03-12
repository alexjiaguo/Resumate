import Link from 'next/link';

export default function PrivacyPolicyPage() {
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
        <div className="container" style={{ maxWidth: '720px' }}>
          <div style={{ marginBottom: '48px' }}>
            <span className="badge">Legal</span>
            <h1 style={{ fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 700, marginTop: '16px', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              Privacy Policy
            </h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>Last updated: March 12, 2026</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', fontSize: '15px', lineHeight: 1.8, color: 'var(--text-muted)' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>1. Information We Collect</h2>
              <p>ResuMate collects minimal data to operate the service:</p>
              <ul style={{ marginTop: '12px', marginLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Account Information:</strong> Email address and name when you sign up with Google or email/password.</li>
                <li><strong>Resume Data:</strong> The content you enter into the editor, including personal details, work experience, education, and skills.</li>
                <li><strong>Usage Data:</strong> Anonymous analytics about which features you use (template choices, export formats) to improve the product.</li>
                <li><strong>API Keys:</strong> If you use BYOAPI, your API keys are stored exclusively in your browser&apos;s local storage and <strong>never transmitted to our servers</strong>.</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>2. How We Use Your Data</h2>
              <ul style={{ marginLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>To store and sync your resumes across devices (Pro accounts)</li>
                <li>To process AI tailoring requests (resume text is sent to the AI provider you choose)</li>
                <li>To improve product features based on anonymous usage patterns</li>
                <li>To communicate important product updates or security notices</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>3. Data Storage & Security</h2>
              <p><strong>Free users:</strong> All resume data is stored locally in your browser&apos;s localStorage. Nothing is sent to our servers. If you clear your browser data, your resumes are lost.</p>
              <p style={{ marginTop: '12px' }}><strong>Pro users:</strong> Resume data is encrypted and stored in Supabase (PostgreSQL). Data is encrypted at rest and in transit using AES-256 and TLS 1.3. We perform regular security audits.</p>
            </div>

            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>4. AI Processing</h2>
              <p>When you use AI tailoring, your resume text and the job description are sent to the AI provider (OpenAI, Google, or DeepSeek). We do not store AI prompts or responses beyond the current session. Each AI provider has their own data handling policies — we recommend reviewing them.</p>
            </div>

            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>5. Third-Party Services</h2>
              <ul style={{ marginLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Supabase:</strong> Authentication and database hosting (Pro users)</li>
                <li><strong>Stripe:</strong> Payment processing (we never see your full card number)</li>
                <li><strong>OpenAI/Google/DeepSeek:</strong> AI processing (only when you initiate tailoring)</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>6. Your Rights</h2>
              <p>You can request a full export or deletion of your data at any time by contacting us. We will process deletion requests within 30 days. You own your resume content — we claim no rights to it.</p>
            </div>

            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>7. Cookies</h2>
              <p>We use essential cookies only for authentication session management. We do not use advertising cookies or trackers. No consent banner is required because we don&apos;t track you.</p>
            </div>

            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>8. Changes to This Policy</h2>
              <p>We&apos;ll notify users of material changes via email and a banner in the application. Continued use after notification constitutes acceptance of the updated policy.</p>
            </div>

            <div style={{ padding: '24px', borderRadius: 'var(--radius)', background: 'rgba(61,77,183,0.04)', border: '1px solid rgba(61,77,183,0.12)' }}>
              <p style={{ fontSize: '14px' }}>
                <strong>Questions about privacy?</strong> Contact us at <a href="mailto:privacy@resumate.app" style={{ color: 'var(--primary)' }}>privacy@resumate.app</a>
              </p>
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
