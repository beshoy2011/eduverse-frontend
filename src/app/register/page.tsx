'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';
import { UserPlus, Mail, Lock, User, AlertCircle, ArrowRight, X, Info, Settings, Key, HelpCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Google Authentication & Simulation state
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [setupTab, setSetupTab] = useState<'real' | 'sim'>('real');
  const [customClientId, setCustomClientId] = useState('');
  const [simName, setSimName] = useState('');
  const [simEmail, setSimEmail] = useState('');
  const [effectiveClientId, setEffectiveClientId] = useState('');
  const [isGsiLoaded, setIsGsiLoaded] = useState(false);

  // Load client ID from localStorage or process.env on mount
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
      // Store token & user credentials
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
          btnDiv.innerHTML = ''; // Clear previous button if any
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

  // Re-run initialization when effectiveClientId or isGsiLoaded changes
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
    
    // Trigger prompt after GSI has a moment to re-init
    setTimeout(() => {
      const google = (window as any).google;
      if (google) {
        initializeGoogleSignIn(customClientId.trim());
        google.accounts.id.prompt();
      }
    }, 400);
  };

  const handleClearClientId = () => {
    localStorage.removeItem('eduverse_google_client_id');
    setCustomClientId('');
    setEffectiveClientId(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '');
  };

  const handleSimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simName || !simEmail) return;
    setError('');
    setLoading(true);
    setShowSetupModal(false);
    try {
      const response = await api.loginWithGoogle('simulated_token', true, simEmail, simName);
      // Store token & user credentials
      localStorage.setItem('eduverse_token', response.access_token);
      localStorage.setItem('eduverse_user_name', response.user.name);
      localStorage.setItem('eduverse_user_email', response.user.email);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Simulation Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.register({ name, email, password });
      
      // Store token & user credentials
      localStorage.setItem('eduverse_token', response.access_token);
      localStorage.setItem('eduverse_user_name', response.user.name);
      localStorage.setItem('eduverse_user_email', response.user.email);
      
      // Redirect to student dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative Floating Nodes */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-indigo-600/5 blur-3xl animate-pulse-soft"></div>
          <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-violet-600/5 blur-3xl animate-float-3"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-8 rounded-2xl shadow-xl relative z-10"
        >
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 mx-auto">
              <UserPlus className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
              Create Your Account
            </h2>
            <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
              Start learning programming from scratch for 100% free.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3.5 text-sm text-rose-600 dark:text-rose-400 flex items-start gap-2.5">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Beshoy Simon"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 transition-colors"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@eduverse.org"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 rounded-xl bg-indigo-600 py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-600/10 hover:bg-indigo-500 focus:outline-none transition-all hover:scale-[1.01]"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Continue with Google button */}
          <div className="flex items-center justify-center gap-2 my-4">
            <span className="h-px w-full bg-slate-100 dark:bg-slate-800"></span>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Or</span>
            <span className="h-px w-full bg-slate-100 dark:bg-slate-800"></span>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleClick}
              className="w-full flex justify-center items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-850 focus:outline-none transition-all hover:scale-[1.01]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.745 1.055 15.018 0 12 0 7.37 0 3.383 2.643 1.405 6.505l3.86 3.26Z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.275c0-.825-.075-1.62-.21-2.385H12v4.51h6.44c-.277 1.463-1.097 2.7-2.33 3.533l3.626 2.815c2.12-1.954 3.754-4.83 3.754-8.473Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.266 14.235 1.405 17.495C3.383 21.357 7.37 24 12 24c3.08 0 5.673-1.02 7.56-2.775l-3.625-2.815c-1.037.697-2.36 1.117-3.935 1.117-3.218 0-5.954-2.17-6.924-5.1-.07-.2-.12-.41-.17-.63l-3.64 2.438Z"
                />
                <path
                  fill="#34A853"
                  d="M12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.745 1.055 15.018 0 12 0 7.37 0 3.383 2.643 1.405 6.505l3.86 3.26c.97-2.93 3.706-5.1 6.924-5.1Z"
                />
              </svg>
              {effectiveClientId ? 'Sign up with Google' : 'Configure Google Sign In'}
            </button>

            {/* Real Google Auth container - hidden by default, populated when client ID exists */}
            {effectiveClientId && (
              <div id="google-signin-btn-container" className="w-full flex justify-center mt-2 overflow-hidden" />
            )}

            {/* Dynmamic client ID status and settings option */}
            {effectiveClientId && (
              <div className="flex items-center justify-between px-2 text-[10px] text-slate-400 dark:text-slate-500">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-emerald-500" /> Client ID Active
                </span>
                <button
                  type="button"
                  onClick={() => setShowSetupModal(true)}
                  className="font-semibold hover:text-indigo-500 dark:hover:text-indigo-400 underline transition-colors"
                >
                  Configure / Reset
                </button>
              </div>
            )}
          </div>

          <div className="text-center text-xs text-slate-500 mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Google Setup & Simulation Modal */}
      <AnimatePresence>
        {showSetupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSetupModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            
            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg relative z-10 shadow-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowSetupModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 mb-4">
                <Settings className="h-6 w-6 animate-spin-slow" />
                <h3 className="text-xl font-bold font-sans">Google Auth Configuration</h3>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-100 dark:border-slate-800 mb-6">
                <button
                  onClick={() => setSetupTab('real')}
                  className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${
                    setupTab === 'real'
                      ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                      : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  تسجيل دخول حقيقي (Real Login)
                </button>
                <button
                  onClick={() => setSetupTab('sim')}
                  className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${
                    setupTab === 'sim'
                      ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                      : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  محاكاة المطورين (Simulation)
                </button>
              </div>

              {setupTab === 'real' ? (
                <div className="space-y-4 text-right">
                  <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-sans space-y-3 direction-rtl">
                    <p className="font-bold text-slate-900 dark:text-white mb-1 flex items-center justify-end gap-1.5">
                      <span>خطوات تفعيل تسجيل الدخول الحقيقي بجوجل:</span>
                      <Info className="h-4 w-4 text-indigo-500 shrink-0" />
                    </p>
                    <ol className="list-decimal list-inside space-y-2 pr-2 text-right">
                      <li>
                        قم بزيارة{' '}
                        <a
                          href="https://console.cloud.google.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 dark:text-indigo-400 font-bold inline-flex items-center gap-0.5 hover:underline"
                        >
                          Google Cloud Console <ExternalLink className="h-3 w-3" />
                        </a>
                      </li>
                      <li>أنشئ مشروعاً جديداً وقم بإعداد **OAuth consent screen** (اختره كـ External).</li>
                      <li>
                        اذهب إلى **Credentials** واضغط **Create Credentials** ثم اختر **OAuth client ID**.
                      </li>
                      <li>
                        اختر نوع التطبيق **Web Application** وضَع في خانة **Authorized JavaScript origins** الرابط التالي:
                        <code className="block bg-slate-200/60 dark:bg-slate-850 px-2 py-1 rounded text-[10px] text-rose-500 dark:text-rose-400 select-all text-left font-mono mt-1 w-fit ml-auto">
                          http://localhost:3000
                        </code>
                      </li>
                      <li>انسخ الـ **Client ID** وضعه بالأسفل فوراً للتجربة، أو احفظه في الملف:</li>
                    </ol>
                    <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50 text-left font-mono text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
                      <span className="bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded text-indigo-600 dark:text-indigo-400">c:\...\frontend\.env.local</span>
                      <span>مكان الحفظ الدائم</span>
                    </div>
                  </div>

                  <form onSubmit={handleSaveClientId} className="space-y-4 mt-4">
                    <div className="text-left">
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Google Client ID
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                          <Key className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          required
                          placeholder="apps.googleusercontent.com..."
                          value={customClientId}
                          onChange={(e) => setCustomClientId(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 py-2.5 pl-9 pr-4 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:outline-none dark:focus:border-indigo-400 transition-colors font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {localStorage.getItem('eduverse_google_client_id') && (
                        <button
                          type="button"
                          onClick={handleClearClientId}
                          className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-semibold text-rose-500 dark:text-rose-400 transition-all"
                        >
                          مسح الرمز (Clear ID)
                        </button>
                      )}
                      <button
                        type="submit"
                        className="flex-[2] py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-md shadow-indigo-600/10"
                      >
                        حفظ وتفعيل فوري (Save & Activate)
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    <p className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                      <Info className="h-4 w-4 text-indigo-500 shrink-0" />
                      <span>Developer Simulation Mode (تخطي الإعدادات)</span>
                    </p>
                    <p className="text-slate-500 dark:text-slate-400">
                      تسمح لك هذه الواجهة بتخطي إعدادات جوجل بالكامل أثناء التطوير، وتسجيل الدخول الفوري ببريد إلكتروني واسم وهمي.
                    </p>
                  </div>

                  <form onSubmit={handleSimSubmit} className="space-y-4 mt-2">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Mock Full Name
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                          <User className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          required
                          placeholder="Beshoy Simon"
                          value={simName}
                          onChange={(e) => setSimName(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 py-2.5 pl-9 pr-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:outline-none dark:focus:border-indigo-400 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Mock Email Address
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                          <Mail className="h-4 w-4" />
                        </span>
                        <input
                          type="email"
                          required
                          placeholder="beshoy@eduverse.org"
                          value={simEmail}
                          onChange={(e) => setSimEmail(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 py-2.5 pl-9 pr-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:outline-none dark:focus:border-indigo-400 transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-md shadow-indigo-600/10"
                    >
                      {loading ? 'Authenticating...' : 'Simulate Google Login'}
                    </button>
                  </form>
                </div>
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
