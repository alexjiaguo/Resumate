import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Eye } from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  thumbnail: string
  category: 'modern' | 'classic' | 'creative'
  features: string[]
}

const createThumbnailDataUri = (title: string, accent: string, layout: 'single' | 'split' | 'banner') => {
  const layoutMarkup =
    layout === 'split'
      ? '<rect x="12" y="14" width="108" height="120" rx="6" fill="#ffffff"/><rect x="132" y="14" width="76" height="120" rx="6" fill="#eef2ff"/><rect x="142" y="26" width="40" height="40" rx="20" fill="#c7d2fe"/><rect x="142" y="78" width="54" height="8" rx="4" fill="#94a3b8" opacity="0.4"/><rect x="142" y="92" width="44" height="8" rx="4" fill="#94a3b8" opacity="0.28"/>'
      : layout === 'banner'
        ? '<rect x="12" y="14" width="196" height="42" rx="6" fill="#e0e7ff"/><rect x="22" y="26" width="64" height="18" rx="4" fill="#ffffff"/><rect x="12" y="66" width="196" height="68" rx="6" fill="#ffffff"/><rect x="24" y="78" width="172" height="10" rx="5" fill="#cbd5e1" opacity="0.45"/><rect x="24" y="96" width="160" height="10" rx="5" fill="#cbd5e1" opacity="0.3"/>'
        : '<rect x="12" y="14" width="196" height="120" rx="6" fill="#ffffff"/><rect x="24" y="28" width="88" height="16" rx="4" fill="#e0e7ff"/><rect x="24" y="56" width="172" height="10" rx="5" fill="#cbd5e1" opacity="0.45"/><rect x="24" y="74" width="156" height="10" rx="5" fill="#cbd5e1" opacity="0.3"/><rect x="24" y="96" width="172" height="10" rx="5" fill="#cbd5e1" opacity="0.45"/>'

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 148" role="img" aria-label="${title} thumbnail"><rect width="220" height="148" rx="12" fill="#f8fafc"/><rect x="12" y="14" width="196" height="12" rx="6" fill="${accent}" opacity="0.9"/>${layoutMarkup}<text x="20" y="140" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="#334155">${title}</text></svg>`

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const TEMPLATES: Template[] = [
  {
    id: 'classic',
    name: 'Classic Minimal',
    description: 'Clean, traditional layout perfect for any industry',
    thumbnail: createThumbnailDataUri('Classic Minimal', '#475569', 'single'),
    category: 'classic',
    features: ['ATS-friendly', 'Single column', 'Professional'],
  },
  {
    id: 'premium',
    name: 'Premium Headshot',
    description: 'Stand out with a professional photo and sidebar',
    thumbnail: createThumbnailDataUri('Premium Headshot', '#7c3aed', 'split'),
    category: 'modern',
    features: ['Photo header', 'Two column', 'Modern'],
  },
  {
    id: 'clean',
    name: 'Clean Layout',
    description: 'Balanced design with clear section separation',
    thumbnail: createThumbnailDataUri('Clean Layout', '#2563eb', 'single'),
    category: 'modern',
    features: ['Clean sections', 'Easy to scan', 'Versatile'],
  },
  {
    id: 'ats',
    name: 'ATS Executive',
    description: 'Optimized for applicant tracking systems',
    thumbnail: createThumbnailDataUri('ATS Executive', '#0f766e', 'single'),
    category: 'classic',
    features: ['ATS-optimized', 'Executive level', 'Traditional'],
  },
  {
    id: 'photo',
    name: 'Photo Header',
    description: 'Bold header with integrated photo',
    thumbnail: createThumbnailDataUri('Photo Header', '#db2777', 'banner'),
    category: 'creative',
    features: ['Photo header', 'Bold design', 'Eye-catching'],
  },
  {
    id: 'clean_prof',
    name: 'Clean Professional',
    description: 'Refined and polished for senior roles',
    thumbnail: createThumbnailDataUri('Clean Professional', '#4f46e5', 'single'),
    category: 'classic',
    features: ['Professional', 'Refined', 'Senior-level'],
  },
  {
    id: 'elegant',
    name: 'Elegant Two Column',
    description: 'Sophisticated two-column layout',
    thumbnail: createThumbnailDataUri('Elegant Two Column', '#7c2d12', 'split'),
    category: 'modern',
    features: ['Two column', 'Elegant', 'Sophisticated'],
  },
  {
    id: 'bold',
    name: 'Bold Engineer',
    description: 'Technical roles with strong visual hierarchy',
    thumbnail: createThumbnailDataUri('Bold Engineer', '#111827', 'banner'),
    category: 'creative',
    features: ['Technical', 'Bold', 'Modern'],
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Perfect for research and academic positions',
    thumbnail: createThumbnailDataUri('Academic', '#1d4ed8', 'single'),
    category: 'classic',
    features: ['Academic', 'Research-focused', 'Traditional'],
  },
]

interface TemplateGalleryProps {
  selectedTemplate: string
  onSelectTemplate: (templateId: string) => void
  onClose: () => void
  returnFocusTo?: HTMLElement | null
}

const buildThumbnailAlt = (template: Template) => `${template.name} resume template thumbnail preview`

const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  selectedTemplate,
  onSelectTemplate,
  onClose,
  returnFocusTo,
}) => {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'modern' | 'classic' | 'creative'>('all')
  const [failedThumbnails, setFailedThumbnails] = useState<Record<string, boolean>>({})
  const modalRef = useRef<HTMLDivElement>(null)
  const titleId = useRef(`template-gallery-title-${Math.random().toString(36).slice(2, 9)}`)

  const filteredTemplates = useMemo(
    () =>
      filter === 'all'
        ? TEMPLATES
        : TEMPLATES.filter((template) => template.category === filter),
    [filter],
  )

  const handleThumbnailError = (templateId: string) => {
    setFailedThumbnails((current) => {
      if (current[templateId]) {
        return current
      }

      return {
        ...current,
        [templateId]: true,
      }
    })
  }

  const handleClose = () => {
    onClose()
    returnFocusTo?.focus()
  }

  useEffect(() => {
    modalRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        handleClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [returnFocusTo])

  return (
    <div style={overlayStyle} onClick={handleClose}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId.current}
        tabIndex={-1}
        style={modalStyle}
        onClick={(event) => event.stopPropagation()}
      >
        <div style={headerStyle}>
          <div>
            <h2 id={titleId.current} style={titleStyle}>Choose a Template</h2>
            <p style={subtitleStyle}>Select a template that matches your style and industry</p>
          </div>
          <button onClick={handleClose} style={closeButtonStyle} aria-label="Close template gallery">
            ×
          </button>
        </div>

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

        <div style={gridStyle}>
          {filteredTemplates.map((template) => {
            const isSelected = selectedTemplate === template.id
            const isHovered = hoveredTemplate === template.id
            const showFallback = failedThumbnails[template.id] === true

            return (
              <button
                key={template.id}
                type="button"
                className="template-gallery-card"
                aria-pressed={isSelected}
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
                onFocus={() => setHoveredTemplate(template.id)}
                onBlur={() => setHoveredTemplate(null)}
                onClick={() => {
                  onSelectTemplate(template.id)
                  handleClose()
                }}
              >
                <div style={thumbnailContainerStyle}>
                  {showFallback ? (
                    <div style={thumbnailPlaceholderStyle} aria-label={`${template.name} thumbnail unavailable`}>
                      <Eye size={32} color="#9ca3af" />
                      <span style={thumbnailFallbackTextStyle}>Preview unavailable</span>
                    </div>
                  ) : (
                    <img
                      src={template.thumbnail}
                      alt={buildThumbnailAlt(template)}
                      style={thumbnailImageStyle}
                      onError={() => handleThumbnailError(template.id)}
                    />
                  )}
                  {isSelected && (
                    <div style={selectedBadgeStyle}>
                      <Check size={14} />
                      Selected
                    </div>
                  )}
                </div>

                <div style={cardContentStyle}>
                  <h3 style={cardTitleStyle}>{template.name}</h3>
                  <p style={cardDescriptionStyle}>{template.description}</p>

                  <div style={featuresStyle}>
                    {template.features.map((feature) => (
                      <span key={feature} style={featureBadgeStyle}>
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

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
}

const modalStyle: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: '16px',
  width: '100%',
  maxWidth: '1200px',
  maxHeight: '90vh',
  overflow: 'auto',
  boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '24px 28px',
  borderBottom: '1px solid #e5e7eb',
}

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '24px',
  fontWeight: 700,
  color: '#111827',
}

const subtitleStyle: React.CSSProperties = {
  margin: '4px 0 0 0',
  fontSize: '14px',
  color: '#6b7280',
}

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
}

const filterContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  padding: '16px 28px',
  borderBottom: '1px solid #e5e7eb',
}

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
}

const filterButtonActiveStyle: React.CSSProperties = {
  background: '#6366f1',
  color: '#ffffff',
  borderColor: '#6366f1',
}

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '20px',
  padding: '28px',
}

const cardStyle: React.CSSProperties = {
  border: '2px solid #e5e7eb',
  borderRadius: '12px',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.2s',
  background: '#ffffff',
  padding: 0,
  width: '100%',
  textAlign: 'left',
}

const thumbnailContainerStyle: React.CSSProperties = {
  position: 'relative',
  aspectRatio: '8.5 / 11',
  background: '#f9fafb',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderBottom: '1px solid #e5e7eb',
}

const thumbnailImageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  display: 'block',
}

const thumbnailPlaceholderStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
}

const thumbnailFallbackTextStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#6b7280',
  marginTop: '8px',
}

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
}

const cardContentStyle: React.CSSProperties = {
  padding: '16px',
}

const cardTitleStyle: React.CSSProperties = {
  margin: '0 0 6px 0',
  fontSize: '16px',
  fontWeight: 600,
  color: '#111827',
}

const cardDescriptionStyle: React.CSSProperties = {
  margin: '0 0 12px 0',
  fontSize: '13px',
  color: '#6b7280',
  lineHeight: 1.5,
}

const featuresStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
}

const featureBadgeStyle: React.CSSProperties = {
  padding: '4px 8px',
  borderRadius: '4px',
  background: '#f3f4f6',
  color: '#4b5563',
  fontSize: '11px',
  fontWeight: 500,
}

export default TemplateGallery
