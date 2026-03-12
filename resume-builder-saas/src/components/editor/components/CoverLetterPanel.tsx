'use client';

import React, { useState } from 'react';
import { LLMService, LLMProvider } from '@/services/LLMService';
import { ResumeService } from '@/services/ResumeService';
import type { ResumeData } from '@/types';
import { Loader2, FileText, Download, Copy, Save } from 'lucide-react';

interface Props {
  resumeData: ResumeData;
  userId: string;
  resumeId: string | null;
  getProvider: () => LLMProvider;
}

const CoverLetterPanel: React.FC<Props> = ({ resumeData, userId, resumeId, getProvider }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [company, setCompany] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      setError('Paste a job description first.');
      return;
    }
    if (!company.trim()) {
      setError('Enter the company name.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const provider = getProvider();
      const result = await LLMService.generateCoverLetter(
        provider,
        JSON.stringify(resumeData),
        jobDescription,
        company.trim()
      );
      setContent(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await ResumeService.saveCoverLetter(userId, {
        resumeId: resumeId || undefined,
        jobTitle: resumeData.personalInfo.title || 'Untitled',
        company: company.trim(),
        content,
      });
      alert('Cover letter saved!');
    } catch (err) {
      alert('Failed to save: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cover_Letter_${company.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
        Generate a tailored cover letter based on your resume and a target job description.
      </p>

      <input
        className="input-field"
        placeholder="Company name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <textarea
        className="input-field"
        placeholder="Paste the target job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={4}
        style={{ resize: 'vertical', fontFamily: 'inherit', fontSize: '12px' }}
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="btn-ai"
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
      >
        {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <FileText size={16} />}
        {loading ? 'Generating...' : 'Generate Cover Letter'}
      </button>

      {error && (
        <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger)', fontSize: '12px', color: 'var(--color-danger)' }}>
          {error}
        </div>
      )}

      {content && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <textarea
            className="input-field"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            style={{
              resize: 'vertical', fontFamily: 'Georgia, serif', fontSize: '12px',
              lineHeight: 1.7, whiteSpace: 'pre-wrap',
            }}
          />
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={handleCopy} className="btn-outline-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Copy size={11} /> {copied ? 'Copied!' : 'Copy'}
            </button>
            <button onClick={handleDownload} className="btn-outline-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Download size={11} /> Download
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-outline-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Save size={11} /> {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverLetterPanel;
