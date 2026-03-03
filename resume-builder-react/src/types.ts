export interface ResumeData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    linkedin: string;
    location: string;
    photo?: string;
    portfolioUrl?: string;
    portfolioLabel?: string;
    visaStatus?: string;
    visaLabel?: string;
  };
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  technicalSkills: TechnicalSkillCategory[];
  languages: string[];
  certifications: string[];
  sectionVisibility: TemplateVisibility;
}

export interface ExperienceItem {
  id: string;
  company: string;
  location: string;
  title: string;
  dates: string;
  achievements: string[];
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  dates: string;
  location: string;
  gpa?: string;
  relevantCoursework?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  isHighlighted: boolean;
}

export interface TechnicalSkillCategory {
  id: string;
  category: string;
  skills: string;
}

// Section keys that can be toggled per-template
export type SectionKey = 
  | 'summary' 
  | 'experience' 
  | 'education' 
  | 'skills' 
  | 'technicalSkills' 
  | 'languages' 
  | 'certifications'
  | 'photo'
  | 'portfolio'
  | 'visaStatus';

// Per-template section visibility
export type TemplateVisibility = Record<string, Record<SectionKey, boolean>>;

// All sections visible by default
export const DEFAULT_SECTION_VISIBILITY: Record<SectionKey, boolean> = {
  summary: true,
  experience: true,
  education: true,
  skills: true,
  technicalSkills: true,
  languages: true,
  certifications: true,
  photo: true,
  portfolio: true,
  visaStatus: true,
};

export const SECTION_LABELS: Record<SectionKey, string> = {
  summary: 'Summary',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  technicalSkills: 'Technical Skills',
  languages: 'Languages',
  certifications: 'Certifications',
  photo: 'Headshot Photo',
  portfolio: 'Portfolio / Blog',
  visaStatus: 'Visa Status',
};

export interface ThemeSettings {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  baseFontSize: number;
  headerFontSize: number;
  sectionTitleSize: number;
  companyFontSize: number;
  lineHeight: number;
  pagePadding: number;
  sectionSpacing: number;
  itemSpacing: number;

  // Sidebar Specific (Premium Headshot, etc)
  sidebarBg?: string;
  sidebarText?: string;
  sidebarAccent?: string;
  sidebarWidth?: number;
  headshotSize?: number;
  headshotRadius?: number;

  // Clean Layout Specific
  summaryBg?: string;

  // ATS Executive Specific
  metricsBg?: string;
  dividerColor?: string;

  // Page Break
  showPageBreak?: boolean;
}

export interface ApiSettings {
  openaiKey: string;
  geminiKey: string;
  deepseekKey: string;
  customBaseUrl: string;
  openaiBaseUrl: string;
  geminiBaseUrl: string;
  selectedProvider: 'openai' | 'gemini' | 'custom';
  model: string;
}

export interface SourceMaterials {
  jobDescription: string;
  additionalNotes: string;
}

export interface DraftState {
  isGenerating: boolean;
  draftResume: ResumeData | null;
  error: string | null;
}
