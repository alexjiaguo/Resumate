import { z } from 'zod';

// Personal Info Validation
export const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  title: z.string().min(2).max(200),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number format').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  location: z.string().min(2).max(200).optional().or(z.literal('')),
});

// Experience Validation
export const experienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, 'Company name is required').max(200),
  location: z.string().max(200),
  title: z.string().min(1, 'Job title is required').max(200),
  dates: z.string().min(1, 'Dates are required').max(100),
  achievements: z.array(z.string().max(1000)),
});

// Education Validation
export const educationSchema = z.object({
  id: z.string(),
  school: z.string().min(1, 'School name is required').max(200),
  degree: z.string().min(1, 'Degree is required').max(200),
  dates: z.string().min(1, 'Dates are required').max(100),
  location: z.string().max(200).optional().or(z.literal('')),
});

// Skill Validation
export const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  isHighlighted: z.boolean(),
});

// Technical Skills Validation
export const technicalSkillSchema = z.object({
  id: z.string(),
  category: z.string().min(1).max(100),
  skills: z.string().max(500),
});

// API Settings Validation
export const apiSettingsSchema = z.object({
  openaiKey: z.string().optional(),
  geminiKey: z.string().optional(),
  deepseekKey: z.string().optional(),
  customBaseUrl: z.string().url().optional().or(z.literal('')),
  openaiBaseUrl: z.string().url(),
  geminiBaseUrl: z.string().url(),
  selectedProvider: z.enum(['openai', 'gemini', 'deepseek', 'custom']),
  model: z.string().min(1),
});

// Complete Resume Data Validation
export const resumeDataSchema = z.object({
  personalInfo: personalInfoSchema,
  summary: z.string().max(2000),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(skillSchema),
  technicalSkills: z.array(technicalSkillSchema),
  languages: z.array(z.string().max(100)),
  certifications: z.array(z.string().max(200)),
  sectionVisibility: z.record(z.string(), z.record(z.string(), z.boolean())).optional(),
});

// Validation helper functions
export function validatePersonalInfo(data: unknown) {
  return personalInfoSchema.safeParse(data);
}

export function validateExperience(data: unknown) {
  return experienceSchema.safeParse(data);
}

export function validateEducation(data: unknown) {
  return educationSchema.safeParse(data);
}

export function validateResumeData(data: unknown) {
  return resumeDataSchema.safeParse(data);
}

export function validateApiSettings(data: unknown) {
  return apiSettingsSchema.safeParse(data);
}
