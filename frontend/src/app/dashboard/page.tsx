'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import DonationWidget from '@/components/DonationWidget';
import { api, Course, Certificate } from '@/lib/api';
import { 
  BookOpen, Award, CheckCircle, Zap, Calendar, Play, 
  ArrowRight, ShieldCheck, HelpCircle, Loader2, Sparkles, Flame
} from 'lucide-react';
import { motion } from 'framer-motion';

const dashboardTranslations = {
  en: {
    welcomeSub: "Welcome back to your learning space",
    hello: "Hello, {name}!",
    activeDesc: "You have {count} active course{plural}. Study at your own pace and reach out to your AI Tutor for help anytime!",
    enrolled: "Enrolled",
    certificates: "Certificates",
    continueLearning: "Continue Learning",
    courseProgress: "Course Progress",
    difficulty: "Difficulty",
    resume: "Resume",
    noEnrolled: "You haven't enrolled in any courses yet.",
    browseCatalog: "Browse catalog below to start learning",
    exploreMore: "Explore More Courses",
    enrollNow: "Enroll Now",
    dailyStreak: "Daily Streak",
    streakActiveText: "You are keeping up your daily learning streak! Maintain your coding progress to earn free certificates! 🔥",
    streakPill: "4 Days Active!",
    conceptTitle: "Concept Analogies",
    conceptSub: "Interactive Concept Analogies: Select a concept to understand it with a fun daily analogy! 🧠",
    certsTitle: "Certificates Earned",
    viewDownload: "View & Download",
    noCerts: "No certificates earned yet.",
    certsDesc: "Complete a course syllabus and pass the final exam with 70% or more to earn yours!",
    days: {
      Sat: "Sat",
      Sun: "Sun",
      Mon: "Mon",
      Tue: "Tue",
      Wed: "Wed",
      Thu: "Thu",
      Fri: "Fri"
    }
  },
  ar: {
    welcomeSub: "أهلاً بك مجدداً في مساحتك التعليمية",
    hello: "أهلاً بك، {name}!",
    activeDesc: "لديك {count} دورة نشطة. ادرس بالسرعة التي تناسبك واستعن بمعلمك الذكي للمساعدة في أي وقت!",
    enrolled: "المسجلة",
    certificates: "الشهادات",
    continueLearning: "متابعة التعلم",
    courseProgress: "تقدمك بالدورة",
    difficulty: "المستوى",
    resume: "متابعة",
    noEnrolled: "لم تسجل في أي دورة بعد.",
    browseCatalog: "تصفح كتالوج الدورات أدناه لبدء التعلم",
    exploreMore: "استكشف المزيد من الدورات",
    enrollNow: "سجل الآن",
    dailyStreak: "المتابعة اليومية",
    streakActiveText: "أنت مستمر بالتعلم اليومي! حافظ على تقدمك البرمجي للحصول على الشهادات مجاناً. 🔥",
    streakPill: "مستمر لـ 4 أيام!",
    conceptTitle: "تشبيهات ذكية للمفاهيم",
    conceptSub: "مستكشف التشبيهات الذكية: اختر مفهوماً لتفهمه بتشبيه طريف من الواقع اليومي! 🧠",
    certsTitle: "الشهادات المكتسبة",
    viewDownload: "عرض وتحميل",
    noCerts: "لا توجد شهادات مكتسبة بعد.",
    certsDesc: "أكمل منهج الدورة البرمجية واجتز الامتحان النهائي بنسبة 70% أو أكثر لتحصل على شهادتك مجاناً!",
    days: {
      Sat: "السبت",
      Sun: "الأحد",
      Mon: "الإثنين",
      Tue: "الثلاثاء",
      Wed: "الأربعاء",
      Thu: "الخميس",
      Fri: "الجمعة"
    }
  }
};

