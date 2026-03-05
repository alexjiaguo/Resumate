import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { useResumeStore } from './store';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import TailoringHub from './components/TailoringHub';
import OnboardingScreen from './components/OnboardingScreen';
import { COLOR_SCHEMES } from './data/ColorSchemes';
import { SECTION_LABELS } from './types';

// Lazy load all templates
const ClassicMinimal = lazy(() => import('./ClassicMinimal'));
const PremiumHeadshot = lazy(() => import('./PremiumHeadshot'));
const CleanLayout = lazy(() => import('./CleanLayout'));
const ATSExecutive = lazy(() => import('./ATSExecutive'));
const PhotoHeader = lazy(() => import('./PhotoHeader'));
const CleanProfessional = lazy(() => import('./CleanProfessional'));
const ElegantTwoColumn = lazy(() => import('./ElegantTwoColumn'));
const BoldEngineer = lazy(() => import('./BoldEngineer'));
const Academic = lazy(() => import('./Academic'));
import { 
  Printer, RefreshCcw, Plus, Trash2, FileText, Code, X, 
  PanelLeftClose, PanelLeft, ZoomIn, ZoomOut, Maximize,
  User, Palette, Download, ChevronDown, Sun, Moon, Sparkles,
  Camera, ImageOff, ArrowUp, ArrowDown, Bold, Italic, Underline as UnderlineIcon, RemoveFormatting, RotateCcw,
  Eye, EyeOff, Upload, Loader2, Link, Globe
} from 'lucide-react';

/* ===== Color contrast utility ===== */
const hexToLuminance = (hex: string): number => {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  const toLinear = (v: number) => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
};

