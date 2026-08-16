'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import DonationWidget from '@/components/DonationWidget';
import { api, ProfileData } from '@/lib/api';
import { 
  Trophy, Award, Zap, ShieldCheck, Flame, Loader2, Sparkles, Code, CheckCircle, ExternalLink, Calendar, User, Crown
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const t = {
  en: {
    loading: "Synthesizing portfolio card...",
    level: "Lv",
    xp: "XP",
    rank: "Global Title",
    streak: "Active Streak",
    position: "Global Standing",
    certsTitle: "Certificate Gallery",
    certsSub: "Secured credential nodes generated on block completions",
    achTitle: "Achievement Trophies",
    achSub: "Badges awarded upon completing milestone code targets",
    progressTitle: "Syllabus Pathways",
    viewCert: "Verify Certificate",
    idLabel: "ID",
    avatarTitle: "Avatar Selector",
    avatarSub: "Customize your virtual projection icon",
    days: "Days 🔥",
    noCerts: "No credentials secured yet. Pass final exams to generate.",
    achievementsDict: {
      first_steps: { name: "First Steps 🚀", desc: "Completed your introductory code workspace challenge" },
      first_cert: { name: "First Certificate 🎓", desc: "Passed your first final exam pathway" },
      ten_certs: { name: "Platform Legend 👑", desc: "Passed 10 course final exam checkpoints" },
      polyglot_coder: { name: "Polyglot Master 💻", desc: "Passed 3 completely different programming paths" },
      perfect_score: { name: "Elite Coder 🎯", desc: "Scored 100% on any final exam" },
      python_master: { name: "Cosmic Architect 🌌", desc: "Mastered full core Python syllabus nodes" },
      cpp_master: { name: "Cyberpunk Guardian ⚡", desc: "Mastered deep core C++ compiler mechanics" },
      web_master: { name: "Creative Architect 🎨", desc: "Mastered responsive Flexbox DOM markup layouts" },
      ai_specialist: { name: "AI Practitioner 🔬", desc: "Mastered neural activation weights modeling paths" }
    }
  },
  ar: {
    loading: "جاري توليد ملف الطالب البرمجي...",
    level: "المستوى",
    xp: "نقاط الخبرة XP",
    rank: "اللقب البرمجي",
    streak: "التعلم المستمر",
    position: "الترتيب العالمي",
    certsTitle: "معرض الشهادات الموثقة",
    certsSub: "شهادات آمنة تم إصدارها عند إكمال المناهج بنجاح",
    achTitle: "رف الكؤوس والإنجازات",
    achSub: "أوسمة استحقاق ممنوحة عند تحقيق الأهداف البرمجية الكبرى",
    progressTitle: "مسارات التعلم الحالية",
    viewCert: "التحقق من الشهادة",
    idLabel: "المعرف",
    avatarTitle: "مختار الصورة الرمزية",
    avatarSub: "خصص مظهرك الافتراضي في ساحة إديو فيرس",
    days: "يوم 🔥",
    noCerts: "لم تكتسب أي شهادة بعد. اجتز الامتحانات لإنشائها.",
    achievementsDict: {
      first_steps: { name: "الخطوة الأولى 🚀", desc: "أكملت أول تطبيق عملي داخل محاكي الأكواد" },
      first_cert: { name: "أول شهادة 🎓", desc: "اجتزت أول امتحان نهائي بنجاح" },
      ten_certs: { name: "أسطورة المنصة 👑", desc: "اجتزت 10 امتحانات نهائية بمختلف المناهج" },
      polyglot_coder: { name: "متعدد اللغات 💻", desc: "أكملت 3 مسارات لغات برمجة مختلفة بالكامل" },
      perfect_score: { name: "العلامة الكاملة 🎯", desc: "حققت نسبة 100% كاملة في أي امتحان نهائي" },
      python_master: { name: "مهندس بايثون الكوني 🌌", desc: "احترفت منهاج أساسيات بايثون المذهل بالكامل" },
      cpp_master: { name: "حارس السي بلس بلس ⚡", desc: "احترفت قواعد سي بلس بلس المعقدة والمؤشرات" },
      web_master: { name: "مصمم الويب المبدع 🎨", desc: "احترفت أساسيات تطوير الويب و Flexbox" },
      ai_specialist: { name: "أخصائي الذكاء الاصطناعي 🔬", desc: "احترفت بنيات الخلايا العصبية والتعلم العميق" }
    }
  }
};

const avatars = [
  { id: "cyberpunk", name: "Cyber Coder", emoji: "🦾" },
  { id: "astronaut", name: "Cosmo Pilot", emoji: "👩‍🚀" },
  { id: "programmer", name: "Bit Wizard", emoji: "🧙‍♂️" },
  { id: "neon", name: "Pixel Hero", emoji: "🥷" }
];

export default function Profile() {
  const params = useParams();
  const router = useRouter();
  const rawId = params.userId as string;

  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeAvatar, setActiveAvatar] = useState('programmer');
  const [isSelf, setIsSelf] = useState(false);

  useEffect(() => {
    // Read initial language
    const savedLang = localStorage.getItem('eduverse_lang') as 'en' | 'ar' | null;
    if (savedLang) setLang(savedLang);

    const handleLanguageChange = () => {
      const activeLang = localStorage.getItem('eduverse_lang') as 'en' | 'ar' | null;
      if (activeLang) setLang(activeLang);
    };

    window.addEventListener('eduverse_language_change', handleLanguageChange);
    return () => {
      window.removeEventListener('eduverse_language_change', handleLanguageChange);
    };
  }, []);

  useEffect(() => {
    async function loadUserProfile() {
      try {
        setLoading(true);
        let targetId: number;

        // Resolve "me" profiles dynamically
        if (rawId === 'me') {
          const u = await api.getMe();
          targetId = u.id;
          setIsSelf(true);
        } else {
          targetId = Number(rawId);
          const selfCheck = await api.getMe().catch(() => null);
          if (selfCheck && selfCheck.id === targetId) {
            setIsSelf(true);
          }
        }

        const data = await api.getUserProfile(targetId);
        setProfile(data);
        
        // Find avatar inside achievements
        const avatarAch = data.achievements.find(a => a.startsWith('avatar_'));
        if (avatarAch) {
          setActiveAvatar(avatarAch.replace('avatar_', ''));
        }
      } catch (err) {
        console.error("Failed to load user profile", err);
        // Load mock profiles
        setProfile({
          id: 1,
          name: "Beshoy Simon",
          email: "beshoy@eduverse.org",
          xp: 1250,
          level: 2,
          rank: "Coder",
          streak_days: 4,
          completed_courses_count: 1,
          certificates_count: 1,
          achievements: ["first_steps", "first_cert", "python_master"],
          global_position: 4,
          certificates: [
            { id: 1, uuid: "5f3e7b-c9a8", issue_date: "2026-06-02T15:20:00", recipient_name: "Beshoy Simon", course_title: "Python Basics" }
          ],
          progress: [
            { course_id: 1, title: "Python Basics", percent_complete: 100.0, is_completed: true },
            { course_id: 2, title: "C++ Basics", percent_complete: 25.0, is_completed: false }
          ]
        });
      } finally {
        setLoading(false);
      }
    }
    loadUserProfile();
  }, [rawId]);

  const handleAvatarChange = async (avatarId: string) => {
    if (!isSelf) return;
    setActiveAvatar(avatarId);
    try {
      await api.updateAvatar(avatarId);
      // Trigger update navbar
      window.dispatchEvent(new Event('eduverse_language_change'));
    } catch (e) {
      console.error(e);
    }
  };

  const currentT = t[lang];

  if (loading || !profile) {
    return (
      <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{currentT.loading}</span>
        </div>
      </div>
    );
  }

  const isRtl = lang === 'ar';
  const progressPercent = (profile.xp % 1000) / 10;
  const avatarEmoji = avatars.find(a => a.id === activeAvatar)?.emoji || '🧙‍♂️';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        
        {/* --- PORTFOLIO PLAYER CARD --- */}
        <div className="rounded-3xl bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/20 p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100%_16px] opacity-25"></div>
          <div className="absolute right-10 top-0 h-[250px] w-[250px] rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

          <div className={`relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 ${isRtl ? 'md:flex-row-reverse text-right' : 'text-left'}`}>
            <div className={`flex flex-col sm:flex-row items-center gap-6 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
              {/* Dynamic Emoji Avatar Badge */}
              <div className="h-24 w-24 shrink-0 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-5xl shadow-lg border border-indigo-300/30 animate-pulse-soft">
                {avatarEmoji}
              </div>

              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 text-[9px] font-black tracking-widest text-amber-400 uppercase">
                  <Crown className="h-3 w-3" /> {profile.rank}
                </span>
                <h2 className="text-2xl md:text-3xl font-black">{profile.name}</h2>
                <p className="text-[11px] text-slate-400">{profile.email}</p>
                
                {/* XP Gauges */}
                <div className="w-64 sm:w-80">
                  <div className={`flex justify-between items-center text-[10px] font-bold text-indigo-300 mb-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <span>{currentT.level} {profile.level}</span>
                    <span>{profile.xp % 1000}/1000 {currentT.xp}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick stats board */}
            <div className="grid grid-cols-3 gap-4 border-slate-800/80 pt-6 md:pt-0 shrink-0 w-full md:w-auto">
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-center">
                <span className="block text-2xl font-black text-white">#{profile.global_position}</span>
                <span className="text-[8px] uppercase font-bold text-slate-400 tracking-wider">{currentT.position}</span>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-center">
                <span className="block text-2xl font-black text-amber-500">{profile.streak_days}</span>
                <span className="text-[8px] uppercase font-bold text-slate-400 tracking-wider">{currentT.streak}</span>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-center">
                <span className="block text-2xl font-black text-white">{profile.certificates_count}</span>
                <span className="text-[8px] uppercase font-bold text-slate-400 tracking-wider">{profile.certificates_count === 1 ? 'Node' : 'Nodes'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main profile sections: Certs & Achievements */}
          <div className="lg:col-span-2 space-y-8">
            {/* --- CERTIFICATES Showcase GALLERY --- */}
            <div className="space-y-4">
              <div className={`space-y-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                <h3 className={`text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <ShieldCheck className="h-5.5 w-5.5 text-amber-500" />
                  {currentT.certsTitle}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{currentT.certsSub}</p>
              </div>

              {profile.certificates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {profile.certificates.map(cert => (
                    <div 
                      key={cert.id}
                      className={`rounded-2xl border border-amber-500/20 dark:border-amber-500/10 bg-white dark:bg-slate-900 p-5 shadow-sm hover-premium-card relative overflow-hidden flex flex-col justify-between ${
                        isRtl ? 'text-right' : 'text-left'
                      }`}
                    >
                      <div className={`absolute top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 to-amber-600 ${
                        isRtl ? 'right-0' : 'left-0'
                      }`}></div>

                      <div className="space-y-3">
                        <div className={`flex justify-between items-center ${isRtl ? 'flex-row-reverse' : ''}`}>
                          <span className="text-[10px] font-black text-slate-400 flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" /> {new Date(cert.issue_date).toLocaleDateString()}
                          </span>
                          <span className="text-[8px] font-extrabold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200/30 text-amber-600 dark:text-amber-400 uppercase tracking-widest">Verified</span>
                        </div>

                        <h4 className="text-sm font-extrabold text-slate-800 dark:text-white leading-snug">{cert.course_title}</h4>
                        <p className="text-[9px] font-mono text-slate-450 dark:text-slate-500">{currentT.idLabel}: {cert.uuid.slice(0, 16)}</p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                        <Link
                          href={`/certificates/${cert.uuid}`}
                          className={`flex items-center gap-1.5 text-xs font-black text-indigo-650 dark:text-indigo-400 hover:underline cursor-pointer ${isRtl ? 'justify-end' : ''}`}
                        >
                          {currentT.viewCert} <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-10 text-center text-slate-400 bg-white dark:bg-slate-900/20 shadow-inner">
                  <Award className="h-8 w-8 text-slate-300 mx-auto mb-2 animate-pulse" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{currentT.noCerts}</p>
                </div>
              )}
            </div>

            {/* --- TROPHY CABINET --- */}
            <div className="space-y-4">
              <div className={`space-y-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                <h3 className={`text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <Trophy className="h-5.5 w-5.5 text-amber-500 animate-bounce" />
                  {currentT.achTitle}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{currentT.achSub}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(Object.keys(currentT.achievementsDict) as Array<keyof typeof currentT.achievementsDict>).map((key) => {
                  const unlocked = profile.achievements.includes(key);
                  const item = currentT.achievementsDict[key];
                  
                  return (
                    <div 
                      key={key}
                      className={`rounded-2xl border p-4 shadow-sm flex items-start gap-3 transition-all duration-300 group ${
                        unlocked 
                          ? 'border-indigo-500/20 bg-white dark:bg-slate-900 hover:border-indigo-500/40 dark:hover:border-indigo-400/40' 
                          : 'border-slate-200 dark:border-slate-850 bg-slate-100/50 dark:bg-slate-900/10 opacity-40 hover:opacity-50 select-none'
                      } ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}
                    >
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 text-lg shadow-inner ${
                        unlocked ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      }`}>
                        {key === 'perfect_score' ? '🎯' : key === 'polyglot_coder' ? '💻' : '🏆'}
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-black text-slate-900 dark:text-white leading-tight">{item.name}</h4>
                        <p className="text-[9px] text-slate-550 dark:text-slate-400 leading-normal leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar: Pathways progress & Avatar updates */}
          <div className="space-y-6">
            
            {/* --- AVATAR CHANGER CABINET --- */}
            {isSelf && (
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
                <div className={`space-y-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5 justify-start">
                    <User className="h-4.5 w-4.5 text-indigo-500" />
                    {currentT.avatarTitle}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{currentT.avatarSub}</p>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-2">
                  {avatars.map((av) => {
                    const isActive = av.id === activeAvatar;
                    return (
                      <button
                        key={av.id}
                        onClick={() => handleAvatarChange(av.id)}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                          isActive 
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shadow shadow-indigo-500/10' 
                            : 'border-slate-200/60 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <span className="text-2xl">{av.emoji}</span>
                        <span className="text-[8px] font-bold truncate w-full text-center">{av.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* --- SYLLABUS PATHWAYS --- */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
              <h4 className={`text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 ${
                isRtl ? 'flex-row-reverse' : ''
              }`}>
                <Code className="h-4 w-4 text-indigo-500" />
                {currentT.progressTitle}
              </h4>

              <div className="space-y-4 pt-1">
                {profile.progress.map((prog) => (
                  <div key={prog.course_id} className="space-y-2">
                    <div className={`flex justify-between items-center text-[10px] font-extrabold ${
                      isRtl ? 'flex-row-reverse' : ''
                    }`}>
                      <span className="text-slate-700 dark:text-slate-200 truncate max-w-[150px]">{prog.title}</span>
                      <span className="text-indigo-650 dark:text-indigo-400">{prog.percent_complete}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-indigo-600 dark:bg-indigo-555 h-1.5 rounded-full transition-all duration-500" 
                        style={{ width: `${prog.percent_complete}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>

      <DonationWidget />
    </div>
  );
}
