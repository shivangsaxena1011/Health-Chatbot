'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { HeartPulse, Mail, Lock, User, ArrowRight, ShieldCheck, AlertCircle, Sparkles, Loader2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const errParam = searchParams.get('error');
    if (errParam === 'oauth_failed') {
      setError('Google Sign-In was unable to complete. Please try the Instant Demo Account or standard login.');
    } else if (errParam === 'google_denied') {
      setError('Google authorization was cancelled.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
    const payload = isSignUp ? { email, password, name } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Authentication failed');
      }

      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInstantDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ email: 'demo@swasth.ai', password: 'Demo@1234' }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Demo login failed');
      }

      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Unable to log into demo account.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseDemoAccount = () => {
    setEmail('demo@swasth.ai');
    setPassword('Demo@1234');
    setIsSignUp(false);
    setError('');
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden animate-in fade-in zoom-in-95 duration-400 my-auto">
      {/* Header banner */}
      <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-8 text-center text-white relative">
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-md ring-4 ring-white/10 shadow-inner">
          <HeartPulse className="w-7 h-7 text-white animate-pulse" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">Swasth AI 2.0</h1>
        <p className="text-emerald-100 text-xs mt-1 font-medium">
          Evidence-Grounded Health Awareness Platform
        </p>
      </div>

      {/* Tab switch */}
      <div className="flex border-b border-slate-100 bg-slate-50/50">
        <button
          type="button"
          onClick={() => { setIsSignUp(false); setError(''); }}
          className={`flex-1 py-3 text-xs font-bold transition-all ${
            !isSignUp
              ? 'text-emerald-700 border-b-2 border-emerald-600 bg-white'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => { setIsSignUp(true); setError(''); }}
          className={`flex-1 py-3 text-xs font-bold transition-all ${
            isSignUp
              ? 'text-emerald-700 border-b-2 border-emerald-600 bg-white'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Create Account
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200 flex items-start space-x-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {isSignUp && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required={isSignUp}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all text-xs text-slate-800"
              />
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all text-xs text-slate-800"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all text-xs text-slate-800"
            />
          </div>
          {isSignUp && (
            <p className="text-[10px] text-slate-400">
              Min 8 characters with at least one uppercase letter and one number.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-200 transition-all active:scale-[0.98] text-xs flex items-center justify-center space-x-1.5 disabled:opacity-50"
        >
          <span>{loading ? 'Processing...' : isSignUp ? 'Create Health Account' : 'Sign In Securely'}</span>
          {!loading && <ArrowRight className="w-3.5 h-3.5" />}
        </button>

        {/* Instant Demo Login button */}
        {!isSignUp && (
          <div className="space-y-2 pt-1">
            <button
              type="button"
              disabled={loading}
              onClick={handleInstantDemoLogin}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold rounded-xl shadow transition-all active:scale-[0.98] flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
              <span>One-Click Instant Demo Login</span>
            </button>
            <button
              type="button"
              onClick={handleUseDemoAccount}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-[11px] font-semibold rounded-xl transition-all border border-slate-200 text-center"
            >
              Fill demo credentials into form (`demo@swasth.ai`)
            </button>
          </div>
        )}

        <div className="relative flex items-center py-1">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink mx-3 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            or
          </span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        {/* Google Sign-In */}
        <a
          href="/api/auth/google"
          className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center space-x-2 shadow-sm active:scale-[0.98]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </a>

        <div className="pt-2 text-center text-[10px] text-slate-400 flex items-center justify-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>HttpOnly Cookies &amp; Bcrypt Encrypted Sessions</span>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex-1 overflow-y-auto flex items-center justify-center p-4 sm:p-8 bg-slate-50">
      <Suspense fallback={
        <div className="w-full max-w-md bg-white rounded-3xl p-12 text-center shadow-xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-xs text-slate-500 font-semibold">Loading authentication portal...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
