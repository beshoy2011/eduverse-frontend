'use client';

import React, { useState } from 'react';
import ReplitNavbar from '@/components/replit-challenge/ReplitNavbar';
import ParticleCanvas from '@/components/replit-challenge/ParticleCanvas';
import { MOCK_LEADERBOARD_USERS } from '@/lib/replit-challenge-data';
import { Award, Trophy, Zap, Flame, Crown, Search, User } from 'lucide-react';

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = MOCK_LEADERBOARD_USERS.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 relative overflow-hidden font-sans">
      <ParticleCanvas />
      <ReplitNavbar />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase">
            <Trophy className="w-3.5 h-3.5 fill-amber-300" />
            <span>Global Arena Rankings</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Builder Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Top dedicated AI startup builders ranked by total XP earned, coding streak consistency, and project achievements.
          </p>
        </div>

        {/* Top 3 Podium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          {/* #2 Silver */}
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-700 backdrop-blur-xl text-center space-y-3 order-2 md:order-1">
            <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-400 flex items-center justify-center mx-auto text-xl font-black text-slate-300 shadow-[0_0_20px_rgba(203,213,225,0.3)]">
              2
            </div>
            <h3 className="text-lg font-extrabold text-white">{MOCK_LEADERBOARD_USERS[1].name}</h3>
            <p className="text-xs text-slate-400 font-mono">{MOCK_LEADERBOARD_USERS[1].country} • {MOCK_LEADERBOARD_USERS[1].title}</p>
            <div className="pt-2 text-sm font-black text-cyan-400 font-mono">
              {MOCK_LEADERBOARD_USERS[1].xp.toLocaleString()} XP
            </div>
          </div>

          {/* #1 Gold */}
          <div className="p-6 rounded-3xl bg-slate-950/90 border-2 border-amber-500/50 backdrop-blur-xl text-center space-y-3 order-1 md:order-2 shadow-[0_0_40px_rgba(245,158,11,0.25)] relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-widest">
              Grandmaster #1
            </div>
            <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto text-3xl font-black text-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
              👑
            </div>
            <h3 className="text-xl font-extrabold text-white">{MOCK_LEADERBOARD_USERS[0].name}</h3>
            <p className="text-xs text-amber-400 font-mono">{MOCK_LEADERBOARD_USERS[0].country} • {MOCK_LEADERBOARD_USERS[0].title}</p>
            <div className="pt-2 text-base font-black text-amber-300 font-mono">
              {MOCK_LEADERBOARD_USERS[0].xp.toLocaleString()} XP
            </div>
          </div>

          {/* #3 Bronze */}
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-amber-700/50 backdrop-blur-xl text-center space-y-3 order-3">
            <div className="w-16 h-16 rounded-full bg-amber-950/40 border-2 border-amber-600 flex items-center justify-center mx-auto text-xl font-black text-amber-400">
              3
            </div>
            <h3 className="text-lg font-extrabold text-white">{MOCK_LEADERBOARD_USERS[2].name}</h3>
            <p className="text-xs text-slate-400 font-mono">{MOCK_LEADERBOARD_USERS[2].country} • {MOCK_LEADERBOARD_USERS[2].title}</p>
            <div className="pt-2 text-sm font-black text-cyan-400 font-mono">
              {MOCK_LEADERBOARD_USERS[2].xp.toLocaleString()} XP
            </div>
          </div>

        </div>

        {/* Leaderboard Table */}
        <div className="rounded-3xl bg-slate-950/80 border border-slate-800 backdrop-blur-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Global Builder Rankings</span>
            <span className="text-xs text-slate-500 font-mono">Updated Real-Time</span>
          </div>

          <div className="divide-y divide-slate-800/60">
            {filteredUsers.map((user) => (
              <div key={user.rank} className="p-4 flex items-center justify-between hover:bg-slate-900/60 transition-colors">
                <div className="flex items-center space-x-4">
                  <span className="w-8 font-mono text-sm font-extrabold text-slate-400">#{user.rank}</span>
                  <div>
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <span>{user.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                        {user.badge}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400">{user.country} • {user.title}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-xs font-mono">
                  <div className="flex items-center space-x-1 text-orange-400 font-bold">
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                    <span>{user.streak}d</span>
                  </div>
                  <div className="text-right">
                    <span className="text-cyan-400 font-black">{user.xp.toLocaleString()} XP</span>
                    <span className="text-slate-500 block text-[10px]">Level {user.level}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
