'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Send, Award, ArrowRight, User as UserIcon, AlertCircle, Briefcase, RefreshCw, Bookmark, Sparkles, ChevronRight, Check } from 'lucide-react';
import { api } from '../../lib/api';
import Navbar from '../../components/Navbar';

interface InterviewSession {
  id: number;
  role: string;
  messages: { role: 'interviewer' | 'candidate'; content: string }[];
  status: 'ongoing' | 'completed';
  feedback?: {
    score: number;
    grade: string;
    strengths: string;
    weaknesses: string;
    detailed_feedback: string;
  };
  created_at: string;
}

const CAREER_TRACKS = [
  {
    role: "Python Developer",
    desc: "Test your skills in backend architecture, scripting automation, list processing, decorators, and memory management.",
    techs: ["Python", "GIL", "Garbage Collection", "OOP"],
    style: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-400 hover:border-blue-500/40"
  },
  {
    role: "Frontend Engineer",
    desc: "Verify your expertise in CSS layout grids, JavaScript scope bindings, React DOM reconciliation, and Next.js rendering paths.",
    techs: ["React", "CSS Grid", "JS Closures", "Next.js"],
    style: "from-pink-500/10 to-rose-500/10 border-pink-500/20 text-pink-400 hover:border-pink-500/40"
  },
  {
    role: "AI Researcher",
    desc: "Evaluate your understanding of deep neural layers, backpropagation gradient descents, self-attention, and weights.",
    techs: ["Neural Nets", "ReLU", "Transformers", "Optimizers"],
    style: "from-violet-500/10 to-purple-500/10 border-violet-500/20 text-violet-400 hover:border-violet-500/40"
  },
  {
    role: "Security Auditor",
    desc: "Audit your readiness in cryptographic channels, network scanning, SQL injection bypass, and defensive firewalls.",
    techs: ["TLS / HTTPS", "SQLi", "XSS", "Port Scanning"],
    style: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400 hover:border-emerald-500/40"
  }
];

