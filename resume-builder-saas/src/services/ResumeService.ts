import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { ResumeData } from '@/types';

export interface SavedResume {
  id: string;
  title: string;
  data: ResumeData;
  template: string;
  theme: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// localStorage fallback key
const LOCAL_RESUMES_KEY = 'rbp-local-resumes';

function getLocalResumes(): SavedResume[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(LOCAL_RESUMES_KEY) || '[]');
  } catch { return []; }
}

function setLocalResumes(resumes: SavedResume[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_RESUMES_KEY, JSON.stringify(resumes));
}

export class ResumeService {
  /** List all resumes for the current user */
  static async listResumes(userId: string): Promise<SavedResume[]> {
    if (!isSupabaseConfigured || !supabase) {
      return getLocalResumes();
    }

    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map(r => ({
      id: r.id,
      title: r.title,
      data: r.data as ResumeData,
      template: r.template,
      theme: r.theme || {},
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }

  /** Save or update a resume */
  static async saveResume(
    userId: string,
    resume: { id?: string; title: string; data: ResumeData; template: string; theme: Record<string, any> }
  ): Promise<string> {
    if (!isSupabaseConfigured || !supabase) {
      // localStorage fallback
      const resumes = getLocalResumes();
      const id = resume.id || crypto.randomUUID();
      const now = new Date().toISOString();
      const existing = resumes.findIndex(r => r.id === id);
      const saved: SavedResume = {
        id, title: resume.title, data: resume.data,
        template: resume.template, theme: resume.theme,
        createdAt: existing >= 0 ? resumes[existing].createdAt : now,
        updatedAt: now,
      };
      if (existing >= 0) resumes[existing] = saved;
      else resumes.unshift(saved);
      setLocalResumes(resumes);
      return id;
    }

    if (resume.id) {
      // Update existing
      const { error } = await supabase
        .from('resumes')
        .update({
          title: resume.title,
          data: resume.data,
          template: resume.template,
          theme: resume.theme,
        })
        .eq('id', resume.id)
        .eq('user_id', userId);
      if (error) throw new Error(error.message);
      return resume.id;
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: userId,
          title: resume.title,
          data: resume.data,
          template: resume.template,
          theme: resume.theme,
        })
        .select('id')
        .single();
      if (error) throw new Error(error.message);
      return data.id;
    }
  }

  /** Load a single resume */
  static async loadResume(userId: string, resumeId: string): Promise<SavedResume | null> {
    if (!isSupabaseConfigured || !supabase) {
      return getLocalResumes().find(r => r.id === resumeId) || null;
    }

    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .eq('user_id', userId)
      .single();

    if (error || !data) return null;
    return {
      id: data.id,
      title: data.title,
      data: data.data as ResumeData,
      template: data.template,
      theme: data.theme || {},
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  /** Delete a resume */
  static async deleteResume(userId: string, resumeId: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      const resumes = getLocalResumes().filter(r => r.id !== resumeId);
      setLocalResumes(resumes);
      return;
    }

    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', resumeId)
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
  }

  /** Duplicate a resume */
  static async duplicateResume(userId: string, resumeId: string): Promise<string> {
    const original = await this.loadResume(userId, resumeId);
    if (!original) throw new Error('Resume not found');

    return this.saveResume(userId, {
      title: `${original.title} (Copy)`,
      data: original.data,
      template: original.template,
      theme: original.theme,
    });
  }

  /** Rename a resume */
  static async renameResume(userId: string, resumeId: string, newTitle: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      const resumes = getLocalResumes();
      const r = resumes.find(r => r.id === resumeId);
      if (r) { r.title = newTitle; r.updatedAt = new Date().toISOString(); }
      setLocalResumes(resumes);
      return;
    }

    const { error } = await supabase
      .from('resumes')
      .update({ title: newTitle })
      .eq('id', resumeId)
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
  }
}
