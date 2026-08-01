'use client';

import React, { useEffect, useState } from 'react';
import ReplitNavbar from '@/components/replit-challenge/ReplitNavbar';
import ParticleCanvas from '@/components/replit-challenge/ParticleCanvas';
import SkillTreeVisualizer from '@/components/replit-challenge/SkillTreeVisualizer';
import { getAcceleratorState, UserAcceleratorState, addXPAndCoins } from '@/lib/replit-store';
import { GitBranch, Zap, CheckCircle2, Trophy, Flame } from 'lucide-react';

export default function SkillTreePage() {
  const [state, setState] = useState<UserAcceleratorState | null>(null);
  const [claimedMissions, setClaimedMissions] = useState<string[]>([]);

  useEffect(() => {
    setState(getAcceleratorState());
  }, []);

  const handleClaimMission = (missionId: string, xp: number, coins: number) => {
    if (claimedMissions.includes(missionId)) return;
    const updated = addXPAndCoins(xp, coins);
    setState(updated);
    setClaimedMissions(prev => [...prev, missionId]);
  };

  if (!state) return null;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 relative overflow-hidden font-sans">
      <ParticleCanvas />
      <ReplitNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase">
            <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Node Progression</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Skill Tree & Mission Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Track your technical mastery across all 12 modules and complete daily missions to earn bonus XP and coins.
          </p>
        </div>

        {/* Skill Tree Visualizer */}
        <SkillTreeVisualizer
          completedModuleIds={state.completedModules}
          userXp={state.xp}
        />

        {/* Missions Quest Log */}
        <div className="p-8 rounded-3xl bg-slate-950/80 border border-slate-800 backdrop-blur-xl space-y-6">
          <div>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase">Daily & Weekly Quests</span>
            <h3 className="text-xl font-extrabold text-white mt-1">Accelerator Mission System</h3>
          </div>

          <div className="space-y-4">
            {[
              { id: 'm1', title: 'Complete 2 Curriculum Modules', xp: 400, coins: 100, completed: state.completedModules.length >= 2 },
              { id: 'm2', title: 'Execute Code in Replit Agent Playground', xp: 200, coins: 50, completed: true },
              { id: 'm3', title: 'Maintain 3-Day Daily Active Streak', xp: 500, coins: 150, completed: state.streakDays >= 3 },
              { id: 'm4', title: 'Submit AI Startup to Global Challenge', xp: 1500, coins: 500, completed: !!state.submittedProject }
            ].map((mission) => {
              const isClaimed = claimedMissions.includes(mission.id);
              return (
                <div
                  key={mission.id}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${mission.completed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'}`}>
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white">{mission.title}</h4>
                      <p className="text-xs font-mono text-cyan-400">+{mission.xp} XP • +{mission.coins} Coins</p>
                    </div>
                  </div>

                  <div>
                    {mission.completed ? (
                      <button
                        onClick={() => handleClaimMission(mission.id, mission.xp, mission.coins)}
                        disabled={isClaimed}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          isClaimed
                            ? 'bg-slate-800 text-slate-500'
                            : 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 hover:scale-105 shadow-md'
                        }`}
                      >
                        {isClaimed ? 'Claimed ✓' : 'Claim Reward!'}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500 font-mono">In Progress</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}
