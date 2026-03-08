import React from 'react';
import { useResumeStore } from './store';
import { SectionKey } from './types';

/* CleanProfessional — pixel-perfect match to Clean_Professional.html
   Header: .centered-header { text-align: center; margin-bottom: 35px; }
     h1: text-transform: uppercase; letter-spacing: 2px; font-size: 32px
     .job-title: font-size: 16px; color: #6b7280; font-weight: 500; margin-bottom: 15px
     .centered-contact: display: flex; justify-content: center; gap: 15px; font-size: 10px; color: #4b5563
   Section title: letter-spacing: 1.5px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px
   Section margin: 25px
   Job header: Title — Company, Location (single span) | dates right
   Education: edu-header (school+dates) + edu-degree
*/
const CleanProfessional: React.FC = () => {
  const { data, theme, selectedTemplate, isSectionVisible, sectionOrder } = useResumeStore();
  const vis = (key: string) => isSectionVisible(selectedTemplate, key as SectionKey);

  const sectionTitle: React.CSSProperties = {
    fontSize: `${theme.sectionTitleSize}px`, fontWeight: 700, color: theme.primaryColor,
    textTransform: 'uppercase', letterSpacing: '1.5px',
    borderBottom: '1px solid #e5e7eb', paddingBottom: '5px', marginBottom: '15px',
  };

  const sections: Record<string, () => React.ReactNode> = {
    summary: () => data.summary ? (
      <section key="summary" style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: `${theme.baseFontSize}px`, color: '#3a3a3a', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: data.summary }} />
      </section>
    ) : null,

    experience: () => (
      <section key="experience" style={{ marginBottom: '25px' }}>
        <h2 style={sectionTitle}>Professional Experience</h2>
        {data.experience.map((item) => (
          <div key={item.id} style={{ marginBottom: '7px', fontSize: `${theme.baseFontSize}px`, lineHeight: theme.lineHeight }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: theme.primaryColor }}>
              <span>{item.title} — {item.company}</span>
              <span style={{ color: theme.accentColor, fontWeight: 400, fontStyle: 'italic', fontSize: '0.95em' }}>{item.dates}</span>
            </div>
            <ul style={{ margin: 0, marginTop: '2px', paddingLeft: '16px' }}>
              {item.achievements.map((ach, idx) => (
                <li key={idx} style={{ marginBottom: '1px', lineHeight: theme.lineHeight }} dangerouslySetInnerHTML={{ __html: ach }} />
              ))}
            </ul>
          </div>
        ))}
      </section>
    ),

    education: () => (
      <section key="education" style={{ marginBottom: '25px' }}>
        <h2 style={sectionTitle}>Education</h2>
        {data.education.map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
            <span><strong style={{ color: theme.primaryColor, fontSize: '11px', fontWeight: 700 }}>{item.school}{item.location ? `, ${item.location}` : ''}</strong> — <span style={{ fontSize: '1em' }}>{item.degree}</span></span>
            <span style={{ color: theme.accentColor, fontStyle: 'italic', fontSize: '0.95em', whiteSpace: 'nowrap', marginLeft: '10px' }}>{item.dates}</span>
          </div>
        ))}
      </section>
    ),

    skills: () => (
      <section key="skills" style={{ marginBottom: '25px' }}>
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
      <section key="technicalSkills" style={{ marginBottom: '25px' }}>
        <h2 style={sectionTitle}>Technical Skills</h2>
        {data.technicalSkills!.map((cat) => (
          <div key={cat.id} style={{ marginBottom: '3px', fontSize: '1em' }}>
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
      <div key="lang-cert" style={{ display: 'grid', gridTemplateColumns: showLang && showCert ? '1fr 1fr' : '1fr', gap: '20px', marginBottom: '25px' }}>
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
      display: 'flex', flexDirection: 'column',
    }} className="resume-paper">

      {/* Header — centered per original .centered-header */}
      <header style={{ textAlign: 'center', marginBottom: '35px' }}>
        <h1 style={{
          fontSize: `${theme.headerFontSize}px`, fontWeight: 700, color: theme.primaryColor,
          textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px', lineHeight: 1.2,
        }}>{data.personalInfo.fullName}</h1>
        <div style={{ fontSize: '16px', color: '#6b7280', fontWeight: 500, marginBottom: '15px' }}>{data.personalInfo.title}</div>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '15px', fontSize: '10px', color: '#4b5563' }}>
          <span>{data.personalInfo.phone}</span>
          <span>{data.personalInfo.email}</span>
          <span>{data.personalInfo.location}</span>
          <span>{data.personalInfo.linkedin}</span>
          {vis('portfolio') && data.personalInfo.portfolioUrl && <span>{data.personalInfo.portfolioUrl}</span>}
          {vis('visaStatus') && data.personalInfo.visaStatus && <span>{data.personalInfo.visaStatus}</span>}
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

export default CleanProfessional;
