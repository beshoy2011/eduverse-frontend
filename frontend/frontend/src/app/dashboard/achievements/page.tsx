'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy, Star, Shield, Zap, Download } from 'lucide-react';
import { api, Certificate } from '@/lib/api';

const translations = {
  en: {
    title: "Achievements",
    subtitle: "Track your progress, earn badges, and download your certificates.",
    badges: "Badges Earned",
    certificates: "Certificates",
    leaderboardPreview: "Leaderboard Preview",
    download: "Download",
    mockBadges: [
      { id: 1, name: "First Steps", desc: "Started your first course", icon: Star, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
      { id: 2, name: "Fast Learner", desc: "Completed 3 lessons in a day", icon: Zap, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
      { id: 3, name: "Code Warrior", desc: "Solved 10 coding exercises", icon: Shield, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
    ]
  },
  ar: {
    title: "الإنجازات",
    subtitle: "تتبع تقدمك، احصل على الشارات، وحمل شهاداتك.",
    badges: "الشارات المكتسبة",
    certificates: "الشهادات",
    leaderboardPreview: "نظرة على لوحة الصدارة",
    download: "تحميل",
    mockBadges: [
      { id: 1, name: "الخطوات الأولى", desc: "بدأت دورتك الأولى", icon: Star, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
      { id: 2, name: "متعلم سريع", desc: "أكملت 3 دروس في يوم واحد", icon: Zap, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
      { id: 3, name: "محارب الكود", desc: "حللت 10 تمارين برمجية", icon: Shield, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
    ]
  }
};

export default function AchievementsPage() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [certificates, setCertificates] = useState<Certificate[]>([]);

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
    api.getUserCertificates().then(setCertificates).catch(() => setCertificates([]));
  }, []);

  const t = translations[lang];
  const isAr = lang === 'ar';

  return (
    <div className="h-full flex flex-col p-4 md:p-8 max-w-7xl mx-auto w-full space-y-10">
      <div className={`flex flex-col ${isAr ? 'items-end text-right' : 'items-start text-left'}`}>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          <Award className="h-8 w-8 text-amber-500" />
          {t.title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Badges Section */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className={`text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 ${isAr ? 'flex-row-reverse' : ''}`}>
            <Star className="h-5 w-5 text-indigo-500" /> {t.badges}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {t.mockBadges.map(badge => {
              const Icon = badge.icon;
              return (
                <motion.div 
                  key={badge.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center shadow-sm`}
                >
                  <div className={`h-16 w-16 rounded-full ${badge.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`h-8 w-8 ${badge.color}`} />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{badge.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{badge.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <h2 className={`text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 pt-6 ${isAr ? 'flex-row-reverse' : ''}`}>
            <Award className="h-5 w-5 text-indigo-500" /> {t.certificates}
          </h2>

          <div className="space-y-4">
            {certificates.length > 0 ? (
              certificates.map(cert => (
                <div key={cert.id} className={`p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center shadow-sm ${isAr ? 'flex-row-reverse text-right' : 'text-left'}`}>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{cert.course_title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Issued: {new Date(cert.issue_date).toLocaleDateString()}</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">
                    <Download size={16} /> <span className="hidden sm:inline">{t.download}</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="p-8 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-slate-500">
                <Award className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                <p>{isAr ? 'لا توجد شهادات حتى الآن. أكمل الدورات للحصول عليها!' : 'No certificates yet. Complete courses to earn them!'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Leaderboard Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-indigo-900 to-slate-900 text-white shadow-lg">
            <h3 className={`text-lg font-bold flex items-center gap-2 mb-6 text-indigo-200 ${isAr ? 'flex-row-reverse' : ''}`}>
              <Trophy className="h-5 w-5 text-amber-400" />
              {t.leaderboardPreview}
            </h3>
            
            <div className="space-y-4">
              {[
                { rank: 1, name: 'Alex Johnson', xp: 4500, self: false },
                { rank: 2, name: 'Sarah Miller', xp: 4200, self: false },
                { rank: 3, name: 'You', xp: 3850, self: true },
                { rank: 4, name: 'Mike Ross', xp: 3600, self: false },
              ].map(user => (
                <div key={user.rank} className={`flex items-center justify-between p-3 rounded-lg ${user.self ? 'bg-indigo-600 border border-indigo-500' : 'bg-slate-800/50'} ${isAr ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-3 ${isAr ? 'flex-row-reverse' : ''}`}>
                    <span className="font-bold text-indigo-300 w-5 text-center">#{user.rank}</span>
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <span className={`font-semibold ${user.self ? 'text-white' : 'text-slate-200'}`}>{user.name}</span>
                  </div>
                  <span className="text-sm font-bold text-amber-400">{user.xp} XP</span>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors">
              {isAr ? 'عرض اللوحة كاملة' : 'View Full Leaderboard'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
