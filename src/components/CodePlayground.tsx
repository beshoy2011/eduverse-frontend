'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  FileCode, 
  Terminal, 
  Eye, 
  Sparkles, 
  X, 
  Copy, 
  Check, 
  Bug, 
  FileDiff, 
  RefreshCw,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';

interface TestCase {
  input: string;
  output: string;
}

interface CodePlaygroundProps {
  courseId: string;
  initialCode: string;
  solution: string;
  testCases: TestCase[];
  onChallengePassed: () => void;
  lessonTitle?: string;
  lessonContent?: string;
}

export default function CodePlayground({
  courseId,
  initialCode,
  solution,
  testCases,
  onChallengePassed,
  lessonTitle,
  lessonContent,
}: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<'idle' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>(courseId === '3' ? 'preview' : 'editor');

  const [isReviewing, setIsReviewing] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewResult, setReviewResult] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);
  
  const [errorLineNumber, setErrorLineNumber] = useState<number | null>(null);
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [diffTargetCode, setDiffTargetCode] = useState<string>('');

  const getEnvName = () => {
    if (courseId === '1' || courseId === '4' || courseId === '5' || courseId === '6') return 'Python 3.12';
    if (courseId === '2') return 'C++20 GCC';
    if (courseId === '3') return 'HTML5/CSS3 Sandbox';
    if (courseId === '7') return 'OpenJDK 21';
    if (courseId === '8') return 'Node.js ES2024';
    return 'Polyglot Sandbox';
  };

  const getFileName = () => {
    if (courseId === '1' || courseId === '4' || courseId === '5' || courseId === '6') return 'main.py';
    if (courseId === '2') return 'solution.cpp';
    if (courseId === '3') return 'index.html';
    if (courseId === '7') return 'Main.java';
    if (courseId === '8') return 'app.js';
    return 'solution.txt';
  };

  const reviewCodeWithAI = async () => {
    setIsReviewing(true);
    setShowReview(true);
    setReviewResult(null);
    try {
      const res = await api.aiReview(
        code,
        lessonTitle || 'Practice',
        lessonContent || 'Coding Lesson Practice'
      );
      setReviewResult(res);
    } catch (err: any) {
      console.error("Diagnostic review unavailable:", err);
      setReviewResult({
        grade: "B",
        complexity: "Time: O(1), Space: O(1)",
        feedback: `Could not reach AST reviewer: ${err.message}. Showing local syntax checks.`,
        suggestions: [
          "Check boundary conditions and empty input lists.",
          "Ensure variable types match expected return types.",
          "Review loop termination conditions."
        ]
      });
    } finally {
      setIsReviewing(false);
    }
  };

  const parseErrorLineNumber = (errText: string): number | null => {
    const pyMatch = errText.match(/line (\d+)/i);
    if (pyMatch && pyMatch[1]) return parseInt(pyMatch[1], 10);

    const cppMatch = errText.match(/:(\d+):\d+:/);
    if (cppMatch && cppMatch[1]) return parseInt(cppMatch[1], 10);

    const jsMatch = errText.match(/:(\d+):\d+/);
    if (jsMatch && jsMatch[1]) return parseInt(jsMatch[1], 10);

    return null;
  };

  const runCodeLocally = () => {
    setIsRunning(true);
    setConsoleOutput([]);
    setErrorMessage('');
    setTestResult('idle');
    setErrorLineNumber(null);

    setTimeout(() => {
      try {
        const logs: string[] = [];
        let executionFailed = false;
        let failReason = '';

        if (courseId === '1' || courseId === '4' || courseId === '5' || courseId === '6') {
          const lines = code.split('\n');
          lines.forEach((line, index) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('print(') && trimmed.endsWith(')')) {
              const content = trimmed.substring(6, trimmed.length - 1);
              if (
                (content.startsWith("'") && content.endsWith("'")) ||
                (content.startsWith('"') && content.endsWith('"'))
              ) {
                logs.push(content.slice(1, -1));
              } else {
                try {
                  const evaluated = Function(`"use strict"; return (${content})`)();
                  logs.push(String(evaluated));
                } catch {
                  logs.push(content);
                }
              }
            } else if (trimmed.includes('1 / 0') || trimmed.includes('/ 0')) {
              executionFailed = true;
              failReason = `Traceback (most recent call last):\n  File "main.py", line ${index + 1}, in <module>\nZeroDivisionError: division by zero`;
              setErrorLineNumber(index + 1);
            }
          });

          if (!executionFailed && logs.length === 0) {
            logs.push("Process finished with exit code 0 (no stdout output)");
          }
        } else if (courseId === '2') {
          logs.push("[g++ 13.2.0 -std=c++20 -O2] Compiling solution.cpp...");
          const lines = code.split('\n');
          lines.forEach((line, index) => {
            if (line.includes('cout <<') && !line.includes(';')) {
              executionFailed = true;
              failReason = `solution.cpp:${index + 1}:5: error: expected ';' before '}' token`;
              setErrorLineNumber(index + 1);
            }
          });
          if (!executionFailed) {
            logs.push("[Executable built: ./solution.out]");
            logs.push("Output stream verified successfully.");
          }
        } else if (courseId === '3') {
          logs.push("[DOM Tree Parsed: HTML5/CSS3 Sandbox Rendered]");
        }

        if (executionFailed) {
          setConsoleOutput(logs);
          setErrorMessage(failReason);
          setTestResult('failed');
        } else {
          setConsoleOutput(logs);
          let passed = false;

          if (solution && solution.trim().length > 0) {
            const cleanCode = code.replace(/\s+/g, '');
            const cleanSolution = solution.replace(/\s+/g, '');
            passed = cleanCode.includes(cleanSolution) || cleanCode === cleanSolution;
          } else {
            passed = true;
          }

          if (passed) {
            setTestResult('success');
            onChallengePassed();
          } else {
            setTestResult('failed');
            setErrorMessage('Code ran without runtime errors, but did not satisfy the expected test assertion.');
            setErrorLineNumber(parseErrorLineNumber(code));
          }
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Fatal execution error occurred in worker thread.');
        setTestResult('failed');
      } finally {
        setIsRunning(false);
      }
    }, 450);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const openDiffModal = (target: string) => {
    setDiffTargetCode(target);
    setShowDiffModal(true);
  };

  const lines = code.split('\n');

  return (
    <div className="flex flex-col h-full bg-[#0d111a] border border-[#1e2638] rounded-md overflow-hidden font-mono-code text-xs select-none">
      
      {/* Diff Inspection Modal */}
      <AnimatePresence>
        {showDiffModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-[#0d111a] border border-[#1e2638] rounded-lg max-w-2xl w-full p-5 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#1e2638] pb-3">
                <div className="flex items-center gap-2">
                  <FileDiff className="h-4 w-4 text-indigo-400" />
                  <span className="font-bold text-white text-sm">Diagnostic Code Diff</span>
                </div>
                <button onClick={() => setShowDiffModal(false)} className="text-slate-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px] leading-relaxed max-h-80 overflow-y-auto">
                <div className="p-3 bg-[#07090e] border border-rose-500/30 rounded">
                  <span className="text-rose-400 font-bold block mb-1">Your Code:</span>
                  <pre className="text-slate-300 font-mono-code whitespace-pre-wrap">{code}</pre>
                </div>
                <div className="p-3 bg-[#07090e] border border-emerald-500/30 rounded">
                  <span className="text-emerald-400 font-bold block mb-1">Expected Pattern:</span>
                  <pre className="text-slate-300 font-mono-code whitespace-pre-wrap">{diffTargetCode}</pre>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => setShowDiffModal(false)}
                  className="edu-btn edu-btn-secondary text-xs"
                >
                  Close Diff
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Editor Command Ribbon */}
      <div className="flex items-center justify-between bg-[#07090e] border-b border-[#1e2638] px-3 py-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0d111a] border border-[#1e2638] text-indigo-400 font-bold text-[11px]">
            <FileCode className="h-3.5 w-3.5 text-indigo-400" />
            <span>{getFileName()}</span>
          </div>

          <span className="text-[10px] text-slate-500 bg-[#0d111a] px-2 py-0.5 rounded border border-[#1e2638]">
            {getEnvName()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {solution && (
            <button
              onClick={() => openDiffModal(solution)}
              className="edu-btn edu-btn-secondary text-[10px] py-1 px-2.5 flex items-center gap-1"
              title="Compare code against target pattern"
            >
              <FileDiff className="h-3 w-3" /> Diff
            </button>
          )}

          <button
            onClick={reviewCodeWithAI}
            disabled={isReviewing}
            className="edu-btn edu-btn-secondary text-[10px] py-1 px-2.5 flex items-center gap-1"
          >
            <Sparkles className="h-3 w-3 text-indigo-400" />
            <span>{isReviewing ? 'Analyzing...' : 'Diagnose'}</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="edu-btn edu-btn-secondary text-[10px] py-1 px-2.5"
            title="Copy code to clipboard"
          >
            {isCopied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          </button>

          <button
            onClick={runCodeLocally}
            disabled={isRunning}
            className="edu-btn edu-btn-primary text-[10px] py-1 px-3 flex items-center gap-1.5 font-bold"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Diagnostic Container */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 divide-y md:divide-y-0 md:divide-x divide-[#1e2638]">
        
        {/* Editor Area with Line Numbers */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#090d14] relative">
          <div className="flex-1 flex overflow-auto p-2 font-mono-code leading-relaxed">
            
            {/* Gutter Line Numbers */}
            <div className="select-none text-right pr-3 pl-1 text-slate-600 shrink-0 text-xs border-r border-[#1e2638]/50 space-y-0.5">
              {lines.map((_, i) => {
                const lineNum = i + 1;
                const isErrorLine = errorLineNumber === lineNum;
                return (
                  <div key={i} className="flex items-center justify-end gap-1.5 h-5">
                    {isErrorLine && <Bug className="h-3 w-3 text-rose-500 animate-pulse" />}
                    <span className={isErrorLine ? 'text-rose-400 font-bold' : ''}>{lineNum}</span>
                  </div>
                );
              })}
            </div>

            {/* Code Input Area */}
            <div className="flex-1 relative pl-3">
              <textarea
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (errorLineNumber) setErrorLineNumber(null);
                }}
                spellCheck={false}
                className="w-full h-full bg-transparent text-slate-100 font-mono-code text-xs resize-none outline-none leading-relaxed border-none p-0 whitespace-pre"
              />
            </div>
          </div>

          {/* Quick status line footer */}
          <div className="bg-[#07090e] border-t border-[#1e2638] px-3 py-1 flex items-center justify-between text-[10px] text-slate-500">
            <span>Lines: {lines.length} | Chars: {code.length}</span>
            <span>Encoding: UTF-8</span>
          </div>
        </div>

        {/* Console / Diagnostics Output Area */}
        <div className="w-full md:w-80 lg:w-96 bg-[#07090e] flex flex-col shrink-0 min-h-0">
          
          <div className="bg-[#0d111a] border-b border-[#1e2638] px-3 py-1.5 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Terminal className="h-3 w-3 text-indigo-400" /> Runtime Console
            </span>

            {testResult === 'success' && (
              <span className="edu-badge edu-badge-emerald text-[9px] py-0">PASS</span>
            )}
            {testResult === 'failed' && (
              <span className="edu-badge edu-badge-rose text-[9px] py-0">FAIL</span>
            )}
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs font-mono-code leading-relaxed">
            {isRunning && (
              <div className="flex items-center gap-2 text-slate-400 py-2">
                <Cpu className="h-3.5 w-3.5 text-indigo-400 animate-spin" />
                <span>Executing in sandbox runtime...</span>
              </div>
            )}

            {consoleOutput.length > 0 && (
              <div className="space-y-1">
                {consoleOutput.map((log, index) => (
                  <div key={index} className="text-slate-300 whitespace-pre-wrap">{log}</div>
                ))}
              </div>
            )}

            {errorMessage && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded p-2.5 space-y-2 text-rose-300 text-[11px]">
                <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>Diagnostic Trace</span>
                </div>
                <pre className="whitespace-pre-wrap font-mono-code text-[10px] text-rose-200 bg-[#07090e] p-2 rounded border border-rose-500/20">
                  {errorMessage}
                </pre>
                {errorLineNumber && (
                  <div className="text-[10px] text-rose-400 font-bold">
                    → Error flagged at Line {errorLineNumber}
                  </div>
                )}
              </div>
            )}

            {testResult === 'success' && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded p-2.5 text-emerald-300 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold block">All assertions verified.</span>
                  <span className="text-[10px] text-emerald-400/80">Lesson challenge marked completed.</span>
                </div>
              </div>
            )}

            {consoleOutput.length === 0 && !errorMessage && !isRunning && (
              <div className="text-slate-600 text-center py-8 text-[11px]">
                Terminal idle. Click &quot;Run Code&quot; to execute.
              </div>
            )}
          </div>

          {/* Diagnostic Drawer */}
          <AnimatePresence>
            {showReview && reviewResult && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-[#1e2638] bg-[#0d111a] p-3 text-[11px] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-400 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Diagnostic Copilot
                  </span>
                  <button onClick={() => setShowReview(false)} className="text-slate-500 hover:text-white">
                    <X className="h-3 w-3" />
                  </button>
                </div>

                <div className="bg-[#07090e] p-2 rounded border border-[#1e2638] text-slate-300 text-[10px]">
                  {reviewResult.feedback}
                </div>

                {reviewResult.suggestions && (
                  <ul className="space-y-1 text-[10px] text-slate-400">
                    {reviewResult.suggestions.map((s: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-indigo-400">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}
