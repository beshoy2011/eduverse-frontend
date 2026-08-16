'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Radio, Check, Sparkles, Filter, Compass } from 'lucide-react';

interface NoiseLabel {
  id: string;
  label: string;
  x: number; // percentage offset
  y: number;
  noiseDeg: number;
}

const NOISE_TAGS: NoiseLabel[] = [
  { id: '1', label: 'TUTORIAL HELL', x: 8, y: 15, noiseDeg: -6 },
  { id: '2', label: '100+ HR YOUTUBE PLAYLIST', x: 72, y: 12, noiseDeg: 4 },
  { id: '3', label: 'OUTDATED DOCUMENTATION', x: 18, y: 38, noiseDeg: -3 },
  { id: '4', label: 'RANDOM GITHUB REPOS', x: 68, y: 34, noiseDeg: 5 },
  { id: '5', label: 'GENERIC AI SNIPPETS', x: 12, y: 62, noiseDeg: 7 },
  { id: '6', label: 'CONFUSING ROADMAPS', x: 76, y: 58, noiseDeg: -5 },
  { id: '7', label: 'PASSIVE VIDEO WATCHING', x: 24, y: 82, noiseDeg: -4 },
  { id: '8', label: 'UNSOLVED STACKOVERFLOW', x: 62, y: 78, noiseDeg: 3 },
  { id: '9', label: '$15,000 BOOTCAMPS', x: 42, y: 92, noiseDeg: -2 },
  { id: '10', label: 'CERTIFICATE COLLECTING', x: 48, y: 8, noiseDeg: 6 }
];

const LOOP_STEPS = [
  { step: '01', name: 'LEARN', desc: 'Mental models with developer analogies' },
  { step: '02', name: 'WRITE', desc: 'Browser-native runtime scratchpad' },
  { step: '03', name: 'RUN', desc: 'Real Python / C++ sandboxed execution' },
  { step: '04', name: 'BREAK', desc: 'Intentional boundary edge-case crashes' },
  { step: '05', name: 'DEBUG', desc: 'Line-level AST trace & stack inspection' },
  { step: '06', name: 'UNDERSTAND', desc: 'Permanent systems intuition for life' }
];

