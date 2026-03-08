import React, { useState, useRef } from 'react';
import { useResumeStore } from '../store';
import { FileParserService } from '../services/FileParserService';
import { LLMService, LLMProvider } from '../services/LLMService';
import { Upload, FileText, Bot, Check, AlertCircle, X, Loader2, FastForward, Plus, Trash2 } from 'lucide-react';
import { ResumeData } from '../types';

interface TailoringHubProps {
  onClose: () => void;
}

interface SupplementalDoc {
  id: string;
  name: string;
  content: string;
}

const TailoringHub: React.FC<TailoringHubProps> = ({ onClose }) => {
  const { 
    apiSettings, 
    sourceMaterials, 
    setSourceMaterial, 
    draftState, 
    setDraft, 
    commitDraft,
    data: currentResume,
    uploadedResumeText
  } = useResumeStore();

  const [activeTab, setActiveTab] = useState<'upload' | 'review'>('upload');
  const [resumeText, setResumeText] = useState<string>(uploadedResumeText || '');
  const [supplementalDocs, setSupplementalDocs] = useState<SupplementalDoc[]>([]);
  const [jobDescription, setJobDescription] = useState<string>(sourceMaterials.jobDescription);
  const [pasteTarget, setPasteTarget] = useState<'resume' | 'jd' | null>(null);
  const [pasteDocId, setPasteDocId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentUploadTarget, setCurrentUploadTarget] = useState<'resume' | 'supplemental' | 'jd' | null>(null);
  const [pendingDocId, setPendingDocId] = useState<string | null>(null);

  const addSupplementalDoc = () => {
    setSupplementalDocs(prev => [...prev, { id: `doc-${Date.now()}`, name: '', content: '' }]);
  };

  const removeSupplementalDoc = (id: string) => {
    setSupplementalDocs(prev => prev.filter(d => d.id !== id));
  };

  const updateDocContent = (id: string, content: string, name?: string) => {
    setSupplementalDocs(prev => prev.map(d => d.id === id ? { ...d, content, name: name || d.name || 'Pasted text' } : d));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await FileParserService.parseFile(file);
      if (currentUploadTarget === 'resume') {
        setResumeText(text);
      } else if (currentUploadTarget === 'jd') {
        setJobDescription(text);
        setSourceMaterial({ jobDescription: text });
      } else if (currentUploadTarget === 'supplemental' && pendingDocId) {
        updateDocContent(pendingDocId, text, file.name);
      }
    } catch (err) {
      setDraft({ error: `Parsing failed: ${err instanceof Error ? err.message : String(err)}` });
    } finally {
      setCurrentUploadTarget(null);
      setPendingDocId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerUpload = (target: 'resume' | 'supplemental' | 'jd', docId?: string) => {
    setCurrentUploadTarget(target);
    if (docId) setPendingDocId(docId);
    fileInputRef.current?.click();
  };

  const handleGenerate = async () => {
    const apiKey = apiSettings.selectedProvider === 'openai' ? apiSettings.openaiKey 
      : apiSettings.selectedProvider === 'gemini' ? apiSettings.geminiKey 
      : apiSettings.deepseekKey;

    if (!apiKey) {
      setDraft({ error: 'API Key missing. Please configure in the AI tab settings.' });
      return;
    }

    setDraft({ isGenerating: true, error: null });
    
    try {
      const provider: LLMProvider = {
        name: apiSettings.selectedProvider,
        baseUrl: apiSettings.selectedProvider === 'openai' 
          ? (apiSettings.openaiBaseUrl || 'https://api.openai.com/v1')
          : apiSettings.selectedProvider === 'gemini' 
            ? (apiSettings.geminiBaseUrl || 'https://generativelanguage.googleapis.com/v1beta/openai')
            : apiSettings.customBaseUrl,
        apiKey,
        model: apiSettings.model
      };

      // Join all supplemental docs as a single string
      const supplementalText = supplementalDocs
        .filter(d => d.content.trim())
        .map(d => `--- ${d.name || 'Document'} ---\n${d.content}`)
        .join('\n\n');

      const result = await LLMService.tailorResume(
        provider,
        resumeText || JSON.stringify(currentResume),
        supplementalText,
        jobDescription
      );

      const parsedResult: ResumeData = JSON.parse(result);
      setDraft({ draftResume: parsedResult, isGenerating: false });
      setActiveTab('review');
    } catch (err) {
      setDraft({ 
        isGenerating: false, 
        error: `Generation failed: ${err instanceof Error ? err.message : String(err)}` 
      });
    }
  };

  const handleFastTrack = () => {
    try {
      const parsed = JSON.parse(jobDescription);
      if (parsed.personalInfo && parsed.experience) {
        setDraft({ draftResume: parsed });
        setActiveTab('review');
      } else {
        throw new Error('Invalid Resume JSON structure');
      }
    } catch (e) {
      setDraft({ error: 'Fast-track requires a valid Resume JSON object in the Job Description field.' });
    }
  };

  const handleCommit = () => {
    commitDraft();
    onClose();
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div style={modalHeaderStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bot size={24} color="#3498db" />
            <h2 style={{ margin: 0 }}>Tailoring Hub</h2>
          </div>
          <button onClick={onClose} style={closeBtnStyle}><X size={20} /></button>
        </div>

        <div style={tabsStyle}>
          <button 
            style={{ ...tabStyle, borderBottomColor: activeTab === 'upload' ? '#3498db' : 'transparent', color: activeTab === 'upload' ? '#3498db' : '#666' }}
            onClick={() => setActiveTab('upload')}
          >
            1. Source Materials
          </button>
          <button 
            style={{ ...tabStyle, borderBottomColor: activeTab === 'review' ? '#3498db' : 'transparent', color: activeTab === 'review' ? '#3498db' : '#666' }}
            onClick={() => setActiveTab('review')}
            disabled={!draftState.draftResume}
          >
            2. Review & Confirm
          </button>
        </div>

        <div style={scrollContentStyle}>
          {activeTab === 'upload' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={sectionStyle}>
                <div style={sectionTitleContainer}>
                  <h3 style={sectionTitleStyle}>Base Resume (Optional)</h3>
                  <span style={hintStyle}>{uploadedResumeText ? 'Pre-filled from your upload' : "If empty, we'll use your current resume."}</span>
                </div>
                <div style={uploadZoneStyle}>
                  {resumeText ? (
                    <div style={successStateStyle}>
                      <FileText size={20} />
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Resume loaded ({resumeText.length} chars)</span>
                      <button onClick={() => setResumeText('')} style={textBtnStyle}>Clear</button>
                    </div>
                  ) : (
                    <div style={buttonGroupStyle}>
                      <button onClick={() => triggerUpload('resume')} style={uploadBtnStyle}><Upload size={16} /> Upload PDF/DOCX/MD</button>
                      <button onClick={() => setPasteTarget('resume')} style={pasteBtnStyle}>Paste Text</button>
                    </div>
                  )}
                  {pasteTarget === 'resume' && (
                    <textarea 
                      style={textAreaStyle} 
                      placeholder="Paste resume text here..." 
                      onChange={(e) => setResumeText(e.target.value)}
                      onBlur={() => setPasteTarget(null)}
                      autoFocus
                    />
                  )}
                </div>
              </div>

              <div style={sectionStyle}>
                <div style={sectionTitleContainer}>
                  <h3 style={sectionTitleStyle}>Target Job Description</h3>
                  <span style={requiredStyle}>Required</span>
                </div>
                <div style={uploadZoneStyle}>
                  <textarea 
                    style={{ ...textAreaStyle, minHeight: '120px' }} 
                    placeholder="Paste the Job Description here..." 
                    value={jobDescription}
                    onChange={(e) => {
                      setJobDescription(e.target.value);
                      setSourceMaterial({ jobDescription: e.target.value });
                    }}
                  />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    <button onClick={() => triggerUpload('jd')} style={smallBtnStyle}><Upload size={14} /> Upload JD</button>
                    <button onClick={handleFastTrack} style={{ ...smallBtnStyle, background: '#f8f9fa', borderColor: '#d1d5db' }}><FastForward size={14} /> Fast-Track (JSON)</button>
                  </div>
                </div>
              </div>

              <div style={sectionStyle}>
                <div style={sectionTitleContainer}>
                  <h3 style={sectionTitleStyle}>Supplemental Documents</h3>
                  <span style={hintStyle}>Work history, cover letters, project docs, etc.</span>
                </div>
                {supplementalDocs.map((doc) => (
                  <div key={doc.id} style={{ ...uploadZoneStyle, position: 'relative' }}>
                    <button 
                      onClick={() => removeSupplementalDoc(doc.id)} 
                      style={{ position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: '2px' }}
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                    {doc.content ? (
                      <div style={successStateStyle}>
                        <FileText size={18} />
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '13px' }}>
                          {doc.name || 'Document'} ({doc.content.length} chars)
                        </span>
                        <button onClick={() => updateDocContent(doc.id, '', '')} style={textBtnStyle}>Clear</button>
                      </div>
                    ) : (
                      <div style={buttonGroupStyle}>
                        <button onClick={() => triggerUpload('supplemental', doc.id)} style={{ ...uploadBtnStyle, fontSize: '12px', padding: '8px' }}>
                          <Upload size={14} /> Upload File
                        </button>
                        <button onClick={() => setPasteDocId(doc.id)} style={{ ...pasteBtnStyle, fontSize: '12px', padding: '8px' }}>
                          Paste Text
                        </button>
                      </div>
                    )}
                    {pasteDocId === doc.id && (
                      <textarea 
                        style={textAreaStyle} 
                        placeholder="Paste document text here..." 
                        onChange={(e) => updateDocContent(doc.id, e.target.value, 'Pasted text')}
                        onBlur={() => setPasteDocId(null)}
                        autoFocus
                      />
                    )}
                  </div>
                ))}
                <button 
                  onClick={addSupplementalDoc}
                  style={{
                    padding: '10px',
                    borderRadius: '6px',
                    border: '2px dashed #d1d5db',
                    background: 'transparent',
                    color: '#3498db',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '13px',
                  }}
                >
                  <Plus size={16} /> Add Document
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={alertStyle}>
                <Check size={18} />
                <span>Tailored resume draft is ready! Review the changes below.</span>
              </div>
              <pre style={previewJsonStyle}>
                {JSON.stringify(draftState.draftResume, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {draftState.error && (
          <div style={errorStyle}>
            <AlertCircle size={18} />
            <span>{draftState.error}</span>
          </div>
        )}

        <div style={modalFooterStyle}>
          {activeTab === 'upload' ? (
            <button 
              onClick={handleGenerate} 
              style={{ ...primaryBtnStyle, opacity: !jobDescription || draftState.isGenerating ? 0.7 : 1 }}
              disabled={!jobDescription || draftState.isGenerating}
            >
              {draftState.isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Tailoring with AI...
                </>
              ) : (
                <>
                  <Bot size={18} />
                  Draft with LLM
                </>
              )}
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button onClick={() => setActiveTab('upload')} style={secondaryBtnStyle}>Back</button>
              <button onClick={handleCommit} style={primaryBtnStyle}>Populate Template</button>
            </div>
          )}
        </div>
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileUpload}
        accept=".pdf,.docx,.doc,.txt,.md"
      />
    </div>
  );
};

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '20px',
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  width: '100%',
  maxWidth: '600px',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
};

