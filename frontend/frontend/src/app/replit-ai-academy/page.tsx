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
  getStudentState 
} from '@/lib/replit-academy-data';
import { motion } from 'framer-motion';
import { 
  Sparkles, Play, Award, CheckCircle2, Terminal, Code, 
  Brain, Bot, Layout, Server, Database, Lock, Rocket, 
  Cpu, TrendingUp, ChevronRight, Clock, Users, Star, 
  ShieldCheck, ArrowRight, Layers, FileCode, ExternalLink, Zap, Trophy, Lightbulb, Target
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Terminal, Brain, Sparkles, Bot, Layout, Server, Database, Lock, Rocket, Cpu, TrendingUp, Award
};

const EVALUATION_CRITERIA = [
  { title: "Innovation", desc: "Originality of the problem statement and creative AI solutions.", color: "text-[#00D4FF]" },
  { title: "Technical Excellence", desc: "Clean architecture, type safety, and robust backend handling.", color: "text-[#7C3AED]" },
  { title: "UI/UX Design", desc: "Intuitive user flows, micro-interactions, and visual polish.", color: "text-[#FF8A00]" },
  { title: "Real-world Impact", desc: "Practical utility for users, businesses, or developer ecosystems.", color: "text-[#22C55E]" },
  { title: "AI Integration", desc: "Effective prompt design, streaming responses, or vector search.", color: "text-[#FACC15]" },
  { title: "Presentation Quality", desc: "Clear live demonstration, documentation, and GitHub repository.", color: "text-[#00D4FF]" }
];

const MODULE_SKILLS: Record<number, string[]> = {
  1: ["Replit Cloud IDE", "Secrets Management", "Linux Terminal"],
  2: ["LLMs", "Vector Embeddings", "Tokens", "Streaming"],
  3: ["System Prompts", "Few-Shot", "Zod", "Structured JSON"],
  4: ["Replit Agent", "Spec Writing", "Autonomous Workflows"],
  5: ["Next.js 16", "Framer Motion", "Glassmorphism", "Tailwind CSS"],
  6: ["FastAPI", "Rate Limiting", "Webhooks", "REST Endpoints"],
  7: ["PostgreSQL", "Supabase", "pgvector", "Semantic Cache"],
  8: ["JWT", "OAuth 2.0", "Row Level Security (RLS)"],
  9: ["Replit Deployments", "Custom Domains", "SSL", "CI/CD"],
  10: ["Multimodal Vision", "Whisper Audio", "Function Calling"],
  11: ["Lean Startup MVP", "SaaS Pricing Tiers", "Retention Analytics"],
  12: ["Capstone Challenge", "National Competition", "Verified Signature Cert"]
};