export default function SignalOverloadSection() {
  const [signalState, setSignalState] = useState<'overload' | 'searching' | 'direction'>('overload');
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Subtle automatic focus shift as user reads into the section
          const timer1 = setTimeout(() => setSignalState('searching'), 2400);
          const timer2 = setTimeout(() => setSignalState('direction'), 4800);
          return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
          };
        }
      },
      { threshold: 0.35 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="space-y-12 border-t border-white/10 pt-16 font-sans select-none relative overflow-hidden"
    >
      {/* Section Technical Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 font-mono-code text-[11px] text-[#9a9a9a] border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold tracking-widest">02 / THE PROBLEM</span>
          <span className="text-white/20">|</span>
          <span className="text-[#ffb829]">SIGNAL OVERLOAD</span>
        </div>

        {/* Dynamic Telemetry State Indicator */}
        <div className="flex items-center gap-4 text-[10px]">
          <div className="flex items-center gap-2">
            <span className="text-[#9a9a9a]">SIGNAL:</span>
            <span className={signalState === 'direction' ? 'text-[#15846e] font-bold' : signalState === 'searching' ? 'text-[#ffb829] font-bold' : 'text-rose-400 font-bold'}>
              {signalState === 'direction' ? 'STABLE' : signalState === 'searching' ? 'FILTERING' : 'OVERLOAD'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#9a9a9a]">PATH:</span>
            <span className={signalState === 'direction' ? 'text-[#8052ff] font-bold' : 'text-[#9a9a9a]'}>
              {signalState === 'direction' ? 'DISPATCH_READY' : 'SEARCHING_COORDINATES'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Signal Overload Art Direction Canvas */}
      <div className="relative min-h-[500px] md:min-h-[560px] border border-white/10 bg-black flex flex-col justify-between p-6 md:p-12 overflow-hidden">
        
        {/* Subtle Background Coordinate Grid Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20"></div>
          <div className="absolute left-1/2 top-0 w-[1px] h-full bg-white/20"></div>
          <div className="absolute top-6 left-6 font-mono-code text-[9px] text-[#9a9a9a]">[COORD: 42.3601 N, 71.0589 W]</div>
          <div className="absolute bottom-6 right-6 font-mono-code text-[9px] text-[#9a9a9a]">[FREQUENCY: 1420.4 MHz]</div>
        </div>

        {/* Scattered Noise Labels (Dispersed in OVERLOAD, Converging in SEARCHING, Hidden in DIRECTION) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {NOISE_TAGS.map((tag) => {
            const isOverload = signalState === 'overload';
            const isSearching = signalState === 'searching';

            return (
              <motion.div
                key={tag.id}
                initial={false}
                animate={{
                  x: isOverload ? `${tag.x}%` : isSearching ? '50%' : '50%',
                  y: isOverload ? `${tag.y}%` : isSearching ? '50%' : '50%',
                  opacity: isOverload ? 0.75 : isSearching ? 0.25 : 0,
                  scale: isOverload ? 1 : isSearching ? 0.7 : 0.4,
                  rotate: isOverload ? tag.noiseDeg : 0
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 border border-white/15 bg-black/90 font-mono-code text-[10px] text-[#9a9a9a] tracking-wider whitespace-nowrap shadow-lg"
              >
                <span>// {tag.label}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Central Editorial Narrative Typography */}
        <div className="relative z-10 max-w-3xl space-y-6 my-auto">
          
          <div className="space-y-2">
            <span className="font-mono-code text-xs text-[#8052ff] font-bold tracking-widest uppercase block">
              ORIGIN // THE FOUNDATIONAL PREMISE
            </span>
            <h2 className="font-heading text-white tracking-tight uppercase leading-[1.02]">
              Too much input.<br />
              <span className="text-[#9a9a9a]">Not enough direction.</span>
            </h2>
          </div>

          <div className="space-y-4 pt-2 border-t border-white/10">
            <p className="font-mono-code text-xs text-[#bdbdbd] tracking-wide uppercase">
              EduVerse started with a simple question:
            </p>

            <p className="font-display text-[26px] sm:text-[34px] md:text-[42px] text-white tracking-tight leading-[1.1] select-text">
              &ldquo;What if learning to code started with <span className="text-[#8052ff] underline underline-offset-4 decoration-white/20">doing</span> instead of watching?&rdquo;
            </p>

            <p className="font-body text-[#9a9a9a] text-sm md:text-base leading-relaxed max-w-2xl font-sans">
              Students aren&apos;t lacking access to programming syntax. They are overwhelmed by disconnected information and lack a sandbox to make mistakes safely and build debugging instinct.
            </p>
          </div>

          {/* Interactive State Switcher for User Engagement */}
          <div className="pt-4 flex flex-wrap items-center gap-3 font-mono-code text-xs">
            <span className="text-[#9a9a9a] text-[10px] uppercase font-bold">STATE CONTROLLER:</span>
            
            <button
              onClick={() => setSignalState('overload')}
              suppressHydrationWarning
              className={`px-3 py-1 border transition-all text-[11px] cursor-pointer ${
                signalState === 'overload' 
                  ? 'border-rose-500 bg-rose-500/10 text-rose-400 font-bold' 
                  : 'border-white/10 text-[#9a9a9a] hover:text-white'
              }`}
            >
              01. OVERLOAD
            </button>

            <button
              onClick={() => setSignalState('searching')}
              suppressHydrationWarning
              className={`px-3 py-1 border transition-all text-[11px] cursor-pointer ${
                signalState === 'searching' 
                  ? 'border-[#ffb829] bg-[#ffb829]/10 text-[#ffb829] font-bold' 
                  : 'border-white/10 text-[#9a9a9a] hover:text-white'
              }`}
            >
              02. FILTERING
            </button>

            <button
              onClick={() => setSignalState('direction')}
              suppressHydrationWarning
              className={`px-3 py-1 border transition-all text-[11px] cursor-pointer ${
                signalState === 'direction' 
                  ? 'border-[#15846e] bg-[#15846e]/10 text-[#15846e] font-bold' 
                  : 'border-white/10 text-[#9a9a9a] hover:text-white'
              }`}
            >
              03. CLEAR DIRECTION
            </button>
          </div>

        </div>

        {/* Bottom Filtered Learning Loop (Reveals distinctly in DIRECTION state) */}
        <AnimatePresence>
          {signalState === 'direction' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 mt-8 pt-6 border-t border-white/10"
            >
              <div className="text-[#15846e] font-mono-code text-[11px] font-bold mb-3 flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5" />
                <span>FILTERED COGNITIVE PATHWAY // THE EDUVERSE LOOP:</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 font-mono-code">
                {LOOP_STEPS.map((s) => (
                  <div 
                    key={s.step} 
                    className="p-3 border border-[#8052ff]/30 bg-[#8052ff]/5 space-y-1"
                  >
                    <div className="text-[10px] text-[#8052ff] font-bold">{s.step}</div>
                    <div className="text-xs font-bold text-white tracking-wider">{s.name}</div>
                    <div className="text-[10px] text-[#9a9a9a] font-sans leading-tight">{s.desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
