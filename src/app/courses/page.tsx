'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import DonationWidget from '@/components/DonationWidget';
import { api, Course } from '@/lib/api';
import { 
  BookOpen, Clock, Award, ShieldCheck, ArrowRight, Search,
  Terminal, Code2, Cpu, CheckCircle2, Flame, Filter, Sparkles
} from 'lucide-react';

const catalogTranslations = {
  en: {
    title: "Engineering Track Blueprints",
    subtitle: "Complete structured developer learning tracks with live browser-native sandboxes and verified certificates.",
    searchPlaceholder: "Search curriculum tracks, skills, or runtime...",
    filterAll: "ALL TRACKS",
    filterBeginner: "BEGINNER",
    filterMedium: "SYSTEMS",
    filterWeb: "WEB ARCHITECTURE",
    lessons: "Lessons",
    duration: "Estimated Duration",
    skills: "Core Competencies",
    viewSyllabus: "Inspect Blueprint",
    startLab: "Enter Lab",
    certIncluded: "Verified Credential Included",
    loading: "Loading Curriculum Registry..."
  },
  ar: {
    title: "مخططات المسارات الهندسية",
    subtitle: "مسارات تعليمية برمجية تفاعلية متكاملة مع مختبرات برمجية مباشرة وشهادات موثقة.",
    searchPlaceholder: "ابحث في المسارات والمهغات البرمجية...",
    filterAll: "جميع المسارات",
    filterBeginner: "مبتدئ",
    filterMedium: "أنظمة C++",
    filterWeb: "تطوير الويب",
    lessons: "دروس",
    duration: "المدة التقديرية",
    skills: "الكفاءات الأساسية",
    viewSyllabus: "عرض المنهج",
    startLab: "بدء المختبر",
    certIncluded: "تتضمن شهادة موثقة",
    loading: "جاري تحميل سجل المناهج..."
  }
};

export default function CoursesCatalogPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'beginner' | 'medium' | 'web'>('all');
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<'en' | 'ar'>('en');

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
    async function loadCatalog() {
      try {
        setLoading(true);
        const data = await api.getCourses();
        if (data && data.length > 0) {
          setCourses(data);
        } else {
          throw new Error("Empty catalog");
        }
      } catch (err) {
        setCourses([
          { 
            id: 1, 
            title: "Python Basics", 
            description: "Master variables, loops, control flow, functions, and structured data handling with live AST debugging.", 
            skills: "Python 3.12, Control Flow, Data Structures", 
            duration: "10 hours", 
            difficulty: "Beginner", 
            theme_style: "cosmic" 
          },
          { 
            id: 2, 
            title: "C++ Systems", 
            description: "Direct memory management, raw pointers, stack vs heap allocation, and GCC compiler diagnostics.", 
            skills: "C++20, Pointers, Memory Allocation, GCC", 
            duration: "12 hours", 
            difficulty: "Medium", 
            theme_style: "cyberpunk" 
          },
          { 
            id: 3, 
            title: "Web Fundamentals", 
            description: "Semantic DOM architecture, modern CSS Flexbox layout grids, box-model debugging, and JS runtimes.", 
            skills: "HTML5, CSS3, Flexbox, JavaScript DOM", 
            duration: "15 hours", 
            difficulty: "Beginner", 
            theme_style: "creative" 
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  const t = catalogTranslations[lang];

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                          c.description.toLowerCase().includes(search.toLowerCase()) ||
                          c.skills.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (activeFilter === 'beginner') return c.difficulty.toLowerCase() === 'beginner';
    if (activeFilter === 'medium') return c.difficulty.toLowerCase() === 'medium';
    if (activeFilter === 'web') return c.title.toLowerCase().includes('web') || c.skills.toLowerCase().includes('html');
    return true;
  });

  return (
    <div className="min-h-screen bg-[#050609] text-slate-100 font-sans select-none flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Header Metadata */}
        <section className="space-y-4 font-mono-code border-b border-[#1a2233] pb-6">
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-bold">
            <Terminal className="w-4 h-4" />
            <span>EDUVERSE // CURRICULUM BLUEPRINT</span>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {t.title}
              </h1>
              <p className="text-xs text-slate-400 font-sans max-w-2xl leading-relaxed">
                {t.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="status-led status-led-active"></span>
              <span className="text-emerald-400 font-bold">{courses.length} ACTIVE TRACKS</span>
            </div>
          </div>
        </section>

        {/* Filter Controls & Search */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-code text-xs">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input 
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="edu-input pl-9 py-2.5 text-xs"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                activeFilter === 'all' 
                  ? 'bg-indigo-600 text-white font-bold' 
                  : 'bg-[#0d1117] text-slate-400 hover:text-white border border-[#1a2233]'
              }`}
            >
              {t.filterAll}
            </button>
            <button
              onClick={() => setActiveFilter('beginner')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                activeFilter === 'beginner' 
                  ? 'bg-indigo-600 text-white font-bold' 
                  : 'bg-[#0d1117] text-slate-400 hover:text-white border border-[#1a2233]'
              }`}
            >
              {t.filterBeginner}
            </button>
            <button
              onClick={() => setActiveFilter('medium')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                activeFilter === 'medium' 
                  ? 'bg-indigo-600 text-white font-bold' 
                  : 'bg-[#0d1117] text-slate-400 hover:text-white border border-[#1a2233]'
              }`}
            >
              {t.filterMedium}
            </button>
            <button
              onClick={() => setActiveFilter('web')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                activeFilter === 'web' 
                  ? 'bg-indigo-600 text-white font-bold' 
                  : 'bg-[#0d1117] text-slate-400 hover:text-white border border-[#1a2233]'
              }`}
            >
              {t.filterWeb}
            </button>
          </div>
        </section>

        {/* Course Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className="bg-[#080a0f] border border-[#1a2233] hover:border-indigo-500/60 rounded-md p-6 flex flex-col justify-between space-y-5 transition-all shadow-xl font-mono-code group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    TRACK_ID: #0{course.id}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold">
                    {course.difficulty}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white font-sans group-hover:text-indigo-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1a2233] text-[11px] space-y-2 text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" /> {t.duration}:
                    </span>
                    <span className="text-slate-300 font-semibold">{course.duration}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Code2 className="w-3 h-3 text-indigo-400" /> {t.skills}:
                    </span>
                    <span className="text-indigo-300 font-medium truncate max-w-[150px]">{course.skills}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t.certIncluded}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href={`/courses/${course.id}`}
                  className="edu-btn edu-btn-secondary py-2 text-xs text-center"
                >
                  {t.viewSyllabus}
                </Link>
                <Link
                  href={`/courses/${course.id}/lessons/${course.id === 2 ? 13 : course.id === 3 ? 17 : 1}`}
                  className="edu-btn edu-btn-primary py-2 text-xs text-center font-bold"
                >
                  {t.startLab}
                </Link>
              </div>
            </div>
          ))}
        </section>

        {/* Donation Widget */}
        <section className="pt-6">
          <DonationWidget />
        </section>
      </main>
    </div>
  );
}
