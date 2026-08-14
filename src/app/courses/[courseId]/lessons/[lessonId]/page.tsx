'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ChatPanel from '@/components/ChatPanel';
import CodePlayground from '@/components/CodePlayground';
import { api, CourseDetail, LessonDetail } from '@/lib/api';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  CheckCircle2, 
  Loader2, 
  Menu, 
  X,
  Code2
} from 'lucide-react';

const lessonTranslations = {
  en: {
    syllabus: "COURSE SYLLABUS",
    finalExam: "FINAL EXAM EVALUATION",
    locked: "LOCKED",
    lessonLabel: "MODULE {current} OF {total}",
    practiceTitle: "IDE PRACTICE WORKBENCH",
    solveToProceed: "Solve Practice Challenge to Proceed",
    markComplete: "Mark as Completed",
    prevLesson: "Previous",
    nextLesson: "Next Lesson",
    takeExam: "Start Final Exam",
    notFound: "Lesson Not Found",
    backDashboard: "Back to Dashboard",
    loading: "Loading Workspace..."
  },
  ar: {
    syllabus: "منهج الدورة",
    finalExam: "الامتحان النهائي",
    locked: "مغلق",
    lessonLabel: "الدرس {current} من {total}",
    practiceTitle: "المختبر البرمجي العملي",
    solveToProceed: "حل التطبيق البرمجي للمتابعة",
    markComplete: "تحديد كمكتمل ومتابعة",
    prevLesson: "الدرس السابق",
    nextLesson: "الدرس التالي",
    takeExam: "بدء الامتحان النهائي",
    notFound: "الدرس غير موجود",
    backDashboard: "العودة إلى لوحة التحكم",
    loading: "جاري تحميل بيئة التطوير..."
  }
};