const translateCourse = (course: Course, currentLang: 'en' | 'ar') => {
  if (currentLang === 'en') return course;
  
  const titleLower = course.title.toLowerCase();
  
  if (titleLower.includes("python basics") || titleLower.includes("أساسيات بايثون")) {
    return {
      ...course,
      title: "أساسيات بايثون",
      description: "تعلم لغة بايثون، اللغة الأكثر شعبية وتنوعاً في العالم. مثالية لكتابة السكربتات والأتمتة وتطوير تطبيقات الويب والذكاء الاصطناعي.",
      skills: "بايثون,المتغيرات,التكرار,الدوال,بنيات البيانات",
      difficulty: "مبتدئ"
    };
  }
  if (titleLower.includes("c++ basics") || titleLower.includes("أساسيات سي بلس بلس")) {
    return {
      ...course,
      title: "أساسيات سي بلس بلس",
      description: "استكشف القواعد الأساسية للغة سي بلس بلس، أمان الأنواع، بنيات الذاكرة، والعمليات على مستوى الهاردوير.",
      skills: "سي بلس بلس,التجميع,المؤشرات,الذاكرة,التحكم في التدفق",
      difficulty: "متوسط"
    };
  }
  if (titleLower.includes("web development") || titleLower.includes("أساسيات تطوير الويب")) {
    return {
      ...course,
      title: "أساسيات تطوير الويب",
      description: "ابنِ مواقع ويب متجاوبة بالكامل مع مختلف الشاشات من الصفر باستخدام HTML5 و CSS3 ونظام التخطيط Flexbox وجافا سكريبت لتفاعل حيوي.",
      skills: "HTML5,CSS3,Flexbox,Grid,DOM Events,JS",
      difficulty: "مبتدئ"
    };
  }
  if (titleLower.includes("medium python") || titleLower.includes("بايثون - المستوى المتوسط")) {
    return {
      ...course,
      title: "بايثون - المستوى المتوسط",
      description: "تعمق في مفاهيم بايثون المتقدمة مثل البرمجة كائنية التوجه (OOP)، التعامل مع الملفات والأخطاء، وتطبيقات عملية متوسطة.",
      skills: "OOP,الفئات,الكائنات,الوراثة,إدارة الملفات,معالجة الاستثناءات",
      difficulty: "متوسط"
    };
  }
  if (titleLower.includes("pro python") || titleLower.includes("بايثون للمحترفين")) {
    return {
      ...course,
      title: "بايثون للمحترفين",
      description: "احترف تقنيات بايثون المتقدمة مثل المولدات (Generators)، المنسقات (Decorators)، البرمجة المتزامنة (Asynchronous)، ومكتبات تحليل البيانات.",
      skills: "Generators,Decorators,Asyncio,Multithreading,Numpy,Pandas",
      difficulty: "محترف"
    };
  }
  if (titleLower.includes("advanced python") || titleLower.includes("بايثون المتقدم والذكاء الاصطناعي")) {
    return {
      ...course,
      title: "بايثون المتقدم والذكاء الاصطناعي",
      description: "استكشف آفاق الذكاء الاصطناعي، تعلم الآلة (Machine Learning)، معالجة اللغات الطبيعية (NLP)، وبناء نماذج ذكية باستخدام بايثون.",
      skills: "Machine Learning,Deep Learning,NLP,TensorFlow,Scikit-Learn",
      difficulty: "متقدم"
    };
  }

  return course;
};

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [progressMap, setProgressMap] = useState<Record<number, number>>({});
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [user, setUser] = useState<any>(null);

  // Enhancements states
  const [selectedConcept, setSelectedConcept] = useState<'vars' | 'loops' | 'pointers' | 'recursion'>('vars');

  const analogies = {
    vars: {
      title_ar: "المتغيرات (Variables)",
      title_en: "Variables",
      analogy_ar: "مثل الصندوق المسمى! 📦 تخيل أنك وضعت ورقة مكتوب عليها رقم 5 داخل صندوق وألصقت عليه اسم 'x'. كلما احتجت الرقم 5، فقط تذكر الاسم 'x' وسيفتح الصندوق تلقائياً!",
      analogy_en: "Like a labeled storage box! You label a box 'x' and put '5' inside it. Whenever you call 'x', the computer looks inside the box and gets '5'.",
      code: "x = 5  # Python\nint x = 5;  // C++"
    },
    loops: {
      title_ar: "التكرار (Loops)",
      title_en: "Loops",
      analogy_ar: "مثل شيف مطبخ يحضر 10 أطباق سلطة! 🥗 بدلاً من كتابة أمر تحضير طبق 10 مرات، يكتب في كتاب الوصفات: 'كرر التحضير طالما عدد الأطباق أقل من 10'.",
      analogy_en: "Like a chef preparing 10 salads! Instead of writing the command 10 times, the recipe says: 'Repeat salad preparation while salads count is less than 10'.",
      code: "for plate in range(10):\n    print(\"Salad ready! 🥗\")"
    },
    pointers: {
      title_ar: "المؤشرات (Pointers)",
      title_en: "Pointers (C++)",
      analogy_ar: "مثل خريطة الكنز! 🗺️ بدلاً من إعطائك الكنز الثقيل نفسه في يدك، أعطيك ورقة مكتوب عليها إحداثيات موقع الكنز في الذاكرة. أنت تذهب وتفتحه متى تشاء!",
      analogy_en: "Like a treasure map! Instead of holding the heavy gold chest in your hands, you hold a piece of paper that stores the address of the chest in memory.",
      code: "int val = 100;\nint* ptr = &val;  // ptr points to memory address"
    },
    recursion: {
      title_ar: "التكرار الذاتي (Recursion)",
      title_en: "Recursion",
      analogy_ar: "مثل الوقوف بين مرآتين متقابلتين! 🪞 ترى انعكاس صورتك داخل صورتك بشكل متداخل لا نهائي. في البرمجة، يجب أن نضع شرطاً (مثل إغلاق عينيك) لتتوقف المرايا عن التكرار!",
      analogy_en: "Like standing between parallel mirrors! You see yourself inside yourself recursively. You must define a base case (like closing your eyes) to stop the infinite loops.",
      code: "def countdown(n):\n    if n <= 0: return  # Base case\n    countdown(n - 1)"
    }
  };

  const streakDays = [
    { dayKey: "Sat", active: true },
    { dayKey: "Sun", active: true },
    { dayKey: "Mon", active: true },
    { dayKey: "Tue", active: true },
    { dayKey: "Wed", active: false },
    { dayKey: "Thu", active: false },
    { dayKey: "Fri", active: false }
  ];

  useEffect(() => {
    // Read initial language
    const savedLang = localStorage.getItem('eduverse_lang') as 'en' | 'ar' | null;
    if (savedLang) {
      setLang(savedLang);
    }

    // Listener for language toggle
    const handleLanguageChange = () => {
      const activeLang = localStorage.getItem('eduverse_lang') as 'en' | 'ar' | null;
      if (activeLang) {
        setLang(activeLang);
      }
    };

    window.addEventListener('eduverse_language_change', handleLanguageChange);
    return () => {
      window.removeEventListener('eduverse_language_change', handleLanguageChange);
    };
  }, []);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('eduverse_token');
    const storedName = localStorage.getItem('eduverse_user_name');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    setUserName(storedName || 'Student');

    async function loadDashboardData() {
      try {
        // Fetch current user data
        const u = await api.getMe();
        setUser(u);
        setUserName(u.name);

        // Fetch all courses
        const coursesData = await api.getCourses();
        setAllCourses(coursesData);

        // Fetch enrolled courses
        const enrolledData = await api.getEnrolledCourses();
        setEnrolledCourses(enrolledData);

        // Fetch certificates
        const certsData = await api.getUserCertificates();
        setCertificates(certsData);

        // Fetch progress details for enrolled courses
        const progMap: Record<number, number> = {};
        for (const c of enrolledData) {
          const prog = await api.getCourseProgress(c.id);
          progMap[c.id] = prog.percent_complete;
        }
        setProgressMap(progMap);
      } catch (err) {
        console.error('Failed to load dashboard api data, using mocks', err);
        // Fallback mockup
        setAllCourses([
          { id: 1, title: "Python Basics", description: "Learn Python from scratch.", skills: "Python", duration: "10 hours", difficulty: "Beginner", theme_style: "cosmic" },
          { id: 2, title: "C++ Basics", description: "Learn C++ compile structure.", skills: "C++", duration: "12 hours", difficulty: "Medium", theme_style: "cyberpunk" },
          { id: 3, title: "Web Development Fundamentals", description: "Build responsive HTML layout websites.", skills: "HTML,CSS,JS", duration: "15 hours", difficulty: "Beginner", theme_style: "creative" },
          { id: 4, title: "Medium Python", description: "Take your Python skills to the next level. Learn file handling, exception handling, JSON serialization, and using native and external libraries.", skills: "File handling,Exception Handling,JSON,Modules,Libraries", duration: "12 hours", difficulty: "Medium", theme_style: "cosmic" },
          { id: 5, title: "Pro Python", description: "Master Object-Oriented Programming (OOP) in Python. Understand Classes, Objects, Inheritance, Polymorphism, and encapsulation like a professional developer.", skills: "OOP,Classes,Objects,Inheritance,Methods,Polymorphism", duration: "15 hours", difficulty: "Medium", theme_style: "cosmic" },
          { id: 6, title: "Advanced Python", description: "Deep dive into Python's advanced mechanics: Decorators, Generators, Iterators, Context Managers, and Multithreading.", skills: "Generators,Decorators,Context Managers,Concurrency,Multithreading", duration: "18 hours", difficulty: "Hard", theme_style: "cosmic" }
        ]);
        setEnrolledCourses([
          { id: 1, title: "Python Basics", description: "Learn Python from scratch.", skills: "Python", duration: "10 hours", difficulty: "Beginner", theme_style: "cosmic" }
        ]);
        setProgressMap({ 1: 25.0 });
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
    );
  }

  const t = dashboardTranslations[lang];

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-300 ${
      user?.active_theme === 'theme_cyberpunk' ? 'theme-cyberpunk' :
      user?.active_theme === 'theme_matrix' ? 'theme-matrix' :
      user?.active_theme === 'theme_cosmic' ? 'theme-cosmic' :
      'bg-slate-50 dark:bg-slate-950'
    }`}>
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        {/* --- WELCOME CARD --- */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-500/20"
        >
          {/* Background shapes */}
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none animate-pulse-soft"></div>
          <div className="absolute left-1/3 bottom-0 h-28 w-28 rounded-full bg-violet-600/10 blur-2xl pointer-events-none"></div>
          
          <div className={`relative z-10 flex flex-col items-stretch gap-6`}>
            <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
              lang === 'ar' ? 'text-right' : 'text-left'
            }`}>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 mb-1.5 justify-start">
                  <Sparkles className="h-3.5 w-3.5 animate-spin text-amber-400" /> {t.welcomeSub}
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  {t.hello.replace("{name}", userName || '')}
                </h2>
                <p className="mt-2 text-indigo-200/90 text-sm max-w-xl leading-relaxed">
                  {t.activeDesc
                    .replace("{count}", enrolledCourses.length.toString())
                    .replace("{plural}", enrolledCourses.length === 1 ? '' : 's')}
                </p>
              </div>
              
              <div className={`flex items-center gap-4 border-slate-700/60 pt-4 md:pt-0 shrink-0 ${
                lang === 'ar' ? 'md:border-r md:pr-6 md:border-l-0' : 'md:border-l md:pl-6'
              }`}>
                <div className="text-center">
                  <span className="block text-3xl font-black text-white">{enrolledCourses.length}</span>
                  <span className="text-[9px] uppercase font-extrabold text-indigo-300 tracking-wider">{t.enrolled}</span>
                </div>
                <div className="h-8 w-px bg-slate-700/60"></div>
                <div className="text-center">
                  <span className="block text-3xl font-black text-white">{certificates.length}</span>
                  <span className="text-[9px] uppercase font-extrabold text-indigo-300 tracking-wider">{t.certificates}</span>
                </div>
              </div>
            </div>

            {user && (
              <div className="mt-4 flex flex-col md:flex-row gap-6 items-start md:items-center w-full border-t border-slate-800/80 pt-5">
                {/* Level / Rank badge */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-650/40 border border-indigo-500/30 flex items-center justify-center text-xl shadow-inner font-extrabold text-indigo-300">
                    {user.level}
                  </div>
                  <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                    <span className="block text-[9px] uppercase tracking-widest text-indigo-400 font-extrabold">
                      {lang === 'ar' ? 'الرتبة البرمجية' : 'Rank Title'}
                    </span>
                    <span className="text-sm font-black text-white flex items-center gap-1.5">
                      {user.rank}
                      <span className="text-xs">🏆</span>
                    </span>
                  </div>
                </div>

                {/* Level Progress Bar */}
                <div className="flex-1 w-full">
                  <div className={`flex justify-between items-center text-[10px] font-extrabold text-indigo-300 mb-1.5 ${
                    lang === 'ar' ? 'flex-row-reverse' : ''
                  }`}>
                    <span>{lang === 'ar' ? 'الخبرة للمستوى التالي' : 'XP Progress to Level-Up'}</span>
                    <span>{user.xp % 1000} / 1000 XP</span>
                  </div>
                  <div className="w-full bg-slate-900/60 rounded-full h-2.5 overflow-hidden border border-slate-800/50">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-2.5 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(168,85,247,0.5)]" 
                      style={{ width: `${(user.xp % 1000) / 10}%` }}
                    ></div>
                  </div>
                </div>

                {/* Streak and Stats Quick Info */}
                <div className={`flex items-center gap-4 shrink-0 bg-slate-900/60 border border-slate-800/80 px-4 py-2.5 rounded-xl ${
                  lang === 'ar' ? 'flex-row-reverse' : ''
                }`}>
                  <div className="flex items-center gap-1.5">
                    <Flame className="h-5 w-5 text-amber-500 fill-current animate-pulse" />
                    <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                      <span className="block text-xs font-black text-white">{user.streak_days} {lang === 'ar' ? 'أيام' : 'Days'}</span>
                      <span className="block text-[8px] uppercase font-bold text-slate-400 tracking-wider">{lang === 'ar' ? 'سلسلة التعلم' : 'Coding Streak'}</span>
                    </div>
                  </div>
                  <div className="h-6 w-px bg-slate-800"></div>
                  <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                    <span className="block text-xs font-black text-white">{(user.xp).toLocaleString()}</span>
                    <span className="block text-[8px] uppercase font-bold text-slate-400 tracking-wider">{lang === 'ar' ? 'مجموع النقاط' : 'Total XP'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* --- DASHBOARD SECTIONS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Enrolled Courses & Study Roadmap */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2 ${
                lang === 'ar' ? 'flex-row-reverse' : ''
              }`}>
                <BookOpen className="h-5 w-5 text-indigo-500" /> {t.continueLearning}
              </h3>
            </div>

            {enrolledCourses.length > 0 ? (
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {enrolledCourses.map((course) => {
                  const percent = progressMap[course.id] || 0;
                  const localCourse = translateCourse(course, lang);
                  return (
                    <motion.div 
                      key={course.id} 
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                      }}
                      className={`rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-sm hover-premium-card relative overflow-hidden flex flex-col justify-between ${
                        lang === 'ar' ? 'text-right' : 'text-left'
                      }`}
                    >
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">{localCourse.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">{localCourse.description}</p>
                        
                        {/* Progress Bar */}
                        <div className="mt-5">
                          <div className={`flex justify-between items-center text-xs font-bold text-slate-500 mb-1.5 ${
                            lang === 'ar' ? 'flex-row-reverse' : ''
                          }`}>
                            <span>{t.courseProgress}</span>
                            <span className="text-indigo-650 dark:text-indigo-400">{percent}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-indigo-600 dark:bg-indigo-555/90 h-2 rounded-full transition-all duration-500 shadow-sm" 
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className={`mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between ${
                        lang === 'ar' ? 'flex-row-reverse' : ''
                      }`}>
                        <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 py-1 px-2.5 rounded border border-indigo-100/40 dark:border-indigo-900/30">
                          {localCourse.difficulty}
                        </span>
                        <Link
                          href={`/courses/${course.id}/lessons/1`}
                          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition-all hover:scale-102 cursor-pointer"
                        >
                          {t.resume}
                          <Play className={`h-3 w-3 fill-current ${lang === 'ar' ? 'rotate-180' : ''}`} />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-10 text-center text-slate-500">
                <BookOpen className="h-8 w-8 text-slate-400 mx-auto mb-3 animate-pulse" />
                <p className="text-sm font-medium">{t.noEnrolled}</p>
                <a href="#courses-catalog" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mt-1 block">
                  {t.browseCatalog}
                </a>
              </div>
            )}

            {/* Courses Catalog list */}
            <div id="courses-catalog" className="pt-6 space-y-6">
              <h3 className={`text-lg font-extrabold text-slate-900 dark:text-white ${
                lang === 'ar' ? 'text-right' : 'text-left'
              }`}>{t.exploreMore}</h3>
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {allCourses.filter(c => !enrolledCourses.some(ec => ec.id === c.id)).map((course) => {
                  const localCourse = translateCourse(course, lang);
                  return (
                    <motion.div 
                      key={course.id} 
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                      }}
                      className={`rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-sm hover-premium-card flex flex-col justify-between ${
                        lang === 'ar' ? 'text-right' : 'text-left'
                      }`}
                    >
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">{localCourse.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">{localCourse.description}</p>
                      </div>

                      <div className={`mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between ${
                        lang === 'ar' ? 'flex-row-reverse' : ''
                      }`}>
                        <span className="text-[10px] font-bold text-slate-400">{localCourse.duration} • {localCourse.difficulty}</span>
                        <Link
                          href={`/courses/${course.id}`}
                          className={`flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 group/link cursor-pointer`}
                        >
                          {t.enrollNow}
                          <ArrowRight className={`h-3 w-3 group-hover/link:translate-x-0.5 transition-transform ${lang === 'ar' ? 'rotate-180' : ''}`} />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>

          {/* Certificates Earned Sidebar */}
          <div className="space-y-6">
            {/* --- DAILY CODING STREAK --- */}
            <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
              <div className={`flex items-center justify-between ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                  <Flame className="h-4.5 w-4.5 text-amber-500 fill-current animate-pulse" />
                  {t.streakPill}
                </span>
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  {t.dailyStreak}
                </h4>
              </div>

              {/* Fire streak status text */}
              <p className={`text-[11px] text-slate-555 dark:text-slate-400 leading-relaxed ${
                lang === 'ar' ? 'text-right direction-rtl' : 'text-left'
              }`}>
                {t.streakActiveText}
              </p>

              {/* 7 Day Checklist */}
              <div className={`flex justify-between gap-1 pt-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                {streakDays.map((item, index) => (
                  <div key={index} className="flex flex-col items-center gap-1.5 flex-1">
                    <span className="text-[9px] font-bold text-slate-400">
                      {t.days[item.dayKey as keyof typeof t.days]}
                    </span>
                    <div 
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-black shadow-inner transition-all duration-300 ${
                        item.active 
                          ? 'bg-amber-500 text-white shadow shadow-amber-500/20' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-650 border border-slate-200/40 dark:border-slate-700/40'
                      }`}
                    >
                      {item.active ? '🔥' : '•'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- INTERACTIVE CONCEPT ANALOGIES EXPLORER --- */}
            <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
              <h4 className={`text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 ${
                lang === 'ar' ? 'flex-row-reverse' : ''
              }`}>
                <BookOpen className="h-4 w-4 text-indigo-500" />
                {t.conceptTitle}
              </h4>
              <p className={`text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed ${
                lang === 'ar' ? 'text-right direction-rtl' : 'text-left'
              }`}>
                {t.conceptSub}
              </p>

              {/* Concept Tabs */}
              <div className={`flex flex-wrap gap-1 border-b border-slate-100 dark:border-slate-800/80 pb-2 ${
                lang === 'ar' ? 'flex-row-reverse' : ''
              }`}>
                {(Object.keys(analogies) as Array<keyof typeof analogies>).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedConcept(key)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                      selectedConcept === key
                        ? 'bg-indigo-600 text-white shadow shadow-indigo-600/10'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {lang === 'ar' ? analogies[key].title_ar.split(' ')[0] : analogies[key].title_en}
                  </button>
                ))}
              </div>

              {/* Analogy Render Card */}
              <motion.div
                key={selectedConcept}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-3 transition-colors duration-300"
              >
                <div className={`flex justify-between items-center text-[10px] font-extrabold text-slate-400 uppercase ${
                  lang === 'ar' ? 'flex-row-reverse' : ''
                }`}>
                  <span>{analogies[selectedConcept].title_en}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{analogies[selectedConcept].title_ar}</span>
                </div>
                
                <p className={`text-xs text-slate-700 dark:text-slate-200 leading-relaxed ${
                  lang === 'ar' ? 'text-right direction-rtl' : 'text-left'
                }`}>
                  {lang === 'ar' ? analogies[selectedConcept].analogy_ar : analogies[selectedConcept].analogy_en}
                </p>
                {lang === 'ar' && (
                  <p className="text-[10px] text-slate-450 dark:text-slate-400 leading-relaxed italic border-t border-slate-200/40 dark:border-slate-850 pt-2 text-left direction-ltr">
                    {analogies[selectedConcept].analogy_en}
                  </p>
                )}

                {/* Concept Code snippet */}
                <pre className="bg-slate-900 text-slate-100 p-2.5 rounded-xl font-mono text-[9px] leading-normal text-left overflow-x-auto">
                  <code>{analogies[selectedConcept].code}</code>
                </pre>
              </motion.div>
            </div>

            <h3 className={`text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2 ${
              lang === 'ar' ? 'flex-row-reverse' : ''
            }`}>
              <Award className="h-5 w-5 text-indigo-500" /> {t.certsTitle}
            </h3>

            {certificates.length > 0 ? (
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                className="space-y-4"
              >
                {certificates.map((cert) => (
                  <motion.div 
                    key={cert.id} 
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
                    }}
                    className={`rounded-xl border border-amber-500/20 dark:border-amber-500/10 bg-white dark:bg-slate-900 p-4 shadow-sm relative overflow-hidden flex gap-3.5 items-center hover-premium-card hover:border-amber-500/40 dark:hover:border-amber-500/30 ${
                      lang === 'ar' ? 'flex-row-reverse text-right' : 'text-left'
                    }`}
                  >
                    {/* Gold verified border badge line */}
                    <div className={`absolute top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600 ${
                      lang === 'ar' ? 'right-0' : 'left-0'
                    }`}></div>
                    
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100/30 dark:border-amber-900/30 shadow-inner">
                      <ShieldCheck className="h-5.5 w-5.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{cert.course_title}</h4>
                      <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-0.5">ID: {cert.uuid.slice(0, 8)}</p>
                      
                      <Link 
                        href={`/certificates/${cert.uuid}`}
                        className={`text-[10px] font-extrabold text-indigo-650 dark:text-indigo-400 hover:underline mt-2 block flex items-center gap-0.5 cursor-pointer ${
                          lang === 'ar' ? 'justify-end' : ''
                        }`}
                      >
                        {t.viewDownload} <ArrowRight className={`h-2.5 w-2.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500 bg-white dark:bg-slate-900/20 shadow-inner">
                <Award className="h-7 w-7 text-slate-300 mx-auto mb-2 animate-bounce" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t.noCerts}</p>
                <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-1 leading-relaxed">{t.certsDesc}</p>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Persistent Donation widget placed on bottom left */}
      <DonationWidget />
    </div>
  );
}
