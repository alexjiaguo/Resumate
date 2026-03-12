import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { ResumeData, ResumeVersion, CoverLetter } from '@/types';

export interface SavedResume {
  id: string;
  title: string;
  data: ResumeData;
  template: string;
  theme: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// localStorage fallback keys
const LOCAL_RESUMES_KEY = 'rbp-local-resumes';
const LOCAL_VERSIONS_KEY = 'rbp-local-versions';
const LOCAL_COVER_LETTERS_KEY = 'rbp-local-cover-letters';

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

function getLocalVersions(): ResumeVersion[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(LOCAL_VERSIONS_KEY) || '[]');
  } catch { return []; }
}

function setLocalVersions(versions: ResumeVersion[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_VERSIONS_KEY, JSON.stringify(versions));
}

function getLocalCoverLetters(): CoverLetter[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(LOCAL_COVER_LETTERS_KEY) || '[]');
  } catch { return []; }
}

function setLocalCoverLetters(letters: CoverLetter[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_COVER_LETTERS_KEY, JSON.stringify(letters));
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

    return (data || []).map((r: any) => ({
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
      const existing = resumes.findIndex((r: any) => r.id === id);
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
      return getLocalResumes().find((r: any) => r.id === resumeId) || null;
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
      const resumes = getLocalResumes().filter((r: any) => r.id !== resumeId);
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
      const r = resumes.find((r: any) => r.id === resumeId);
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

  // ── Version History ────────────────────────────────────────

  /** Save a snapshot of the current resume as a named version */
  static async saveVersion(
    userId: string,
    resumeId: string,
    title: string
  ): Promise<string> {
    const resume = await this.loadResume(userId, resumeId);
    if (!resume) throw new Error('Resume not found');

    if (!isSupabaseConfigured || !supabase) {
      const versions = getLocalVersions();
      const id = crypto.randomUUID();
      versions.unshift({
        id, resumeId, title,
        data: resume.data, template: resume.template,
        theme: resume.theme, createdAt: new Date().toISOString(),
      });
      setLocalVersions(versions);
      return id;
    }

    const { data, error } = await supabase
      .from('resume_versions')
      .insert({
        resume_id: resumeId,
        user_id: userId,
        title,
        data: resume.data,
        template: resume.template,
        theme: resume.theme,
      })
      .select('id')
      .single();
    if (error) throw new Error(error.message);
    return data.id;
  }

  /** List all versions of a specific resume */
  static async listVersions(userId: string, resumeId: string): Promise<ResumeVersion[]> {
    if (!isSupabaseConfigured || !supabase) {
      return getLocalVersions().filter((v: any) => v.resumeId === resumeId);
    }

    const { data, error } = await supabase
      .from('resume_versions')
      .select('*')
      .eq('resume_id', resumeId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map((v: any) => ({
      id: v.id,
      resumeId: v.resume_id,
      title: v.title,
      data: v.data as ResumeData,
      template: v.template,
      theme: v.theme || {},
      createdAt: v.created_at,
    }));
  }

  /** Delete a version */
  static async deleteVersion(userId: string, versionId: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      setLocalVersions(getLocalVersions().filter((v: any) => v.id !== versionId));
      return;
    }
    const { error } = await supabase
      .from('resume_versions')
      .delete()
      .eq('id', versionId)
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
  }

  // ── Cover Letters ──────────────────────────────────────────

  /** Save a cover letter */
  static async saveCoverLetter(
    userId: string,
    cl: { id?: string; resumeId?: string; jobTitle: string; company: string; content: string }
  ): Promise<string> {
    if (!isSupabaseConfigured || !supabase) {
      const letters = getLocalCoverLetters();
      const id = cl.id || crypto.randomUUID();
      const now = new Date().toISOString();
      const existing = letters.findIndex((l: any) => l.id === id);
      const saved: CoverLetter = {
        id, resumeId: cl.resumeId || null,
        jobTitle: cl.jobTitle, company: cl.company,
        content: cl.content,
        createdAt: existing >= 0 ? letters[existing].createdAt : now,
        updatedAt: now,
      };
      if (existing >= 0) letters[existing] = saved;
      else letters.unshift(saved);
      setLocalCoverLetters(letters);
      return id;
    }

    if (cl.id) {
      const { error } = await supabase
        .from('cover_letters')
        .update({ job_title: cl.jobTitle, company: cl.company, content: cl.content })
        .eq('id', cl.id)
        .eq('user_id', userId);
      if (error) throw new Error(error.message);
      return cl.id;
    } else {
      const { data, error } = await supabase
        .from('cover_letters')
        .insert({
          user_id: userId,
          resume_id: cl.resumeId || null,
          job_title: cl.jobTitle,
          company: cl.company,
          content: cl.content,
        })
        .select('id')
        .single();
      if (error) throw new Error(error.message);
      return data.id;
    }
  }

  /** List cover letters for the current user */
  static async listCoverLetters(userId: string): Promise<CoverLetter[]> {
    if (!isSupabaseConfigured || !supabase) {
      return getLocalCoverLetters();
    }

    const { data, error } = await supabase
      .from('cover_letters')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map((cl: any) => ({
      id: cl.id,
      resumeId: cl.resume_id,
      jobTitle: cl.job_title,
      company: cl.company,
      content: cl.content,
      createdAt: cl.created_at,
      updatedAt: cl.updated_at,
    }));
  }

  /** Delete a cover letter */
  static async deleteCoverLetter(userId: string, clId: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      setLocalCoverLetters(getLocalCoverLetters().filter((l: any) => l.id !== clId));
      return;
    }
    const { error } = await supabase
      .from('cover_letters')
      .delete()
      .eq('id', clId)
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
  }
}

