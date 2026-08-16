'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LogOut, 
  Menu, 
  X, 
  Languages, 
  ShieldCheck, 
  Terminal,
  ShoppingBag,
  Trophy,
  Flame,
  User,
  Compass,
  ArrowRight
} from 'lucide-react';
import { api, User as UserType } from '@/lib/api';

const navTranslations = {
  en: {
    brand: "EDUVERSE",
    workspace: "WORKSPACE",
    courses: "COURSES",
    missions: "MISSIONS",
    depot: "DEPOT",
    verify: "VERIFY",
    academy: "ACADEMY",
    login: "SIGN IN",
    register: "JOIN LAB",
    logout: "DISCONNECT",
    level: "LV",
    xp: "XP",
    status: "SYS ● ONLINE"
  },
  ar: {
    brand: "إديو فيرس",
    workspace: "المختبر",
    courses: "المناهج",
    missions: "المهام",
    depot: "المتجر",
    verify: "التحقق",
    academy: "الأكاديمية",
    login: "تسجيل الدخول",
    register: "انضم الآن",
    logout: "خروج",
    level: "المستوى",
    xp: "خبرة",
    status: "النظام ● نشط"
  }
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserType | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userXp, setUserXp] = useState<number>(0);
  const [userLevel, setUserLevel] = useState<number>(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [mounted, setMounted] = useState(false);

  const syncUserData = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('eduverse_token') : null;
    const name = typeof window !== 'undefined' ? localStorage.getItem('eduverse_user_name') : null;
    const savedLang = typeof window !== 'undefined' ? (localStorage.getItem('eduverse_lang') as 'en' | 'ar' | null) : null;

    if (savedLang) setLang(savedLang);
    setUserName(name);

    if (token) {
      try {
        const profile = await api.getMe();
        if (profile) {
          setUser(profile);
          setUserXp(profile.xp);
          setUserLevel(profile.level);
          if (profile.name) {
            setUserName(profile.name);
            localStorage.setItem('eduverse_user_name', profile.name);
          }
        }
      } catch (err) {
        localStorage.removeItem('eduverse_token');
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    setMounted(true);
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
    localStorage.removeItem('eduverse_user_id');
    setUser(null);
    setUserName(null);
    window.dispatchEvent(new Event('storage'));
    router.push('/login');
  };

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    setLang(newLang);
    localStorage.setItem('eduverse_lang', newLang);
    window.dispatchEvent(new Event('eduverse_language_change'));
  };

  const t = navTranslations[lang];

  return (
    <header className="sticky top-0 z-50 w-full bg-black border-b border-white/10 font-mono-code text-[14px] select-none">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand & Left Navigation */}
        <div className="flex items-center gap-6 md:gap-8">
          <Link 
            href="/" 
            className="flex items-center gap-2 group tracking-tight"
          >
            <span className="text-white font-bold tracking-widest text-sm flex items-center gap-1.5">
              <span className="text-[#8052ff] font-extrabold">&gt;</span>
              <span>{t.brand}</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-[13px] tracking-[0.35px]">
            <Link 
              href="/dashboard" 
              className={`editorial-link transition-colors ${
                pathname === '/dashboard' ? 'text-white font-bold' : 'text-[#9a9a9a] hover:text-white'
              }`}
            >
              {t.workspace}
            </Link>

            <Link 
              href="/courses" 
              className={`editorial-link transition-colors ${
                pathname.startsWith('/courses') ? 'text-white font-bold' : 'text-[#9a9a9a] hover:text-white'
              }`}
            >
              {t.courses}
            </Link>

            <Link 
              href="/champions" 
              className={`editorial-link transition-colors ${
                pathname === '/champions' ? 'text-[#ffb829] font-bold' : 'text-[#9a9a9a] hover:text-[#ffb829]'
              }`}
            >
              {t.missions}
            </Link>

            <Link 
              href="/shop" 
              className={`editorial-link transition-colors ${
                pathname === '/shop' ? 'text-white font-bold' : 'text-[#9a9a9a] hover:text-white'
              }`}
            >
              {t.depot}
            </Link>

            <Link 
              href="/verify" 
              className={`editorial-link transition-colors ${
                pathname.startsWith('/verify') ? 'text-[#15846e] font-bold' : 'text-[#9a9a9a] hover:text-[#15846e]'
              }`}
            >
              {t.verify}
            </Link>
          </nav>
        </div>

        {/* Right Status Ribbon & Auth */}
        <div className="hidden md:flex items-center gap-4 text-xs">
          
          {/* Telemetry Status Indicator */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-none border border-white/10 bg-black text-[#9a9a9a]">
            <span className="status-led status-led-active"></span>
            <span className="text-[11px] font-bold tracking-wider text-white uppercase">{t.status}</span>
          </div>

          {/* User Telemetry Pill */}
          {mounted && userName && (
            <div className="flex items-center gap-3 px-3 py-1 border border-white/10 bg-black text-white">
              <span className="text-[#8052ff] font-bold">{t.level} {userLevel < 10 ? `0${userLevel}` : userLevel}</span>
              <span className="text-white/20">|</span>
              <span className="text-[#ffb829] font-bold">{userXp} {t.xp}</span>
            </div>
          )}

          {/* Language Toggle with hydration guard */}
          <button
            onClick={toggleLanguage}
            suppressHydrationWarning
            className="p-1.5 border border-white/10 bg-black text-[#9a9a9a] hover:text-white hover:border-white/30 transition-colors uppercase text-[11px] font-bold px-2.5 cursor-pointer"
            title="Switch Language"
          >
            {mounted ? (lang === 'en' ? 'AR' : 'EN') : 'AR'}
          </button>

          {/* Auth Button */}
          {mounted && userName ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile/me"
                className="text-white hover:text-[#8052ff] transition-colors flex items-center gap-1.5 font-bold"
              >
                <span>{userName}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-1 text-[#9a9a9a] hover:text-rose-400 transition-colors cursor-pointer"
                title={t.logout}
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-[#9a9a9a] hover:text-white px-2 py-1 transition-colors text-xs"
              >
                {t.login}
              </Link>
              <Link
                href="/register"
                className="edu-btn edu-btn-primary text-xs py-1 px-3"
              >
                <span>{t.register}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleLanguage}
            suppressHydrationWarning
            className="p-1 border border-white/10 bg-black text-white text-[11px] font-bold px-2"
          >
            {mounted ? (lang === 'en' ? 'AR' : 'EN') : 'AR'}
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-white/10 text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-black p-4 space-y-4 font-mono-code text-xs">
          <nav className="flex flex-col space-y-3">
            <Link 
              href="/dashboard" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#9a9a9a] hover:text-white py-1"
            >
              {t.workspace}
            </Link>
            <Link 
              href="/courses" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#9a9a9a] hover:text-white py-1"
            >
              {t.courses}
            </Link>
            <Link 
              href="/champions" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#ffb829] hover:text-white py-1"
            >
              {t.missions}
            </Link>
            <Link 
              href="/shop" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#9a9a9a] hover:text-white py-1"
            >
              {t.depot}
            </Link>
            <Link 
              href="/verify" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#15846e] hover:text-white py-1"
            >
              {t.verify}
            </Link>
          </nav>

          <div className="border-t border-white/10 pt-3 flex flex-col gap-2">
            {mounted && userName ? (
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">{userName}</span>
                <button onClick={handleLogout} className="text-rose-400 text-xs">{t.logout}</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="edu-btn edu-btn-secondary flex-1 text-center py-2">
                  {t.login}
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="edu-btn edu-btn-primary flex-1 text-center py-2">
                  {t.register}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

    </header>
  );
}
