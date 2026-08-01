'use client';

import React, { useEffect, useState } from 'react';
import ReplitNavbar from '@/components/replit-challenge/ReplitNavbar';
import ParticleCanvas from '@/components/replit-challenge/ParticleCanvas';
import ProjectCard from '@/components/replit-challenge/ProjectCard';
import { getAcceleratorState, UserAcceleratorState } from '@/lib/replit-store';
import { REPLIT_ACHIEVEMENTS, HALL_OF_FAME_PROJECTS } from '@/lib/replit-challenge-data';
import { User, ExternalLink, Award, ShieldCheck, Zap, Flame, Crown } from 'lucide-react';

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default function BuilderProfilePage() {
  const [state, setState] = useState<UserAcceleratorState | null>(null);

  useEffect(() => {
    setState(getAcceleratorState());
  }, []);

  if (!state) return null;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 relative overflow-hidden font-sans">
      <ParticleCanvas />
      <ReplitNavbar />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 space-y-12">
        
        {/* Profile Card Header */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_60px_rgba(0,229,255,0.15)]">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-1 shadow-[0_0_30px_rgba(0,229,255,0.4)]">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-3xl font-black text-white">
                🚀
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">Elite AI Founder</h1>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Level {state.level}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Replit AI Accelerator Graduate • Ranked #{state.rankPosition} Globally
              </p>
              
              <div className="mt-3 flex items-center justify-center sm:justify-start space-x-4 text-xs font-mono text-slate-300">
                <span className="text-cyan-400 font-bold">{state.xp.toLocaleString()} XP</span>
                <span>•</span>
                <span className="text-orange-400 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-orange-500" /> {state.streakDays}d Streak
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition-all"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub Showcase</span>
            </a>
          </div>
        </div>

        {/* Built Startup Projects Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-white">Public Startup Portfolio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HALL_OF_FAME_PROJECTS.slice(0, 2).map((proj) => (
              <ProjectCard key={proj.id} project={proj} />
            ))}
          </div>
        </div>

        {/* Badges Wall */}
        <div className="p-8 rounded-3xl bg-slate-950/80 border border-slate-800 backdrop-blur-xl space-y-6">
          <h2 className="text-xl font-extrabold text-white">Verified Skills & Achievements</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {REPLIT_ACHIEVEMENTS.slice(0, 4).map((ach) => (
              <div key={ach.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-2xl mb-1">{ach.icon}</div>
                <h3 className="text-xs font-bold text-white">{ach.name}</h3>
                <span className="text-[10px] text-cyan-400 font-mono">Verified Seal</span>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
