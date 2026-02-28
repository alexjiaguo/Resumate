export interface ResumeData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    linkedin: string;
    location: string;
    photo?: string;
  };
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  languages: string[];
  certifications: string[];
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
}

export interface SkillItem {
  id: string;
  name: string;
  isHighlighted: boolean;
}

export interface ThemeSettings {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  baseFontSize: number;
  headerFontSize: number;
  sectionTitleSize: number;
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
}

export interface ApiSettings {
  openaiApiKey: string;
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
