'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ChatPanel from '@/components/ChatPanel';
import CodePlayground from '@/components/CodePlayground';
import { api, CourseDetail, LessonDetail } from '@/lib/api';
import { 
  BookOpen, CheckSquare, Square, ChevronLeft, ChevronRight, 
  HelpCircle, Bot, Award, Code, CheckCircle, Loader2, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const lessonTranslations = {
  en: {
    syllabus: "Course Syllabus",
    finalExam: "Final Exam",
    locked: "Locked",
    lessonLabel: "Lesson {current} of {total}",
    practiceTitle: "Practice Challenge",
    solveToProceed: "Solve Practice Challenge to Proceed",
    markComplete: "Mark as Read & Complete",
    prevLesson: "Previous Lesson",
    nextLesson: "Next Lesson",
    takeExam: "Take Final Exam",
    notFound: "Lesson Not Found",
    backDashboard: "Back to Dashboard",
    loading: "Loading workspace details..."
  },
  ar: {
    syllabus: "منهج الدورة",
    finalExam: "الامتحان النهائي",
    locked: "مغلق",
    lessonLabel: "الدرس {current} من {total}",
    practiceTitle: "التطبيق البرمجي العملي",
    solveToProceed: "حل التطبيق البرمجي للمتابعة",
    markComplete: "تحديد كمكتمل ومتابعة",
    prevLesson: "الدرس السابق",
    nextLesson: "الدرس التالي",
    takeExam: "بدء الامتحان النهائي",
    notFound: "الدرس غير موجود",
    backDashboard: "العودة إلى لوحة التحكم",
    loading: "جاري تحميل تفاصيل الدرس..."
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

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  
  const courseId = Number(params.courseId);
  const lessonId = Number(params.lessonId);

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    async function loadWorkspaceData() {
      try {
        setLoading(true);
        // Load course details (sidebar)
        const courseData = await api.getCourseDetail(courseId);
        setCourse(courseData);

        // Load specific lesson
        const lessonData = await api.getLesson(lessonId);
        setLesson(lessonData);

        // Load progress
        const progressData = await api.getCourseProgress(courseId);
        setCompletedLessonIds(progressData.completed_lesson_ids);
        
        // Reset challenge status
        setPracticeCompleted(progressData.completed_lesson_ids.includes(lessonId));
      } catch (err) {
        console.error('Failed to load workspace data, loading fallback mocks', err);
        // Fallback mockup
        const offlineCourses: Record<number, CourseDetail> = {
          1: { id: 1, title: "Python Basics", description: "", skills: "", duration: "", difficulty: "Beginner", theme_style: "cosmic", lessons: [
            { id: 1, course_id: 1, title: "Introduction to Python", sequence_order: 1 },
            { id: 2, course_id: 1, title: "Installing Python & Setup", sequence_order: 2 },
            { id: 3, course_id: 1, title: "Variables in Python", sequence_order: 3 }
          ]},
          2: { id: 2, title: "C++ Basics", description: "", skills: "", duration: "", difficulty: "Medium", theme_style: "cyberpunk", lessons: [
            { id: 13, course_id: 2, title: "Introduction to C++", sequence_order: 1 },
            { id: 14, course_id: 2, title: "Variables & Static Typing", sequence_order: 2 }
          ]},
          3: { id: 3, title: "Web Development Fundamentals", description: "", skills: "", duration: "", difficulty: "Beginner", theme_style: "creative", lessons: [
            { id: 17, course_id: 3, title: "HTML Basics & Structure", sequence_order: 1 },
            { id: 18, course_id: 3, title: "CSS Layout: Flexbox", sequence_order: 2 }
          ]},
          4: { id: 4, title: "Medium Python", description: "", skills: "", duration: "", difficulty: "Medium", theme_style: "cosmic", lessons: [
            { id: 41, course_id: 4, title: "File Manipulation in Python", sequence_order: 1 },
            { id: 42, course_id: 4, title: "Exception Handling (Try/Except)", sequence_order: 2 },
            { id: 43, course_id: 4, title: "Modules and Packages", sequence_order: 3 },
            { id: 44, course_id: 4, title: "JSON Serialization", sequence_order: 4 }
          ]},
          5: { id: 5, title: "Pro Python", description: "", skills: "", duration: "", difficulty: "Medium", theme_style: "cosmic", lessons: [
            { id: 51, course_id: 5, title: "Classes and Objects", sequence_order: 1 },
            { id: 52, course_id: 5, title: "Methods & Self", sequence_order: 2 },
            { id: 53, course_id: 5, title: "Inheritance and Polymorphism", sequence_order: 3 },
            { id: 54, course_id: 5, title: "Encapsulation & Private Members", sequence_order: 4 }
          ]},
          6: { id: 6, title: "Advanced Python", description: "", skills: "", duration: "", difficulty: "Hard", theme_style: "cosmic", lessons: [
            { id: 61, course_id: 6, title: "Decorators in Python", sequence_order: 1 },
            { id: 62, course_id: 6, title: "Generators & Yield", sequence_order: 2 },
            { id: 63, course_id: 6, title: "Concurrency & Multithreading", sequence_order: 3 }
          ]}
        };
        const offlineLessons: Record<number, LessonDetail> = {
          1: { id: 1, course_id: 1, title: "Introduction to Python", sequence_order: 1, content: "# Introduction to Python\nWelcome to Python Basics!", code_template: "print('Hello, World!')", practice_questions: [] },
          2: { id: 2, course_id: 1, title: "Installing Python & Setup", sequence_order: 2, content: "# Installing Python\nInstall python to setup.", code_template: "print('Python is set up!')", practice_questions: [] },
          3: { id: 3, course_id: 1, title: "Variables in Python", sequence_order: 3, content: "# Variables in Python\nLearn variables.", code_template: "age = 25\nprint(age)", practice_questions: [] },
          13: { id: 13, course_id: 2, title: "Introduction to C++", sequence_order: 1, content: "# Intro to C++", code_template: "std::cout << \"Hello World!\";", practice_questions: [] },
          14: { id: 14, course_id: 2, title: "Variables & Static Typing", sequence_order: 2, content: "# Variables C++", code_template: "int score = 100;", practice_questions: [] },
          17: { id: 17, course_id: 3, title: "HTML Basics & Structure", sequence_order: 1, content: "# HTML Basics", code_template: "<h1>Hello World!</h1>", practice_questions: [] },
          18: { id: 18, course_id: 3, title: "CSS Layout: Flexbox", sequence_order: 2, content: "# CSS Flexbox", code_template: ".nav-bar { display: flex; }", practice_questions: [] },
          41: { id: 41, course_id: 4, title: "File Manipulation in Python", sequence_order: 1, content: "# File handling", code_template: "f = open('output.txt', 'w')\nf.write('Python')\nf.close()", practice_questions: [] },
          42: { id: 42, course_id: 4, title: "Exception Handling (Try/Except)", sequence_order: 2, content: "# Exception handling", code_template: "try:\n    r = 10 / 0\nexcept ZeroDivisionError:\n    print('Error')", practice_questions: [] },
          43: { id: 43, course_id: 4, title: "Modules and Packages", sequence_order: 3, content: "# Modules", code_template: "import math\nprint(math.sqrt(16))", practice_questions: [] },
          44: { id: 44, course_id: 4, title: "JSON Serialization", sequence_order: 4, content: "# JSON", code_template: "import json\njson.dumps({'name': 'Alice'})", practice_questions: [] },
          51: { id: 51, course_id: 5, title: "Classes and Objects", sequence_order: 1, content: "# Classes", code_template: "class Car:\n    pass", practice_questions: [] },
          52: { id: 52, course_id: 5, title: "Methods & Self", sequence_order: 2, content: "# Methods", code_template: "class Person:\n    pass", practice_questions: [] },
          53: { id: 53, course_id: 5, title: "Inheritance and Polymorphism", sequence_order: 3, content: "# Inheritance", code_template: "class ElectricCar(Car):\n    pass", practice_questions: [] },
          54: { id: 54, course_id: 5, title: "Encapsulation & Private Members", sequence_order: 4, content: "# Encapsulation", code_template: "class BankAccount:\n    pass", practice_questions: [] },
          61: { id: 61, course_id: 6, title: "Decorators in Python", sequence_order: 1, content: "# Decorators", code_template: "def dec():\n    pass", practice_questions: [] },
          62: { id: 62, course_id: 6, title: "Generators & Yield", sequence_order: 2, content: "# Generators", code_template: "def count():\n    yield 1", practice_questions: [] },
          63: { id: 63, course_id: 6, title: "Concurrency & Multithreading", sequence_order: 3, content: "# Concurrency", code_template: "import threading", practice_questions: [] }
        };
        setCourse(offlineCourses[courseId] || null);
        setLesson(offlineLessons[lessonId] || null);
      } finally {
        setLoading(false);
      }
    }

    loadWorkspaceData();
  }, [courseId, lessonId]);

  const handleChallengePassed = async () => {
    setPracticeCompleted(true);
    try {
      await api.markLessonComplete(lessonId);
      // Refresh completed lessons checkmarks
      const progressData = await api.getCourseProgress(courseId);
      setCompletedLessonIds(progressData.completed_lesson_ids);
    } catch (err) {
      console.error('Failed to record completion progress', err);
    }
  };

  const t = lessonTranslations[lang];

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

  if (!course || !lesson) {
    return (
      <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold">{t.notFound}</h2>
          <Link href="/dashboard" className="text-xs text-indigo-600 mt-2 hover:underline">
            {t.backDashboard}
          </Link>
        </div>
      </div>
    );
  }

  const localCourse = translateCourseDetail(course, lang);
  const localLesson = {
    ...lesson,
    title: localCourse.lessons.find(l => l.id === lessonId)?.title || lesson.title
  };

  // Calculate syllabus indices for navigation
  const currentIndex = localCourse.lessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? localCourse.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < localCourse.lessons.length - 1 ? localCourse.lessons[currentIndex + 1] : null;
  const allLessonsCompleted = localCourse.lessons.every(l => completedLessonIds.includes(l.id));

  // Render markdown parser simply
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
        {lines.map((line, idx) => {
          if (line.startsWith('# ')) return <h1 key={idx} className="text-2xl font-bold text-slate-900 dark:text-white mt-6 mb-3">{line.slice(2)}</h1>;
          if (line.startsWith('## ')) return <h2 key={idx} className="text-xl font-semibold text-slate-900 dark:text-white mt-5 mb-2.5">{line.slice(3)}</h2>;
          if (line.startsWith('### ')) return <h3 key={idx} className="text-lg font-semibold text-slate-900 dark:text-white mt-4 mb-2">{line.slice(4)}</h3>;
          if (line.startsWith('```python') || line.startsWith('```cpp') || line.startsWith('```html') || line.startsWith('```css') || line.startsWith('```javascript')) {
            return null;
          }
          if (line.startsWith('```')) return null;
          
          if (line.startsWith('print(') || line.startsWith('int age') || line.startsWith('std::cout') || line.startsWith('import ') || line.startsWith('f = ') || line.startsWith('class ')) {
            return (
              <pre key={idx} className="bg-slate-900 text-slate-100 p-3.5 rounded-lg font-mono text-xs my-3 overflow-x-auto leading-relaxed text-left">
                <code>{line}</code>
              </pre>
            );
          }
          
          if (!line.trim()) return <div key={idx} className="h-2"></div>;
          
          return <p key={idx} className="mb-3">{line}</p>;
        })}
      </div>
    );
  };

  const rtlClass = lang === 'ar' ? 'right-0' : 'left-0';
  const rtlTranslateClass = lang === 'ar' ? 'translate-x-full' : '-translate-x-full';

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Toggle mobile sidebar */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`md:hidden absolute top-3 z-45 bg-indigo-600 text-white rounded p-2 shadow cursor-pointer ${
            lang === 'ar' ? 'left-3' : 'left-3'
          }`}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* --- LEFT SIDEBAR: Course syllabus outline --- */}
        <aside 
          className={`w-64 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-900 p-4 overflow-y-auto shrink-0 transition-transform md:translate-x-0 z-30 ${
            sidebarOpen 
              ? `translate-x-0 absolute inset-y-0 ${rtlClass} shadow-2xl animate-float-3` 
              : `${rtlTranslateClass} absolute md:relative`
          }`}
        >
          <div className={`flex items-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-900 ${
            lang === 'ar' ? 'flex-row-reverse text-right' : 'text-left'
          }`}>
            <BookOpen className="h-4.5 w-4.5 text-indigo-500" />
            <h3 className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t.syllabus}</h3>
          </div>
          
          <nav className="mt-4 space-y-1">
            {localCourse.lessons.map((l, index) => {
              const isActive = l.id === lessonId;
              const isDone = completedLessonIds.includes(l.id);
              
              return (
                <Link
                  key={l.id}
                  href={`/courses/${courseId}/lessons/${l.id}`}
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center justify-between rounded-lg py-2 px-3 text-xs font-bold transition-all border-l-2 ${
                    isActive 
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 shadow-sm' 
                      : 'text-slate-650 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-200 border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                  } ${lang === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}
                >
                  <div className={`flex items-center gap-2 truncate ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <span className="shrink-0 text-[10px] font-medium text-slate-400">{index + 1}.</span>
                    <span className="truncate">{l.title}</span>
                  </div>
                  
                  {isDone ? (
                    <CheckCircle className={`h-4 w-4 shrink-0 ${isActive ? 'text-indigo-650' : 'text-emerald-500'}`} />
                  ) : (
                    <div className={`h-3.5 w-3.5 shrink-0 rounded-full border ${isActive ? 'border-indigo-400' : 'border-slate-300 dark:border-slate-800'}`}></div>
                  )}
                </Link>
              );
            })}

            {/* Exam Sidebar link */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-2 my-2"></div>
            <Link
              href={allLessonsCompleted ? `/exam/${courseId}` : '#'}
              className={`w-full flex items-center justify-between rounded-lg p-2.5 text-xs font-bold transition-all ${
                allLessonsCompleted 
                  ? 'bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-50 hover:text-white'
                  : 'text-slate-400 cursor-not-allowed'
              } ${lang === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}
            >
              <span className={`flex items-center gap-1 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <Award className="h-4 w-4" /> {t.finalExam}
              </span>
              {!allLessonsCompleted && <span className="text-[9px] uppercase font-bold tracking-wider opacity-85">{t.locked}</span>}
            </Link>
          </nav>
        </aside>

        {/* --- MAIN AREA: Content + Practice sandbox --- */}
        <div className={`flex-1 flex flex-col md:flex-row min-w-0 overflow-y-auto ${
          lang === 'ar' ? 'md:flex-row-reverse' : ''
        }`}>
          {/* Lesson viewport */}
          <motion.div
            key={lessonId}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`flex-1 p-6 space-y-6 min-w-0 max-w-3xl mx-auto md:mx-0 ${
              lang === 'ar' ? 'text-right' : 'text-left'
            }`}
          >
            {/* Header info */}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {t.lessonLabel
                  .replace("{current}", (currentIndex + 1).toString())
                  .replace("{total}", localCourse.lessons.length.toString())}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{localLesson.title}</h2>
            </div>
            
            {/* Markdown Body */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl p-5 md:p-6 shadow-sm transition-colors">
              {renderContent(localLesson.content)}
            </div>

            {/* Coding Challenge editor wrapper */}
            {localLesson.code_template && (
              <div className="space-y-3 pt-4">
                <h3 className={`text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 ${
                  lang === 'ar' ? 'flex-row-reverse' : ''
                }`}>
                  <Code className="h-5 w-5 text-indigo-500" /> {t.practiceTitle}
                </h3>
                
                <div className="h-[420px]">
                  <CodePlayground
                    courseId={String(courseId)}
                    initialCode={localLesson.code_template}
                    solution={localLesson.solution || ''}
                    testCases={localLesson.test_cases || []}
                    onChallengePassed={handleChallengePassed}
                    lessonTitle={localLesson.title}
                    lessonContent={localLesson.content}
                  />
                </div>
              </div>
            )}

            {/* --- BOTTOM NAVIGATION STEP BAR --- */}
            <div className={`border-t border-slate-200 dark:border-slate-800/80 pt-6 mt-8 flex items-center justify-between gap-4 pb-10 select-none ${
              lang === 'ar' ? 'flex-row-reverse' : ''
            }`}>
              {prevLesson ? (
                <Link
                  href={`/courses/${courseId}/lessons/${prevLesson.id}`}
                  className={`inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors ${
                    lang === 'ar' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <ChevronLeft className={`h-4.5 w-4.5 ${lang === 'ar' ? 'rotate-180' : ''}`} /> {t.prevLesson}
                </Link>
              ) : (
                <div />
              )}

              {/* Progress verification check */}
              {practiceCompleted ? (
                nextLesson ? (
                  <Link
                    href={`/courses/${courseId}/lessons/${nextLesson.id}`}
                    className={`inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-indigo-500 transition-colors ${
                      lang === 'ar' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    {t.nextLesson} <ChevronRight className={`h-4.5 w-4.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </Link>
                ) : (
                  <Link
                    href={`/exam/${courseId}`}
                    className={`inline-flex items-center gap-1 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-amber-400 transition-colors animate-bounce ${
                      lang === 'ar' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    {t.takeExam} <Award className="h-4.5 w-4.5" />
                  </Link>
                )
              ) : localLesson.code_template ? (
                <button
                  disabled
                  className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/40 px-4 py-2.5 text-xs font-semibold text-slate-400 dark:text-slate-500 cursor-not-allowed"
                >
                  {t.solveToProceed}
                </button>
              ) : (
                <button
                  onClick={handleChallengePassed}
                  className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-indigo-500 transition-colors cursor-pointer"
                >
                  {t.markComplete}
                </button>
              )}
            </div>
          </motion.div>

          {/* --- RIGHT PANEL: Chat Tutor drawer --- */}
          <div className="w-full md:w-80 lg:w-96 border-t md:border-t-0 shrink-0 h-[500px] md:h-auto">
            <ChatPanel lessonId={lessonId} />
          </div>
        </div>
      </div>
    </div>
  );
}
