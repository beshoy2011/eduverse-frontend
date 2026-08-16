'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import DonationWidget from '@/components/DonationWidget';
import { api, CourseDetail } from '@/lib/api';
import { 
  BookOpen, Clock, Award, Zap, ChevronRight, Play, 
  ArrowLeft, GraduationCap, ShieldCheck, Loader2 
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const courseTranslations = {
  en: {
    back: "Back to Dashboard",
    resume: "Resume Learning",
    enroll: "Enroll in Course",
    enrolling: "Enrolling...",
    badgeInfo: "100% Free • Verified Certificate Included",
    roadmapTitle: "Syllabus Course Roadmap",
    lessonLabel: "Lesson {current} of {total}",
    finalExam: "Course Final Exam",
    finalExamDesc: "Required to unlock completion certificate",
    certTitle: "Earn a Verified Certificate",
    certDesc: "Once you finish all syllabus lessons, you will unlock the final exam. Score 70% or more to instantly generate an official EduVerse certificate signed by CEO Beshoy Simon. A PDF copy will be emailed directly to you and will remain available for download from your dashboard at any time.",
    notFound: "Course Not Found",
    loading: "Loading course details...",
    difficulty: "Difficulty",
    duration: "Duration"
  },
  ar: {
    back: "العودة إلى لوحة التحكم",
    resume: "متابعة التعلم",
    enroll: "تسجيل بالدورة",
    enrolling: "جاري التسجيل...",
    badgeInfo: "مجاني 100% • يتضمن شهادة معتمدة",
    roadmapTitle: "خارطة طريق منهج الدورة",
    lessonLabel: "الدرس {current} من {total}",
    finalExam: "الامتحان النهائي للدورة",
    finalExamDesc: "مطلوب لاجتياز الدورة والحصول على الشهادة",
    certTitle: "احصل على شهادة معتمدة وموثقة",
    certDesc: "بمجرد الانتهاء من جميع دروس المنهج، ستتمكن من فتح الامتحان النهائي. احصل على نسبة 70% أو أكثر لتوليد شهادة EduVerse الرسمية الموقعة من الرئيس التنفيذي Beshoy Simon على الفور. سيتم إرسال نسخة PDF إلى بريدك الإلكتروني مباشرة وتظل متاحة للتنزيل من لوحة التحكم الخاصة بك في أي وقت.",
    notFound: "الدورة غير موجودة",
    loading: "جاري تحميل تفاصيل الدورة...",
    difficulty: "المستوى",
    duration: "المدة"
  }
};

const translateCourseDetail = (course: CourseDetail, currentLang: 'en' | 'ar') => {
  if (currentLang === 'en') return course;
  
  const titleLower = course.title.toLowerCase();
  
  if (titleLower.includes("python basics") || titleLower.includes("أساسيات بايثون")) {
    return {
      ...course,
      title: "أساسيات بايثون",
      description: "تعلم لغة بايثون، اللغة الأكثر شعبية وتنوعاً في العالم. مثالية لكتابة السكربتات والأتمتة وتطوير تطبيقات الويب والذكاء الاصطناعي.",
      skills: "بايثون,المتغيرات,التكرار,الدوال,بنيات البيانات",
      difficulty: "مبتدئ",
      lessons: course.lessons.map(l => {
        if (l.title.includes("Introduction to Python")) return { ...l, title: "مقدمة إلى بايثون" };
        if (l.title.includes("Installing Python & Setup")) return { ...l, title: "تثبيت وإعداد بايثون" };
        if (l.title.includes("Variables in Python")) return { ...l, title: "المتغيرات في بايثون" };
        return l;
      })
    };
  }
  if (titleLower.includes("c++ basics") || titleLower.includes("أساسيات سي بلس بلس")) {
    return {
      ...course,
      title: "أساسيات سي بلس بلس",
      description: "استكشف القواعد الأساسية للغة سي بلس بلس، أمان الأنواع، بنيات الذاكرة، والعمليات على مستوى الهاردوير.",
      skills: "سي بلس بلس,التجميع,المؤشرات,الذاكرة,التحكم في التدفق",
      difficulty: "متوسط",
      lessons: course.lessons.map(l => {
        if (l.title.includes("Introduction to C++")) return { ...l, title: "مقدمة إلى لغة C++" };
        if (l.title.includes("Variables & Static Typing")) return { ...l, title: "المتغيرات وأنواع البيانات الثابتة" };
        return l;
      })
    };
  }
  if (titleLower.includes("web development") || titleLower.includes("أساسيات تطوير الويب")) {
    return {
      ...course,
      title: "أساسيات تطوير الويب",
      description: "ابنِ مواقع ويب متجاوبة بالكامل مع مختلف الشاشات من الصفر باستخدام HTML5 و CSS3 ونظام التخطيط Flexbox وجافا سكريبت لتفاعل حيوي.",
      skills: "HTML5,CSS3,Flexbox,Grid,DOM Events,JS",
      difficulty: "مبتدئ",
      lessons: course.lessons.map(l => {
        if (l.title.includes("HTML Basics")) return { ...l, title: "أساسيات وبنية لغة HTML" };
        if (l.title.includes("CSS Layout")) return { ...l, title: "تخطيط الصفحة وتنسيقها باستخدام Flexbox" };
        return l;
      })
    };
  }
  if (titleLower.includes("medium python") || titleLower.includes("بايثون - المستوى المتوسط")) {
    return {
      ...course,
      title: "بايثون - المستوى المتوسط",
      description: "تعمق في مفاهيم بايثون المتقدمة مثل البرمجة كائنية التوجه (OOP)، التعامل مع الملفات والأخطاء، وتطبيقات عملية متوسطة.",
      skills: "OOP,الفئات,الكائنات,الوراثة,إدارة الملفات,معالجة الاستثناءات",
      difficulty: "متوسط",
      lessons: course.lessons.map(l => {
        if (l.title.includes("File Manipulation")) return { ...l, title: "التعامل مع الملفات في بايثون" };
        if (l.title.includes("Exception Handling")) return { ...l, title: "معالجة الاستثناءات (Try/Except)" };
        if (l.title.includes("Modules and Packages")) return { ...l, title: "الموديولات والمكتبات (Modules & Packages)" };
        if (l.title.includes("JSON Serialization")) return { ...l, title: "تسلسل ومعالجة ملفات JSON" };
        return l;
      })
    };
  }
  if (titleLower.includes("pro python") || titleLower.includes("بايثون للمحترفين")) {
    return {
      ...course,
      title: "بايثون للمحترفين",
      description: "احترف تقنيات بايثون المتقدمة مثل المولدات (Generators)، المنسقات (Decorators)، البرمجة المتزامنة (Asynchronous)، ومكتبات تحليل البيانات.",
      skills: "Generators,Decorators,Asyncio,Multithreading,Numpy,Pandas",
      difficulty: "محترف",
      lessons: course.lessons.map(l => {
        if (l.title.includes("Classes and Objects")) return { ...l, title: "الفئات والكائنات (Classes & Objects)" };
        if (l.title.includes("Methods & Self")) return { ...l, title: "الدوال والكلمة المفتاحية self" };
        if (l.title.includes("Inheritance and Polymorphism")) return { ...l, title: "الوراثة وتعدد الأشكال (Inheritance & Polymorphism)" };
        if (l.title.includes("Encapsulation")) return { ...l, title: "كتم البيانات والخصوصية (Encapsulation)" };
        return l;
      })
    };
  }
  if (titleLower.includes("advanced python") || titleLower.includes("بايثون المتقدم والذكاء الاصطناعي")) {
    return {
      ...course,
      title: "بايثون المتقدم والذكاء الاصطناعي",
      description: "استكشف آفاق الذكاء الاصطناعي، تعلم الآلة (Machine Learning)، معالجة اللغات الطبيعية (NLP)، وبناء نماذج ذكية باستخدام بايثون.",
      skills: "Machine Learning,Deep Learning,NLP,TensorFlow,Scikit-Learn",
      difficulty: "متقدم",
      lessons: course.lessons.map(l => {
        if (l.title.includes("Decorators")) return { ...l, title: "المنسقات والمزخرفات (Decorators)" };
        if (l.title.includes("Generators & Yield")) return { ...l, title: "المولدات والكلمة المفتاحية Yield" };
        if (l.title.includes("Concurrency")) return { ...l, title: "التزامن وتعدد المهام (Concurrency & Multithreading)" };
        return l;
      })
    };
  }

  return course;
};

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.courseId);

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [lang, setLang] = useState<'en' | 'ar'>('en');

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
    async function loadCourseDetail() {
      try {
        const data = await api.getCourseDetail(courseId);
        setCourse(data);

        // Check if enrolled
        const token = localStorage.getItem('eduverse_token');
        if (token) {
          const enrolled = await api.getEnrolledCourses();
          const enrolledMatch = enrolled.some(c => c.id === courseId);
          setIsEnrolled(enrolledMatch);
        }
      } catch (err) {
        console.error('Failed to load course details API, loading mock', err);
        // Fallback mockup
        const fallbackCourses: Record<number, CourseDetail> = {
          1: {
            id: 1,
            title: "Python Basics",
            description: "Learn Python Basics from variable scopes to dictionary storage models.",
            skills: "Python,Variables,Loops,Functions,Data Structures",
            duration: "10 hours",
            difficulty: "Beginner",
            theme_style: "cosmic",
            lessons: [
              { id: 1, course_id: 1, title: "Introduction to Python", sequence_order: 1 },
              { id: 2, course_id: 1, title: "Installing Python & Setup", sequence_order: 2 },
              { id: 3, course_id: 1, title: "Variables in Python", sequence_order: 3 }
            ]
          },
          2: {
            id: 2,
            title: "C++ Basics",
            description: "Explore compiler logic, types, pointer references, and memory buffers.",
            skills: "C++,Compilation,Pointers,Memory,Control Flow",
            duration: "12 hours",
            difficulty: "Medium",
            theme_style: "cyberpunk",
            lessons: [
              { id: 13, course_id: 2, title: "Introduction to C++", sequence_order: 1 },
              { id: 14, course_id: 2, title: "Variables & Static Typing", sequence_order: 2 }
            ]
          },
          3: {
            id: 3,
            title: "Web Development Fundamentals",
            description: "Build interactive browser layouts with HTML, CSS, Flexbox and Javascript.",
            skills: "HTML5,CSS3,Flexbox,Grid,DOM Events",
            duration: "15 hours",
            difficulty: "Beginner",
            theme_style: "creative",
            lessons: [
              { id: 17, course_id: 3, title: "HTML Basics & Structure", sequence_order: 1 },
              { id: 18, course_id: 3, title: "CSS Layout: Flexbox", sequence_order: 2 }
            ]
          },
          4: {
            id: 4,
            title: "Medium Python",
            description: "Take your Python skills to the next level. Learn file handling, exception handling, JSON serialization, and using native and external libraries.",
            skills: "File handling,Exception Handling,JSON,Modules,Libraries",
            duration: "12 hours",
            difficulty: "Medium",
            theme_style: "cosmic",
            lessons: [
              { id: 41, course_id: 4, title: "File Manipulation in Python", sequence_order: 1 },
              { id: 42, course_id: 4, title: "Exception Handling (Try/Except)", sequence_order: 2 },
              { id: 43, course_id: 4, title: "Modules and Packages", sequence_order: 3 },
              { id: 44, course_id: 4, title: "JSON Serialization", sequence_order: 4 }
            ]
          },
          5: {
            id: 5,
            title: "Pro Python",
            description: "Master Object-Oriented Programming (OOP) in Python. Understand Classes, Objects, Inheritance, Polymorphism, and encapsulation like a professional developer.",
            skills: "OOP,Classes,Objects,Inheritance,Methods,Polymorphism",
            duration: "15 hours",
            difficulty: "Medium",
            theme_style: "cosmic",
            lessons: [
              { id: 51, course_id: 5, title: "Classes and Objects", sequence_order: 1 },
              { id: 52, course_id: 5, title: "Methods & Self", sequence_order: 2 },
              { id: 53, course_id: 5, title: "Inheritance and Polymorphism", sequence_order: 3 },
              { id: 54, course_id: 5, title: "Encapsulation & Private Members", sequence_order: 4 }
            ]
          },
          6: {
            id: 6,
            title: "Advanced Python",
            description: "Deep dive into Python's advanced mechanics: Decorators, Generators, Iterators, Context Managers, and Multithreading.",
            skills: "Generators,Decorators,Context Managers,Concurrency,Multithreading",
            duration: "18 hours",
            difficulty: "Hard",
            theme_style: "cosmic",
            lessons: [
              { id: 61, course_id: 6, title: "Decorators in Python", sequence_order: 1 },
              { id: 62, course_id: 6, title: "Generators & Yield", sequence_order: 2 },
              { id: 63, course_id: 6, title: "Concurrency & Multithreading", sequence_order: 3 }
            ]
          }
        };
        setCourse(fallbackCourses[courseId] || null);
      } finally {
        setLoading(false);
      }
    }

    loadCourseDetail();
  }, [courseId]);
  
  const renderThemePreview = (theme: string) => {
    switch (theme) {
      case 'cosmic':
        return (
          <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.2),transparent_70%)] animate-pulse-soft"></div>
            <div className="absolute top-10 left-10 w-1.5 h-1.5 rounded-full bg-white animate-ping"></div>
            <div className="absolute bottom-12 right-16 w-1 h-1 rounded-full bg-indigo-300 animate-pulse"></div>
            <div className="absolute top-20 right-8 w-2 h-2 rounded-full bg-violet-400 animate-bounce"></div>
            <div className="w-24 h-24 rounded-full border border-indigo-400/30 flex items-center justify-center animate-spin-slow">
              <div className="w-16 h-16 rounded-full border border-violet-400/40 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-[0_0_12px_#6366f1]"></div>
              </div>
              <div className="absolute -top-1 w-2.5 h-2.5 rounded-full bg-pink-400"></div>
            </div>
            <div className="absolute bottom-2.5 left-3 text-[9px] uppercase tracking-wider font-extrabold text-indigo-300">Cosmic Lobby Arena</div>
          </div>
        );
      case 'cyberpunk':
        return (
          <div className="relative w-full h-44 rounded-xl overflow-hidden bg-black flex flex-col justify-between p-3 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)] font-mono text-[9px] text-cyan-400">
            <div className="absolute inset-0 bg-slate-950/80"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:16px_16px] opacity-20"></div>
            <div className="relative z-10 flex justify-between items-center border-b border-cyan-950 pb-1.5">
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping"></span> SYSTEM_ONLINE</span>
              <span className="text-pink-500">v4.0.2</span>
            </div>
            <div className="relative z-10 flex-1 py-2 space-y-1">
              <div>&gt; INITIALIZING_COMPILER... <span className="text-white">OK</span></div>
              <div>&gt; LOADING_NEURAL_RESOURCES... <span className="text-pink-500 animate-pulse">100%</span></div>
              <div>&gt; INJECTING_CYBER_MATRIX... <span className="text-cyan-200">READY</span></div>
            </div>
            <div className="relative z-10 flex justify-between text-[8px] text-cyan-500/80 border-t border-cyan-950 pt-1.5">
              <span>ADDR: 0x8F92A</span>
              <span className="animate-pulse">_BLINK</span>
            </div>
          </div>
        );
      case 'volcano':
        return (
          <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <div className="absolute inset-0 bg-gradient-to-t from-red-950/60 to-transparent"></div>
            <div className="absolute h-24 w-24 rounded-full bg-gradient-to-tr from-orange-600 to-red-600 blur-xl opacity-60 animate-pulse-soft"></div>
            <div className="absolute h-14 w-14 rounded-full bg-amber-500 blur-md opacity-80 animate-ping"></div>
            <div className="absolute bottom-5 left-10 w-2 h-4 bg-orange-500 rounded-full blur-xs animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="absolute bottom-8 right-12 w-3 h-5 bg-red-500 rounded-full blur-xs animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            <div className="absolute bottom-3 left-1/2 w-2.5 h-4 bg-amber-400 rounded-full blur-xs animate-bounce" style={{ animationDelay: '0s' }}></div>
            
            <span className="relative z-10 text-xs font-black text-amber-100 uppercase tracking-widest bg-red-950/80 px-2.5 py-1.5 rounded-lg border border-red-550/40">Lava Arena Lobby</span>
          </div>
        );
      case 'creative':
        return (
          <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
            <div className="absolute top-4 left-6 h-20 w-20 rounded-full bg-pink-500/10 blur-xl animate-float-1"></div>
            <div className="absolute bottom-4 right-6 h-24 w-24 rounded-full bg-cyan-500/15 blur-xl animate-float-2"></div>
            
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="h-2 w-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="h-2 w-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
              <span className="text-[10px] font-black text-white tracking-widest uppercase bg-slate-900/80 border border-pink-500/20 px-3 py-1 rounded-full">Creative Canvas</span>
            </div>
          </div>
        );
      case 'electric':
        return (
          <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.1),transparent_70%)] animate-pulse-soft"></div>
            <div className="absolute h-0.5 w-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent top-1/2 opacity-30 animate-pulse"></div>
            <div className="absolute w-0.5 h-full bg-gradient-to-b from-transparent via-yellow-400 to-transparent left-1/3 opacity-20 animate-pulse"></div>
            
            <div className="absolute flex flex-col items-center">
              <Zap className="h-10 w-10 text-yellow-400 fill-current animate-bounce shadow-glow" />
              <span className="text-[9px] font-black text-yellow-300 uppercase tracking-widest mt-1">VOLTAGE ACTIVATED</span>
            </div>
          </div>
        );
      case 'laboratory':
        return (
          <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950 to-indigo-950"></div>
            
            <div className="absolute inset-0 flex flex-wrap gap-2 p-3 opacity-25">
              <div className="h-1.5 w-1.5 rounded-full bg-violet-400"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-violet-400"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-violet-400"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-violet-400"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl border border-violet-500/40 flex items-center justify-center bg-violet-950/30 animate-spin-slow">
                <div className="w-6 h-6 rounded bg-violet-500 shadow-[0_0_10px_#8b5cf6]"></div>
              </div>
              <span className="text-[8px] font-mono tracking-widest text-violet-300 uppercase mt-2">AI LAB ENVIRONMENT</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center border border-slate-700/30">
            <GraduationCap className="h-10 w-10 text-slate-500" />
            <span className="absolute bottom-2 text-[9px] uppercase tracking-wider font-extrabold text-slate-400">EduVerse Study Room</span>
          </div>
        );
    }
  };

  const handleEnroll = async () => {
    const token = localStorage.getItem('eduverse_token');
    if (!token) {
      router.push('/login');
      return;
    }

    setEnrolling(true);
    try {
      await api.enrollInCourse(courseId);
      setIsEnrolled(true);
      if (course && course.lessons.length > 0) {
        router.push(`/courses/${courseId}/lessons/${course.lessons[0].id}`);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Failed to enroll, redirecting to workspace', err);
      if (course && course.lessons.length > 0) {
        router.push(`/courses/${courseId}/lessons/${course.lessons[0].id}`);
      }
    } finally {
      setEnrolling(false);
    }
  };

  const t = courseTranslations[lang];

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

  if (!course) {
    return (
      <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.notFound}</h2>
          <Link href="/dashboard" className="text-xs font-bold text-indigo-600 mt-2 hover:underline">
            {t.back}
          </Link>
        </div>
      </div>
    );
  }

  const localCourse = translateCourseDetail(course, lang);

  return (
    <div className="flex flex-col min-h-screen bg-[#050609] text-slate-100 font-sans select-none pb-12">
      <Navbar />

      <motion.main 
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
        className="flex-1 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8"
      >
        {/* Back Link */}
        <motion.div
          variants={{
            hidden: { opacity: 0, x: lang === 'ar' ? 10 : -10 },
            visible: { opacity: 1, x: 0 }
          }}
          className={lang === 'ar' ? 'text-right' : 'text-left'}
        >
          <Link 
            href="/courses" 
            className={`inline-flex items-center gap-1.5 text-xs font-mono-code font-bold text-slate-400 hover:text-white transition-colors ${
              lang === 'ar' ? 'flex-row-reverse' : ''
            }`}
          >
            <ArrowLeft className={`h-4 w-4 ${lang === 'ar' ? 'rotate-180' : ''}`} /> {t.back}
          </Link>
        </motion.div>

        {/* --- COURSE HEADER HERO --- */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
          }}
          className={`rounded-md border border-[#1a2233] bg-[#080a0f] p-6 md:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all font-mono-code ${
            lang === 'ar' ? 'flex-row-reverse text-right font-sans' : 'text-left'
          }`}
        >
          <div className="space-y-4 max-w-xl flex-1">
            <div className={`flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              <span className="rounded bg-indigo-500/10 border border-indigo-500/30 py-1 px-2.5 text-xs font-bold text-indigo-400">
                {localCourse.difficulty}
              </span>
              <span className={`inline-flex items-center gap-1 text-xs text-slate-400 ${
                lang === 'ar' ? 'flex-row-reverse' : ''
              }`}>
                <Clock className="h-3.5 w-3.5 text-slate-500" /> {localCourse.duration}
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-extrabold text-white font-sans">{localCourse.title}</h1>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">{localCourse.description}</p>
            
            {/* Skills grid */}
            <div className={`flex flex-wrap gap-2 pt-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              {localCourse.skills.split(',').map((skill, index) => (
                <span key={index} className="rounded bg-[#0d1117] px-2.5 py-1 text-[11px] font-semibold text-slate-400 border border-[#1a2233]">
                  {skill}
                </span>
              ))}
            </div>

            <div className="pt-4 font-mono-code">
              {isEnrolled ? (
                <Link
                  href={`/courses/${courseId}/lessons/${course.lessons[0]?.id || 1}`}
                  className="edu-btn edu-btn-primary px-6 py-3 text-xs font-bold"
                >
                  <span>{t.resume}</span>
                  <Play className={`h-4 w-4 fill-current ${lang === 'ar' ? 'rotate-180' : ''}`} />
                </Link>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="edu-btn edu-btn-primary px-6 py-3 text-xs font-bold"
                >
                  <span>{enrolling ? t.enrolling : t.enroll}</span>
                  <GraduationCap className="h-4 w-4" />
                </button>
              )}
              <p className="text-[10px] text-slate-500 mt-2 font-mono-code">{t.badgeInfo}</p>
            </div>
          </div>

          <div className="w-full md:w-72 shrink-0 flex flex-col gap-4 font-mono-code">
            {renderThemePreview(course.theme_style)}

            {/* Quick Parameters Card */}
            <div className="bg-[#0d1117] p-4 rounded border border-[#1a2233] text-xs space-y-2.5">
              <div className={`flex justify-between items-center text-[10px] font-bold uppercase text-slate-400 tracking-wider ${
                lang === 'ar' ? 'flex-row-reverse' : ''
              }`}>
                <span>{lang === 'ar' ? 'معايير الدورة' : 'PATHWAY PARAMETERS'}</span>
                <span className="text-emerald-400 font-bold">100% Free</span>
              </div>
              <div className={`flex justify-between text-slate-300 ${
                lang === 'ar' ? 'flex-row-reverse' : ''
              }`}>
                <span className="text-slate-500">{lang === 'ar' ? 'المجموعات البرمجية' : 'Syllabus Chapters'}</span>
                <span className="font-bold text-white">{course.lessons.length} Lessons</span>
              </div>
              <div className={`flex justify-between text-slate-300 ${
                lang === 'ar' ? 'flex-row-reverse' : ''
              }`}>
                <span className="text-slate-500">{lang === 'ar' ? 'مستوى التحدي' : 'Track Difficulty'}</span>
                <span className="font-bold text-indigo-400 uppercase tracking-wider">{course.difficulty}</span>
              </div>
              <div className={`flex justify-between text-slate-300 ${
                lang === 'ar' ? 'flex-row-reverse' : ''
              }`}>
                <span className="text-slate-500">{lang === 'ar' ? 'الشهادة الممنوحة' : 'Verified Signature'}</span>
                <span className="font-bold text-emerald-400">ACTIVE ✔</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- SYLLABUS LESSONS LIST --- */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
          }}
          className="space-y-4 font-mono-code"
        >
          <h2 className={`text-base font-bold text-white flex items-center gap-2 ${
            lang === 'ar' ? 'flex-row-reverse text-right' : ''
          }`}>
            <BookOpen className="h-4 w-4 text-indigo-400" /> {t.roadmapTitle}
          </h2>

          <div className="rounded-md border border-[#1a2233] bg-[#080a0f] overflow-hidden divide-y divide-[#1a2233] transition-colors">
            {localCourse.lessons.map((lesson, idx) => (
              <Link 
                href={`/courses/${courseId}/lessons/${lesson.id}`}
                key={lesson.id} 
                className={`p-4 flex items-center justify-between hover:bg-[#0d1117] transition-colors ${
                  lang === 'ar' ? 'flex-row-reverse' : ''
                }`}
              >
                <div className={`flex items-center gap-4 ${lang === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                  <div className="flex h-7 w-7 items-center justify-center rounded bg-[#0d1117] border border-[#1a2233] text-xs font-bold text-slate-400">
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-200 font-sans">{lesson.title}</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {t.lessonLabel
                        .replace("{current}", (idx + 1).toString())
                        .replace("{total}", localCourse.lessons.length.toString())}
                    </p>
                  </div>
                </div>

                <ChevronRight className={`h-4 w-4 text-slate-500 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </Link>
            ))}

            {/* Final Exam Roadmap node */}
            <Link 
              href={`/exam/${courseId}`}
              className={`p-4 flex items-center justify-between bg-[#0d1117]/60 hover:bg-[#0d1117] transition-colors ${
                lang === 'ar' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`flex items-center gap-4 ${lang === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                <div className="flex h-7 w-7 items-center justify-center rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-indigo-400 font-sans">{t.finalExam}</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">{t.finalExamDesc}</p>
                </div>
              </div>
              
              <ChevronRight className={`h-4 w-4 text-indigo-400 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </motion.div>

        {/* --- CERTIFICATE INFORMATION FOOTER BLOCK --- */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
          }}
          className={`rounded-md border border-emerald-500/20 bg-emerald-500/5 p-5 flex gap-4 items-start font-mono-code ${
            lang === 'ar' ? 'flex-row-reverse text-right' : 'text-left'
          }`}
        >
          <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h3 className="font-bold text-white font-sans">{t.certTitle}</h3>
            <p className="text-slate-400 mt-1 leading-relaxed font-sans">
              {t.certDesc}
            </p>
          </div>
        </motion.div>

      </motion.main>

      {/* Persistent Donation widget */}
      <DonationWidget />
    </div>
  );
}
