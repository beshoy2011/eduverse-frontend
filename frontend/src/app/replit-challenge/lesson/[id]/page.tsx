'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReplitNavbar from '@/components/replit-challenge/ReplitNavbar';
import ParticleCanvas from '@/components/replit-challenge/ParticleCanvas';
import ReplitCodePlayground from '@/components/replit-challenge/ReplitCodePlayground';
import { REPLIT_CHALLENGE_MODULES } from '@/lib/replit-challenge-data';
import { markModuleCompleted } from '@/lib/replit-store';
import { 
  BookOpen, Video, Code2, Bot, CheckCircle2, Trophy, 
  ArrowLeft, ArrowRight, Zap, Coins, Sparkles, HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LessonRunnerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const moduleId = parseInt(resolvedParams.id, 10) || 1;
  const router = useRouter();

  const moduleData = REPLIT_CHALLENGE_MODULES.find((m) => m.id === moduleId) || REPLIT_CHALLENGE_MODULES[0];

  const [activeTab, setActiveTab] = useState<'reading' | 'video' | 'coding' | 'quiz' | 'project'>('reading');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const handleSelectQuiz = (quizId: string, optionIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [quizId]: optionIdx }));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
  };

  const handleCompleteLesson = () => {
    markModuleCompleted(moduleData.id, moduleData.xpReward, moduleData.coinsReward);
    setCompleted(true);
    setXpEarned(moduleData.xpReward);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 relative overflow-hidden font-sans">
      <ParticleCanvas />
      <ReplitNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 space-y-8">
        
        {/* Top Breadcrumb & Controls */}
        <div className="flex items-center justify-between">
          <Link
            href="/replit-challenge/course"
            className="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Syllabus</span>
          </Link>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Module 0{moduleData.id} of 12
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-bold">
              <Zap className="w-3.5 h-3.5 fill-amber-300" /> +{moduleData.xpReward} XP
            </span>
          </div>
        </div>

        {/* Module Header Title Card */}
        <div className="p-8 rounded-3xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-xl space-y-3">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            {moduleData.level} Level • {moduleData.badgeName} {moduleData.badgeIcon}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            {moduleData.title}
          </h1>
          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            {moduleData.description}
          </p>

          {/* Objectives Chips */}
          <div className="pt-3 border-t border-slate-900 flex flex-wrap gap-2">
            {moduleData.objectives.map((obj, idx) => (
              <span key={idx} className="px-3 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 text-xs font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                {obj}
              </span>
            ))}
          </div>
        </div>

        {/* Interactive Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {[
            { id: 'reading', label: '1. Reading Notes', icon: BookOpen },
            { id: 'video', label: '2. Video Masterclass', icon: Video },
            { id: 'coding', label: '3. Replit Coding Playground', icon: Code2 },
            { id: 'quiz', label: '4. Knowledge Quiz', icon: HelpCircle },
            { id: 'project', label: '5. Mini Project & AI Challenge', icon: Bot },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="min-h-[400px]">
          
          {/* TAB 1: READING */}
          {activeTab === 'reading' && (
            <div className="p-8 rounded-3xl bg-slate-950/80 border border-slate-800 backdrop-blur-xl prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed font-sans">
                {moduleData.readingMaterial}
              </div>
            </div>
          )}

          {/* TAB 2: VIDEO WALKTHROUGH */}
          {activeTab === 'video' && (
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 backdrop-blur-xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-purple-400" />
                {moduleData.videoTitle}
              </h3>
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 relative flex items-center justify-center">
                <iframe
                  src={moduleData.videoPlaceholderUrl}
                  title={moduleData.videoTitle}
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* TAB 3: REPLIT CODING PLAYGROUND */}
          {activeTab === 'coding' && (
            <ReplitCodePlayground
              initialCode={moduleData.codingExercises[0]?.initialCode || '// Write code here'}
              solutionCode={moduleData.codingExercises[0]?.solutionCode}
              aiPromptHint={moduleData.codingExercises[0]?.aiPromptHint || 'Prompt Replit Agent to complete'}
            />
          )}

          {/* TAB 4: QUIZZES */}
          {activeTab === 'quiz' && (
            <div className="p-8 rounded-3xl bg-slate-950/80 border border-slate-800 backdrop-blur-xl space-y-6">
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                Module Assessment Quiz
              </h3>

              {moduleData.quizzes.map((q, qIdx) => (
                <div key={q.id} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <p className="text-sm font-bold text-white">
                    {qIdx + 1}. {q.question}
                  </p>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[q.id] === optIdx;
                      const isCorrect = optIdx === q.correctAnswer;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectQuiz(q.id, optIdx)}
                          className={`w-full p-3 rounded-xl text-left text-xs font-medium transition-all ${
                            quizSubmitted
                              ? isCorrect
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : isSelected
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : 'bg-slate-950 text-slate-400 border border-slate-800'
                              : isSelected
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <p className="text-xs text-cyan-400 font-mono pt-2 border-t border-slate-800">
                      💡 {q.explanation}
                    </p>
                  )}
                </div>
              ))}

              {!quizSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-extrabold text-xs shadow-lg hover:scale-105 transition-transform"
                >
                  Check Answers
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                  ✓ Quiz completed cleanly! Ready to claim module graduation rewards.
                </div>
              )}
            </div>
          )}

          {/* TAB 5: MINI PROJECT */}
          {activeTab === 'project' && (
            <div className="p-8 rounded-3xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-xl space-y-6">
              <div>
                <span className="text-xs font-mono text-purple-400 uppercase font-bold">Mini Project Specification</span>
                <h3 className="text-2xl font-extrabold text-white mt-1">{moduleData.miniProject.title}</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{moduleData.miniProject.description}</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h4 className="text-xs font-mono uppercase font-bold text-cyan-400">Required Deliverables</h4>
                <ul className="space-y-2">
                  {moduleData.miniProject.deliverables.map((del, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                <h4 className="text-xs font-mono uppercase font-bold text-purple-300 flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-purple-400" />
                  AI Challenge Prompt Instruction
                </h4>
                <p className="text-xs text-slate-300">{moduleData.aiChallenge.promptInstruction}</p>
              </div>
            </div>
          )}

        </div>

        {/* Graduation / Completion Bottom Bar */}
        <div className="p-6 rounded-3xl bg-slate-950/90 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs font-mono text-cyan-400 font-bold">Module Reward Summary</p>
            <p className="text-sm font-extrabold text-white mt-0.5">
              +{moduleData.xpReward} XP • +{moduleData.coinsReward} Coins • Badge: {moduleData.badgeName}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {!completed ? (
              <button
                onClick={handleCompleteLesson}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:scale-105 transition-all"
              >
                Claim XP & Complete Module
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Completed!
                </span>
                {moduleId < 12 && (
                  <Link
                    href={`/replit-challenge/lesson/${moduleId + 1}`}
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-colors"
                  >
                    Next Module →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
