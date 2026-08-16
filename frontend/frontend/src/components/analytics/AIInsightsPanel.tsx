'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle, AlertTriangle, ArrowRight, BookOpen, BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import { AIInsightResponse } from '@/lib/api';

interface AIInsightsPanelProps {
  insights: AIInsightResponse;
  lang?: 'en' | 'ar';
}

export default function AIInsightsPanel({ insights, lang = 'en' }: AIInsightsPanelProps) {
  const isAr = lang === 'ar';

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white border border-indigo-500/20 rounded-3xl p-6 shadow-xl space-y-6 relative overflow-hidden">
      {/* Glow shapes */}
      <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className={`relative z-10 flex items-center justify-between ${isAr ? 'flex-row-reverse text-right' : 'text-left'}`}>
        <div>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-400 animate-pulse" />
            {isAr ? 'توصيات وتحليلات الذكاء الاصطناعي' : 'AI-Powered Insights & Mentorship'}
          </h3>
          <p className="text-xs text-indigo-200/80 mt-1">
            {isAr ? 'توجيهات مخصصة بناءً على أدائك الحقيقي في المنصة' : 'Customized guidance generated specifically for your learning profile'}
          </p>
        </div>
      </div>

      {/* Weekly Summary Banner */}
      <div className={`relative z-10 p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 backdrop-blur-sm ${isAr ? 'text-right' : 'text-left'}`}>
        <p className="text-sm leading-relaxed text-indigo-100 font-medium">
          {insights.weekly_summary}
        </p>
      </div>

      {/* Grid Strengths & Improvements */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="space-y-3">
          <h4 className={`text-sm font-extrabold text-emerald-400 flex items-center gap-2 ${isAr ? 'flex-row-reverse text-right' : 'text-left'}`}>
            <CheckCircle size={16} />
            {isAr ? 'نقاط القوة المميزة' : 'Key Strengths'}
          </h4>
          <div className="space-y-2">
            {insights.strengths.map((str, idx) => (
              <div key={idx} className={`p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 leading-relaxed ${isAr ? 'text-right' : 'text-left'}`}>
                • {str}
              </div>
            ))}
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="space-y-3">
          <h4 className={`text-sm font-extrabold text-amber-400 flex items-center gap-2 ${isAr ? 'flex-row-reverse text-right' : 'text-left'}`}>
            <AlertTriangle size={16} />
            {isAr ? 'مجالات للتحسين' : 'Areas for Growth'}
          </h4>
          <div className="space-y-2">
            {insights.improvements.map((imp, idx) => (
              <div key={idx} className={`p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 leading-relaxed ${isAr ? 'text-right' : 'text-left'}`}>
                • {imp}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Next Lessons */}
      <div className="relative z-10 space-y-3 pt-2">
        <h4 className={`text-sm font-extrabold text-indigo-300 flex items-center gap-2 ${isAr ? 'flex-row-reverse text-right' : 'text-left'}`}>
          <BookOpen size={16} />
          {isAr ? 'الدروس المقترحة تالياً' : 'Recommended Next Lessons'}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {insights.recommended_lessons.map((rec, idx) => (
            <Link
              key={idx}
              href={`/courses/${rec.id}`}
              className={`p-3 rounded-xl bg-slate-900/90 hover:bg-indigo-950 border border-indigo-500/20 hover:border-indigo-500/50 transition-all flex flex-col justify-between group ${
                isAr ? 'text-right' : 'text-left'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold text-indigo-400 block mb-1">
                  {rec.course} • {rec.estimated_min} mins
                </span>
                <h5 className="text-xs font-bold text-white leading-snug group-hover:text-indigo-300 transition-colors">
                  {rec.title}
                </h5>
              </div>
              <div className={`mt-3 flex items-center text-[10px] font-bold text-indigo-300 group-hover:translate-x-1 transition-transform ${isAr ? 'flex-row-reverse' : ''}`}>
                <span>{isAr ? 'ابدأ الآن' : 'Start Lesson'}</span>
                <ArrowRight size={12} className={isAr ? 'rotate-180 mr-1' : 'ml-1'} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
