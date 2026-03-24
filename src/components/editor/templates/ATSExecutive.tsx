import React from 'react';
import { useResumeStore } from '@/store/resume-store';
import { SectionKey } from '@/types';

/* ATSExecutive — pixel-perfect match to ATS_Executive.html
   Header: LEFT-ALIGNED, border-bottom: 2px solid, subtitle 12px accent, contact-line 10px
   Section titles: 11px, all-caps, letter-spacing: 1.5px, border-bottom 1px solid #d0d5dd
   Summary: plain text 11px #3a3a3a (no background/border)
   Education: job-company + job-title-line format
   Job: compact, dates 10px font-weight 600
*/
const ATSExecutive: React.FC = () => {
  const { data, theme, selectedTemplate, isSectionVisible, sectionOrder } = useResumeStore();
  const vis = (key: string) => isSectionVisible(selectedTemplate, key as SectionKey);

  const sectionTitle: React.CSSProperties = {
    fontSize: `${theme.sectionTitleSize}px`, fontWeight: 700, color: theme.primaryColor,
    textTransform: 'uppercase', letterSpacing: '1.5px',
    borderBottom: '1px solid #d0d5dd', paddingBottom: '2px', marginBottom: '6px',
  };

  const sections: Record<string, () => React.ReactNode> = {
    summary: () => data.summary ? (
      <section key="summary" style={{ marginBottom: `${theme.sectionSpacing}px` }}>
        <div style={{ fontSize: '11px', color: '#3a3a3a', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: data.summary }} />
      </section>
    ) : null,

    experience: () => (
      <section key="experience" style={{ marginBottom: `${theme.sectionSpacing}px` }}>
        <h2 style={sectionTitle}>Professional Experience</h2>
        {data.experience.map((item) => (
          <div key={item.id} style={{ marginBottom: `${theme.itemSpacing || 6}px`, lineHeight: theme.lineHeight }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: theme.primaryColor }}>{item.company}</span>
              <span style={{ fontSize: '10px', color: theme.accentColor, fontWeight: 600 }}>{item.dates}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#555', fontStyle: 'italic', marginBottom: '2px' }}>{item.title}</div>
            <ul style={{ paddingLeft: '16px', margin: '2px 0 0 0' }}>
              {item.achievements.map((ach, idx) => (
                <li key={idx} style={{ fontSize: '11px', color: theme.textColor, marginBottom: '2px', lineHeight: theme.lineHeight }} dangerouslySetInnerHTML={{ __html: ach }} />
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
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
            <span><strong style={{ color: theme.primaryColor }}>{item.school}{item.location ? `, ${item.location}` : ''}</strong> — {item.degree}</span>
            <span style={{ color: theme.accentColor, whiteSpace: 'nowrap' }}>{item.dates}</span>
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
            <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: theme.primaryColor, fontWeight: 700, marginBottom: '4px', borderBottom: '1px solid #d0d5dd', paddingBottom: '2px' }}>Languages & Test Scores</h3>
            <div style={{ fontSize: '11px' }}>{data.languages.join(' · ')}</div>
          </section>
        )}
        {showCert && (
          <section>
            <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: theme.primaryColor, fontWeight: 700, marginBottom: '4px', borderBottom: '1px solid #d0d5dd', paddingBottom: '2px' }}>Training & Certifications</h3>
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

      {/* Header — LEFT-ALIGNED per original ATS_Executive.html */}
      <header style={{
        marginBottom: `${theme.sectionSpacing}px`, paddingBottom: '10px',
        borderBottom: `2px solid ${theme.primaryColor}`,
      }}>
        <h1 style={{ fontSize: `${theme.headerFontSize}px`, fontWeight: 700, color: theme.primaryColor, letterSpacing: '0.3px', marginBottom: '1px', lineHeight: 1.2 }}>{data.personalInfo.fullName}</h1>
        <div style={{ fontSize: '12px', color: theme.accentColor, fontWeight: 600, marginBottom: '4px' }}>{data.personalInfo.title}</div>
        <div style={{ fontSize: '10px', color: '#555' }}>
          {[
            data.personalInfo.phone,
          ].join('')}<span style={{ color: theme.accentColor }}> · {data.personalInfo.email}</span> · {data.personalInfo.linkedin}
          {vis('portfolio') && data.personalInfo.portfolioUrl && <> · {data.personalInfo.portfolioUrl}</>}
          {vis('visaStatus') && data.personalInfo.visaStatus && <> · {data.personalInfo.visaStatus}</>}
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

export default ATSExecutive;
