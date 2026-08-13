'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ReplitBackgroundEffect from '@/components/replit-academy/ReplitBackgroundEffect';
import ReplitAIMentor from '@/components/replit-academy/ReplitAIMentor';
import ReplitPageTransition from '@/components/replit-academy/ReplitPageTransition';
import { 
  REPLIT_ACADEMY_META, 
  REPLIT_ACADEMY_MODULES, 
  REPLIT_ACADEMY_ACHIEVEMENTS, 
  getStudentState 
} from '@/lib/replit-academy-data';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, Play, Flame, Sparkles, CheckCircle2, Trophy, 
  Rocket, Brain, FolderPlus, ArrowRight, ShieldCheck, 
  BarChart3, Clock, ChevronRight, Zap
} from 'lucide-react';

const achievementIcons: Record<string, React.ElementType> = {
  Play, Brain, FolderPlus, Flame, Trophy, Rocket, Sparkles
};

export default function ReplitAcademyDashboard() {
  const [studentState] = useState(getStudentState());
  const [selectedAchievement, setSelectedAchievement] = useState<any | null>(null);

  const totalLessons = 48;
  const completedCount = studentState.completedLessons.length;
  const progressPct = Math.round((completedCount / totalLessons) * 100);

  // SVG Circle calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPct / 100) * circumference;

  return (
    <ReplitPageTransition>
      <div className="min-h-screen bg-[#07111F] text-[#F8FAFC] selection:bg-[#00D4FF]/30 relative font-sans">
        <ReplitBackgroundEffect />

        <div className="relative z-20 border-b border-white/10 bg-[#07111F]/90 backdrop-blur-xl">
          <Navbar />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* DASHBOARD HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-r from-[#00D4FF]/20 via-[#7C3AED]/20 to-[#FF8A00]/20 border border-[#00D4FF]/30 backdrop-blur-2xl shadow-2xl">
            <div>
              <span className="text-xs font-bold text-[#00D4FF] uppercase tracking-wider">
                {REPLIT_ACADEMY_META.badge}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                Student Progress Hub
              </h1>
              <p className="text-sm text-[#94A3B8] mt-2">
                Track your build streak, unlocked achievements, and signature certificate progress.
              </p>
            </div>

            <Link
              href="/replit-ai-academy/lesson/m1-l1"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#00D4FF] via-[#7C3AED] to-[#FF8A00] text-white font-bold text-sm shadow-2xl flex items-center gap-3 hover:scale-105 transition-all cursor-pointer whitespace-nowrap"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Continue Learning</span>
            </Link>
          </div>

          {/* CIRCULAR PROGRESS & METRICS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* SVG Circular Progress Card */}
            <div className="p-6 rounded-2xl bg-[#121E30]/72 border border-white/10 backdrop-blur-xl flex items-center gap-4 shadow-xl">
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    className="stroke-white/10"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    className="stroke-[#00D4FF] transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute font-extrabold text-lg text-white font-mono">
                  {progressPct}%
                </div>
              </div>

              <div>
                <div className="text-xs text-[#94A3B8] font-semibold">Course Progress</div>
                <div className="text-base font-bold text-white mt-0.5">{completedCount} / {totalLessons}</div>
                <div className="text-[11px] text-[#00D4FF] font-mono font-bold mt-1">Lessons Done</div>
              </div>
            </div>

            {/* XP Card */}
            <div className="p-6 rounded-2xl bg-[#121E30]/72 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
              <div className="flex items-center justify-between text-[#94A3B8] text-xs font-semibold">
                <span>Total XP Earned</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-extrabold text-amber-300 font-mono">{studentState.xp} XP</div>
              <p className="text-[11px] text-[#94A3B8]">Rank: Senior AI Apprentice</p>
            </div>

            {/* Streak Card */}
            <div className="p-6 rounded-2xl bg-[#121E30]/72 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
              <div className="flex items-center justify-between text-[#94A3B8] text-xs font-semibold">
                <span>Learning Streak</span>
                <Flame className="w-4 h-4 text-[#FF8A00]" />
              </div>
              <div className="text-3xl font-extrabold text-[#FF8A00]">🔥 {studentState.streakDays} Days</div>
              <p className="text-[11px] text-[#94A3B8]">Keep building daily to double XP!</p>
            </div>

            {/* Certificate Card */}
            <div className="p-6 rounded-2xl bg-[#121E30]/72 border border-white/10 backdrop-blur-xl space-y-2 shadow-xl">
              <div className="flex items-center justify-between text-[#94A3B8] text-xs font-semibold">
                <span>Certificate</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-white">
                {progressPct >= 100 ? 'Unlocked 🎉' : 'In Progress'}
              </div>
              <Link
                href="/replit-ai-academy/certificate"
                className="text-xs font-bold text-[#00D4FF] hover:text-white flex items-center gap-1"
              >
                <span>View Signature Certificate</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* ACHIEVEMENTS GRID */}
          <div className="p-8 rounded-3xl bg-[#121E30]/72 border border-white/10 backdrop-blur-xl space-y-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Trophy className="w-6 h-6 text-amber-400" />
              <span>Academy Achievements & Badges</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {REPLIT_ACADEMY_ACHIEVEMENTS.map(ach => {
                const IconComp = achievementIcons[ach.icon] || Trophy;
                const isUnlocked = studentState.unlockedAchievements.includes(ach.id);

                return (
                  <motion.div
                    key={ach.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedAchievement(ach)}
                    className={`p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-[#00D4FF]/20 via-white/[0.04] to-transparent border-[#00D4FF]/40 shadow-lg'
                        : 'bg-white/[0.01] border-white/5 opacity-50 grayscale'
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00D4FF] via-[#7C3AED] to-[#FF8A00] text-white shrink-0 shadow-md">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-white">{ach.title}</h3>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-snug">{ach.description}</p>
                      <span className="text-[10px] font-bold text-amber-400 mt-2 block">
                        +{ach.xpBonus} XP Bonus
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* MODULE PROGRESSION ROADMAP */}
          <div className="p-8 rounded-3xl bg-[#121E30]/72 border border-white/10 backdrop-blur-xl space-y-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white">Module Progression Roadmap</h2>

            <div className="space-y-3">
              {REPLIT_ACADEMY_MODULES.map(mod => {
                const isDone = studentState.completedModules.includes(mod.id);

                return (
                  <div
                    key={mod.id}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-[#00D4FF] uppercase font-mono">Module {mod.id}</span>
                      <h3 className="font-bold text-sm text-white">{mod.title}</h3>
                      <p className="text-xs text-[#94A3B8]">{mod.projectTitle}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono text-emerald-400 font-bold">+{mod.rewardXP} XP</span>
                      <Link
                        href={`/replit-ai-academy/lesson/m${mod.id}-l1`}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all shadow-sm"
                      >
                        {isDone ? 'Review' : 'Open Module'}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Achievement Detail Modal */}
        <AnimatePresence>
          {selectedAchievement && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
              onClick={() => setSelectedAchievement(null)}
            >
              <motion.div
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.85 }}
                onClick={e => e.stopPropagation()}
                className="max-w-md w-full p-8 rounded-3xl bg-[#0E1A2B] border border-[#00D4FF] text-center shadow-2xl space-y-4 text-white"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00D4FF] via-[#7C3AED] to-[#FF8A00] mx-auto flex items-center justify-center text-white shadow-lg">
                  <Trophy className="w-8 h-8 text-amber-300" />
                </div>
                <h3 className="text-2xl font-bold text-white">{selectedAchievement.title}</h3>
                <p className="text-sm text-[#94A3B8]">{selectedAchievement.description}</p>
                <div className="inline-block px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-mono font-bold border border-amber-400/30">
                  +{selectedAchievement.xpBonus} XP Bonus
                </div>
                <button
                  onClick={() => setSelectedAchievement(null)}
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <ReplitAIMentor />
      </div>
    </ReplitPageTransition>
  );
}
