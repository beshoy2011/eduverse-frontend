'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Copy, Check, Sparkles, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DonationWidget() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const walletAddress = "TPr9DwPKDeyfukxtbmSLk6Ga6mGrmf7Rbn";

  useEffect(() => {
    // Read initial language
    const savedLang = localStorage.getItem('eduverse_lang') as 'en' | 'ar' | null;
    if (savedLang) {
      setLang(savedLang);
    }

    // Listener for global language toggle
    const handleLanguageChange = () => {
      const activeLang = localStorage.getItem('eduverse_lang') as 'en' | 'ar' | null;
      if (activeLang) {
        setLang(activeLang);
      }
    };

    window.addEventListener('eduverse_language_change', handleLanguageChange);
    return () => {
      window.removeEventListener('eduverse_language_change', handleLanguageChange);
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const text = {
    en: {
      support: "Support EduVerse",
      desc: "EduVerse is 100% free with no ads. Support us to pay for servers and keep code learning free for everyone!",
      network: "Network: USDT (Binance TRX / TRC-20)",
      copy: "Copy Address",
      copied: "Copied!",
      close: "Close"
    },
    ar: {
      support: "دعم وتبرع للمنصة ❤️",
      desc: "منصة EduVerse مجانية بالكامل وبدون إعلانات. تبرعك يساعدنا في دفع تكاليف السيرفرات واستمرار نشر العلم مجاناً للجميع!",
      network: "الشبكة: USDT (Binance TRX / TRC-20)",
      copy: "نسخ عنوان المحفظة",
      copied: "تم النسخ بنجاح! 🚀",
      close: "إغلاق"
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start font-sans select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", duration: 0.35 }}
            className={`w-80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-2xl glass mb-3 space-y-3 ${
              lang === 'ar' ? 'text-right' : 'text-left'
            }`}
          >
            <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400">
              <Heart className="h-5 w-5 fill-current animate-pulse" />
              <h4 className="text-sm font-black tracking-wide">
                {text[lang].support}
              </h4>
            </div>

            <p className={`text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed ${
              lang === 'ar' ? 'direction-rtl' : ''
            }`}>
              {text[lang].desc}
            </p>

            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-850 space-y-1.5 text-center">
              <span className="text-[9px] uppercase font-extrabold text-amber-500 tracking-wider">
                {text[lang].network}
              </span>
              <code className="block text-[10px] font-mono text-slate-800 dark:text-slate-200 select-all p-1 bg-slate-200/50 dark:bg-slate-900 rounded truncate">
                {walletAddress}
              </code>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-[10px] font-bold text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
              >
                {text[lang].close}
              </button>
              <button
                onClick={handleCopy}
                className="flex-[2] flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold shadow-md shadow-rose-500/10 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    {text[lang].copied}
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    {text[lang].copy}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-4 py-2.5 text-[11px] font-extrabold text-white shadow-lg shadow-rose-500/25 hover:from-rose-650 hover:to-pink-650 cursor-pointer"
      >
        <Heart className="h-3.5 w-3.5 fill-current" />
        {lang === 'ar' ? 'ادعم المنصة ❤️' : 'Support Us ❤️'}
      </motion.button>
    </div>
  );
}
