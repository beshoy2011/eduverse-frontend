'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import DonationWidget from '@/components/DonationWidget';
import { api, LeaderboardEntry, Challenge } from '@/lib/api';
import { 
  Trophy, Award, Zap, Clock, ShieldCheck, Flame, Loader2, Sparkles, CheckCircle, Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const t = {
  en: {
    title: "EduVerse Champions",
    subtitle: "Compete globally, solve challenges, and climb to the Legend Rank",
    monthlyTab: "Monthly Arena",
    allTimeTab: "All-Time Legends",
    timeLeft: "Monthly Reset In",
    rank: "Rank",
    coder: "Coder",
    certs: "Certs",
    xp: "XP",
    level: "Lv",
    rankTitle: "Title",
    challengesTitle: "Active Coding Challenges",
    challengesSub: "Complete daily quests to gain immediate XP and speed up your level milestones",
    claimBtn: "Claim Reward",
    claimed: "Claimed",
    days: "d",
    hours: "h",
    minutes: "m",
    seconds: "s",
    loading: "Entering the Arena...",
    congrats: "Congratulations!",
    claimedMessage: "You claimed +{xp} XP!",
    globalBadge: "Global Arena"
  },
  ar: {
    title: "أبطال إديو فيرس",
    subtitle: "نافس عالمياً، وحل التحديات اليومية، وارتقِ بلقبك إلى رتبة الأساطير",
    monthlyTab: "حلبة الشهر",
    allTimeTab: "أساطير المنصة",
    timeLeft: "إعادة تعيين الشهر خلال",
    rank: "الترتيب",
    coder: "المبرمج",
    certs: "الشهادات",
    xp: "خبرة XP",
    level: "المستوى",
    rankTitle: "الرتبة",
    challengesTitle: "تحديات البرمجة النشطة",
    challengesSub: "أكمل المهام اليومية لاكتساب نقاط الخبرة فوراً وتسريع ترقياتك",
    claimBtn: "استلام المكافأة",
    claimed: "تم الاستلام",
    days: "يوم",
    hours: "س",
    minutes: "د",
    seconds: "ث",
    loading: "جاري دخول الساحة...",
    congrats: "تهانينا!",
    claimedMessage: "لقد استلمت +{xp} نقطة خبرة!",
    globalBadge: "الساحة العالمية"
  }
};

export default function Champions() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [activeTab, setActiveTab] = useState<'monthly' | 'allTime'>('monthly');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimToast, setClaimToast] = useState<{ show: boolean; xp: number }>({ show: false, xp: 0 });
  
  // Lounge States
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostMsg, setNewPostMsg] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  // Timer countdown
  const [timeLeft, setTimeLeft] = useState({ days: 28, hours: 14, minutes: 35, seconds: 20 });

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

  // Update countdown clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadArenaData() {
      try {
        setLoading(true);
        // Load active side quests
        const questsData = await api.getQuests();
        setChallenges(questsData);

        // Load lounge posts
        const loungeData = await api.getLoungePosts();
        setPosts(loungeData);

        // Load leaderboard based on active tab
        if (activeTab === 'monthly') {
          const data = await api.getMonthlyLeaderboard();
          setLeaderboard(data);
        } else {
          const data = await api.getAllTimeLeaderboard();
          setLeaderboard(data);
        }
      } catch (err) {
        console.error("Failed to load arena data, using mocks", err);
        // Mock fallback if offline
        setChallenges([
          { id: "quest_first_lesson", title_en: "First Steps", title_ar: "الخطوات الأولى", description_en: "Complete your first lesson in any course.", description_ar: "أكمل أول درس لك في أي كورس.", type: "daily", xp_reward: 100, target: 1, progress: 1, is_claimed: false, is_completed: true },
          { id: "quest_chat", title_en: "Inquisitive Mind", title_ar: "عقل فضولي", description_en: "Send 5 queries to your 24/7 personal AI Tutor.", description_ar: "أرسل 5 استفسارات لمدرب الذكاء الاصطناعي الخاص بك.", type: "daily", xp_reward: 150, target: 5, progress: 3, is_claimed: false, is_completed: false },
          { id: "quest_interview", title_en: "Corporate Ready", title_ar: "جاهز للشركات", description_en: "Complete a full 5-question AI Technical Mock Interview.", description_ar: "أكمل مقابلة عمل تقنية كاملة من 5 أسئلة بالذكاء الاصطناعي.", type: "weekly", xp_reward: 250, target: 1, progress: 0, is_claimed: false, is_completed: false }
        ]);
        setPosts([
          { id: 1, user_id: 10, username: "Alan Turing", avatar: "frame_rainbow", message: "Finally built a simulation of the Enigma machine in JavaScript! 💻🔓 Let's see if we can optimize the search pathways.", created_at: new Date().toISOString(), likes: 42, is_liked: false },
          { id: 2, user_id: 11, username: "Ada Lovelace", avatar: "frame_neon", message: "Who else thinks that variables are the most elegant concept? 🙋‍♀️✨ Writing loops in the new Java course is so satisfying!", created_at: new Date().toISOString(), likes: 25, is_liked: false }
        ]);
        setLeaderboard([
          { rank: 1, name: "Alan Turing", email: "turing@eduverse.org", xp: 55000, level: 56, rank_title: "EduVerse Champion", certificates_count: 18, completed_courses_count: 18 },
          { rank: 2, name: "Ada Lovelace", email: "ada@eduverse.org", xp: 45000, level: 46, rank_title: "Grand Master", certificates_count: 15, completed_courses_count: 15 },
          { rank: 3, name: "Linus Torvalds", email: "linus@eduverse.org", xp: 32000, level: 33, rank_title: "Legend", certificates_count: 12, completed_courses_count: 12 }
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadArenaData();
  }, [activeTab]);

  const handleClaim = async (questId: string) => {
    try {
      await api.claimQuest(questId);
      
      const q = challenges.find(item => item.id === questId);
      const rewardXp = q ? q.xp_reward : 150;
      
      // Update UI state immediately
      setChallenges(prev => prev.map(c => c.id === questId ? { ...c, is_claimed: true } : c));
      
      // Show dynamic congrats modal
      setClaimToast({ show: true, xp: rewardXp });
      setTimeout(() => setClaimToast({ show: false, xp: 0 }), 3000);
      
      // Trigger language dispatch for Navbar sync
      window.dispatchEvent(new Event('eduverse_language_change'));
    } catch (err) {
      alert("Failed to claim reward. Complete the quest first!");
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostMsg.trim() || isPosting) return;
    setIsPosting(true);
    try {
      const freshPost = await api.createLoungePost(newPostMsg);
      setPosts(prev => [freshPost, ...prev]);
      setNewPostMsg('');
      setClaimToast({ show: true, xp: 25 });
      setTimeout(() => setClaimToast({ show: false, xp: 0 }), 3000);
      window.dispatchEvent(new Event('eduverse_language_change'));
    } catch (err: any) {
      alert(`Failed to submit post: ${err.message}`);
    } finally {
      setIsPosting(false);
    }
  };

  const handleLikePost = async (postId: number) => {
    try {
      const updatedPost = await api.likeLoungePost(postId);
      setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  const currentT = t[lang];

  if (loading && leaderboard.length === 0) {
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

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        
        {/* Claim Reward Toast Modal */}
        <AnimatePresence>
          {claimToast.show && (
            <motion.div 
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-emerald-600 to-teal-500 border border-emerald-400/30 text-white rounded-2xl py-3 px-6 shadow-2xl flex items-center gap-3.5"
            >
              <Sparkles className="h-5 w-5 animate-bounce text-amber-300 fill-current" />
              <div className="text-left font-sans">
                <p className="text-xs font-black uppercase tracking-wider">{currentT.congrats}</p>
                <p className="text-[11px] opacity-90 font-medium">{currentT.claimedMessage.replace("{xp}", claimToast.xp.toString())}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- GLOBAL CHAMPIONS ARENA INTRO --- */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-950 p-6 md:p-8 text-white shadow-2xl relative overflow-hidden border border-indigo-500/20">
          <div className="absolute top-0 bottom-0 right-0 left-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_12px] opacity-20"></div>
          <div className="absolute right-10 top-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-violet-600/10 blur-3xl pointer-events-none animate-pulse-soft"></div>
          <div className="absolute left-10 top-0 h-[200px] w-[200px] rounded-full bg-indigo-500/10 blur-2xl pointer-events-none"></div>

          <div className={`relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 ${isRtl ? 'lg:flex-row-reverse text-right' : 'text-left'}`}>
            <div className="space-y-4 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-1 text-[10px] font-black tracking-widest text-indigo-300 uppercase">
                <Zap className="h-3 w-3 fill-current text-amber-400" /> {currentT.globalBadge}
              </span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                {currentT.title}
              </h2>
              <p className="text-indigo-200/90 text-sm max-w-xl leading-relaxed font-semibold">
                {currentT.subtitle}
              </p>
            </div>

            {/* Countdown clock card */}
            <div className="bg-slate-900/60 backdrop-blur border border-slate-700/40 rounded-2xl p-5 shrink-0 w-full sm:w-80 text-center relative overflow-hidden">
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 justify-center">
                <Clock className="h-3.5 w-3.5 text-amber-500" /> {currentT.timeLeft}
              </span>
              
              <div className="flex gap-2 justify-center items-center mt-3 select-none">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-white">{timeLeft.days}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{currentT.days}</span>
                </div>
                <span className="text-xl font-bold text-slate-600">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-white">{timeLeft.hours}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{currentT.hours}</span>
                </div>
                <span className="text-xl font-bold text-slate-600">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-white">{timeLeft.minutes}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{currentT.minutes}</span>
                </div>
                <span className="text-xl font-bold text-slate-600">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-white">{timeLeft.seconds}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{currentT.seconds}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- MAIN GRID AREA: Left (Quests & Leaderboard) + Right (Coder Lounge) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Columns (col-span 2) */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* --- QUEST STATION --- */}
            <section className="space-y-6">
              <div className={`space-y-1.5 ${isRtl ? 'text-right' : 'text-left'}`}>
                <h3 className={`text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <Flame className="h-6 w-6 text-amber-500 fill-current animate-pulse" />
                  {currentT.challengesTitle}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  {currentT.challengesSub}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {challenges.map((c) => {
                  const localTitle = lang === 'ar' ? c.title_ar : c.title_en;
                  const localDesc = lang === 'ar' ? c.description_ar : c.description_en;
                  const progressPct = Math.min((c.progress / c.target) * 100, 100);
                  
                  return (
                    <div 
                      key={c.id}
                      className={`rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-sm hover:translate-y-[-2px] transition-all flex flex-col justify-between relative overflow-hidden ${
                        isRtl ? 'text-right' : 'text-left'
                      }`}
                    >
                      <div className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-r ${
                        c.type === 'daily' ? 'from-indigo-500 to-indigo-700' :
                        c.type === 'weekly' ? 'from-amber-400 to-amber-600' :
                        'from-violet-500 to-fuchsia-600'
                      }`}></div>

                      <div>
                        <div className={`flex items-center justify-between pb-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                          <span className={`text-[9px] uppercase font-black px-2.5 py-0.5 rounded border ${
                            c.type === 'daily' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 border-indigo-100/50' :
                            c.type === 'weekly' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 border-amber-100/50' :
                            'bg-violet-50 text-violet-600 dark:bg-violet-950/40 border-violet-100/50'
                          }`}>
                            {c.type}
                          </span>
                          <span className="text-[10px] font-black text-emerald-500">+{c.xp_reward} XP</span>
                        </div>

                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">{localTitle}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">{localDesc}</p>

                        {/* Progress */}
                        <div className="mt-5">
                          <div className={`flex justify-between items-center text-[10px] font-bold text-slate-500 mb-1 ${
                            isRtl ? 'flex-row-reverse' : ''
                          }`}>
                            <span>Progress</span>
                            <span className="text-indigo-650 dark:text-indigo-400 font-bold">{c.progress}/{c.target}</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-indigo-650 dark:bg-indigo-500 h-1.5 rounded-full transition-all duration-500" 
                              style={{ width: `${progressPct}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                        {c.is_claimed ? (
                          <div className="w-full flex items-center justify-center gap-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-extrabold select-none">
                            <CheckCircle className="h-4 w-4 text-slate-400" /> {currentT.claimed}
                          </div>
                        ) : c.is_completed ? (
                          <button
                            onClick={() => handleClaim(c.id)}
                            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-500/10 hover:from-emerald-500 hover:to-teal-400 transition-all cursor-pointer"
                          >
                            <Gift className="h-4 w-4 animate-bounce text-amber-300 fill-current" /> {currentT.claimBtn}
                          </button>
                        ) : (
                          <div className="w-full flex items-center justify-center py-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold select-none">
                            Locked
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* --- LEADERBOARDS --- */}
            <section className="space-y-6">
              <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-250 dark:border-slate-850 pb-4 ${
                isRtl ? 'sm:flex-row-reverse' : ''
              }`}>
                <h3 className={`text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <Trophy className="h-6 w-6 text-amber-500" />
                  EduVerse Champions Arena
                </h3>
                
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                  <button
                    onClick={() => setActiveTab('monthly')}
                    className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      activeTab === 'monthly'
                        ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    {currentT.monthlyTab}
                  </button>
                  <button
                    onClick={() => setActiveTab('allTime')}
                    className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      activeTab === 'allTime'
                        ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    {currentT.allTimeTab}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className={`w-full text-sm text-left border-collapse ${isRtl ? 'text-right' : ''}`}>
                    <thead className="bg-slate-50 dark:bg-slate-900/60 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-150 dark:border-slate-850">
                      <tr>
                        <th scope="col" className="px-6 py-4 text-center w-20">{currentT.rank}</th>
                        <th scope="col" className="px-6 py-4">{currentT.coder}</th>
                        <th scope="col" className="px-6 py-4 text-center w-24">{currentT.level}</th>
                        <th scope="col" className="px-6 py-4 text-center w-28">{currentT.xp}</th>
                        <th scope="col" className="px-6 py-4 text-center w-24">{currentT.certs}</th>
                        <th scope="col" className="px-6 py-4 w-40 text-center">{currentT.rankTitle}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {leaderboard.map((item) => {
                        const isTopThree = item.rank <= 3;
                        const rankMedal = item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : '🥉';
                        
                        return (
                          <tr 
                            key={item.email}
                            className={`hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors duration-200 ${
                              item.rank === 1 ? 'bg-amber-500/5 dark:bg-amber-500/[0.02]' : ''
                            }`}
                          >
                            <td className="px-6 py-4 text-center font-black">
                              {isTopThree ? (
                                <span className="text-xl">{rankMedal}</span>
                              ) : (
                                <span className="text-slate-400 dark:text-slate-650">{item.rank}</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-black text-xs shadow-inner">
                                  {item.name[0].toUpperCase()}
                                </div>
                                <div className="font-extrabold text-slate-900 dark:text-white leading-none">
                                  {item.name}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center font-bold text-slate-600 dark:text-slate-400">
                              {item.level}
                            </td>
                            <td className="px-6 py-4 text-center font-extrabold text-indigo-650 dark:text-indigo-400">
                              {item.xp.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-center font-bold text-slate-600 dark:text-slate-400">
                              {item.certificates_count}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                                item.rank_title === 'EduVerse Champion' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                item.rank_title === 'Grand Master' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                                item.rank_title === 'Legend' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                item.rank_title === 'Master' ? 'bg-indigo-500/10 text-indigo-550 border-indigo-500/20' :
                                'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/50 dark:border-slate-700/50'
                              }`}>
                                {item.rank_title}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Coder Lounge message wall */}
          <div className="space-y-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
            <h3 className={`text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 ${
              isRtl ? 'flex-row-reverse' : ''
            }`}>
              <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
              {isRtl ? 'مجلس المبرمجين العام' : 'Global Coder Lounge'}
            </h3>
            
            {/* Submit Post Form */}
            <form onSubmit={handleCreatePost} className="space-y-2 mt-2">
              <textarea
                value={newPostMsg}
                onChange={(e) => setNewPostMsg(e.target.value)}
                disabled={isPosting}
                maxLength={280}
                placeholder={isRtl ? "شارك إنجازاتك أو سؤالك في المجلس..." : "Share your milestone or query in the lounge..."}
                className="w-full h-20 resize-none rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-white"
              />
              <button
                type="submit"
                disabled={isPosting || !newPostMsg.trim()}
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-550 disabled:bg-slate-200 dark:disabled:bg-slate-850 text-white text-xs font-bold transition-all active:scale-[0.98] shadow"
              >
                {isPosting ? 'Posting...' : (isRtl ? 'انشر في المجلس (+25 XP)' : 'Post to Lounge (+25 XP)')}
              </button>
            </form>

            {/* Posts Feed */}
            <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post.id} className="rounded-xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/40 p-4 space-y-3 shadow-sm">
                    <div className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center gap-2.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        {/* Avatar frame border simulation based on unlocked frames */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center p-0.5 text-[10px] font-bold text-white shrink-0 bg-gradient-to-tr from-indigo-500 to-violet-500 ${
                          post.avatar === 'frame_neon' ? 'border border-pink-500 shadow-[0_0_5px_#ec4899]' :
                          post.avatar === 'frame_rainbow' ? 'border border-transparent bg-gradient-to-r from-red-500 via-green-500 to-blue-500 bg-clip-border text-yellow-300' :
                          post.avatar === 'frame_gold' ? 'border border-yellow-500 shadow-[0_0_8px_#f59e0b]' :
                          ''
                        }`}>
                          {post.username[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="text-xs font-extrabold text-slate-800 dark:text-white">
                            {post.username}
                          </div>
                          <div className="text-[7px] text-slate-400 font-mono mt-0.5">
                            {new Date(post.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleLikePost(post.id)}
                        className={`flex items-center gap-1 text-[10px] font-bold rounded-lg border px-2.5 py-0.5 transition-all ${
                          post.is_liked
                            ? 'bg-rose-500/10 border-rose-500/20 text-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.15)]'
                            : 'text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-600 dark:hover:text-slate-200'
                        }`}
                      >
                        ❤️ {post.likes}
                      </button>
                    </div>

                    <p className={`text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line ${
                      isRtl ? 'text-right' : 'text-left'
                    }`}>
                      {post.message}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-500 py-10 text-xs">
                  No post logs in the lounge yet. Be the first!
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <DonationWidget />
    </div>
  );
}
