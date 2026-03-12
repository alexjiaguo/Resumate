import React from 'react';
import { useResumeStore } from '@/store/resume-store';
import { SectionKey } from '@/types';

/* ClassicMinimal — pixel-perfect match to Classic_Minimal.html
   Header: CENTERED, h1 uppercase letter-spacing: 2px, .info 10px #555
   Summary: background #f5f6fa, border-left 2.5px solid headerColor
   Section: letter-spacing: 1px, border-bottom: 1px solid #eee
   Education: edu-item flex row (school—degree left, dates right)
   Skills: gap 5px, .sk tags
*/
const ClassicMinimal: React.FC = () => {
  const { data, theme, selectedTemplate, isSectionVisible, sectionOrder } = useResumeStore();
  const vis = (key: string) => isSectionVisible(selectedTemplate, key as SectionKey);

  const sectionTitle: React.CSSProperties = {
    fontSize: `${theme.sectionTitleSize}px`, fontWeight: 700, color: theme.primaryColor,
    textTransform: 'uppercase', letterSpacing: '1px',
    borderBottom: '1px solid #eee', paddingBottom: '3px', marginBottom: '6px',
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
          <div key={item.id} style={{ marginBottom: `${theme.itemSpacing || 8}px`, fontSize: '11px', lineHeight: theme.lineHeight }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: `${theme.companyFontSize || 11}px`, fontWeight: 600, color: theme.primaryColor }}>
              <span>{item.company}</span>
              <span style={{ color: theme.accentColor, fontWeight: 400 }}>{item.dates}</span>
            </div>
            <div style={{ fontStyle: 'italic', fontSize: '11px', marginBottom: '2px' }}>{item.title}</div>
            <ul style={{ paddingLeft: '18px', marginTop: '3px', margin: 0 }}>
              {item.achievements.map((ach, idx) => (
                <li key={idx} style={{ marginBottom: '2px', fontSize: '11px', lineHeight: theme.lineHeight }} dangerouslySetInnerHTML={{ __html: ach }} />
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
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3px', fontSize: '11px' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'baseline' }}>
              <span style={{ fontWeight: 600, fontSize: '12px', color: theme.primaryColor }}>{item.school}{item.location ? `, ${item.location}` : ''}</span>
              <span style={{ color: theme.textColor, fontStyle: 'italic' }}>— {item.degree}</span>
            </div>
            <span style={{ color: theme.accentColor, fontWeight: 400, whiteSpace: 'nowrap' }}>{item.dates}</span>
          </div>
        ))}
      </section>
    ),

    skills: () => (
      <section key="skills" style={{ marginBottom: `${theme.sectionSpacing}px` }}>
        <h2 style={sectionTitle}>Key Skills</h2>
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
        <h2 style={sectionTitle}>Technical Skills</h2>
        {data.technicalSkills!.map((cat) => (
          <div key={cat.id} style={{ marginBottom: '3px', fontSize: '11px' }}>
            <strong style={{ color: theme.primaryColor }}>{cat.category}:</strong> {cat.skills}
          </div>
        ))}
      </section>
    ) : null,
  };

  const langCertBlock = () => {
    const showLang = vis('languages') && data.languages.length > 0;
    const showCert = vis('certifications') && data.certifications.length > 0;
    if (!showLang && !showCert) return null;
    return (
      <div key="lang-cert" style={{ display: 'grid', gridTemplateColumns: showLang && showCert ? '1fr 1fr' : '1fr', gap: '20px', marginBottom: `${theme.sectionSpacing}px` }}>
        {showLang && (
          <section>
            <h2 style={sectionTitle}>Languages & Test Scores</h2>
            <div style={{ fontSize: '11px' }}>{data.languages.join(' · ')}</div>
          </section>
        )}
        {showCert && (
          <section>
            <h2 style={sectionTitle}>Training & Certifications</h2>
            {data.certifications.map((cert, idx) => (
              <div key={idx} style={{ marginBottom: '3px', fontSize: '11px' }}>{cert}</div>
            ))}
          </section>
        )}
      </div>
    );
  };

  let langCertRendered = false;

  return (
    <div style={{
      fontFamily: theme.fontFamily, fontSize: `${theme.baseFontSize}px`, lineHeight: theme.lineHeight,
      color: theme.textColor, backgroundColor: theme.backgroundColor, padding: `${theme.pagePadding}px`,
      width: '210mm', minHeight: '297mm', boxShadow: '0 0 15px rgba(0,0,0,0.1)', margin: '0 auto',
    }} className="resume-paper">

      {/* Header — CENTERED per original */}
      <header style={{ textAlign: 'center', marginBottom: '15px' }}>
        <h1 style={{
          fontSize: `${theme.headerFontSize}px`, fontWeight: 700, color: theme.primaryColor,
          textTransform: 'uppercase', letterSpacing: '2px', lineHeight: 1.2,
        }}>{data.personalInfo.fullName}</h1>
        <div style={{ fontSize: '10px', color: '#555', marginTop: '4px' }}>
          {[data.personalInfo.phone, data.personalInfo.email, data.personalInfo.linkedin,
            ...(vis('portfolio') && data.personalInfo.portfolioUrl ? [data.personalInfo.portfolioUrl] : []),
            ...(vis('visaStatus') && data.personalInfo.visaStatus ? [data.personalInfo.visaStatus] : []),
          ].filter(Boolean).join(' · ')}
        </div>
      </header>

      {sectionOrder.map((key) => {
        if (!vis(key)) return null;
        if (key === 'languages' || key === 'certifications') {
          if (langCertRendered) return null;
          langCertRendered = true;
          return langCertBlock();
        }
        if (key === 'photo') return null;
        return sections[key]?.() ?? null;
      })}
    </div>
  );
};

export default ClassicMinimal;
