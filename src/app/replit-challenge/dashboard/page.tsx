'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ReplitNavbar from '@/components/replit-challenge/ReplitNavbar';
import ParticleCanvas from '@/components/replit-challenge/ParticleCanvas';
import SkillTreeVisualizer from '@/components/replit-challenge/SkillTreeVisualizer';
import CertificateModal from '@/components/replit-challenge/CertificateModal';
import { getAcceleratorState, UserAcceleratorState } from '@/lib/replit-store';
import { REPLIT_ACHIEVEMENTS, REPLIT_CHALLENGE_MODULES } from '@/lib/replit-challenge-data';
import { 
  Zap, Flame, Trophy, Award, Coins, Rocket, 
  Crown, CheckCircle2, ArrowRight, ShieldCheck, User, Sparkles
} from 'lucide-react';

export default function AcceleratorDashboard() {
  const [state, setState] = useState<UserAcceleratorState | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    setState(getAcceleratorState());
  }, []);

  if (!state) return null;

  const nextXpTarget = state.level * 1000;
  const xpProgressPct = Math.min(100, Math.round(((state.xp % 1000) / 1000) * 100));

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 relative overflow-hidden font-sans">
      <ParticleCanvas />
      <ReplitNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 space-y-10">
        
        {/* Dashboard Top Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8 rounded-3xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_50px_rgba(0,229,255,0.15)]">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Founder Cockpit</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Welcome back, Builder
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              You are currently Level {state.level} • Ranked #{state.rankPosition} Globally in the Replit AI Challenge.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCertificate(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold hover:bg-purple-500/30 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>View Certificate</span>
            </button>

            <Link
              href="/replit-challenge/submit"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 text-slate-950 font-extrabold text-xs shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-105 transition-all"
            >
              <Rocket className="w-4 h-4" />
              <span>Submit Startup</span>
            </Link>
          </div>
        </div>

        {/* Gamification Metrics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Card 1: XP */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-xl">
            <p className="text-xs font-mono uppercase font-bold text-cyan-400">Total Accelerator XP</p>
            <h3 className="text-2xl font-black text-white mt-1">{state.xp.toLocaleString()} XP</h3>
            <div className="w-full h-1.5 bg-slate-900 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-cyan-400 transition-all" style={{ width: `${xpProgressPct}%` }} />
            </div>
            <span className="text-[10px] text-slate-400 font-mono mt-1 block">{xpProgressPct}% to Level {state.level + 1}</span>
          </div>

          {/* Card 2: Level */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-purple-500/30 backdrop-blur-xl">
            <p className="text-xs font-mono uppercase font-bold text-purple-400">Current Level</p>
            <h3 className="text-2xl font-black text-white mt-1">Level {state.level}</h3>
            <span className="text-xs text-purple-300 font-medium mt-1 block">Founder Initiate</span>
          </div>

          {/* Card 3: Streak */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-orange-500/30 backdrop-blur-xl">
            <p className="text-xs font-mono uppercase font-bold text-orange-400">Daily Streak</p>
            <div className="flex items-center space-x-2 mt-1">
              <Flame className="w-6 h-6 text-orange-500 fill-orange-500 animate-pulse" />
              <h3 className="text-2xl font-black text-white">{state.streakDays} Days</h3>
            </div>
            <span className="text-xs text-orange-300 font-medium mt-1 block">Keep burning!</span>
          </div>

          {/* Card 4: Coins */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-amber-500/30 backdrop-blur-xl">
            <p className="text-xs font-mono uppercase font-bold text-amber-400">EduVerse Coins</p>
            <div className="flex items-center space-x-2 mt-1">
              <Coins className="w-6 h-6 text-amber-400" />
              <h3 className="text-2xl font-black text-white">{state.coins}</h3>
            </div>
            <span className="text-xs text-amber-300 font-medium mt-1 block">Available for rewards</span>
          </div>

          {/* Card 5: Rank */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 backdrop-blur-xl">
            <p className="text-xs font-mono uppercase font-bold text-emerald-400">Global Rank</p>
            <h3 className="text-2xl font-black text-white mt-1">#{state.rankPosition}</h3>
            <span className="text-xs text-emerald-300 font-medium mt-1 block">Top 1% Builders</span>
          </div>

        </div>

        {/* Next Mission & Startup Project Status Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Next Mission */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase">Next Active Mission</span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">In Progress</span>
            </div>

            <h3 className="text-xl font-extrabold text-white">
              Module 03: Prompt Engineering & System Directives
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Master System vs User roles, Few-Shot prompting, and strict JSON schemas to power your AI startup features.
            </p>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-mono text-amber-400 font-bold">+350 XP Reward</span>
              <Link
                href="/replit-challenge/lesson/3"
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-colors flex items-center gap-1"
              >
                <span>Continue Mission</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* My Startup Project Status */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-950/80 border border-purple-500/30 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-purple-400 font-bold uppercase">Global Challenge Entry</span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                {state.submittedProject ? 'Submitted' : 'Pending Submission'}
              </span>
            </div>

            {state.submittedProject ? (
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white">{state.submittedProject.name}</h3>
                <p className="text-xs text-cyan-400 font-semibold">{state.submittedProject.tagline}</p>
                <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 font-bold pt-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Qualified for TOP 20 Innovation Championship! Score: {state.submittedProject.score}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-lg font-extrabold text-white">No Startup Submitted Yet</h3>
                <p className="text-xs text-slate-400">
                  Build your AI startup on Replit and submit it to qualify for the Global Championship and Demo Day.
                </p>
                <Link
                  href="/replit-challenge/submit"
                  className="inline-block px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 transition-colors"
                >
                  Submit Project Now
                </Link>
              </div>
            )}
          </div>

        </div>

        {/* Skill Tree Visualizer */}
        <SkillTreeVisualizer
          completedModuleIds={state.completedModules}
          userXp={state.xp}
        />

        {/* Badges & Achievements Grid */}
        <div className="p-8 rounded-3xl bg-slate-950/80 border border-slate-800 backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase">Badges Vault</span>
              <h3 className="text-xl font-extrabold text-white mt-0.5">Unlocked Achievements</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {state.unlockedBadgeIds.length} / {REPLIT_ACHIEVEMENTS.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {REPLIT_ACHIEVEMENTS.map((ach) => {
              const isUnlocked = state.unlockedBadgeIds.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    isUnlocked
                      ? 'bg-slate-900/90 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                      : 'bg-slate-950/40 border-slate-900 opacity-40'
                  }`}
                >
                  <div className="text-3xl mb-2">{ach.icon}</div>
                  <h4 className="text-xs font-extrabold text-white">{ach.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{ach.description}</p>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* Certificate Modal */}
      {showCertificate && (
        <CertificateModal
          studentName="Elite Founder"
          startupName={state.submittedProject?.name || 'AuraMind AI'}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
}
