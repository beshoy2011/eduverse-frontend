'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Code2, Rocket, Lightbulb, RefreshCw } from 'lucide-react';

interface AIMentorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIMentorDrawer({ isOpen, onClose }: AIMentorDrawerProps) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        '👋 Welcome to EduVerse AI Founder Mentor! I am trained on Y Combinator methodology, LLM architecture, and full-stack AI development. What AI startup are you building today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const presets = [
    'How do I build an AI Agent with LangChain?',
    'Review my AI startup pitch deck structure',
    'Explain vector embeddings in simple terms',
    'How to monetize an LLM wrapper app?',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const newMessages = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    setTimeout(() => {
      let botResponse = '';
      if (query.toLowerCase().includes('agent') || query.toLowerCase().includes('langchain')) {
        botResponse =
          '🚀 Building an AI Agent requires 3 core pillars:\n1. **Perception**: Receiving prompt/context.\n2. **Reasoning Loop**: ReAct (Reasoning + Acting) pattern via LLM tool calls.\n3. **Execution**: Calling external APIs (e.g. web search, database, code execution).\n\nYou can start building this directly in the EduVerse IDE Challenge Workspace!';
      } else if (query.toLowerCase().includes('pitch') || query.toLowerCase().includes('startup')) {
        botResponse =
          '🔥 Great YC-style pitch structure:\n• **Problem**: $50B market inefficiency\n• **Solution**: 10x faster AI workflow\n• **Traction**: 2,000 active users in 2 weeks\n• **Business Model**: $29/mo SaaS + API usage fees\n• **Team**: EduVerse Certified AI Engineers';
      } else {
        botResponse = `✨ Analyzing: "${query}"...\n\nTo implement this in your EduVerse AI startup project, start by defining your system architecture in Next.js 16, hook up Supabase for state, and pass prompts to the OpenAI/Claude Edge function pipeline!`;
      }

      setMessages([...newMessages, { role: 'assistant', content: botResponse }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-md h-full glass-card border-l border-[#00E5FF]/20 flex flex-col justify-between shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#030712]/80">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00E5FF] to-[#7C3AED] p-0.5 shadow-md shadow-[#00E5FF]/20">
                  <div className="w-full h-full bg-[#0F172A] rounded-[10px] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-[#00E5FF]" />
                  </div>
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-white flex items-center gap-1.5">
                    EduVerse AI Mentor
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-slate-400">24/7 AI Startup & Technical Coach</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-[#00E5FF] to-[#00B4D8] text-slate-950 font-medium rounded-tr-none'
                        : 'bg-[#0F172A] border border-white/10 text-slate-200 rounded-tl-none shadow-lg'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center space-x-2 text-slate-400 py-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00E5FF]" />
                  <span className="text-[11px]">AI Mentor is thinking...</span>
                </div>
              )}
            </div>

            {/* Presets */}
            <div className="px-4 py-2 border-t border-white/5 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Suggested Prompts</span>
              <div className="flex flex-wrap gap-1.5">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(preset)}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:border-[#00E5FF]/50 hover:text-[#00E5FF] transition-all text-left truncate max-w-full"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Box */}
            <div className="p-4 border-t border-white/10 bg-[#030712]/90">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask your AI mentor anything..."
                  className="flex-1 bg-[#0F172A] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-slate-950 font-bold disabled:opacity-50 hover:scale-105 transition-transform"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
