'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart2, 
  TrendingUp, 
  GraduationCap, 
  UserCheck, 
  Clock, 
  Flame, 
  Award, 
  Sparkles, 
  Loader2 
} from 'lucide-react';
import { 
  api, 
  StudentAnalyticsData, 
  AIInsightResponse, 
  TeacherClassStats 
} from '@/lib/api';
import ProgressChart from '@/components/analytics/ProgressChart';
import SubjectComparison from '@/components/analytics/SubjectComparison';
import SkillHeatmap from '@/components/analytics/SkillHeatmap';
import AIInsightsPanel from '@/components/analytics/AIInsightsPanel';
import TeacherView from '@/components/analytics/TeacherView';

const translations = {
  en: {
    title: "Learning Analytics & Mentorship",
    subtitle: "Real-time performance metrics, AI recommendation engine, and class stats.",
    tabStudent: "Student Analytics",
    tabTeacher: "Teacher Overview",
    totalHours: "Total Learning Time",
    totalXp: "Total XP Gained",
    completionRate: "Course Completion",
    activeStreak: "Daily Coding Streak",
    hours: "hours",
    days: "days"
  },
  ar: {
    title: "تحليلات التعلم والتوجيه الذكي",
    subtitle: "مقاييس الأداء اللحظية، محرك توصيات الذكاء الاصطناعي، وإحصائيات الفصول.",
    tabStudent: "تحليلات الطالب",
    tabTeacher: "لوحة المعلم",
    totalHours: "إجمالي وقت التعلم",
    totalXp: "إجمالي النقاط المكتسبة",
    completionRate: "نسبة إكمال الدورات",
    activeStreak: "المتابعة البرمجية اليومية",
    hours: "ساعات",
    days: "أيام"
  }
};

