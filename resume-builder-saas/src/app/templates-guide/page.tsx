import Link from 'next/link';

const templates = [
  { id: 'classic', name: 'Classic Minimal', layout: 'Single column', best: 'Traditional industries, senior roles', desc: 'Clean and timeless. No distractions — just your credentials presented with elegant simplicity. Perfect for finance, law, consulting, and executive positions.' },
  { id: 'clean', name: 'Clean Layout', layout: 'Single column', best: 'General use, versatile', desc: 'Structured sections with subtle dividers. Works for virtually any role. The safe, reliable choice when you want polish without personality risk.' },
  { id: 'premium', name: 'Premium Headshot', layout: 'Sidebar + main', best: 'Creative roles, personal branding', desc: 'Features a professional photo in a sidebar layout. Ideal for roles where personality matters — marketing, sales, consulting, design leadership.' },
  { id: 'ats', name: 'ATS Executive', layout: 'Single column', best: 'Corporate, large companies', desc: 'Engineered to pass every ATS system. Clean headers, standard section names, zero decorative elements. When the robot reads first, this template wins.' },
  { id: 'photo', name: 'Photo Header', layout: 'Photo header + two columns', best: 'International applications, LinkedIn-heavy roles', desc: 'Large hero photo at the top with two-column content below. Common in European and Asian markets where photos are expected.' },
  { id: 'clean_prof', name: 'Clean Professional', layout: 'Single column with dividers', best: 'Mid-career professionals', desc: 'Similar to Clean but with more refined typography and dividers. Strikes the balance between modern and traditional.' },
  { id: 'elegant', name: 'Elegant Two-Column', layout: 'Two-column', best: 'Designers, product managers', desc: 'Skills and education on one side, experience on the other. Efficient use of space that lets you fit more content without feeling cramped.' },
  { id: 'bold', name: 'Bold Engineer', layout: 'Dark header + badges', best: 'Software engineers, tech roles', desc: 'Dark header block with skill badges and tech stack visualization. Speaks the language of technical hiring managers.' },
  { id: 'academic', name: 'Academic', layout: 'Single column, publication-ready', best: 'Research, academia, PhD candidates', desc: 'Designed for publications, grants, and teaching experience. Proper academic formatting with room for long-form descriptions.' },
];

export default function TemplatesGuidePage() {
  return (
    <>
      <nav className="navbar">
        <div className="container">
          <Link href="/" className="navbar-brand">
            <img src="/logo.png" alt="ResuMate" className="navbar-brand-icon" />
            <span>resumate</span>
          </Link>
          <div className="navbar-actions">
            <Link href="/editor" className="btn btn-sm btn-primary">Try Templates</Link>
          </div>
        </div>
      </nav>

      <section style={{ padding: '140px 0 80px' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="section-header" style={{ textAlign: 'left', marginBottom: '48px' }}>
            <span className="badge">Templates</span>
            <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, marginTop: '16px', marginBottom: '16px', letterSpacing: '-0.02em' }}>
              9 Templates, Designed for Real Jobs
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: 1.7, maxWidth: '650px' }}>
              Every template is tested with ATS systems, reviewed by recruiters, and designed to maximize readability. Pick the one that fits your industry and style.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {templates.map((t, i) => (
              <div key={t.id} style={{
                padding: '28px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
                background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', gap: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 600 }}>{t.name}</h3>
                  <span style={{ padding: '2px 10px', borderRadius: '6px', fontSize: '11px', background: 'rgba(46,205,176,0.1)', color: 'var(--teal-dark)', fontWeight: 500 }}>
                    {t.layout}
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, flex: 1 }}>{t.desc}</p>
                <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 500 }}>
                  Best for: {t.best}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '60px', padding: '40px', borderRadius: 'var(--radius-lg)', background: 'rgba(61,77,183,0.04)', border: '1px solid rgba(61,77,183,0.12)', textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Try all 9 templates free</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Switch between templates instantly in the editor — your content stays intact.</p>
            <Link href="/editor" className="btn btn-primary btn-lg">Open Editor</Link>
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
