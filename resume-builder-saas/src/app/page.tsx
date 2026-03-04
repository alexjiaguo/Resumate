import Link from 'next/link';

const features = [
  { icon: '📄', title: '9 Premium Templates', desc: 'From Classic Minimal to Bold Engineer — professionally designed layouts that make your experience shine.' },
  { icon: '🤖', title: 'AI Resume Tailoring', desc: 'Paste a job description and let AI rewrite your resume to match — optimized for ATS and human readers.' },
  { icon: '👁️', title: 'Real-Time Preview', desc: 'See changes instantly as you type. What you see is exactly what gets exported.' },
  { icon: '📤', title: 'Export Anywhere', desc: 'Download as PDF, DOCX, HTML, or Markdown. Print-ready formatting every time.' },
  { icon: '🔑', title: 'Bring Your Own API Key', desc: 'Connect OpenAI, Gemini, or DeepSeek for unlimited AI tailoring at your own rates.' },
  { icon: '🎨', title: 'Custom Styling', desc: 'Change colors, fonts, spacing, and section order to match your personal brand.' },
];

const steps = [
  { num: '1', title: 'Upload or Start Fresh', desc: 'Import your existing resume (PDF, DOCX) or start from a blank template.' },
  { num: '2', title: 'Edit & Tailor', desc: 'Customize content manually or paste a job description for AI-powered tailoring.' },
  { num: '3', title: 'Export & Apply', desc: 'Download your polished resume and start applying with confidence.' },
];

const testimonials = [
  { quote: "I tailored 5 resumes in one afternoon. The AI suggestions were surprisingly natural — not the usual buzzword salad.", name: 'Sarah K.', role: 'Product Manager', initial: 'S' },
  { quote: "Finally a resume builder that doesn't make everything look the same. The templates are genuinely well-designed.", name: 'Marcus T.', role: 'Software Engineer', initial: 'M' },
  { quote: "The BYOAPI feature is genius. I use my own OpenAI key and get unlimited tailoring for pennies.", name: 'Priya L.', role: 'Data Scientist', initial: 'P' },
];

export default function HomePage() {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="container">
          <Link href="/" className="navbar-brand">
            <img src="/logo.png" alt="ResuMate" className="navbar-brand-icon" />
            <span>ResuMate</span>
          </Link>
          <ul className="navbar-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#pricing">Pricing</a></li>
          </ul>
          <div className="navbar-actions">
            <Link href="/login" className="btn btn-sm btn-secondary">Log In</Link>
            <Link href="/editor" className="btn btn-sm btn-primary">Start Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">
            <span className="badge">✨ AI-Powered Resume Builder</span>
          </div>
          <h1>
            The resume builder<br />
            designed to <span className="gradient-text">get you hired</span>
          </h1>
          <p className="hero-subtitle">
            9 premium templates, AI-powered job matching, and real-time preview.
            Create a professional resume in minutes — not hours.
          </p>
          <div className="hero-actions">
            <Link href="/editor" className="btn btn-primary btn-lg">
              Start Building Free →
            </Link>
            <Link href="#pricing" className="btn btn-secondary btn-lg">
              View Pricing
            </Link>
          </div>
          <p className="hero-note">No credit card required · Free forever for basic features</p>
          <div className="hero-preview">
            <div className="hero-preview-img">
              <div className="hero-preview-placeholder">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                </svg>
                <span>Editor Preview</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <span className="badge">Features</span>
            <h2>Everything you need to land the job</h2>
            <p>From AI tailoring to pixel-perfect exports — built for job seekers who want results.</p>
          </div>
          <div className="features-grid">
            {features.map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">
                  <span style={{ fontSize: '24px' }}>{f.icon}</span>
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="badge">How It Works</span>
            <h2>Three steps to your perfect resume</h2>
          </div>
          <div className="steps-grid">
            {steps.map(s => (
              <div key={s.num} className="step">
                <div className="step-number">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing" id="pricing">
        <div className="container">
          <div className="section-header">
            <span className="badge">Pricing</span>
            <h2>Simple, transparent pricing</h2>
            <p>Start free, upgrade when you need AI superpowers.</p>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card">
              <h3>Free</h3>
              <div className="price">$0<span> /forever</span></div>
              <p className="price-note">Everything you need to build a polished resume.</p>
              <ul className="pricing-features">
                {['All 9 premium templates', 'Real-time preview', 'Import PDF, DOCX, TXT', 'Export to PDF, DOCX, HTML, MD', 'Custom color schemes', 'Section drag & reorder', 'Local storage save'].map(f => (
                  <li key={f}><span className="check">✓</span> {f}</li>
                ))}
                <li><span className="cross">—</span> AI resume tailoring</li>
                <li><span className="cross">—</span> Cloud sync</li>
              </ul>
              <Link href="/editor" className="btn btn-secondary">Start Free</Link>
            </div>
            <div className="pricing-card featured">
              <h3>Pro</h3>
              <div className="price">$9<span> /month</span></div>
              <p className="price-note">AI-powered tailoring for the competitive edge.</p>
              <ul className="pricing-features">
                {['Everything in Free', 'AI resume tailoring', '1 AI resume/week (built-in)', 'Unlimited with your API key', 'Cloud save & sync', 'Priority support', 'Early access to new templates'].map(f => (
                  <li key={f}><span className="check">✓</span> {f}</li>
                ))}
              </ul>
              <Link href="/pricing" className="btn btn-primary">Upgrade to Pro</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <span className="badge">Testimonials</span>
            <h2>Loved by job seekers</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map(t => (
              <div key={t.name} className="testimonial-card">
                <p>"{t.quote}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.initial}</div>
                  <div className="testimonial-author-info">
                    <h4>{t.name}</h4>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <div className="cta-box">
            <h2>Ready to land your dream job?</h2>
            <p>Join thousands of professionals who built their winning resume with ResuMate.</p>
            <Link href="/editor" className="btn btn-primary btn-lg">Start Building — It's Free</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link href="/" className="navbar-brand">
                <img src="/logo.png" alt="ResuMate" className="navbar-brand-icon" />
                <span>ResuMate</span>
              </Link>
              <p>Build professional resumes that get you hired. AI-powered, beautifully designed, completely free to start.</p>
            </div>
            <div>
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/editor">Editor</Link></li>
              </ul>
            </div>
            <div>
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Resume Tips</a></li>
                <li><a href="#">Templates Guide</a></li>
                <li><a href="#">AI Tailoring</a></li>
              </ul>
            </div>
            <div>
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2025 ResuMate. All rights reserved.</span>
            <span>Built with ❤️ for job seekers everywhere</span>
          </div>
        </div>
      </footer>
    </>
  );
}
