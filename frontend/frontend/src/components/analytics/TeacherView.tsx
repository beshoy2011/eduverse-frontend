'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Download, Trophy, Flame, CheckCircle, Search, FileSpreadsheet } from 'lucide-react';
import { TeacherClassStats, api } from '@/lib/api';

interface TeacherViewProps {
  stats: TeacherClassStats;
  lang?: 'en' | 'ar';
}

export default function TeacherView({ stats, lang = 'en' }: TeacherViewProps) {
  const [search, setSearch] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const isAr = lang === 'ar';

  const filteredStudents = stats.students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      setIsExporting(true);
      const data = await api.exportAnalyticsReport(format);
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', `eduverse_analytics_report.${format}`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Class Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Users size={24} />
          </div>
          <div className={isAr ? 'text-right' : 'text-left'}>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
              {isAr ? 'إجمالي الطلاب' : 'Total Enrolled'}
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.total_students}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <Flame size={24} />
          </div>
          <div className={isAr ? 'text-right' : 'text-left'}>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
              {isAr ? 'النشطون هذا الأسبوع' : 'Active This Week'}
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.active_students_this_week}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
            <CheckCircle size={24} />
          </div>
          <div className={isAr ? 'text-right' : 'text-left'}>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
              {isAr ? 'متوسط الإكمال' : 'Avg Completion'}
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.avg_completion_rate}%
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
            <Trophy size={24} />
          </div>
          <div className={isAr ? 'text-right' : 'text-left'}>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
              {isAr ? 'الموضوع الأكثر إقبالاً' : 'Top Subject'}
            </span>
            <span className="text-sm font-black text-slate-900 dark:text-white">
              {stats.top_subject}
            </span>
          </div>
        </div>
      </div>

      {/* Student Roster Table & Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isAr ? 'sm:flex-row-reverse text-right' : 'text-left'}`}>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="h-6 w-6 text-indigo-500" />
              {isAr ? 'قائمة الطلاب والأداء' : 'Student Performance Roster'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isAr ? 'متابعة تقدم كل طالب وتصدير التقرير الكامل' : 'Monitor individual student progress and download reports'}
            </p>
          </div>

          {/* Export Action Buttons */}
          <div className={`flex items-center gap-2 ${isAr ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => handleExport('json')}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow transition-transform active:scale-95 disabled:opacity-50"
            >
              <Download size={14} />
              {isAr ? 'تصدير JSON' : 'Export JSON'}
            </button>
            <button
              onClick={() => handleExport('csv')}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-50"
            >
              <FileSpreadsheet size={14} />
              {isAr ? 'تصدير CSV' : 'Export CSV'}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className={`absolute top-3.5 text-slate-400 ${isAr ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isAr ? 'بحث باسم الطالب أو البريد...' : 'Search student by name or email...'}
            className={`w-full py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-indigo-500 ${
              isAr ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'
            }`}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">{isAr ? 'الطالب' : 'Student'}</th>
                <th className="py-3 px-4">{isAr ? 'مستوى XP' : 'XP & Level'}</th>
                <th className="py-3 px-4">{isAr ? 'الدورات المنجزة' : 'Courses Done'}</th>
                <th className="py-3 px-4">{isAr ? 'المتابعة اليومية' : 'Streak'}</th>
                <th className="py-3 px-4">{isAr ? 'متوسط الاختيارات' : 'Avg Quiz Score'}</th>
                <th className="py-3 px-4">{isAr ? 'آخر ظهور' : 'Last Active'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{s.name}</span>
                      <span className="text-[11px] text-slate-400">{s.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Lvl {s.level}</span>
                    <span className="text-xs text-slate-400 block">{s.xp} XP</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                    {s.completed_courses}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-bold text-amber-500">
                      🔥 {s.streak_days}d
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                    {s.avg_score}%
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-400">
                    {s.last_active}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
