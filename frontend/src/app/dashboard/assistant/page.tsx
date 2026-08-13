'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { api, ChatMessage } from '@/lib/api';

const translations = {
  en: {
    title: "AI Personal Tutor",
    subtitle: "Your dedicated assistant for programming concepts, career advice, and debugging.",
    welcome: "Hello! I am your AI Mentor. How can I help you accelerate your learning today?",
    placeholder: "Ask anything about coding, courses, or your career...",
    suggested: "Suggested Prompts",
    prompts: [
      "How do I improve my logic in Python?",
      "Explain pointers in C++ like I'm 5",
      "What should I learn next after HTML/CSS?"
    ]
  },
  ar: {
    title: "المعلم الشخصي الذكي",
    subtitle: "مساعدك المخصص لمفاهيم البرمجة، التوجيه المهني، وتصحيح الأخطاء.",
    welcome: "مرحباً! أنا موجهك الذكي. كيف يمكنني مساعدتك في تسريع تعلمك اليوم؟",
    placeholder: "اسأل أي شيء عن البرمجة، الدورات، أو مسيرتك المهنية...",
    suggested: "مواضيع مقترحة",
    prompts: [
      "كيف أحسن تفكيري المنطقي في بايثون؟",
      "اشرح لي المؤشرات في C++ ببساطة",
      "ماذا يجب أن أتعلم بعد HTML/CSS؟"
    ]
  }
};

export default function AssistantPage() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('eduverse_lang') as 'en' | 'ar' | null;
    if (savedLang) setLang(savedLang);

    const handleLanguageChange = () => {
      const activeLang = localStorage.getItem('eduverse_lang') as 'en' | 'ar' | null;
      if (activeLang) setLang(activeLang);
    };

    window.addEventListener('eduverse_language_change', handleLanguageChange);
    return () => window.removeEventListener('eduverse_language_change', handleLanguageChange);
  }, []);

  const t = translations[lang];
  const isAr = lang === 'ar';

  useEffect(() => {
    // Initial welcome message
    if (messages.length === 0) {
      setMessages([{ role: 'assistant', content: t.welcome }]);
    }
  }, [lang, messages.length, t.welcome]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;
    
    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // For dashboard, we use a general prompt. Assuming lessonId=0 for general context
      const response = await api.sendChatMessage(text, 0, messages);
      const assistantMsg: ChatMessage = { role: 'assistant', content: response.reply };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: isAr ? 'عذراً، حدث خطأ أثناء الاتصال. يرجى المحاولة مرة أخرى.' : 'Sorry, an error occurred. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 max-w-5xl mx-auto w-full">
      <div className={`mb-6 flex flex-col ${isAr ? 'items-end text-right' : 'items-start text-left'}`}>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          <Bot className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          {t.title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">{t.subtitle}</p>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
        
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? (isAr ? 'justify-start' : 'justify-end') : (isAr ? 'justify-end' : 'justify-start')}`}
              >
                <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${msg.role === 'user' ? (isAr ? 'flex-row-reverse' : 'flex-row') : (isAr ? 'flex-row-reverse' : 'flex-row')}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1 ${
                    msg.role === 'assistant' 
                      ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' 
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`p-4 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-sm'
                      : 'bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-100 dark:border-slate-800'
                  } ${isAr ? 'text-right' : 'text-left'}`}>
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex ${isAr ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] gap-3 ${isAr ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 flex items-center justify-center mt-1">
                  <Bot size={16} />
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                  <span className="text-sm text-slate-500">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts (only if no messages or just welcome) */}
        {messages.length <= 1 && (
          <div className="px-6 pb-4">
            <p className={`text-xs font-bold text-slate-400 mb-3 ${isAr ? 'text-right' : 'text-left'}`}>{t.suggested}</p>
            <div className={`flex flex-wrap gap-2 ${isAr ? 'justify-end' : 'justify-start'}`}>
              {t.prompts.map((prompt, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="text-xs bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800/60 dark:hover:bg-indigo-900/30 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className={`flex items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-2xl border ${
              isLoading ? 'border-slate-200 dark:border-slate-700 opacity-70' : 'border-indigo-200 dark:border-indigo-800 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500'
            } ${isAr ? 'flex-row-reverse' : ''}`}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              disabled={isLoading}
              className={`flex-1 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white px-3 py-2 text-sm ${isAr ? 'text-right' : 'text-left'}`}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl p-3 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} className={isAr ? 'rotate-180' : ''} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
