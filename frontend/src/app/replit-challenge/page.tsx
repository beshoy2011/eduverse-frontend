'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import EduVerseNavbar from '@/components/EduVerseNavbar';
import AIMentorDrawer from '@/components/AIMentorDrawer';
import {
  Play, Bot, CheckCircle2, Sparkles, Terminal, Code2, RefreshCw, Eye, FileCode,
  Flame, Zap, ArrowLeft, Send, Check, AlertCircle, Copy, Shield, Layers
} from 'lucide-react';

export default function ReplitChallengePage() {
  const [aiMentorOpen, setAIMentorOpen] = useState(false);
  const [activeFile, setActiveFile] = useState<'main.py' | 'rag_pipeline.ts' | 'schema.sql'>('main.py');
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string[]>([
    'EduVerse AI IDE v2.4.0 initialized.',
    'Environment: Next.js 16 Edge Runtime + Python 3.11 WASM',
    'Ready for execution.',
  ]);
  const [activeTab, setActiveTab] = useState<'console' | 'preview' | 'tests'>('console');
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotLoading, setCopilotLoading] = useState(false);

  const [codeFiles, setCodeFiles] = useState({
    'main.py': `import eduverse_ai as ai

# Initialize Autonomous AI Startup Agent
agent = ai.Agent(
    name="NexusAI",
    model="claude-3-7-sonnet",
    temperature=0.2
)

# Load context embeddings
vector_store = ai.load_pinecone_index("startup-knowledge")

def generate_pitch_deck(prompt: str):
    context = vector_store.similarity_search(prompt, k=3)
    response = agent.run(prompt=prompt, context=context)
    return response

print("🚀 AI Agent Service initialized successfully!")
print(generate_pitch_deck("Create YC pitch summary for NexusAI"))
`,
    'rag_pipeline.ts': `import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';

export async function queryRAGPipeline(userPrompt: string) {
  const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });
  console.log("Vector similarity search executed.");
  return { status: 200, prompt: userPrompt };
}
`,
    'schema.sql': `CREATE TABLE user_startups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  track TEXT NOT NULL,
  mrr DECIMAL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`,
  });

  const handleRunCode = () => {
    setRunning(true);
    setActiveTab('console');
    setOutput(prev => [...prev, '>>> Running main.py...']);

    setTimeout(() => {
      setOutput(prev => [
        ...prev,
        '🚀 AI Agent Service initialized successfully!',
        'Querying Pinecone Vector Index [startup-knowledge]...',
        'Generated YC Pitch Deck Summary:',
        '• Problem: Developers spend 15h/week manually writing boilerplate API code.',
        '• Solution: NexusAI generates full-stack Next.js 16 APIs in 10s.',
        '• Execution Time: 342ms | Memory: 42MB',
        '✓ All 4 Challenge Test Cases PASSED (+300 XP Earned!)',
      ]);
      setRunning(false);
    }, 1200);
  };

  const handleAskCopilot = () => {
    if (!copilotInput.trim() || copilotLoading) return;
    setCopilotLoading(true);
    setTimeout(() => {
      setCodeFiles(prev => ({
        ...prev,
        'main.py': prev['main.py'] + `\n# AI Copilot generated code\nprint("✨ Added automated Stripe webhooks listener!")\n`,
      }));
      setCopilotInput('');
      setCopilotLoading(false);
    }, 1000);
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-[#00E5FF]/30 selection:text-[#00E5FF]">
      <EduVerseNavbar onOpenAIMentor={() => setAIMentorOpen(true)} />
      <AIMentorDrawer isOpen={aiMentorOpen} onClose={() => setAIMentorOpen(false)} />

      {/* Main IDE Workspace */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden h-[calc(100vh-64px)]">
        
        {/* Left Side: Challenge Instructions & AI Pair Copilot */}
        <div className="w-full lg:w-80 border-r border-white/10 bg-[#0F172A]/70 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">
                Challenge #04
              </span>
              <span className="text-xs font-num font-bold text-emerald-400">+300 XP</span>
            </div>
            <h2 className="font-heading font-bold text-base text-white">Build RAG AI Agent</h2>
            <p className="text-xs text-slate-400">
              Integrate vector embeddings search with your AI agent pipeline in Python.
            </p>
          </div>

          {/* Test Specs */}
          <div className="p-4 border-b border-white/10 space-y-3">
            <h4 className="font-heading text-xs font-bold text-slate-200 uppercase tracking-wider">Test Suite Specs</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Vector index init</span>
                <span className="text-emerald-400 font-num font-bold">Passed</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Prompt similarity search</span>
                <span className="text-emerald-400 font-num font-bold">Passed</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Streaming response token</span>
                <span className="text-emerald-400 font-num font-bold">Passed</span>
              </div>
            </div>
          </div>

          {/* AI Copilot Prompt Panel */}
          <div className="p-4 flex-1 flex flex-col justify-end space-y-3 bg-[#030712]/50">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#00E5FF]" />
              <span className="font-heading text-xs font-bold text-white">EduVerse Copilot</span>
            </div>
            <p className="text-[11px] text-slate-400">Ask Copilot to generate helper functions or fix bugs directly in the editor.</p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={copilotInput}
                onChange={(e) => setCopilotInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskCopilot()}
                placeholder="Generate function..."
                className="flex-1 bg-[#0F172A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
              />
              <button
                onClick={handleAskCopilot}
                disabled={copilotLoading || !copilotInput.trim()}
                className="p-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-slate-950 font-bold disabled:opacity-50"
              >
                {copilotLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Center/Right: Code Editor & Console Output split */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* File Tab Bar & Run Button */}
          <div className="h-12 border-b border-white/10 bg-[#030712] flex items-center justify-between px-4">
            <div className="flex items-center space-x-1">
              {(['main.py', 'rag_pipeline.ts', 'schema.sql'] as const).map((file) => (
                <button
                  key={file}
                  onClick={() => setActiveFile(file)}
                  className={`px-3 py-1.5 rounded-t-lg text-xs font-mono flex items-center space-x-2 transition-colors ${
                    activeFile === file
                      ? 'bg-[#0F172A] text-[#00E5FF] border-t-2 border-t-[#00E5FF]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>{file}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleRunCode}
                disabled={running}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-slate-950 font-heading font-extrabold text-xs shadow-md shadow-[#00E5FF]/20 hover:scale-105 active:scale-95 transition-all flex items-center space-x-1.5"
              >
                {running ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
                <span>Run Code</span>
              </button>
            </div>
          </div>

          {/* Editor Body */}
          <div className="flex-1 bg-[#090D16] p-4 overflow-auto font-mono text-xs sm:text-sm text-slate-200 leading-relaxed relative">
            <textarea
              value={codeFiles[activeFile]}
              onChange={(e) => setCodeFiles({ ...codeFiles, [activeFile]: e.target.value })}
              className="w-full h-full bg-transparent resize-none focus:outline-none font-mono text-slate-200"
              spellCheck={false}
            />
          </div>

          {/* Bottom Console / Output Preview Panel */}
          <div className="h-48 border-t border-white/10 bg-[#0F172A] flex flex-col">
            <div className="h-9 border-b border-white/10 px-4 flex items-center justify-between text-xs bg-[#030712]/50">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setActiveTab('console')}
                  className={`font-semibold flex items-center gap-1.5 ${
                    activeTab === 'console' ? 'text-[#00E5FF]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" /> Console Terminal
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`font-semibold flex items-center gap-1.5 ${
                    activeTab === 'preview' ? 'text-[#00E5FF]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> Web App Preview
                </button>
              </div>

              <span className="text-[10px] font-mono text-slate-500">Execution Engine: Python 3.11 WASM</span>
            </div>

            <div className="flex-1 p-4 font-mono text-xs text-slate-300 overflow-y-auto space-y-1">
              {activeTab === 'console' && (
                output.map((line, idx) => (
                  <p key={idx} className={line.includes('PASSED') ? 'text-emerald-400 font-bold' : ''}>
                    {line}
                  </p>
                ))
              )}

              {activeTab === 'preview' && (
                <div className="h-full rounded-xl bg-slate-900 border border-white/10 p-4 flex flex-col items-center justify-center space-y-2 text-center">
                  <Sparkles className="w-6 h-6 text-[#00E5FF] animate-pulse" />
                  <p className="font-heading font-bold text-white text-xs">NexusAI Web App Preview</p>
                  <p className="text-[11px] text-slate-400">Live preview rendered at https://nexusai.eduverse.app</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
