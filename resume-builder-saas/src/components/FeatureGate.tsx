'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

interface FeatureGateProps {
  feature: 'ai-tailoring';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Wraps premium features — shows upgrade modal if user is on free tier.
 * Usage: <FeatureGate feature="ai-tailoring">{children}</FeatureGate>
 */
export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const { profile, isMockMode } = useAuth();
  const [showModal, setShowModal] = useState(false);

  // Mock mode = always unlocked for dev
  if (isMockMode) return <>{children}</>;

  const isPro = profile?.tier === 'pro';

  if (isPro) return <>{children}</>;

  // Free user — show fallback or gate
  return (
    <>
      <div onClick={() => setShowModal(true)} style={{ cursor: 'pointer', position: 'relative' }}>
        {fallback || (
          <div style={{ position: 'relative', opacity: 0.5, pointerEvents: 'none' }}>
            {children}
          </div>
        )}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            color: 'white', boxShadow: '0 2px 12px rgba(99,102,241,0.3)',
          }}>
            ⭐ Pro Feature
          </span>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '36px 32px',
              maxWidth: '420px', width: '90%', textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
              Upgrade to Pro
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
              {feature === 'ai-tailoring'
                ? 'AI-powered resume tailoring matches your experience to job descriptions — making your resume stand out every time.'
                : 'This feature requires a Pro subscription.'
              }
            </p>

            <div style={{
              background: 'var(--surface)', borderRadius: '12px', padding: '16px',
              marginBottom: '24px', textAlign: 'left',
            }}>
              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '10px' }}>Pro includes:</div>
              {['AI resume tailoring', '1 free AI resume/week (built-in LLM)', 'Unlimited with your own API key', 'Cloud saves & sync', 'Priority support'].map(f => (
                <div key={f} style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <span style={{ color: '#22c55e' }}>✓</span> {f}
                </div>
              ))}
            </div>

            <Link href="/pricing" className="btn btn-primary" style={{ width: '100%', display: 'block', textAlign: 'center' }}>
              View Plans — $9/mo
            </Link>

            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: '12px', background: 'none', border: 'none',
                color: 'var(--text-dim)', fontSize: '13px', cursor: 'pointer',
              }}
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/** Hook to check AI usage limits */
export function useAIUsage() {
  const { profile, isMockMode } = useAuth();

  const isUnlimited = isMockMode || profile?.tier === 'pro'; // Pro users with BYOAPI are unlimited
  const weeklyUsed = profile?.aiUsesThisWeek || 0;
  const weeklyLimit = 1; // 1 resume/week with built-in LLM
  const canUseBuiltIn = isUnlimited || weeklyUsed < weeklyLimit;

  return { isUnlimited, weeklyUsed, weeklyLimit, canUseBuiltIn };
}
