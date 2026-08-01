'use client';

import React, { useState } from 'react';
import ReplitNavbar from '@/components/replit-challenge/ReplitNavbar';
import ParticleCanvas from '@/components/replit-challenge/ParticleCanvas';
import ProjectCard from '@/components/replit-challenge/ProjectCard';
import { HALL_OF_FAME_PROJECTS } from '@/lib/replit-challenge-data';
import { Trophy, Search, Sparkles } from 'lucide-react';

export default function ProjectsGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = HALL_OF_FAME_PROJECTS.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 relative overflow-hidden font-sans">
      <ParticleCanvas />
      <ReplitNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase">
            <Trophy className="w-3.5 h-3.5 text-cyan-400" />
            <span>Global Startup Showcase</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            AI Startup Showcase Gallery
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Explore groundbreaking AI startups built by complete beginners using Replit Agent and deployed live.
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
              placeholder="Search AI startups..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Healthcare', 'Climate Tech', 'Legal Tech', 'EdTech'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

      </main>
    </div>
  );
}
