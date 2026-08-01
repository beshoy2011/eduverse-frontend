'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ReplitNavbar from '@/components/replit-challenge/ReplitNavbar';
import ParticleCanvas from '@/components/replit-challenge/ParticleCanvas';
import { REPLIT_CHALLENGE_MODULES } from '@/lib/replit-challenge-data';
import { BookOpen, Zap, Clock, Trophy, ArrowRight, Search, CheckCircle2, Sparkles } from 'lucide-react';

export default function ReplitCoursePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');

  const filteredModules = REPLIT_CHALLENGE_MODULES.filter((mod) => {
    const matchesSearch = mod.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          mod.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'All' || mod.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 relative overflow-hidden font-sans">
      <ParticleCanvas />
      <ReplitNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>12-Module Accelerator Syllabus</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            From Complete Beginner to Deployed Founder
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Every module includes interactive reading notes, video walkthroughs, quizzes, coding exercises, AI prompt challenges, mini projects, and XP rewards.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 backdrop-blur-xl">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search curriculum modules..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Beginner', 'Intermediate', 'Advanced', 'Master'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedLevel === lvl
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((mod) => (
            <div
              key={mod.id}
              className="group relative p-6 rounded-3xl bg-slate-950/80 border border-cyan-500/20 backdrop-blur-xl hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(0,229,255,0.2)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Module 0{mod.id}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-900 text-purple-400 border border-purple-500/30">
                    {mod.level}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-xs font-semibold text-cyan-400 mt-0.5">{mod.subtitle}</p>

                <p className="text-xs text-slate-400 mt-3 leading-relaxed line-clamp-3">
                  {mod.description}
                </p>

                {/* Objectives list snippet */}
                <div className="mt-4 pt-3 border-t border-slate-900 space-y-1.5">
                  {mod.objectives.slice(0, 2).map((obj, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-[11px] text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-xs font-mono">
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    +{mod.xpReward} XP
                  </span>
                  <span className="text-slate-500">|</span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {mod.estimatedHours}h
                  </span>
                </div>

                <Link
                  href={`/replit-challenge/lesson/${mod.id}`}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-extrabold text-xs shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:scale-105 transition-all"
                >
                  <span>Start</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