export default function InterviewPage() {
  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [history, setHistory] = useState<InterviewSession[]>([]);
  const [selectedRole, setSelectedRole] = useState('');
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isSending]);

  async function loadHistory() {
    try {
      const data = await api.getInterviewHistory();
      setHistory(data);
    } catch (err) {
      console.error("Failed to load interview history:", err);
    }
  }

  const startInterview = async (role: string) => {
    setIsStarting(true);
    setSelectedRole(role);
    try {
      const session = await api.startInterview(role);
      setActiveSession(session);
    } catch (err: any) {
      alert(`Could not start interview: ${err.message}`);
    } finally {
      setIsStarting(false);
    }
  };

  const sendResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !activeSession || isSending) return;

    const userText = inputVal;
    setInputVal('');
    setIsSending(true);

    // Optimistically update candidate response in local state
    const tempMsgs = [...activeSession.messages, { role: 'candidate' as const, content: userText }];
    setActiveSession({
      ...activeSession,
      messages: tempMsgs
    });

    try {
      const updated = await api.respondInterview(activeSession.id, userText);
      setActiveSession(updated);
      if (updated.status === 'completed') {
        loadHistory(); // reload completed history list
      }
    } catch (err: any) {
      alert(`Failed to send response: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-pink-500/5 blur-[120px] pointer-events-none"></div>

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 flex flex-col min-h-0 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 flex-1 min-h-0">
          
          {/* Main Workspace Frame */}
          <div className="flex-1 flex flex-col min-h-0 bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
            
            {!activeSession ? (
              /* Step 1: Career Track Selection */
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                <div>
                  <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    🎙️ AI Recruiter Technical Interview Lab
                  </h1>
                  <p className="text-slate-400 text-xs mt-1">
                    Hone your technical syntax, algorithmic strategies, and conceptual structures in a real Recruiter simulation.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CAREER_TRACKS.map((track) => (
                    <div
                      key={track.role}
                      className={`flex flex-col justify-between rounded-xl border p-5 bg-gradient-to-b ${track.style} transition-all duration-300 group hover:-translate-y-0.5`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-5 w-5" />
                          <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                            {track.role}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {track.desc}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {track.techs.map((tech) => (
                            <span key={tech} className="rounded-md bg-slate-950 border border-slate-800 px-2 py-0.5 text-[9px] font-mono text-slate-400">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => startInterview(track.role)}
                        disabled={isStarting}
                        className="mt-5 w-full flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-500 transition-all active:scale-[0.98]"
                      >
                        {isStarting && selectedRole === track.role ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Starting Simulator...
                          </>
                        ) : (
                          <>
                            Enter Recruiter Simulator <ArrowRight className="h-3.5 w-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeSession.status === 'completed' ? (
              /* Step 3: Interview Completed Report Card */
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 flex flex-col items-center">
                <div className="text-center space-y-2 max-w-xl">
                  <div className="inline-block rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    Simulation Concluded
                  </div>
                  <h2 className="text-2xl font-extrabold text-white">Interview Assessment Report</h2>
                  <p className="text-slate-400 text-xs">
                    Your answers for the **{activeSession.role}** role have been analyzed and graded by the Recruiter.
                  </p>
                </div>

                {activeSession.feedback && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-2xl bg-slate-950/40 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl relative overflow-hidden"
                  >
                    {/* Glowing side accent */}
                    <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-pink-500"></div>

                    {/* Grade & Score Badge */}
                    <div className="flex items-center gap-6 border-b border-slate-850 pb-5">
                      <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-2 shadow-lg ${
                        activeSession.feedback.grade === 'A'
                          ? 'bg-emerald-500/5 border-emerald-500/30 text-emerald-500 shadow-emerald-500/5'
                          : activeSession.feedback.grade === 'B'
                          ? 'bg-blue-500/5 border-blue-500/30 text-blue-500 shadow-blue-500/5'
                          : 'bg-amber-500/5 border-amber-500/30 text-amber-400 shadow-amber-500/5'
                      }`}>
                        <span className="text-2xl font-extrabold leading-none">{activeSession.feedback.grade}</span>
                        <span className="text-[10px] font-bold opacity-80 mt-0.5">{activeSession.feedback.score}%</span>
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="text-sm font-bold text-white">Simulation: {activeSession.role}</h3>
                        <p className="text-slate-400 text-[10px]">Passed with EduVerse recruiters standard index thresholds.</p>
                        <span className="inline-block rounded bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[9px] font-bold text-indigo-400">
                          XP Awarded: +300 XP
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Strengths */}
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                          <Check className="h-4 w-4" /> Key Strengths
                        </h4>
                        <div className="text-slate-300 text-xs leading-relaxed space-y-1 whitespace-pre-line">
                          {activeSession.feedback.strengths}
                        </div>
                      </div>

                      {/* Weaknesses */}
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" /> Areas for Growth
                        </h4>
                        <div className="text-slate-300 text-xs leading-relaxed space-y-1 whitespace-pre-line">
                          {activeSession.feedback.weaknesses}
                        </div>
                      </div>
                    </div>

                    {/* Critique */}
                    <div className="space-y-2 border-t border-slate-850 pt-5">
                      <h4 className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider">
                        Detailed Recruiter Critique
                      </h4>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        {activeSession.feedback.detailed_feedback}
                      </p>
                    </div>
                  </motion.div>
                )}

                <button
                  onClick={() => setActiveSession(null)}
                  className="rounded-lg bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 text-xs font-bold text-white transition-all shadow active:scale-[0.98]"
                >
                  Start New Interview Simulation
                </button>
              </div>
            ) : (
              /* Step 2: Live Interview Chat */
              <div className="flex-1 flex flex-col min-h-0 select-text">
                {/* Chat Header */}
                <div className="border-b border-slate-800 bg-slate-900/30 px-5 py-4 shrink-0 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-indigo-400" />
                    <div>
                      <h3 className="text-xs font-bold text-white">{activeSession.role} Simulator</h3>
                      <p className="text-[9px] text-slate-400 mt-0.5">Recruiter ID: Recruiter-2475</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                      Question {Math.min(5, sumQuestions(activeSession.messages))} of 5
                    </span>
                    <button
                      onClick={() => setActiveSession(null)}
                      className="rounded border border-slate-800 hover:bg-slate-800 px-2 py-1 text-[9px] font-semibold text-slate-400"
                    >
                      Exit Simulator
                    </button>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {activeSession.messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 max-w-[85%] ${
                        msg.role === 'candidate' ? 'ml-auto flex-row-reverse' : ''
                      }`}
                    >
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border text-xs font-bold ${
                        msg.role === 'candidate'
                          ? 'bg-indigo-550 border-indigo-400 text-white'
                          : 'bg-slate-950 border-slate-800 text-indigo-400'
                      }`}>
                        {msg.role === 'candidate' ? <UserIcon className="h-4 w-4" /> : <Terminal className="h-4 w-4" />}
                      </div>

                      {/* Content Card */}
                      <div className={`rounded-xl px-4 py-3 text-xs leading-relaxed ${
                        msg.role === 'candidate'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-950/60 border border-slate-800 text-slate-350'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {/* Sending typing loader */}
                  {isSending && (
                    <div className="flex gap-3 max-w-[80%]">
                      <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center border bg-slate-950 border-slate-800 text-indigo-400">
                        <Terminal className="h-4 w-4" />
                      </div>
                      <div className="rounded-xl px-4 py-3 bg-slate-950/60 border border-slate-800 flex items-center gap-1 shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-200"></div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input form */}
                <form onSubmit={sendResponse} className="border-t border-slate-800 p-4 bg-slate-900/30 shrink-0 flex gap-2">
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    disabled={isSending}
                    placeholder="Type your response to the recruiter's question..."
                    className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isSending || !inputVal.trim()}
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white px-4 flex items-center justify-center shadow transition-all hover:shadow-lg active:scale-95"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Right History Sidebar */}
          <div className="w-full md:w-72 shrink-0 flex flex-col gap-6">
            {/* History Panel */}
            <div className="flex-1 bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex flex-col min-h-[300px]">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-3 mb-4">
                <Bookmark className="h-4 w-4 text-indigo-400" /> Past Simulations
              </h3>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {history.length > 0 ? (
                  history.map((sess) => (
                    <div
                      key={sess.id}
                      onClick={() => {
                        if (sess.status === 'completed') {
                          setActiveSession(sess);
                        }
                      }}
                      className="rounded-lg border border-slate-800 bg-slate-950/40 p-3 hover:border-indigo-500/40 hover:bg-slate-950 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-indigo-400 truncate max-w-[150px]">
                          {sess.role}
                        </span>
                        
                        {sess.feedback ? (
                          <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">
                            Grade: {sess.feedback.grade}
                          </span>
                        ) : (
                          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[8px] font-semibold text-slate-400">
                            Ongoing
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-[8px] text-slate-500 mt-2 font-mono">
                        <span>{new Date(sess.created_at).toLocaleDateString()}</span>
                        <span className="group-hover:text-indigo-400 flex items-center transition-colors">
                          View assessment <ChevronRight className="h-2 w-2" />
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-center text-slate-500 text-xs py-8">
                    No completed mock interviews yet.
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// Helpers
function sumQuestions(messages: any[]) {
  return messages.filter(m => m.role === 'interviewer').length;
}
