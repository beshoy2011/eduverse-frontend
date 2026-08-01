'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import EduVerseNavbar from '@/components/EduVerseNavbar';
import ParticleMeshCanvas from '@/components/ParticleMeshCanvas';
import AIMentorDrawer from '@/components/AIMentorDrawer';
import { Trophy, Flame, Zap, Award, Star, Medal, ArrowUp, Crown, Shield, Globe } from 'lucide-react';

export default function LeaderboardPage() {
  const [aiMentorOpen, setAIMentorOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'weekly' | 'startups'>('all');

  const leaderboards = [
    { rank: 1, name: 'Elena Rostova', country: 'Germany', track: 'LLM Agent Architect', xp: '18,450', streak: 42, startup: 'SynthetixAI', mrr: '$32.4k', badge: '🥇 Diamond Founder' },
    { rank: 2, name: 'Tariq Al-Mansoor', country: 'UAE', track: 'Full-Stack GenAI', xp: '16,200', streak: 35, startup: 'VoiceFlowX', mrr: '$28.1k', badge: '🥈 Gold Founder' },
    { rank: 3, name: 'Sophia Chen', country: 'United States', track: 'Autonomous Code AI', xp: '15,890', streak: 28, startup: 'NexusAI', mrr: '$22.0k', badge: '🥉 Bronze Founder' },
    { rank: 4, name: 'Devon Vance', country: 'United Kingdom', track: 'Multimodal GenAI', xp: '14,100', streak: 21, startup: 'VisionCraft', mrr: '$15.5k', badge: '⚡ AI Master' },
    { rank: 5, name: 'Kenji Sato', country: 'Japan', track: 'LLM Agent Architect', xp: '12,950', streak: 19, startup: 'AgenticLabs', mrr: '$12.0k', badge: '⚡ AI Master' },
    { rank: 6, name: 'Amara Okafor', country: 'Nigeria', track: 'Full-Stack GenAI', xp: '11,400', streak: 14, startup: 'PulseAI', mrr: '$8.4k', badge: '🚀 Rising Builder' },
  ];

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-[#00E5FF]/30 selection:text-[#00E5FF]">
      <ParticleMeshCanvas />
      <EduVerseNavbar onOpenAIMentor={() => setAIMentorOpen(true)} />
      <AIMentorDrawer isOpen={aiMentorOpen} onClose={() => setAIMentorOpen(false)} />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 z-10 w-full">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/30 text-[#A855F7] text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5" />
            <span>Top Coder & Founder Arena</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white">Global Leaderboard</h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Rankings updated in real-time based on verified XP, streak records, and AI startup MRR traction.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex justify-center space-x-2">
          {(['all', 'weekly', 'startups'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-bold capitalize transition-all ${
                filter === tab
                  ? 'bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-slate-950 shadow-lg shadow-[#00E5FF]/20'
                  : 'glass-card text-slate-300 hover:text-white'
              }`}
            >
              {tab === 'all' ? 'All-Time Champions' : tab === 'weekly' ? 'Weekly Sprint' : 'Top MRR Startups'}
            </button>
          ))}
        </div>

        {/* Top 3 Podium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leaderboards.slice(0, 3).map((student) => (
            <div
              key={student.rank}
              className={`glass-card rounded-3xl p-6 text-center space-y-4 border relative overflow-hidden ${
                student.rank === 1
                  ? 'border-amber-500/50 shadow-2xl shadow-amber-500/10 md:-translate-y-2'
                  : student.rank === 2
                  ? 'border-slate-300/30'
                  : 'border-amber-700/30'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#00E5FF] to-[#7C3AED] p-0.5 mx-auto relative">
                <div className="w-full h-full bg-[#0F172A] rounded-full flex items-center justify-center font-heading font-bold text-lg text-white">
                  {student.name.substring(0, 2).toUpperCase()}
                </div>
                {student.rank === 1 && (
                  <Crown className="w-6 h-6 text-amber-400 absolute -top-3 left-1/2 -translate-x-1/2 animate-bounce" />
                )}
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00E5FF]">{student.badge}</span>
                <h3 className="font-heading text-lg font-bold text-white mt-1">{student.name}</h3>
                <p className="text-xs text-slate-400">{student.startup} • {student.country}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/10">
                <div className="bg-white/5 p-2 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">XP Score</span>
                  <span className="font-num font-extrabold text-[#00E5FF]">{student.xp}</span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Streak</span>
                  <span className="font-num font-extrabold text-amber-400">🔥 {student.streak}d</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Complete Rankings Table */}
        <div className="glass-card rounded-3xl border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-[#030712]/60 flex items-center justify-between text-xs font-heading font-bold text-slate-300">
            <span>Rank & Founder</span>
            <div className="flex items-center space-x-8">
              <span>Track</span>
              <span>XP</span>
              <span>Streak</span>
            </div>
          </div>

          <div className="divide-y divide-white/5 text-xs">
            {leaderboards.map((student) => (
              <div
                key={student.rank}
                className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-num font-extrabold text-sm w-6 text-slate-400">#{student.rank}</span>
                  <div>
                    <span className="font-bold text-white block">{student.name}</span>
                    <span className="text-[11px] text-slate-400">{student.startup} ({student.mrr})</span>
                  </div>
                </div>

                <div className="flex items-center space-x-8">
                  <span className="hidden sm:inline-block text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-slate-300">
                    {student.track}
                  </span>
                  <span className="font-num font-bold text-[#00E5FF]">{student.xp} XP</span>
                  <span className="font-num font-bold text-amber-400 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" /> {student.streak}d
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
