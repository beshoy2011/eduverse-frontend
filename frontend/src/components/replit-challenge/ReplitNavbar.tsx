'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Zap, Flame, Award, Trophy, BookOpen, Rocket, 
  Crown, LayoutDashboard, GitBranch, Menu, X, Coins, Sparkles, User
} from 'lucide-react';
import { getAcceleratorState, UserAcceleratorState } from '@/lib/replit-store';

export default function ReplitNavbar() {
  const pathname = usePathname();
  const [state, setState] = useState<UserAcceleratorState | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setState(getAcceleratorState());
    
    const handleStorage = () => {
      setState(getAcceleratorState());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [pathname]);

  const navLinks = [
    { name: 'Overview', href: '/replit-challenge', icon: Sparkles },
    { name: 'Curriculum', href: '/replit-challenge/course', icon: BookOpen },
    { name: 'Cockpit', href: '/replit-challenge/dashboard', icon: LayoutDashboard },
    { name: 'Global Challenge', href: '/replit-challenge/global-challenge', icon: Rocket },
    { name: 'Skill Tree', href: '/replit-challenge/skill-tree', icon: GitBranch },
    { name: 'Projects', href: '/replit-challenge/projects', icon: Trophy },
    { name: 'Leaderboard', href: '/replit-challenge/leaderboard', icon: Award },
    { name: 'Hall of Fame', href: '/replit-challenge/hall-of-fame', icon: Crown },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-cyan-500/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Branding */}
          <Link href="/replit-challenge" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-[1px] shadow-[0_0_20px_rgba(0,229,255,0.4)] group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">EduVerse</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">× Replit</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">AI Startup Builder</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Gamification Stats & CTA */}
          <div className="hidden sm:flex items-center space-x-3">
            {state && (
              <div className="flex items-center space-x-2.5 bg-slate-900/90 border border-slate-800 rounded-full px-3.5 py-1 text-xs">
                {/* Level */}
                <div className="flex items-center space-x-1 text-purple-400 font-bold">
                  <span className="text-[10px] uppercase text-slate-500">Lv</span>
                  <span>{state.level}</span>
                </div>
                
                <span className="text-slate-800">|</span>

                {/* XP */}
                <div className="flex items-center space-x-1 text-cyan-400 font-semibold">
                  <Zap className="w-3 h-3 text-cyan-400 fill-cyan-400/30" />
                  <span>{state.xp.toLocaleString()} XP</span>
                </div>

                <span className="text-slate-800">|</span>

                {/* Coins */}
                <div className="flex items-center space-x-1 text-amber-400 font-semibold">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>{state.coins}</span>
                </div>

                <span className="text-slate-800">|</span>

                {/* Streak */}
                <div className="flex items-center space-x-1 text-orange-400 font-bold animate-pulse">
                  <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                  <span>{state.streakDays}d</span>
                </div>
              </div>
            )}

            <Link
              href="/replit-challenge/submit"
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 text-slate-950 font-extrabold text-xs shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] hover:scale-105 transition-all duration-300"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Submit Startup</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-cyan-500/20 bg-slate-950/95 backdrop-blur-2xl px-4 py-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 text-cyan-400" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          
          {state && (
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span className="text-cyan-400 font-bold">Level {state.level} ({state.xp} XP)</span>
              <span className="text-amber-400 font-semibold">{state.coins} Coins</span>
              <span className="text-orange-400 font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-orange-500" /> {state.streakDays} Days
              </span>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
