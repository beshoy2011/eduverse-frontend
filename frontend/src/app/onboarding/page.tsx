'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import EduVerseNavbar from '@/components/EduVerseNavbar';
import ParticleMeshCanvas from '@/components/ParticleMeshCanvas';
import {
  Sparkles, ArrowRight, ArrowLeft, Bot, Check, CheckCircle2, Globe, Rocket,
  Compass, Code2, Cpu, RefreshCw, Star, Trophy, Target
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [roadmapGenerated, setRoadmapGenerated] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    age: '21',
    country: 'United States',
    goal: 'Build an AI Startup',
    experience: 'Beginner (Some HTML/JS)',
    languages: ['TypeScript', 'Python'],
    interests: ['LLM Agents', 'GenAI SaaS', 'Autonomous Code AI'],
    track: 'Full-Stack AI SaaS Founder Track',
    dreamStartup: 'AI Code Assistant that auto-deploys SaaS apps from voice prompts.',
  });

  const goalsList = [
    { title: 'Build an AI Startup', desc: 'Become a founder, launch a real product, raise VC funding.' },
    { title: 'Become an AI Engineer', desc: 'Get hired by OpenAI, Anthropic, Google, or top startups.' },
    { title: 'AI Researcher & Creator', desc: 'Publish papers, create open-source models, build audience.' },
  ];

  const tracksList = [
    { name: 'Full-Stack AI SaaS Founder Track', desc: 'Next.js 16 + Supabase + LLM APIs + Stripe Payments' },
    { name: 'LLM Agent Architect Track', desc: 'LangChain + LlamaIndex + Vector DBs + Autonomous ReAct Loops' },
    { name: 'Autonomous Code & Multimodal AI Track', desc: 'PyTorch + Fine-Tuning + Whisper + Computer Vision' },
  ];

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setRoadmapGenerated(true);
      }, 2500);
    }
  };

  const toggleLanguage = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-[#00E5FF]/30 selection:text-[#00E5FF]">
      <ParticleMeshCanvas />
      <EduVerseNavbar />

      <main className="relative flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 z-10">
        <div className="w-full max-w-2xl">
          
          {/* Progress Bar */}
          {!roadmapGenerated && (
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs text-slate-400 font-num mb-2">
                <span>Step {step} of 5</span>
                <span className="text-[#00E5FF] font-bold">{step * 20}% Complete</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#00E5FF] to-[#7C3AED]"
                  initial={{ width: 0 }}
                  animate={{ width: `${step * 20}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* AI Roadmap Generator Loader Screen */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-3xl p-8 text-center space-y-6 border border-[#00E5FF]/40 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center mx-auto">
                <RefreshCw className="w-8 h-8 text-[#00E5FF] animate-spin" />
              </div>
              <div className="space-y-2">
                <h2 className="font-heading text-2xl font-bold text-white">Synthesizing Personal AI Roadmap</h2>
                <p className="text-xs text-slate-400">
                  EduVerse AI is analyzing your goals, track ({formData.track}), and dream startup idea...
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#0F172A] border border-white/5 text-xs text-left space-y-2 font-mono">
                <p className="text-emerald-400">✓ Constructing custom 8-week startup syllabus...</p>
                <p className="text-[#00E5FF]">✓ Assigning YC AI Mentor office hours...</p>
                <p className="text-[#A855F7]">✓ Provisioning Replit-style browser sandbox...</p>
              </div>
            </motion.div>
          )}

          {/* Final Generated Roadmap View */}
          {roadmapGenerated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-3xl p-8 space-y-6 border border-emerald-500/40 shadow-2xl"
            >
              <div className="flex items-center space-x-3 pb-4 border-b border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Roadmap Generated</span>
                  <h2 className="font-heading text-xl font-extrabold text-white">Welcome to {formData.track}!</h2>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <h4 className="font-heading font-bold text-slate-200">Your AI Startup Plan Overview:</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-slate-400 block text-[10px]">Weekly Missions</span>
                    <span className="font-bold text-[#00E5FF] text-sm">4 Core Sprints</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-slate-400 block text-[10px]">Target Launch</span>
                    <span className="font-bold text-[#A855F7] text-sm">8 Weeks</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0F172A] border border-white/10 space-y-2">
                  <span className="font-heading text-xs font-bold text-[#00E5FF]">Dream Startup Target:</span>
                  <p className="text-slate-300 italic">"{formData.dreamStartup}"</p>
                </div>
              </div>

              <button
                onClick={() => router.push('/dashboard')}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-slate-950 font-heading font-extrabold text-sm shadow-xl shadow-[#00E5FF]/20 hover:scale-105 transition-transform flex items-center justify-center space-x-2"
              >
                <span>Enter Founder Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* Step Wizard Forms */}
          {!loading && !roadmapGenerated && (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-white/15 shadow-2xl"
            >
              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-bold text-[#00E5FF] tracking-wider">Step 1 • Profile setup</span>
                    <h2 className="font-heading text-2xl font-bold text-white">Where are you building from?</h2>
                    <p className="text-xs text-slate-400">Tell us a bit about yourself to personalize your global network match.</p>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Your Age</label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Country / Region</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-bold text-[#00E5FF] tracking-wider">Step 2 • Ultimate Ambition</span>
                    <h2 className="font-heading text-2xl font-bold text-white">What is your primary goal?</h2>
                    <p className="text-xs text-slate-400">Select the outcome you want to achieve through EduVerse.</p>
                  </div>

                  <div className="space-y-3">
                    {goalsList.map((g, idx) => (
                      <div
                        key={idx}
                        onClick={() => setFormData({ ...formData, goal: g.title })}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          formData.goal === g.title
                            ? 'bg-[#00E5FF]/10 border-[#00E5FF] text-white shadow-lg'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <h4 className="font-heading font-bold text-sm text-white flex items-center justify-between">
                          <span>{g.title}</span>
                          {formData.goal === g.title && <Check className="w-4 h-4 text-[#00E5FF]" />}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">{g.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-bold text-[#00E5FF] tracking-wider">Step 3 • Technical Background</span>
                    <h2 className="font-heading text-2xl font-bold text-white">What languages do you know?</h2>
                    <p className="text-xs text-slate-400">No worries if you are a total beginner!</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {['Python', 'TypeScript', 'JavaScript', 'HTML/CSS', 'C++', 'None (Zero Experience)'].map((lang, idx) => {
                      const selected = formData.languages.includes(lang);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleLanguage(lang)}
                          className={`p-3 rounded-xl border text-xs font-semibold text-left flex items-center justify-between transition-all ${
                            selected
                              ? 'bg-[#7C3AED]/20 border-[#7C3AED] text-white'
                              : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                          }`}
                        >
                          <span>{lang}</span>
                          {selected && <Check className="w-4 h-4 text-[#A855F7]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-bold text-[#00E5FF] tracking-wider">Step 4 • Track Specialization</span>
                    <h2 className="font-heading text-2xl font-bold text-white">Select your startup track</h2>
                  </div>

                  <div className="space-y-3">
                    {tracksList.map((t, idx) => (
                      <div
                        key={idx}
                        onClick={() => setFormData({ ...formData, track: t.name })}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          formData.track === t.name
                            ? 'bg-gradient-to-r from-[#00E5FF]/10 to-[#7C3AED]/10 border-[#00E5FF] text-white shadow-lg'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <h4 className="font-heading font-bold text-sm text-white">{t.name}</h4>
                        <p className="text-xs text-slate-400 mt-1">{t.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5 */}
              {step === 5 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-bold text-[#00E5FF] tracking-wider">Step 5 • Vision & Concept</span>
                    <h2 className="font-heading text-2xl font-bold text-white">Describe your dream AI startup</h2>
                    <p className="text-xs text-slate-400">Even a rough 1-sentence idea works!</p>
                  </div>

                  <div>
                    <textarea
                      rows={4}
                      value={formData.dreamStartup}
                      onChange={(e) => setFormData({ ...formData, dreamStartup: e.target.value })}
                      placeholder="e.g. An AI voice agent that books medical appointments automatically..."
                      className="w-full bg-[#0F172A] border border-white/10 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                {step > 1 ? (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2.5 rounded-xl glass-card text-slate-300 text-xs font-semibold hover:bg-white/10 flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-slate-950 font-heading font-bold text-xs shadow-lg shadow-[#00E5FF]/20 hover:scale-105 transition-transform flex items-center space-x-2"
                >
                  <span>{step === 5 ? 'Generate AI Roadmap' : 'Next Step'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}
