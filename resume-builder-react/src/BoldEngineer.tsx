import React from 'react';
import { useResumeStore } from './store';
import { SectionKey } from './types';

/* BoldEngineer — faithfully matches Bold_Engineer.html
   Header: large 36px name, 18px title, contact-badge grid with black label badges
   Section headers: .sec-header — solid bg pill with border-radius: 4px, padding: 6px 15px
   Skills: TWO-COLUMN square-bulleted list (not tags!)
   Education: edu-header (school+dates) + edu-degree
*/
const BoldEngineer: React.FC = () => {
  const { data, theme, selectedTemplate, isSectionVisible, sectionOrder } = useResumeStore();
  const vis = (key: string) => isSectionVisible(selectedTemplate, key as SectionKey);

  // .sec-header — solid colored pill
  const secHeader = (title: string): React.ReactNode => (
    <div style={{
      background: theme.primaryColor, color: '#fff',
      fontSize: `${theme.sectionTitleSize}px`, fontWeight: 800,
      padding: '6px 15px', borderRadius: '4px', marginBottom: '15px',
      textTransform: 'uppercase', letterSpacing: '1px',
    }}>{title}</div>
  );

  const contactLabel: React.CSSProperties = {
    background: '#000', color: '#fff', padding: '2px 8px', borderRadius: '4px',
    fontWeight: 700, textTransform: 'uppercase', fontSize: '8px',
  };

  const sections: Record<string, () => React.ReactNode> = {
    summary: () => data.summary ? (
      <section key="summary" style={{ marginBottom: '25px' }}>
        <div style={{ fontSize: '11px', lineHeight: 1.5, marginBottom: '5px' }} dangerouslySetInnerHTML={{ __html: data.summary }} />
      </section>
    ) : null,

    experience: () => (
      <section key="experience" style={{ marginBottom: '25px' }}>
        {secHeader('Professional Experience')}
        {data.experience.map((item) => (
          <div key={item.id} style={{ marginBottom: '7px', fontSize: '11px', lineHeight: theme.lineHeight }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: theme.primaryColor }}>
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
      <section key="education" style={{ marginBottom: '25px' }}>
        {secHeader('Education')}
        {data.education.map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
            <span><strong style={{ fontWeight: 700, color: theme.primaryColor, fontSize: '11px' }}>{item.school}{item.location ? `, ${item.location}` : ''}</strong> — <span style={{ fontSize: '1em' }}>{item.degree}</span></span>
            <span style={{ color: theme.accentColor, fontStyle: 'italic', fontSize: '0.95em', whiteSpace: 'nowrap', marginLeft: '10px' }}>{item.dates}</span>
          </div>
        ))}
      </section>
    ),

    skills: () => (
      <section key="skills" style={{ marginBottom: '25px' }}>
        {secHeader('Key Skills')}
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
        {secHeader('Technical Skills')}
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
      <div key="lang-cert" style={{ display: 'grid', gridTemplateColumns: showLang && showCert ? '1fr 1fr' : '1fr', gap: '30px', marginBottom: '25px' }}>
        {showLang && (
          <section>
            {secHeader('Languages')}
            <div style={{ fontSize: '11px' }}>{data.languages.join(' · ')}</div>
          </section>
        )}
        {showCert && (
          <section>
            {secHeader('Certifications')}
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
      fontFamily: theme.fontFamily || "'Roboto', sans-serif", fontSize: `${theme.baseFontSize}px`, lineHeight: theme.lineHeight,
      color: theme.textColor, backgroundColor: theme.backgroundColor, padding: `${theme.pagePadding}px`,
      width: '210mm', minHeight: '297mm', boxShadow: '0 0 15px rgba(0,0,0,0.1)', margin: '0 auto',
      display: 'flex', flexDirection: 'column',
    }} className="resume-paper">

      {/* Top header: left name+title+contact, right headshot */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: `${theme.headerFontSize}px`, color: theme.primaryColor, fontWeight: 900, lineHeight: 1, marginBottom: '2px' }}>{data.personalInfo.fullName}</h1>
          <div style={{ fontSize: '18px', color: '#555', fontWeight: 500, marginBottom: '5px' }}>{data.personalInfo.title}</div>
          {/* Contact badge grid — matches .contact-row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto 1fr', gap: '4px 8px', alignItems: 'center' }}>
            <span style={contactLabel}>Phone</span><span style={{ fontSize: '10px' }}>{data.personalInfo.phone}</span>
            <span style={contactLabel}>Email</span><span style={{ fontSize: '10px' }}>{data.personalInfo.email}</span>
            <span style={contactLabel}>LinkedIn</span><span style={{ fontSize: '10px' }}>{data.personalInfo.linkedin}</span>
            <span style={contactLabel}>Location</span><span style={{ fontSize: '10px' }}>{data.personalInfo.location}</span>
          </div>
        </div>
        {vis('photo') && (
          <div style={{
            width: `${theme.headshotSize || 130}px`, height: `${theme.headshotSize || 130}px`,
            borderRadius: `${theme.headshotRadius || 4}px`, overflow: 'hidden', backgroundColor: '#eee', flexShrink: 0,
          }}>
            {data.personalInfo.photo ? (
              <img src={data.personalInfo.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>Photo</div>
            )}
          </div>
        )}
      </div>

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

export default BoldEngineer;
