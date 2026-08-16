'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Zap, Calendar } from 'lucide-react';
import { DailyActivity } from '@/lib/api';

interface ProgressChartProps {
  data: DailyActivity[];
  lang?: 'en' | 'ar';
}

export default function ProgressChart({ data, lang = 'en' }: ProgressChartProps) {
  const [metric, setMetric] = useState<'hours' | 'xp'>('hours');
  const isAr = lang === 'ar';

  const maxVal = Math.max(...data.map(d => metric === 'hours' ? d.hours : d.xp), 1);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
      {/* Header & Metric Toggle */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 ${isAr ? 'sm:flex-row-reverse text-right' : 'text-left'}`}>
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-indigo-500" />
            {isAr ? 'نشاط التعلم الزمني' : 'Learning Activity & Progress'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isAr ? 'تتبع الوقت المنهي ونقاط الخبرة المكتسبة يومياً' : 'Track your daily study hours and XP gained over time'}
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
          <button
            onClick={() => setMetric('hours')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              metric === 'hours'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock size={14} />
            {isAr ? 'الساعات' : 'Hours'}
          </button>
          <button
            onClick={() => setMetric('xp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              metric === 'xp'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Zap size={14} />
            {isAr ? 'الخبرة XP' : 'XP Gained'}
          </button>
        </div>
      </div>

      {/* Chart Visual */}
      <div className="h-64 flex items-end justify-between gap-2 md:gap-4 pt-6 pb-2 border-b border-slate-100 dark:border-slate-800/80">
        {data.map((item, index) => {
          const val = metric === 'hours' ? item.hours : item.xp;
          const heightPercent = Math.min((val / maxVal) * 100, 100);
          
          return (
            <div key={index} className="flex flex-col items-center flex-1 group relative">
              {/* Tooltip */}
              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-1 bg-slate-900 text-white text-[11px] font-bold py-1.5 px-2.5 rounded-xl shadow-lg border border-slate-700 whitespace-nowrap z-20 pointer-events-none">
                <span className="block text-indigo-300">{item.day} ({item.date_str})</span>
                <span>{metric === 'hours' ? `${item.hours} hrs` : `${item.xp} XP`}</span>
              </div>

              {/* Animated Bar */}
              <div className="w-full flex justify-center h-full items-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(heightPercent, 6)}%` }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className={`w-full max-w-[44px] rounded-t-xl transition-all duration-300 relative overflow-hidden ${
                    metric === 'hours'
                      ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-indigo-500 group-hover:to-indigo-300 shadow-lg shadow-indigo-500/20'
                      : 'bg-gradient-to-t from-amber-500 to-yellow-400 group-hover:from-amber-400 group-hover:to-yellow-300 shadow-lg shadow-amber-500/20'
                  }`}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </div>

              {/* Day Label */}
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-3">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Chart Footer Stats */}
      <div className={`mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium ${isAr ? 'flex-row-reverse' : ''}`}>
        <span className="flex items-center gap-1">
          <Calendar size={14} className="text-indigo-500" />
          {isAr ? 'آخر 7 أيام' : 'Past 7 Days'}
        </span>
        <span className="font-bold text-slate-800 dark:text-slate-200">
          {metric === 'hours'
            ? `${data.reduce((acc, d) => acc + d.hours, 0).toFixed(1)} ${isAr ? 'ساعة إجمالاً' : 'hrs total'}`
            : `${data.reduce((acc, d) => acc + d.xp, 0)} ${isAr ? 'نقطة مكتسبة' : 'XP earned'}`}
        </span>
      </div>
    </div>
  );
}
