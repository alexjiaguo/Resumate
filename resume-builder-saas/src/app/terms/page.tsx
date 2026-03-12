import Link from 'next/link';

export default function TermsOfServicePage() {
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
              Terms of Service
            </h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>Last updated: March 12, 2026</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', fontSize: '15px', lineHeight: 1.8, color: 'var(--text-muted)' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>1. Service Description</h2>
              <p>ResuMate (&ldquo;the Service&rdquo;) is a web-based resume builder that allows users to create, edit, and export professional resumes. The Service includes free and paid tiers with different feature sets as described on our pricing page.</p>
            </div>

            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>2. Account Terms</h2>
              <ul style={{ marginLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>You must be at least 16 years old to use the Service.</li>
                <li>You are responsible for maintaining the security of your account credentials.</li>
                <li>One person or legal entity may maintain no more than one free account.</li>
                <li>You may not use the Service for any illegal purpose or in violation of any applicable laws.</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>3. Content Ownership</h2>
              <p>You retain full ownership of all resume content you create with the Service. ResuMate does not claim any intellectual property rights over your content. We will never sell, share, or use your resume content for purposes other than providing the Service to you.</p>
            </div>

            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>4. AI Features</h2>
              <ul style={{ marginLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>AI-generated suggestions are provided as recommendations only. You are responsible for reviewing and verifying all AI output before use.</li>
                <li>AI features are powered by third-party providers (OpenAI, Google, DeepSeek). Their terms of service also apply when using AI features.</li>
                <li>We do not guarantee the accuracy, appropriateness, or effectiveness of AI-generated content.</li>
                <li>BYOAPI usage is subject to the rate limits and terms of your API provider.</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>5. Free & Pro Plans</h2>
              <p><strong>Free Plan:</strong> Includes all templates, real-time preview, import/export, and local storage. Data is stored in your browser only. No SLA or uptime guarantee.</p>
              <p style={{ marginTop: '12px' }}><strong>Pro Plan ($9/month):</strong> Includes AI tailoring (1 per week built-in, unlimited with BYOAPI), cloud sync, and priority support. Billed monthly. Cancel anytime — access continues until the end of the billing period.</p>
            </div>

            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>6. Refund Policy</h2>
              <p>Pro subscriptions can be cancelled at any time. We offer a full refund within 7 days of your first payment if you&apos;re not satisfied. After 7 days, remaining subscription time is non-refundable but you retain access until the period ends.</p>
            </div>

            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>7. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul style={{ marginTop: '8px', marginLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Attempt to reverse-engineer, decompile, or extract the source code of the Service</li>
                <li>Use automated tools to scrape, crawl, or extract data from the Service</li>
                <li>Resell, redistribute, or white-label the Service without written permission</li>
                <li>Create resumes containing false, misleading, or fraudulent information</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>8. Limitation of Liability</h2>
              <p>The Service is provided &ldquo;as is&rdquo; without warranties of any kind. ResuMate shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service, including but not limited to: lost data, missed job opportunities, or costs of substitute services.</p>
            </div>

            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>9. Termination</h2>
              <p>We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time through the dashboard settings or by contacting us. Upon deletion, all your data will be permanently removed within 30 days.</p>
            </div>

            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>10. Changes to Terms</h2>
              <p>We may update these terms from time to time. Material changes will be communicated via email and in-app notification at least 14 days before taking effect. Continued use constitutes acceptance.</p>
            </div>

            <div style={{ padding: '24px', borderRadius: 'var(--radius)', background: 'rgba(61,77,183,0.04)', border: '1px solid rgba(61,77,183,0.12)' }}>
              <p style={{ fontSize: '14px' }}>
                <strong>Questions about these terms?</strong> Contact us at <a href="mailto:legal@resumate.app" style={{ color: 'var(--primary)' }}>legal@resumate.app</a>
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