export default function AnalyticsPage() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');
  const [loading, setLoading] = useState(true);

  const [studentData, setStudentData] = useState<StudentAnalyticsData | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsightResponse | null>(null);
  const [teacherStats, setTeacherStats] = useState<TeacherClassStats | null>(null);

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

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const [studentRes, aiRes, teacherRes] = await Promise.all([
          api.getStudentAnalytics().catch(() => null),
          api.getAIInsights().catch(() => null),
          api.getTeacherAnalytics().catch(() => null)
        ]);

        if (studentRes) setStudentData(studentRes);
        if (aiRes) setAiInsights(aiRes);
        if (teacherRes) setTeacherStats(teacherRes);
      } catch (err) {
        console.error('Failed loading analytics data', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const t = translations[lang];
  const isAr = lang === 'ar';

  // Fallbacks if backend server is not running locally
  const fallbackStudentData: StudentAnalyticsData = {
    total_learning_hours: 18.5,
    total_xp: 2450,
    completion_rate: 42.0,
    streak_days: 5,
    weekly_activity: [
      { day: "Sun", date_str: "2026-08-01", hours: 2.0, xp: 240 },
      { day: "Mon", date_str: "2026-08-02", hours: 3.5, xp: 420 },
      { day: "Tue", date_str: "2026-08-03", hours: 1.5, xp: 180 },
      { day: "Wed", date_str: "2026-08-04", hours: 4.0, xp: 500 },
      { day: "Thu", date_str: "2026-08-05", hours: 2.5, xp: 300 },
      { day: "Fri", date_str: "2026-08-06", hours: 5.0, xp: 620 },
      { day: "Sat", date_str: "2026-08-07", hours: 3.0, xp: 360 }
    ],
    subject_comparison: [
      { subject: "Python Basics", progress_percent: 75.0, total_lessons: 12, completed_lessons: 9, score_avg: 92.0 },
      { subject: "C++ Basics", progress_percent: 30.0, total_lessons: 10, completed_lessons: 3, score_avg: 80.0 },
      { subject: "Web Development", progress_percent: 50.0, total_lessons: 14, completed_lessons: 7, score_avg: 88.5 },
      { subject: "AI Fundamentals", progress_percent: 15.0, total_lessons: 8, completed_lessons: 1, score_avg: 70.0 }
    ],
    skill_heatmap: [
      { skill: "Variables & Data Types", category: "Python", mastery_level: 5, status: "Mastered" },
      { skill: "Control Flow & Loops", category: "Python", mastery_level: 5, status: "Mastered" },
      { skill: "Functions & Scope", category: "Python", mastery_level: 4, status: "In Progress" },
      { skill: "Memory & Pointers", category: "C++", mastery_level: 2, status: "Needs Review" },
      { skill: "HTML Semantic Tags", category: "Web Dev", mastery_level: 5, status: "Mastered" },
      { skill: "CSS Grid & Flexbox", category: "Web Dev", mastery_level: 4, status: "In Progress" },
      { skill: "Prompt Engineering", category: "AI", mastery_level: 3, status: "In Progress" }
    ]
  };

  const fallbackAIInsights: AIInsightResponse = {
    strengths: [
      "Consistent execution of logic loops and variable scope exercises.",
      "High accuracy in Web Development HTML/CSS final quizzes (92%).",
      "Regular daily activity keeping up a 5-day coding streak."
    ],
    improvements: [
      "C++ Pointers and Memory Allocation concepts require additional practice.",
      "Consider reviewing Python Exception Handling before moving to Advanced OOP."
    ],
    recommended_lessons: [
      { id: 2, title: "Python Basics: Functions & Return Statements", course: "Python Basics", estimated_min: 15 },
      { id: 5, title: "C++ Basics: References & Pointers", course: "C++ Basics", estimated_min: 20 },
      { id: 8, title: "Web Dev: Responsive Grid Systems", course: "Web Development", estimated_min: 25 }
    ],
    weekly_summary: "You are making steady progress this week! You spent over 18 hours learning and earned 2,450 XP. Completing your upcoming Python assessment will unlock your next Rank badge!"
  };

  const fallbackTeacherStats: TeacherClassStats = {
    total_students: 28,
    active_students_this_week: 22,
    avg_completion_rate: 64.5,
    top_subject: "Python Basics",
    students: [
      { id: 1, name: "Beshoy Nabil", email: "beshoy@eduverse.com", xp: 2450, level: 3, completed_courses: 2, streak_days: 5, avg_score: 91.5, last_active: "Today" },
      { id: 2, name: "Alexander Wright", email: "alex@eduverse.com", xp: 3100, level: 4, completed_courses: 3, streak_days: 7, avg_score: 95.0, last_active: "Today" },
      { id: 3, name: "Sophia Martinez", email: "sophia@eduverse.com", xp: 1800, level: 2, completed_courses: 1, streak_days: 3, avg_score: 84.0, last_active: "Yesterday" },
      { id: 4, name: "David Chen", email: "david@eduverse.com", xp: 4200, level: 5, completed_courses: 4, streak_days: 12, avg_score: 98.0, last_active: "Today" }
    ]
  };

  const activeStudentData = studentData || fallbackStudentData;
  const activeAIInsights = aiInsights || fallbackAIInsights;
  const activeTeacherStats = teacherStats || fallbackTeacherStats;

  return (
    <div className="h-full flex flex-col p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Top Header */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isAr ? 'md:flex-row-reverse text-right' : 'text-left'}`}>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <BarChart2 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            {t.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{t.subtitle}</p>
        </div>

        {/* Tab Switcher (Student vs Teacher) */}
        <div className="flex items-center p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
          <button
            onClick={() => setActiveTab('student')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'student'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap size={18} />
            {t.tabStudent}
          </button>
          <button
            onClick={() => setActiveTab('teacher')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'teacher'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck size={18} />
            {t.tabTeacher}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600 dark:text-indigo-400" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === 'student' ? (
            <motion.div
              key="student-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Quick Key Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    <Clock size={24} />
                  </div>
                  <div className={isAr ? 'text-right' : 'text-left'}>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">{t.totalHours}</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{activeStudentData.total_learning_hours} <span className="text-xs font-normal text-slate-400">{t.hours}</span></span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                    <Sparkles size={24} />
                  </div>
                  <div className={isAr ? 'text-right' : 'text-left'}>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">{t.totalXp}</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{activeStudentData.total_xp.toLocaleString()} <span className="text-xs font-bold text-amber-500">XP</span></span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                    <Award size={24} />
                  </div>
                  <div className={isAr ? 'text-right' : 'text-left'}>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">{t.completionRate}</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{activeStudentData.completion_rate}%</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                    <Flame size={24} />
                  </div>
                  <div className={isAr ? 'text-right' : 'text-left'}>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">{t.activeStreak}</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{activeStudentData.streak_days} <span className="text-xs font-normal text-slate-400">{t.days}</span></span>
                  </div>
                </div>
              </div>

              {/* Progress Activity Chart & AI Insights Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ProgressChart data={activeStudentData.weekly_activity} lang={lang} />
                <AIInsightsPanel insights={activeAIInsights} lang={lang} />
              </div>

              {/* Subject Breakdown & Skill Heatmap */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SubjectComparison subjects={activeStudentData.subject_comparison} lang={lang} />
                <SkillHeatmap skills={activeStudentData.skill_heatmap} lang={lang} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="teacher-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <TeacherView stats={activeTeacherStats} lang={lang} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
