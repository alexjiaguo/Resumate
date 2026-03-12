'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ResumeService } from '@/services/ResumeService';
import type { ResumeVersion, ResumeData } from '@/types';
import { RotateCcw, Trash2, Save, Clock } from 'lucide-react';

interface Props {
  userId: string;
  resumeId: string | null;
  currentData: ResumeData;
  onRestore: (data: ResumeData, template: string, theme: Record<string, any>) => void;
}

const VersionHistoryPanel: React.FC<Props> = ({ userId, resumeId, currentData, onRestore }) => {
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [versionTitle, setVersionTitle] = useState('');

  const loadVersions = useCallback(async () => {
    if (!resumeId) return;
    setLoading(true);
    try {
      const data = await ResumeService.listVersions(userId, resumeId);
      setVersions(data);
    } catch (err) {
      console.error('Failed to load versions:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, resumeId]);

  useEffect(() => { loadVersions(); }, [loadVersions]);

  const handleSave = async () => {
    if (!resumeId) return;
    const title = versionTitle.trim() || `Version ${new Date().toLocaleString()}`;
    setSaving(true);
    try {
      await ResumeService.saveVersion(userId, resumeId, title);
      setVersionTitle('');
      await loadVersions();
    } catch (err) {
      alert('Failed to save version: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (versionId: string) => {
    if (!confirm('Delete this version?')) return;
    try {
      await ResumeService.deleteVersion(userId, versionId);
      setVersions(prev => prev.filter(v => v.id !== versionId));
    } catch (err) {
      console.error('Failed to delete version:', err);
    }
  };

  const handleRestore = (version: ResumeVersion) => {
    if (!confirm('Restore this version? Your current edits will be replaced.')) return;
    onRestore(version.data, version.template, version.theme);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (!resumeId) {
    return (
      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>
        Save your resume first to enable version history.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Save snapshot */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <input
          className="input-field"
          placeholder="Version label (optional)"
          value={versionTitle}
          onChange={(e) => setVersionTitle(e.target.value)}
          style={{ flex: 1 }}
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-outline-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
        >
          <Save size={12} />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Version list */}
      {loading ? (
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Loading versions...</p>
      ) : versions.length === 0 ? (
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>
          No versions saved yet. Click "Save" above to create a snapshot.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '240px', overflowY: 'auto' }}>
          {versions.map(v => (
            <div key={v.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 10px', borderRadius: '8px',
              border: '1px solid var(--color-border)', background: 'var(--color-bg-card)',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0, flex: 1 }}>
                <span style={{ fontSize: '12px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {v.title}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Clock size={9} /> {formatDate(v.createdAt)}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                <button onClick={() => handleRestore(v)} className="btn-outline-sm" title="Restore" style={{ padding: '4px 6px' }}>
                  <RotateCcw size={11} />
                </button>
                <button onClick={() => handleDelete(v.id)} className="btn-delete-sm" title="Delete" style={{ padding: '4px 6px' }}>
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VersionHistoryPanel;
