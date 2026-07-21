'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, HelpCircle, Lightbulb, RefreshCw } from 'lucide-react';
import { api, ChatMessage } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const chatTranslations = {
  en: {
    welcome: "Hello! I am your EduVerse AI Tutor. I can help explain this lesson, give hints on the coding practice, or create a quiz. What would you like to do?",
    error: "Error speaking to tutor:",
    thinking: "Tutor is thinking",
    placeholder: "Ask your tutor a question...",
    headerTitle: "AI Personal Tutor",
    headerSub: "Available 24/7 • Custom Mentoring",
    explainBtn: "Explain Concept",
    hintBtn: "Get Hint",
    quizBtn: "Quiz Me",
    explainPrompt: "Could you explain the core concepts of this lesson in simple terms with an analogy?",
    hintPrompt: "I'm working on the coding practice. Could you give me a small hint without giving away the exact solution?",
    quizPrompt: "Test my understanding! Can you ask me a quick single multiple-choice question about this lesson?"
  },
  ar: {
    welcome: "مرحباً! أنا معلمك الشخصي الذكي في EduVerse. يمكنني مساعدتك في شرح هذا الدرس، أو إعطائك تلميحات للتطبيقات البرمجية، أو إنشاء اختبار قصير. ماذا ترغب في أن نفعل؟",
    error: "خطأ في الاتصال بالمعلم الذكي:",
    thinking: "المعلم يفكر",
    placeholder: "اسأل معلمك الذكي سؤالاً...",
    headerTitle: "المعلم الشخصي الذكي",
    headerSub: "متاح 24/7 • توجيه مخصص",
    explainBtn: "شرح المفهوم",
    hintBtn: "الحصول على تلميحة",
    quizBtn: "اختبرني",
    explainPrompt: "هل يمكنك شرح المفاهيم الأساسية لهذا الدرس بتبسيط رائع وتشبيه من الواقع؟",
    hintPrompt: "أنا أعمل على التطبيق العملي. هل يمكنك إعطائي تلميحة صغيرة دون إعطائي الحل الكامل مباشرة؟",
    quizPrompt: "اختبر فهمي! هل يمكنك سؤالي سؤالاً سريعاً اختيارياً (multiple-choice) حول هذا الدرس؟"
  }
};

interface ChatPanelProps {
  lessonId: number;
}

