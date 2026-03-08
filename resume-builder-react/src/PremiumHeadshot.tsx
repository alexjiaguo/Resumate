import React from 'react';
import { useResumeStore } from './store';
import { SectionKey } from './types';

/* PremiumHeadshot — faithfully matches Premium_Headshot.html
   Grid layout: sidebar LEFT (218px), main RIGHT
   Sidebar: Photo → Name/Title → Contact → Education → Skills → Languages
   Main: Summary (border-left, bg) → Experience → Technical Skills → Certifications
   
   Per user request: Profile/Summary in MAIN column (wide), not sidebar
*/
const PremiumHeadshot: React.FC = () => {
  const { data, theme, selectedTemplate, isSectionVisible, sectionOrder } = useResumeStore();
  const vis = (key: string) => isSectionVisible(selectedTemplate, key as SectionKey);

  // Sidebar section title — matches .sb-section h3
  const sbTitle: React.CSSProperties = {
    fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.8px',
    color: theme.sidebarAccent || '#7ec8e3',
    borderBottom: '1px solid rgba(126, 200, 227, 0.2)',
    paddingBottom: '3px', marginBottom: '7px', fontWeight: 700,
  };

  // Main section title — matches .section-title
  const mainTitle: React.CSSProperties = {
    fontSize: `${theme.sectionTitleSize || 12}px`, fontWeight: 700,
    color: theme.primaryColor || '#16213e',
    textTransform: 'uppercase', letterSpacing: '1.8px',
    borderBottom: `1.5px solid ${theme.primaryColor || '#16213e'}`,
    paddingBottom: '2px', marginBottom: '6px',
  };

  const sbAccent = theme.sidebarAccent || '#7ec8e3';
  const mainLineHeight = 1.38;

  // Sidebar sections
  const sidebarKeys = new Set<string>(['photo', 'education', 'skills', 'languages', 'technicalSkills', 'certifications']);
  const mainKeys = new Set<string>(['summary', 'experience']);

  const sidebarSections: Record<string, () => React.ReactNode> = {
    education: () => (
      <section key="edu-side" style={{ marginBottom: `${theme.sectionSpacing || 12}px` }}>
        <h3 style={sbTitle}>Education</h3>
        {data.education.map((item) => (
          <div key={item.id} style={{ marginBottom: '8px', fontSize: '11px', lineHeight: 1.4 }}>
            <div style={{ fontSize: '11px', color: sbAccent, fontWeight: 600 }}>{item.dates}</div>
            <div style={{ fontSize: '11px', color: '#fff', fontWeight: 600 }}>{item.degree}</div>
            <div style={{ fontSize: '11px', color: '#a0a0b4' }}>{item.school}{item.location ? `, ${item.location}` : ''}</div>
          </div>
        ))}
      </section>
    ),

    skills: () => (
      <section key="skills-side" style={{ marginBottom: `${theme.sectionSpacing || 12}px` }}>
        <h3 style={sbTitle}>Key Skills</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', fontSize: '11px' }}>
          {data.skills.map((skill) => (
            <span key={skill.id} style={{
              fontSize: '11px', padding: '2px 6px', borderRadius: '2px',
              background: skill.isHighlighted ? 'rgba(126, 200, 227, 0.2)' : 'rgba(126, 200, 227, 0.1)',
              color: skill.isHighlighted ? '#fff' : '#a8c8d8',
              border: '1px solid rgba(126, 200, 227, 0.12)',
              fontWeight: skill.isHighlighted ? 600 : 400,
            }}>{skill.name}</span>
          ))}
        </div>
      </section>
    ),

    languages: () => data.languages.length > 0 ? (
      <section key="lang-side" style={{ marginBottom: `${theme.sectionSpacing || 12}px` }}>
        <h3 style={sbTitle}>Languages</h3>
        {data.languages.map((lang, idx) => (
          <div key={idx} style={{ fontSize: '11px', color: '#c0c0cc', marginBottom: '3px', lineHeight: 1.4 }}>{lang}</div>
        ))}
      </section>
    ) : null,

    technicalSkills: () => (data.technicalSkills || []).length > 0 ? (
      <section key="techSkills-side" style={{ marginBottom: `${theme.sectionSpacing || 12}px` }}>
        <h3 style={sbTitle}>Technical Skills</h3>
        {data.technicalSkills!.map((cat) => (
          <div key={cat.id} style={{ marginBottom: '3px', fontSize: '11px', lineHeight: 1.4 }}>
            <span style={{ color: sbAccent, fontWeight: 600 }}>{cat.category}:</span>{' '}
            <span style={{ color: '#c0c0cc' }}>{cat.skills}</span>
          </div>
        ))}
      </section>
    ) : null,

    certifications: () => data.certifications.length > 0 ? (
      <section key="certs-side" style={{ marginBottom: `${theme.sectionSpacing || 12}px` }}>
        <h3 style={sbTitle}>Certifications</h3>
        {data.certifications.map((cert, idx) => (
          <div key={idx} style={{ marginBottom: '3px', fontSize: '11px', lineHeight: 1.4, color: '#c0c0cc' }}>{cert}</div>
        ))}
      </section>
    ) : null,
  };


  // Main column sections
  const mainSections: Record<string, () => React.ReactNode> = {
    summary: () => data.summary ? (
      <div key="summary-main" style={{
        fontSize: '11px', color: '#3a3a5c', lineHeight: mainLineHeight,
        marginBottom: '8px', padding: '6px 9px',
        background: '#f5f6fa', borderLeft: `2.5px solid ${theme.primaryColor || '#16213e'}`,
      }} dangerouslySetInnerHTML={{ __html: data.summary }} />
    ) : null,

    experience: () => (
      <section key="experience" style={{ marginBottom: `${theme.sectionSpacing || 12}px` }}>
        <h2 style={mainTitle}>Professional Experience</h2>
        {data.experience.map((item) => (
          <div key={item.id} style={{ marginBottom: `${theme.itemSpacing || 6}px`, fontSize: '11px', lineHeight: mainLineHeight }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: theme.primaryColor || '#16213e' }}>{item.company}</span>
              <span style={{ fontSize: '11px', color: theme.accentColor || '#0f7b6c', fontWeight: 600, whiteSpace: 'nowrap' }}>{item.dates}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#555', fontStyle: 'italic', marginBottom: '3px' }}>{item.title}</div>
            <ul style={{ paddingLeft: '13px', margin: 0 }}>
              {item.achievements.map((ach, idx) => (
                <li key={idx} style={{ fontSize: '11px', color: theme.textColor || '#1a1a2e', marginBottom: '2px', lineHeight: 'inherit' }} dangerouslySetInnerHTML={{ __html: ach }} />
              ))}
            </ul>
          </div>
        ))}
      </section>
    ),

    technicalSkills: () => null, // Rendered in sidebar now

    certifications: () => null, // Rendered in sidebar now
  };

  return (
    <div style={{
      fontFamily: theme.fontFamily || "'Inter', sans-serif", fontSize: `${theme.baseFontSize}px`,
      lineHeight: theme.lineHeight || 1.28, color: theme.textColor || '#1a1a2e',
      backgroundColor: theme.backgroundColor,
      width: '210mm', minHeight: '297mm', boxShadow: '0 2px 16px rgba(0, 0, 0, 0.1)', margin: '0 auto',
      display: 'grid', gridTemplateColumns: `${theme.sidebarWidth || 218}px 1fr`, overflow: 'hidden',
    }} className="resume-paper">

      {/* ── SIDEBAR (left) ── */}
      <aside style={{
        backgroundColor: theme.sidebarBg || '#16213e', color: theme.sidebarText || '#d0d0dc',
        paddingTop: '20px', paddingLeft: '22px', paddingRight: '16px', paddingBottom: '14px',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Photo + Name */}
        {vis('photo') && (
          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            <div style={{
              width: `${theme.headshotSize || 80}px`, height: `${theme.headshotSize || 80}px`,
              borderRadius: '50%', overflow: 'hidden',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              display: 'block', margin: '0 auto',
              backgroundColor: '#fff',
            }}>
              {data.personalInfo.photo ? (
                <img src={data.personalInfo.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>Photo</div>
              )}
            </div>
          </div>
        )}

        {/* Name + Title in sidebar */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <h1 style={{ fontSize: `${theme.headerFontSize || 24}px`, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{data.personalInfo.fullName}</h1>
          <div style={{ fontSize: '11px', color: sbAccent, fontWeight: 600, marginTop: '2px', letterSpacing: '0.2px' }}>{data.personalInfo.title}</div>
        </div>

        {/* Contact — matches .contact-item with .ic icons */}
        <section style={{ marginBottom: `${theme.sectionSpacing || 12}px` }}>
          <h3 style={sbTitle}>Contact</h3>
          {[
            { icon: '📧', val: data.personalInfo.email },
            { icon: '📞', val: data.personalInfo.phone },
            { icon: '📍', val: data.personalInfo.location },
            { icon: '🔗', val: data.personalInfo.linkedin },
            ...(vis('portfolio') && data.personalInfo.portfolioUrl ? [{ icon: '🌐', val: data.personalInfo.portfolioUrl }] : []),
            ...(vis('visaStatus') && data.personalInfo.visaStatus ? [{ icon: '🛂', val: data.personalInfo.visaStatus }] : []),
          ].map((c, i) => (
            <div key={i} style={{ fontSize: '11px', marginBottom: '4px', color: '#c0c0cc', display: 'flex', alignItems: 'center', gap: '6px', lineHeight: 1.4 }}>
              <span style={{ color: sbAccent, fontSize: '11px', width: '12px', textAlign: 'center', flexShrink: 0 }}>{c.icon}</span>
              <span style={{ wordBreak: 'break-all' }}>{c.val}</span>
            </div>
          ))}
        </section>

        {/* Sidebar sections in sectionOrder */}
        {sectionOrder.map((key) => {
          if (!vis(key)) return null;
          if (!sidebarKeys.has(key) || key === 'photo') return null;
          return sidebarSections[key]?.() ?? null;
        })}

        <div style={{ flex: 1 }} /> {/* Spacer */}
      </aside>

      {/* ── MAIN (right) ── */}
      <main style={{
        paddingTop: '20px', paddingRight: '24px', paddingBottom: '14px', paddingLeft: '16px',
        display: 'flex', flexDirection: 'column',
        color: theme.textColor || '#1a1a2e', fontSize: `${theme.baseFontSize}px`,
      }}>
        {/* Main sections in sectionOrder — Summary and Experience */}
        {sectionOrder.map((key) => {
          if (!vis(key)) return null;
          if (!mainKeys.has(key)) return null;
          return mainSections[key]?.() ?? null;
        })}

        <div style={{ flex: 1 }} /> {/* Spacer */}
      </main>
    </div>
  );
};

export default PremiumHeadshot;
