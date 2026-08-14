'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';
import { Mail, Lock, AlertCircle, ArrowRight, User, X, Settings, Key, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showSetupModal, setShowSetupModal] = useState(false);
  const [setupTab, setSetupTab] = useState<'real' | 'sim'>('real');
  const [customClientId, setCustomClientId] = useState('');
  const [simName, setSimName] = useState('');
  const [simEmail, setSimEmail] = useState('');
  const [effectiveClientId, setEffectiveClientId] = useState('');
  const [isGsiLoaded, setIsGsiLoaded] = useState(false);

  React.useEffect(() => {
    const envId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
    const storedId = localStorage.getItem('eduverse_google_client_id') || '';
    const activeId = envId || storedId;
    setEffectiveClientId(activeId);
    if (storedId) {
      setCustomClientId(storedId);
    }
  }, []);

  const handleGoogleCredentialResponse = async (response: any) => {
    setError('');
    setLoading(true);
    try {
      const res = await api.loginWithGoogle(response.credential);
      localStorage.setItem('eduverse_token', res.access_token);
      localStorage.setItem('eduverse_user_name', res.user.name);
      localStorage.setItem('eduverse_user_email', res.user.email);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const initializeGoogleSignIn = (clientIdToUse?: string) => {
    const clientId = clientIdToUse || effectiveClientId;
    const google = (window as any).google;
    if (clientId && google) {
      try {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
          cancel_on_tap_outside: false,
        });
        
        const btnDiv = document.getElementById('google-signin-btn-container');
        if (btnDiv) {
          btnDiv.innerHTML = '';
          google.accounts.id.renderButton(
            btnDiv,
            { theme: 'outline', size: 'large', width: 280 }
          );
        }
        
        google.accounts.id.prompt();
      } catch (err) {
        console.error('Failed to initialize Google Sign-In:', err);
      }
    }
  };

  React.useEffect(() => {
    if (effectiveClientId && isGsiLoaded) {
      initializeGoogleSignIn(effectiveClientId);
    }
  }, [effectiveClientId, isGsiLoaded]);

  const handleGoogleClick = () => {
    const google = (window as any).google;
    if (effectiveClientId && google) {
      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          const btnDiv = document.getElementById('google-signin-btn-container');
          if (btnDiv) {
            btnDiv.querySelector('div')?.click();
          }
        }
      });
    } else {
      setShowSetupModal(true);
    }
  };

  const handleSaveClientId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customClientId.trim()) return;
    localStorage.setItem('eduverse_google_client_id', customClientId.trim());
    setEffectiveClientId(customClientId.trim());
    setShowSetupModal(false);
    
    setTimeout(() => {
      const google = (window as any).google;
      if (google) {
        initializeGoogleSignIn(customClientId.trim());
        google.accounts.id.prompt();
      }
    }, 400);
  };

  const handleSimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simName || !simEmail) return;
    setError('');
    setLoading(true);
    setShowSetupModal(false);
    try {
      const response = await api.loginWithGoogle('simulated_token', true, simEmail, simName);
      localStorage.setItem('eduverse_token', response.access_token);
      localStorage.setItem('eduverse_user_name', response.user.name);
      localStorage.setItem('eduverse_user_email', response.user.email);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Simulation Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.login({ email, password });
      localStorage.setItem('eduverse_token', response.access_token);
      localStorage.setItem('eduverse_user_name', response.user.name);
      localStorage.setItem('eduverse_user_email', response.user.email);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Incorrect email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#07090e] text-slate-100 font-sans select-none">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full edu-panel p-8 bg-[#0d111a] border-[#1e2638] space-y-6 font-mono-code"
        >
          <div className="text-center space-y-2">
            <div className="h-10 w-10 rounded bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto">
              <Terminal className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Developer Session Login
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Authenticate to resume your active syllabus and diagnostic workbench.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-400 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Developer Email
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dev@eduverse.org"
                    className="edu-input text-xs pl-9 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Access Key (Password)
                </label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="edu-input text-xs pl-9 py-2"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="edu-btn edu-btn-primary w-full text-xs py-2.5"
            >
              {loading ? 'Authenticating...' : 'Sign In to Workspace'}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          <div className="flex items-center gap-2 my-4">
            <span className="h-px w-full bg-[#1e2638]"></span>
            <span className="text-[10px] text-slate-500 uppercase">OR</span>
            <span className="h-px w-full bg-[#1e2638]"></span>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleGoogleClick}
              className="edu-btn edu-btn-secondary w-full text-xs py-2.5 flex items-center justify-center gap-2"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.745 1.055 15.018 0 12 0 7.37 0 3.383 2.643 1.405 6.505l3.86 3.26Z" />
                <path fill="#4285F4" d="M23.49 12.275c0-.825-.075-1.62-.21-2.385H12v4.51h6.44c-.277 1.463-1.097 2.7-2.33 3.533l3.626 2.815c2.12-1.954 3.754-4.83 3.754-8.473Z" />
                <path fill="#FBBC05" d="M5.266 14.235 1.405 17.495C3.383 21.357 7.37 24 12 24c3.08 0 5.673-1.02 7.56-2.775l-3.625-2.815c-1.037.697-2.36 1.117-3.935 1.117-3.218 0-5.954-2.17-6.924-5.1-.07-.2-.12-.41-.17-.63l-3.64 2.438Z" />
                <path fill="#34A853" d="M12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.745 1.055 15.018 0 12 0 7.37 0 3.383 2.643 1.405 6.505l3.86 3.26c.97-2.93 3.706-5.1 6.924-5.1Z" />
              </svg>
              <span>{effectiveClientId ? 'Sign in with Google' : 'Google Auth Config'}</span>
            </button>

            {effectiveClientId && (
              <div id="google-signin-btn-container" className="w-full flex justify-center mt-2" />
            )}
          </div>

          <div className="text-center text-xs text-slate-500 border-t border-[#1e2638] pt-4 font-sans">
            New to EduVerse?{' '}
            <Link href="/register" className="font-bold text-indigo-400 hover:underline">
              Create Developer Account
            </Link>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showSetupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSetupModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="edu-panel p-6 bg-[#0d111a] border-[#1e2638] w-full max-w-lg relative z-10 space-y-4 font-mono-code text-xs"
            >
              <button
                onClick={() => setShowSetupModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 text-indigo-400">
                <Settings className="h-4 w-4" />
                <h3 className="text-sm font-bold">Google Auth Configuration</h3>
              </div>

              <div className="flex border-b border-[#1e2638]">
                <button
                  onClick={() => setSetupTab('real')}
                  className={`flex-1 py-2 font-bold border-b-2 ${setupTab === 'real' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500'}`}
                >
                  Real Login
                </button>
                <button
                  onClick={() => setSetupTab('sim')}
                  className={`flex-1 py-2 font-bold border-b-2 ${setupTab === 'sim' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500'}`}
                >
                  Dev Simulation
                </button>
              </div>

              {setupTab === 'real' ? (
                <form onSubmit={handleSaveClientId} className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Google Client ID</label>
                    <input
                      type="text"
                      required
                      placeholder="apps.googleusercontent.com..."
                      value={customClientId}
                      onChange={(e) => setCustomClientId(e.target.value)}
                      className="edu-input text-xs"
                    />
                  </div>
                  <button type="submit" className="edu-btn edu-btn-primary w-full text-xs">
                    Save & Activate
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSimSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Mock Name</label>
                    <input
                      type="text"
                      required
                      value={simName}
                      onChange={(e) => setSimName(e.target.value)}
                      placeholder="Beshoy Simon"
                      className="edu-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Mock Email</label>
                    <input
                      type="email"
                      required
                      value={simEmail}
                      onChange={(e) => setSimEmail(e.target.value)}
                      placeholder="dev@eduverse.org"
                      className="edu-input text-xs"
                    />
                  </div>
                  <button type="submit" className="edu-btn edu-btn-primary w-full text-xs">
                    Simulate Developer Login
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Script
        src="https://accounts.google.com/gsi/client"
        onLoad={() => setIsGsiLoaded(true)}
        strategy="afterInteractive"
      />
    </div>
  );
}
