'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import EduVerseNavbar from '@/components/EduVerseNavbar';
import ParticleMeshCanvas from '@/components/ParticleMeshCanvas';
import AIMentorDrawer from '@/components/AIMentorDrawer';
import { Rocket, Flame, ExternalLink, Search, Filter, Sparkles, Star, Plus } from 'lucide-react';

export default function ProjectsPage() {
  const [aiMentorOpen, setAIMentorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const projects = [
    {
      name: 'NexusAI',
      founder: 'Alex Rivera',
      track: 'Autonomous Code AI',
      desc: 'AI agent that converts Figma wireframes into production Next.js 16 React components in 10 seconds.',
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
    {
      name: 'SynthDesign',
      founder: 'Elena Rostova',
      track: 'Multimodal GenAI',
      desc: 'Generative 3D model engine for indie game developers using diffusion pipelines.',
      mrr: '$19.5k MRR',
      upvotes: 512,
      tags: ['PyTorch', 'Three.js', 'StableDiffusion'],
    },
  ];

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || p.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-[#00E5FF]/30 selection:text-[#00E5FF]">
      <ParticleMeshCanvas />
      <EduVerseNavbar onOpenAIMentor={() => setAIMentorOpen(true)} />
      <AIMentorDrawer isOpen={aiMentorOpen} onClose={() => setAIMentorOpen(false)} />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 z-10 w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 text-xs font-semibold">
              <Rocket className="w-3.5 h-3.5" />
              <span>EduVerse AI Incubator Showcase</span>
            </div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white">Student AI Startups</h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Discover, test, and invest in real AI products built by EduVerse students.
            </p>
          </div>

          <button
            onClick={() => alert("Launching Startup Submission Portal...")}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-slate-950 font-heading font-bold text-xs shadow-lg shadow-[#00E5FF]/20 hover:scale-105 transition-transform flex items-center space-x-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Your Startup</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 w-full sm:w-80 bg-[#0F172A] px-3.5 py-2 rounded-xl border border-white/10">
            <Search className="w-4 h-4 text-[#00E5FF]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search startups or tech stack..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
            {['Next.js 16', 'Claude 3.7', 'Supabase', 'Python', 'Voice AI'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-semibold whitespace-nowrap transition-colors ${
                  selectedTag === tag
                    ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((p, idx) => (
            <div key={idx} className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/30 text-[#A855F7]">
                    {p.track}
                  </span>
                  <span className="font-num text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    {p.mrr}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-white flex items-center space-x-2">
                    <span>{p.name}</span>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Founded by {p.founder}</p>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((t, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-400">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-num">
                    <Flame className="w-4 h-4 text-amber-500" /> {p.upvotes} Upvotes
                  </span>
                  <button className="text-[#00E5FF] font-semibold hover:underline">
                    View Live Pitch Deck →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
