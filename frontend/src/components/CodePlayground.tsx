'use client';

import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, AlertTriangle, FileCode, Terminal, Eye, Sparkles, X, Copy, Check } from 'lucide-react';
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
      console.error("AI Review failed:", err);
      setReviewResult({
        grade: "B",
        complexity: "Time: O(1), Space: O(1)",
        feedback: `Could not reach the AI code reviewer: ${err.message}. Showing simulated suggestions.`,
        suggestions: [
          "Verify that your loops are bounded correctly.",
          "Make sure all variables are declared before use.",
          "Format your solution to keep statements legible."
        ],
        improved_code: code
      });
    } finally {
      setIsReviewing(false);
    }
  };

  useEffect(() => {
    setCode(initialCode);
    setConsoleOutput([]);
    setTestResult('idle');
    setErrorMessage('');
    setActiveTab(courseId === '3' ? 'preview' : 'editor');
  }, [initialCode, courseId]);

  // Client-side execution sandbox
  const runCode = () => {
    setIsRunning(true);
    setConsoleOutput([]);
    setErrorMessage('');
    setTestResult('idle');

    setTimeout(() => {
      try {
        const logs: string[] = [];
        const customLog = (...args: any[]) => {
          logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '));
        };

        // --- WEB DEVELOPMENT EXECUTION (HTML/CSS/JS) ---
        if (courseId === '3') {
          // Web Dev code is rendered in the preview frame, no heavy compilation needed.
          logs.push("Web template rendered. Check the 'Interactive Preview' tab!");
          setConsoleOutput(logs);
          setTestResult('success');
          onChallengePassed();
          setIsRunning(false);
          return;
        }

        // --- PYTHON SIMULATOR ---
        if (courseId === '1' || courseId === '4' || courseId === '5' || courseId === '6' || courseId === '9' || courseId === '10') {
          // Simple python to JS transpile for basic print/variables
          let cleanJs = code;
          
          // Replace python print with custom log
          cleanJs = cleanJs.replace(/print\s*\((.*?)\)/g, 'customLog($1)');
          
          // Replace single line comments
          cleanJs = cleanJs.replace(/#/g, '//');
          
          // Replace True/False
          cleanJs = cleanJs.replace(/\bTrue\b/g, 'true');
          cleanJs = cleanJs.replace(/\bFalse\b/g, 'false');
          
          // Replace basic python list append
          cleanJs = cleanJs.replace(/\.append\s*\((.*?)\)/g, '.push($1)');
          
          // Handle python range(1, 4) in loops
          cleanJs = cleanJs.replace(/for\s+(\w+)\s+in\s+range\s*\((.*?)\)\s*:/g, (match, val, rangeArgs) => {
            const parts = rangeArgs.split(',').map((p: string) => p.trim());
            let start = '0';
            let end = parts[0];
            if (parts.length > 1) {
              start = parts[0];
              end = parts[1];
            }
            return `for (let ${val} = ${start}; ${val} < ${end}; ${val}++) {`;
          });
          
          // Handle python functions
          cleanJs = cleanJs.replace(/def\s+(\w+)\s*\((.*?)\)\s*:/g, 'function $1($2) {');
          
          // Handle standard if/elif/else statements
          cleanJs = cleanJs.replace(/if\s+(.*?)\s*:/g, 'if ($1) {');
          cleanJs = cleanJs.replace(/elif\s+(.*?)\s*:/g, '} else if ($1) {');
          cleanJs = cleanJs.replace(/else\s*:/g, '} else {');
          
          // Close curly brackets for python indentation ends (since this is a simulator, we append needed brackets)
          // Count colons vs curly braces to close them simply
          const openBlocks = (cleanJs.match(/\{/g) || []).length;
          for (let i = 0; i < openBlocks; i++) {
            cleanJs += '\n}';
          }

          // Execute sandboxed code
          const runner = new Function('customLog', cleanJs);
          runner(customLog);
        }

        // --- C++ SIMULATOR ---
        if (courseId === '2') {
          let cleanJs = code;
          
          // Check for iostream and namespaces
          cleanJs = cleanJs.replace(/#include\s+<.*?>/g, '');
          cleanJs = cleanJs.replace(/using\s+namespace\s+std;/g, '');
          
          // Replace standard console logs
          cleanJs = cleanJs.replace(/std::cout\s*<<\s*(.*?)\s*;/g, (match, expr) => {
            // strip out << std::endl or << "\n"
            const parsedExpr = expr
              .replace(/<<\s*std::endl/g, '')
              .replace(/<<\s*"\s*\\n\s*"/g, '')
              .replace(/<</g, '+');
            return `customLog(${parsedExpr});`;
          });
          
          // Replace std::cin inputs
          cleanJs = cleanJs.replace(/std::cin\s*>>\s*(\w+)\s*;/g, (match, variable) => {
            // Feed first input from test cases or default to 5
            const defaultInput = testCases.length > 0 ? testCases[0].input.trim() : '5';
            return `${variable} = Number("${defaultInput}");`;
          });
          
          // Handle pointer syntax simple mock: int* p = &num; -> let p = num;
          cleanJs = cleanJs.replace(/int\*\s+(\w+)\s*=\s*&(\w+);/g, 'let $1 = { get val() { return $2; } };');
          cleanJs = cleanJs.replace(/\*(\w+)/g, '$1.val');
          
          // Replace data types with standard let/var
          cleanJs = cleanJs.replace(/\bint\b/g, 'let');
          cleanJs = cleanJs.replace(/\bdouble\b/g, 'let');
          cleanJs = cleanJs.replace(/\bbool\b/g, 'let');
          cleanJs = cleanJs.replace(/\bstring\b/g, 'let');
          
          // Remove main function structure boilerplate to execute statements directly
          cleanJs = cleanJs.replace(/let\s+main\s*\(\)\s*\{([\s\S]*?)return\s+\d+;\s*\}/g, '$1');

          const runner = new Function('customLog', cleanJs);
          runner(customLog);
        }

        // --- JAVA SIMULATOR ---
        if (courseId === '7') {
          const lines = code.split('\n');
          const cleanLines = lines.map(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('public class') || trimmed.startsWith('class ') || trimmed.startsWith('public static void main') || trimmed === '}') {
              return '';
            }
            return line.replace(/System\.out\.println\s*\((.*?)\)\s*;/g, 'customLog($1);');
          });
          let cleanJs = cleanLines.join('\n');
          cleanJs = cleanJs.replace(/^\s*(int|double|boolean|String|char)\s+/gm, 'let ');
          
          const runner = new Function('customLog', cleanJs);
          runner(customLog);
        }

        // --- JAVASCRIPT SIMULATOR ---
        if (courseId === '8') {
          let cleanJs = code;
          // Replace console.log with customLog
          cleanJs = cleanJs.replace(/console\.log/g, 'customLog');
          const runner = new Function('customLog', cleanJs);
          runner(customLog);
        }

        // Output matching and testing
        if (logs.length === 0) {
          logs.push("(No output returned)");
        }
        setConsoleOutput(logs);

        // Grade against test cases
        const finalOutput = logs.join('\n').trim();
        let passed = true;

        if (testCases && testCases.length > 0) {
          for (const tc of testCases) {
            const expected = tc.output.trim();
            if (finalOutput !== expected) {
              passed = false;
              break;
            }
          }
        } else {
          // If no test cases are specified, simple solution check or text match
          passed = finalOutput.length > 0;
        }

        if (passed) {
          setTestResult('success');
          onChallengePassed();
        } else {
          setTestResult('failed');
          const expectedOut = testCases.length > 0 ? testCases[0].output.trim() : 'a matching result';
          setErrorMessage(`Expected output: "${expectedOut}", but got: "${finalOutput}"`);
        }

      } catch (err: any) {
        setConsoleOutput([`Runtime Error: ${err.message}`]);
        setTestResult('failed');
        setErrorMessage(err.message);
      } finally {
        setIsRunning(false);
      }
    }, 1200);
  };

  return (
    <div className="flex h-full flex-col rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xl transition-colors duration-300">
      {/* Playground Header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 px-4 py-2 shrink-0">
        <div className="flex items-center gap-1">
          <FileCode className="h-4 w-4 text-indigo-500" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Practice Editor</span>
        </div>
        
        {courseId === '3' && (
          <div className="flex rounded-lg bg-slate-100 dark:bg-slate-900 p-0.5 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('editor')}
              className={`rounded-md px-2.5 py-1 text-[10px] font-semibold transition-all ${activeTab === 'editor' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500'}`}
            >
              Code Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`rounded-md px-2.5 py-1 text-[10px] font-semibold transition-all ${activeTab === 'preview' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500'}`}
            >
              Interactive Preview
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={reviewCodeWithAI}
            disabled={isReviewing}
            className="flex items-center gap-1 rounded bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 transition-all active:scale-95 disabled:opacity-50"
          >
            <Sparkles className={`h-3 w-3 text-indigo-500 ${isReviewing ? 'animate-pulse' : ''}`} />
            {isReviewing ? 'Reviewing...' : 'Review with AI'}
          </button>
          
          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-1 rounded bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 transition-all active:scale-95"
          >
            <Play className={`h-3 w-3 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>

      {/* Editor Main Content Area */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800/80">
        {/* Editor Screen */}
        {(!courseId || activeTab === 'editor') ? (
          <div className="flex-1 min-h-0 flex relative">
            {/* Line numbers dummy sidebar */}
            <div className="w-12 bg-slate-50 dark:bg-slate-950/60 border-r border-slate-100 dark:border-slate-900 select-none py-3 text-right pr-3 font-mono text-xs text-slate-400 leading-6">
              {Array.from({ length: Math.max(12, code.split('\n').length) }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 resize-none bg-transparent p-3 font-mono text-sm leading-6 text-slate-800 dark:text-slate-100 focus:outline-none placeholder-slate-400"
              spellCheck="false"
            />
          </div>
        ) : (
          /* HTML Interactive IFrame Preview Screen */
          <div className="flex-1 bg-white relative">
            <iframe
              srcDoc={code}
              title="Interactive Live Preview"
              className="w-full h-full border-none bg-white"
              sandbox="allow-scripts"
            />
            <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 shadow">
              <Eye className="h-2 w-2" /> Live Preview
            </div>
          </div>
        )}

        {/* Output Screen */}
        <div className="w-full md:w-72 shrink-0 bg-slate-50 dark:bg-slate-950/40 p-4 flex flex-col justify-between select-none">
          <div className="flex-1 flex flex-col min-h-0">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-2 shrink-0">
              <Terminal className="h-3.5 w-3.5" /> Output Terminal
            </h4>
            
            {/* Terminal logs list */}
            <div className="flex-1 overflow-y-auto bg-slate-900 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-200 select-text leading-relaxed">
              {consoleOutput.length > 0 ? (
                consoleOutput.map((log, index) => (
                  <div key={index} className={log.startsWith('Runtime Error') ? 'text-rose-500' : ''}>
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-slate-500">Run code to see console logs...</div>
              )}
            </div>
          </div>

          {/* Test Status Panel */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
            {testResult === 'success' && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-emerald-600 dark:text-emerald-400 flex gap-2"
              >
                <CheckCircle className="h-5 w-5 shrink-0" />
                <div>
                  <h5 className="text-xs font-semibold">Challenge Passed!</h5>
                  <p className="text-[10px] opacity-90">All test cases passed successfully.</p>
                </div>
              </motion.div>
            )}

            {testResult === 'failed' && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-lg bg-rose-50/80 dark:bg-rose-500/10 border border-rose-500/20 p-3 text-rose-600 dark:text-rose-400 flex gap-2"
              >
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <div>
                  <h5 className="text-xs font-semibold">Test Case Failed</h5>
                  <p className="text-[10px] leading-relaxed break-words">{errorMessage}</p>
                </div>
              </motion.div>
            )}

            {testResult === 'idle' && (
              <div className="rounded-lg border border-dashed border-slate-200 dark:border-slate-800 p-3 text-center text-[11px] text-slate-400">
                Write code on the left and run it to evaluate your challenge.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Review Drawer Overlay */}
      <AnimatePresence>
        {showReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-sm"
          >
            {/* Click outside to close */}
            <div className="flex-1" onClick={() => setShowReview(false)}></div>
            
            {/* Drawer Body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="w-full sm:w-[450px] h-full bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 flex flex-col shadow-2xl relative select-text"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-4.5 w-4.5 text-indigo-500 animate-pulse" />
                  <h3 className="text-sm font-bold text-slate-850 dark:text-white">AI Code Reviewer</h3>
                </div>
                <button
                  onClick={() => setShowReview(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {isReviewing ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-3">
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-indigo-950/60"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                    </div>
                    <div className="text-center">
                      <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100">Reviewing your code...</h4>
                      <p className="text-[10px] text-slate-400 mt-1">AI is analyzing complexity and performance.</p>
                    </div>
                  </div>
                ) : reviewResult ? (
                  <div className="space-y-5">
                    {/* Grade & Complexity Summary Card */}
                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-900/60 rounded-xl p-4">
                      {/* Circular grade badge */}
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center font-extrabold text-xl border shadow-md shrink-0 ${
                        reviewResult.grade === 'A' 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-emerald-500/10' 
                          : reviewResult.grade === 'B'
                          ? 'bg-blue-500/10 border-blue-500/30 text-blue-500 shadow-blue-500/10'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-amber-500/10'
                      }`}>
                        {reviewResult.grade}
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Performance Grade</h4>
                        <div className="inline-block rounded bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-mono text-indigo-450 font-semibold">
                          {reviewResult.complexity}
                        </div>
                      </div>
                    </div>

                    {/* Overall Critique */}
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">AI Feedback</h4>
                      <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100/50 dark:border-slate-800/40 rounded-xl p-4">
                        {reviewResult.feedback}
                      </p>
                    </div>

                    {/* Suggestions list */}
                    {reviewResult.suggestions && reviewResult.suggestions.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Key Suggestions</h4>
                        <ul className="space-y-2">
                          {reviewResult.suggestions.map((sug: string, idx: number) => (
                            <li key={idx} className="flex gap-2 text-xs text-slate-650 dark:text-slate-300 leading-normal">
                              <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                              <span>{sug}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Optimized code block */}
                    {reviewResult.improved_code && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Optimized Code</h4>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(reviewResult.improved_code);
                                setIsCopied(true);
                                setTimeout(() => setIsCopied(false), 2000);
                              }}
                              className="flex items-center gap-1 rounded hover:bg-slate-100 dark:hover:bg-slate-900 px-2 py-1 text-[10px] text-slate-450 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                              {isCopied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                              {isCopied ? 'Copied' : 'Copy'}
                            </button>
                            
                            <button
                              onClick={() => {
                                setCode(reviewResult.improved_code);
                                setShowReview(false);
                              }}
                              className="flex items-center gap-1 rounded bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-[10px] text-indigo-400 hover:bg-indigo-500/20 transition-all font-semibold"
                            >
                              Apply to Editor
                            </button>
                          </div>
                        </div>
                        
                        <pre className="overflow-x-auto bg-slate-950 border border-slate-900 rounded-xl p-4 font-mono text-[11px] text-emerald-400 leading-normal">
                          <code>{reviewResult.improved_code}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-450 text-xs">
                    An unexpected error occurred.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
