'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Copy, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DonationWidget() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const walletAddress = "TPr9DwPKDeyfukxtbmSLk6Ga6mGrmf7Rbn";

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('eduverse_lang') as 'en' | 'ar' | null;
    if (savedLang) {
      setLang(savedLang);
    }

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
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start font-mono-code select-none text-xs">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className={`w-80 p-5 border border-white/10 bg-black text-white shadow-2xl mb-3 space-y-3 ${
              lang === 'ar' ? 'text-right' : 'text-left'
            }`}
          >
            <div className="flex items-center gap-2 text-rose-400">
              <Heart className="h-4 w-4 fill-current" />
              <h4 className="text-xs font-bold tracking-wide">
                {mounted ? text[lang].support : text.en.support}
              </h4>
            </div>

            <p className="text-[11px] text-[#9a9a9a] font-sans leading-relaxed">
              {mounted ? text[lang].desc : text.en.desc}
            </p>

            <div className="bg-black p-3 border border-white/10 space-y-1 text-center">
              <span className="text-[10px] uppercase font-bold text-[#ffb829] tracking-wider block">
                {mounted ? text[lang].network : text.en.network}
              </span>
              <code className="block text-[10px] font-mono text-white select-all p-1 bg-white/5 border border-white/10 truncate">
                {walletAddress}
              </code>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setIsOpen(false)}
                suppressHydrationWarning
                className="flex-1 py-2 px-3 border border-white/10 hover:border-white/30 text-[10px] font-bold text-[#9a9a9a] transition-colors cursor-pointer"
              >
                {mounted ? text[lang].close : text.en.close}
              </button>

              <button
                onClick={handleCopy}
                suppressHydrationWarning
                className="flex-1 py-2 px-3 bg-[#8052ff] hover:bg-[#6c3cf0] text-white text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? (mounted ? text[lang].copied : text.en.copied) : (mounted ? text[lang].copy : text.en.copy)}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        suppressHydrationWarning
        className="flex items-center gap-2 px-3.5 py-2 border border-white/10 bg-black hover:border-white/30 text-white text-xs font-bold shadow-xl transition-all cursor-pointer"
      >
        <Heart className="h-3.5 w-3.5 text-rose-500 fill-current" />
        <span>Support Us</span>
      </button>
    </div>
  );
}
