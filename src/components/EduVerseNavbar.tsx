'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Flame, Zap, Search, Bell, Bot, Menu, X, Rocket, Trophy,
  Compass, Code2, Users, Calendar, Award, ShoppingBag, Briefcase, User, LayoutDashboard, CompassIcon
} from 'lucide-react';

interface EduVerseNavbarProps {
  onOpenAIMentor?: () => void;
}

export default function EduVerseNavbar({ onOpenAIMentor }: EduVerseNavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Tracks', href: '/courses', icon: Compass },
    { label: 'IDE & Challenges', href: '/replit-challenge', icon: Code2 },
    { label: 'AI Startups', href: '/projects', icon: Rocket },
    { label: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { label: 'Community', href: '/community', icon: Users },
    { label: 'Mentors', href: '/mentors', icon: User },
    { label: 'Events', href: '/events', icon: Calendar },
    { label: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
    { label: 'Jobs', href: '/jobs', icon: Briefcase },
    { label: 'Certificates', href: '/certificates', icon: Award },
  ];

  const searchResults = [
    { title: 'Build RAG AI Agent in 20 Mins', type: 'Challenge', href: '/replit-challenge' },
    { title: 'LLM Architect Master Track', type: 'Course Track', href: '/courses' },
    { title: 'Sam Altman AI Office Hours', type: 'Event', href: '/events' },
    { title: 'NexusAI - Autonomous Coding Startup', type: 'Project', href: '/projects' },
  ].filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#030712]/85 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-[#00E5FF]/5'
            : 'bg-[#030712]/60 backdrop-blur-md border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#7C3AED] p-0.5 shadow-lg shadow-[#00E5FF]/20 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#00E5FF] group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div>
                <span className="font-heading font-extrabold text-xl tracking-tight text-white group-hover:text-[#00E5FF] transition-colors">
                  EduVerse
                </span>
                <span className="hidden md:inline-block ml-2 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/30 text-[#A855F7]">
                  AI Startup Hub
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.slice(0, 6).map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                      isActive ? 'text-[#00E5FF]' : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="relative z-10 flex items-center space-x-1.5">
                      <item.icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
              
              {/* More dropdown / additional nav items */}
              <div className="relative group">
                <button className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg flex items-center space-x-1">
                  <span>More</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 py-2 glass-card rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200">
                  {navItems.slice(6).map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-300 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF]"
                    >
                      <item.icon className="w-4 h-4 text-slate-400" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Gamification Stats & Action Controls */}
            <div className="flex items-center space-x-3">
              
              {/* Streak Badge */}
              <div className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#0F172A] border border-amber-500/30 text-amber-400 text-xs font-num font-semibold shadow-sm">
                <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
                <span>7 Days</span>
              </div>

              {/* XP Badge */}
              <div className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#0F172A] border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-num font-semibold shadow-sm">
                <Zap className="w-4 h-4 text-[#00E5FF]" />
                <span>2,450 XP</span>
              </div>

              {/* Search trigger button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                title="Search Everywhere (Cmd+K)"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00E5FF]" />
                </button>

                {/* Notifications Drawer */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 glass-card rounded-2xl p-4 shadow-2xl z-50">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="font-heading text-xs font-bold text-white">Notifications</span>
                      <span className="text-[10px] text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded-full">3 New</span>
                    </div>
                    <div className="mt-3 space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                        <p className="font-semibold text-slate-200">🚀 Y Combinator Office Hours</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Your pitch review is scheduled for tomorrow at 4 PM PST.</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                        <p className="font-semibold text-[#00E5FF]">🔥 7-Day Streak Achieved!</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">You earned 500 bonus XP and the AI Builder Badge.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Mentor Assistant Button */}
              <button
                onClick={onOpenAIMentor}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-slate-950 font-semibold text-xs shadow-lg shadow-[#00E5FF]/20 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Bot className="w-4 h-4 text-slate-950" />
                <span>AI Mentor</span>
              </button>

              {/* User Profile CTA */}
              <Link
                href="/profile"
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#00E5FF] p-0.5 flex items-center justify-center hover:scale-105 transition-transform"
              >
                <div className="w-full h-full bg-[#0F172A] rounded-full flex items-center justify-center text-xs font-bold text-[#00E5FF]">
                  EV
                </div>
              </Link>

              {/* Mobile menu hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden glass-card border-t border-white/10 px-4 py-6 space-y-3"
            >
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 p-2.5 rounded-xl bg-white/5 text-xs text-slate-200 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF]"
                  >
                    <item.icon className="w-4 h-4 text-[#00E5FF]" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenAIMentor) onOpenAIMentor();
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg"
              >
                <Bot className="w-4 h-4" />
                <span>Ask AI Mentor Assistant</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl glass-card rounded-2xl p-4 border border-[#00E5FF]/30 shadow-2xl"
            >
              <div className="flex items-center space-x-3 pb-3 border-b border-white/10">
                <Search className="w-5 h-5 text-[#00E5FF]" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search challenges, courses, AI startups, mentors..."
                  className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-[#00E5FF]">
                        {item.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#7C3AED]/20 text-[#A855F7] border border-[#7C3AED]/30">
                        {item.type}
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">No matching resources found.</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
