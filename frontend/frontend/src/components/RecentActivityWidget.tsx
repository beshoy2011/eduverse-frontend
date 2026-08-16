'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, Play, Star, BookOpen } from 'lucide-react';

export default function RecentActivityWidget({ lang = 'en' }: { lang?: 'en' | 'ar' }) {
  const isAr = lang === 'ar';
  
  const activities = [
    { id: 1, type: 'lesson', title: 'Python Basics: Variables', time: '2 hours ago', icon: Play, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 2, type: 'quiz', title: 'HTML Structure Quiz', time: '5 hours ago', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { id: 3, type: 'achievement', title: '3 Day Streak', time: '1 day ago', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { id: 4, type: 'course', title: 'Started C++ Basics', time: '2 days ago', icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
  ];

  return (
    <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <h3 className={`text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mb-6 ${isAr ? 'flex-row-reverse' : ''}`}>
        <Clock className="h-5 w-5 text-indigo-500" />
        {isAr ? 'النشاط الأخير' : 'Recent Activity'}
      </h3>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <motion.div 
              key={activity.id}
              initial={{ opacity: 0, x: isAr ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-4 ${isAr ? 'flex-row-reverse' : ''}`}
            >
              <div className={`p-3 rounded-xl ${activity.bg}`}>
                <Icon className={`h-5 w-5 ${activity.color}`} />
              </div>
              <div className={`flex-1 ${isAr ? 'text-right' : 'text-left'}`}>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{activity.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activity.time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
