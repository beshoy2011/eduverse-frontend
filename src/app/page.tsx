'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import EduVerseNavbar from '@/components/EduVerseNavbar';
import ParticleMeshCanvas from '@/components/ParticleMeshCanvas';
import AIMentorDrawer from '@/components/AIMentorDrawer';
import {
  Rocket, Sparkles, ArrowRight, Play, CheckCircle2, ShieldCheck, Flame, Zap,
  Globe, Users, Award, Code2, Terminal, Bot, ChevronDown, ExternalLink, Star,
  TrendingUp, Layers, Cpu, Compass, Laptop, Video, HelpCircle, Check
} from 'lucide-react';

export default function LandingPage() {
  const [aiMentorOpen, setAIMentorOpen] = useState(false);
  const [demoVideoOpen, setDemoVideoOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'choose' | 'learn' | 'build' | 'submit' | 'win'>('build');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const trustedLogos = [
    { name: 'Google', symbol: 'Google' },
    { name: 'OpenAI', symbol: 'OpenAI' },
    { name: 'Microsoft', symbol: 'Microsoft' },
    { name: 'NVIDIA', symbol: 'NVIDIA' },
    { name: 'GitHub', symbol: 'GitHub' },
    { name: 'Cloudflare', symbol: 'Cloudflare' },
    { name: 'Replit', symbol: 'Replit' },
    { name: 'Meta', symbol: 'Meta' },
    { name: 'Anthropic', symbol: 'Anthropic' },
    { name: 'Stripe', symbol: 'Stripe' },
  ];

  const ecosystemStats = [
    { label: 'Active Students', value: '50,000+', change: '+24% this mo' },
    { label: 'Countries Represented', value: '120+', change: 'Global Network' },
    { label: 'AI Startups Built', value: '1,200+', change: '$12M VC Raised' },
    { label: 'YC & VC Mentors', value: '85+', change: '24/7 Office Hours' },
    { label: 'Verified Certificates', value: '34,000+', change: 'Cryptographic' },
    { label: 'Founder Community', value: '100,000+', change: 'Active Builders' },
  ];

  const howItWorksSteps = [
    {
      id: 'choose',
      num: '01',
      title: 'Choose Path',
      desc: 'Select your AI specialization: LLM Agents, GenAI SaaS, Multimodal Vision, or Autonomous Code AI.',
      detail: 'Tailored roadmap crafted by AI after a 60-second onboarding interview.',
      icon: Compass,
    },
    {
      id: 'learn',
      num: '02',
      title: 'Learn',
      desc: 'Master cutting-edge AI architecture with 24/7 interactive guidance from your dedicated AI Tutor.',
      detail: 'Zero fluff syllabus built in collaboration with top AI researchers from Stanford & MIT.',
      icon: Bot,
    },
    {
      id: 'build',
      num: '03',
      title: 'Build',
      desc: 'Code real production applications directly in the Replit/Cursor-style browser IDE sandbox.',
      detail: 'Full-stack Next.js, Supabase, Tailwind, vector databases, and real LLM APIs.',
      icon: Terminal,
    },
    {
      id: 'submit',
      num: '04',
      title: 'Submit',
      desc: 'Submit your startup to monthly Y Combinator-style pitch competitions evaluated by real VC judges.',
      detail: 'Receive structured feedback, investor upvotes, and public showcase badges.',
      icon: Rocket,
    },
    {
      id: 'win',
      num: '05',
      title: 'Win',
      desc: 'Graduation brings real startup ownership, investor introductions, portfolio badges, and certified credentials.',
      detail: 'Gain access to top VC hiring networks, Stripe grant credits, and founder incubators.',
      icon: Award,
    },
  ];

  const studentStartups = [
    {
      name: 'NexusAI',
      founder: 'Alex Rivera',
      track: 'Autonomous Code AI',
      desc: 'AI agent that converts Figma wireframes into production React components in 10 seconds.',
      mrr: '$14.2k MRR',
      upvotes: 482,
      tags: ['Next.js 16', 'Claude 3.7', 'Supabase'],
    },
    {
      name: 'NeuroDoc',
      founder: 'Sara Chen',
      track: 'GenAI SaaS',
      desc: 'Multimodal AI research copilot for biomedical papers with automated synthesis graphs.',
      mrr: '$8.8k MRR',
      upvotes: 395,
      tags: ['Python', 'Pinecone', 'RAG Pipeline'],
    },
    {
      name: 'VoiceCraft',
      founder: 'Marcus Vance',
      track: 'LLM Agents',
      desc: 'Real-time conversational AI phone receptionist for local enterprise businesses.',
      mrr: '$22.0k MRR',
      upvotes: 620,
      tags: ['Voice AI', 'Twilio', 'FastAPI'],
    },
  ];

  const timelineSteps = [
    { phase: 'Phase 1', title: 'Onboarding & AI Roadmap', subtitle: 'Day 1', desc: 'Identify your target market, configure your track, and launch your first AI prompt pipeline.' },
    { phase: 'Phase 2', title: 'Full-Stack AI Architecture', subtitle: 'Week 2', desc: 'Build reactive Next.js 16 UIs, hook up vector embeddings, and store user state in Supabase.' },
    { phase: 'Phase 3', title: 'Replit Challenge Arena', subtitle: 'Week 4', desc: 'Compete in 48-hour live AI hackathons with automated code evaluation.' },
    { phase: 'Phase 4', title: 'Product Launch & Pitch Day', subtitle: 'Week 8', desc: 'Deploy your live AI startup, launch on ProductHunt & EduVerse Marketplace, and pitch VCs.' },
  ];

  const faqs = [
    {
      q: 'How is EduVerse different from traditional coding bootcamps or online courses?',
      a: 'EduVerse is an AI Innovation Ecosystem. You do not just watch video lectures; you build and launch an actual AI startup project. Every student graduates with a real portfolio, pitch deck, GitHub repository, live web application, and verified certificate.',
    },
    {
      q: 'Do I need prior coding experience to join EduVerse?',
      a: 'No prior experience is required! Our onboarding AI crafts a personalized step-by-step roadmap tailored to absolute beginners, guiding you from zero to building full-stack AI applications.',
    },
    {
      q: 'What is the 24/7 AI Mentor?',
      a: 'Your AI Mentor is an intelligent assistant available directly inside your browser workspace. It explains complex concepts, debugs code errors in real-time, suggests prompt optimizations, and offers YC-level startup pitch advice.',
    },
    {
      q: 'Are certificates cryptographically verifiable?',
      a: 'Yes. Every EduVerse certificate includes a unique verification QR code and cryptographic hash link that employers, investors, and universities can instantly verify on the blockchain.',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 flex flex-col overflow-x-hidden selection:bg-[#00E5FF]/30 selection:text-[#00E5FF]">
      
      {/* Interactive Particle Canvas */}
      <ParticleMeshCanvas />

      {/* Glass Sticky Navbar */}
      <EduVerseNavbar onOpenAIMentor={() => setAIMentorOpen(true)} />

      {/* AI Mentor Drawer */}
      <AIMentorDrawer isOpen={aiMentorOpen} onClose={() => setAIMentorOpen(false)} />

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 w-full">
        
        {/* Glow ambient background spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#00E5FF]/20 via-[#7C3AED]/20 to-[#A855F7]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-8 max-w-4xl mx-auto">
          
          {/* Top Pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card border border-[#00E5FF]/30 text-xs font-semibold text-[#00E5FF] shadow-lg shadow-[#00E5FF]/10"
          >
            <Sparkles className="w-4 h-4 animate-spin-slow text-[#00E5FF]" />
            <span>The Future Starts Here. — An AI Innovation Ecosystem</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.1]"
          >
            Build Your <br />
            <span className="text-gradient-cyan-purple glow-cyan">AI Startup.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-2xl text-slate-300 font-medium tracking-wide flex items-center justify-center space-x-3 sm:space-x-6"
          >
            <span className="text-[#00E5FF]">Learn.</span>
            <span className="text-slate-500">•</span>
            <span className="text-[#A855F7]">Build.</span>
            <span className="text-slate-500">•</span>
            <span className="text-[#7C3AED]">Launch.</span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400">Win.</span>
          </motion.p>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            EduVerse transforms beginners into AI founders and engineers. Learn cutting-edge model architectures, code live in browser sandboxes, and graduate with a real startup portfolio.
          </p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/onboarding"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00E5FF] via-[#38BDF8] to-[#7C3AED] text-slate-950 font-heading font-extrabold text-sm sm:text-base shadow-xl shadow-[#00E5FF]/25 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center space-x-2"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/replit-challenge"
              className="px-8 py-4 rounded-2xl glass-card border border-white/15 hover:border-[#00E5FF]/50 text-white font-heading font-bold text-sm sm:text-base hover:bg-white/10 transition-all duration-200 flex items-center space-x-2"
            >
              <Code2 className="w-5 h-5 text-[#00E5FF]" />
              <span>Explore Challenges</span>
            </Link>

            <button
              onClick={() => setDemoVideoOpen(true)}
              className="px-6 py-4 rounded-2xl glass-card border border-white/10 hover:border-purple-500/50 text-slate-300 hover:text-white font-semibold text-sm flex items-center space-x-2 transition-all"
            >
              <Play className="w-4 h-4 text-[#A855F7] fill-[#A855F7]" />
              <span>Watch Demo</span>
            </button>
          </motion.div>

          {/* Hero Live IDE Preview Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-8"
          >
            <div className="glass-card rounded-3xl border border-white/15 p-4 sm:p-6 shadow-2xl shadow-[#00E5FF]/10 text-left overflow-hidden relative">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs font-num font-mono text-slate-400">EduVerse Browser IDE — main.py</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Live Sandbox
                  </span>
                </div>
              </div>
              <div className="py-4 font-mono text-xs sm:text-sm text-slate-300 space-y-1.5 overflow-x-auto">
                <p><span className="text-[#A855F7]">import</span> <span className="text-white">eduverse_ai</span> <span className="text-[#A855F7]">as</span> <span className="text-white">ai</span></p>
                <p><span className="text-slate-500"># 1. Initialize Autonomous AI Startup Agent</span></p>
                <p><span className="text-[#00E5FF]">agent</span> = ai.<span className="text-amber-300">Agent</span>(name=<span className="text-emerald-300">"NexusAI"</span>, track=<span className="text-emerald-300">"LLM Architect"</span>)</p>
                <p><span className="text-[#00E5FF]">agent</span>.<span className="text-amber-300">connect_supabase</span>(table=<span className="text-emerald-300">"user_roadmaps"</span>)</p>
                <p><span className="text-[#00E5FF]">agent</span>.<span className="text-amber-300">deploy_edge_function</span>(provider=<span className="text-emerald-300">"Vercel"</span>)</p>
                <p className="pt-2 text-emerald-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>[OUTPUT]: AI Product deployed successfully to https://nexusai.eduverse.app 🚀</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUSTED BY MARQUEE */}
      <section className="py-12 border-y border-white/5 bg-[#0F172A]/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center mb-6">
          <span className="text-xs uppercase tracking-widest font-heading font-semibold text-slate-400">
            Trusted by Builders & Researchers From
          </span>
        </div>
        <div className="flex overflow-hidden space-x-12 select-none group">
          <div className="flex space-x-12 animate-marquee shrink-0 items-center">
            {trustedLogos.map((logo, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 text-slate-400 hover:text-[#00E5FF] transition-colors cursor-pointer px-4"
              >
                <Cpu className="w-4 h-4 text-[#00E5FF]" />
                <span className="font-heading font-bold text-base sm:text-lg tracking-tight">{logo.name}</span>
              </div>
            ))}
          </div>
          <div className="flex space-x-12 animate-marquee shrink-0 items-center" aria-hidden="true">
            {trustedLogos.map((logo, index) => (
              <div
                key={`dup-${index}`}
                className="flex items-center space-x-2 text-slate-400 hover:text-[#00E5FF] transition-colors cursor-pointer px-4"
              >
                <Cpu className="w-4 h-4 text-[#00E5FF]" />
                <span className="font-heading font-bold text-base sm:text-lg tracking-tight">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (5 STAGES) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/30 text-[#A855F7]">
            Execution Architecture
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white">How It Works</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            From zero coding knowledge to launching a venture-backed AI startup.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {howItWorksSteps.map((step) => {
            const isActive = activeTab === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveTab(step.id as any)}
                className={`px-5 py-3 rounded-2xl font-heading font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-slate-950 shadow-lg shadow-[#00E5FF]/20 scale-105'
                    : 'glass-card text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="font-num text-[11px] opacity-75">{step.num}</span>
                <span>{step.title}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="max-w-3xl mx-auto">
          {howItWorksSteps.map((step) => {
            if (step.id !== activeTab) return null;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="glass-card rounded-3xl p-8 border border-[#00E5FF]/30 shadow-2xl relative overflow-hidden"
              >
                <div className="flex items-start space-x-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00E5FF] to-[#7C3AED] p-0.5 shrink-0 shadow-lg shadow-[#00E5FF]/20">
                    <div className="w-full h-full bg-[#0F172A] rounded-[14px] flex items-center justify-center">
                      <step.icon className="w-7 h-7 text-[#00E5FF]" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-num text-xs font-bold text-[#00E5FF] uppercase tracking-wider">
                        Stage {step.num}
                      </span>
                      <h3 className="font-heading text-2xl font-bold text-white">{step.title}</h3>
                    </div>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{step.desc}</p>
                    <p className="text-xs text-slate-400 pt-2 border-t border-white/10 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{step.detail}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ECOSYSTEM NUMBERS */}
      <section className="py-20 border-y border-white/10 bg-[#0F172A]/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {ecosystemStats.map((stat, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-white/5 hover:border-[#00E5FF]/30 transition-colors">
                <p className="font-num font-extrabold text-3xl sm:text-4xl text-gradient-cyan-purple">
                  {stat.value}
                </p>
                <p className="font-heading font-semibold text-xs text-slate-200 mt-2">{stat.label}</p>
                <span className="inline-block mt-2 text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                  {stat.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STUDENT STARTUP SHOWCASE */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4 md:space-y-0">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF]">
              Founder Portfolio
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white mt-3">
              Built by EduVerse Students
            </h2>
          </div>
          <Link
            href="/projects"
            className="text-xs font-heading font-bold text-[#00E5FF] hover:underline flex items-center space-x-1"
          >
            <span>Explore All 1,200+ Startups</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {studentStartups.map((startup, idx) => (
            <div key={idx} className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/30 text-[#A855F7]">
                    {startup.track}
                  </span>
                  <span className="font-num text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    {startup.mrr}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-white flex items-center space-x-2">
                    <span>{startup.name}</span>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Founded by {startup.founder}</p>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{startup.desc}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex flex-wrap gap-1.5">
                  {startup.tags.map((t, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-400">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-num">
                    <Flame className="w-4 h-4 text-amber-500" /> {startup.upvotes} Investor Upvotes
                  </span>
                  <span className="text-[#00E5FF] font-semibold cursor-pointer hover:underline">View Pitch Deck →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STARTUP ROADMAP TIMELINE */}
      <section className="py-20 border-t border-white/10 bg-[#0F172A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
              The Founder Journey
            </h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">
              How EduVerse takes you from zero lines of code to pitching top venture capitalists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl relative border-t-2 border-t-[#00E5FF]">
                <span className="font-num text-xs font-bold text-[#00E5FF] block mb-1">{step.phase} • {step.subtitle}</span>
                <h4 className="font-heading font-bold text-base text-white mb-2">{step.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center space-y-3 mb-12">
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-sm">Everything you need to know about the EduVerse platform.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-heading font-bold text-sm sm:text-base text-white hover:text-[#00E5FF]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#00E5FF]' : 'text-slate-400'}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-white/10 bg-[#030712] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 text-xs text-slate-400">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#00E5FF]" />
              <span className="font-heading font-extrabold text-lg text-white">EduVerse</span>
            </div>
            <p className="max-w-sm text-slate-400 leading-relaxed">
              The world's premier AI innovation ecosystem. Students become founders, engineers, researchers, and creators.
            </p>
            <p className="text-[11px] text-slate-500 font-num">
              © 2026 EduVerse Platform Inc. All rights reserved.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold text-white mb-3 text-xs uppercase tracking-wider">Ecosystem</h4>
            <ul className="space-y-2">
              <li><Link href="/courses" className="hover:text-[#00E5FF]">Tracks</Link></li>
              <li><Link href="/replit-challenge" className="hover:text-[#00E5FF]">IDE Challenges</Link></li>
              <li><Link href="/projects" className="hover:text-[#00E5FF]">AI Startups</Link></li>
              <li><Link href="/leaderboard" className="hover:text-[#00E5FF]">Leaderboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-white mb-3 text-xs uppercase tracking-wider">Community</h4>
            <ul className="space-y-2">
              <li><Link href="/mentors" className="hover:text-[#00E5FF]">VC Mentors</Link></li>
              <li><Link href="/community" className="hover:text-[#00E5FF]">Pitch Reviews</Link></li>
              <li><Link href="/events" className="hover:text-[#00E5FF]">Demo Days</Link></li>
              <li><Link href="/jobs" className="hover:text-[#00E5FF]">Talent Network</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-white mb-3 text-xs uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/dashboard" className="hover:text-[#00E5FF]">Dashboard</Link></li>
              <li><Link href="/onboarding" className="hover:text-[#00E5FF]">AI Onboarding</Link></li>
              <li><Link href="/certificates" className="hover:text-[#00E5FF]">Certificates</Link></li>
              <li><Link href="/admin" className="hover:text-[#00E5FF]">Admin Portal</Link></li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Demo Video Modal */}
      <AnimatePresence>
        {demoVideoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-3xl glass-card rounded-3xl p-6 border border-[#00E5FF]/40 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                  <Play className="w-4 h-4 text-[#00E5FF] fill-[#00E5FF]" /> EduVerse Platform Overview Demo
                </h3>
                <button
                  onClick={() => setDemoVideoOpen(false)}
                  className="text-slate-400 hover:text-white px-3 py-1 rounded-lg bg-white/5"
                >
                  Close ✕
                </button>
              </div>
              <div className="aspect-video w-full rounded-2xl bg-slate-900 flex flex-col items-center justify-center border border-white/10 space-y-4">
                <Bot className="w-12 h-12 text-[#00E5FF] animate-bounce" />
                <p className="font-heading text-sm text-slate-300 font-bold">Interactive AI Ecosystem Preview</p>
                <p className="text-xs text-slate-500 max-w-sm text-center">
                  Live demo showcasing the Replit-style browser IDE, AI pair programming mentor, and YC pitch deck engine.
                </p>
                <Link
                  href="/onboarding"
                  onClick={() => setDemoVideoOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-slate-950 font-bold text-xs"
                >
                  Get Started Free Now →
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
