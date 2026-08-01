'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import EduVerseNavbar from '@/components/EduVerseNavbar';
import ParticleMeshCanvas from '@/components/ParticleMeshCanvas';
import AIMentorDrawer from '@/components/AIMentorDrawer';
import {
  Flame, Zap, Trophy, Award, BookOpen, Rocket, CheckCircle2, Calendar,
  Clock, ArrowRight, Bot, Star, Play, Sparkles, Target, Layers, ExternalLink,
  Coins, TrendingUp, Compass, Code2, Bookmark
} from 'lucide-react';

export default function DashboardPage() {
  const [aiMentorOpen, setAIMentorOpen] = useState(false);

  // Generate 365 heatmap squares
  const heatmapDays = Array.from({ length: 112 }).map((_, i) => {
    const intensity = Math.floor(Math.random() * 4);
    return { id: i, intensity };
  });

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-[#00E5FF]/30 selection:text-[#00E5FF]">
      <ParticleMeshCanvas />
      <EduVerseNavbar onOpenAIMentor={() => setAIMentorOpen(true)} />
      <AIMentorDrawer isOpen={aiMentorOpen} onClose={() => setAIMentorOpen(false)} />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 z-10 w-full">
        
        {/* Welcome Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#00E5FF]/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack AI SaaS Founder Track</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
              Welcome back, Founder! 🚀
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Your AI startup project <span className="text-[#00E5FF] font-bold">NexusAI</span> is on track for Week 3 Demo Day. Keep your streak alive!
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setAIMentorOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-slate-950 font-heading font-bold text-xs shadow-lg shadow-[#00E5FF]/20 hover:scale-105 transition-transform flex items-center space-x-2"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI Mentor</span>
            </button>
            <Link
              href="/replit-challenge"
              className="px-5 py-3 rounded-2xl glass-card border border-white/10 hover:border-[#00E5FF]/40 text-white font-bold text-xs flex items-center space-x-2"
            >
              <Code2 className="w-4 h-4 text-[#00E5FF]" />
              <span>Open IDE</span>
            </Link>
          </div>
        </div>

        {/* Gamification Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-amber-500/30 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <Flame className="w-6 h-6 text-amber-500 animate-pulse" />
            </div>
            <div>
              <span className="font-num text-2xl font-extrabold text-white">7 Days</span>
              <span className="text-[11px] text-slate-400 block font-semibold">Active Streak</span>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-[#00E5FF]/30 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 flex items-center justify-center border border-[#00E5FF]/20">
              <Zap className="w-6 h-6 text-[#00E5FF]" />
            </div>
            <div>
              <span className="font-num text-2xl font-extrabold text-[#00E5FF]">2,450 XP</span>
              <span className="text-[11px] text-slate-400 block font-semibold">Level 8 AI Founder</span>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-[#A855F7]/30 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-[#A855F7]/10 flex items-center justify-center border border-[#A855F7]/20">
              <Coins className="w-6 h-6 text-[#A855F7]" />
            </div>
            <div>
              <span className="font-num text-2xl font-extrabold text-[#A855F7]">850 Coins</span>
              <span className="text-[11px] text-slate-400 block font-semibold">EduVerse Tokens</span>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Trophy className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="font-num text-2xl font-extrabold text-emerald-400">Rank #14</span>
              <span className="text-[11px] text-slate-400 block font-semibold">Global Leaderboard</span>
            </div>
          </div>
        </div>

        {/* Grid Main Content & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Current Active Mission / Challenge */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">
                  Current Challenge
                </span>
                <span className="text-xs text-slate-400 font-num">Sprint 3 of 8</span>
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-white">Build a RAG AI Agent in Next.js 16</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Connect Pinecone vector store with Claude 3.7 Sonnet to stream context-aware answers to user queries.
                </p>
              </div>

              {/* Progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-num text-slate-400">
                  <span>Sprint Progress</span>
                  <span className="text-[#00E5FF] font-bold">75%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] w-[75%]" />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <Clock className="w-4 h-4 text-[#00E5FF]" />
                  <span>Est. Time: 45 Mins</span>
                </div>
                <Link
                  href="/replit-challenge"
                  className="px-5 py-2.5 rounded-xl bg-[#00E5FF] text-slate-950 font-bold text-xs hover:scale-105 transition-transform flex items-center space-x-1"
                >
                  <span>Continue in IDE</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* 365-Day Activity Heatmap */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-base font-bold text-white">Ecosystem Activity Heatmap</h3>
                  <p className="text-xs text-slate-400">365-Day continuous learning & building contributions</p>
                </div>
                <span className="text-xs font-num font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  184 Commits this year
                </span>
              </div>

              <div className="grid grid-cols-16 gap-1.5 py-2">
                {heatmapDays.map((day) => {
                  let bg = 'bg-slate-800/40';
                  if (day.intensity === 1) bg = 'bg-[#00E5FF]/30';
                  if (day.intensity === 2) bg = 'bg-[#00E5FF]/60';
                  if (day.intensity === 3) bg = 'bg-[#00E5FF] shadow-sm shadow-[#00E5FF]';
                  return <div key={day.id} className={`w-full aspect-square rounded-sm ${bg}`} />;
                })}
              </div>
            </div>

            {/* Weekly Missions Checklist */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
              <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-[#A855F7]" /> Weekly Founder Missions
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="line-through">Deploy Next.js API route for OpenAI streaming</span>
                  </div>
                  <span className="font-num text-[10px] text-emerald-400 font-bold">+200 XP</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-200">
                    <div className="w-4 h-4 rounded-full border border-slate-500" />
                    <span>Hook up Supabase PostgreSQL vector similarity search</span>
                  </div>
                  <span className="font-num text-[10px] text-[#00E5FF] font-bold">+350 XP</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-200">
                    <div className="w-4 h-4 rounded-full border border-slate-500" />
                    <span>Submit pitch deck to YC Mentor Review channel</span>
                  </div>
                  <span className="font-num text-[10px] text-[#A855F7] font-bold">+500 XP</span>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Column (1 col) */}
          <div className="space-y-8">
            
            {/* Upcoming YC & VC Pitch Events */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
              <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#00E5FF]" /> Live Upcoming Events
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-wider block">Tomorrow • 4:00 PM PST</span>
                  <h4 className="font-bold text-white">Y Combinator Pitch Office Hours</h4>
                  <p className="text-slate-400 text-[11px]">Live 1-on-1 feedback from YC alumni mentors.</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] font-bold text-[#A855F7] uppercase tracking-wider block">Friday • 6:00 PM PST</span>
                  <h4 className="font-bold text-white">48h GenAI Hackathon Demo Day</h4>
                  <p className="text-slate-400 text-[11px]">$25,000 in API credits & VC prize purse.</p>
                </div>
              </div>
              <Link
                href="/events"
                className="block text-center text-xs font-bold text-[#00E5FF] hover:underline pt-2"
              >
                View Full Event Calendar →
              </Link>
            </div>

            {/* Saved Bookmarks & Resources */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
              <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#A855F7]" /> Saved Founder Specs
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer flex items-center justify-between">
                  <span>Supabase Vector Indexing Guide</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </li>
                <li className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer flex items-center justify-between">
                  <span>Stripe Billing Integration Boilerplate</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </li>
                <li className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer flex items-center justify-between">
                  <span>YC Pitch Deck Template (.fig)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </li>
              </ul>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
