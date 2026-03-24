import { useState, useEffect, useRef, useCallback } from 'react';
import { useResumeStore } from '@/store/resume-store';
import { ResumeService } from '@/services/ResumeService';

import type { ThemeSettings } from '@/types';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutoSaveOptions {
  /** Debounce delay in ms before auto-saving (default: 1500) */
  delay?: number;
}

interface UseAutoSaveReturn {
  saveStatus: SaveStatus;
  resumeId: string | null;
  resumeTitle: string;
  setResumeTitle: (title: string) => void;
  /** Whether the initial load from ResumeService is still happening */
  isLoading: boolean;
}

export function useAutoSave(userId: string, opts?: UseAutoSaveOptions): UseAutoSaveReturn {
  const delay = opts?.delay ?? 1500;

  const { data, selectedTemplate, theme, hydrateFromSaved } = useResumeStore();

  const [resumeId, setResumeId] = useState<string | null>(null);
  const [resumeTitle, setResumeTitle] = useState('Untitled Resume');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [isLoading, setIsLoading] = useState(true);

  // Track whether we've done the initial load — prevents auto-save from firing on hydration
  const hasLoadedRef = useRef(false);
  // Track the debounce timer
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track the latest data for saving (avoids stale closures)
  const latestRef = useRef({ data, selectedTemplate, theme, resumeTitle });

  // Keep latestRef in sync
  useEffect(() => {
    latestRef.current = { data, selectedTemplate, theme, resumeTitle };
  }, [data, selectedTemplate, theme, resumeTitle]);

  // ────────────────────────────────────────
  // 1. Initial Load / Create
  // ────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const params = new URLSearchParams(window.location.search);
      const idFromUrl = params.get('id');

      if (idFromUrl) {
        // Load existing resume
        try {
          const saved = await ResumeService.loadResume(userId, idFromUrl);
          if (saved) {
            hydrateFromSaved(saved.data, saved.template, saved.theme as ThemeSettings);
            setResumeId(saved.id);
            setResumeTitle(saved.title);
            setSaveStatus('saved');
          } else {
            // Resume not found — treat as new
            console.warn(`Resume ${idFromUrl} not found, starting fresh.`);
          }
        } catch (err) {
          console.error('Failed to load resume:', err);
        }
      }
      // If no idFromUrl, we'll auto-create on the first edit

      hasLoadedRef.current = true;
      setIsLoading(false);
    };

    init();
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ────────────────────────────────────────
  // 2. Debounced Auto-Save on Data Changes
  // ────────────────────────────────────────
  const doSave = useCallback(async () => {
    if (!hasLoadedRef.current) return;

    const { data: d, selectedTemplate: t, theme: th, resumeTitle: title } = latestRef.current;

    setSaveStatus('saving');
    try {
      const id = await ResumeService.saveResume(userId, {
        id: resumeId ?? undefined,
        title,
        data: d,
        template: t,
        theme: th,
      });

      // If this was a new resume, update the URL and state
      if (!resumeId) {
        setResumeId(id);
        const url = new URL(window.location.href);
        url.searchParams.set('id', id);
        window.history.replaceState({}, '', url.toString());
      }

      setSaveStatus('saved');
    } catch (err) {
      console.error('Auto-save failed:', err);
      setSaveStatus('error');
    }
  }, [userId, resumeId]);

  // Watch for changes to data, template, or theme and debounce save
  useEffect(() => {
    if (!hasLoadedRef.current) return;

    // Clear any existing timer
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      doSave();
    }, delay);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [data, selectedTemplate, theme, resumeTitle, delay, doSave]);

  return {
    saveStatus,
    resumeId,
    resumeTitle,
    setResumeTitle,
    isLoading,
  };
}
