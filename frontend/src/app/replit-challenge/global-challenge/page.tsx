'use client';

import React from 'react';
import Link from 'next/link';
import ReplitNavbar from '@/components/replit-challenge/ReplitNavbar';
import ParticleCanvas from '@/components/replit-challenge/ParticleCanvas';
import JudgesGrid from '@/components/replit-challenge/JudgesGrid';
import { JUDGING_CRITERIA_LIST } from '@/lib/replit-challenge-data';
import { Rocket, Trophy, Crown, CheckCircle2, Star, Zap, Globe, ShieldCheck, ArrowRight } from 'lucide-react';

export default function GlobalChallengePage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 relative overflow-hidden font-sans">
      <ParticleCanvas />
      <ReplitNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 space-y-16">
        
        {/* Hero Banner */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/40">
            <Trophy className="w-4 h-4 fill-amber-300" />
            <span>EduVerse Global Build Challenge</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Theme: &ldquo;AI for Humanity&rdquo;
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
            After completing the 12-module accelerator, students enter the 14-day global competition. 
            Build one ambitious AI startup using Replit and submit it live inside EduVerse.
          </p>

          <div className="pt-4">
            <Link
              href="/replit-challenge/submit"
              className="inline-flex items-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_35px_rgba(0,229,255,0.5)] hover:scale-105 transition-all"
            >
              <Rocket className="w-5 h-5" />
              <span>Submit Your Hackathon Entry</span>
            </Link>
          </div>
        </div>

        {/* 7 Judging Criteria Breakdown */}
        <div className="p-8 rounded-3xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-xl space-y-8">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Evaluation Framework</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">Official Judging Criteria</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Every startup submission is scored across 7 core dimensions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {JUDGING_CRITERIA_LIST.map((crit, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-white">{crit.name}</h3>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Weight: {crit.weight}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{crit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top 20 Qualification Perks */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-purple-950/30 via-slate-950 to-slate-950 border border-purple-500/40 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono text-purple-400 uppercase font-bold">Championship Pathway</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">TOP 20 Qualifier Benefits</h2>
            <p className="text-xs sm:text-sm text-slate-300">
              The TOP 20 projects automatically qualify for the EduVerse Global Innovation Championship.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
              <Crown className="w-8 h-8 text-amber-400 mx-auto" />
              <h4 className="text-sm font-extrabold text-white">Finalist Badge & Cert</h4>
              <p className="text-xs text-slate-400">Verified digital credential seal.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
              <Globe className="w-8 h-8 text-cyan-400 mx-auto" />
              <h4 className="text-sm font-extrabold text-white">Global Demo Day</h4>
              <p className="text-xs text-slate-400">Live pitch session with Silicon Valley investors.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-extrabold text-white">Homepage Feature</h4>
              <p className="text-xs text-slate-400">Showcased on EduVerse main platform homepage.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
              <Zap className="w-8 h-8 text-purple-400 mx-auto" />
              <h4 className="text-sm font-extrabold text-white">Investor Mentorship</h4>
              <p className="text-xs text-slate-400">Direct 1-on-1 advisor sessions.</p>
            </div>
          </div>
        </div>

        {/* Judges Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-white">Meet the Hackathon Judges</h2>
          <JudgesGrid />
        </div>

      </main>
    </div>
  );
}
