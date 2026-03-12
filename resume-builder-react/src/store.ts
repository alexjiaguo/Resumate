import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResumeData, ThemeSettings, ApiSettings, SourceMaterials, DraftState, SectionKey, DEFAULT_SECTION_VISIBILITY } from './types';

interface HistorySnapshot {
  data: ResumeData;
  theme: ThemeSettings;
  selectedTemplate: string;
}

interface ResumeStore {
  data: ResumeData;
  theme: ThemeSettings;
  selectedTemplate: string;
  apiSettings: ApiSettings;
  sourceMaterials: SourceMaterials;
  draftState: DraftState;
  hasCompletedOnboarding: boolean;
  uploadedResumeText: string;
  sidebarWidth: number;
  sectionOrder: SectionKey[];
  // History
  history: {
    past: HistorySnapshot[];
    future: HistorySnapshot[];
  };
  updateData: (newData: Partial<ResumeData>) => void;
  updateTheme: (newTheme: Partial<ThemeSettings>) => void;
  setTemplate: (template: string) => void;
  updateApiSettings: (settings: Partial<ApiSettings>) => void;
  setSourceMaterial: (material: Partial<SourceMaterials>) => void;
  setDraft: (draft: Partial<DraftState>) => void;
  commitDraft: () => void;
  setOnboardingComplete: () => void;
  setUploadedResumeText: (text: string) => void;
  setSidebarWidth: (width: number) => void;
  moveSectionOrder: (key: SectionKey, direction: 'up' | 'down') => void;
  toggleSectionVisibility: (template: string, section: SectionKey) => void;
  isSectionVisible: (template: string, section: SectionKey) => boolean;
  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  reset: () => void;
}

const initialData: ResumeData = {
  personalInfo: {
    fullName: 'John Doe',
    title: 'Senior Software Engineer',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    linkedin: 'linkedin.com/in/johndoe',
    location: 'San Francisco, CA',
  },
  summary: 'Passionate software engineer with 8+ years of experience in building scalable web applications and distributed systems.',
  experience: [
    {
      id: '1',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      title: 'Senior Developer',
      dates: 'Jan 2020 – Present',
      achievements: [
        'Led a team of 5 developers to rewrite the core billing engine, reducing processing time by 40%.',
        'Implemented a new CI/CD pipeline that cut deployment time from 2 hours to 15 minutes.'
      ]
    }
  ],
  education: [
    {
      id: '1',
      school: 'University of Technology',
      degree: 'B.S. in Computer Science',
      dates: '2012 – 2016',
      location: 'Boston, MA'
    }
  ],
  skills: [
    { id: '1', name: 'React', isHighlighted: true },
    { id: '2', name: 'TypeScript', isHighlighted: true },
    { id: '3', name: 'Node.js', isHighlighted: false },
    { id: '4', name: 'PostgreSQL', isHighlighted: false }
  ],
  technicalSkills: [
    { id: '1', category: 'Programming Languages', skills: 'JavaScript, TypeScript, Python' },
    { id: '2', category: 'Frameworks & Libraries', skills: 'React, Node.js, Express' },
  ],
  languages: ['English (Native)', 'Spanish (Professional)'],
  certifications: ['AWS Certified Solutions Architect', 'Google Professional Cloud Developer'],
  sectionVisibility: {},
};

const initialTheme: ThemeSettings = {
  primaryColor: '#2c3e50',
  accentColor: '#2980b9',
  backgroundColor: '#ffffff',
  textColor: '#2c3e50',
  fontFamily: "'Inter', sans-serif",
  baseFontSize: 11,
  headerFontSize: 26,
  sectionTitleSize: 12,
  companyFontSize: 11,
  lineHeight: 1.4,
  pagePadding: 40,
  sectionSpacing: 12,
  itemSpacing: 6,
  sidebarBg: '#16213e',
  sidebarText: '#d0d0dc',
  sidebarAccent: '#7ec8e3',
  sidebarWidth: 218,
  headshotSize: 80,
  headshotRadius: 4,
  summaryBg: '#f5f6fa',
  metricsBg: '#f8f9fb',
  dividerColor: '#d0d5dd',
  showPageBreak: false,
};

const initialApiSettings: ApiSettings = {
  openaiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  geminiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  deepseekKey: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
  customBaseUrl: import.meta.env.VITE_CUSTOM_BASE_URL || '',
  openaiBaseUrl: import.meta.env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1',
  geminiBaseUrl: import.meta.env.VITE_GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta/openai',
  selectedProvider: 'openai',
  model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4',
};

const initialSourceMaterials: SourceMaterials = {
  jobDescription: '',
  additionalNotes: '',
};