const contrastRatio = (hex1: string, hex2: string): number => {
  const l1 = hexToLuminance(hex1);
  const l2 = hexToLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

const ensureContrast = (textColor: string, bgColor: string): string => {
  if (contrastRatio(textColor, bgColor) >= 3.5) return textColor;
  // If bg is light, darken text; if bg is dark, lighten text
  const bgLum = hexToLuminance(bgColor);
  return bgLum > 0.5 ? '#1a1a2e' : '#f0f0f0';
};

type SidebarTab = 'content' | 'ai' | 'design' | 'export';

/* ===== Collapsible Section Component ===== */
const CollapsibleSection: React.FC<{
  title: string;
  defaultOpen?: boolean;
  action?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, defaultOpen = false, action, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="section-collapsible">
      <button 
        className={`section-collapsible-header ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {action && <span onClick={(e) => e.stopPropagation()}>{action}</span>}
          <ChevronDown size={14} />
        </div>
      </button>
      {isOpen && <div className="section-collapsible-body">{children}</div>}
    </div>
  );
};

/* ===== TipTap// ─── Summary Rich-Text Editor ────────────────────── */
const SummaryEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        bulletList: false,
        orderedList: false,
        horizontalRule: false,
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'tiptap-content summary-tiptap-content',
        'data-placeholder': 'Write a professional summary...',
      },
    },
    onUpdate: ({ editor: ed }: any) => {
      onChange(ed.getHTML());
    },
  });

  useEffect(() => {
    if (editor && !editor.isFocused) {
      const currentHtml = editor.getHTML();
      if (currentHtml !== value && value !== undefined) {
        editor.commands.setContent(value || '');
      }
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="achievement-item-rich summary-editor-rich">
      <div className="tiptap-toolbar">
        <button
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
          className={`tiptap-btn ${editor.isActive('bold') ? 'active' : ''}`}
          title="Bold"
        ><Bold size={12} /></button>
        <button
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
          className={`tiptap-btn ${editor.isActive('italic') ? 'active' : ''}`}
          title="Italic"
        ><Italic size={12} /></button>
        <button
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run(); }}
          className={`tiptap-btn ${editor.isActive('underline') ? 'active' : ''}`}
          title="Underline"
        ><UnderlineIcon size={12} /></button>
        <span style={{ width: '1px', height: '14px', background: 'var(--color-border)', margin: '0 2px' }} />
        <label title="Text Color" style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer', fontSize: '11px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>
          A
          <input
            type="color"
            value={editor.getAttributes('textStyle').color || '#000000'}
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            style={{ width: '16px', height: '16px', padding: 0, border: 'none', cursor: 'pointer', background: 'none' }}
            title="Text Color"
          />
        </label>
        <label title="Background Color" style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer', fontSize: '11px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>
          BG
          <input
            type="color"
            value={editor.getAttributes('highlight').color || '#FFFF00'}
            onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
            style={{ width: '16px', height: '16px', padding: 0, border: 'none', cursor: 'pointer', background: 'none' }}
            title="Background Color"
          />
        </label>
        <span style={{ width: '1px', height: '14px', background: 'var(--color-border)', margin: '0 2px' }} />
        <button
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetAllMarks().run(); }}
          className="tiptap-btn"
          title="Clear Formatting"
        ><RemoveFormatting size={12} /></button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

/* ===== TipTap Achievement Editor ===== */
const AchievementEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onEnter: () => void;
  onDelete: () => void;
  placeholder?: string;
}> = ({ value, onChange, onEnter, onDelete, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        bulletList: false,
        orderedList: false,
        horizontalRule: false,
        hardBreak: { keepMarks: true },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'tiptap-content',
        'data-placeholder': placeholder || 'Describe an achievement...',
      },
      handleKeyDown: (_view: any, event: any) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          onEnter();
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor: ed }: any) => {
      const html = ed.getHTML();
      // Convert TipTap's paragraph wrapping to clean inline content
      const cleaned = html.replace(/^<p>/, '').replace(/<\/p>$/, '');
      onChange(cleaned === '<br>' ? '' : cleaned);
    },
  });

  // Sync external value changes (e.g., from AI tailoring)
  useEffect(() => {
    if (editor && !editor.isFocused) {
      const currentHtml = editor.getHTML().replace(/^<p>/, '').replace(/<\/p>$/, '');
      if (currentHtml !== value && value !== undefined) {
        editor.commands.setContent(value || '');
      }
    }
  }, [value, editor]);

  if (!editor) return null;


  return (
    <div className="achievement-item-rich">
      <div className="tiptap-toolbar">
        <button
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
          className={`tiptap-btn ${editor.isActive('bold') ? 'active' : ''}`}
          title="Bold"
        ><Bold size={12} /></button>
        <button
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
          className={`tiptap-btn ${editor.isActive('italic') ? 'active' : ''}`}
          title="Italic"
        ><Italic size={12} /></button>
        <button
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run(); }}
          className={`tiptap-btn ${editor.isActive('underline') ? 'active' : ''}`}
          title="Underline"
        ><UnderlineIcon size={12} /></button>
        <span style={{ width: '1px', height: '14px', background: 'var(--color-border)', margin: '0 2px' }} />
        <label title="Text Color" style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer', fontSize: '11px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>
          A
          <input
            type="color"
            value={editor.getAttributes('textStyle').color || '#000000'}
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            style={{ width: '14px', height: '14px', padding: 0, border: 'none', cursor: 'pointer', background: 'none' }}
            title="Text Color"
          />
        </label>
        <label title="Background" style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer', fontSize: '11px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>
          BG
          <input
            type="color"
            value={editor.getAttributes('highlight').color || '#FFFF00'}
            onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
            style={{ width: '14px', height: '14px', padding: 0, border: 'none', cursor: 'pointer', background: 'none' }}
            title="Background Color"
          />
        </label>
        <span style={{ width: '1px', height: '14px', background: 'var(--color-border)', margin: '0 2px' }} />
        <button
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetAllMarks().run(); }}
          className="tiptap-btn"
          title="Clear Formatting"
        ><RemoveFormatting size={12} /></button>
      </div>
      <EditorContent editor={editor} className="tiptap-editor" />
      <button 
        onClick={onDelete}
        className="btn-inline-delete"
        title="Remove achievement"
        style={{ position: 'absolute', top: '4px', right: '4px' }}
      >
        <X size={12} />
      </button>
    </div>
  );
};

const App: React.FC = () => {
  const { 
    data, 
    theme, 
    selectedTemplate, 
    apiSettings,
    hasCompletedOnboarding,
    updateData, 
    updateTheme, 
    setTemplate, 
    updateApiSettings,
    sidebarWidth,
    setSidebarWidth,
    sectionOrder,
    moveSectionOrder,
    toggleSectionVisibility,
    isSectionVisible,
    setUploadedResumeText,
    reset 
  } = useResumeStore();

  const [showTailoringHub, setShowTailoringHub] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeTab, setActiveTab] = useState<SidebarTab>('ai');
  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);
  const [activeColorScheme, setActiveColorScheme] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const resumeFileInputRef = useRef<HTMLInputElement>(null);
  const [isResumeUploading, setIsResumeUploading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('resume-builder-dark-mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('resume-builder-dark-mode', String(darkMode));
  }, [darkMode]);

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'summary') {
      updateData({ summary: value });
    } else {
      updateData({
        personalInfo: {
          ...data.personalInfo,
          [name]: value,
        }
      });
    }
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' || type === 'range' ? parseFloat(value) : value;
    updateTheme({ [name]: val });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      updateData({ personalInfo: { ...data.personalInfo, photo: dataUrl } });
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    updateData({ personalInfo: { ...data.personalInfo, photo: undefined } });
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const applyColorScheme = (schemeId: string) => {
    const scheme = COLOR_SCHEMES.find(s => s.id === schemeId);
    if (!scheme) return;
    setActiveColorScheme(schemeId);
    const bg = '#ffffff'; // Always force white background
    const safeTextColor = ensureContrast(scheme.colors.textColor, bg);
    updateTheme({
      primaryColor: scheme.colors.primaryColor,
      accentColor: scheme.colors.accentColor,
      backgroundColor: bg,
      textColor: safeTextColor,
      ...(scheme.colors.sidebarBg && { sidebarBg: scheme.colors.sidebarBg }),
      ...(scheme.colors.sidebarAccent && { sidebarAccent: scheme.colors.sidebarAccent }),
    });
  };

  const handleColorHexChange = (name: string, hex: string) => {
    if (/^#[0-9A-Fa-f]{0,6}$/.test(hex)) {
      setActiveColorScheme(null);
      updateTheme({ [name]: hex });
    }
  };

  // Experience Handlers
  const addExperience = () => {
    const newItem = {
      id: Date.now().toString(),
      company: 'New Company',
      location: 'Location',
      title: 'Job Title',
      dates: 'Date - Present',
      achievements: ['Achievement 1']
    };
    updateData({ experience: [...data.experience, newItem] });
  };

  const updateExp = (id: string, field: string, value: any) => {
    const updated = data.experience.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    updateData({ experience: updated });
  };

  const removeExp = (id: string) => {
    updateData({ experience: data.experience.filter(i => i.id !== id) });
  };

  const moveExp = (id: string, direction: -1 | 1) => {
    const arr = [...data.experience];
    const idx = arr.findIndex(e => e.id === id);
    const target = idx + direction;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    updateData({ experience: arr });
  };

  // Achievement Handlers
  const updateAchievement = (expId: string, achIndex: number, value: string) => {
    const updated = data.experience.map(item => {
      if (item.id !== expId) return item;
      const newAchievements = [...item.achievements];
      newAchievements[achIndex] = value;
      return { ...item, achievements: newAchievements };
    });
    updateData({ experience: updated });
  };

  const addAchievement = (expId: string) => {
    const updated = data.experience.map(item => {
      if (item.id !== expId) return item;
      return { ...item, achievements: [...item.achievements, ''] };
    });
    updateData({ experience: updated });
  };

  const removeAchievement = (expId: string, achIndex: number) => {
    const updated = data.experience.map(item => {
      if (item.id !== expId) return item;
      return { ...item, achievements: item.achievements.filter((_, i) => i !== achIndex) };
    });
    updateData({ experience: updated });
  };

  // Education Handlers
  const addEdu = () => {
    const newItem = {
      id: Date.now().toString(),
      school: 'University Name',
      degree: 'Degree',
      dates: '20XX - 20XX',
      location: 'City, State'
    };
    updateData({ education: [...data.education, newItem] });
  };

  const updateEdu = (id: string, field: string, value: string) => {
    const updated = data.education.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    updateData({ education: updated });
  };

  const removeEdu = (id: string) => {
    updateData({ education: data.education.filter(i => i.id !== id) });
  };

  const moveEdu = (id: string, direction: -1 | 1) => {
    const arr = [...data.education];
    const idx = arr.findIndex(e => e.id === id);
    const target = idx + direction;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    updateData({ education: arr });
  };

  // Skills Handlers
  const toggleSkillHighlight = (id: string) => {
    const updated = data.skills.map(s => 
      s.id === id ? { ...s, isHighlighted: !s.isHighlighted } : s
    );
    updateData({ skills: updated });
  };

  const removeSkill = (id: string) => {
    updateData({ skills: data.skills.filter(s => s.id !== id) });
  };

  const addSkill = () => {
    const newItem = { id: Date.now().toString(), name: 'New Skill', isHighlighted: false };
    updateData({ skills: [...data.skills, newItem] });
  };

  const updateSkillName = (id: string, name: string) => {
    const updated = data.skills.map(s => s.id === id ? { ...s, name } : s);
    updateData({ skills: updated });
  };

  const moveSkill = (id: string, direction: -1 | 1) => {
    const idx = data.skills.findIndex(s => s.id === id);
    if (idx < 0) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= data.skills.length) return;
    const updated = [...data.skills];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    updateData({ skills: updated });
  };

  const moveAchievement = (expId: string, achIndex: number, direction: -1 | 1) => {
    const exp = data.experience.find(e => e.id === expId);
    if (!exp) return;
    const newIdx = achIndex + direction;
    if (newIdx < 0 || newIdx >= exp.achievements.length) return;
    const updated = [...exp.achievements];
    [updated[achIndex], updated[newIdx]] = [updated[newIdx], updated[achIndex]];
    updateExp(expId, 'achievements', updated);
  };

  // Technical Skills Handlers
  const addTechnicalCategory = () => {
    const cats = data.technicalSkills || [];
    updateData({ technicalSkills: [...cats, { id: Date.now().toString(), category: 'Category', skills: '' }] });
  };

  const updateTechnicalCategory = (id: string, field: 'category' | 'skills', value: string) => {
    const cats = (data.technicalSkills || []).map(c => c.id === id ? { ...c, [field]: value } : c);
    updateData({ technicalSkills: cats });
  };

  const removeTechnicalCategory = (id: string) => {
    updateData({ technicalSkills: (data.technicalSkills || []).filter(c => c.id !== id) });
  };

  // Generic Array Handlers
  const addArrayItem = (key: 'languages' | 'certifications') => {
    updateData({ [key]: [...data[key], 'New Item'] });
  };

  const updateArrayItem = (key: 'languages' | 'certifications', index: number, value: string) => {
    const updated = [...data[key]];
    updated[index] = value;
    updateData({ [key]: updated });
  };

  const removeArrayItem = (key: 'languages' | 'certifications', index: number) => {
    updateData({ [key]: data[key].filter((_, i) => i !== index) });
  };

  // Zoom Handlers
  const zoomIn = () => setZoomLevel(z => Math.min(z + 10, 150));
  const zoomOut = () => setZoomLevel(z => Math.max(z - 10, 50));
  const zoomFit = () => setZoomLevel(100);

  const renderTemplate = () => {
    const TemplateComponent = (() => {
      switch (selectedTemplate) {
        case 'premium': return PremiumHeadshot;
        case 'clean': return CleanLayout;
        case 'ats': return ATSExecutive;
        case 'photo': return PhotoHeader;
        case 'clean_prof': return CleanProfessional;
        case 'elegant': return ElegantTwoColumn;
        case 'bold': return BoldEngineer;
        case 'academic': return Academic;
        default: return ClassicMinimal;
      }
    })();

    return (
      <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading template...</div>}>
        <TemplateComponent />
      </Suspense>
    );
  };

  /* ===== Tab Content: CONTENT ===== */
  const handleResumeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsResumeUploading(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      // Dynamically import parser services only when needed
      const { FileParserService: FPS } = await import('./services/FileParserService');
      const { ResumeParserService: RPS } = await import('./services/ResumeParserService');
      const rawText = await FPS.parseFile(file);
      const resumeData = RPS.parse(rawText, ext);
      setUploadedResumeText(rawText);
      updateData(resumeData);
    } catch (err) {
      alert(`Could not parse "${file.name}": ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsResumeUploading(false);
      if (resumeFileInputRef.current) resumeFileInputRef.current.value = '';
    }
  };

  const renderContentTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {/* Resume File Upload */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px',
        background: 'var(--bg-secondary, #f3f4f6)', borderRadius: '8px', border: '1px dashed var(--border-color, #d1d5db)',
        marginBottom: '4px'
      }}>
        <input ref={resumeFileInputRef} type="file" accept=".pdf,.docx,.doc,.txt,.md" onChange={handleResumeFileUpload} style={{ display: 'none' }} />
        <button
          onClick={() => resumeFileInputRef.current?.click()}
          disabled={isResumeUploading}
          className="btn-outline-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0, fontWeight: 600 }}
        >
          {isResumeUploading ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={13} />}
          {isResumeUploading ? 'Importing...' : 'Import Resume'}
        </button>
        <span style={{ fontSize: '11px', opacity: 0.55, lineHeight: 1.3 }}>PDF, DOCX, or MD — auto-fills all fields</span>
      </div>
      <CollapsibleSection title="Personal Info" defaultOpen={true}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label className="form-label">Full Name
            <input className="input-field" name="fullName" value={data.personalInfo.fullName} onChange={handlePersonalChange} />
          </label>
          <label className="form-label">Job Title
            <input className="input-field" name="title" value={data.personalInfo.title} onChange={handlePersonalChange} />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <label className="form-label">Email
              <input className="input-field" name="email" value={data.personalInfo.email} onChange={handlePersonalChange} />
            </label>
            <label className="form-label">Phone
              <input className="input-field" name="phone" value={data.personalInfo.phone} onChange={handlePersonalChange} />
            </label>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <label className="form-label">Location
              <input className="input-field" name="location" value={data.personalInfo.location} onChange={handlePersonalChange} />
            </label>
            <label className="form-label">LinkedIn
              <input className="input-field" name="linkedin" value={data.personalInfo.linkedin} onChange={handlePersonalChange} />
            </label>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                <Link size={11} style={{ opacity: 0.5 }} />
                <input className="input-field" name="portfolioLabel" value={data.personalInfo.portfolioLabel || ''} onChange={handlePersonalChange} placeholder="Portfolio / Blog" style={{ fontWeight: 600, fontSize: '11px', padding: '2px 4px', border: '1px dashed var(--border-color, #d1d5db)', background: 'transparent' }} />
              </div>
              <input className="input-field" name="portfolioUrl" value={data.personalInfo.portfolioUrl || ''} onChange={handlePersonalChange} placeholder="github.com/user (optional)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                <Globe size={11} style={{ opacity: 0.5 }} />
                <input className="input-field" name="visaLabel" value={data.personalInfo.visaLabel || ''} onChange={handlePersonalChange} placeholder="Visa Status" style={{ fontWeight: 600, fontSize: '11px', padding: '2px 4px', border: '1px dashed var(--border-color, #d1d5db)', background: 'transparent' }} />
              </div>
              <input className="input-field" name="visaStatus" value={data.personalInfo.visaStatus || ''} onChange={handlePersonalChange} placeholder="e.g. US Citizen (optional)" />
            </div>
          </div>
          <label className="form-label">Summary</label>
          <SummaryEditor value={data.summary} onChange={(val) => updateData({ summary: val })} />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Headshot Photo" defaultOpen={!!data.personalInfo.photo}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: `${theme.headshotSize || 80}px`, height: `${theme.headshotSize || 80}px`, borderRadius: '50%', overflow: 'hidden',
            border: '3px solid var(--border-color, #e2e8f0)', backgroundColor: 'var(--bg-secondary, #f3f4f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            {data.personalInfo.photo ? (
              <img src={data.personalInfo.photo} alt="Headshot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Camera size={28} style={{ opacity: 0.3 }} />
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
            <button onClick={() => photoInputRef.current?.click()} className="btn-outline-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Camera size={12} /> {data.personalInfo.photo ? 'Change' : 'Upload'}
            </button>
            {data.personalInfo.photo && (
              <button onClick={removePhoto} className="btn-outline-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#dc2626' }}>
                <ImageOff size={12} /> Remove
              </button>
            )}
          </div>
          <label className="form-label" style={{ width: '100%', fontSize: '10px' }}>
            Size ({theme.headshotSize || 80}px)
            <input type="range" min="40" max="200" step="5" value={theme.headshotSize || 80} onChange={(e) => updateTheme({ headshotSize: Number(e.target.value) })} style={{ width: '100%' }} />
          </label>
          <p style={{ fontSize: '11px', opacity: 0.5, textAlign: 'center' }}>Used by Photo Header, Premium Headshot, Bold Engineer templates</p>
        </div>
      </CollapsibleSection>

      <CollapsibleSection 
        title="Experience" 
        defaultOpen={true}
        action={<button onClick={addExperience} className="btn-outline-sm"><Plus size={12} /> Add</button>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data.experience.map((exp, expIdx) => (
            <div key={exp.id} className="item-editor-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', gap: '4px' }}>
                <input className="input-field" style={{ fontWeight: 'bold', flex: 1 }} value={exp.company} onChange={(e) => updateExp(exp.id, 'company', e.target.value)} placeholder="Company" />
                <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                  <button onClick={() => moveExp(exp.id, -1)} className="btn-reorder" title="Move Up" disabled={expIdx === 0}><ArrowUp size={12} /></button>
                  <button onClick={() => moveExp(exp.id, 1)} className="btn-reorder" title="Move Down" disabled={expIdx === data.experience.length - 1}><ArrowDown size={12} /></button>
                  <button onClick={() => removeExp(exp.id)} className="btn-delete-sm"><Trash2 size={12} /></button>
                </div>
              </div>
              <input className="input-field" style={{ marginBottom: '5px' }} value={exp.title} onChange={(e) => updateExp(exp.id, 'title', e.target.value)} placeholder="Title" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginBottom: '8px' }}>
                <input className="input-field" value={exp.dates} onChange={(e) => updateExp(exp.id, 'dates', e.target.value)} placeholder="Dates" />
                <input className="input-field" value={exp.location} onChange={(e) => updateExp(exp.id, 'location', e.target.value)} placeholder="Location" />
              </div>
              <div className="achievement-section">
                <div className="achievement-section-header">
                  <span>Achievements</span>
                  <span className="achievement-hint">Select text to format · ↑↓ to reorder</span>
                </div>
                {exp.achievements.map((ach, achIdx) => (
                  <div key={`${exp.id}-${achIdx}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '2px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', flexShrink: 0, paddingTop: '8px' }}>
                      <button onClick={() => moveAchievement(exp.id, achIdx, -1)} className="btn-reorder" title="Move Up" disabled={achIdx === 0} style={{ padding: '0 2px', height: '12px' }}><ArrowUp size={8} /></button>
                      <button onClick={() => moveAchievement(exp.id, achIdx, 1)} className="btn-reorder" title="Move Down" disabled={achIdx === exp.achievements.length - 1} style={{ padding: '0 2px', height: '12px' }}><ArrowDown size={8} /></button>
                    </div>
                    <div style={{ flex: 1 }}>
                      <AchievementEditor
                        value={ach}
                        onChange={(val) => updateAchievement(exp.id, achIdx, val)}
                        onEnter={() => addAchievement(exp.id)}
                        onDelete={() => {
                          if (exp.achievements.length > 1) {
                            removeAchievement(exp.id, achIdx);
                          }
                        }}
                        placeholder="Led a team of X to achieve Y, resulting in Z% improvement..."
                      />
                    </div>
                  </div>
                ))}
                <button onClick={() => addAchievement(exp.id)} className="achievement-add-btn">
                  <Plus size={12} /> Add achievement
                </button>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection 
        title="Education"
        action={<button onClick={addEdu} className="btn-outline-sm"><Plus size={12} /> Add</button>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data.education.map((edu, eduIdx) => (
            <div key={edu.id} className="item-editor-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', gap: '4px' }}>
                <input className="input-field" style={{ fontWeight: 'bold', flex: 1 }} value={edu.school} onChange={(e) => updateEdu(edu.id, 'school', e.target.value)} placeholder="School" />
                <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                  <button onClick={() => moveEdu(edu.id, -1)} className="btn-reorder" title="Move Up" disabled={eduIdx === 0}><ArrowUp size={12} /></button>
                  <button onClick={() => moveEdu(edu.id, 1)} className="btn-reorder" title="Move Down" disabled={eduIdx === data.education.length - 1}><ArrowDown size={12} /></button>
                  <button onClick={() => removeEdu(edu.id)} className="btn-delete-sm"><Trash2 size={12} /></button>
                </div>
              </div>
              <input className="input-field" style={{ marginBottom: '5px' }} value={edu.degree} onChange={(e) => updateEdu(edu.id, 'degree', e.target.value)} placeholder="Degree" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                <input className="input-field" value={edu.dates} onChange={(e) => updateEdu(edu.id, 'dates', e.target.value)} placeholder="Dates" />
                <input className="input-field" value={edu.location || ''} onChange={(e) => updateEdu(edu.id, 'location', e.target.value)} placeholder="Location" />
              </div>
              {selectedTemplate === 'academic' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '5px', marginTop: '5px' }}>
                  <input className="input-field" value={edu.gpa || ''} onChange={(e) => updateEdu(edu.id, 'gpa', e.target.value)} placeholder="GPA (e.g. 3.20 / 4.0)" />
                  <textarea className="input-field" value={edu.relevantCoursework || ''} onChange={(e) => updateEdu(edu.id, 'relevantCoursework', e.target.value)} placeholder="Relevant Coursework" style={{ resize: 'vertical', minHeight: '40px' }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection 
        title="Skills"
        action={<button onClick={addSkill} className="btn-outline-sm"><Plus size={12} /> Add</button>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {data.skills.map((skill, idx) => (
            <div key={skill.id} className="skill-chip" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', flexShrink: 0 }}>
                <button onClick={() => moveSkill(skill.id, -1)} className="btn-reorder" title="Move Up" disabled={idx === 0} style={{ padding: '0 2px', height: '12px' }}><ArrowUp size={8} /></button>
                <button onClick={() => moveSkill(skill.id, 1)} className="btn-reorder" title="Move Down" disabled={idx === data.skills.length - 1} style={{ padding: '0 2px', height: '12px' }}><ArrowDown size={8} /></button>
              </div>
              <input 
                className="skill-chip-input"
                value={skill.name} 
                onChange={(e) => updateSkillName(skill.id, e.target.value)} 
                style={{ width: `${Math.max(60, skill.name.length * 7.5)}px` }}
              />
              <input 
                type="checkbox" 
                checked={skill.isHighlighted} 
                onChange={() => toggleSkillHighlight(skill.id)} 
                title="Highlight"
                style={{ cursor: 'pointer' }}
              />
              <button onClick={() => removeSkill(skill.id)} className="btn-inline-delete">
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection 
        title="Technical Skills"
        action={<button onClick={addTechnicalCategory} className="btn-outline-sm"><Plus size={12} /> Add</button>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(data.technicalSkills || []).map((cat) => (
            <div key={cat.id} className="item-editor-card" style={{ padding: '8px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '4px', alignItems: 'center' }}>
                <input className="input-field" style={{ fontWeight: 'bold', fontSize: '11px', flex: '0 0 120px' }} value={cat.category} onChange={(e) => updateTechnicalCategory(cat.id, 'category', e.target.value)} placeholder="Category" />
                <button onClick={() => removeTechnicalCategory(cat.id)} className="btn-delete-sm"><Trash2 size={10} /></button>
              </div>
              <input className="input-field" style={{ fontSize: '11px' }} value={cat.skills} onChange={(e) => updateTechnicalCategory(cat.id, 'skills', e.target.value)} placeholder="Comma-separated: Python, Java, Go" />
            </div>
          ))}
          <p style={{ fontSize: '10px', opacity: 0.5 }}>Format: Category → comma-separated skills</p>
        </div>
      </CollapsibleSection>

      <CollapsibleSection 
        title="Languages"
        action={<button onClick={() => addArrayItem('languages')} className="btn-outline-sm"><Plus size={10} /></button>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {data.languages.map((lang, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '4px' }}>
              <input className="input-field" style={{ padding: '4px 8px', fontSize: '12px' }} value={lang} onChange={(e) => updateArrayItem('languages', idx, e.target.value)} />
              <button onClick={() => removeArrayItem('languages', idx)} className="btn-delete-sm"><Trash2 size={10} /></button>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection 
        title="Certifications"
        action={<button onClick={() => addArrayItem('certifications')} className="btn-outline-sm"><Plus size={10} /></button>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {data.certifications.map((cert, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '4px' }}>
              <input className="input-field" style={{ padding: '4px 8px', fontSize: '12px' }} value={cert} onChange={(e) => updateArrayItem('certifications', idx, e.target.value)} />
              <button onClick={() => removeArrayItem('certifications', idx)} className="btn-delete-sm"><Trash2 size={10} /></button>
            </div>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );
  /* ===== Tab Content: AI ===== */
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [connectionError, setConnectionError] = useState('');

  const getBaseUrl = () => {
    if (apiSettings.selectedProvider === 'openai') return apiSettings.openaiBaseUrl || 'https://api.openai.com/v1';
    if (apiSettings.selectedProvider === 'gemini') return apiSettings.geminiBaseUrl || 'https://generativelanguage.googleapis.com/v1beta/openai';
    return apiSettings.customBaseUrl;
  };

  const getApiKey = () => {
    if (apiSettings.selectedProvider === 'openai') return apiSettings.openaiKey;
    if (apiSettings.selectedProvider === 'gemini') return apiSettings.geminiKey;
    return apiSettings.deepseekKey;
  };

  const testConnection = async () => {
    setConnectionStatus('testing');
    setConnectionError('');
    const baseUrl = getBaseUrl();
    const apiKey = getApiKey();
    if (!apiKey) {
      setConnectionStatus('error');
      setConnectionError('API key is empty');
      return;
    }
    try {
      const res = await fetch(`${baseUrl}/models`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${apiKey}` },
      });
      if (res.ok) {
        setConnectionStatus('success');
      } else {
        const err = await res.json().catch(() => ({}));
        setConnectionStatus('error');
        setConnectionError(err.error?.message || `HTTP ${res.status}`);
      }
    } catch (e) {
      setConnectionStatus('error');
      setConnectionError(e instanceof Error ? e.message : 'Network error');
    }
  };

  const renderAITab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <CollapsibleSection title="AI Tailoring Hub" defaultOpen={true}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
            Paste a job description and let AI tailor your resume content — optimizing bullet points, keywords, and summary for each role.
          </p>
          <button onClick={() => setShowTailoringHub(true)} className="btn-ai" style={{ width: '100%' }}>
            <Sparkles size={18} /> Open AI Tailoring Hub
          </button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="API Settings" defaultOpen={false}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label className="form-label">Provider
            <select 
              className="input-field"
              value={apiSettings.selectedProvider} 
              onChange={(e) => updateApiSettings({ selectedProvider: e.target.value as any })}
            >
              <option value="openai">OpenAI</option>
              <option value="gemini">Google Gemini</option>
              <option value="custom">Custom (DeepSeek/Ollama)</option>
            </select>
          </label>
          <label className="form-label">Model Name
            <input 
              className="input-field"
              value={apiSettings.model} 
              onChange={(e) => updateApiSettings({ model: e.target.value })}
              placeholder="e.g. gpt-4o, gemini-1.5-pro"
            />
          </label>
          <label className="form-label">API Key
            <input 
              type="password"
              className="input-field"
              value={getApiKey()} 
              onChange={(e) => {
                const key = apiSettings.selectedProvider === 'openai' ? 'openaiKey' : apiSettings.selectedProvider === 'gemini' ? 'geminiKey' : 'deepseekKey';
                updateApiSettings({ [key]: e.target.value });
              }}
              placeholder="sk-..."
            />
          </label>
          <label className="form-label">Base URL
            <input 
              className="input-field"
              value={getBaseUrl()} 
              onChange={(e) => {
                const key = apiSettings.selectedProvider === 'openai' ? 'openaiBaseUrl' : apiSettings.selectedProvider === 'gemini' ? 'geminiBaseUrl' : 'customBaseUrl';
                updateApiSettings({ [key]: e.target.value });
              }}
              placeholder="https://api.openai.com/v1"
            />
          </label>
          <button 
            onClick={testConnection}
            disabled={connectionStatus === 'testing'}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: `1px solid ${connectionStatus === 'success' ? 'var(--color-success)' : connectionStatus === 'error' ? 'var(--color-danger)' : 'var(--color-border)'}`,
              background: connectionStatus === 'success' ? 'rgba(16,185,129,0.08)' : connectionStatus === 'error' ? 'var(--color-danger-bg)' : 'var(--color-bg-card)',
              color: connectionStatus === 'success' ? 'var(--color-success)' : connectionStatus === 'error' ? 'var(--color-danger)' : 'var(--color-text-secondary)',
              fontWeight: '600',
              fontSize: '12px',
              cursor: connectionStatus === 'testing' ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              justifyContent: 'center',
            }}
          >
            {connectionStatus === 'testing' ? '⏳ Testing...' : connectionStatus === 'success' ? '✅ Connected' : connectionStatus === 'error' ? '❌ Failed' : '🔌 Test Connection'}
          </button>
          {connectionStatus === 'error' && connectionError && (
            <p style={{ fontSize: '11px', color: 'var(--color-danger)', margin: 0 }}>{connectionError}</p>
          )}
        </div>
      </CollapsibleSection>
    </div>
  );

  /* ===== Tab Content: DESIGN ===== */
  const renderDesignTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>

      <CollapsibleSection title="Color Schemes" defaultOpen={true}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(['Professional', 'Classic', 'Vibrant'] as const).map((category) => (
            <CollapsibleSection key={category} title={category} defaultOpen={category === 'Professional'}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                {COLOR_SCHEMES.filter(s => s.category === category).map((scheme) => (
                  <button
                    key={scheme.id}
                    onClick={() => applyColorScheme(scheme.id)}
                    title={scheme.name}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 8px',
                      border: activeColorScheme === scheme.id ? '2px solid var(--accent-primary, #3b82f6)' : '1px solid var(--border-color, #e2e8f0)',
                      borderRadius: '6px', cursor: 'pointer', fontSize: '10px', fontWeight: 500,
                      background: 'var(--bg-primary, #fff)', color: 'var(--text-primary, #333)',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: scheme.colors.primaryColor }} />
                      <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: scheme.colors.accentColor }} />
                      <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: scheme.colors.backgroundColor, border: '1px solid #ddd' }} />
                    </div>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{scheme.name}</span>
                  </button>
                ))}
              </div>
            </CollapsibleSection>
          ))}
          {activeColorScheme && (
            <button
              onClick={() => setActiveColorScheme(null)}
              className="btn-outline-sm"
              style={{ alignSelf: 'flex-start', fontSize: '10px', marginTop: '4px' }}
            >
              Switch to Custom Colors
            </button>
          )}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Colors" defaultOpen={!activeColorScheme}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {([
            ['primaryColor', 'Primary'],
            ['accentColor', 'Accent'],
            ['backgroundColor', 'Background'],
            ['textColor', 'Text'],
          ] as const).map(([key, label]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="form-label" style={{ width: '70px', flexShrink: 0 }}>{label}</span>
              <div className="color-picker-row">
                <input type="color" name={key} value={(theme as any)[key]} onChange={handleThemeChange} />
                <input 
                  type="text" 
                  value={(theme as any)[key]} 
                  onChange={(e) => handleColorHexChange(key, e.target.value)} 
                  maxLength={7}
                />
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Typography">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Font Family Selector */}
          <label className="form-label" style={{ marginBottom: '2px' }}>Font Family
            <select 
              name="fontFamily" 
              value={theme.fontFamily} 
              onChange={(e) => updateTheme({ fontFamily: e.target.value })}
              className="input-field"
              style={{ marginTop: '4px' }}
            >
              <optgroup label="Sans-serif">
                <option value="'Inter', sans-serif">Inter</option>
                <option value="'Roboto', sans-serif">Roboto</option>
                <option value="'Open Sans', sans-serif">Open Sans</option>
                <option value="'Lato', sans-serif">Lato</option>
                <option value="'Montserrat', sans-serif">Montserrat</option>
              </optgroup>
              <optgroup label="Serif">
                <option value="'Merriweather', serif">Merriweather</option>
                <option value="'EB Garamond', serif">EB Garamond</option>
                <option value="'Lora', serif">Lora</option>
                <option value="'Playfair Display', serif">Playfair Display</option>
              </optgroup>
              <optgroup label="Monospace">
                <option value="'Inconsolata', monospace">Inconsolata</option>
              </optgroup>
            </select>
          </label>

          {/* Font Sizes — 2-column grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <label className="form-label" style={{ fontSize: '10px' }}>Base Font ({theme.baseFontSize}px)
              <input type="range" min="8" max="14" step="0.5" name="baseFontSize" value={theme.baseFontSize} onChange={handleThemeChange} style={{ width: '100%' }} />
            </label>
            <label className="form-label" style={{ fontSize: '10px' }}>Name ({theme.headerFontSize}px)
              <input type="range" min="18" max="42" step="1" name="headerFontSize" value={theme.headerFontSize} onChange={handleThemeChange} style={{ width: '100%' }} />
            </label>
            <label className="form-label" style={{ fontSize: '10px' }}>Section Title ({theme.sectionTitleSize}px)
              <input type="range" min="8" max="18" step="0.5" name="sectionTitleSize" value={theme.sectionTitleSize} onChange={handleThemeChange} style={{ width: '100%' }} />
            </label>
            <label className="form-label" style={{ fontSize: '10px' }}>Company/Edu ({theme.companyFontSize || 11}px)
              <input type="range" min="8" max="14" step="0.5" name="companyFontSize" value={theme.companyFontSize || 11} onChange={handleThemeChange} style={{ width: '100%' }} />
            </label>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Spacing">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <label className="form-label" style={{ fontSize: '10px' }}>Line Height ({theme.lineHeight})
            <input type="range" min="1.0" max="2.5" step="0.05" name="lineHeight" value={theme.lineHeight} onChange={handleThemeChange} style={{ width: '100%' }} />
          </label>
          <label className="form-label" style={{ fontSize: '10px' }}>Section Gap ({theme.sectionSpacing}px)
            <input type="range" min="4" max="40" step="1" name="sectionSpacing" value={theme.sectionSpacing} onChange={handleThemeChange} style={{ width: '100%' }} />
          </label>
          <label className="form-label" style={{ fontSize: '10px' }}>Item Gap ({theme.itemSpacing}px)
            <input type="range" min="0" max="20" step="1" name="itemSpacing" value={theme.itemSpacing} onChange={handleThemeChange} style={{ width: '100%' }} />
          </label>
          <label className="form-label" style={{ fontSize: '10px' }}>Page Padding ({theme.pagePadding}px)
            <input type="range" min="20" max="60" step="2" name="pagePadding" value={theme.pagePadding} onChange={handleThemeChange} style={{ width: '100%' }} />
          </label>
        </div>
        {/* Page Break Marker Toggle */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', marginTop: '8px', color: 'var(--text-primary, #333)' }}>
          <input 
            type="checkbox" 
            checked={!!theme.showPageBreak} 
            onChange={(e) => updateTheme({ showPageBreak: e.target.checked })}
            style={{ cursor: 'pointer' }}
          />
          Show Page Break Marker
        </label>
      </CollapsibleSection>

      <CollapsibleSection title={`Section Visibility & Order (${selectedTemplate})`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <p style={{ fontSize: '10px', opacity: 0.5, margin: '0 0 4px 0' }}>Toggle visibility and ↑↓ to reorder sections</p>
          {sectionOrder.map((key, idx) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-primary, #333)' }}>
              <input 
                type="checkbox" 
                checked={isSectionVisible(selectedTemplate, key)} 
                onChange={() => toggleSectionVisibility(selectedTemplate, key)}
                style={{ cursor: 'pointer', margin: 0 }}
              />
              {isSectionVisible(selectedTemplate, key) ? <Eye size={12} /> : <EyeOff size={12} style={{ opacity: 0.4 }} />}
              <span style={{ flex: 1, opacity: isSectionVisible(selectedTemplate, key) ? 1 : 0.5 }}>{SECTION_LABELS[key]}</span>
              <button className="btn-reorder" disabled={idx === 0} onClick={() => moveSectionOrder(key, 'up')} title="Move up"><ArrowUp size={10} /></button>
              <button className="btn-reorder" disabled={idx === sectionOrder.length - 1} onClick={() => moveSectionOrder(key, 'down')} title="Move down"><ArrowDown size={10} /></button>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Reset Settings */}
      <div style={{ padding: '12px 0', borderTop: '1px solid var(--border-color, #e2e8f0)', marginTop: '8px' }}>
        <button 
          onClick={() => { if (window.confirm('Reset ALL settings (content, theme, template) to defaults? This cannot be undone.')) { reset(); } }}
          className="btn-outline-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#dc2626', borderColor: '#fca5a5', width: '100%', justifyContent: 'center', padding: '8px' }}
        >
          <RotateCcw size={14} /> Reset All Settings
        </button>
      </div>
    </div>
  );

  /* ===== Tab Content: EXPORT ===== */
  const renderExportTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <CollapsibleSection title="Export & Download" defaultOpen={true}>
        <div className="export-section">
          <div className="export-row">
            <button onClick={() => window.print()} className="btn-primary"><Printer size={16} /> Print PDF</button>
          </div>
          <div className="export-row">
            <button onClick={async () => {
              const { downloadDocx } = await import('./utils/ExportUtils');
              downloadDocx(data);
            }} className="btn-muted"><FileText size={16} /> Word</button>
            <button onClick={async () => {
              const { downloadMarkdown } = await import('./utils/ExportUtils');
              downloadMarkdown(data);
            }} className="btn-muted"><FileText size={16} /> Markdown</button>
            <button onClick={async () => {
              const { downloadHtml } = await import('./utils/ExportUtils');
              downloadHtml('resume-preview', data.personalInfo.fullName);
            }} className="btn-muted"><Code size={16} /> HTML</button>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Danger Zone">
        <button onClick={reset} className="btn-danger" style={{ width: '100%' }}>
          <RefreshCcw size={16} /> Reset All Data
        </button>
        <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
          This will reset all resume content, theme settings, and preferences to defaults.
        </p>
      </CollapsibleSection>
    </div>
  );

  return (
    <div className="app-layout">
      {/* Sidebar Editor */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`} style={{ width: sidebarCollapsed ? undefined : `${sidebarWidth}px` }}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-info">
            <h1>
              <FileText size={18} />
              Resume Builder Pro
            </h1>
            <p>Build · Tailor · Export</p>
          </div>
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Template Selector — custom dropdown with layout previews */}
        {(() => {
          const templates = [
            { id: 'classic', name: 'Classic Minimal', desc: 'Simple single-column', layout: 'single' },
            { id: 'clean', name: 'Clean Layout', desc: 'Structured with sections', layout: 'single' },
            { id: 'premium', name: 'Premium Headshot', desc: 'Photo sidebar layout', layout: 'sidebar-left' },
            { id: 'ats', name: 'ATS Executive', desc: 'ATS-optimized format', layout: 'single' },
            { id: 'photo', name: 'Photo Header', desc: 'Large photo header', layout: 'photo-header' },
            { id: 'clean_prof', name: 'Clean Professional', desc: 'Clean with dividers', layout: 'single' },
            { id: 'elegant', name: 'Elegant Two-Column', desc: 'Two-column design', layout: 'sidebar-right' },
            { id: 'bold', name: 'Bold Engineer', desc: 'Dark header, badges', layout: 'bold-header' },
            { id: 'academic', name: 'Academic', desc: 'Academic/research style', layout: 'single' },
          ];
          const current = templates.find(t => t.id === selectedTemplate);
          const LayoutIcon = ({ type }: { type: string }) => (
            <svg width="28" height="36" viewBox="0 0 28 36" fill="none" style={{ border: '1px solid var(--border-color, #d1d5db)', borderRadius: 2, flexShrink: 0 }}>
              <rect width="28" height="36" rx="1" fill="var(--bg-secondary, #f9fafb)" />
              {type === 'single' && (<>
                <rect x="4" y="3" width="20" height="3" rx="0.5" fill="var(--accent-color, #6366f1)" opacity="0.7" />
                <rect x="4" y="8" width="20" height="1" rx="0.3" fill="currentColor" opacity="0.2" />
                <rect x="4" y="11" width="20" height="1" rx="0.3" fill="currentColor" opacity="0.15" />
                <rect x="4" y="13" width="15" height="1" rx="0.3" fill="currentColor" opacity="0.15" />
                <rect x="4" y="17" width="20" height="2" rx="0.5" fill="var(--accent-color, #6366f1)" opacity="0.4" />
                <rect x="4" y="21" width="20" height="1" rx="0.3" fill="currentColor" opacity="0.15" />
                <rect x="4" y="23" width="18" height="1" rx="0.3" fill="currentColor" opacity="0.15" />
                <rect x="4" y="25" width="20" height="1" rx="0.3" fill="currentColor" opacity="0.15" />
                <rect x="4" y="29" width="20" height="2" rx="0.5" fill="var(--accent-color, #6366f1)" opacity="0.4" />
                <rect x="4" y="33" width="14" height="1" rx="0.3" fill="currentColor" opacity="0.15" />
              </>)}
              {type === 'sidebar-left' && (<>
                <rect x="1" y="1" width="8" height="34" rx="0.5" fill="var(--accent-color, #6366f1)" opacity="0.2" />
                <circle cx="5" cy="6" r="2.5" fill="var(--accent-color, #6366f1)" opacity="0.5" />
                <rect x="2" y="11" width="6" height="1" rx="0.3" fill="currentColor" opacity="0.2" />
                <rect x="2" y="14" width="6" height="1" rx="0.3" fill="currentColor" opacity="0.2" />
                <rect x="11" y="3" width="14" height="2" rx="0.5" fill="var(--accent-color, #6366f1)" opacity="0.5" />
                <rect x="11" y="7" width="14" height="1" rx="0.3" fill="currentColor" opacity="0.15" />
                <rect x="11" y="10" width="14" height="1" rx="0.3" fill="currentColor" opacity="0.15" />
                <rect x="11" y="15" width="14" height="2" rx="0.5" fill="var(--accent-color, #6366f1)" opacity="0.4" />
                <rect x="11" y="19" width="14" height="1" rx="0.3" fill="currentColor" opacity="0.15" />
              </>)}
              {type === 'sidebar-right' && (<>
                <rect x="4" y="3" width="12" height="2" rx="0.5" fill="var(--accent-color, #6366f1)" opacity="0.5" />
                <rect x="4" y="7" width="12" height="1" rx="0.3" fill="currentColor" opacity="0.15" />
                <rect x="4" y="10" width="12" height="1" rx="0.3" fill="currentColor" opacity="0.15" />
                <rect x="4" y="15" width="12" height="2" rx="0.5" fill="var(--accent-color, #6366f1)" opacity="0.4" />
                <rect x="4" y="19" width="12" height="1" rx="0.3" fill="currentColor" opacity="0.15" />
                <rect x="19" y="1" width="8" height="34" rx="0.5" fill="var(--accent-color, #6366f1)" opacity="0.15" />
                <rect x="20" y="4" width="6" height="1.5" rx="0.3" fill="var(--accent-color, #6366f1)" opacity="0.5" />
                <rect x="20" y="8" width="6" height="1" rx="0.3" fill="currentColor" opacity="0.2" />
                <rect x="20" y="11" width="6" height="1" rx="0.3" fill="currentColor" opacity="0.2" />
              </>)}
              {type === 'photo-header' && (<>
                <rect x="1" y="1" width="26" height="10" rx="0.5" fill="var(--accent-color, #6366f1)" opacity="0.2" />
                <circle cx="8" cy="6" r="3" fill="var(--accent-color, #6366f1)" opacity="0.5" />
                <rect x="13" y="4" width="12" height="2" rx="0.5" fill="var(--accent-color, #6366f1)" opacity="0.5" />
                <rect x="13" y="7" width="8" height="1" rx="0.3" fill="currentColor" opacity="0.2" />
                <rect x="4" y="14" width="20" height="1" rx="0.3" fill="currentColor" opacity="0.15" />
                <rect x="4" y="17" width="20" height="2" rx="0.5" fill="var(--accent-color, #6366f1)" opacity="0.4" />
                <rect x="4" y="21" width="20" height="1" rx="0.3" fill="currentColor" opacity="0.15" />
                <rect x="4" y="23" width="18" height="1" rx="0.3" fill="currentColor" opacity="0.15" />
              </>)}
              {type === 'bold-header' && (<>
                <rect x="1" y="1" width="26" height="10" rx="0.5" fill="var(--accent-color, #333)" opacity="0.8" />
                <rect x="4" y="3" width="14" height="2.5" rx="0.5" fill="#fff" opacity="0.9" />
                <rect x="4" y="7" width="20" height="1" rx="0.3" fill="#fff" opacity="0.5" />
                <rect x="4" y="14" width="20" height="2" rx="0.5" fill="var(--accent-color, #6366f1)" opacity="0.5" />
                <rect x="4" y="18" width="20" height="1" rx="0.3" fill="currentColor" opacity="0.15" />
                <rect x="4" y="20" width="18" height="1" rx="0.3" fill="currentColor" opacity="0.15" />
                <rect x="4" y="24" width="20" height="2" rx="0.5" fill="var(--accent-color, #6366f1)" opacity="0.4" />
                <rect x="4" y="28" width="20" height="1" rx="0.3" fill="currentColor" opacity="0.15" />
              </>)}
            </svg>
          );
          return (
            <div style={{ padding: '8px 12px', margin: '4px 0', position: 'relative' }}>
              <button
                onClick={() => setTemplateDropdownOpen(!templateDropdownOpen)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 10px', borderRadius: '8px', cursor: 'pointer',
                  border: '1px solid var(--border-color, #d1d5db)',
                  background: 'var(--bg-secondary, #f9fafb)',
                  color: 'var(--text-primary, #1f2937)',
                  transition: 'border-color 0.15s',
                }}
              >
                <LayoutIcon type={current?.layout || 'single'} />
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, fontSize: '12px' }}>{current?.name}</div>
                  <div style={{ fontSize: '10px', opacity: 0.6 }}>{current?.desc}</div>
                </div>
                <ChevronDown size={14} style={{ opacity: 0.5, transform: templateDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </button>
              {templateDropdownOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setTemplateDropdownOpen(false)} />
                  <div style={{
                    position: 'absolute', top: '100%', left: '12px', right: '12px', zIndex: 100,
                    background: 'var(--panel-bg, #fff)', border: '1px solid var(--border-color, #d1d5db)',
                    borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    maxHeight: '320px', overflowY: 'auto',
                    padding: '4px',
                  }}>
                    {templates.map(tpl => (
                      <button
                        key={tpl.id}
                        onClick={() => { setTemplate(tpl.id); setTemplateDropdownOpen(false); }}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '8px 8px', borderRadius: '6px', cursor: 'pointer',
                          border: 'none', textAlign: 'left',
                          background: selectedTemplate === tpl.id ? 'var(--accent-color, #6366f1)11' : 'transparent',
                          color: 'var(--text-primary, #1f2937)',
                          transition: 'background 0.1s',
                        }}
                        onMouseEnter={e => { if (selectedTemplate !== tpl.id) (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-secondary, #f3f4f6)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = selectedTemplate === tpl.id ? 'var(--accent-color, #6366f1)11' : 'transparent'; }}
                      >
                        <LayoutIcon type={tpl.layout} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: selectedTemplate === tpl.id ? 700 : 500, fontSize: '12px' }}>{tpl.name}</div>
                          <div style={{ fontSize: '10px', opacity: 0.5 }}>{tpl.desc}</div>
                        </div>
                        {selectedTemplate === tpl.id && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-color, #6366f1)' }} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })()}

        {/* Tab Navigation — 4 tabs */}
        <div className="sidebar-tabs">
          <button 
            className={`sidebar-tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai')}
          >
            <Sparkles size={14} /> AI
          </button>
          <button 
            className={`sidebar-tab-btn ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            <User size={14} /> Content
          </button>
          <button 
            className={`sidebar-tab-btn ${activeTab === 'design' ? 'active' : ''}`}
            onClick={() => setActiveTab('design')}
          >
            <Palette size={14} /> Design
          </button>
          <button 
            className={`sidebar-tab-btn ${activeTab === 'export' ? 'active' : ''}`}
            onClick={() => setActiveTab('export')}
          >
            <Download size={14} /> Export
          </button>
        </div>

        {/* Tab Content — Scrollable */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }} className="editor-controls">
          {activeTab === 'ai' && renderAITab()}
          {activeTab === 'content' && renderContentTab()}
          {activeTab === 'design' && renderDesignTab()}
          {activeTab === 'export' && renderExportTab()}
        </div>
      </aside>

      {/* Sidebar Resize Handle */}
      {!sidebarCollapsed && (
        <div
          className="sidebar-resize-handle"
          style={{ left: `${sidebarWidth}px` }}
          onMouseDown={(e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startW = sidebarWidth;
            const onMove = (me: MouseEvent) => {
              const delta = me.clientX - startX;
              setSidebarWidth(startW + delta);
            };
            const onUp = () => {
              document.removeEventListener('mousemove', onMove);
              document.removeEventListener('mouseup', onUp);
              document.body.style.cursor = '';
              document.body.style.userSelect = '';
            };
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
          }}
        />
      )}

      {/* Toggle button — OUTSIDE sidebar */}
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        title={sidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
        style={{ left: sidebarCollapsed ? '0px' : `${sidebarWidth}px` }}
      >
        {sidebarCollapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
      </button>

      {/* Preview Area */}
      <main className="preview-canvas" style={{ padding: '40px' }}>
        <div className="zoom-controls">
          <button onClick={zoomOut} title="Zoom out"><ZoomOut size={16} /></button>
          <span>{zoomLevel}%</span>
          <button onClick={zoomIn} title="Zoom in"><ZoomIn size={16} /></button>
          <div style={{ width: '1px', height: '16px', background: 'var(--color-border)' }} />
          <button onClick={zoomFit} title="Fit to 100%"><Maximize size={14} /></button>
        </div>

        <div id="resume-preview" style={{ margin: 'auto', transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center', transition: 'transform 0.2s ease' }}>
          {renderTemplate()}
        </div>
      </main>

      {/* Tailoring Hub Modal */}
      {showTailoringHub && <TailoringHub onClose={() => setShowTailoringHub(false)} />}

      {/* Onboarding Screen */}
      {!hasCompletedOnboarding && <OnboardingScreen />}
    </div>
  );
};

export default App;
