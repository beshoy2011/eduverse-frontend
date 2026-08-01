'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trophy, ExternalLink, Star, Zap, Award, GitBranch } from 'lucide-react';
import { HallOfFameProject } from '@/lib/replit-challenge-data';

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

interface ProjectCardProps {
  project: HallOfFameProject;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group relative rounded-2xl bg-slate-950/80 border border-cyan-500/20 overflow-hidden hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(0,229,255,0.2)] transition-all duration-300 flex flex-col justify-between">
      
      {/* Project Banner / Thumbnail */}
      <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
        {/* Placeholder image or fallback */}
        <div 
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url(${project.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Badge & Rank Pill */}
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-xs font-bold font-mono">
            #{project.rank} Rank
          </span>
          <span className="px-2.5 py-1 rounded-full bg-purple-500/20 backdrop-blur-md border border-purple-500/40 text-purple-300 text-xs font-semibold">
            {project.category}
          </span>
        </div>

        <div className="absolute top-3 right-3 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-extrabold font-mono">
          <Star className="w-3.5 h-3.5 fill-amber-300" />
          <span>{project.score}</span>
        </div>
      </div>

      {/* Project Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-extrabold text-white group-hover:text-cyan-400 transition-colors">
              {project.name}
            </h3>
          </div>
          <p className="text-xs font-semibold text-cyan-400 mb-2">{project.tagline}</p>
          <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
            {project.description}
          </p>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.map((tech, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-mono">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Founder & External Links Footer */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.avatar} alt={project.founder} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-medium text-slate-300">{project.founder}</span>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="GitHub Repository"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold transition-colors"
            >
              <span>Demo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
