import React, { useState, useRef, useCallback } from 'react';
import { useResumeStore } from '../store';
import { FileParserService } from '../services/FileParserService';
import { ResumeParserService } from '../services/ResumeParserService';
import { Upload, FileText, Plus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const OnboardingScreen: React.FC = () => {
  const { updateData, setOnboardingComplete, setUploadedResumeText } = useResumeStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string; fileName?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setUploadResult(null);

    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      
      // Extract raw text using FileParserService (handles PDF, DOCX, MD, TXT)
      const rawText = await FileParserService.parseFile(file);
      
      // Parse into structured ResumeData
      const resumeData = ResumeParserService.parse(rawText, ext);
      
      // Store the raw text for AI tailoring later
      setUploadedResumeText(rawText);
      
      // Populate the resume fields
      updateData(resumeData);
      
      setUploadResult({
        success: true,
        message: `Successfully parsed "${file.name}". Your resume data has been loaded!`,
        fileName: file.name,
      });

      // Auto-dismiss after a brief pause to show success
      setTimeout(() => {
        setOnboardingComplete();
      }, 1500);

    } catch (err) {
      setUploadResult({
        success: false,
        message: `Could not parse "${file.name}": ${err instanceof Error ? err.message : String(err)}. Try a different format or start fresh.`,
      });
      setIsProcessing(false);
    }
  }, [updateData, setOnboardingComplete, setUploadedResumeText]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleStartFresh = () => {
    setOnboardingComplete();
  };

  return (
    <div style={overlayStyle}>
      <div style={containerStyle}>
        {/* Hero Section */}
        <div style={heroStyle}>
          <div style={logoStyle}>
            <FileText size={28} color="#fff" />
          </div>
          <h1 style={titleStyle}>Resume Builder Pro</h1>
          <p style={subtitleStyle}>
            Build a professional resume in minutes. Upload an existing one or start from scratch.
          </p>
        </div>

        {/* Upload Area */}
        <div style={contentAreaStyle}>
          <div
            style={{
              ...dropZoneStyle,
              borderColor: isDragging ? '#6366f1' : uploadResult?.success ? '#10b981' : '#d1d5db',
              background: isDragging ? 'rgba(99, 102, 241, 0.05)' : uploadResult?.success ? 'rgba(16, 185, 129, 0.05)' : '#fafbfc',
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {isProcessing ? (
              <div style={statusStyle}>
                <Loader2 size={32} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
                <p style={statusTextStyle}>Parsing your resume...</p>
              </div>
            ) : uploadResult ? (
              <div style={statusStyle}>
                {uploadResult.success ? (
                  <>
                    <CheckCircle size={32} color="#10b981" />
                    <p style={{ ...statusTextStyle, color: '#065f46' }}>{uploadResult.message}</p>
                  </>
                ) : (
                  <>
                    <AlertCircle size={32} color="#ef4444" />
                    <p style={{ ...statusTextStyle, color: '#991b1b' }}>{uploadResult.message}</p>
                  </>
                )}
              </div>
            ) : (
              <>
                <Upload size={36} color={isDragging ? '#6366f1' : '#9ca3af'} />
                <p style={dropTextPrimaryStyle}>
                  Drag & drop your resume here
                </p>
                <p style={dropTextSecondaryStyle}>
                  Supports <strong>.md</strong>, <strong>.pdf</strong>, and <strong>.docx</strong> files
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={browseButtonStyle}
                >
                  Browse Files
                </button>
              </>
            )}
          </div>

          <div style={dividerStyle}>
            <span style={dividerTextStyle}>or</span>
          </div>

          <button onClick={handleStartFresh} style={startFreshStyle}>
            <Plus size={18} />
            Start with a blank resume
          </button>
        </div>

        {/* Footer hint */}
        <p style={footerStyle}>
          Your data is saved locally in your browser. Nothing is sent to any server.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.pdf,.docx,.doc,.txt"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Spin animation for loader */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// ===== Styles =====
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
  padding: '20px',
};

const containerStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '480px',
  display: 'flex',
  flexDirection: 'column',
  gap: '28px',
};

const heroStyle: React.CSSProperties = {
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
};

const logoStyle: React.CSSProperties = {
  width: '56px',
  height: '56px',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '28px',
  fontWeight: 800,
  color: '#f8fafc',
  letterSpacing: '-0.5px',
};

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '15px',
  color: '#94a3b8',
  lineHeight: 1.5,
  maxWidth: '360px',
};

const contentAreaStyle: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: '16px',
  padding: '28px',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)',
};

const dropZoneStyle: React.CSSProperties = {
  border: '2px dashed #d1d5db',
  borderRadius: '12px',
  padding: '36px 24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
  textAlign: 'center',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  minHeight: '180px',
  justifyContent: 'center',
};

const dropTextPrimaryStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '15px',
  fontWeight: 600,
  color: '#374151',
};

const dropTextSecondaryStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '13px',
  color: '#6b7280',
};

const browseButtonStyle: React.CSSProperties = {
  marginTop: '4px',
  padding: '8px 20px',
  borderRadius: '8px',
  border: '1px solid #6366f1',
  background: 'rgba(99, 102, 241, 0.08)',
  color: '#6366f1',
  fontWeight: 600,
  fontSize: '13px',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

const statusStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
};

const statusTextStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '13px',
  color: '#374151',
  textAlign: 'center',
  lineHeight: 1.5,
};

const dividerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  margin: '20px 0',
};

const dividerTextStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#9ca3af',
  fontWeight: 500,
  width: '100%',
  textAlign: 'center',
  position: 'relative',
  background: '#fff',
};

const startFreshStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  borderRadius: '10px',
  border: '1px solid #e5e7eb',
  background: '#f8fafc',
  color: '#374151',
  fontWeight: 600,
  fontSize: '14px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  transition: 'all 0.2s',
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '11px',
  color: '#64748b',
  margin: 0,
};

export default OnboardingScreen;
