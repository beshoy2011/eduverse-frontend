'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

export default function LearningProgressWidget({ lang = 'en' }: { lang?: 'en' | 'ar' }) {
  const isAr = lang === 'ar';
  
  const stats = [
    { label: isAr ? 'الساعات المنجزة' : 'Hours Completed', value: '12.5', target: '20' },
    { label: isAr ? 'الدروس المكتملة' : 'Lessons Finished', value: '24', target: '50' },
    { label: isAr ? 'متوسط الدقة' : 'Average Accuracy', value: '92%', target: '100%' },
  ];

  return (
    <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <h3 className={`text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mb-6 ${isAr ? 'flex-row-reverse' : ''}`}>
        <Target className="h-5 w-5 text-indigo-500" />
        {isAr ? 'التقدم الأسبوعي' : 'Weekly Progress'}
      </h3>

      <div className="space-y-5">
        {stats.map((stat, index) => {
          const percent = stat.value.includes('%') 
            ? parseInt(stat.value) 
            : (parseFloat(stat.value) / parseFloat(stat.target)) * 100;
            
          return (
            <div key={index}>
              <div className={`flex justify-between items-center text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ${isAr ? 'flex-row-reverse' : ''}`}>
                <span>{stat.label}</span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  {stat.value} <span className="text-slate-400 text-xs font-medium">/ {stat.target}</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full shadow-sm" 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
