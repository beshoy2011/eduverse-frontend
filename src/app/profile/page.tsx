'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import EduVerseNavbar from '@/components/EduVerseNavbar';
import ParticleMeshCanvas from '@/components/ParticleMeshCanvas';
import AIMentorDrawer from '@/components/AIMentorDrawer';
import {
  User, Award, Trophy, Rocket, Flame, Zap, Globe, Code2,
  ShieldCheck, ExternalLink, Sparkles, CheckCircle2, MapPin
} from 'lucide-react';

export default function ProfilePage() {
  const [aiMentorOpen, setAIMentorOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-[#00E5FF]/30 selection:text-[#00E5FF]">
      <ParticleMeshCanvas />
      <EduVerseNavbar onOpenAIMentor={() => setAIMentorOpen(true)} />
      <AIMentorDrawer isOpen={aiMentorOpen} onClose={() => setAIMentorOpen(false)} />

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 z-10 w-full">
        
        {/* Cover & Header Card */}
        <div className="glass-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          {/* Cover Header */}
          <div className="h-44 w-full bg-gradient-to-r from-[#00E5FF]/30 via-[#7C3AED]/40 to-[#A855F7]/30 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,229,255,0.2),transparent)]" />
          </div>

          <div className="px-6 sm:px-8 pb-8 relative -mt-16 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-end space-x-4">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#00E5FF] to-[#7C3AED] p-1 shadow-2xl">
                  <div className="w-full h-full bg-[#0F172A] rounded-[22px] flex items-center justify-center font-heading font-extrabold text-2xl text-[#00E5FF]">
                    AR
                  </div>
                </div>
                <div className="space-y-1">
                  <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white flex items-center gap-2">
                    Alex Rivera <ShieldCheck className="w-5 h-5 text-[#00E5FF]" />
                  </h1>
                  <p className="text-xs text-slate-400 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#00E5FF]" /> San Francisco, CA • Founder @ NexusAI
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl glass-card text-slate-300 hover:text-[#00E5FF] hover:bg-white/10"
                >
                  <Code2 className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl glass-card text-slate-300 hover:text-[#00E5FF] hover:bg-white/10"
                >
                  <Globe className="w-4 h-4" />
                </a>
                <button
                  onClick={() => alert("Following Alex Rivera!")}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-slate-950 font-bold text-xs shadow-lg shadow-[#00E5FF]/20 hover:scale-105 transition-transform"
                >
                  Follow Founder
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-center">
              <div className="bg-white/5 p-3 rounded-2xl">
                <span className="font-num font-extrabold text-xl text-[#00E5FF]">2,450 XP</span>
                <span className="text-[10px] text-slate-400 block font-semibold">Level 8 Founder</span>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl">
                <span className="font-num font-extrabold text-xl text-amber-400">🔥 7 Days</span>
                <span className="text-[10px] text-slate-400 block font-semibold">Active Streak</span>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl">
                <span className="font-num font-extrabold text-xl text-emerald-400">$14.2k</span>
                <span className="text-[10px] text-slate-400 block font-semibold">Startup MRR</span>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl">
                <span className="font-num font-extrabold text-xl text-[#A855F7]">1,240</span>
                <span className="text-[10px] text-slate-400 block font-semibold">Followers</span>
              </div>
            </div>

          </div>
        </div>

        {/* Bio & Skills Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Bio */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-3">
              <h3 className="font-heading font-bold text-base text-white">Founder Bio</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Building NexusAI — an autonomous AI agent converting wireframes into full-stack Next.js code. Graduated from EduVerse Full-Stack AI SaaS Founder Track with 98% pass rate.
              </p>
            </div>

            {/* Featured AI Startup */}
            <div className="glass-card rounded-3xl p-6 border border-[#00E5FF]/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF]">
                  Active AI Startup
                </span>
                <span className="font-num text-xs font-bold text-emerald-400">$14.2k MRR</span>
              </div>
              <div>
                <h4 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                  NexusAI <ExternalLink className="w-4 h-4 text-slate-400" />
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  AI agent that converts Figma wireframes into production React components in 10 seconds.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {['Next.js 16', 'Claude 3.7', 'Supabase', 'Stripe'].map((t, i) => (
                  <span key={i} className="text-[10px] px-2.5 py-1 rounded-md bg-white/5 text-slate-300 font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Skills & Badges */}
          <div className="space-y-6">
            
            {/* Verified Skills */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-3">
              <h3 className="font-heading font-bold text-base text-white">Verified AI Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {['LLM Prompting', 'Vector Databases', 'LangChain', 'Next.js 16', 'Supabase Auth', 'Python RAG'].map((skill, i) => (
                  <span key={i} className="text-xs px-3 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/30 text-[#A855F7] font-semibold">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Achievements Badges */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-3">
              <h3 className="font-heading font-bold text-base text-white">Ecosystem Badges</h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-white/5 flex items-center space-x-3">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="font-bold text-white block">Top 10 Global Founder</span>
                    <span className="text-[10px] text-slate-400">Ranked #3 on Leaderboard</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 flex items-center space-x-3">
                  <Award className="w-5 h-5 text-[#00E5FF]" />
                  <div>
                    <span className="font-bold text-white block">Verified AI Certificate</span>
                    <span className="text-[10px] text-slate-400">ID: EV-2026-8942-X</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
