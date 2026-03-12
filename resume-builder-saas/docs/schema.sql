-- ============================================================
-- ResuMate SaaS — Schema Migrations for Phase 2 & 3
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================

-- 1. Resume Versions
-- Stores immutable snapshots of a resume at a point in time.
CREATE TABLE IF NOT EXISTS resume_versions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resume_id   UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL DEFAULT 'Untitled version',
  data        JSONB NOT NULL,
  template    TEXT NOT NULL DEFAULT 'classic',
  theme       JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups by resume
CREATE INDEX IF NOT EXISTS idx_resume_versions_resume
  ON resume_versions(resume_id, created_at DESC);

-- RLS: Users can only see their own versions
ALTER TABLE resume_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own versions"
  ON resume_versions FOR ALL
  USING (auth.uid() = user_id);

-- 2. Cover Letters
-- Stores generated cover letters tied to a resume + job.
CREATE TABLE IF NOT EXISTS cover_letters (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resume_id   UUID REFERENCES resumes(id) ON DELETE SET NULL,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_title   TEXT NOT NULL DEFAULT '',
  company     TEXT NOT NULL DEFAULT '',
  content     TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cover_letters_user
  ON cover_letters(user_id, updated_at DESC);

ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own cover letters"
  ON cover_letters FOR ALL
  USING (auth.uid() = user_id);
