'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, CheckCircle2, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { REPLIT_SKILL_NODES, REPLIT_CHALLENGE_MODULES } from '@/lib/replit-challenge-data';

interface SkillTreeProps {
  completedModuleIds: number[];
  userXp: number;
}

export default function SkillTreeVisualizer({ completedModuleIds, userXp }: SkillTreeProps) {
  return (
    <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.8)]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-extrabold text-white">Interactive Accelerator Skill Tree</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete modules to unlock advanced AI, backend, and venture startup nodes.
          </p>
        </div>

        <div className="flex items-center space-x-4 text-xs font-semibold">
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
            <span>Completed</span>
          </div>
          <div className="flex items-center space-x-1.5 text-cyan-400">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
            <span>Unlocked</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <span>Locked</span>
          </div>
        </div>
      </div>

      {/* Grid of Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {REPLIT_SKILL_NODES.map((node, index) => {
          const isCompleted = completedModuleIds.includes(node.id);
          const isUnlocked = isCompleted || (node.prerequisiteId === null || completedModuleIds.includes(node.prerequisiteId)) || userXp >= node.xpRequired;
          const moduleData = REPLIT_CHALLENGE_MODULES.find(m => m.id === node.id);

          return (
            <div
              key={node.id}
              className={`relative p-5 rounded-2xl border transition-all duration-300 ${
                isCompleted
                  ? 'bg-emerald-950/30 border-emerald-500/40 shadow-[0_0_20px_rgba(52,211,153,0.15)]'
                  : isUnlocked
                  ? 'bg-slate-900/90 border-cyan-500/40 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,229,255,0.25)]'
                  : 'bg-slate-950/40 border-slate-800 opacity-60'
              }`}
            >
              {/* Top Row: Node Number & Category */}
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md font-mono uppercase ${
                  isCompleted ? 'bg-emerald-500/20 text-emerald-300' : isUnlocked ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-500'
                }`}>
                  Module 0{node.id} • {node.category}
                </span>

                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : isUnlocked ? (
                  <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-500" />
                )}
              </div>

              {/* Title & Description */}
              <h4 className="text-sm font-extrabold text-white mb-1">{node.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2">
                {moduleData?.subtitle || 'Master key startup concepts & build tools.'}
              </p>

              {/* Node Footer / CTA */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-cyan-400">
                  +{moduleData?.xpReward || 300} XP
                </span>

                {isUnlocked ? (
                  <Link
                    href={`/replit-challenge/lesson/${node.id}`}
                    className="flex items-center space-x-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>{isCompleted ? 'Review' : 'Start'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <span className="text-[11px] text-slate-500 font-mono">
                    Req: {node.xpRequired} XP
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