const modalHeaderStyle: React.CSSProperties = {
  padding: '20px',
  borderBottom: '1px solid #eee',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const closeBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#999',
  padding: '5px',
};

const tabsStyle: React.CSSProperties = {
  display: 'flex',
  padding: '0 20px',
  borderBottom: '1px solid #eee',
};

const tabStyle: React.CSSProperties = {
  padding: '15px 20px',
  background: 'none',
  border: 'none',
  borderBottom: '2px solid transparent',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '14px',
  transition: 'all 0.2s',
};

const scrollContentStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: '20px',
};

const sectionStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const sectionTitleContainer: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '14px',
  fontWeight: '600',
  color: '#333',
};

const hintStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#666',
};

const requiredStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#e74c3c',
  fontWeight: '600',
};

const uploadZoneStyle: React.CSSProperties = {
  border: '2px dashed #e1e4e8',
  borderRadius: '8px',
  padding: '15px',
  background: '#f9fafb',
};

const buttonGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '10px',
};

const uploadBtnStyle: React.CSSProperties = {
  flex: 1,
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #3498db',
  background: '#fff',
  color: '#3498db',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontSize: '13px',
};

const pasteBtnStyle: React.CSSProperties = {
  flex: 1,
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  background: '#fff',
  color: '#4b5563',
  fontWeight: '600',
  cursor: 'pointer',
  fontSize: '13px',
};

