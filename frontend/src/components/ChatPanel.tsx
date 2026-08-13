'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Terminal, Cpu } from 'lucide-react';
import { api, ChatMessage } from '@/lib/api';

const chatTranslations = {
  en: {
    welcome: "SYS: EduVerse Diagnostic Copilot online. Ready to analyze syntax, runtime traces, or lesson concepts.",
    error: "Diagnostic connection error:",
    thinking: "Analyzing AST & stack trace",
    placeholder: "Type a diagnostic prompt or query...",
    headerTitle: "Context Diagnostic Copilot",
    headerSub: "Lesson Context Analyzer",
    explainBtn: "Explain Concept",
    hintBtn: "Get Debug Hint",
    quizBtn: "Quiz Me",
    explainPrompt: "Could you explain the core concepts of this lesson with a concrete developer analogy?",
    hintPrompt: "I'm working on the coding practice. Could you give me a small debugging hint without giving away the solution?",
    quizPrompt: "Test my understanding! Ask me a quick multiple-choice question about this lesson."
  },
  ar: {
    welcome: "النظام: موجه التشخيص البرمجي يعمل الآن. جاهز لتحليل الأكواد وتتبع الأخطاء وشرح المفاهيم.",
    error: "خطأ في الاتصال بموجه التشخيص:",
    thinking: "جاري تحليل الكود والمسار البرمجي",
    placeholder: "اكتب استفسارك البرمجي هنا...",
    headerTitle: "موجه التشخيص البرمجي",
    headerSub: "محلل سياق الدرس البرمجي",
    explainBtn: "شرح المفهوم",
    hintBtn: "تلميحة برمجية",
    quizBtn: "اختبرني",
    explainPrompt: "هل يمكنك شرح المفاهيم الأساسية لهذا الدرس بتبسيط عملي وتشبيه واقعي؟",
    hintPrompt: "أنا أعمل على التطبيق العملي. هل يمكنك إعطائي تلميحة صغيرة دون إعطائي الحل الكامل؟",
    quizPrompt: "اختبر فهمي! هل يمكنك سؤالي سؤالاً اختيارياً سريعاً حول هذا الدرس؟"
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
    return () => window.removeEventListener('eduverse_language_change', handleLanguageChange);
  }, []);

  useEffect(() => {
    async function loadHistory() {
      try {
        const history = await api.getChatHistory(lessonId);
        if (history.length === 0) {
          const savedLang = localStorage.getItem('eduverse_lang') as 'en' | 'ar' | null;
          const currentLang = savedLang || 'en';
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.sendChatMessage(textToSend, lessonId, messages);
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: response.reply,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `${chatTranslations[lang].error} ${err.message || 'Connection timeout.'}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```|`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3).replace(/^[a-z]+\n/, '');
        return (
          <pre key={index} className="bg-[#07090e] border border-[#1e2638] text-cyan-300 p-2 rounded text-[11px] font-mono-code my-1 overflow-x-auto">
            <code>{code}</code>
          </pre>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="bg-[#07090e] text-indigo-300 px-1 py-0.5 rounded text-[10px] font-mono-code border border-[#1e2638]">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-white font-bold">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const t = chatTranslations[lang];

  return (
    <div className="flex flex-col h-full bg-[#0d111a] border-l border-[#1e2638] font-sans select-none">
      
      {/* Copilot Header */}
      <div className="p-3 border-b border-[#1e2638] bg-[#07090e] flex items-center justify-between font-mono-code">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <Terminal className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">{t.headerTitle}</span>
            <span className="text-[10px] text-slate-500">{t.headerSub}</span>
          </div>
        </div>

        <span className="edu-badge edu-badge-indigo text-[9px]">ACTIVE CONTEXT</span>
      </div>

      {/* Suggested Fast Prompts */}
      <div className="p-2 bg-[#090d14] border-b border-[#1e2638] flex flex-wrap gap-1.5 font-mono-code text-[10px]">
        <button
          onClick={() => handleSend(t.explainPrompt)}
          disabled={loading}
          className="edu-btn edu-btn-secondary py-0.5 px-2 text-[10px]"
        >
          {t.explainBtn}
        </button>
        <button
          onClick={() => handleSend(t.hintPrompt)}
          disabled={loading}
          className="edu-btn edu-btn-secondary py-0.5 px-2 text-[10px]"
        >
          {t.hintBtn}
        </button>
        <button
          onClick={() => handleSend(t.quizPrompt)}
          disabled={loading}
          className="edu-btn edu-btn-secondary py-0.5 px-2 text-[10px]"
        >
          {t.quizBtn}
        </button>
      </div>

      {/* Message Flow */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 font-sans text-xs">
        {messages.map((msg, i) => {
          const isAssistant = msg.role === 'assistant';
          return (
            <div
              key={i}
              className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[90%] rounded-md p-3 leading-relaxed text-xs ${
                  isAssistant
                    ? 'bg-[#07090e] border border-[#1e2638] text-slate-200'
                    : 'bg-indigo-600 text-white font-medium'
                }`}
              >
                {renderFormattedText(msg.content)}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-slate-500 font-mono-code text-xs py-2">
            <Cpu className="h-3.5 w-3.5 text-indigo-400 animate-spin" />
            <span>{t.thinking}...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Prompt Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-2 border-t border-[#1e2638] bg-[#07090e] flex gap-2 font-mono-code"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.placeholder}
          disabled={loading}
          className="edu-input text-xs flex-1 py-1.5"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="edu-btn edu-btn-primary px-3 py-1.5"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>

    </div>
  );
}
