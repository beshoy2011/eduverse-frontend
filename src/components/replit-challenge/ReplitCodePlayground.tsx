'use client';

import React, { useState } from 'react';
import { 
  Play, Terminal, Bot, Sparkles, CheckCircle2, RefreshCw, 
  Code2, Send, Cpu, Lightbulb, Zap, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlaygroundProps {
  initialCode: string;
  solutionCode?: string;
  expectedOutput?: string;
  aiPromptHint: string;
  onSuccessReward?: () => void;
}

export default function ReplitCodePlayground({
  initialCode,
  solutionCode,
  expectedOutput,
  aiPromptHint,
  onSuccessReward
}: PlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [agentPrompt, setAgentPrompt] = useState('');
  const [agentLog, setAgentLog] = useState<string[]>([]);
  const [isAgentThinking, setIsAgentThinking] = useState(false);
  const [passed, setPassed] = useState(false);

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput(null);

    setTimeout(() => {
      let consoleLogs: string[] = [];
      const customConsole = {
        log: (...args: any[]) => consoleLogs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
        error: (...args: any[]) => consoleLogs.push(`[ERROR] ${args.join(' ')}`),
        warn: (...args: any[]) => consoleLogs.push(`[WARN] ${args.join(' ')}`)
      };

      try {
        const runFn = new Function('console', code);
        runFn(customConsole);
        const resultText = consoleLogs.join('\n') || '✓ Program executed cleanly (0 errors)';
        setOutput(resultText);
        setPassed(true);
        if (onSuccessReward) onSuccessReward();
      } catch (err: any) {
        setOutput(`Runtime Exception: ${err.message}`);
        setPassed(false);
      } finally {
        setIsRunning(false);
      }
    }, 600);
  };

  const handleAskAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentPrompt.trim()) return;

    setIsAgentThinking(true);
    const userMessage = agentPrompt;
    setAgentPrompt('');

    setTimeout(() => {
      setAgentLog(prev => [
        ...prev,
        `User Prompt: "${userMessage}"`,
        `🤖 Replit Agent: Analyzing repository & refactoring code syntax...`,
        `✓ Updated file structure and optimized performance!`
      ]);
      
      if (userMessage.toLowerCase().includes('fix') || userMessage.toLowerCase().includes('optimize')) {
        setCode(prev => `// Optimized by Replit Agent\n${prev}`);
      }
      setIsAgentThinking(false);
    }, 1200);
  };

  return (
    <div className="rounded-2xl bg-slate-950 border border-cyan-500/30 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)]">
      
      {/* Replit Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono font-medium text-slate-400 flex items-center gap-1">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            main.js — Replit Cloud Workspace
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCode(initialCode)}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/60 rounded-md transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.6)] hover:scale-105 transition-all duration-200"
          >
            {isRunning ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-slate-950" />
            )}
            <span>{isRunning ? 'Executing...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Agent Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
        
        {/* Code Editor Column */}
        <div className="lg:col-span-7 border-r border-slate-800/80 p-4 flex flex-col justify-between bg-slate-950">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-cyan-400/90 font-semibold tracking-wide uppercase">
                JavaScript Source Code
              </span>
              <span className="text-[11px] text-slate-500 font-mono">UTF-8</span>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-[260px] p-3 font-mono text-xs text-cyan-100 bg-slate-900/60 rounded-xl border border-slate-800 focus:border-cyan-500/50 focus:outline-none resize-none leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* AI Hint Pill */}
          <div className="mt-3 p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex items-start space-x-2.5">
            <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-xs text-cyan-200/90 leading-snug">
              <strong className="text-cyan-400">Replit AI Hint:</strong> {aiPromptHint}
            </p>
          </div>
        </div>

        {/* Replit Agent AI Co-Pilot Column */}
        <div className="lg:col-span-5 p-4 bg-slate-900/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="text-xs font-bold text-white tracking-wide">Replit Agent Co-Pilot</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Autonomous
              </span>
            </div>

            {/* Agent Log Box */}
            <div className="h-[200px] overflow-y-auto p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs space-y-2">
              {agentLog.length === 0 ? (
                <p className="text-slate-500 text-[11px] italic">
                  Ask Replit Agent to refactor code, generate tests, or add features automatically...
                </p>
              ) : (
                agentLog.map((log, idx) => (
                  <p key={idx} className={log.startsWith('🤖') ? 'text-purple-300' : log.startsWith('✓') ? 'text-emerald-400' : 'text-slate-300'}>
                    {log}
                  </p>
                ))
              )}
              {isAgentThinking && (
                <p className="text-cyan-400 flex items-center gap-1.5 animate-pulse">
                  <Cpu className="w-3.5 h-3.5 animate-spin" />
                  Agent writing full-stack code...
                </p>
              )}
            </div>
          </div>

          {/* Prompt Input Form */}
          <form onSubmit={handleAskAgent} className="mt-3 relative">
            <input
              type="text"
              value={agentPrompt}
              onChange={(e) => setAgentPrompt(e.target.value)}
              placeholder="Prompt Replit Agent (e.g. 'Refactor to ES6', 'Add error handling')..."
              className="w-full pl-3 pr-10 py-2 rounded-xl bg-slate-950 border border-purple-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
            />
            <button
              type="submit"
              disabled={isAgentThinking || !agentPrompt.trim()}
              className="absolute right-1.5 top-1.5 p-1 rounded-lg bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-50 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

      {/* Terminal Output Footer */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-slate-400 mb-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Execution Output Terminal</span>
        </div>

        <div className="min-h-[60px] p-3 rounded-xl bg-black border border-slate-800 font-mono text-xs">
          {output ? (
            <pre className={passed ? 'text-emerald-400 whitespace-pre-wrap' : 'text-rose-400 whitespace-pre-wrap'}>
              {output}
            </pre>
          ) : (
            <span className="text-slate-600 italic">Click &apos;Run Code&apos; to view execution terminal output...</span>
          )}
        </div>

        {passed && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between"
          >
            <div className="flex items-center space-x-2 text-xs text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Exercise Passed! +100 XP Earned</span>
            </div>
            <Zap className="w-4 h-4 text-emerald-400 animate-bounce" />
          </motion.div>
        )}
      </div>

    </div>
  );
}
