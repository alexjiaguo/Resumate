import React from 'react';
import { useResumeStore } from './store';
import { SectionKey } from './types';

/* PhotoHeader — faithfully matches Photo_Header.html
   Header: large photo left, name (uppercase, letter-spacing: 2px) right, accent bottom line
   Main: timeline-style jobs with border-left + dot, dates in pill badges
   Sidebar (right): Education, Skills, Languages in sidebar panel
   Profile/Summary relocated to sidebar per user request
*/
const PhotoHeader: React.FC = () => {
  const { data, theme, selectedTemplate, isSectionVisible, sectionOrder } = useResumeStore();
  const vis = (key: string) => isSectionVisible(selectedTemplate, key as SectionKey);

  // Main section title — matches .section-title with ::after line
  const sectionTitle = (title: string): React.ReactNode => (
    <div style={{
      display: 'flex', alignItems: 'center',
      fontSize: `${theme.sectionTitleSize}px`, fontWeight: 700, color: theme.primaryColor,
      textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px',
      borderBottom: `1.5px solid ${theme.accentColor}`, paddingBottom: '5px',
    }}>
      <span>{title}</span>
      <span style={{ flex: 1, height: '1.5px', background: '#eee', marginLeft: '10px' }} />
    </div>
  );

  const sidebarKeys = new Set<string>(['photo', 'summary', 'education', 'technicalSkills', 'skills', 'languages', 'certifications']);
  const mainKeys = new Set<string>(['experience']);

  // Sidebar sections
  const sidebarSections: Record<string, () => React.ReactNode> = {
    summary: () => data.summary ? (
      <section key="summary-side" style={{ marginBottom: `${theme.sectionSpacing}px`, position: 'relative' }}>
        {sectionTitle('About Me')}
        <div style={{ fontSize: '11px', lineHeight: 1.5, color: '#555' }} dangerouslySetInnerHTML={{ __html: data.summary }} />
      </section>
    ) : null,

    education: () => (
      <section key="edu-side" style={{ marginBottom: `${theme.sectionSpacing}px`, position: 'relative' }}>
        {sectionTitle('Education')}
        {data.education.map((item) => (
          <div key={item.id} style={{ marginBottom: '12px' }}>
            <div style={{ fontWeight: 700, color: theme.primaryColor, marginBottom: '2px', fontSize: '11px' }}>{item.degree}</div>
            <div style={{ color: '#555', fontSize: '11px' }}>{item.school}{item.location ? `, ${item.location}` : ''}</div>
            <div style={{ color: theme.accentColor, fontSize: '10px', fontWeight: 600 }}>{item.dates}</div>
          </div>
        ))}
      </section>
    ),

    skills: () => (
      <section key="skills-side" style={{ marginBottom: `${theme.sectionSpacing}px`, position: 'relative' }}>
        {sectionTitle('Key Skills')}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {data.skills.map((skill) => (
            <span key={skill.id} style={{
              padding: '2px 8px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer', transition: 'opacity 0.15s',
              background: skill.isHighlighted ? theme.primaryColor : '#f0f3f6',
              color: skill.isHighlighted ? '#fff' : '#2c3e50',
              fontWeight: skill.isHighlighted ? 600 : 400,
            }}>
              {skill.name}
            </span>
          ))}
        </div>
      </section>
    ),

    technicalSkills: () => (data.technicalSkills || []).length > 0 ? (
      <section key="techskills-side" style={{ marginBottom: `${theme.sectionSpacing}px`, position: 'relative' }}>
        {sectionTitle('Technical Skills')}
        {data.technicalSkills!.map((cat) => (
          <div key={cat.id} style={{ marginBottom: '4px', fontSize: '11px' }}>
            <strong style={{ color: theme.primaryColor }}>{cat.category}:</strong> {cat.skills}
          </div>
        ))}
      </section>
    ) : null,

    languages: () => data.languages.length > 0 ? (
      <section key="lang-side" style={{ marginBottom: `${theme.sectionSpacing}px`, position: 'relative' }}>
        {sectionTitle('Languages')}
        {data.languages.map((lang, idx) => (
          <div key={idx} style={{ fontSize: '11px', marginBottom: '3px' }}>{lang}</div>
        ))}
      </section>
    ) : null,

    certifications: () => data.certifications.length > 0 ? (
      <section key="certs-side" style={{ marginBottom: `${theme.sectionSpacing}px`, position: 'relative' }}>
        {sectionTitle('Training & Certifications')}
        {data.certifications.map((cert, idx) => (
          <div key={idx} style={{ marginBottom: '3px', fontSize: '11px' }}>{cert}</div>
        ))}
      </section>
    ) : null,
  };

  // Main column sections — timeline-style experience
  const mainSections: Record<string, () => React.ReactNode> = {
    experience: () => (
      <section key="experience" style={{ marginBottom: `${theme.sectionSpacing}px`, position: 'relative' }}>
        {sectionTitle('Professional Experience')}
        {data.experience.map((item) => (
          <div key={item.id} style={{
            paddingLeft: '20px', borderLeft: '2px solid #eee', position: 'relative',
            marginBottom: '15px',
          }}>
            {/* Timeline dot */}
            <div style={{
              position: 'absolute', left: '-6px', top: '0',
              width: '10px', height: '10px', background: theme.accentColor,
              borderRadius: '50%', border: '2px solid #fff',
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
              <span style={{ fontWeight: 700, color: theme.primaryColor, fontSize: '11px' }}>{item.title}</span>
              {/* Pill-badge dates */}
              <span style={{ fontSize: '10px', background: '#eee', color: '#666', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>{item.dates}</span>
            </div>
            <div style={{ fontStyle: 'italic', color: '#555', marginBottom: '6px', fontSize: `${theme.companyFontSize}px` }}>{item.company}{item.location ? `, ${item.location}` : ''}</div>
            <ul style={{ paddingLeft: '15px', marginTop: '5px', margin: 0 }}>
              {item.achievements.map((ach, idx) => (
                <li key={idx} style={{ marginBottom: '4px', fontSize: '11px', lineHeight: theme.lineHeight }} dangerouslySetInnerHTML={{ __html: ach }} />
              ))}
            </ul>
          </div>
        ))}
      </section>
    ),

  };

  return (
    <div style={{
      fontFamily: theme.fontFamily || "'Inter', sans-serif", fontSize: `${theme.baseFontSize}px`, lineHeight: theme.lineHeight,
      color: theme.textColor, backgroundColor: theme.backgroundColor,
      padding: `${theme.pagePadding}px`,
      width: '210mm', minHeight: '297mm', boxShadow: '0 0 15px rgba(0,0,0,0.1)', margin: '0 auto',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative'
    }} className="resume-paper">

      {/* ── HEADER ── photo left, name right */}
      <header style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '25px', background: '#f0f2f5', padding: '25px 30px', borderRadius: '4px' }}>
        {vis('photo') && (
          <div style={{
            width: `${theme.headshotSize || 140}px`, height: `${theme.headshotSize || 140}px`,
            borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '5px solid #fff',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            position: 'relative', backgroundColor: '#eee',
          }}>
            {data.personalInfo.photo ? (
              <img src={data.personalInfo.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>Photo</div>
            )}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: `${theme.headerFontSize}px`, color: theme.primaryColor, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '3px', lineHeight: 1.1 }}>{data.personalInfo.fullName}</h1>
          <div style={{ fontSize: '16px', color: theme.accentColor, fontWeight: 500, marginBottom: '6px' }}>{data.personalInfo.title}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 20px', fontSize: '10px', color: '#555', marginTop: '6px', alignItems: 'center' }}>
            {data.personalInfo.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color: theme.accentColor, fontWeight: 'bold', width: '14px', textAlign: 'center', flexShrink: 0, fontSize: '11px' }}>📞</span>{data.personalInfo.phone}</div>}
            {data.personalInfo.email && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color: theme.accentColor, fontWeight: 'bold', width: '14px', textAlign: 'center', flexShrink: 0, fontSize: '11px' }}>✉</span>{data.personalInfo.email}</div>}
            {data.personalInfo.location && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color: theme.accentColor, fontWeight: 'bold', width: '14px', textAlign: 'center', flexShrink: 0, fontSize: '11px' }}>📍</span>{data.personalInfo.location}</div>}
            {data.personalInfo.linkedin && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color: theme.accentColor, fontWeight: 'bold', width: '14px', textAlign: 'center', flexShrink: 0, fontSize: '11px' }}>🌐</span>{data.personalInfo.linkedin}</div>}
            {vis('portfolio') && data.personalInfo.portfolioUrl && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color: theme.accentColor, fontWeight: 'bold', width: '14px', textAlign: 'center', flexShrink: 0, fontSize: '11px' }}>💻</span>{data.personalInfo.portfolioUrl}</div>}
            {vis('visaStatus') && data.personalInfo.visaStatus && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color: theme.accentColor, fontWeight: 'bold', width: '14px', textAlign: 'center', flexShrink: 0, fontSize: '11px' }}>🛂</span>{data.personalInfo.visaStatus}</div>}
          </div>
        </div>
      </header>

      {/* ── BODY: sidebar + main ── */}
      <div style={{ display: 'flex', gap: `${theme.pagePadding}px`, flex: 1 }}>
        {/* Sidebar */}
        <aside style={{ width: '35%', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          {sectionOrder.map((key) => {
            if (!vis(key)) return null;
            if (!sidebarKeys.has(key) || key === 'photo') return null;
            return sidebarSections[key]?.() ?? null;
          })}
        </aside>

        {/* Main Column */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {sectionOrder.map((key) => {
            if (!vis(key)) return null;
            if (!mainKeys.has(key)) return null;
            return mainSections[key]?.() ?? null;
          })}
        </main>
      </div>
    </div>
  );
};

export default PhotoHeader;
