'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { BookOpen, LogOut, Moon, Sun, User, Menu, X, Award, LayoutDashboard, Trophy } from 'lucide-react';
import { api } from '@/lib/api';

const navbarTranslations = {
  en: {
    home: "Home",
    dashboard: "Dashboard",
    courses: "Courses",
    signIn: "Sign In",
    getStarted: "Get Started",
    logout: "Logout",
    toggleTheme: "Toggle dark mode",
    logo: "EduVerse",
    champions: "Champions",
    level: "Lv",
  },
  ar: {
    home: "الرئيسية",
    dashboard: "لوحة التحكم",
    courses: "الدورات",
    signIn: "تسجيل الدخول",
    getStarted: "ابدأ الآن",
    logout: "تسجيل خروج",
    toggleTheme: "تبديل المظهر",
    logo: "إديو فيرس",
    champions: "الأبطال",
    level: "المستوى",
  }
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [userXp, setUserXp] = useState<number>(0);
  const [userLevel, setUserLevel] = useState<number>(1);

  useEffect(() => {
    // Check auth status
    const storedName = localStorage.getItem('eduverse_user_name');
    if (storedName) {
      setUserName(storedName);
    }

    const token = localStorage.getItem('eduverse_token');
    if (token) {
      api.getMe().then(u => {
        setUserName(u.name);
        setUserXp(u.xp);
        setUserLevel(u.level);
        localStorage.setItem('eduverse_user_name', u.name);
      }).catch(err => {
        console.error("Failed to sync navbar user stats", err);
      });
    }

    // Load initial dark mode state
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Load initial language state
    const savedLang = localStorage.getItem('eduverse_lang') as 'en' | 'ar' | null;
    const currentLang = savedLang || 'en';
    setLang(currentLang);
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;

    // Listener for global language toggle
    const handleLanguageChange = () => {
      const activeLang = localStorage.getItem('eduverse_lang') as 'en' | 'ar' | null;
      if (activeLang) {
        setLang(activeLang);
        document.documentElement.dir = activeLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = activeLang;
      }
    };

    window.addEventListener('eduverse_language_change', handleLanguageChange);
    return () => {
      window.removeEventListener('eduverse_language_change', handleLanguageChange);
    };
  }, [pathname]);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    setLang(newLang);
    localStorage.setItem('eduverse_lang', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
    window.dispatchEvent(new Event('eduverse_language_change'));
  };

  const handleLogout = () => {
    localStorage.removeItem('eduverse_token');
    localStorage.removeItem('eduverse_user_name');
    localStorage.removeItem('eduverse_user_email');
    setUserName(null);
    router.push('/');
  };

  const t = navbarTranslations[lang];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/50 glass transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-indigo-300 dark:to-violet-400 tracking-tight group-hover:opacity-90 transition-opacity duration-300">
                {t.logo}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className={`relative py-1 text-sm font-semibold transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${pathname === '/' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-650 dark:text-slate-300'}`}
            >
              {t.home}
              {pathname === '/' && (
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-md"></span>
              )}
            </Link>
            
            {userName ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`relative py-1 text-sm font-semibold flex items-center gap-1.5 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${pathname === '/dashboard' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-650 dark:text-slate-300'}`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {t.dashboard}
                  {pathname === '/dashboard' && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-md"></span>
                  )}
                </Link>
                <Link 
                  href="/champions" 
                  className={`relative py-1 text-sm font-semibold flex items-center gap-1.5 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${pathname === '/champions' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-650 dark:text-slate-300'}`}
                >
                  <Trophy className="h-4 w-4 text-amber-500" />
                  {t.champions}
                  {pathname === '/champions' && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-md"></span>
                  )}
                </Link>
              </>
            ) : (
              <a 
                href="#courses-section" 
                className="text-sm font-semibold text-slate-650 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
              >
                {t.courses}
              </a>
            )}

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-105 duration-200 cursor-pointer"
            >
              <span>🌐</span>
              <span>{lang === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-all hover:scale-105 duration-200"
              aria-label={t.toggleTheme}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Auth Buttons */}
            {userName ? (
              <div className="flex items-center gap-4">
                <Link href="/profile/me" className="flex items-center gap-2 rounded-full bg-slate-50 dark:bg-slate-900 py-1 px-3 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-indigo-500/35 dark:hover:border-indigo-400/35 hover:scale-[1.02] transition-all duration-300">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white text-xs font-black shadow-sm">
                    {userName[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[11px] font-bold text-slate-750 dark:text-slate-200 leading-none">{userName}</span>
                    <span className="text-[8px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-0.5">{t.level} {userLevel} ({userXp % 1000}/1000 XP)</span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  {t.logout}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  href="/login" 
                  className="text-sm font-semibold text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 py-2"
                >
                  {t.signIn}
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-indigo-600 px-4.5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/10 hover:bg-indigo-500 transition-all hover:scale-[1.02]"
                >
                  {t.getStarted}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-800/80 text-[10px] font-black text-indigo-600 dark:text-indigo-400 cursor-pointer"
            >
              <span>🌐</span>
              <span>{lang === 'en' ? 'العربية' : 'English'}</span>
            </button>
            <button
              onClick={toggleDarkMode}
              className="rounded-full p-2 text-slate-500 dark:text-slate-400"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 glass py-3 px-4 flex flex-col gap-3">
          <Link 
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {t.home}
          </Link>
          {userName ? (
            <>
              <Link 
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium py-2 flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <LayoutDashboard className="h-4 w-4" />
                {t.dashboard}
              </Link>
              <div className="border-t border-slate-200 dark:border-slate-800 my-1"></div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <User className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-semibold">{userName}</span>
                </div>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="flex items-center gap-1 text-sm font-medium text-red-500"
                >
                  <LogOut className="h-4 w-4" />
                  {t.logout}
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <Link 
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-sm font-medium py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {t.signIn}
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-sm font-semibold py-2.5 rounded-lg bg-indigo-600 text-white shadow-md"
              >
                {t.getStarted}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
