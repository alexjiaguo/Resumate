import React from 'react';
import { useResumeStore } from '@/store/resume-store';
import { SectionKey } from '@/types';

/* CleanLayout — pixel-perfect match to Clean_Layout.html
   Header: CENTERED column (flex-direction: column, align-items: center, text-align: center)
     border-bottom: 2px solid headerColor, paddingBottom: 12px
   Summary: bg #f5f6fa, border-left 2.5px solid headerColor
   Section title: letter-spacing 1.8px, border-bottom 1.5px solid headerColor
   Bottom grid: education + technical + skills in 3-column grid with border-top
   Job format: .job-company = TITLE (bold), .job-title-line = COMPANY (italic)
*/
const CleanLayout: React.FC = () => {
  const { data, theme, selectedTemplate, isSectionVisible, sectionOrder } = useResumeStore();
  const vis = (key: string) => isSectionVisible(selectedTemplate, key as SectionKey);

  const sectionTitle: React.CSSProperties = {
    fontSize: `${theme.sectionTitleSize}px`, fontWeight: 700, color: theme.primaryColor,
    textTransform: 'uppercase', letterSpacing: '1.8px',
    borderBottom: `1.5px solid ${theme.primaryColor}`, paddingBottom: '2px', marginBottom: '7px',
  };

  /* Bottom section title — smaller for 3-col grid */
  const bottomSectionTitle: React.CSSProperties = {
    fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px',
    color: theme.primaryColor, fontWeight: 700, marginBottom: '4px',
    borderBottom: `1.5px solid ${theme.primaryColor}`, paddingBottom: '2px',
  };

  const sections: Record<string, () => React.ReactNode> = {
    summary: () => data.summary ? (
      <section key="summary" style={{ marginBottom: `${theme.sectionSpacing}px` }}>
        <div style={{ fontSize: `${theme.baseFontSize}px`, color: '#3a3a3a', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: data.summary }} />
      </section>
    ) : null,

    experience: () => (
      <section key="experience" style={{ marginBottom: `${theme.sectionSpacing}px` }}>
        <h2 style={sectionTitle}>Professional Experience</h2>
        {data.experience.map((item) => (
          <div key={item.id} style={{ marginBottom: `${theme.itemSpacing || 6}px`, fontSize: '11px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: theme.primaryColor }}>{item.title}</span>
              <span style={{ fontSize: '11px', color: theme.accentColor, fontWeight: 600 }}>{item.dates}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#555', fontStyle: 'italic', marginBottom: '3px' }}>{item.company}</div>
            <ul style={{ paddingLeft: '14px', margin: 0 }}>
              {item.achievements.map((ach, idx) => (
                <li key={idx} style={{ fontSize: '11px', color: '#2e2e4a', marginBottom: '2.5px', lineHeight: theme.lineHeight }} dangerouslySetInnerHTML={{ __html: ach }} />
              ))}
            </ul>
          </div>
        ))}
      </section>
    ),

    education: () => (
      <section key="education" style={{ marginBottom: `${theme.sectionSpacing}px` }}>
        <h2 style={sectionTitle}>Education</h2>
        {data.education.map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
            <span><strong style={{ fontSize: '12px', fontWeight: 700, color: theme.primaryColor }}>{item.school}{item.location ? `, ${item.location}` : ''}</strong> — <span style={{ fontSize: '11px', color: '#555', fontStyle: 'italic' }}>{item.degree}</span></span>
            <span style={{ fontSize: '10px', color: theme.accentColor, fontWeight: 600, whiteSpace: 'nowrap', marginLeft: '10px' }}>{item.dates}</span>
          </div>
        ))}
      </section>
    ),

    skills: () => (
      <section key="skills" style={{ marginBottom: `${theme.sectionSpacing}px` }}>
        <h2 style={sectionTitle}>Core Skills</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {data.skills.map((skill) => (
            <span key={skill.id} style={{
              padding: '2px 8px', borderRadius: '3px', fontSize: '11px',
              backgroundColor: skill.isHighlighted ? theme.primaryColor : '#f0f3f6',
              color: skill.isHighlighted ? '#fff' : '#2c3e50',
              fontWeight: skill.isHighlighted ? 600 : 400,
            }}>{skill.name}</span>
          ))}
        </div>
      </section>
    ),

    technicalSkills: () => (data.technicalSkills || []).length > 0 ? (
      <section key="technicalSkills" style={{ marginBottom: `${theme.sectionSpacing}px` }}>
        <h2 style={sectionTitle}>Technical</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {data.technicalSkills!.map((cat) => (
            <div key={cat.id} style={{ fontSize: '11px' }}>
              <strong style={{ color: theme.primaryColor }}>{cat.category}:</strong> {cat.skills}
            </div>
          ))}
        </div>
      </section>
    ) : null,
  };

  const langCertBlock = () => {
    const showLang = vis('languages') && data.languages.length > 0;
    const showCert = vis('certifications') && data.certifications.length > 0;
    if (!showLang && !showCert) return null;
    return (
      <React.Fragment key="lang-cert">
        {showLang && (
          <section>
            <h3 style={bottomSectionTitle}>Languages & Test Scores</h3>
            <div style={{ fontSize: '11px', color: '#3a3a5c' }}>{data.languages.join(' · ')}</div>
          </section>
        )}
        {showCert && (
          <section>
            <h3 style={bottomSectionTitle}>Training & Certifications</h3>
            {data.certifications.map((cert, idx) => (
              <div key={idx} style={{ marginBottom: '3px', fontSize: '11px', color: '#3a3a5c' }}>{cert}</div>
            ))}
          </section>
        )}
      </React.Fragment>
    );
  };

  /* Determine which sections go in the bottom grid */
  const bottomKeys = ['education', 'technicalSkills', 'skills'] as SectionKey[];
  const mainKeys = sectionOrder.filter(k => !bottomKeys.includes(k) && k !== 'languages' && k !== 'certifications' && k !== 'photo');

  let langCertRendered = false;

  return (
    <div style={{
      fontFamily: theme.fontFamily, fontSize: `${theme.baseFontSize}px`, lineHeight: theme.lineHeight,
      color: theme.textColor, backgroundColor: theme.backgroundColor, padding: `${theme.pagePadding}px`,
      width: '210mm', minHeight: '297mm', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', margin: '0 auto',
      display: 'flex', flexDirection: 'column',
    }} className="resume-paper">

      {/* Header — CENTERED per original */}
      <header style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        borderBottom: `2px solid ${theme.primaryColor}`, paddingBottom: '12px',
        marginBottom: `${theme.sectionSpacing}px`,
      }}>
        <h1 style={{ fontSize: `${theme.headerFontSize}px`, fontWeight: 700, color: theme.primaryColor, letterSpacing: '0.3px', marginBottom: '2px', lineHeight: 1.2 }}>{data.personalInfo.fullName}</h1>
        <div style={{ fontSize: '11px', color: '#5a5a7a', fontWeight: 500, marginBottom: '6px' }}>{data.personalInfo.title}</div>
        <div style={{ fontSize: '11px', color: '#555' }}>
          {[data.personalInfo.location, data.personalInfo.phone, data.personalInfo.email, data.personalInfo.linkedin,
            ...(vis('portfolio') && data.personalInfo.portfolioUrl ? [data.personalInfo.portfolioUrl] : []),
            ...(vis('visaStatus') && data.personalInfo.visaStatus ? [data.personalInfo.visaStatus] : []),
          ].filter(Boolean).join(' | ')}
        </div>
      </header>

      {/* Main sections (summary, experience) AND former bottom sections (education, technical, skills) */}
      {mainKeys.concat(bottomKeys).map((key) => {
        if (!vis(key)) return null;
        if (key === 'languages' || key === 'certifications') {
          if (langCertRendered) return null;
          langCertRendered = true;
          return langCertBlock();
        }
        return sections[key]?.() ?? null;
      })}

      {/* Lang/cert below everything if not rendered yet */}
      {!langCertRendered && langCertBlock()}
    </div>
  );
};

export default CleanLayout;
