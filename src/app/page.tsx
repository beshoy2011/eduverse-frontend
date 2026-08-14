'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import DonationWidget from '@/components/DonationWidget';
import { api, Course } from '@/lib/api';
import { 
  Terminal, Play, ArrowRight, ShieldCheck, 
  Code2, AlertCircle, RefreshCw, Check, FileCode, Bug, Eye, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type IncidentStage = 'idle' | 'crashed' | 'investigating' | 'fixing' | 'resolved';

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [stage, setStage] = useState<IncidentStage>('idle');
  const [userHypothesis, setUserHypothesis] = useState<string | null>(null);

  const initialCode = `def calculate_average(scores):
    total = sum(scores)
    return total / len(scores)

print(calculate_average([]))`;

  const patchedCode = `def calculate_average(scores):
    if not scores:
        return 0.0
    total = sum(scores)
    return total / len(scores)

print(calculate_average([95, 88, 92]))`;

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await api.getCourses();
        setCourses(data);
      } catch (e) {
        setCourses([
          { id: 1, title: "Python Basics", description: "Learn Python from absolute zero with live interactive challenges.", skills: "Python, Control Flow, Functions", duration: "10 hours", difficulty: "Beginner", theme_style: "cosmic" },
          { id: 2, title: "C++ Systems", description: "Master pointers, memory layouts, static typing, and compilation.", skills: "C++, Pointers, Memory", duration: "12 hours", difficulty: "Medium", theme_style: "cyberpunk" },
          { id: 3, title: "Web Fundamentals", description: "Build responsive layout structures using modern HTML5 & CSS3.", skills: "HTML5, CSS3, Flexbox", duration: "15 hours", difficulty: "Beginner", theme_style: "creative" }
        ]);
      }
    }
    loadCourses();
  }, []);

  const handleRun = () => {
    if (stage === 'idle') {
      setStage('crashed');
    }
  };

  const handleInvestigate = () => {
    setStage('investigating');
  };

  const handleSelectHypothesis = (hypothesis: string) => {
    setUserHypothesis(hypothesis);
    setStage('fixing');
  };

  const handleApplyFix = () => {
    setStage('resolved');
  };

  const handleReset = () => {
    setStage('idle');
    setUserHypothesis(null);
  };

  const lines = (stage === 'resolved' ? patchedCode : initialCode).split('\n');

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans select-none flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-24">
        
        <section className="space-y-6 pt-4 font-mono-code">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1e2638] pb-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-300 font-bold">EDUVERSE // WORKSPACE</span>
              <span className="text-slate-600">v2.4</span>
            </div>
            <div className="text-[11px] text-slate-500 hidden sm:block">
              <span>PHILOSOPHY: </span>
              <span className="text-slate-400">LEARN → RUN → BREAK → DEBUG → UNDERSTAND</span>
            </div>
          </div>

          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-none">
              Learn by <br />
              <span className="text-rose-400 font-mono-code underline decoration-rose-500/40 decoration-wavy">breaking things</span>.
            </h1>

            <p className="text-slate-300 text-sm sm:text-base font-sans leading-relaxed pt-1">
              A hands-on coding environment with a pair-debugger that helps you understand why your code broke, inspect runtime traces, and master fundamental engineering thinking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link 
              href="/dashboard" 
              className="edu-btn edu-btn-primary px-5 py-2.5 text-xs flex items-center gap-2 font-bold"
            >
              <span>ENTER WORKSPACE</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link 
              href="/courses/1/lessons/1" 
              className="edu-btn edu-btn-secondary px-5 py-2.5 text-xs flex items-center gap-2 text-slate-300"
            >
              <Code2 className="h-3.5 w-3.5 text-indigo-400" />
              <span>JUMP TO LESSON 01</span>
            </Link>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between font-mono-code text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Terminal className="h-4 w-4 text-indigo-400" />
              <span className="font-bold text-white">INTERACTIVE INCIDENT 01 // THE EMPTY LIST CRASH</span>
            </div>
            
            <div className="flex items-center gap-2 text-[11px]">
              {stage === 'idle' && (
                <span className="text-slate-500 font-mono-code">○ 0 ACTIVE ISSUES</span>
              )}
              {(stage === 'crashed' || stage === 'investigating' || stage === 'fixing') && (
                <span className="text-rose-400 font-mono-code font-bold flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
                  ● 1 ACTIVE ISSUE (LINE 03)
                </span>
              )}
              {stage === 'resolved' && (
                <span className="text-emerald-400 font-mono-code font-bold">
                  ✓ 0 ISSUES — VERIFIED
                </span>
              )}
            </div>
          </div>

          <div className="edu-panel bg-[#0d111a] border-[#1e2638] overflow-hidden shadow-2xl font-mono-code">
            
            <div className="bg-[#07090e] border-b border-[#1e2638] px-4 py-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-600">┌──</span>
                <span className="text-indigo-400 font-bold flex items-center gap-1.5">
                  <FileCode className="h-3.5 w-3.5" /> main.py
                </span>
                <span className="text-slate-600">──</span>
                <span className="text-[10px] text-slate-500">Python 3.12</span>
              </div>

              <div className="flex items-center gap-2">
                {stage === 'idle' && (
                  <button
                    onClick={handleRun}
                    className="edu-btn edu-btn-primary py-1 px-3 text-[11px] flex items-center gap-1 font-bold"
                  >
                    <Play className="h-3 w-3 fill-current" /> Run Code (Trigger Bug)
                  </button>
                )}

                {stage === 'crashed' && (
                  <button
                    onClick={handleInvestigate}
                    className="edu-btn edu-btn-secondary text-amber-400 border-amber-500/40 py-1 px-3 text-[11px] flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" /> Inspect Line 03
                  </button>
                )}

                {stage === 'investigating' && (
                  <span className="text-[10px] text-indigo-400 font-bold">
                    Select hypothesis below →
                  </span>
                )}

                {stage === 'fixing' && (
                  <button
                    onClick={handleApplyFix}
                    className="edu-btn edu-btn-emerald py-1 px-3 text-[11px] flex items-center gap-1 font-bold"
                  >
                    <Check className="h-3 w-3" /> Apply Guard & Re-test
                  </button>
                )}

                {stage === 'resolved' && (
                  <button
                    onClick={handleReset}
                    className="edu-btn edu-btn-secondary py-1 px-3 text-[11px] flex items-center gap-1 text-slate-400"
                  >
                    <RefreshCw className="h-3 w-3" /> Reset Incident
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1e2638] text-xs">
              
              <div className="p-4 bg-[#090d14] relative">
                <div className="space-y-0.5">
                  {lines.map((line, idx) => {
                    const lineNum = idx + 1;
                    const isErrorLine = lineNum === 3 && (stage === 'crashed' || stage === 'investigating' || stage === 'fixing');

                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 px-2 py-0.5 rounded transition-colors ${
                          isErrorLine ? 'bg-rose-500/20 border-l-2 border-rose-500 text-rose-200' : 'text-slate-200'
                        }`}
                      >
                        <span className={`text-[10px] w-5 shrink-0 text-right select-none ${
                          isErrorLine ? 'text-rose-400 font-bold' : 'text-slate-600'
                        }`}>
                          {lineNum < 10 ? `0${lineNum}` : lineNum}
                        </span>
                        <span className="flex-1 font-mono-code whitespace-pre">
                          {line}
                        </span>
                        {isErrorLine && (
                          <span className="text-[9px] bg-rose-500/30 text-rose-300 px-1 rounded uppercase font-bold shrink-0">
                            BUG
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-3 border-t border-[#1e2638]/60 text-[10px] text-slate-500 flex justify-between items-center">
                  <span>Lines: {lines.length} | Encoding: UTF-8</span>
                  {stage === 'resolved' ? (
                    <span className="text-emerald-400 font-bold">✓ 0 ISSUES</span>
                  ) : stage !== 'idle' ? (
                    <span className="text-rose-400 font-bold flex items-center gap-1">
                      <Bug className="h-3 w-3" /> 1 Issue (Line 03)
                    </span>
                  ) : (
                    <span>0 Issues</span>
                  )}
                </div>
              </div>

              <div className="p-4 bg-[#0d111a] flex flex-col justify-between space-y-4">
                
                {stage === 'idle' && (
                  <div className="py-8 text-center space-y-2 text-slate-500">
                    <Terminal className="h-6 w-6 text-slate-600 mx-auto" />
                    <p className="text-xs">Click <strong className="text-indigo-400">&quot;Run Code (Trigger Bug)&quot;</strong> to execute `calculate_average([])`.</p>
                  </div>
                )}

                {stage === 'crashed' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    <div className="bg-[#07090e] border border-rose-500/30 rounded p-2.5 space-y-1">
                      <div className="text-[10px] text-rose-400 font-bold uppercase flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" /> ✗ ZeroDivisionError: division by zero
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono-code">
                        Traceback: File &quot;main.py&quot;, line 03, in calculate_average
                      </p>
                    </div>

                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded text-[11px] space-y-1">
                      <span className="font-bold text-amber-400 block">Good. You found a real crash.</span>
                      <p className="text-slate-300 font-sans">
                        Look at Line 03. What did `len(scores)` evaluate to when an empty list `[]` was supplied?
                      </p>
                    </div>
                  </motion.div>
                )}

                {stage === 'investigating' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 text-[11px]">
                    <div className="bg-[#07090e] p-2 rounded border border-[#1e2638] space-y-1">
                      <span className="text-[10px] font-bold text-indigo-400 block uppercase">WHERE</span>
                      <p className="text-slate-300 font-mono-code">Line 03: total / len(scores)</p>
                    </div>

                    <div className="bg-[#07090e] p-2 rounded border border-[#1e2638] space-y-1">
                      <span className="text-[10px] font-bold text-amber-400 block uppercase">WHY</span>
                      <p className="text-slate-300 font-mono-code">scores = [] → len([]) is 0 → 0 / 0 throws ZeroDivisionError</p>
                    </div>

                    <div className="bg-[#07090e] p-2.5 rounded border border-indigo-500/30 space-y-2">
                      <span className="text-[10px] font-bold text-white block uppercase">WHAT DO YOU THINK?</span>
                      <div className="space-y-1.5">
                        <button
                          onClick={() => handleSelectHypothesis('guard')}
                          className="w-full text-left p-2 rounded bg-[#0d111a] border border-[#1e2638] hover:border-indigo-400 text-slate-300 hover:text-white transition-colors text-[10px]"
                        >
                          → &quot;We must guard against empty input: if not scores return 0.0&quot;
                        </button>
                        <button
                          onClick={() => handleSelectHypothesis('try_except')}
                          className="w-full text-left p-2 rounded bg-[#0d111a] border border-[#1e2638] hover:border-indigo-400 text-slate-300 hover:text-white transition-colors text-[10px]"
                        >
                          → &quot;We should wrap total / len in a try/except block&quot;
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {stage === 'fixing' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 text-[11px]">
                    <div className="bg-[#07090e] p-3 rounded border border-emerald-500/30 space-y-1.5">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase block">Selected Resolution</span>
                      <p className="text-slate-300 font-mono-code">
                        Adding an early boundary exit:
                      </p>
                      <pre className="bg-[#090d14] p-2 rounded text-cyan-300 text-[10px]">
                        {`if not scores:\n    return 0.0`}
                      </pre>
                    </div>

                    <p className="text-slate-400 font-sans text-[11px]">
                      Click <strong className="text-emerald-400">&quot;Apply Guard & Re-test&quot;</strong> to verify all test assertions.
                    </p>
                  </motion.div>
                )}

                {stage === 'resolved' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded text-[11px] space-y-1.5 text-emerald-300">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                        <Check className="h-4 w-4" /> ALL TEST ASSERTIONS PASSED
                      </div>
                      <div className="space-y-0.5 text-[10px] font-mono-code pt-1">
                        <div>✓ TEST 1: calculate_average([]) → 0.0 (PASSED)</div>
                        <div>✓ TEST 2: calculate_average([10]) → 10.0 (PASSED)</div>
                        <div>✓ TEST 3: calculate_average([95, 88, 92]) → 91.67 (PASSED)</div>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 bg-[#07090e] p-2 rounded border border-[#1e2638] flex justify-between">
                      <span className="text-emerald-400 font-bold">✓ 0 ISSUES</span>
                      <span>INCIDENT 01 RESOLVED</span>
                    </div>
                  </motion.div>
                )}

                <div className="text-[10px] text-slate-500 border-t border-[#1e2638] pt-2 flex justify-between items-center">
                  <span>DEBUG DESK // TRACE RUNNER</span>
                  <span className="text-slate-400 uppercase">STAGE: {stage}</span>
                </div>

              </div>

            </div>

          </div>
        </section>

        <section className="space-y-6 font-mono-code">
          <div className="border-b border-[#1e2638] pb-3">
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">THE LEARNING LOOP</span>
            <h2 className="text-xl font-bold text-white mt-0.5">How Real Engineers Actually Learn</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            {[
              { num: "01", tag: "LEARN", desc: "Understand the mental model" },
              { num: "02", tag: "WRITE", desc: "Author real code in-browser" },
              { num: "03", tag: "RUN", desc: "Execute in real runtimes" },
              { num: "04", tag: "BREAK", desc: "Trigger unhandled edge cases" },
              { num: "05", tag: "DEBUG", desc: "Inspect line-level traces" },
              { num: "06", tag: "UNDERSTAND", desc: "Internalize the fix forever" },
            ].map((step, i) => (
              <div key={i} className="edu-panel p-3 bg-[#0d111a] border-[#1e2638] space-y-1.5 hover:border-slate-600 transition-colors">
                <span className="text-[10px] text-slate-500 font-bold block">{step.num}</span>
                <h3 className="font-bold text-white tracking-wide">{step.tag}</h3>
                <p className="text-[11px] text-slate-400 font-sans leading-snug">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6 font-mono-code">
          <div className="flex items-center justify-between border-b border-[#1e2638] pb-3">
            <div>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">SYLLABI</span>
              <h2 className="text-xl font-bold text-white mt-0.5">Choose Your Starting Track</h2>
            </div>
            <span className="text-xs text-slate-500">100% Free • Open Access</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div key={course.id} className="edu-panel p-5 bg-[#0d111a] border-[#1e2638] flex flex-col justify-between space-y-4 hover:border-slate-600 transition-colors">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="edu-badge edu-badge-indigo">{course.difficulty}</span>
                    <span className="text-slate-500 text-[10px]">{course.duration}</span>
                  </div>
                  <h3 className="text-base font-bold text-white font-sans">{course.title}</h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed line-clamp-2">{course.description}</p>
                </div>

                <div className="pt-3 border-t border-[#1e2638] flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono-code">{course.skills.split(',')[0]}</span>
                  <Link
                    href={`/courses/${course.id}/lessons/1`}
                    className="edu-btn edu-btn-secondary text-xs py-1 px-3 flex items-center gap-1"
                  >
                    <span>Start Track</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="edu-panel p-8 sm:p-12 bg-[#0d111a] border-[#1e2638] text-center max-w-3xl mx-auto space-y-5 font-mono-code">
          <div className="space-y-2">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">NO CREDIT CARD • NO AI GIMMICKS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to write and debug your first script?
            </h2>
            <p className="text-xs text-slate-400 font-sans max-w-md mx-auto">
              Jump straight into the in-browser workbench. No local compiler setup needed.
            </p>
          </div>

          <div>
            <Link
              href="/dashboard"
              className="edu-btn edu-btn-primary px-8 py-3 text-xs font-bold inline-flex items-center gap-2"
            >
              <span>OPEN WORKSPACE NOW</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

      </main>

      <footer className="border-t border-[#1e2638] bg-[#07090e] py-6 text-center font-mono-code text-[11px] text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>EDUVERSE // FOR DEVELOPERS WHO LEARN BY BREAKING</span>
          <div className="flex gap-4">
            <Link href="/dashboard" className="hover:text-slate-300">Workspace</Link>
            <Link href="/champions" className="hover:text-slate-300">Missions</Link>
            <Link href="/verify" className="hover:text-slate-300">Verify</Link>
          </div>
        </div>
      </footer>

      <DonationWidget />
    </div>
  );
}
