'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ResumeService, SavedResume } from '@/services/ResumeService';

const TEMPLATE_LABELS: Record<string, string> = {
  classic: 'Classic Minimal', clean: 'Clean Layout', professional: 'Clean Professional',
  elegant: 'Elegant Two-Column', bold: 'Bold Engineer', ats: 'ATS Executive',
  academic: 'Academic', photo: 'Photo Header', premium: 'Premium Headshot',
};

export default function DashboardPage() {
  const { profile, signOut, loading: authLoading, isMockMode } = useAuth();
  const router = useRouter();
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [loading, setLoading] = useState(true);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState('');

  const userId = profile?.id || 'local';

  const loadResumes = useCallback(async () => {
    try {
      const data = await ResumeService.listResumes(userId);
      setResumes(data);
    } catch (err) { console.error('Failed to load resumes:', err); }
    finally { setLoading(false); }
  }, [userId]);

  useEffect(() => { if (!authLoading) loadResumes(); }, [authLoading, loadResumes]);

  const handleCreate = () => router.push('/editor');
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this resume? This cannot be undone.')) return;
    await ResumeService.deleteResume(userId, id);
    setResumes(prev => prev.filter(r => r.id !== id));
  };
  const handleDuplicate = async (id: string) => {
    await ResumeService.duplicateResume(userId, id);
    await loadResumes();
  };
  const handleRename = async (id: string) => {
    if (!renameTitle.trim()) return;
    await ResumeService.renameResume(userId, id, renameTitle.trim());
    setRenameId(null);
    await loadResumes();
  };
  const handleSignOut = async () => { await signOut(); router.push('/'); };
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: 'Inter, sans-serif' }}>
      {/* Top bar */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 32px', borderBottom: '1px solid #dadce0',
        background: '#fff', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#202124' }}>
          <img src="/logo.png" alt="ResuMate" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'contain' }} />
          <span style={{ fontSize: '16px', fontWeight: 700 }}>ResuMate</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{
            padding: '4px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: 600,
            background: profile?.tier === 'pro' ? '#E8960C' : '#f1f3f4',
            color: profile?.tier === 'pro' ? 'white' : '#5f6368',
            border: profile?.tier === 'pro' ? 'none' : '1px solid #dadce0',
          }}>{profile?.tier === 'pro' ? '⭐ Pro' : 'Free'}</span>
          <span style={{ fontSize: '14px', color: '#5f6368' }}>{profile?.fullName || profile?.email || 'User'}</span>
          <button onClick={handleSignOut} style={{
            padding: '6px 14px', borderRadius: '100px', cursor: 'pointer',
            border: '1px solid #dadce0', background: 'transparent', color: '#5f6368', fontSize: '13px',
          }}>Sign Out</button>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px', color: '#202124' }}>My Resumes</h1>
            <p style={{ color: '#5f6368', fontSize: '14px' }}>
              {resumes.length} resume{resumes.length !== 1 && 's'} saved{isMockMode && ' (stored locally)'}
            </p>
          </div>
          <button onClick={handleCreate} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Resume
          </button>
        </div>

        {profile?.tier === 'free' && (
          <div style={{
            background: 'rgba(232,150,12,0.05)', border: '1px solid rgba(232,150,12,0.15)',
            borderRadius: '16px', padding: '20px 24px', marginBottom: '28px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px', color: '#202124' }}>🚀 Unlock AI-Powered Resume Tailoring</p>
              <p style={{ color: '#5f6368', fontSize: '13px' }}>Pro users can tailor resumes to job descriptions with AI. $9/month.</p>
            </div>
            <Link href="/pricing" className="btn btn-primary" style={{ whiteSpace: 'nowrap', fontSize: '13px' }}>Upgrade to Pro</Link>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#5f6368' }}>Loading resumes...</div>
        ) : resumes.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 40px', background: '#fff',
            borderRadius: '16px', border: '1px dashed #dadce0',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px', color: '#202124' }}>No resumes yet</h2>
            <p style={{ color: '#5f6368', fontSize: '14px', marginBottom: '24px' }}>Create your first resume to get started.</p>
            <button onClick={handleCreate} className="btn btn-primary">Create Resume</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {resumes.map(resume => (
              <div key={resume.id} style={{
                background: '#fff', border: '1px solid #dadce0', borderRadius: '16px', padding: '20px',
                transition: 'border-color 0.2s, box-shadow 0.2s', cursor: 'pointer',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E8960C'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(232,150,12,0.1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#dadce0'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                {renameId === resume.id ? (
                  <form onSubmit={e => { e.preventDefault(); handleRename(resume.id); }} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <input autoFocus value={renameTitle} onChange={e => setRenameTitle(e.target.value)}
                      style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', background: '#fff', border: '1px solid #dadce0', color: '#202124', fontSize: '14px', outline: 'none' }} />
                    <button type="submit" style={{ padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', background: '#E8960C', border: 'none', color: 'white', fontSize: '12px' }}>Save</button>
                    <button type="button" onClick={() => setRenameId(null)} style={{ padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', background: 'transparent', border: '1px solid #dadce0', color: '#5f6368', fontSize: '12px' }}>✕</button>
                  </form>
                ) : (
                  <Link href={`/editor?id=${resume.id}`} style={{ color: '#202124', textDecoration: 'none' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>{resume.title}</h3>
                  </Link>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', background: '#f1f3f4', color: '#5f6368', border: '1px solid #dadce0' }}>
                    {TEMPLATE_LABELS[resume.template] || resume.template}
                  </span>
                  <span style={{ fontSize: '12px', color: '#9aa0a6' }}>{formatDate(resume.updatedAt)}</span>
                </div>
                <p style={{ fontSize: '13px', color: '#5f6368', marginBottom: '16px' }}>
                  {(resume.data as any)?.personalInfo?.fullName || 'No name set'}
                </p>
                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f3f4', paddingTop: '12px' }}>
                  <Link href={`/editor?id=${resume.id}`} style={{ padding: '6px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: 500, background: '#E8960C', color: 'white', textDecoration: 'none', border: 'none', cursor: 'pointer' }}>Edit</Link>
                  <button onClick={() => handleDuplicate(resume.id)} style={{ padding: '6px 12px', borderRadius: '100px', fontSize: '12px', background: 'transparent', border: '1px solid #dadce0', color: '#5f6368', cursor: 'pointer' }}>Duplicate</button>
                  <button onClick={() => { setRenameId(resume.id); setRenameTitle(resume.title); }} style={{ padding: '6px 12px', borderRadius: '100px', fontSize: '12px', background: 'transparent', border: '1px solid #dadce0', color: '#5f6368', cursor: 'pointer' }}>Rename</button>
                  <button onClick={() => handleDelete(resume.id)} style={{ padding: '6px 12px', borderRadius: '100px', fontSize: '12px', background: 'transparent', border: '1px solid rgba(239,68,68,0.2)', color: '#d93025', cursor: 'pointer', marginLeft: 'auto' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
