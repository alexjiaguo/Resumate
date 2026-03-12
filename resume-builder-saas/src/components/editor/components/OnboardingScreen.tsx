import React, { useState, useRef, useCallback } from 'react';
import { useResumeStore } from '@/store/resume-store';
import { FileParserService } from '@/services/FileParserService';
import { ResumeParserService } from '@/services/ResumeParserService';
import {
  Upload, FileText, Plus, CheckCircle, AlertCircle, Loader2, Sparkles,
  ArrowLeft, Briefcase, GraduationCap, Zap,
} from 'lucide-react';

type Screen = 'choose' | 'upload' | 'ai';

const OnboardingScreen: React.FC = () => {
  const { updateData, setOnboardingComplete, setUploadedResumeText, apiSettings } = useResumeStore();
  const [screen, setScreen] = useState<Screen>('choose');

  // Upload state
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI state
  const [aiForm, setAiForm] = useState({ jobTitle: '', industry: '', experienceLevel: 'mid' });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  // ===== Upload handlers =====
  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setUploadResult(null);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const rawText = await FileParserService.parseFile(file);
      const resumeData = ResumeParserService.parse(rawText, ext);
      setUploadedResumeText(rawText);
      updateData(resumeData);
      setUploadResult({ success: true, message: `Successfully parsed "${file.name}". Your resume is ready!` });
      setTimeout(() => setOnboardingComplete(), 1500);
    } catch (err) {
      setUploadResult({ success: false, message: `Could not parse "${file.name}": ${err instanceof Error ? err.message : String(err)}` });
      setIsProcessing(false);
    }
  }, [updateData, setOnboardingComplete, setUploadedResumeText]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  // ===== AI handler =====
  const handleAiGenerate = async () => {
    if (!aiForm.jobTitle.trim()) { setAiError('Please enter a job title.'); return; }

    const getApiKey = () => {
      if (apiSettings.selectedProvider === 'openai') return apiSettings.openaiKey;
      if (apiSettings.selectedProvider === 'gemini') return apiSettings.geminiKey;
      return apiSettings.deepseekKey;
    };
    const getBaseUrl = () => {
      if (apiSettings.selectedProvider === 'openai') return apiSettings.openaiBaseUrl || 'https://api.openai.com/v1';
      if (apiSettings.selectedProvider === 'gemini') return apiSettings.geminiBaseUrl || 'https://generativelanguage.googleapis.com/v1beta/openai';
      return apiSettings.customBaseUrl;
    };

    const apiKey = getApiKey();
    if (!apiKey) {
      setAiError('No API key configured. Go to the AI tab in the editor to set up your API key, then try again.');
      return;
    }

    setAiLoading(true);
    setAiError('');

    const levelMap: Record<string, string> = {
      entry: '0-2 years', mid: '3-6 years', senior: '7-12 years', executive: '12+ years',
    };

    const prompt = `Generate a professional resume for a ${aiForm.jobTitle}${aiForm.industry ? ` in the ${aiForm.industry} industry` : ''} with ${levelMap[aiForm.experienceLevel] || '3-6 years'} of experience (${aiForm.experienceLevel} level).

Create realistic, compelling content. Use specific numbers and measurable outcomes. Follow best practices for ATS-optimized resumes.

Respond with ONLY this JSON (no markdown, no code fences):
{
  "personalInfo": {"fullName":"John Doe","title":"${aiForm.jobTitle}","email":"john.doe@example.com","phone":"+1 234 567 8900","linkedin":"linkedin.com/in/johndoe","location":""},
  "summary": "3-4 sentence professional summary",
  "experience": [
    {"id":"1","company":"Company Name","location":"City, State","title":"${aiForm.jobTitle}","dates":"2020 - Present","achievements":["bullet1","bullet2","bullet3","bullet4"]},
    {"id":"2","company":"Previous Company","location":"City, State","title":"Previous Title","dates":"2017 - 2020","achievements":["bullet1","bullet2","bullet3"]}
  ],
  "education": [{"id":"1","school":"University Name, City, State","degree":"Relevant Degree","dates":"2013 - 2017","location":"City, State"}],
  "skills": [{"id":"1","name":"Skill 1","isHighlighted":true},{"id":"2","name":"Skill 2","isHighlighted":true},{"id":"3","name":"Skill 3","isHighlighted":false},{"id":"4","name":"Skill 4","isHighlighted":false},{"id":"5","name":"Skill 5","isHighlighted":false}],
  "technicalSkills": [{"id":"1","category":"Category","skills":"skill1, skill2, skill3"}],
  "languages": ["English (Native)"],
  "certifications": []
}`;

    try {
      const response = await fetch(`${getBaseUrl()}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: apiSettings.model || 'gpt-4o',
          messages: [
            { role: 'system', content: 'You are a professional resume writer. You output ONLY valid raw JSON — never markdown, never code fences.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          ...(apiSettings.selectedProvider === 'openai' ? { response_format: { type: 'json_object' } } : {}),
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      let content = data.choices[0].message.content;
      content = content.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
      const resumeData = JSON.parse(content);
      updateData(resumeData);
      setOnboardingComplete();
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Failed to generate resume. Please check your API key and try again.');
      setAiLoading(false);
    }
  };

  // ===== Render =====
  return (
    <div style={overlayStyle}>
      <div style={containerStyle}>
        {/* Hero */}
        <div style={heroStyle}>
          <div style={logoStyle}><FileText size={28} color="#fff" /></div>
          <h1 style={titleStyle}>ResuMate</h1>
          <p style={subtitleStyle}>
            {screen === 'choose'
              ? 'How would you like to get started?'
              : screen === 'upload'
              ? 'Upload your existing resume'
              : 'Let AI create your resume'}
          </p>
        </div>

        {/* ===== CHOOSE SCREEN ===== */}
        {screen === 'choose' && (
          <div style={cardsGridStyle}>
            {/* Card 1: Start Fresh */}
            <button style={cardStyle} onClick={() => setOnboardingComplete()}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)'; }}
            >
              <div style={cardIconStyle}><Plus size={24} color="#6366f1" /></div>
              <h3 style={cardTitleStyle}>Start from Scratch</h3>
              <p style={cardDescStyle}>Begin with a blank template and fill in your details manually</p>
            </button>

            {/* Card 2: Upload */}
            <button style={cardStyle} onClick={() => setScreen('upload')}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(16,185,129,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)'; }}
            >
              <div style={{ ...cardIconStyle, background: 'rgba(16,185,129,0.15)' }}><Upload size={24} color="#10b981" /></div>
              <h3 style={cardTitleStyle}>Upload Existing</h3>
              <p style={cardDescStyle}>Import from PDF, DOCX, or Markdown file — we'll parse it instantly</p>
            </button>

            {/* Card 3: AI Create */}
            <button style={{ ...cardStyle, position: 'relative', overflow: 'hidden' }} onClick={() => setScreen('ai')}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(245,158,11,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)'; }}
            >
              <div style={{ position: 'absolute', top: '8px', right: '8px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(245,158,11,0.2)', color: '#f59e0b', fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px' }}>AI</div>
              <div style={{ ...cardIconStyle, background: 'rgba(245,158,11,0.15)' }}><Sparkles size={24} color="#f59e0b" /></div>
              <h3 style={cardTitleStyle}>Create with AI</h3>
              <p style={cardDescStyle}>Tell us your role and experience — AI generates a polished resume</p>
            </button>
          </div>
        )}

        {/* ===== UPLOAD SCREEN ===== */}
        {screen === 'upload' && (
          <div style={panelStyle}>
            <button onClick={() => { setScreen('choose'); setUploadResult(null); setIsProcessing(false); }} style={backBtnStyle}>
              <ArrowLeft size={16} /> Back
            </button>
            <div
              style={{
                ...dropZoneStyle,
                borderColor: isDragging ? '#6366f1' : uploadResult?.success ? '#10b981' : 'rgba(255,255,255,0.2)',
                background: isDragging ? 'rgba(99,102,241,0.08)' : uploadResult?.success ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
              }}
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
            >
              {isProcessing ? (
                <div style={statusStyle}>
                  <Loader2 size={32} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
                  <p style={statusTextStyle}>Parsing your resume...</p>
                </div>
              ) : uploadResult ? (
                <div style={statusStyle}>
                  {uploadResult.success ? (
                    <><CheckCircle size={32} color="#10b981" /><p style={{ ...statusTextStyle, color: '#a7f3d0' }}>{uploadResult.message}</p></>
                  ) : (
                    <><AlertCircle size={32} color="#ef4444" /><p style={{ ...statusTextStyle, color: '#fca5a5' }}>{uploadResult.message}</p></>
                  )}
                </div>
              ) : (
                <>
                  <Upload size={36} color={isDragging ? '#6366f1' : '#64748b'} />
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#e2e8f0' }}>Drag & drop your resume here</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
                    Supports <strong>.pdf</strong>, <strong>.docx</strong>, <strong>.md</strong>, and <strong>.txt</strong>
                  </p>
                  <button onClick={() => fileInputRef.current?.click()} style={browseBtnStyle}>Browse Files</button>
                </>
              )}
            </div>
            <div style={{ textAlign: 'center', margin: '16px 0' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>or</span>
            </div>
            <button onClick={() => setOnboardingComplete()} style={altBtnStyle}>
              <Plus size={16} /> Start with blank resume instead
            </button>
          </div>
        )}

        {/* ===== AI SCREEN ===== */}
        {screen === 'ai' && (
          <div style={panelStyle}>
            <button onClick={() => { setScreen('choose'); setAiError(''); }} style={backBtnStyle}>
              <ArrowLeft size={16} /> Back
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={formGroupStyle}>
                <label style={labelStyle}><Briefcase size={14} /> Job Title *</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. Senior Product Manager, Full Stack Developer"
                  value={aiForm.jobTitle}
                  onChange={e => setAiForm(p => ({ ...p, jobTitle: e.target.value }))}
                  autoFocus
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}><GraduationCap size={14} /> Industry</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. FinTech, Healthcare, E-commerce (optional)"
                  value={aiForm.industry}
                  onChange={e => setAiForm(p => ({ ...p, industry: e.target.value }))}
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}><Zap size={14} /> Experience Level</label>
                <select
                  style={inputStyle}
                  value={aiForm.experienceLevel}
                  onChange={e => setAiForm(p => ({ ...p, experienceLevel: e.target.value }))}
                >
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (3-6 years)</option>
                  <option value="senior">Senior (7-12 years)</option>
                  <option value="executive">Executive (12+ years)</option>
                </select>
              </div>

              {aiError && (
                <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: '13px' }}>
                  {aiError}
                </div>
              )}

              <button
                onClick={handleAiGenerate}
                disabled={aiLoading}
                style={{
                  ...generateBtnStyle,
                  opacity: aiLoading ? 0.7 : 1,
                  cursor: aiLoading ? 'wait' : 'pointer',
                }}
              >
                {aiLoading ? (
                  <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Generating your resume...</>
                ) : (
                  <><Sparkles size={18} /> Generate Resume</>
                )}
              </button>

              <p style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', margin: 0 }}>
                Uses your configured AI provider. You can edit everything after generation.
              </p>
            </div>

            <div style={{ textAlign: 'center', margin: '16px 0 0' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>or</span>
            </div>
            <button onClick={() => setOnboardingComplete()} style={altBtnStyle}>
              <Plus size={16} /> Start with blank resume instead
            </button>
          </div>
        )}

        {/* Footer */}
        <p style={footerStyle}>Your data is saved locally in your browser. Nothing is sent to any server.</p>
      </div>

      <input ref={fileInputRef} type="file" accept=".md,.pdf,.docx,.doc,.txt" onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }} style={{ display: 'none' }} />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ===== Styles =====
const overlayStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, zIndex: 100,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
  padding: '20px',
};

const containerStyle: React.CSSProperties = {
  width: '100%', maxWidth: '720px',
  display: 'flex', flexDirection: 'column', gap: '24px',
};

const heroStyle: React.CSSProperties = {
  textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
};

const logoStyle: React.CSSProperties = {
  width: '56px', height: '56px', borderRadius: '16px',
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
};

const titleStyle: React.CSSProperties = {
  margin: 0, fontSize: '28px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px',
};

const subtitleStyle: React.CSSProperties = {
  margin: 0, fontSize: '15px', color: '#94a3b8', lineHeight: 1.5,
};

// ===== Card Grid =====
const cardsGridStyle: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px',
};

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '16px', padding: '28px 20px',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
  cursor: 'pointer', transition: 'all 0.25s ease',
  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
  textAlign: 'center', color: '#f8fafc',
};

const cardIconStyle: React.CSSProperties = {
  width: '52px', height: '52px', borderRadius: '14px',
  background: 'rgba(99,102,241,0.15)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const cardTitleStyle: React.CSSProperties = {
  margin: 0, fontSize: '15px', fontWeight: 700, color: '#f1f5f9',
};

const cardDescStyle: React.CSSProperties = {
  margin: 0, fontSize: '12px', color: '#94a3b8', lineHeight: 1.5,
};

// ===== Panel (Upload / AI) =====
const panelStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '16px', padding: '24px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
};

const backBtnStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '6px',
  background: 'transparent', border: 'none', color: '#94a3b8',
  fontSize: '13px', cursor: 'pointer', marginBottom: '16px', padding: 0,
};

const dropZoneStyle: React.CSSProperties = {
  border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '12px',
  padding: '36px 24px', display: 'flex', flexDirection: 'column',
  alignItems: 'center', gap: '12px', textAlign: 'center',
  transition: 'all 0.2s', cursor: 'pointer', minHeight: '180px', justifyContent: 'center',
};

const browseBtnStyle: React.CSSProperties = {
  marginTop: '4px', padding: '8px 20px', borderRadius: '8px',
  border: '1px solid #6366f1', background: 'rgba(99,102,241,0.1)',
  color: '#a5b4fc', fontWeight: 600, fontSize: '13px', cursor: 'pointer',
};

const altBtnStyle: React.CSSProperties = {
  width: '100%', padding: '12px', borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)',
  color: '#94a3b8', fontWeight: 600, fontSize: '13px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
};

const statusStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
};

const statusTextStyle: React.CSSProperties = {
  margin: 0, fontSize: '13px', color: '#e2e8f0', textAlign: 'center', lineHeight: 1.5,
};

// ===== AI Form =====
const formGroupStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: '6px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '12px', fontWeight: 600, color: '#cbd5e1',
  display: 'flex', alignItems: 'center', gap: '6px',
};

const inputStyle: React.CSSProperties = {
  padding: '10px 14px', borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)',
  color: '#f1f5f9', fontSize: '14px', outline: 'none',
  transition: 'border-color 0.2s',
};

const generateBtnStyle: React.CSSProperties = {
  width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
  color: '#fff', fontWeight: 700, fontSize: '15px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
  boxShadow: '0 4px 16px rgba(245,158,11,0.3)',
  transition: 'all 0.2s',
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center', fontSize: '11px', color: '#64748b', margin: 0,
};

export default OnboardingScreen;
