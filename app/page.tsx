// Neshnabe Connect | Wolf Flow Solutions LLC 2026
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [tribalId, setTribalId] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!tribalId.trim() || !pin.trim()) {
      setError('Please enter your Tribal ID and PIN.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const email = `${tribalId.toLowerCase().trim()}@nhbp.member`;
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: pin,
      });

      if (signInError) {
        setError('Invalid Tribal ID or PIN. Please try again.');
      } else {
        router.push('/home');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Demo login for preview
  function handleDemoLogin() {
    router.push('/home');
  }

  return (
    <div className="mobile-frame min-h-screen flex flex-col justify-center px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Neshnabe Connect</h1>
        <p className="text-amber italic text-sm mt-1">Wolf Flow Solutions LLC</p>
        <p className="text-text-secondary text-xs mt-2">
          Nottawaseppi Huron Band of the Potawatomi
        </p>
      </div>

      {/* Login Card */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-text-muted text-sm mb-6">
          Enter your Tribal ID and PIN to access your member account.
        </p>

        <form onSubmit={handleSignIn} className="space-y-4">
          {/* Tribal ID Input */}
          <div>
            <label className="block text-xs font-semibold text-text-muted tracking-wider mb-1">
              TRIBAL ID
            </label>
            <input
              type="text"
              value={tribalId}
              onChange={(e) => { setTribalId(e.target.value); setError(''); }}
              placeholder="NHBP-2026-XXXX"
              className="input-field w-full uppercase"
              autoCapitalize="characters"
              autoCorrect="off"
            />
          </div>

          {/* PIN Input */}
          <div>
            <label className="block text-xs font-semibold text-text-muted tracking-wider mb-1">
              PIN
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setError(''); }}
              placeholder="Enter your PIN"
              className="input-field w-full"
              maxLength={6}
              inputMode="numeric"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-error text-sm">{error}</p>
          )}

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-70"
          >
            {loading ? (
              <span className="animate-pulse">Signing In...</span>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Demo Login Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="btn-secondary w-full"
          >
            View Demo
          </button>
        </form>

        {/* Help Text */}
        <p className="text-text-muted text-xs text-center mt-4 leading-relaxed">
          Forgot your PIN? Contact Membership Services<br />
          269.704.4000
        </p>
      </div>

      {/* Footer */}
      <p className="text-text-muted text-[10px] text-center mt-8">
        Neshnabe Connect | Wolf Flow Solutions LLC 2026
      </p>
    </div>
  );
}
