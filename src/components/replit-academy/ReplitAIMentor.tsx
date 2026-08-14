'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Sparkles, X, Send, Code, Bug, Lightbulb, RefreshCw, 
  CheckCircle2, ArrowRight, ShieldAlert, Zap, FileCheck 
} from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  codeSnippet?: string;
  recommendationLink?: { label: string; url: string };
  timestamp: string;
}

export default function ReplitAIMentor() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "👋 Welcome to your Replit AI Academy Command Center! I am your AI Mentor. I can review your code, explain vector math, generate production snippets, or recommend your next lesson.",
      timestamp: 'Just now'
    }
  ]);

  const quickActions = [
    { label: "Review My Code", icon: FileCheck, prompt: "Review my code for security and memory performance risks." },
    { label: "Explain Vectors", icon: Lightbulb, prompt: "Explain vector embeddings in simple terms." },
    { label: "Debug Replit API", icon: Bug, prompt: "Why is my Replit Secret API key returning undefined?" },
    { label: "Next Lesson Hint", icon: Zap, prompt: "What lesson should I take next in the academy roadmap?" }
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = "";
      let codeSnippet: string | undefined = undefined;
      let recLink: { label: string; url: string } | undefined = undefined;

      const qLower = query.toLowerCase();

      if (qLower.includes("review") || qLower.includes("security")) {
        replyText = "🔍 Code Review Report:\n✔ Syntax: Passed\n✔ Types: Type-safe TypeScript schema\n⚠️ Security Alert: Never hardcode API keys directly in client bundles! Ensure your keys are stored inside Replit Secrets (.env).";
        codeSnippet = `// Recommended Safe Secret Fetching
const apiKey = process.env.REPLIT_AI_SECRET_KEY;
if (!apiKey) {
  throw new Error("Missing REPLIT_AI_SECRET_KEY in Secrets tab!");
}`;
      } else if (qLower.includes("vector") || qLower.includes("embedding")) {
        replyText = "Vector embeddings represent text as 1536-dimensional coordinates. High-dimensional distance algorithms like cosine similarity measure how closely related two ideas are!";
        codeSnippet = `const similarity = cosineSimilarity(vectorA, vectorB);
console.log("Semantic match score:", similarity);`;
      } else if (qLower.includes("debug") || qLower.includes("undefined")) {
        replyText = "To resolve undefined secret errors:\n1. Open the Secrets (.env) tool in Replit\n2. Add key: REPLIT_AI_SECRET_KEY\n3. Restart your dev server terminal.";
      } else if (qLower.includes("next") || qLower.includes("hint") || qLower.includes("lesson")) {
        replyText = "Recommended Next Step: Proceed to Module 2: AI Fundamentals to master Large Language Models, tokenization, and vector search!";
        recLink = { label: "Launch Module 2: AI Fundamentals", url: "/replit-ai-academy/lesson/m2-l1" };
      } else {
        replyText = `Great question! In Replit AI Academy, we prioritize hands-on micro-projects. Feel free to ask me for code snippets, debugging advice, or lesson recommendations!`;
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        codeSnippet,
        recommendationLink: recLink,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1100);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.06, boxShadow: "0 0 30px rgba(0, 212, 255, 0.6)" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3.5 rounded-full bg-gradient-to-r from-[#00D4FF] via-[#7C3AED] to-[#FF8A00] text-white font-medium shadow-2xl border border-white/20 backdrop-blur-xl cursor-pointer"
      >
        <div className="relative">
          <Bot className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00D4FF] animate-ping" />
        </div>
        <span className="text-sm font-semibold tracking-wide hidden sm:inline">AI Mentor</span>
        <Sparkles className="w-4 h-4 text-amber-300" />
      </motion.button>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md h-full bg-[#0E1A2B]/95 border-l border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden text-[#F8FAFC]"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 bg-gradient-to-r from-[#00D4FF]/20 via-[#7C3AED]/20 to-transparent flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00D4FF] via-[#7C3AED] to-[#FF8A00] flex items-center justify-center text-white shadow-lg">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                      Replit AI Mentor
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/30">Active</span>
                    </h3>
                    <p className="text-xs text-[#94A3B8]">Powered by Replit Agent Engine</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="p-3 border-b border-white/5 bg-white/[0.02] flex items-center gap-2 overflow-x-auto no-scrollbar">
                {quickActions.map((qa, idx) => {
                  const Icon = qa.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSend(qa.prompt)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#00D4FF]/20 hover:border-[#00D4FF]/40 border border-white/10 text-xs text-gray-300 transition-all whitespace-nowrap"
                    >
                      <Icon className="w-3.5 h-3.5 text-[#00D4FF]" />
                      {qa.label}
                    </button>
                  );
                })}
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl p-3.5 text-sm ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-[#00D4FF] to-[#7C3AED] text-white rounded-br-none shadow-lg'
                          : 'bg-[#121E30]/90 border border-white/10 text-gray-200 rounded-bl-none shadow-md backdrop-blur-md'
                      }`}
                    >
                      <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                      {msg.codeSnippet && (
                        <div className="mt-3 p-3 rounded-lg bg-[#07111F] border border-white/10 font-mono text-xs overflow-x-auto text-[#00D4FF]">
                          <pre>{msg.codeSnippet}</pre>
                        </div>
                      )}

                      {msg.recommendationLink && (
                        <Link
                          href={msg.recommendationLink.url}
                          className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#00D4FF]/20 hover:bg-[#00D4FF]/30 border border-[#00D4FF]/40 text-xs font-bold text-[#00D4FF] transition-all"
                        >
                          <span>{msg.recommendationLink.label}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1 px-1">{msg.timestamp}</span>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-gray-400 text-xs p-2 rounded-xl bg-[#121E30] border border-white/10 w-fit">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00D4FF]" />
                    AI Mentor is auditing request...
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-white/10 bg-[#07111F]">
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask AI Mentor for review or hints..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00D4FF] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-[#00D4FF] via-[#7C3AED] to-[#FF8A00] text-white disabled:opacity-40 transition-all cursor-pointer shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
