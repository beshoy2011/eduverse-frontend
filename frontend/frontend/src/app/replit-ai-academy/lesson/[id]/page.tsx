'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ReplitBackgroundEffect from '@/components/replit-academy/ReplitBackgroundEffect';
import ReplitAIMentor from '@/components/replit-academy/ReplitAIMentor';
import ReplitPageTransition from '@/components/replit-academy/ReplitPageTransition';
import { 
  REPLIT_ACADEMY_MODULES, 
  LessonItem, 
  ModuleItem, 
  getStudentState, 
  saveStudentState 
} from '@/lib/replit-academy-data';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, CheckCircle2, ChevronRight, ChevronLeft, 
  FileText, Code, HelpCircle, BookOpen, MessageSquare, 
  Sparkles, Award, ArrowRight, RotateCcw, Bookmark, Save, 
  Check, Volume2, Maximize, Video, Terminal, Layers
} from 'lucide-react';

export default function ReplitLessonPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = (params?.id as string) || 'm1-l1';

  // Find current module and lesson
  let currentModule: ModuleItem | undefined;
  let currentLesson: LessonItem | undefined;
  let moduleIdx = 0;
  let lessonIdx = 0;

  for (let m = 0; m < REPLIT_ACADEMY_MODULES.length; m++) {
    const mod = REPLIT_ACADEMY_MODULES[m];
    const foundIdx = mod.lessons.findIndex(l => l.id === lessonId);
    if (foundIdx !== -1) {
      currentModule = mod;
      currentLesson = mod.lessons[foundIdx];
      moduleIdx = m;
      lessonIdx = foundIdx;
      break;
    }
  }

  // Default fallback if not found directly
  if (!currentLesson || !currentModule) {
    currentModule = REPLIT_ACADEMY_MODULES[0];
    currentLesson = currentModule.lessons[0];
  }

  // Interactive tab state - default to rich text reading content
  const [activeTab, setActiveTab] = useState<'reading' | 'practice' | 'quiz' | 'notes' | 'resources'>('reading');
  
  // Optional Video modal/drawer toggle
  const [showOptionalVideo, setShowOptionalVideo] = useState(false);

  // Practice playground state
  const [code, setCode] = useState(currentLesson.initialCode || `console.log("Hello from Replit AI Academy!");`);
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Quiz state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizSuccess, setQuizSuccess] = useState(false);

  // Student progress state
  const [studentState, setStudentState] = useState(getStudentState());
  const [noteText, setNoteText] = useState(studentState.userNotes[lessonId] || '');
  const [isSavedNote, setIsSavedNote] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    setCode(currentLesson?.initialCode || `console.log("Hello from Replit AI Academy!");`);
    setOutput(null);
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    setNoteText(studentState.userNotes[lessonId] || '');
  }, [lessonId, currentLesson]);

  // Run Code Simulation
  const handleRunCode = () => {
    setIsRunning(true);
    setOutput(null);

    setTimeout(() => {
      setIsRunning(false);
      try {
        let logs: string[] = [];
        const customConsole = {
          log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
        };
        const runFn = new Function('console', code);
        runFn(customConsole);
        setOutput(logs.length ? logs.join('\n') : 'Code executed with zero output.');
      } catch (err: any) {
        setOutput(`Runtime Error: ${err.message}`);
      }
    }, 600);
  };

  // Submit Quiz
  const handleSubmitQuiz = () => {
    if (selectedAnswer === null || !currentLesson?.quiz?.length) return;
    setQuizSubmitted(true);

    const isCorrect = selectedAnswer === currentLesson.quiz[0].correctAnswer;
    setQuizSuccess(isCorrect);

    if (isCorrect) {
      const newState = { ...studentState };
      newState.xp += 50;
      if (!newState.unlockedAchievements.includes("first_quiz")) {
        newState.unlockedAchievements.push("first_quiz");
      }
      setStudentState(newState);
      saveStudentState(newState);
    }
  };

  // Save Student Note
  const handleSaveNote = () => {
    const newState = { ...studentState };
    newState.userNotes[lessonId] = noteText;
    setStudentState(newState);
    saveStudentState(newState);
    setIsSavedNote(true);
    setTimeout(() => setIsSavedNote(false), 2000);
  };

  // Complete Lesson & Advance
  const handleCompleteLesson = () => {
    const newState = { ...studentState };
    if (!newState.completedLessons.includes(lessonId)) {
      newState.completedLessons.push(lessonId);
      newState.xp += 100;
    }
    setStudentState(newState);
    saveStudentState(newState);
    setShowCelebration(true);
  };

  // Find next lesson link
  let nextLessonId = "m1-l1";
  if (lessonIdx < currentModule.lessons.length - 1) {
    nextLessonId = currentModule.lessons[lessonIdx + 1].id;
  } else if (moduleIdx < REPLIT_ACADEMY_MODULES.length - 1) {
    nextLessonId = REPLIT_ACADEMY_MODULES[moduleIdx + 1].lessons[0].id;
  }

  return (
    <ReplitPageTransition>
      <div className="min-h-screen bg-[#07111F] text-[#F8FAFC] selection:bg-[#00D4FF]/30 relative font-sans">
        <ReplitBackgroundEffect />

        {/* Top Navbar */}
        <div className="relative z-20 border-b border-white/10 bg-[#07111F]/90 backdrop-blur-xl">
          <Navbar />
        </div>

        {/* LESSON PLAYER LAYOUT */}
        <div className="relative z-10 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-65px)]">
          
          {/* STICKY COURSE SIDEBAR (3 COLS) */}
          <aside className="lg:col-span-3 border-r border-white/10 bg-[#0E1A2B]/80 backdrop-blur-2xl p-4 flex flex-col justify-between overflow-y-auto max-h-screen sticky top-0 shadow-2xl">
            <div>
              {/* Header / Back Link */}
              <Link
                href="/replit-ai-academy"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#94A3B8] hover:text-[#00D4FF] transition-colors mb-4"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Academy Overview</span>
              </Link>

              <div className="p-4 rounded-2xl bg-[#121E30]/72 border border-white/10 mb-6">
                <span className="text-[10px] uppercase font-bold text-[#00D4FF] tracking-wider">Active Module</span>
                <h3 className="font-bold text-white text-sm mt-1">{currentModule.title}</h3>
                <div className="mt-3 w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[#00D4FF] via-[#7C3AED] to-[#FF8A00] h-full"
                    style={{ width: `${Math.round(((lessonIdx + 1) / currentModule.lessons.length) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Lesson Roadmap List */}
              <div className="space-y-2">
                <span className="text-xs text-[#94A3B8] uppercase font-semibold tracking-wider px-1">Module Roadmap</span>
                {currentModule.lessons.map((les, idx) => {
                  const isCurrent = les.id === lessonId;
                  const isDone = studentState.completedLessons.includes(les.id);

                  return (
                    <Link
                      key={les.id}
                      href={`/replit-ai-academy/lesson/${les.id}`}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                        isCurrent
                          ? 'bg-gradient-to-r from-[#00D4FF]/20 to-transparent border-[#00D4FF] text-white font-bold'
                          : isDone
                          ? 'bg-white/[0.02] border-emerald-500/30 text-gray-300'
                          : 'bg-white/[0.01] border-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-white/30 flex items-center justify-center text-[9px] font-mono text-gray-400">
                            {idx + 1}
                          </span>
                        )}
                        <span className="truncate max-w-[170px]">{les.title}</span>
                      </div>
                      <span className="text-[10px] text-gray-500">{les.duration}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* XP & Streak Bar */}
            <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span>{studentState.xp} XP</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#00D4FF]">
                <span>🔥 {studentState.streakDays} Day Streak</span>
              </div>
            </div>
          </aside>

          {/* MAIN LESSON CONTENT AREA (9 COLS) - TEXT & INTERACTIVE FIRST */}
          <main className="lg:col-span-9 p-4 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Lesson Title & Actions Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <span className="text-xs text-[#00D4FF] font-semibold tracking-wide uppercase">
                    {currentModule.title} • Lesson {lessonIdx + 1}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                    {currentLesson.title}
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowOptionalVideo(!showOptionalVideo)}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 flex items-center gap-2"
                  >
                    <Video className="w-4 h-4 text-[#00D4FF]" />
                    <span>{showOptionalVideo ? 'Hide Video' : 'Optional Video'}</span>
                  </button>

                  <button
                    onClick={handleCompleteLesson}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete (+100 XP)</span>
                  </button>
                </div>
              </div>

              {/* OPTIONAL VIDEO RESOURCE DRAWER */}
              {showOptionalVideo && (
                <div className="mt-4 p-4 rounded-2xl bg-[#121E30]/90 border border-[#00D4FF]/30 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#00D4FF] font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Video className="w-4 h-4" />
                      Optional Supplementary Video Walkthrough
                    </span>
                    <button onClick={() => setShowOptionalVideo(false)} className="text-gray-400 hover:text-white">✕</button>
                  </div>
                  <div className="aspect-video w-full rounded-xl bg-black/80 flex items-center justify-center relative overflow-hidden border border-white/10">
                    <div className="text-center space-y-2 p-4">
                      <div className="w-12 h-12 rounded-full bg-[#00D4FF]/20 text-[#00D4FF] mx-auto flex items-center justify-center">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                      <p className="text-xs text-gray-300 font-medium">Supplementary video explanations are optional. Text & code practice are the primary learning materials.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TABBED INTERACTION PANELS */}
              <div className="mt-6 border-b border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
                {[
                  { id: 'reading', label: 'Rich Formatted Content', icon: FileText },
                  { id: 'practice', label: 'Code Practice Playground', icon: Code },
                  { id: 'quiz', label: `Quick Quiz (${currentLesson.quiz?.length || 0})`, icon: HelpCircle },
                  { id: 'notes', label: 'My Study Notes', icon: BookOpen },
                  { id: 'resources', label: 'Resources & Docs', icon: Sparkles }
                ].map(tab => {
                  const IconComponent = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'border-[#00D4FF] text-[#00D4FF] bg-[#00D4FF]/10 rounded-t-xl'
                          : 'border-transparent text-gray-400 hover:text-white'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB CONTENTS */}
              <div className="mt-6">
                {/* Rich Formatted Text & Explanations */}
                {activeTab === 'reading' && (
                  <div className="p-6 rounded-2xl bg-[#121E30]/72 border border-white/10 space-y-4 text-gray-300 leading-relaxed text-sm sm:text-base backdrop-blur-xl shadow-xl">
                    <div className="p-4 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-sm text-[#00D4FF] font-medium">
                      💡 Lesson Summary: {currentLesson.summary}
                    </div>

                    <div className="prose prose-invert max-w-none space-y-4">
                      <pre className="whitespace-pre-line font-sans text-gray-200 leading-relaxed">{currentLesson.contentMarkdown}</pre>
                    </div>

                    {/* Mini Challenge Box */}
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-[#00D4FF]/15 to-transparent border border-[#00D4FF]/30 space-y-2 mt-8">
                      <span className="text-[10px] font-mono text-[#00D4FF] uppercase font-bold tracking-wider">Mini Challenge</span>
                      <h4 className="font-bold text-white text-sm">Apply What You Learned</h4>
                      <p className="text-xs text-gray-300">Switch to the Code Practice tab to execute and test the code snippet for this lesson!</p>
                      <button
                        onClick={() => setActiveTab('practice')}
                        className="px-4 py-2 rounded-xl bg-[#00D4FF] text-[#07111F] text-xs font-bold transition-all hover:brightness-110"
                      >
                        Open Practice Playground
                      </button>
                    </div>
                  </div>
                )}

                {/* Practice Code Playground */}
                {activeTab === 'practice' && (
                  <div className="p-6 rounded-2xl bg-[#121E30]/72 border border-white/10 space-y-4 backdrop-blur-xl shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-[#00D4FF] flex items-center gap-1.5">
                        <Code className="w-4 h-4" />
                        TypeScript Practice Exercise
                      </span>
                      <button
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00D4FF] via-[#7C3AED] to-[#FF8A00] text-white font-bold text-xs flex items-center gap-2 shadow-lg hover:brightness-110 cursor-pointer disabled:opacity-50"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isRunning ? 'Running...' : 'Execute Code'}</span>
                      </button>
                    </div>

                    <textarea
                      value={code}
                      onChange={e => setCode(e.target.value)}
                      rows={8}
                      className="w-full p-4 rounded-xl bg-[#07111F] border border-white/10 font-mono text-xs text-[#00D4FF] focus:outline-none focus:border-[#00D4FF] leading-relaxed resize-y"
                    />

                    {output !== null && (
                      <div className="p-4 rounded-xl bg-[#07111F] border border-white/10 font-mono text-xs">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Terminal Output</span>
                        <pre className="text-emerald-400 whitespace-pre-wrap">{output}</pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Quiz */}
                {activeTab === 'quiz' && (
                  <div className="p-6 rounded-2xl bg-[#121E30]/72 border border-white/10 space-y-6 backdrop-blur-xl shadow-xl">
                    {currentLesson.quiz && currentLesson.quiz.length > 0 ? (
                      <div>
                        <h3 className="text-base font-bold text-white mb-4">
                          {currentLesson.quiz[0].question}
                        </h3>

                        <div className="space-y-3">
                          {currentLesson.quiz[0].options.map((opt, idx) => {
                            const isSelected = selectedAnswer === idx;
                            return (
                              <button
                                key={idx}
                                onClick={() => setSelectedAnswer(idx)}
                                className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between ${
                                  isSelected
                                    ? 'bg-[#00D4FF]/20 border-[#00D4FF] text-white font-semibold'
                                    : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/30'
                                }`}
                              >
                                <span>{opt}</span>
                                <span className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center text-xs">
                                  {String.fromCharCode(65 + idx)}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                          <button
                            onClick={handleSubmitQuiz}
                            disabled={selectedAnswer === null}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00D4FF] via-[#7C3AED] to-[#FF8A00] text-white font-bold text-xs shadow-lg disabled:opacity-40 cursor-pointer"
                          >
                            Submit Answer
                          </button>

                          {quizSubmitted && (
                            <span className={`text-xs font-bold ${quizSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {quizSuccess ? 'Correct! +50 XP Earned 🎉' : 'Incorrect. Try again!'}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">No quiz attached to this lesson.</p>
                    )}
                  </div>
                )}

                {/* Student Notes */}
                {activeTab === 'notes' && (
                  <div className="p-6 rounded-2xl bg-[#121E30]/72 border border-white/10 space-y-4 backdrop-blur-xl shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-300">Personal Study Notes</span>
                      <button
                        onClick={handleSaveNote}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSavedNote ? 'Saved!' : 'Save Note'}</span>
                      </button>
                    </div>

                    <textarea
                      value={noteText}
                      onChange={e => setNoteText(e.target.value)}
                      placeholder="Type key takeaways, formulas, or reminders here..."
                      rows={6}
                      className="w-full p-4 rounded-xl bg-[#07111F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#00D4FF]"
                    />
                  </div>
                )}

                {/* Resources */}
                {activeTab === 'resources' && (
                  <div className="p-6 rounded-2xl bg-[#121E30]/72 border border-white/10 space-y-3 backdrop-blur-xl shadow-xl">
                    {currentLesson.resources.map((res, idx) => (
                      <a
                        key={idx}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#00D4FF] transition-all text-xs text-gray-200"
                      >
                        <span className="font-semibold">{res.name}</span>
                        <span className="px-2 py-0.5 rounded bg-[#00D4FF]/20 text-[#00D4FF] text-[10px]">
                          {res.type}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* NEXT LESSON BOTTOM BAR */}
            <div className="pt-8 border-t border-white/10 mt-12 flex items-center justify-between">
              <button
                onClick={() => router.push(`/replit-ai-academy`)}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300"
              >
                Overview
              </button>

              <Link
                href={`/replit-ai-academy/lesson/${nextLessonId}`}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00D4FF] via-[#7C3AED] to-[#FF8A00] text-white font-bold text-xs shadow-2xl flex items-center gap-2 hover:scale-105 transition-all"
              >
                <span>Continue to Next Lesson</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </main>
        </div>

        {/* Floating AI Mentor */}
        <ReplitAIMentor />

        {/* Completion Modal Celebration */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
              onClick={() => setShowCelebration(false)}
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="max-w-md w-full p-8 rounded-3xl bg-gradient-to-b from-[#0E1A2B] to-[#07111F] border border-[#00D4FF] text-center shadow-2xl space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#00D4FF] via-[#7C3AED] to-[#FF8A00] mx-auto flex items-center justify-center text-white text-2xl shadow-xl">
                  🏆
                </div>
                <h2 className="text-2xl font-extrabold text-white">Lesson Completed!</h2>
                <p className="text-sm text-gray-300">
                  You earned <span className="text-amber-400 font-bold">+100 XP</span> and advanced in your Replit AI Academy journey.
                </p>

                <button
                  onClick={() => {
                    setShowCelebration(false);
                    router.push(`/replit-ai-academy/lesson/${nextLessonId}`);
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00D4FF] via-[#7C3AED] to-[#FF8A00] text-white font-bold text-sm shadow-xl cursor-pointer"
                >
                  Continue to Next Lesson
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ReplitPageTransition>
  );
}
