'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Bot, 
  Trophy, 
  Award, 
  BarChart3,
  Flame,
  MessageSquare,
  ShieldCheck,
  ShoppingBag,
  Terminal,
  FolderTree
} from 'lucide-react';
import { api, User } from '@/lib/api';

const sidebarTranslations = {
  en: {
    explorer: "WORKSPACE EXPLORER",
    workspace: "Workspace",
    courses: "Syllabi",
    planner: "Study Schedule",
    assistant: "Diagnostic Copilot",
    interview: "Career Mock",
    achievements: "Milestones",
    analytics: "Telemetry",
    lounge: "Coder Lounge",
    champions: "Missions & Arena",
    shop: "Depot",
    verify: "Verify Ledger",
    streak: "Active Streak",
    days: "days"
  },
  ar: {
    explorer: "مستكشف بيئة العمل",
    workspace: "لوحة التحكم",
    courses: "المناهج",
    planner: "الجدول الدراسي",
    assistant: "موجه التشخيص",
    interview: "المقابلات المهنية",
    achievements: "الإنجازات",
    analytics: "التحليلات",
    lounge: "مجلس المبرمجين",
    champions: "المهام والساحة",
    shop: "المتجر",
    verify: "سجل التحقق",
    streak: "أيام الحماس",
    days: "أيام"
  }
};

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [streakDays, setStreakDays] = useState<number>(1);

  useEffect(() => {
    const savedLang = localStorage.getItem('eduverse_lang') as 'en' | 'ar' | null;
    if (savedLang) setLang(savedLang);

    const handleLanguageChange = () => {
      const activeLang = localStorage.getItem('eduverse_lang') as 'en' | 'ar' | null;
      if (activeLang) setLang(activeLang);
    };

    window.addEventListener('eduverse_language_change', handleLanguageChange);
    return () => window.removeEventListener('eduverse_language_change', handleLanguageChange);
  }, []);

  useEffect(() => {
    async function loadUserStats() {
      try {
        const profile = await api.getMe();
        if (profile?.streak_days) {
          setStreakDays(profile.streak_days);
        }
      } catch (err) {
        console.warn("Using default streak value");
      }
    }
    loadUserStats();
  }, []);

  const t = sidebarTranslations[lang];

  const mainNav = [
    { href: '/dashboard', label: t.workspace, icon: LayoutDashboard },
    { href: '/dashboard/courses', label: t.courses, icon: BookOpen },
    { href: '/champions', label: t.champions, icon: Trophy },
    { href: '/shop', label: t.shop, icon: ShoppingBag },
    { href: '/dashboard/assistant', label: t.assistant, icon: Terminal },
    { href: '/interview', label: t.interview, icon: Bot },
    { href: '/verify', label: t.verify, icon: ShieldCheck },
  ];

  return (
    <aside className="w-56 bg-[#07090e] border-r border-[#1e2638] flex flex-col justify-between p-3 font-mono-code text-xs select-none">
      
      {/* File Tree Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] text-slate-500 font-bold tracking-wider border-b border-[#1e2638] pb-2">
          <FolderTree className="h-3.5 w-3.5 text-indigo-400" />
          <span>{t.explorer}</span>
        </div>

        {/* Tree Items */}
        <nav className="space-y-0.5">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-semibold transition-all border-l-2 ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border-indigo-500 font-bold'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border-transparent'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Streak Telemetry Badge */}
      <div className="p-2.5 bg-[#0d111a] border border-[#1e2638] rounded space-y-1">
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>{t.streak}</span>
          <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500 animate-pulse" />
        </div>
        <div className="text-sm font-extrabold text-white">
          {streakDays} <span className="text-[10px] font-normal text-slate-400">{t.days}</span>
        </div>
      </div>

    </aside>
  );
}
