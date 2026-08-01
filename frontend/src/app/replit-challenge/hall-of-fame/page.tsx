'use client';

import React from 'react';
import ReplitNavbar from '@/components/replit-challenge/ReplitNavbar';
import ParticleCanvas from '@/components/replit-challenge/ParticleCanvas';
import ProjectCard from '@/components/replit-challenge/ProjectCard';
import { HALL_OF_FAME_PROJECTS } from '@/lib/replit-challenge-data';
import { Crown, Trophy, Sparkles, Award, Star } from 'lucide-react';

export default function HallOfFamePage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 relative overflow-hidden font-sans">
      <ParticleCanvas />
      <ReplitNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono font-bold uppercase border border-purple-500/40">
            <Crown className="w-3.5 h-3.5 text-purple-300" />
            <span>EduVerse Hall of Fame</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Global Innovation Championship Alumni
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Honoring the top AI startups engineered during the Replit AI Accelerator and voted champion by our Silicon Valley judge panel.
          </p>
        </div>

        {/* #1 Winner Highlight Hero Card */}
        <div className="relative rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-950 to-slate-950 border-2 border-amber-500/50 p-8 sm:p-12 overflow-hidden shadow-[0_0_80px_rgba(245,158,11,0.25)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/40">
                <Crown className="w-3.5 h-3.5 fill-amber-300" />
                <span>Global Championship Winner • Score: 98.4/100</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white">
                MedAI Assistant
              </h2>

              <p className="text-base text-cyan-400 font-semibold">
                Autonomous 24/7 Medical Triage & Clinical Note Generator
              </p>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Founded by Alexander Wright. MedAI provides rapid emergency medical assessment in 14 languages, using RAG over WHO clinical protocols to assist rural health clinics.
              </p>

              <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
                <span className="px-3 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">Next.js 16</span>
                <span className="px-3 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">Replit Agent</span>
                <span className="px-3 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">PostgreSQL</span>
                <span className="px-3 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">OpenAI Vision</span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative h-64 rounded-2xl overflow-hidden border-2 border-cyan-500/40 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={HALL_OF_FAME_PROJECTS[0].image}
                  alt="MedAI Assistant"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* All Championship Winners Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-white">Top Championship Finalists</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HALL_OF_FAME_PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
