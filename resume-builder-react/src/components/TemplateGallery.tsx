import React, { useState } from 'react';
import { Check, Eye } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: 'modern' | 'classic' | 'creative';
  features: string[];
}

const TEMPLATES: Template[] = [
  {
    id: 'classic',
    name: 'Classic Minimal',
    description: 'Clean, traditional layout perfect for any industry',
    thumbnail: '/templates/classic.png',
    category: 'classic',
    features: ['ATS-friendly', 'Single column', 'Professional'],
  },
  {
    id: 'premium',
    name: 'Premium Headshot',
    description: 'Stand out with a professional photo and sidebar',
    thumbnail: '/templates/premium.png',
    category: 'modern',
    features: ['Photo header', 'Two column', 'Modern'],
  },
  {
    id: 'clean',
    name: 'Clean Layout',
    description: 'Balanced design with clear section separation',
    thumbnail: '/templates/clean.png',
    category: 'modern',
    features: ['Clean sections', 'Easy to scan', 'Versatile'],
  },
  {
    id: 'ats',
    name: 'ATS Executive',
    description: 'Optimized for applicant tracking systems',
    thumbnail: '/templates/ats.png',
    category: 'classic',
    features: ['ATS-optimized', 'Executive level', 'Traditional'],
  },
  {
    id: 'photo',
    name: 'Photo Header',
    description: 'Bold header with integrated photo',
    thumbnail: '/templates/photo.png',
    category: 'creative',
    features: ['Photo header', 'Bold design', 'Eye-catching'],
  },
  {
    id: 'clean_prof',
    name: 'Clean Professional',
    description: 'Refined and polished for senior roles',
    thumbnail: '/templates/clean_prof.png',
    category: 'classic',
    features: ['Professional', 'Refined', 'Senior-level'],
  },
  {
    id: 'elegant',
    name: 'Elegant Two Column',
    description: 'Sophisticated two-column layout',
    thumbnail: '/templates/elegant.png',
    category: 'modern',
    features: ['Two column', 'Elegant', 'Sophisticated'],
  },
  {
    id: 'bold',
    name: 'Bold Engineer',
    description: 'Technical roles with strong visual hierarchy',
    thumbnail: '/templates/bold.png',
    category: 'creative',
    features: ['Technical', 'Bold', 'Modern'],
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Perfect for research and academic positions',
    thumbnail: '/templates/academic.png',
    category: 'classic',
    features: ['Academic', 'Research-focused', 'Traditional'],
  },
];

interface TemplateGalleryProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
  onClose: () => void;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  selectedTemplate,
  onSelectTemplate,
  onClose,
}) => {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'modern' | 'classic' | 'creative'>('all');

  const filteredTemplates = filter === 'all'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === filter);

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <div>
            <h2 style={titleStyle}>Choose a Template</h2>
            <p style={subtitleStyle}>Select a template that matches your style and industry</p>
          </div>
          <button onClick={onClose} style={closeButtonStyle}>×</button>
        </div>

        {/* Filter Tabs */}
        <div style={filterContainerStyle}>
          {(['all', 'modern', 'classic', 'creative'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              style={{
                ...filterButtonStyle,
                ...(filter === category ? filterButtonActiveStyle : {}),
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div style={gridStyle}>
          {filteredTemplates.map((template) => {
            const isSelected = selectedTemplate === template.id;
            const isHovered = hoveredTemplate === template.id;

            return (
              <div
                key={template.id}
                style={{
                  ...cardStyle,
                  borderColor: isSelected ? '#6366f1' : isHovered ? '#d1d5db' : '#e5e7eb',
                  transform: isHovered ? 'translateY(-4px)' : 'none',
                  boxShadow: isHovered
                    ? '0 12px 24px rgba(0, 0, 0, 0.12)'
                    : '0 2px 8px rgba(0, 0, 0, 0.08)',
                }}
                onMouseEnter={() => setHoveredTemplate(template.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
                onClick={() => {
                  onSelectTemplate(template.id);
                  onClose();
                }}
              >
                {/* Thumbnail */}
                <div style={thumbnailContainerStyle}>
                  <div style={thumbnailPlaceholderStyle}>
                    <Eye size={32} color="#9ca3af" />
                    <span style={{ fontSize: '11px', color: '#6b7280', marginTop: '8px' }}>
                      Preview
                    </span>
                  </div>
                  {isSelected && (
                    <div style={selectedBadgeStyle}>
                      <Check size={14} />
                      Selected
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={cardContentStyle}>
                  <h3 style={cardTitleStyle}>{template.name}</h3>
                  <p style={cardDescriptionStyle}>{template.description}</p>

                  {/* Features */}
                  <div style={featuresStyle}>
                    {template.features.map((feature) => (
                      <span key={feature} style={featureBadgeStyle}>
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Styles
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  background: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  backdropFilter: 'blur(4px)',
};

const modalStyle: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: '16px',
  width: '100%',
  maxWidth: '1200px',
  maxHeight: '90vh',
  overflow: 'auto',
  boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '24px 28px',
  borderBottom: '1px solid #e5e7eb',
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '24px',
  fontWeight: 700,
  color: '#111827',
};

const subtitleStyle: React.CSSProperties = {
  margin: '4px 0 0 0',
  fontSize: '14px',
  color: '#6b7280',
};

const closeButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '32px',
  color: '#9ca3af',
  cursor: 'pointer',
  padding: '0',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '6px',
  transition: 'all 0.2s',
};

const filterContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  padding: '16px 28px',
  borderBottom: '1px solid #e5e7eb',
};

const filterButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  background: '#ffffff',
  color: '#6b7280',
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.2s',
};

const filterButtonActiveStyle: React.CSSProperties = {
  background: '#6366f1',
  color: '#ffffff',
  borderColor: '#6366f1',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '20px',
  padding: '28px',
};

const cardStyle: React.CSSProperties = {
  border: '2px solid #e5e7eb',
  borderRadius: '12px',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.2s',
  background: '#ffffff',
};

const thumbnailContainerStyle: React.CSSProperties = {
  position: 'relative',
  aspectRatio: '8.5 / 11',
  background: '#f9fafb',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderBottom: '1px solid #e5e7eb',
};

const thumbnailPlaceholderStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

const selectedBadgeStyle: React.CSSProperties = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  background: '#6366f1',
  color: '#ffffff',
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
};

const cardContentStyle: React.CSSProperties = {
  padding: '16px',
};

const cardTitleStyle: React.CSSProperties = {
  margin: '0 0 6px 0',
  fontSize: '16px',
  fontWeight: 600,
  color: '#111827',
};

const cardDescriptionStyle: React.CSSProperties = {
  margin: '0 0 12px 0',
  fontSize: '13px',
  color: '#6b7280',
  lineHeight: 1.5,
};

const featuresStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
};

const featureBadgeStyle: React.CSSProperties = {
  padding: '4px 8px',
  borderRadius: '4px',
  background: '#f3f4f6',
  color: '#4b5563',
  fontSize: '11px',
  fontWeight: 500,
};

export default TemplateGallery;