const translateCourseDetail = (course: CourseDetail, currentLang: 'en' | 'ar') => {
  if (currentLang === 'en') return course;
  
  const titleLower = course.title.toLowerCase();
  
  if (titleLower.includes("python basics") || titleLower.includes("أساسيات بايثون")) {
    return {
      ...course,
      title: "أساسيات بايثون",
      description: "تعلم لغة بايثون، اللغة الأكثر شعبية وتنوعاً في العالم.",
      difficulty: "مبتدئ",
      lessons: course.lessons.map(l => {
        if (l.title.includes("Introduction to Python")) return { ...l, title: "مقدمة إلى بايثون" };
        if (l.title.includes("Installing Python & Setup")) return { ...l, title: "تثبيت وإعداد بايثون" };
        if (l.title.includes("Variables in Python")) return { ...l, title: "المتغيرات في بايثون" };
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
    async function loadWorkspaceData() {
      try {
        setLoading(true);
        const courseData = await api.getCourseDetail(courseId);
        setCourse(courseData);

        const lessonData = await api.getLesson(lessonId);
        setLesson(lessonData);

        const progressData = await api.getCourseProgress(courseId);
        setCompletedLessonIds(progressData.completed_lesson_ids);
        
        setPracticeCompleted(progressData.completed_lesson_ids.includes(lessonId));
      } catch (err) {
        console.error('Failed to load workspace data, loading fallback mocks', err);
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
          ]}
        };
        const offlineLessons: Record<number, LessonDetail> = {
          1: { id: 1, course_id: 1, title: "Introduction to Python", sequence_order: 1, content: "# Introduction to Python\nWelcome to Python Basics!", code_template: "print('Hello, World!')", practice_questions: [] },
          2: { id: 2, course_id: 1, title: "Installing Python & Setup", sequence_order: 2, content: "# Installing Python\nInstall python to setup.", code_template: "print('Python is set up!')", practice_questions: [] },
          3: { id: 3, course_id: 1, title: "Variables in Python", sequence_order: 3, content: "# Variables in Python\nLearn variables.", code_template: "age = 25\nprint(age)", practice_questions: [] }
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
      const progressData = await api.getCourseProgress(courseId);
      setCompletedLessonIds(progressData.completed_lesson_ids);
    } catch (err) {
      console.error('Failed to record completion progress', err);
    }
  };

  const t = lessonTranslations[lang];

  if (loading) {
    return (
      <div className="flex h-screen flex-col bg-[#07090e] text-slate-200">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <span className="font-mono-code text-xs text-slate-500">{t.loading}</span>
        </div>
      </div>
    );
  }

  if (!course || !lesson) {
    return (
      <div className="flex h-screen flex-col bg-[#07090e] text-slate-200">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center font-mono-code">
          <h2 className="text-xl font-bold">{t.notFound}</h2>
          <Link href="/dashboard" className="text-xs text-indigo-400 mt-2 hover:underline">
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

  const currentIndex = localCourse.lessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? localCourse.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < localCourse.lessons.length - 1 ? localCourse.lessons[currentIndex + 1] : null;
  const allLessonsCompleted = localCourse.lessons.every(l => completedLessonIds.includes(l.id));

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="prose dark:prose-invert max-w-none text-slate-300 text-xs leading-relaxed font-sans">
        {lines.map((line, idx) => {
          if (line.startsWith('# ')) return <h1 key={idx} className="text-xl font-bold text-white mt-4 mb-2">{line.slice(2)}</h1>;
          if (line.startsWith('## ')) return <h2 key={idx} className="text-lg font-semibold text-white mt-3 mb-2">{line.slice(3)}</h2>;
          if (line.startsWith('### ')) return <h3 key={idx} className="text-base font-semibold text-white mt-3 mb-1">{line.slice(4)}</h3>;
          if (line.startsWith('```')) return null;
          
          if (line.startsWith('print(') || line.startsWith('int age') || line.startsWith('std::cout') || line.startsWith('import ') || line.startsWith('f = ') || line.startsWith('class ')) {
            return (
              <pre key={idx} className="bg-[#07090e] border border-[#1e2638] p-3 rounded font-mono-code text-xs text-cyan-300 my-2">
                <code>{line}</code>
              </pre>
            );
          }
          if (!line.trim()) return <div key={idx} className="h-2"></div>;
          return <p key={idx} className="mb-2">{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-[#07090e] text-slate-100 font-sans select-none">
      <Navbar />

      <div className="flex-1 flex min-h-0 relative overflow-hidden">
        
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden absolute top-2 left-2 z-40 bg-indigo-600 text-white rounded p-1.5 shadow"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>

        <aside 
          className={`w-60 bg-[#0d111a] border-r border-[#1e2638] p-3 overflow-y-auto shrink-0 transition-transform md:translate-x-0 z-30 font-mono-code ${
            sidebarOpen ? 'translate-x-0 absolute inset-y-0 left-0 shadow-2xl' : '-translate-x-full absolute md:relative'
          }`}
        >
          <div className="flex items-center gap-2 pb-3 border-b border-[#1e2638]">
            <BookOpen className="h-4 w-4 text-indigo-400" />
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{t.syllabus}</span>
          </div>
          
          <nav className="mt-3 space-y-1">
            {localCourse.lessons.map((l, index) => {
              const isActive = l.id === lessonId;
              const isDone = completedLessonIds.includes(l.id);
              
              return (
                <Link
                  key={l.id}
                  href={`/courses/${courseId}/lessons/${l.id}`}
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center justify-between rounded py-1.5 px-2.5 text-xs font-semibold transition-all border-l-2 ${
                    isActive 
                      ? 'bg-indigo-600/15 text-indigo-400 border-indigo-500 font-bold' 
                      : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] text-slate-500">{index + 1}.</span>
                    <span className="truncate">{l.title}</span>
                  </div>
                  
                  {isDone ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <div className={`h-3 w-3 shrink-0 rounded-full border ${isActive ? 'border-indigo-400' : 'border-[#1e2638]'}`}></div>
                  )}
                </Link>
              );
            })}

            <div className="border-t border-[#1e2638] pt-2 my-2"></div>
            <Link
              href={allLessonsCompleted ? `/exam/${courseId}` : '#'}
              className={`w-full flex items-center justify-between rounded p-2 text-xs font-bold ${
                allLessonsCompleted 
                  ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5" /> {t.finalExam}
              </span>
              {!allLessonsCompleted && <span className="text-[8px] uppercase tracking-wider">{t.locked}</span>}
            </Link>
          </nav>
        </aside>

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto p-4 md:p-6 space-y-6">
          
          <div className="flex items-center justify-between border-b border-[#1e2638] pb-4 font-mono-code">
            <div>
              <span className="text-[10px] font-bold text-indigo-400 tracking-wider">
                {t.lessonLabel
                  .replace("{current}", (currentIndex + 1).toString())
                  .replace("{total}", localCourse.lessons.length.toString())}
              </span>
              <h1 className="text-xl font-extrabold text-white mt-0.5">{localLesson.title}</h1>
            </div>

            <div className="hidden lg:flex items-center gap-1 text-[9px] text-slate-500 bg-[#0d111a] border border-[#1e2638] px-3 py-1.5 rounded">
              <span className="text-indigo-400 font-bold">LEARN</span>
              <span>→</span>
              <span className="text-cyan-400 font-bold">WRITE</span>
              <span>→</span>
              <span className="text-emerald-400 font-bold">RUN</span>
              <span>→</span>
              <span className="text-amber-400 font-bold">PASS</span>
            </div>
          </div>

          <div className="edu-panel p-5 bg-[#0d111a] border-[#1e2638]">
            {renderContent(localLesson.content)}
          </div>

          {localLesson.code_template && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between font-mono-code">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Code2 className="h-4 w-4 text-indigo-400" /> {t.practiceTitle}
                </h3>
              </div>
              
              <div className="h-[440px]">
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

          <div className="border-t border-[#1e2638] pt-4 mt-6 flex items-center justify-between font-mono-code text-xs">
            {prevLesson ? (
              <Link
                href={`/courses/${courseId}/lessons/${prevLesson.id}`}
                className="edu-btn edu-btn-secondary"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>{t.prevLesson}</span>
              </Link>
            ) : <div />}

            {practiceCompleted ? (
              nextLesson ? (
                <Link
                  href={`/courses/${courseId}/lessons/${nextLesson.id}`}
                  className="edu-btn edu-btn-primary"
                >
                  <span>{t.nextLesson}</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  href={`/exam/${courseId}`}
                  className="edu-btn edu-btn-emerald animate-bounce"
                >
                  <span>{t.takeExam}</span>
                  <Award className="h-4 w-4" />
                </Link>
              )
            ) : (
              <button
                onClick={handleChallengePassed}
                className="edu-btn edu-btn-primary"
              >
                {t.markComplete}
              </button>
            )}
          </div>
        </div>

        <div className="w-full md:w-80 lg:w-96 border-t md:border-t-0 shrink-0 h-[450px] md:h-auto">
          <ChatPanel lessonId={lessonId} />
        </div>

      </div>
    </div>
  );
}
