'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Award, CheckCircle2 } from 'lucide-react';
import { SubjectStat } from '@/lib/api';

interface SubjectComparisonProps {
  subjects: SubjectStat[];
  lang?: 'en' | 'ar';
}

export default function SubjectComparison({ subjects, lang = 'en' }: SubjectComparisonProps) {
  const isAr = lang === 'ar';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
      <div className={`flex items-center justify-between ${isAr ? 'flex-row-reverse text-right' : 'text-left'}`}>
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-500" />
            {isAr ? 'مقارنة الدورات والمواضيع' : 'Subject & Course Breakdown'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isAr ? 'نسبة الإنجاز ومتوسط الدرجات لكل دورة' : 'Track your progress and score accuracy across subjects'}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {subjects.map((sub, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-100/60 dark:hover:bg-slate-850/60 transition-colors ${
              isAr ? 'text-right' : 'text-left'
            }`}
          >
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 ${isAr ? 'sm:flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isAr ? 'flex-row-reverse' : ''}`}>
                <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black shrink-0">
                  {sub.subject.charAt(0)}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight">
                    {sub.subject}
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {sub.completed_lessons} / {sub.total_lessons} {isAr ? 'دروس مكتملة' : 'lessons completed'}
                  </span>
                </div>
              </div>

              <div className={`flex items-center gap-4 ${isAr ? 'flex-row-reverse' : ''}`}>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50">
                  <CheckCircle2 size={12} /> {sub.score_avg}% {isAr ? 'دقة' : 'Accuracy'}
                </span>
                <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                  {sub.progress_percent}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${sub.progress_percent}%` }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="h-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 shadow-sm"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