export default function ReplitAIAcademyLandingPage() {
  const studentState = getStudentState();

  return (
    <ReplitPageTransition>
      <div className="min-h-screen bg-[#07111F] text-[#F8FAFC] selection:bg-[#00D4FF]/30 selection:text-white relative font-sans">
        <ReplitBackgroundEffect />

        {/* Top Navbar */}
        <div className="relative z-20 border-b border-white/10 bg-[#07111F]/90 backdrop-blur-xl">
          <Navbar />
        </div>

        {/* WELCOME ANNOUNCEMENT BANNER */}
        <div className="relative z-20 bg-gradient-to-r from-[#00D4FF]/20 via-[#7C3AED]/25 to-[#FF8A00]/20 border-b border-[#00D4FF]/30 backdrop-blur-md px-4 py-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00D4FF] to-[#FF8A00] flex items-center justify-center text-white shrink-0 shadow-lg">
                <Trophy className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base flex items-center justify-center md:justify-start gap-2">
                  🏆 EduVerse Replit AI Challenge
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40">
                    National Egypt Qualifiers
                  </span>
                </h3>
                <p className="text-xs text-gray-300 font-medium">
                  The best 20 students will qualify for a national competition across Egypt! Complete the academy & ship your Capstone Challenge.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href="#competition"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all"
              >
                View Competition Details
              </a>
              <Link
                href="/replit-ai-academy/lesson/m1-l1"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#7C3AED] text-xs font-bold text-white shadow-lg transition-all hover:scale-105"
              >
                Start Learning
              </Link>
            </div>
          </div>
        </div>

        {/* HERO SECTION */}
        <section className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          {/* Signature Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#00D4FF]/20 via-[#7C3AED]/20 to-[#FF8A00]/20 border border-[#00D4FF]/40 text-xs sm:text-sm font-semibold text-[#00D4FF] mb-6 shadow-lg backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-[#00D4FF] animate-pulse" />
            <span>{REPLIT_ACADEMY_META.badge}</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-display"
          >
            <span className="bg-gradient-to-r from-white via-[#F8FAFC] to-[#94A3B8] bg-clip-text text-transparent">
              {REPLIT_ACADEMY_META.name}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#00D4FF] via-[#7C3AED] to-[#FF8A00] bg-clip-text text-transparent"
          >
            {REPLIT_ACADEMY_META.tagline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-3 max-w-2xl mx-auto text-base sm:text-lg text-[#94A3B8] leading-relaxed font-light"
          >
            {REPLIT_ACADEMY_META.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/replit-ai-academy/lesson/m1-l1"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#00D4FF] via-[#7C3AED] to-[#FF8A00] hover:brightness-110 text-white font-bold text-base shadow-2xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start Learning</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="#competition"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#121E30]/72 hover:bg-[#121E30] border border-white/15 text-white font-semibold text-base backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>View Challenge Criteria</span>
            </a>
          </motion.div>

          {/* Statistics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-left"
          >
            {[
              { label: "Modules", val: REPLIT_ACADEMY_META.stats.modules, icon: Layers, color: "text-[#00D4FF]" },
              { label: "Lessons", val: REPLIT_ACADEMY_META.stats.lessons, icon: FileCode, color: "text-[#7C3AED]" },
              { label: "Projects", val: REPLIT_ACADEMY_META.stats.projects, icon: Terminal, color: "text-[#FF8A00]" },
              { label: "Duration", val: REPLIT_ACADEMY_META.stats.hours, icon: Clock, color: "text-amber-400" },
              { label: "Students", val: REPLIT_ACADEMY_META.stats.students, icon: Users, color: "text-emerald-400" },
              { label: "Certificate", val: "Verified", icon: ShieldCheck, color: "text-[#00D4FF]" }
            ].map((stat, idx) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#121E30]/72 border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all shadow-xl"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <IconComponent className={`w-5 h-5 ${stat.color}`} />
                    <span className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-extrabold text-white">{stat.val}</div>
                </div>
              );
            })}
          </motion.div>
        </section>

        {/* NATIONAL COMPETITION SECTION */}
        <section id="competition" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#00D4FF]/15 via-[#7C3AED]/20 to-[#FF8A00]/15 border border-[#00D4FF]/30 backdrop-blur-2xl shadow-2xl space-y-8">
            <div className="max-w-3xl space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold uppercase">
                <Trophy className="w-4 h-4" />
                National Egypt Competition
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                🏆 EduVerse Replit AI Challenge
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                At the end of the academy, every learner can submit a <strong className="text-white">Capstone Challenge</strong> project. A panel of senior AI mentors will review all eligible submissions. The <strong className="text-amber-300">Top 20 projects</strong> will be selected to advance to the EduVerse Replit AI Challenge across Egypt!
              </p>
            </div>

            {/* Evaluation Criteria Grid */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white uppercase tracking-wider text-xs font-mono text-[#00D4FF]">
                Official Evaluation Criteria
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {EVALUATION_CRITERIA.map((crit, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#07111F]/80 border border-white/10 space-y-2 hover:border-[#00D4FF]/40 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Target className={`w-5 h-5 ${crit.color}`} />
                      <h4 className="font-bold text-white text-sm">{crit.title}</h4>
                    </div>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">{crit.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CURRICULUM MODULES */}
        <section id="curriculum" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              12 Comprehensive Modules
            </h2>
            <p className="mt-3 text-[#94A3B8] text-base">
              From basic cloud setups to autonomous agents and your final Capstone Challenge launch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REPLIT_ACADEMY_MODULES.map(mod => {
              const Icon = iconMap[mod.icon] || Terminal;
              const isDone = studentState.completedModules.includes(mod.id);
              const skillsList = MODULE_SKILLS[mod.id] || ["AI Architecture", "Full Stack"];

              return (
                <motion.div
                  key={mod.id}
                  whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(0, 212, 255, 0.15)" }}
                  className="p-6 rounded-2xl bg-[#121E30]/72 border border-white/10 hover:border-[#00D4FF]/50 backdrop-blur-xl transition-all flex flex-col justify-between group shadow-xl"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00D4FF]/20 via-[#7C3AED]/20 to-[#FF8A00]/20 border border-[#00D4FF]/30 flex items-center justify-center text-[#00D4FF] group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 font-mono">
                        {mod.duration}
                      </span>
                    </div>

                    {/* Module Title & Tagline */}
                    <span className="text-[10px] uppercase font-mono text-[#00D4FF] font-bold">Module {mod.id}</span>
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#00D4FF] transition-colors">{mod.title}</h3>
                    <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">{mod.description}</p>

                    {/* Skills Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {skillsList.map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-gray-300"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>

                    {/* Mini Project Box */}
                    <div className="p-3 rounded-xl bg-[#07111F]/80 border border-white/10 mb-4">
                      <div className="text-[10px] text-gray-400 uppercase font-semibold">Milestone</div>
                      <div className="text-xs font-bold text-amber-400">{mod.projectTitle}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-xs text-emerald-400 font-semibold">+{mod.rewardXP} XP</span>
                    <Link
                      href={`/replit-ai-academy/lesson/m${mod.id}-l1`}
                      className="text-xs font-bold text-[#00D4FF] hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <span>{isDone ? 'Review Module' : 'Start Module'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* VERIFIED CERTIFICATE PROMO */}
        <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#00D4FF]/20 via-[#7C3AED]/20 to-[#FF8A00]/20 border border-[#00D4FF]/40 backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold uppercase">
                <Award className="w-4 h-4" />
                Verified Graduation Credentials
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Earn your Signature Certificate
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Upon finishing all 12 modules and the Module 12 Capstone Challenge, unlock an official EduVerse Signature Certificate signed by CEO Beshoy Simon with unique verification ID and QR verification code.
              </p>
            </div>

            <Link
              href="/replit-ai-academy/certificate"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#00D4FF] via-[#7C3AED] to-[#FF8A00] text-white font-bold text-sm shadow-2xl flex items-center gap-3 whitespace-nowrap hover:scale-105 transition-all"
            >
              <Award className="w-5 h-5" />
              <span>Preview Certificate</span>
            </Link>
          </div>
        </section>

        <ReplitAIMentor />
      </div>
    </ReplitPageTransition>
  );
}
