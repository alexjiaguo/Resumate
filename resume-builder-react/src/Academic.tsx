import React from 'react';
import { useResumeStore } from './store';
import { SectionKey } from './types';

/* Academic — faithfully matches Academic.html
   Header: centered, letter-spacing: 1.5px, border-bottom: 2px solid
   Section titles: letter-spacing ~1.5px, italic info, serif feel
   Education: edu-header (school+dates) + edu-degree + coursework
*/
const Academic: React.FC = () => {
  const { data, theme, selectedTemplate, isSectionVisible, sectionOrder } = useResumeStore();
  const vis = (key: string) => isSectionVisible(selectedTemplate, key as SectionKey);

  const sectionTitle: React.CSSProperties = {
    fontSize: `${theme.sectionTitleSize || 11}px`, fontWeight: 700, color: theme.primaryColor,
    textTransform: 'uppercase', letterSpacing: '1.5px',
    borderBottom: `1px solid ${theme.accentColor}`, paddingBottom: '2px', marginBottom: '6px',
  };

  const sections: Record<string, () => React.ReactNode> = {
    summary: () => data.summary ? (
      <div key="summary" style={{
        fontSize: '11px', color: '#3a3a5c', lineHeight: 1.5,
        marginBottom: '12px', padding: '7px 10px',
        background: '#f5f6fa', borderLeft: `2.5px solid ${theme.primaryColor}`,
      }} dangerouslySetInnerHTML={{ __html: data.summary }} />
    ) : null,

    experience: () => (
      <section key="experience" style={{ marginBottom: '12px', position: 'relative' }}>
        <div style={sectionTitle}>Professional Experience</div>
        {data.experience.map((item) => (
          <div key={item.id} style={{ marginBottom: '7px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: `${theme.companyFontSize || 10.5}px`, fontWeight: 600, color: theme.primaryColor }}>
              <span>{item.title} — {item.company}{item.location ? `, ${item.location}` : ''}</span>
              <span style={{ color: theme.accentColor, fontWeight: 400, fontStyle: 'italic', fontSize: '0.95em' }}>{item.dates}</span>
            </div>
            <ul style={{ paddingLeft: '16px', marginTop: '2px', margin: 0 }}>
              {item.achievements.map((ach, idx) => (
                <li key={idx} style={{ marginBottom: '1px', lineHeight: theme.lineHeight }} dangerouslySetInnerHTML={{ __html: ach }} />
              ))}
            </ul>
          </div>
        ))}
      </section>
    ),

    education: () => (
      <section key="education" style={{ marginBottom: '12px', position: 'relative' }}>
        <div style={sectionTitle}>Education</div>
        {data.education.map((item) => (
          <div key={item.id} style={{ marginBottom: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontWeight: 700, color: theme.primaryColor, fontSize: `${theme.companyFontSize || 10.5}px` }}>
                {item.school}{item.location ? `, ${item.location}` : ''}
              </span>
              <span style={{ color: theme.accentColor, fontStyle: 'italic', fontSize: '0.95em' }}>{item.dates}</span>
            </div>
            <div style={{ fontSize: '1em', marginTop: '1px' }}>
              {item.degree}
              {item.gpa ? ` | GPA: ${item.gpa}` : ''}
            </div>
            {item.relevantCoursework && (
              <div style={{ fontSize: '0.92em', color: '#666', fontStyle: 'italic', marginTop: '1px' }}>
                Relevant Coursework: {item.relevantCoursework}
              </div>
            )}
          </div>
        ))}
      </section>
    ),

    skills: () => (
      <section key="skills" style={{ marginBottom: `${theme.sectionSpacing}px`, position: 'relative' }}>
        <div style={sectionTitle}>Key Skills</div>
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
      <section key="technicalSkills" style={{ marginBottom: `${theme.sectionSpacing}px`, position: 'relative' }}>
        <div style={sectionTitle}>Technical Skills</div>
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
      <div key="lang-cert" style={{ display: 'grid', gridTemplateColumns: showLang && showCert ? '1fr 1fr' : '1fr', gap: '20px', marginBottom: `${theme.sectionSpacing}px` }}>
        {showLang && (
          <section>
            <div style={sectionTitle}>Languages</div>
            <div style={{ fontSize: '11px' }}>{data.languages.join(' · ')}</div>
          </section>
        )}
        {showCert && (
          <section>
            <div style={sectionTitle}>Certifications</div>
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
      fontFamily: theme.fontFamily || "'EB Garamond', serif", fontSize: `${theme.baseFontSize}px`, lineHeight: theme.lineHeight,
      color: theme.textColor, backgroundColor: theme.backgroundColor, padding: `${theme.pagePadding}px`,
      width: '210mm', minHeight: '297mm', boxShadow: '0 0 15px rgba(0,0,0,0.1)', margin: '0 auto',
      position: 'relative'
    }} className="resume-paper">

      {/* Header — centered academic style */}
      <header style={{
        textAlign: 'center', marginBottom: '12px',
        paddingBottom: '10px', borderBottom: `2px solid ${theme.primaryColor}`,
      }}>
        <h1 style={{ fontSize: `${theme.headerFontSize}px`, fontWeight: 700, color: theme.primaryColor, letterSpacing: '1.5px', marginBottom: '2px', lineHeight: 1.2 }}>{data.personalInfo.fullName}</h1>
        <div style={{ fontSize: '0.95em', color: '#555', marginTop: '4px' }}>
          {[
            data.personalInfo.phone,
            data.personalInfo.email && <span key="email" style={{ color: theme.accentColor }}>{data.personalInfo.email}</span>,
            data.personalInfo.linkedin && <span key="linkedin" style={{ color: theme.accentColor }}>{data.personalInfo.linkedin}</span>,
            data.personalInfo.location
          ].filter(Boolean).map((item, index, arr) => (
             <React.Fragment key={index}>
               {item}
               {index < arr.length - 1 && ' · '}
             </React.Fragment>
          ))}
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

export default Academic;
