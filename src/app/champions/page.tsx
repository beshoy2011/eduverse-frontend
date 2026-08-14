'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import DonationWidget from '@/components/DonationWidget';
import { api, LeaderboardEntry, Challenge } from '@/lib/api';
import { 
  Trophy, Award, Zap, Clock, ShieldCheck, Flame, Loader2, Sparkles, CheckCircle, Gift, Target, Terminal, Bug
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Champions() {
  const [activeTab, setActiveTab] = useState<'monthly' | 'allTime'>('monthly');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimToast, setClaimToast] = useState<{ show: boolean; xp: number }>({ show: false, xp: 0 });
  
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostMsg, setNewPostMsg] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 28, hours: 14, minutes: 35, seconds: 20 });

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
        const questsData = await api.getQuests();
        setChallenges(questsData);

        const loungeData = await api.getLoungePosts();
        setPosts(loungeData);

        if (activeTab === 'monthly') {
          const data = await api.getMonthlyLeaderboard();
          setLeaderboard(data);
        } else {
          const data = await api.getAllTimeLeaderboard();
          setLeaderboard(data);
        }
      } catch (err) {
        console.warn("Using offline mission incidents");
        setChallenges([
          { 
            id: "quest_first_lesson", 
            title_en: "INCIDENT 014 // THE EMPTY LIST CRASH", 
            title_ar: "حادثة 014 // انهيار القائمة الفارغة", 
            description_en: "Find why calculate_average() crashes on empty input and add a zero-division guard.", 
            description_ar: "اكتشف سبب انهيار دالة المتوسط الحسابي على المدخلات الفارغة وأضف فحص الأمان.", 
            type: "daily", 
            xp_reward: 120, 
            target: 1, 
            progress: 1, 
            is_claimed: false, 
            is_completed: true 
          },
          { 
            id: "quest_chat", 
            title_en: "INCIDENT 027 // ROGUE OFF-BY-ONE LOOP", 
            title_ar: "حادثة 027 // خطأ إزاحة التكرار", 
            description_en: "Inspect why the list iterator throws IndexError on index traversal and patch loop range.", 
            description_ar: "افحص سبب رمي المؤشر لخطأ تعدي نطاق المصفوفة وصحح مجال التكرار.", 
            type: "daily", 
            xp_reward: 150, 
            target: 5, 
            progress: 3, 
            is_claimed: false, 
            is_completed: false 
          },
          { 
            id: "quest_interview", 
            title_en: "INCIDENT 033 // UNTYPED KEY DICTIONARY ACCESS", 
            title_ar: "حادثة 033 // الوصول العشوائي للقواميس", 
            description_en: "Patch unhandled KeyError exceptions using defensive .get() fallback patterns.", 
            description_ar: "عالج أخطاء عدم وجود المفاتيح في القواميس باستخدام الدوال الآمنة.", 
            type: "weekly", 
            xp_reward: 250, 
            target: 1, 
            progress: 0, 
            is_claimed: false, 
            is_completed: false 
          }
        ]);
        setLeaderboard([
          { rank: 1, name: "Alan Turing", email: "turing@eduverse.org", xp: 55000, level: 56, rank_title: "Core Architect", certificates_count: 18, completed_courses_count: 18 },
          { rank: 2, name: "Ada Lovelace", email: "ada@eduverse.org", xp: 45000, level: 46, rank_title: "Systems Lead", certificates_count: 15, completed_courses_count: 15 }
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
      const rewardXp = q ? q.xp_reward : 120;
      setChallenges(prev => prev.map(c => c.id === questId ? { ...c, is_claimed: true } : c));
      setClaimToast({ show: true, xp: rewardXp });
      setTimeout(() => setClaimToast({ show: false, xp: 0 }), 3000);
      window.dispatchEvent(new Event('eduverse_language_change'));
    } catch (err) {
      alert("Resolve incident objective first!");
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
      alert(`Transmit failed: ${err.message}`);
    } finally {
      setIsPosting(false);
    }
  };

  if (loading && leaderboard.length === 0) {
    return (
      <div className="flex h-screen flex-col bg-[#07090e] text-slate-200 font-mono-code text-xs">
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
          <span>Accessing Incident Dispatcher...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans select-none">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-mono-code text-xs">
        
        {/* Toast Notification */}
        <AnimatePresence>
          {claimToast.show && (
            <motion.div 
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 font-bold rounded px-5 py-2.5 shadow-2xl flex items-center gap-2 border border-emerald-300"
            >
              <Sparkles className="h-4 w-4" />
              <span>Incident resolved: +{claimToast.xp} XP added to ledger</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ARENA HEADER BANNER */}
        <div className="edu-panel p-6 bg-[#0d111a] border-[#1e2638] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-slate-400 font-bold uppercase tracking-wider">INCIDENT RESPONSE ARENA</span>
            </div>
            <h1 className="text-xl font-bold text-white font-sans">Engineering Missions & Resolution Ledger</h1>
            <p className="text-slate-400 font-sans text-xs">
              Debug active runtime incidents to earn verified streak multipliers and climb the global developer rank.
            </p>
          </div>

          <div className="edu-panel p-3 bg-[#07090e] border-[#1e2638] text-center shrink-0">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">CYCLE RESET IN</span>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">
              {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
            </div>
          </div>
        </div>

        {/* MAIN MISSIONS & LEADERBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            
            {/* ACTIVE MISSIONS (INCIDENT FORMAT) */}
            <section className="space-y-4">
              <div className="border-b border-[#1e2638] pb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bug className="h-4 w-4 text-rose-400" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Active Incident Challenges</h2>
                </div>
                <span className="text-[10px] text-slate-500">{challenges.length} Incidents Open</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {challenges.map((c) => {
                  const progressPct = Math.min((c.progress / c.target) * 100, 100);

                  return (
                    <div key={c.id} className="edu-panel p-4 space-y-3 flex flex-col justify-between bg-[#0d111a] hover:border-slate-600 transition-colors">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="edu-badge edu-badge-amber">
                            {c.type === 'daily' ? 'DAILY INCIDENT' : 'WEEKLY CAPSTONE'}
                          </span>
                          <span className="text-emerald-400 font-bold">+{c.xp_reward} XP</span>
                        </div>

                        <h3 className="text-xs font-bold text-white tracking-wide">{c.title_en}</h3>
                        <p className="text-[11px] text-slate-400 font-sans leading-relaxed">{c.description_en}</p>

                        <div className="pt-2">
                          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                            <span>Resolution Status</span>
                            <span className="text-indigo-400 font-bold">{c.progress}/{c.target}</span>
                          </div>
                          <div className="w-full bg-[#07090e] rounded-full h-1.5 overflow-hidden border border-[#1e2638]">
                            <div className="bg-indigo-500 h-1.5 rounded-full transition-all" style={{ width: `${progressPct}%` }}></div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#1e2638]">
                        {c.is_claimed ? (
                          <div className="w-full text-center py-1.5 text-[10px] text-slate-500 font-bold bg-[#07090e] rounded">
                            ✓ INCIDENT RESOLVED
                          </div>
                        ) : c.is_completed ? (
                          <button
                            onClick={() => handleClaim(c.id)}
                            className="edu-btn edu-btn-emerald w-full text-xs py-1.5 font-bold"
                          >
                            <Gift className="h-3.5 w-3.5" />
                            Claim XP Reward
                          </button>
                        ) : (
                          <div className="w-full text-center py-1.5 text-[10px] text-slate-500 bg-[#07090e] rounded border border-dashed border-[#1e2638]">
                            Investigating Line Traces...
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* LEADERBOARD REGISTRY */}
            <section className="space-y-4">
              <div className="border-b border-[#1e2638] pb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Resolution Ledger</h2>
                </div>

                <div className="flex rounded bg-[#07090e] p-0.5 border border-[#1e2638]">
                  <button
                    onClick={() => setActiveTab('monthly')}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                      activeTab === 'monthly' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Active Month
                  </button>
                  <button
                    onClick={() => setActiveTab('allTime')}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                      activeTab === 'allTime' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    All-Time
                  </button>
                </div>
              </div>

              <div className="edu-panel overflow-hidden bg-[#0d111a]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#07090e] text-slate-500 uppercase border-b border-[#1e2638] text-[10px]">
                    <tr>
                      <th className="p-2.5 text-center w-14">Rank</th>
                      <th className="p-2.5">Engineer</th>
                      <th className="p-2.5 text-center">Level</th>
                      <th className="p-2.5 text-center">Total XP</th>
                      <th className="p-2.5 text-center">Role Title</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e2638]">
                    {leaderboard.map((item) => (
                      <tr key={item.email} className="hover:bg-[#121824] transition-colors">
                        <td className="p-2.5 text-center font-bold text-amber-400">#{item.rank}</td>
                        <td className="p-2.5 font-bold text-white font-sans">{item.name}</td>
                        <td className="p-2.5 text-center text-slate-400">Lv.{item.level}</td>
                        <td className="p-2.5 text-center font-bold text-indigo-400">{item.xp.toLocaleString()} XP</td>
                        <td className="p-2.5 text-center">
                          <span className="edu-badge edu-badge-indigo text-[10px]">{item.rank_title}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

          </div>

          {/* RIGHT: INCIDENT LOG & CODER LOUNGE */}
          <div className="space-y-4">
            <div className="border-b border-[#1e2638] pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Lounge Dispatch</h2>
              </div>
            </div>

            <div className="edu-panel p-4 space-y-4 bg-[#0d111a]">
              <form onSubmit={handleCreatePost} className="space-y-2">
                <textarea
                  value={newPostMsg}
                  onChange={(e) => setNewPostMsg(e.target.value)}
                  disabled={isPosting}
                  maxLength={280}
                  placeholder="Broadcast milestone or solution to lounge (+25 XP)..."
                  className="edu-input text-xs h-20 resize-none font-mono-code"
                />
                <button type="submit" disabled={isPosting || !newPostMsg.trim()} className="edu-btn edu-btn-primary w-full text-xs py-1.5">
                  {isPosting ? 'Broadcasting...' : 'Broadcast Log'}
                </button>
              </form>

              <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1 text-xs">
                {posts.map(post => (
                  <div key={post.id} className="bg-[#07090e] border border-[#1e2638] rounded p-2.5 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span className="font-bold text-indigo-400 font-sans">{post.username}</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-300 font-sans text-[11px] leading-relaxed">{post.message}</p>
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
