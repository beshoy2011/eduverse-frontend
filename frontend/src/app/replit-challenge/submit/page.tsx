'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ReplitNavbar from '@/components/replit-challenge/ReplitNavbar';
import ParticleCanvas from '@/components/replit-challenge/ParticleCanvas';
import { submitStartupProject } from '@/lib/replit-store';
import { Rocket, Trophy, CheckCircle2, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SubmitStartupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    category: 'Healthcare',
    description: '',
    replitUrl: '',
    demoUrl: '',
    githubUrl: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.replitUrl) return;

    submitStartupProject(formData);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 relative overflow-hidden font-sans">
      <ParticleCanvas />
      <ReplitNavbar />

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 space-y-10">
        
        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase">
            <Rocket className="w-3.5 h-3.5 text-cyan-400" />
            <span>EduVerse Global Build Challenge Entry</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Submit Your AI Startup
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Publish your Replit workspace URL, video walkthrough, and tech stack details to qualify for the Global Championship.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-3xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-xl space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            
            {/* Startup Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono font-bold text-cyan-400 uppercase mb-2">Startup Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AuraMind AI"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-cyan-400 uppercase mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Healthcare">Healthcare & BioTech</option>
                  <option value="EdTech">EdTech & Education</option>
                  <option value="FinTech">FinTech & Commerce</option>
                  <option value="Climate Tech">Climate Tech & ESG</option>
                  <option value="Legal Tech">Legal Tech & Security</option>
                  <option value="Developer Tools">Developer Tools & Infrastructure</option>
                </select>
              </div>
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-xs font-mono font-bold text-cyan-400 uppercase mb-2">Startup Tagline *</label>
              <input
                type="text"
                required
                placeholder="e.g. Autonomous 24/7 Medical Triage & Clinical Note Generator"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-mono font-bold text-cyan-400 uppercase mb-2">Problem & Solution Overview *</label>
              <textarea
                required
                rows={4}
                placeholder="Describe what human problem your AI startup solves and how Replit Agent built your solution..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-mono font-bold text-cyan-400 uppercase mb-2">Replit Project URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://replit.com/@user/project"
                  value={formData.replitUrl}
                  onChange={(e) => setFormData({ ...formData, replitUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-cyan-400 uppercase mb-2">Live Demo App URL</label>
                <input
                  type="url"
                  placeholder="https://my-startup.replit.app"
                  value={formData.demoUrl}
                  onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-cyan-400 uppercase mb-2">GitHub Repo URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/user/project"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_35px_rgba(0,229,255,0.5)] hover:scale-[1.02] transition-transform flex items-center justify-center space-x-2"
            >
              <Rocket className="w-5 h-5" />
              <span>Submit Entry & Claim 1,500 XP</span>
            </button>

          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-10 rounded-3xl bg-slate-950/90 border border-emerald-500/40 backdrop-blur-xl text-center space-y-6 shadow-[0_0_60px_rgba(52,211,153,0.3)]"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-3xl font-black text-white">Startup Submitted Successfully!</h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              Your AI startup <strong className="text-cyan-400">&ldquo;{formData.name}&rdquo;</strong> has been logged in the EduVerse Global Challenge database and qualified for TOP 20 Championship evaluation.
            </p>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold inline-block">
              +1,500 XP Earned • TOP 20 Finalist Badge Unlocked 🏆
            </div>

            <div className="pt-4 flex justify-center space-x-4">
              <button
                onClick={() => router.push('/replit-challenge/dashboard')}
                className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-extrabold text-xs hover:bg-cyan-400 transition-colors"
              >
                Go to Founder Cockpit
              </button>
            </div>
          </motion.div>
        )}

      </main>
    </div>
  );
}