export default function ChatPanel({ lessonId }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync language with local storage and global toggle events
  useEffect(() => {
    const savedLang = localStorage.getItem('eduverse_lang') as 'en' | 'ar' | null;
    const currentLang = savedLang || 'en';
    setLang(currentLang);

    const handleLanguageChange = () => {
      const activeLang = localStorage.getItem('eduverse_lang') as 'en' | 'ar' | null;
      if (activeLang) {
        setLang(activeLang);
        setMessages(prev => {
          if (prev.length === 1 && (prev[0].content === chatTranslations.en.welcome || prev[0].content === chatTranslations.ar.welcome)) {
            return [{ role: 'assistant', content: chatTranslations[activeLang].welcome }];
          }
          return prev;
        });
      }
    };

    window.addEventListener('eduverse_language_change', handleLanguageChange);
    return () => {
      window.removeEventListener('eduverse_language_change', handleLanguageChange);
    };
  }, []);

  // Load chat history on mount/lesson change
  useEffect(() => {
    async function loadHistory() {
      try {
        const history = await api.getChatHistory(lessonId);
        if (history.length === 0) {
          const savedLang = localStorage.getItem('eduverse_lang') as 'en' | 'ar' | null;
          const currentLang = savedLang || 'en';
          // Add default welcome message
          setMessages([
            {
              role: 'assistant',
              content: chatTranslations[currentLang].welcome
            }
          ]);
        } else {
          setMessages(history);
        }
      } catch (err) {
        console.error('Failed to load chat history', err);
      }
    }
    loadHistory();
  }, [lessonId]);

  // Scroll to bottom when messages list updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Send message to API along with current history
      const response = await api.sendChatMessage(textToSend, lessonId, messages);
      setMessages(prev => [...prev, { role: 'assistant', content: response.reply }]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `${chatTranslations[lang].error} ${err.message || 'Server offline'}.` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const triggerPreset = (preset: string) => {
    const t = chatTranslations[lang];
    let prompt = '';
    if (preset === 'explain') {
      prompt = t.explainPrompt;
    } else if (preset === 'hint') {
      prompt = t.hintPrompt;
    } else if (preset === 'quiz') {
      prompt = t.quizPrompt;
    }
    handleSend(prompt);
  };

  // Helper to render message content with basic Markdown formatting
  const renderMessageContent = (content: string) => {
    // Basic regex parsers for formatting
    const parts = content.split(/(```[a-z]*\n[\s\S]*?\n```|`[^`]+`|\*\*[^*]+\*\*)/g);

    return parts.map((part, index) => {
      // Code Blocks
      if (part.startsWith('```')) {
        const lines = part.split('\n');
        const code = lines.slice(1, -1).join('\n');
        const langCode = part.match(/```([a-z]*)/)?.[1] || 'code';
        return (
          <div key={index} className="my-3 overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-md text-left">
            <div className="flex items-center justify-between bg-slate-800 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span>{langCode}</span>
            </div>
            <pre className="overflow-x-auto p-3 text-xs font-mono text-slate-100 leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      
      // Inline Code
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="rounded bg-slate-200/80 dark:bg-slate-800 px-1 py-0.5 font-mono text-xs font-semibold text-indigo-650 dark:text-indigo-400">
            {part.slice(1, -1)}
          </code>
        );
      }

      // Bold Text
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }

      return <span key={index} className="whitespace-pre-line leading-relaxed">{part}</span>;
    });
  };

  const t = chatTranslations[lang];

  return (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-slate-950 border-l border-slate-200/50 dark:border-slate-900 transition-colors duration-300">
      {/* Header */}
      <div className={`flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-900 px-4 py-3.5 bg-white/70 dark:bg-slate-900/60 backdrop-blur ${
        lang === 'ar' ? 'flex-row-reverse text-right' : 'text-left'
      }`}>
        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 shadow-inner">
          <Bot className="h-5 w-5" />
          <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
        </div>
        <div>
          <h3 className={`text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1 ${
            lang === 'ar' ? 'justify-end' : ''
          }`}>
            {lang === 'en' && <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" />}
            {t.headerTitle}
            {lang === 'ar' && <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" />}
          </h3>
          <p className="text-[10px] font-bold text-slate-455 dark:text-slate-400">{t.headerSub}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} ${
                lang === 'ar' ? 'flex-row-reverse' : ''
              }`}
            >
              {msg.role !== 'user' && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              
              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-br-none shadow-md font-medium'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800/80 rounded-bl-none shadow-sm'
                } ${lang === 'ar' ? 'text-right' : 'text-left'}`}
              >
                {renderMessageContent(msg.content)}
              </div>

              {msg.role === 'user' && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm">
                  <User className="h-4 w-4" />
                </div>
              )}
            </motion.div>
          ))}
          
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex gap-2.5 justify-start ${lang === 'ar' ? 'flex-row-reverse' : ''}`}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm animate-spin">
                <RefreshCw className="h-4 w-4" />
              </div>
              <div className="max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800/60 rounded-bl-none flex items-center gap-2">
                <span>{t.thinking}</span>
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Preset Prompt Actions */}
      <div className={`px-4 py-2.5 border-t border-slate-200/60 dark:border-slate-900 bg-white/50 dark:bg-slate-900/50 flex gap-2 overflow-x-auto scrollbar-none shrink-0 ${
        lang === 'ar' ? 'flex-row-reverse' : ''
      }`}>
        <button
          onClick={() => triggerPreset('explain')}
          className="flex items-center gap-1.5 shrink-0 rounded-full border border-slate-200 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 px-3 py-1.5 text-xs font-bold text-slate-650 dark:text-slate-400 hover:border-indigo-500 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all hover:scale-102 cursor-pointer"
        >
          <HelpCircle className="h-3 w-3" />
          {t.explainBtn}
        </button>
        <button
          onClick={() => triggerPreset('hint')}
          className="flex items-center gap-1.5 shrink-0 rounded-full border border-slate-200 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 px-3 py-1.5 text-xs font-bold text-slate-650 dark:text-slate-400 hover:border-indigo-500 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all hover:scale-102 cursor-pointer"
        >
          <Lightbulb className="h-3 w-3 text-amber-500" />
          {t.hintBtn}
        </button>
        <button
          onClick={() => triggerPreset('quiz')}
          className="flex items-center gap-1.5 shrink-0 rounded-full border border-slate-200 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 px-3 py-1.5 text-xs font-bold text-slate-650 dark:text-slate-400 hover:border-indigo-500 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all hover:scale-102 cursor-pointer"
        >
          <Sparkles className="h-3 w-3 text-indigo-500" />
          {t.quizBtn}
        </button>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
        className="border-t border-slate-200/60 dark:border-slate-900 p-3 bg-white dark:bg-slate-900 shrink-0"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder={t.placeholder}
            className={`w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 py-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all shadow-inner ${
              lang === 'ar' ? 'text-right pr-4 pl-12' : 'text-left pl-4 pr-12'
            }`}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className={`absolute top-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-850 disabled:text-slate-400 dark:disabled:text-slate-600 transition-all hover:scale-[1.02] cursor-pointer ${
              lang === 'ar' ? 'left-1.5' : 'right-1.5'
            }`}
          >
            <Send className={`h-4 w-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </form>
    </div>
  );
}
