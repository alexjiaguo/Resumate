'use client';

import React, { useState } from 'react';
import { LLMService, LLMProvider } from '@/services/LLMService';
import type { ATSResult, ResumeData } from '@/types';
import { Loader2, Target, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  resumeData: ResumeData;
  getProvider: () => LLMProvider;
}

const SEVERITY_COLORS: Record<string, string> = {
  high: '#dc2626',
  medium: '#ea580c',
  low: '#65a30d',
};

const ATSCheckerPanel: React.FC<Props> = ({ resumeData, getProvider }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<ATSResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!jobDescription.trim()) {
      setError('Paste a job description first.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const provider = getProvider();
      const raw = await LLMService.evaluateATS(provider, JSON.stringify(resumeData), jobDescription);
      const parsed: ATSResult = JSON.parse(raw);
      setResult(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) =>
    score >= 80 ? '#16a34a' : score >= 60 ? '#ea580c' : '#dc2626';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
        Paste a job description to see how well your resume matches — scored like a real ATS.
      </p>

      <textarea
        className="input-field"
        placeholder="Paste the target job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={5}
        style={{ resize: 'vertical', fontFamily: 'inherit', fontSize: '12px' }}
      />

      <button
        onClick={handleCheck}
        disabled={loading}
        className="btn-ai"
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
      >
        {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Target size={16} />}
        {loading ? 'Scanning...' : 'Check ATS Score'}
      </button>

      {error && (
        <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger)', fontSize: '12px', color: 'var(--color-danger)' }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Score ring */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px', borderRadius: '12px',
            background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
          }}>
            <div style={{ position: 'relative', width: 80, height: 80 }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="var(--color-border)" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="34" fill="none"
                  stroke={scoreColor(result.score)} strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={`${(result.score / 100) * 213.6} 213.6`}
                  transform="rotate(-90 40 40)"
                  style={{ transition: 'stroke-dasharray 0.6s ease' }}
                />
              </svg>
              <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                fontSize: '22px', fontWeight: 800, color: scoreColor(result.score),
              }}>
                {result.score}
              </div>
            </div>
            <div style={{ marginLeft: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>
                {result.score >= 80 ? 'Strong Match' : result.score >= 60 ? 'Needs Work' : 'Weak Match'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                {result.matchedKeywords.length} matched · {result.missingKeywords.length} missing
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={11} color="#16a34a" /> Matched
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                {result.matchedKeywords.map((kw, i) => (
                  <span key={i} style={{
                    padding: '2px 6px', borderRadius: '4px', fontSize: '10px',
                    background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.2)', color: '#16a34a',
                  }}>{kw}</span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <XCircle size={11} color="#dc2626" /> Missing
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                {result.missingKeywords.map((kw, i) => (
                  <span key={i} style={{
                    padding: '2px 6px', borderRadius: '4px', fontSize: '10px',
                    background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626',
                  }}>{kw}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertTriangle size={11} /> Suggestions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {result.feedback.map((fb, i) => (
                <div key={i} style={{
                  padding: '6px 8px', borderRadius: '6px', fontSize: '11px', lineHeight: 1.4,
                  borderLeft: `3px solid ${SEVERITY_COLORS[fb.severity]}`,
                  background: 'var(--color-bg-card)',
                }}>
                  {fb.message}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSCheckerPanel;