const textAreaStyle: React.CSSProperties = {
  width: '100%',
  minHeight: '80px',
  padding: '12px',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  fontSize: '13px',
  marginTop: '10px',
  fontFamily: 'inherit',
  resize: 'vertical',
};

const successStateStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  color: '#10b981',
  fontSize: '13px',
  fontWeight: '500',
};

const textBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#3498db',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: '600',
};

const modalFooterStyle: React.CSSProperties = {
  padding: '20px',
  borderTop: '1px solid #eee',
  display: 'flex',
  gap: '10px',
};

const primaryBtnStyle: React.CSSProperties = {
  flex: 1,
  padding: '12px',
  borderRadius: '8px',
  border: 'none',
  background: '#3498db',
  color: '#fff',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontSize: '15px',
};

const secondaryBtnStyle: React.CSSProperties = {
  padding: '12px 24px',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  background: '#fff',
  color: '#4b5563',
  fontWeight: '600',
  cursor: 'pointer',
  fontSize: '15px',
};

const previewJsonStyle: React.CSSProperties = {
  background: '#1e293b',
  color: '#f8fafc',
  padding: '15px',
  borderRadius: '8px',
  fontSize: '12px',
  overflowX: 'auto',
  margin: 0,
};

const alertStyle: React.CSSProperties = {
  padding: '12px',
  background: '#ecfdf5',
  border: '1px solid #10b981',
  borderRadius: '8px',
  color: '#065f46',
  fontSize: '13px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const errorStyle: React.CSSProperties = {
  margin: '0 20px 20px',
  padding: '12px',
  background: '#fef2f2',
  border: '1px solid #ef4444',
  borderRadius: '8px',
  color: '#991b1b',
  fontSize: '13px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const smallBtnStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: '4px',
  border: '1px solid #3498db',
  background: '#fff',
  color: '#3498db',
  fontSize: '12px',
  fontWeight: '500',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

export default TailoringHub;
