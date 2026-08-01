'use client';

import React from 'react';
import { JUDGES_PANEL } from '@/lib/replit-challenge-data';
import { Crown, Sparkles, Building2 } from 'lucide-react';

export default function JudgesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {JUDGES_PANEL.map((judge, idx) => (
        <div
          key={idx}
          className="group relative p-6 rounded-2xl bg-slate-950/80 border border-purple-500/20 backdrop-blur-xl hover:border-purple-400/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] transition-all duration-300 flex flex-col justify-between"
        >
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden border-2 border-purple-500/40 p-1 group-hover:scale-105 transition-transform duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={judge.avatar}
                alt={judge.name}
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-md">
                <Crown className="w-3 h-3" />
              </div>
            </div>

            <h3 className="text-base font-extrabold text-white group-hover:text-purple-300 transition-colors">
              {judge.name}
            </h3>

            <p className="text-xs font-semibold text-purple-400 mt-0.5">{judge.role}</p>

            <div className="flex items-center justify-center space-x-1 mt-1 text-[11px] text-slate-400 font-mono">
              <Building2 className="w-3 h-3 text-slate-500" />
              <span>{judge.company}</span>
            </div>

            <p className="text-xs text-slate-400 mt-3 line-clamp-3 leading-relaxed">
              {judge.bio}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 font-bold px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20">
              Official Judge Panel
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
