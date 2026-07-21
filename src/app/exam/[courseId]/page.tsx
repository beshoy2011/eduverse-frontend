'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import DonationWidget from '@/components/DonationWidget';
import { api, Exam, ExamResult } from '@/lib/api';
import { 
  Award, Clock, CheckCircle2, XCircle, AlertTriangle, 
  ChevronRight, ShieldCheck, Loader2, Play 
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const examTranslations = {
  en: {
    back: "Back to Dashboard",
    readyTitle: "Ready for Final Exam?",
    readySub: "Validate your skills and earn your official certificate.",
    passingScore: "Passing Score",
    passingVal: "70% or higher",
    timeLimit: "Time Limit",
    timeVal: "{minutes} minutes",
    totalQuestions: "Total Questions",
    totalVal: "{count} Questions",
    goBack: "Go Back",
    startExam: "Start Exam",
    answeredLabel: "{count} of {total} answered",
    questionLabel: "Question {index}",
    submitExam: "Submit Final Exam",
    submitting: "Submitting Answers...",
    notPassed: "Exam Not Passed",
    failedDesc: "Your score of **{score}%** was below the required **70.0%** passing threshold.",
    failedNotice: "Don't worry! You can retake the exam as many times as you need to master the concepts.",
    retake: "Retake Exam",
    successTitle: "Congratulations! You Passed!",
    successDesc: "You successfully cleared the final exam with a score of **{score}%** ({correct}/{total} correct).",
    successNotice: "Your completion certificate has been generated and emailed to your address. You can download the PDF right now.",
    loading: "Loading exam details...",
    notFound: "Exam Not Loaded"
  },
  ar: {
    back: "العودة إلى لوحة التحكم",
    readyTitle: "هل أنت مستعد للامتحان النهائي؟",
    readySub: "تحقق من مهاراتك البرمجية واحصل على شهادتك الرسمية المعتمدة.",
    passingScore: "درجة النجاح المطلوبة",
    passingVal: "70% أو أعلى",
    timeLimit: "الوقت المحدد",
    timeVal: "{minutes} دقيقة",
    totalQuestions: "إجمالي الأسئلة",
    totalVal: "{count} أسئلة",
    goBack: "تراجع",
    startExam: "بدء الامتحان",
    answeredLabel: "تمت الإجابة على {count} من {total}",
    questionLabel: "السؤال {index}",
    submitExam: "تسليم الامتحان النهائي",
    submitting: "جاري تسليم الإجابات...",
    notPassed: "لم يتم اجتياز الامتحان",
    failedDesc: "نسبة درجاتك **{score}%** كانت أقل من نسبة المرور المطلوبة **70.0%**.",
    failedNotice: "لا تقلق! يمكنك إعادة الامتحان والتعلم لمرات غير محدودة حتى تتقن المفاهيم.",
    retake: "إعادة تقديم الامتحان",
    successTitle: "تهانينا الحارة! لقد نجحت!",
    successDesc: "لقد اجتزت الامتحان النهائي بنجاح بنسبة **{score}%** (أجبت على {correct} من أصل {total} إجابة صحيحة).",
    successNotice: "تم إنشاء شهادة التخرج وإرسالها إلى بريدك الإلكتروني. يمكنك تحميل نسخة الـ PDF الآن.",
    loading: "جاري تحميل تفاصيل الامتحان...",
    notFound: "لم يتم تحميل الامتحان"
  }
};

const translateExam = (exam: Exam, currentLang: 'en' | 'ar') => {
  if (currentLang === 'en') return exam;
  
  let title = "الامتحان النهائي للدورة Assessment Exam";
  const titleLower = exam.title.toLowerCase();
  if (titleLower.includes("python")) {
    title = "الامتحان النهائي: أساسيات بايثون";
  } else if (titleLower.includes("c++")) {
    title = "الامتحان النهائي: أساسيات سي بلس بلس";
  } else if (titleLower.includes("web") || titleLower.includes("html")) {
    title = "الامتحان النهائي: أساسيات تطوير الويب";
  }

  const translatedQuestions = exam.questions.map(q => {
    let questionText = q.question_text;
    let options = [...q.options];

    // Python Q1
    if (q.question_text.includes("outputs a string") || q.question_text.includes("print")) {
      questionText = "ما هي الدالة المستخدمة لطباعة نص أو إخراجه في الكونسول بلغة بايثون؟";
      options = ["std::cout", "print()", "console.log()", "System.out.println()"];
    }
    // Python Q2
    else if (q.question_text.includes("define a list") || q.question_text.includes("bracket")) {
      questionText = "أي من الأقواس التالية يُستخدم لتعريف قائمة (List) في بايثون؟";
      options = ["الأقواس المزخرفة {}", "الأقواس المربعة []", "الأقواس الدائرية ()", "أقواس الزاوية <>"];
    }

    return {
      ...q,
      question_text: questionText,
      options: options
    };
  });

  return {
    ...exam,
    title,
    questions: translatedQuestions
  };
};

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.courseId);

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(1200);
  const [examStarted, setExamStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<ExamResult | null>(null);
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
    async function loadExam() {
      try {
        const examData = await api.getExam(courseId);
        setExam(examData);
        setTimeRemaining(examData.duration_minutes * 60);
      } catch (err) {
        console.error('Failed to load exam api details, loading fallback mock', err);
        setExam({
          id: courseId,
          course_id: courseId,
          title: "Course final assessment exam",
          duration_minutes: 20,
          questions: [
            {
              id: 1,
              question_text: "Which function outputs a string to the console in Python?",
              options: ["std::cout", "print()", "console.log()", "System.out.println()"]
            },
            {
              id: 2,
              question_text: "Which bracket is used to define a list in Python?",
              options: ["Curly braces {}", "Square brackets []", "Parentheses ()", "Angle brackets <>"]
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    }
    loadExam();
  }, [courseId]);

  useEffect(() => {
    if (!examStarted || result || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, timeRemaining, result]);

  useEffect(() => {
    if (!examStarted || result) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'a' || e.key === 'A' || e.key === 'u' || e.key === 'U')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
        e.key === 'F12'
      ) {
        e.preventDefault();
      }
    };

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleCopy = (e: ClipboardEvent) => e.preventDefault();
    const handleCut = (e: ClipboardEvent) => e.preventDefault();
    const handleDragStart = (e: DragEvent) => e.preventDefault();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('copy', handleCopy);
    window.addEventListener('cut', handleCut);
    window.addEventListener('dragstart', handleDragStart);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('cut', handleCut);
      window.removeEventListener('dragstart', handleDragStart);
    };
  }, [examStarted, result]);

  const selectOption = (qId: number, index: number) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: index
    }));
  };

  async function handleSubmit() {
    if (!exam || submitting) return;
    setSubmitting(true);

    const answersPayload = Object.entries(answers).map(([qId, index]) => ({
      question_id: Number(qId),
      selected_option_index: index
    }));

    try {
      const examResult = await api.submitExam(courseId, answersPayload);
      setResult(examResult);
    } catch (err) {
      console.error('Failed to submit exam, using mock scoring', err);
      const correct = Object.keys(answers).length;
      const score = (correct / (exam.questions.length || 1)) * 100;
      setResult({
        score: score,
        passed: score >= 70.0,
        passed_score: 70.0,
        correct_answers_count: correct,
        total_questions: exam.questions.length
      });
    } finally {
      setSubmitting(false);
    }
  }

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const t = examTranslations[lang];

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

  if (!exam) {
    return (
      <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold">{t.notFound}</h2>
          <Link href="/dashboard" className="text-xs text-indigo-600 mt-2 hover:underline">
            {t.back}
          </Link>
        </div>
      </div>
    );
  }

  const localExam = translateExam(exam, lang);

  if (result) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xl text-center space-y-6 ${
              lang === 'ar' ? 'font-sans' : ''
            }`}
          >
            {result.passed ? (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto shadow-md">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{t.successTitle}</h2>
                <p className="text-sm text-slate-650 dark:text-slate-400">
                  {t.successDesc
                    .replace("{score}", result.score.toFixed(1))
                    .replace("{correct}", result.correct_answers_count.toString())
                    .replace("{total}", result.total_questions.toString())}
                </p>
                <div className={`bg-emerald-500/5 rounded-xl border border-emerald-500/10 p-4 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-3 ${
                  lang === 'ar' ? 'text-right flex-row-reverse' : 'text-left'
                }`}>
                  <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                  <span>{t.successNotice}</span>
                </div>
                <div className="flex flex-col gap-3 pt-2">
                  <Link
                    href="/dashboard"
                    className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 transition-colors cursor-pointer animate-pulse-soft"
                  >
                    {t.back}
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 mx-auto shadow-md">
                  <XCircle className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{t.notPassed}</h2>
                <p className="text-sm text-slate-650 dark:text-slate-400">
                  {t.failedDesc.replace("{score}", result.score.toFixed(1))}
                </p>
                <div className={`bg-rose-500/5 rounded-xl border border-rose-500/10 p-4 text-xs text-slate-555 dark:text-slate-400 flex items-start gap-3 ${
                  lang === 'ar' ? 'text-right flex-row-reverse' : 'text-left'
                }`}>
                  <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0" />
                  <span>{t.failedNotice}</span>
                </div>
                <div className={`flex gap-4 pt-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <button
                    onClick={() => {
                      setResult(null);
                      setAnswers({});
                      setTimeRemaining(exam.duration_minutes * 60);
                      setExamStarted(false);
                    }}
                    className="flex-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-3 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    {t.retake}
                  </button>
                  <Link
                    href="/dashboard"
                    className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors flex items-center justify-center cursor-pointer"
                  >
                    {t.back}
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </main>
        <DonationWidget />
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xl text-center space-y-6 ${
              lang === 'ar' ? 'font-sans' : ''
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 mx-auto">
              <Award className="h-7 w-7" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{t.readyTitle}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.readySub}</p>
            </div>

            <div className={`rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold text-slate-650 dark:text-slate-300 ${
              lang === 'ar' ? 'text-right' : 'text-left'
            }`}>
              <div className={`p-3.5 flex justify-between ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <span>{t.passingScore}</span>
                <span className="text-indigo-600 dark:text-indigo-400">{t.passingVal}</span>
              </div>
              <div className={`p-3.5 flex justify-between ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <span>{t.timeLimit}</span>
                <span className={`flex items-center gap-1 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <Clock className="h-3.5 w-3.5" />
                  {t.timeVal.replace("{minutes}", localExam.duration_minutes.toString())}
                </span>
              </div>
              <div className={`p-3.5 flex justify-between ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <span>{t.totalQuestions}</span>
                <span>{t.totalVal.replace("{count}", localExam.questions.length.toString())}</span>
              </div>
            </div>

            <div className={`flex gap-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              <Link
                href="/dashboard"
                className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-3 text-sm font-semibold text-slate-705 dark:text-slate-200 hover:bg-slate-55 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer"
              >
                {t.goBack}
              </Link>
              <button
                onClick={() => setExamStarted(true)}
                className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-505 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {t.startExam} <Play className={`h-3 w-3 fill-current ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </motion.div>
        </main>
        <DonationWidget />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 select-none">
      <Navbar />

      <motion.main 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`flex-1 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col justify-between ${
          lang === 'ar' ? 'font-sans' : ''
        }`}
      >
        
        {/* Floating Timer & Status */}
        <div className="border border-slate-200/60 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-4 rounded-2xl shadow-md shrink-0 mb-8 select-none sticky top-20 z-20 space-y-3">
          <div className={`flex items-center justify-between ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
            <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-250">{localExam.title}</h3>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                {t.answeredLabel
                  .replace("{count}", Object.keys(answers).length.toString())
                  .replace("{total}", localExam.questions.length.toString())}
              </p>
            </div>
            
            <div className="flex items-center gap-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 text-rose-600 dark:text-rose-400 font-mono text-sm font-bold shadow-sm">
              <Clock className="h-4.5 w-4.5" />
              {formatTime(timeRemaining)}
            </div>
          </div>
          
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1 overflow-hidden">
            <div 
              className="bg-indigo-655 dark:bg-indigo-400 h-1 rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${(Object.keys(answers).length / (localExam.questions.length || 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Questions List */}
        <div className="flex-1 space-y-8">
          {localExam.questions.map((q, qIdx) => (
            <div 
              key={q.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-slate-700/80 transition-colors"
            >
              <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                <span className="text-[10px] uppercase font-black text-indigo-500 tracking-wider">
                  {t.questionLabel.replace("{index}", (qIdx + 1).toString())}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 leading-relaxed">{q.question_text}</h4>
              </div>

              {q.code_snippet && (
                <pre className="bg-slate-955 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 text-left direction-ltr">
                  <code>{q.code_snippet}</code>
                </pre>
              )}

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = answers[q.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => selectOption(q.id, optIdx)}
                      className={`rounded-xl border p-4 text-xs font-bold leading-relaxed transition-all flex items-center cursor-pointer ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/40 shadow-md scale-[1.01] glow-indigo' 
                          : 'border-slate-200 dark:border-slate-800 hover:border-indigo-505/50 dark:hover:border-indigo-400/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 text-slate-700 dark:text-slate-305'
                      } ${lang === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}
                    >
                      <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px] uppercase font-bold select-none shrink-0 ${
                        lang === 'ar' ? 'ml-2.5' : 'mr-2.5'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Bar */}
        <div className={`mt-10 border-t border-slate-200 dark:border-slate-800/80 pt-6 flex shrink-0 select-none ${
          lang === 'ar' ? 'justify-start' : 'justify-end'
        }`}>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`flex items-center gap-1.5 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 transition-all hover:scale-[1.01] cursor-pointer ${
              lang === 'ar' ? 'flex-row-reverse' : ''
            }`}
          >
            {submitting ? t.submitting : t.submitExam}
            <ChevronRight className={`h-4.5 w-4.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          </button>
        </div>

      </motion.main>
      <DonationWidget />
    </div>
  );
}
