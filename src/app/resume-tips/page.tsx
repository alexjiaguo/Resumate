import Link from 'next/link';

const tips = [
  { icon: '🎯', title: 'Tailor Every Resume', desc: 'Never send a generic resume. Study the job description, identify 5-8 key requirements, and mirror that language in your bullets. Our AI tailoring feature does this automatically — paste the JD and get a matched resume in seconds.' },
  { icon: '📊', title: 'Quantify Your Impact', desc: 'Replace vague phrases like "improved performance" with "reduced API latency by 40%, saving $12K/month in infrastructure costs." Numbers make your achievements concrete and memorable.' },
  { icon: '🔤', title: 'Beat the ATS', desc: 'Applicant Tracking Systems scan for keywords before a human ever sees your resume. Use exact phrases from the job listing — "project management" not "PM," "cross-functional collaboration" not "worked with teams."' },
  { icon: '📐', title: 'Keep It to One Page', desc: 'Unless you have 10+ years of relevant experience, one page is the gold standard. Hiring managers spend an average of 7.4 seconds on initial review — make every line count.' },
  { icon: '⚡', title: 'Lead with Action Verbs', desc: 'Start every bullet with a strong verb: Led, Designed, Shipped, Optimized, Reduced, Launched, Architected, Automated. Avoid passive phrases like "Was responsible for" or "Helped with."' },
  { icon: '🧹', title: 'Cut the Clutter', desc: 'Remove "References available upon request," objective statements, and irrelevant hobbies. Every line should answer: "Does this prove I can do this job well?"' },
  { icon: '🎨', title: 'Design Matters', desc: 'A clean, well-structured layout signals professionalism. Use consistent fonts, adequate white space, and clear section headers. Our 9 templates are designed by professionals to maximize readability.' },
  { icon: '📝', title: 'Proofread Relentlessly', desc: 'A single typo can disqualify you. Read your resume backward (catches errors your brain auto-corrects), use spell-check, and have a friend review it. Fresh eyes catch what yours miss.' },
];

export default function ResumeTipsPage() {
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
          <div className="section-header" style={{ textAlign: 'left', marginBottom: '48px' }}>
            <span className="badge">Career Guide</span>
            <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, marginTop: '16px', marginBottom: '16px', letterSpacing: '-0.02em' }}>
              8 Resume Tips That Actually Get Interviews
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: 1.7, maxWidth: '600px' }}>
              Distilled from hiring managers, recruiters, and career coaches. Skip the generic advice — these are the tips that move the needle.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {tips.map((tip, i) => (
              <div key={tip.title} style={{
                display: 'flex', gap: '20px', padding: '28px', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)', background: 'var(--bg-card)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}>
                <div style={{ fontSize: '28px', flexShrink: 0, paddingTop: '2px' }}>{tip.icon}</div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                    <span style={{ color: 'var(--primary)', marginRight: '8px' }}>{i + 1}.</span>{tip.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.7 }}>{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '60px', padding: '40px', borderRadius: 'var(--radius-lg)', background: 'rgba(61,77,183,0.04)', border: '1px solid rgba(61,77,183,0.12)', textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Ready to put these tips into action?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Build your tailored resume in minutes with ResuMate.</p>
            <Link href="/editor" className="btn btn-primary btn-lg">Start Building — It&apos;s Free</Link>
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
