'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Star, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { SkillHeatmapItem } from '@/lib/api';

interface SkillHeatmapProps {
  skills: SkillHeatmapItem[];
  lang?: 'en' | 'ar';
}

export default function SkillHeatmap({ skills, lang = 'en' }: SkillHeatmapProps) {
  const isAr = lang === 'ar';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Mastered':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'In Progress':
        return 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30';
      default:
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
      <div className={`flex items-center justify-between ${isAr ? 'flex-row-reverse text-right' : 'text-left'}`}>
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="h-6 w-6 text-indigo-500" />
            {isAr ? 'خريطة المهارات الحرارية' : 'Skill Mastery Heatmap'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isAr ? 'تقييم مستويات إتقانك لكل مفهوم برمجي' : 'Visual matrix of your acquired coding competencies'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className={`p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-indigo-500/30 transition-all flex flex-col justify-between ${
              isAr ? 'text-right' : 'text-left'
            }`}
          >
            <div>
              <div className={`flex items-center justify-between gap-2 mb-2 ${isAr ? 'flex-row-reverse' : ''}`}>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {item.category}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {item.skill}
              </h4>
            </div>

            {/* Level Stars Indicator */}
            <div className={`mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between ${isAr ? 'flex-row-reverse' : ''}`}>
              <span className="text-[11px] font-bold text-slate-500">
                {isAr ? `مستوى ${item.mastery_level}/5` : `Level ${item.mastery_level}/5`}
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className={`h-2.5 w-2.5 rounded-full transition-all ${
                      star <= item.mastery_level
                        ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                        : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
