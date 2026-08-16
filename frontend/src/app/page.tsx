'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import DonationWidget from '@/components/DonationWidget';
import { 
  ArrowRight, 
  Play, 
  Bug, 
  Terminal, 
  Cpu, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  Check,
  ChevronRight,
  Zap,
  RotateCcw,
  Activity,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BrainCanvas from '@/components/BrainCanvas';
import SignalOverloadSection from '@/components/SignalOverloadSection';

export default function HomePage() {
  const [incidentStep, setIncidentStep] = useState<'broken' | 'trace' | 'understand' | 'fixed'>('broken');
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(d.toTimeString().split(' ')[0] + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNextIncidentStep = () => {
    if (incidentStep === 'broken') {
      setIsExecuting(true);
      setTimeout(() => {
        setIsExecuting(false);
        setIncidentStep('trace');
      }, 450);
    } else if (incidentStep === 'trace') {
      setIncidentStep('understand');
    } else if (incidentStep === 'understand') {
      setIsExecuting(true);
      setTimeout(() => {
        setIsExecuting(false);
        setIncidentStep('fixed');
      }, 500);
    } else {
      setIncidentStep('broken');
    }
  };

  const steps = [
    { num: "01", title: "THE PROBLEM", sub: "Tutorial Trap", desc: "Watching code works. Typing from memory breaks. Video rewinds don't build diagnostic instinct." },
    { num: "02", title: "THE FAILURE", sub: "Runtime Intercept", desc: "Intentional boundary conditions, empty datasets, and type mismatch stress tests." },
    { num: "03", title: "THE TRACE", sub: "AST Inspection", desc: "Line-by-line execution breakdown, memory pointers, and root-cause stack traces." },
    { num: "04", title: "THE FIX", sub: "Defensive Guards", desc: "Writing resilient edge-case guards and verifying assertions across 100% test suites." },
    { num: "05", title: "THE MENTAL MODEL", sub: "Permanent Intuition", desc: "Understanding memory, pointers, and concurrency solidifies for life." }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans select-none selection:bg-[#8052ff]/30 antialiased">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-24 md:space-y-36">
        
        {/* =====================================================================
            HERO SECTION: EDITORIAL ASYMMETRIC COMPOSITION + NEURAL BRAIN
            ===================================================================== */}
        <section className="space-y-8 pt-2 md:pt-4">
          
          {/* Technical Telemetry Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono-code text-[11px] text-[#9a9a9a] border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="status-led status-led-active"></span>
              <span className="text-white font-bold tracking-widest">EDUVERSE // COGNITIVE LAB</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-[#9a9a9a]">
              <span>[KERNEL: RUNTIME_PY3.12]</span>
              <span>[TIME: {currentTime || '12:00:00 UTC'}]</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8052ff] font-bold">SYS ● ONLINE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Handcrafted Typography */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-3">
                <div className="overflow-hidden">
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="font-display text-white tracking-tight uppercase leading-[0.92] select-text"
                  >
                    <span className="block">LEARN BY</span>
                    <span className="block">BREAKING</span>
                    <span className="block text-[#8052ff]">THINGS.</span>
                  </motion.h1>
                </div>

                <p className="font-body text-[#bdbdbd] max-w-lg text-[17px] md:text-[19px] leading-relaxed pt-2">
                  Programming makes more sense when something crashes. We built EduVerse to replace passive tutorial videos with hands-on runtime debugging and live AST diagnostics.
                </p>
              </div>

              {/* Action Ribbon */}
              <div className="flex flex-wrap items-center gap-4 pt-2 font-mono-code text-xs">
                <Link
                  href="/dashboard"
                  className="edu-btn edu-btn-primary px-7 py-3.5 text-xs font-bold tracking-wider uppercase"
                >
                  <span>ENTER WORKSPACE</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <a
                  href="#problem-section"
                  className="edu-btn edu-btn-secondary px-6 py-3.5 text-xs font-bold tracking-wider text-[#bdbdbd] hover:text-white uppercase"
                >
                  <span>EXPLORE PEDAGOGY</span>
                  <span className="text-[#8052ff]">↓</span>
                </a>
              </div>

              {/* Monospace System Annotations */}
              <div className="pt-2 flex flex-wrap gap-4 font-mono-code text-[10px] text-[#9a9a9a]">
                <span>01. ZERO-DIVISION RECOVERY</span>
                <span>•</span>
                <span>02. MEMORY SEGFAULTS</span>
                <span>•</span>
                <span>03. OFF-BY-ONE GUARDING</span>
              </div>
            </div>

            {/* Right Cognitive Brain Centerpiece */}
            <div className="lg:col-span-6 border border-white/10 bg-black/60 overflow-hidden relative shadow-2xl">
              <BrainCanvas />
            </div>

          </div>

        </section>

        {/* =====================================================================
            SECTION 02: THE PROBLEM (SIGNAL OVERLOAD TO CLEAR DIRECTION)
            ===================================================================== */}
        <div id="problem-section">
          <SignalOverloadSection />
        </div>

        {/* =====================================================================
            SECTION 03: REALTIME INCIDENT INTERACTION (DEVELOPER DIAGNOSTIC)
            ===================================================================== */}
        <section id="incident-preview" className="space-y-6 border-t border-white/10 pt-12">
          
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono-code text-xs text-[#9a9a9a]">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">03 / INCIDENT 001</span>
              <span>//</span>
              <span className="text-[#ffb829]">EMPTY LIST CRASH</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#9a9a9a]">INPUT: <code className="text-white">[]</code></span>
              <span className="text-[11px] text-rose-400 font-bold">RUNTIME: ZeroDivisionError</span>
            </div>
          </div>

          {/* Incident Diagnostic Terminal Panel */}
          <div className="border border-white/10 bg-black font-mono-code text-xs overflow-hidden shadow-2xl">
            
            {/* Terminal Header */}
            <div className="px-4 py-2.5 bg-black border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px]">
              <div className="flex items-center gap-3">
                <span className="text-[#9a9a9a]">TARGET: calculate_average()</span>
                <span className="text-white/20">|</span>
                <span className="text-[#8052ff]">ENV: Python 3.12 Sandboxed</span>
              </div>

              {/* Status Sequence Indicator */}
              <div className="flex items-center gap-2">
                <span className="text-[#9a9a9a] uppercase text-[10px]">SEQUENCE:</span>
                <div className="flex items-center gap-1.5 font-bold text-[10px]">
                  <span className={`px-2 py-0.5 border ${incidentStep === 'broken' ? 'border-rose-500/50 bg-rose-500/10 text-rose-400' : 'border-white/10 text-[#9a9a9a]'}`}>BROKEN</span>
                  <span className="text-[#9a9a9a]">→</span>
                  <span className={`px-2 py-0.5 border ${incidentStep === 'trace' ? 'border-[#ffb829]/50 bg-[#ffb829]/10 text-[#ffb829]' : 'border-white/10 text-[#9a9a9a]'}`}>TRACE</span>
                  <span className="text-[#9a9a9a]">→</span>
                  <span className={`px-2 py-0.5 border ${incidentStep === 'understand' ? 'border-[#8052ff]/50 bg-[#8052ff]/10 text-[#8052ff]' : 'border-white/10 text-[#9a9a9a]'}`}>UNDERSTAND</span>
                  <span className="text-[#9a9a9a]">→</span>
                  <span className={`px-2 py-0.5 border ${incidentStep === 'fixed' ? 'border-[#15846e]/50 bg-[#15846e]/10 text-[#15846e]' : 'border-white/10 text-[#9a9a9a]'}`}>FIXED</span>
                </div>
              </div>
            </div>

            {/* Split Editor and Execution Gutter */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10 min-h-[290px]">
              
              {/* Code Buffer Window */}
              <div className="lg:col-span-7 p-4 bg-black space-y-2">
                <div className="text-[#9a9a9a] text-[11px] pb-1 border-b border-white/5 flex justify-between">
                  <span>// buffer.py</span>
                  <span className="text-white/40">4 lines</span>
                </div>

                <pre className="text-white text-xs leading-relaxed overflow-x-auto">
                  {incidentStep === 'fixed' ? (
`1: def calculate_average(scores):
2:     if not scores:
3:         return 0.0  # Defensive early-return guard
4:     return sum(scores) / len(scores)`
                  ) : (
`1: def calculate_average(scores):
2:     total = sum(scores)
3:     return total / len(scores)  # [CRASH: len([]) == 0]
4: 
5: result = calculate_average([])`
                  )}
                </pre>
              </div>

              {/* Diagnostic Status Box & Action Controller */}
              <div className="lg:col-span-5 p-5 bg-black flex flex-col justify-between space-y-4">
                
                <div className="space-y-3">
                  {incidentStep === 'broken' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>STATUS: RUNTIME INTERCEPTED</span>
                      </div>
                      <p className="text-[#bdbdbd] font-sans text-xs leading-relaxed">
                        Input <code className="text-white">scores = []</code> evaluates <code className="text-rose-400">len(scores) = 0</code> on line 3, triggering an unhandled <code className="text-rose-400">ZeroDivisionError</code>.
                      </p>
                    </div>
                  )}

                  {incidentStep === 'trace' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[#ffb829] font-bold text-xs">
                        <Bug className="h-4 w-4 shrink-0" />
                        <span>AST EXECUTION TRACE</span>
                      </div>
                      <div className="p-2.5 border border-white/10 bg-white/[0.02] text-[11px] space-y-1">
                        <div>FRAME 01: <code className="text-white">calculate_average(scores=[])</code></div>
                        <div>EVALUATION: <code className="text-rose-400">0 / 0</code> → HALT</div>
                        <div className="text-[#9a9a9a] pt-1">ROOT CAUSE: Missing empty collection boundary check.</div>
                      </div>
                    </div>
                  )}

                  {incidentStep === 'understand' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[#8052ff] font-bold text-xs">
                        <Sparkles className="h-4 w-4 shrink-0" />
                        <span>MENTAL MODEL FORMED</span>
                      </div>
                      <p className="text-[#bdbdbd] font-sans text-xs leading-relaxed">
                        Defensive programming requires handling the 0-element base case before computing denominator arithmetic.
                      </p>
                    </div>
                  )}

                  {incidentStep === 'fixed' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[#15846e] font-bold text-xs">
                        <CheckCircle className="h-4 w-4 shrink-0" />
                        <span>TEST ASSERTION PASS (3/3)</span>
                      </div>
                      <ul className="text-[11px] text-[#bdbdbd] space-y-1">
                        <li>✓ test_empty_list([]) → 0.0</li>
                        <li>✓ test_single_val([100]) → 100.0</li>
                        <li>✓ test_multi_val([80, 90]) → 85.0</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Step Action Button */}
                <div className="pt-2 border-t border-white/10">
                  <button
                    onClick={handleNextIncidentStep}
                    disabled={isExecuting}
                    suppressHydrationWarning
                    className="edu-btn edu-btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isExecuting ? (
                      <>
                        <Cpu className="h-4 w-4 animate-spin text-[#8052ff]" />
                        <span>ANALYZING RUNTIME...</span>
                      </>
                    ) : incidentStep === 'broken' ? (
                      <>
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>STEP 1: TRACE THE FAILURE</span>
                      </>
                    ) : incidentStep === 'trace' ? (
                      <>
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>STEP 2: UNDERSTAND WHY</span>
                      </>
                    ) : incidentStep === 'understand' ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>STEP 3: APPLY GUARD & VERIFY</span>
                      </>
                    ) : (
                      <>
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>RESET INCIDENT PREVIEW</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================================
            SECTION 04: THE 5-PHASE COGNITIVE PROGRESSION
            ===================================================================== */}
        <section className="space-y-12 border-t border-white/10 pt-12">
          
          <div className="flex items-center justify-between font-mono-code text-xs text-[#9a9a9a]">
            <span>04 / PEDAGOGY SPECIFICATION</span>
            <span className="text-[#8052ff] font-bold">5-PHASE COGNITIVE PROGRESSION</span>
          </div>

          <div className="space-y-4">
            <h2 className="font-heading-sm text-white uppercase tracking-tight">
              From Syntax Spectator to Systems Engineer
            </h2>
            <p className="text-[#9a9a9a] font-body text-base max-w-xl leading-relaxed">
              We structure every curriculum track around progressive breakage, stack diagnosis, and permanent intuition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono-code">
            {steps.map((s) => (
              <div 
                key={s.num}
                className="p-5 border border-white/10 hover:border-[#8052ff]/50 bg-black flex flex-col justify-between space-y-4 transition-all duration-200"
              >
                <div className="space-y-2">
                  <span className="text-[11px] text-[#8052ff] font-bold block">{s.num} / {s.title}</span>
                  <h3 className="text-sm font-bold text-white tracking-wider uppercase">{s.sub}</h3>
                </div>
                <p className="text-[12px] text-[#9a9a9a] font-sans leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

        </section>

        {/* =====================================================================
            SECTION 05: LIVE INCIDENT DISPATCH QUEUE
            ===================================================================== */}
        <section className="space-y-8 border-t border-white/10 pt-12">
          
          <div className="flex items-center justify-between font-mono-code text-xs text-[#9a9a9a]">
            <span>05 / OPEN RUNTIME CHALLENGES</span>
            <span className="text-[#ffb829] font-bold">DISPATCH QUEUE</span>
          </div>

          <div className="space-y-3 font-mono-code">
            
            <div className="p-4 border border-white/10 hover:border-white/30 bg-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
              <div className="flex items-center gap-4">
                <span className="text-[11px] text-[#ffb829] font-bold border border-[#ffb829]/30 px-2 py-0.5">INCIDENT 027</span>
                <div>
                  <h4 className="text-sm font-bold text-white">OFF-BY-ONE ITERATOR TRAVERSAL</h4>
                  <p className="text-xs text-[#9a9a9a] font-sans">IndexError thrown during loop boundary traversal on sized lists.</p>
                </div>
              </div>
              <Link href="/courses" className="edu-btn edu-btn-secondary text-xs shrink-0">
                Inspect Trace
              </Link>
            </div>

            <div className="p-4 border border-white/10 hover:border-white/30 bg-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
              <div className="flex items-center gap-4">
                <span className="text-[11px] text-[#8052ff] font-bold border border-[#8052ff]/30 px-2 py-0.5">INCIDENT 033</span>
                <div>
                  <h4 className="text-sm font-bold text-white">UNTYPED DICTIONARY KEY ACCESS</h4>
                  <p className="text-xs text-[#9a9a9a] font-sans">Patch unhandled KeyError exceptions using defensive .get() fallback patterns.</p>
                </div>
              </div>
              <Link href="/courses" className="edu-btn edu-btn-secondary text-xs shrink-0">
                Inspect Trace
              </Link>
            </div>

            <div className="p-4 border border-white/10 hover:border-white/30 bg-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
              <div className="flex items-center gap-4">
                <span className="text-[11px] text-[#15846e] font-bold border border-[#15846e]/30 px-2 py-0.5">INCIDENT 041</span>
                <div>
                  <h4 className="text-sm font-bold text-white">DANGLING POINTER USE-AFTER-FREE</h4>
                  <p className="text-xs text-[#9a9a9a] font-sans">Locate memory address deallocation in C++ heap buffers before dereference.</p>
                </div>
              </div>
              <Link href="/courses" className="edu-btn edu-btn-secondary text-xs shrink-0">
                Inspect Trace
              </Link>
            </div>

          </div>

        </section>

      </main>

      <DonationWidget />
    </div>
  );
}
