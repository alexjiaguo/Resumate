import React from 'react';
import { useResumeStore } from './store';
import { SectionKey } from './types';

/* ElegantTwoColumn — faithfully matches Elegant_TwoColumn.html
   Header: Playfair Display name, Montserrat subtitle (uppercase, 3px letter-spacing)
   Two-column body: left-col (flex: 1.3) Experience, right-col (flex: 1) other sections
   Timeline-style jobs with border-left + small dots
   Section titles: letter-spacing: 2px with ::after line
   Profile/Summary relocated to right column per user request
*/
const ElegantTwoColumn: React.FC = () => {
  const { data, theme, selectedTemplate, isSectionVisible, sectionOrder } = useResumeStore();
  const vis = (key: string) => isSectionVisible(selectedTemplate, key as SectionKey);

  // Section title with line decoration — matches .section-title::after
  const sectionTitle = (title: string): React.ReactNode => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      fontFamily: "'Montserrat', sans-serif",
      fontSize: `${theme.sectionTitleSize}px`, fontWeight: 700, color: theme.primaryColor,
      textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px',
    }}>
      <span>{title}</span>
      <span style={{ height: '1px', background: '#ecf0f1', flex: 1 }} />
    </div>
  );

  // Column assignment
  const leftKeys = new Set<string>(['experience']);
  const rightKeys = new Set<string>(['summary', 'education', 'skills', 'technicalSkills', 'languages', 'certifications']);

  // Right column section renderers
  const rightSections: Record<string, () => React.ReactNode> = {
    summary: () => data.summary ? (
      <section key="summary-right" style={{ marginBottom: '25px' }}>
        {sectionTitle('Profile')}
        <div style={{ fontSize: '11px', lineHeight: 1.5, color: '#555' }} dangerouslySetInnerHTML={{ __html: data.summary }} />
      </section>
    ) : null,

    education: () => (
      <section key="edu-right" style={{ marginBottom: '25px' }}>
        {sectionTitle('Education')}
        {data.education.map((item) => (
          <div key={item.id} style={{ marginBottom: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontWeight: 700, color: theme.primaryColor, fontSize: `${theme.companyFontSize}px` }}>{item.school}</span>
              <span style={{ color: theme.accentColor, fontStyle: 'italic', fontSize: '0.95em' }}>{item.dates}</span>
            </div>
            <div style={{ fontSize: '1em', marginTop: '1px' }}>{item.degree}{item.location ? `, ${item.location}` : ''}</div>
          </div>
        ))}
      </section>
    ),

    skills: () => (
      <section key="skills-right" style={{ marginBottom: '25px' }}>
        {sectionTitle('Skills')}
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
      <section key="techskills-right" style={{ marginBottom: '25px' }}>
        {sectionTitle('Technical Skills')}
        {data.technicalSkills!.map((cat) => (
          <div key={cat.id} style={{ marginBottom: '3px', fontSize: '11px' }}>
            <strong style={{ color: theme.primaryColor }}>{cat.category}:</strong> {cat.skills}
          </div>
        ))}
      </section>
    ) : null,

    languages: () => data.languages.length > 0 ? (
      <section key="lang-right" style={{ marginBottom: '25px' }}>
        {sectionTitle('Languages')}
        {data.languages.map((lang, idx) => (
          <div key={idx} style={{ fontSize: '11px', marginBottom: '3px' }}>{lang}</div>
        ))}
      </section>
    ) : null,

    certifications: () => data.certifications.length > 0 ? (
      <section key="certs-right" style={{ marginBottom: '25px' }}>
        {sectionTitle('Certifications')}
        {data.certifications.map((cert, idx) => (
          <div key={idx} style={{ marginBottom: '3px', fontSize: '11px' }}>{cert}</div>
        ))}
      </section>
    ) : null,
  };

  // Left column — Experience with timeline
  const leftSections: Record<string, () => React.ReactNode> = {
    experience: () => (
      <section key="experience" style={{ marginBottom: '25px' }}>
        {sectionTitle('Professional Experience')}
        {data.experience.map((item) => (
          <div key={item.id} style={{
            position: 'relative', paddingLeft: '20px', borderLeft: '1px solid #ecf0f1',
            marginBottom: '18px',
          }}>
            {/* Timeline dot */}
            <div style={{
              position: 'absolute', left: '-3.5px', top: '0',
              width: '6px', height: '6px', background: theme.accentColor,
              borderRadius: '50%',
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span style={{ fontWeight: 700, color: theme.primaryColor, fontSize: '1em' }}>{item.title}</span>
              <span style={{ color: theme.accentColor, fontWeight: 600, fontSize: '9px' }}>{item.dates}</span>
            </div>
            <span style={{ fontStyle: 'italic', color: '#7f8c8d', fontSize: `${theme.companyFontSize}px`, display: 'block', marginBottom: '6px' }}>{item.company}{item.location ? `, ${item.location}` : ''}</span>
            <ul style={{ paddingLeft: '15px', listStyleType: 'circle', margin: 0 }}>
              {item.achievements.map((ach, idx) => (
                <li key={idx} style={{ marginBottom: '5px', fontSize: '11px', lineHeight: theme.lineHeight }} dangerouslySetInnerHTML={{ __html: ach }} />
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
      color: theme.textColor, backgroundColor: theme.backgroundColor, padding: `${theme.pagePadding}px`,
      width: '210mm', minHeight: '297mm', boxShadow: '0 0 15px rgba(0,0,0,0.1)', margin: '0 auto',
      display: 'flex', flexDirection: 'column',
    }} className="resume-paper">

      {/* ── HEADER — elegant split: name left, contact right ── */}
      <header style={{
        display: 'flex', justifyContent: 'space-between',
        borderBottom: `2.5px solid ${theme.accentColor}`, paddingBottom: '25px', marginBottom: '35px',
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: `${theme.headerFontSize}px`, color: theme.primaryColor, letterSpacing: '1px', marginBottom: '5px', lineHeight: 1.1 }}>{data.personalInfo.fullName}</h1>
          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '16px', color: theme.accentColor, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '3px' }}>{data.personalInfo.title}</div>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '4px', fontSize: '10px', color: '#7f8c8d' }}>
          <div><span style={{ marginRight: '6px' }}>📞</span>{data.personalInfo.phone}</div>
          <div><span style={{ marginRight: '6px' }}>✉</span>{data.personalInfo.email}</div>
          {data.personalInfo.location && <div><span style={{ marginRight: '6px' }}>📍</span>{data.personalInfo.location}</div>}
          <div><span style={{ marginRight: '6px' }}>🔗</span>{data.personalInfo.linkedin}</div>
        </div>
      </header>

      {/* ── BODY: left-col (1.3fr) + right-col (1fr) ── */}
      <div style={{ display: 'flex', gap: '40px', flex: 1 }}>
        {/* Left Column — wider, Experience */}
        <div style={{ flex: 1.3, display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {sectionOrder.map((key) => {
            if (!vis(key)) return null;
            if (!leftKeys.has(key)) return null;
            return leftSections[key]?.() ?? null;
          })}
        </div>

        {/* Right Column — narrower, Profile/Education/Skills/etc */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {sectionOrder.map((key) => {
            if (!vis(key)) return null;
            if (!rightKeys.has(key)) return null;
            if (key === 'photo') return null;
            return rightSections[key]?.() ?? null;
          })}
        </div>
      </div>
    </div>
  );
};

export default ElegantTwoColumn;
