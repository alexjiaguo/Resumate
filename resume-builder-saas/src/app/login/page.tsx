'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, isMockMode } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isRegister) {
        const { error: err } = await signUpWithEmail(email, password, name);
        if (err) { setError(err); return; }
        if (!isMockMode) {
          alert('Check your email for a confirmation link!');
          return;
        }
      } else {
        const { error: err } = await signInWithEmail(email, password);
        if (err) { setError(err); return; }
      }
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f8f9fa', fontFamily: 'Inter, sans-serif', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', marginBottom: '40px', color: '#202124' }}>
          <img src="/logo.png" alt="ResuMate" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'contain' }} />
          <span style={{ fontSize: '20px', fontWeight: 700 }}>resumate</span>
        </Link>

        {/* Mock mode badge */}
        {isMockMode && (
          <div style={{
            background: 'rgba(61,77,183,0.06)', border: '1px solid rgba(61,77,183,0.15)',
            borderRadius: '8px', padding: '8px 12px', marginBottom: '16px',
            fontSize: '12px', color: '#3D4DB7', textAlign: 'center',
          }}>
            🧪 Demo Mode — No Supabase configured. Login simulated.
          </div>
        )}

        {/* Card */}
        <div style={{
          background: '#fff', border: '1px solid #dadce0',
          borderRadius: '16px', padding: '36px 32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px', textAlign: 'center', color: '#202124' }}>
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p style={{ color: '#5f6368', fontSize: '14px', textAlign: 'center', marginBottom: '28px' }}>
            {isRegister ? 'Start building professional resumes' : 'Log in to your account'}
          </p>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '8px', padding: '10px 14px', marginBottom: '16px',
              fontSize: '13px', color: '#d93025',
            }}>{error}</div>
          )}

          {/* Google OAuth */}
          <button style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            padding: '12px', borderRadius: '100px', cursor: 'pointer',
            border: '1px solid #dadce0', background: '#fff',
            color: '#202124', fontSize: '14px', fontWeight: 500,
            marginBottom: '20px', transition: 'background 0.2s',
          }} onClick={signInWithGoogle}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: '#dadce0' }} />
            <span style={{ fontSize: '12px', color: '#9aa0a6' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#dadce0' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {isRegister && (
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#5f6368' }}>Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#fff', border: '1px solid #dadce0', color: '#202124', fontSize: '14px', outline: 'none' }} />
              </div>
            )}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#5f6368' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#fff', border: '1px solid #dadce0', color: '#202124', fontSize: '14px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#5f6368' }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#fff', border: '1px solid #dadce0', color: '#202124', fontSize: '14px', outline: 'none' }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '4px', opacity: loading ? 0.6 : 1 }} disabled={loading}>
              {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Log In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#5f6368' }}>
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <button onClick={() => { setIsRegister(!isRegister); setError(null); }}
              style={{ color: '#3D4DB7', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              {isRegister ? 'Log In' : 'Sign Up'}
            </button>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#9aa0a6' }}>
          <Link href="/editor" style={{ color: '#5f6368', textDecoration: 'underline' }}>
            Skip and use the free editor →
          </Link>
        </p>
      </div>
    </div>
  );
}
