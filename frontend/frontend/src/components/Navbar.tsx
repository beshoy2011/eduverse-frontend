'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Zap, 
  LogOut, 
  Menu, 
  X, 
  Languages, 
  ShieldCheck, 
  Code2, 
  Terminal,
  ShoppingBag,
  Trophy
} from 'lucide-react';
import { api, User } from '@/lib/api';

const navTranslations = {
  en: {
    brand: "EduVerse",
    home: "Start",
    workspace: "Workspace",
    missions: "Missions",
    shop: "Depot",
    verify: "Verify",
    login: "Sign In",
    register: "Register",
    logout: "Disconnect",
    level: "Lv",
    xp: "XP"
  },
  ar: {
    brand: "إديو فيرس",
    home: "الرئيسية",
    workspace: "لوحة التحكم",
    missions: "المهام",
    shop: "المتجر",
    verify: "التحقق",
    login: "تسجيل الدخول",
    register: "حساب جديد",
    logout: "خروج",
    level: "المستوى",
    xp: "خبرة"
  }
};

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userXp, setUserXp] = useState<number>(0);
  const [userLevel, setUserLevel] = useState<number>(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  const syncUserData = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('eduverse_token') : null;
    const name = typeof window !== 'undefined' ? localStorage.getItem('eduverse_user_name') : null;
    const savedLang = typeof window !== 'undefined' ? (localStorage.getItem('eduverse_lang') as 'en' | 'ar' | null) : null;

    if (savedLang) setLang(savedLang);
    setUserName(name);

    if (token) {
      try {
        const profile = await api.getMe();
        setUser(profile);
        setUserXp(profile.xp);
        setUserLevel(profile.level);
        if (profile.name) {
          setUserName(profile.name);
          localStorage.setItem('eduverse_user_name', profile.name);
        }
      } catch (err) {
        console.error('Navbar sync exception:', err);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    syncUserData();

    const handleStorageChange = () => syncUserData();
    const handleCustomSync = () => syncUserData();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('eduverse_language_change', handleCustomSync);
    window.addEventListener('focus', handleCustomSync);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('eduverse_language_change', handleCustomSync);
      window.removeEventListener('focus', handleCustomSync);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('eduverse_token');
    localStorage.removeItem('eduverse_user_name');
    localStorage.removeItem('eduverse_user_email');
    localStorage.removeItem('eduverse_user_id');
    setUser(null);
    setUserName(null);
    router.push('/login');
  };

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'ar' : 'en';
    setLang(nextLang);
    localStorage.setItem('eduverse_lang', nextLang);
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
    window.dispatchEvent(new Event('eduverse_language_change'));
  };

  const t = navTranslations[lang];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1e2638] bg-[#07090e]/95 backdrop-blur-md font-mono-code text-xs select-none">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Terminal Node */}
        <div className="flex items-center gap-6">
          <Link 
            href={userName ? "/dashboard" : "/"} 
            className="flex items-center gap-2 font-bold tracking-tight text-white hover:text-indigo-400 transition-colors"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600/20 border border-indigo-500/40 text-indigo-400">
              <Terminal className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-extrabold tracking-wider">{t.brand}</span>
            <span className="text-[10px] text-slate-500 hidden sm:inline">v2.0</span>
          </Link>

          {/* System Status Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0d111a] border border-[#1e2638] text-[10px] text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SYS: ONLINE</span>
          </div>
        </div>

        {/* Monospace Quick Links */}
        <nav className="hidden md:flex items-center gap-5 font-mono-code text-xs text-slate-300">
          <Link 
            href={userName ? "/dashboard" : "/"} 
            className="hover:text-indigo-400 transition-colors flex items-center gap-1.5"
          >
            <Code2 className="h-3.5 w-3.5 text-slate-500" />
            <span>{userName ? t.workspace : t.home}</span>
          </Link>

          <Link 
            href="/champions" 
            className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
          >
            <Trophy className="h-3.5 w-3.5 text-slate-500" />
            <span>{t.missions}</span>
          </Link>

          <Link 
            href="/shop" 
            className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <ShoppingBag className="h-3.5 w-3.5 text-slate-500" />
            <span>{t.shop}</span>
          </Link>

          <Link 
            href="/verify" 
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />
            <span>{t.verify}</span>
          </Link>
        </nav>

        {/* Action Controls & Telemetry */}
        <div className="flex items-center gap-3">
          
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2 py-1 rounded bg-[#0d111a] border border-[#1e2638] text-[10px] font-bold text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
            title="Toggle Interface Language"
          >
            <Languages className="h-3 w-3" />
            <span>{lang.toUpperCase()}</span>
          </button>

          {userName ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-[#0d111a] border border-[#1e2638] px-2.5 py-1 rounded text-[10px]">
                <span className="text-slate-400">{t.level} {userLevel}</span>
                <span className="h-3 w-px bg-[#1e2638]"></span>
                <span className="text-indigo-400 font-bold flex items-center gap-1">
                  <Zap className="h-3 w-3 text-amber-400 fill-amber-400" />
                  {userXp} {t.xp}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="px-2.5 py-1 rounded bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 font-bold text-xs hover:bg-indigo-600/25 transition-colors"
                >
                  {userName}
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors"
                  title={t.logout}
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 font-mono-code">
              <Link 
                href="/login" 
                className="edu-btn edu-btn-secondary py-1 px-3 text-xs"
              >
                {t.login}
              </Link>
              <Link 
                href="/register" 
                className="edu-btn edu-btn-primary py-1 px-3 text-xs font-bold"
              >
                {t.register}
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded bg-[#0d111a] border border-[#1e2638] text-slate-300"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1e2638] bg-[#0d111a] p-4 flex flex-col gap-3 font-mono-code text-xs">
          <Link 
            href={userName ? "/dashboard" : "/"}
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-slate-200 hover:text-indigo-400"
          >
            {"> "} {userName ? t.workspace : t.home}
          </Link>
          <Link 
            href="/champions" 
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-slate-200 hover:text-amber-400"
          >
            {"> "} {t.missions}
          </Link>
          <Link 
            href="/shop" 
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-slate-200 hover:text-cyan-400"
          >
            {"> "} {t.shop}
          </Link>
          <Link 
            href="/verify" 
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-slate-200 hover:text-emerald-400"
          >
            {"> "} {t.verify}
          </Link>
          
          {userName && (
            <div className="pt-2 border-t border-[#1e2638] flex items-center justify-between">
              <span className="text-slate-300 font-bold">{userName}</span>
              <button onClick={handleLogout} className="text-rose-400 font-bold">
                {t.logout}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
