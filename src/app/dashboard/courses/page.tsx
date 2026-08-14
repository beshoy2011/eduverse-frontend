'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Filter, Play, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { api, Course } from '@/lib/api';

const translations = {
  en: {
    title: "Course Catalog",
    subtitle: "Explore our collection of interactive programming courses.",
    searchPlaceholder: "Search for a course...",
    allCategories: "All Categories",
    enrollNow: "Enroll Now",
    resume: "Resume",
    difficulty: "Difficulty",
    enrolled: "Enrolled",
    categories: ["Web Dev", "Python", "C++", "Data Science", "AI"]
  },
  ar: {
    title: "كتالوج الدورات",
    subtitle: "استكشف مجموعتنا من دورات البرمجة التفاعلية.",
    searchPlaceholder: "ابحث عن دورة...",
    allCategories: "جميع الفئات",
    enrollNow: "سجل الآن",
    resume: "متابعة",
    difficulty: "المستوى",
    enrolled: "مسجل",
    categories: ["تطوير الويب", "بايثون", "سي بلس بلس", "علم البيانات", "الذكاء الاصطناعي"]
  }
};

const translateCourse = (course: Course, currentLang: 'en' | 'ar') => {
  if (currentLang === 'en') return course;
  
  const titleLower = course.title.toLowerCase();
  
  if (titleLower.includes("python basics")) {
    return { ...course, title: "أساسيات بايثون", description: "تعلم لغة بايثون من الصفر.", difficulty: "مبتدئ" };
  }
  if (titleLower.includes("c++ basics")) {
    return { ...course, title: "أساسيات سي بلس بلس", description: "استكشف القواعد الأساسية للغة سي بلس بلس.", difficulty: "متوسط" };
  }
  if (titleLower.includes("web development")) {
    return { ...course, title: "أساسيات تطوير الويب", description: "ابنِ مواقع ويب من الصفر.", difficulty: "مبتدئ" };
  }
  return course;
};

export default function CoursesPage() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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
    async function loadData() {
      try {
        const coursesData = await api.getCourses();
        const enrolledData = await api.getEnrolledCourses();
        setAllCourses(coursesData);
        setEnrolledIds(new Set(enrolledData.map(c => c.id)));
      } catch (err) {
        console.error('Failed to load courses', err);
        // Fallback mockup
        setAllCourses([
          { id: 1, title: "Python Basics", description: "Learn Python from scratch.", skills: "Python", duration: "10 hours", difficulty: "Beginner", theme_style: "cosmic" },
          { id: 2, title: "C++ Basics", description: "Learn C++ compile structure.", skills: "C++", duration: "12 hours", difficulty: "Medium", theme_style: "cyberpunk" },
          { id: 3, title: "Web Development Fundamentals", description: "Build responsive HTML layout websites.", skills: "HTML,CSS,JS", duration: "15 hours", difficulty: "Beginner", theme_style: "creative" },
        ]);
        setEnrolledIds(new Set([1]));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const t = translations[lang];
  const isAr = lang === 'ar';

  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const courseTitle = course.title.toLowerCase();
    
    // Very basic mock category filtering logic based on title/skills
    let matchesCategory = true;
    if (activeCategory) {
      if (activeCategory.includes('Web') || activeCategory.includes('الويب')) {
        matchesCategory = courseTitle.includes('web');
      } else if (activeCategory.includes('Python') || activeCategory.includes('بايثون')) {
        matchesCategory = courseTitle.includes('python');
      } else if (activeCategory.includes('C++') || activeCategory.includes('سي بلس')) {
        matchesCategory = courseTitle.includes('c++');
      } else {
        matchesCategory = false; // Mock filtering
      }
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className={`mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isAr ? 'flex-row-reverse text-right' : 'text-left'}`}>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            {t.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">{t.subtitle}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={`flex flex-col md:flex-row gap-4 mb-8 ${isAr ? 'md:flex-row-reverse' : ''}`}>
        <div className={`relative flex-1 max-w-md ${isAr ? 'text-right' : 'text-left'}`}>
          <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isAr ? 'right-3' : 'left-3'}`}>
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className={`block w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 ${isAr ? 'pr-10 pl-3' : 'pl-10 pr-3'} text-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-sm`}
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className={`flex overflow-x-auto gap-2 pb-2 md:pb-0 hide-scrollbar ${isAr ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
              activeCategory === null 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {t.allCategories}
          </button>
          {t.categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                activeCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        </div>
      ) : (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCourses.map(course => {
            const localCourse = translateCourse(course, lang);
            const isEnrolled = enrolledIds.has(course.id);

            return (
              <motion.div
                key={course.id}
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                }}
                className={`rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${
                  isAr ? 'text-right' : 'text-left'
                }`}
              >
                <div>
                  <div className={`flex justify-between items-start mb-4 ${isAr ? 'flex-row-reverse' : ''}`}>
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    {isEnrolled && (
                      <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full">
                        {t.enrolled}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {localCourse.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {localCourse.description}
                  </p>
                </div>
                
                <div className="mt-8">
                  <div className={`flex items-center gap-4 mb-5 text-xs font-bold text-slate-400 ${isAr ? 'flex-row-reverse' : ''}`}>
                    <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5"/> {localCourse.duration}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                    <span>{localCourse.difficulty}</span>
                  </div>

                  {isEnrolled ? (
                    <Link
                      href={`/courses/${course.id}/lessons/1`}
                      className={`w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 px-4 py-3 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors ${isAr ? 'flex-row-reverse' : ''}`}
                    >
                      <Play className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} />
                      {t.resume}
                    </Link>
                  ) : (
                    <Link
                      href={`/courses/${course.id}`}
                      className={`w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition-colors ${isAr ? 'flex-row-reverse' : ''}`}
                    >
                      {t.enrollNow}
                      <ArrowRight className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} />
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
          
          {filteredCourses.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-500">
              <Filter className="h-10 w-10 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
              <p>No courses found matching your criteria.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