const initialDraftState: DraftState = {
  isGenerating: false,
  draftResume: null,
  error: null,
};

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => {
      // Helper to save current state to history
      const saveToHistory = () => {
        const state = get();
        const snapshot: HistorySnapshot = {
          data: state.data,
          theme: state.theme,
          selectedTemplate: state.selectedTemplate,
        };

        set((state) => ({
          history: {
            past: [...(state.history?.past || []), snapshot].slice(-50), // Keep last 50
            future: [], // Clear future on new action
          },
        }));
      };

      return {
      data: initialData,
      theme: initialTheme,
      selectedTemplate: 'classic',
      apiSettings: initialApiSettings,
      sourceMaterials: initialSourceMaterials,
      draftState: initialDraftState,
      hasCompletedOnboarding: false,
      uploadedResumeText: '',
      sidebarWidth: 420,
      sectionOrder: ['summary', 'experience', 'education', 'skills', 'technicalSkills', 'languages', 'certifications', 'photo', 'portfolio', 'visaStatus'] as SectionKey[],
      history: { past: [], future: [] },

      updateData: (newData) => {
        saveToHistory();
        set((state) => ({ data: { ...state.data, ...newData } }));
      },

      updateTheme: (newTheme) => {
        saveToHistory();
        set((state) => ({ theme: { ...state.theme, ...newTheme } }));
      },

      setTemplate: (template) => {
        saveToHistory();
        set({ selectedTemplate: template });
      },

      updateApiSettings: (settings) => set((state) => ({ apiSettings: { ...state.apiSettings, ...settings } })),
      setSourceMaterial: (material) => set((state) => ({ sourceMaterials: { ...state.sourceMaterials, ...material } })),
      setDraft: (draft) => set((state) => ({ draftState: { ...state.draftState, ...draft } })),

      commitDraft: () => {
        saveToHistory();
        set((state) => {
          if (!state.draftState.draftResume) return state;
          return {
            data: {
              ...state.draftState.draftResume,
              technicalSkills: state.draftState.draftResume.technicalSkills || state.data.technicalSkills,
              sectionVisibility: state.data.sectionVisibility,
            },
            draftState: { ...state.draftState, draftResume: null }
          };
        });
      },

      setOnboardingComplete: () => set({ hasCompletedOnboarding: true }),
      setUploadedResumeText: (text: string) => set({ uploadedResumeText: text }),
      setSidebarWidth: (width: number) => set({ sidebarWidth: Math.max(320, Math.min(600, width)) }),

      moveSectionOrder: (key: SectionKey, direction: 'up' | 'down') => set((state) => {
        const order = [...state.sectionOrder];
        const idx = order.indexOf(key);
        if (idx < 0) return state;
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= order.length) return state;
        [order[idx], order[swapIdx]] = [order[swapIdx], order[idx]];
        return { sectionOrder: order };
      }),

      toggleSectionVisibility: (template: string, section: SectionKey) => {
        saveToHistory();
        set((state) => {
          const currentVis = state.data.sectionVisibility || {};
          const templateVis = currentVis[template] || { ...DEFAULT_SECTION_VISIBILITY };
          return {
            data: {
              ...state.data,
              sectionVisibility: {
                ...currentVis,
                [template]: {
                  ...templateVis,
                  [section]: !templateVis[section],
                }
              }
            }
          };
        });
      },

      isSectionVisible: (template: string, section: SectionKey) => {
        const state = get();
        const templateVis = state.data.sectionVisibility?.[template];
        if (!templateVis) return DEFAULT_SECTION_VISIBILITY[section];
        return templateVis[section] ?? DEFAULT_SECTION_VISIBILITY[section];
      },

      // History actions
      undo: () => {
        const state = get();
        if (!state.history || state.history.past.length === 0) return;

        const previous = state.history.past[state.history.past.length - 1];
        const newPast = state.history.past.slice(0, -1);

        const currentSnapshot: HistorySnapshot = {
          data: state.data,
          theme: state.theme,
          selectedTemplate: state.selectedTemplate,
        };

        set({
          data: previous.data,
          theme: previous.theme,
          selectedTemplate: previous.selectedTemplate,
          history: {
            past: newPast,
            future: [currentSnapshot, ...(state.history.future || [])],
          },
        });
      },

      redo: () => {
        const state = get();
        if (!state.history || state.history.future.length === 0) return;

        const next = state.history.future[0];
        const newFuture = state.history.future.slice(1);

        const currentSnapshot: HistorySnapshot = {
          data: state.data,
          theme: state.theme,
          selectedTemplate: state.selectedTemplate,
        };

        set({
          data: next.data,
          theme: next.theme,
          selectedTemplate: next.selectedTemplate,
          history: {
            past: [...(state.history.past || []), currentSnapshot],
            future: newFuture,
          },
        });
      },

      canUndo: () => {
        const state = get();
        return state.history?.past?.length > 0;
      },
      canRedo: () => {
        const state = get();
        return state.history?.future?.length > 0;
      },

      reset: () => set({
        data: initialData,
        theme: initialTheme,
        selectedTemplate: 'classic',
        apiSettings: initialApiSettings,
        sourceMaterials: initialSourceMaterials,
        draftState: initialDraftState,
        hasCompletedOnboarding: false,
        uploadedResumeText: '',
        sidebarWidth: 420,
        sectionOrder: ['summary', 'experience', 'education', 'skills', 'technicalSkills', 'languages', 'certifications', 'photo', 'portfolio', 'visaStatus'] as SectionKey[],
        history: { past: [], future: [] },
      }),
    };
  },
    {
      name: 'resume-builder-pro-storage',
      partialize: (state) => ({
        data: state.data,
        theme: state.theme,
        selectedTemplate: state.selectedTemplate,
        apiSettings: state.apiSettings,
        sourceMaterials: state.sourceMaterials,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        uploadedResumeText: state.uploadedResumeText,
        sidebarWidth: state.sidebarWidth,
        sectionOrder: state.sectionOrder,
      }),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        history: { past: [], future: [] }, // Always start with empty history
      }),
    }
  )
);
