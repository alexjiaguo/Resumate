'use client';

import dynamic from 'next/dynamic';

// Dynamically import the editor to avoid SSR issues with TipTap, Zustand, etc.
const EditorApp = dynamic(
  () => import('@/components/editor/EditorApp'),
  { 
    ssr: false,
    loading: () => (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#0f0f1a',
        color: '#94a3b8',
        fontFamily: 'Inter, sans-serif',
        fontSize: '16px',
        gap: '12px',
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          border: '3px solid #2e2e50',
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        Loading Editor...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    ),
  }
);

export default function EditorPage() {
  return <EditorApp />;
}
