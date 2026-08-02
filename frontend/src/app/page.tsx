'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import DonationWidget from '@/components/DonationWidget';
import { api, Course, LeaderboardStats, LeaderboardEntry } from '@/lib/api';
import { 
  BookOpen, Bot, Code, Award, CheckCircle, Zap, Shield, HelpCircle, 
  ChevronDown, MessageSquare, GraduationCap, ArrowRight, Play,
  Send, RefreshCw, Flame, Sparkles, X, Lightbulb, ExternalLink, Trophy, Users, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const pageTranslations = {
  en: {
    statsLearners: "Global Learners",
    statsCerts: "Certificates Issued",
    statsLessons: "Lessons Completed",
    statsActive: "Active Today",
    topStudentsTitle: "Top Coder Arena",
    topStudentsSub: "The most dedicated programmers building certified skill portfolios",
    tickerTitle: "Live Verified Certificate Stream",
    tickerSub: "Real-time verify hashes issued for final pathway completions",
    viewProfile: "View Portfolio",
    freePill: "100% Free AI-Powered Coding Education",
    heroTitle1: "Learn Programming",
    heroTitle2: "With a Personal AI Tutor",
    heroDesc: "Master Python, C++, HTML, CSS, and JavaScript with your personal AI mentor, available 24/7 to guide you from absolute zero to certified programmer.",
    getStarted: "Get Started",
    browseCourses: "Browse Courses",
    
    whyTitle: "Why Learn on EduVerse?",
    whySubtitle: "Our platform combines premium syllabus structure with real-time AI assistance to keep you motivated and supported.",
    
    featTutorTitle: "24/7 AI Tutor",
    featTutorDesc: "Stuck on a concept? Ask the tutor for hints, simple analogies, or quiz checks customized to your question.",
    
    featPracticeTitle: "In-Browser Practice",
    featPracticeDesc: "No software setup needed. Write code, run tests, and preview results directly in your web browser interface.",
    
    featSyllabusTitle: "Structured Syllabus",
    featSyllabusDesc: "Curated programming lessons designed specifically for absolute beginners. No coding background assumed.",
    
    featAwardTitle: "Verified Certificates",
    featAwardDesc: "Pass the final exam to automatically generate a PDF certificate with verification QR code signed by our CEO.",
    
    howTitle: "How It Works",
    howSubtitle: "Complete these simple steps to go from zero programming skills to a certified coder.",
    
    step1Title: "Enroll in a Course",
    step1Desc: "Select from Python, C++, or Web Development Fundamentals and enroll in one click.",
    
    step2Title: "Learn and Code",
    step2Desc: "Read lesson content, complete browser code practices, and ask the AI Tutor for hints if you need help.",
    
    step3Title: "Take the Final Exam",
    step3Desc: "Answer multiple-choice and code questions. Score 70% or higher to pass (with free retries!).",
    
    step4Title: "Claim Your Certificate",
    step4Desc: "Your verified PDF certificate is instantly generated, emailed to you, and ready for download.",
    
    startTodayTitle: "Start Learning Today",
    startTodaySubtitle: "Enroll in our introductory pathways. Choose your track and study at your own pace.",
    
    viewSyllabus: "View Syllabus",
    loading: "Loading courses...",
    
    aiShowcaseTitle: "An AI Tutor built to answer your questions instantly",
    aiShowcaseDesc: "Whether you need a concept explained in simple terms, a hint for an exercise, or a mock error dissected, the AI Tutor is always ready to guide you without giving away solutions.",
    aiShowcasePill: "AI Mentor Feature",
    aiShowcaseCheck1: "Context-aware lessons response",
    aiShowcaseCheck2: "Analogies that explain complex code",
    aiShowcaseCheck3: "Customized quiz evaluation",
    
    tutorInterface: "Tutor Chat Interface",
    simUserMessage: "What is a variable in Python?",
    simTutorMessage: "Think of a variable as a labeled storage box! You write `x = 5`, which puts the value `5` inside the box labeled `x`. Anytime you use `x`, Python looks inside that box!",
    askPlaceholder: "Ask a question...",
    
    faqTitle: "Frequently Asked Questions",
    faqSubtitle: "Got questions? We've got answers.",
    
    copyright: "2026 EduVerse Platform. Built for Silicon Valley Startup Vision. All rights reserved.",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    contact: "Contact Support",
    
    widgetHeaderTitle: "AI Programming Guide (Demo)",
    widgetHeaderSub: "EduVerse AI Tutor Preview",
    widgetWelcome: "Welcome! I am your AI programming guide. Ask me any programming question to test me instantly! 🚀",
    widgetThinking: "Mentor is thinking",
    widgetPreset1: "Loops Analogy 🍳",
    widgetPreset2: "Coding from zero 🚀",
    widgetPreset3: "Python vs C++ 💻",
    widgetPlaceholder: "Ask me any programming question...",
    widgetErrorReply: "I received your question: \"{query}\".\n\nI am currently running in preview mode, but you can sign in and start your courses to activate full, personalized connection with the AI Tutor!",
    widgetClose: "Close Chat",
    widgetOpen: "Ask Your AI Tutor",
    
    fallbackCourses: [
      {
        id: 1,
        title: "Python Basics",
        description: "Learn Python, the most popular and versatile programming language. Perfect for scripting, automation, and backend development.",
        skills: "Python,Variables,Loops,Functions,Data Structures",
        duration: "10 hours",
        difficulty: "Beginner",
        theme_style: "cosmic"
      },
      {
        id: 2,
        title: "C++ Basics",
        description: "Explore core C++ syntax, type safety, memory structures, and hardware-level operations.",
        skills: "C++,Compilation,Pointers,Memory,Control Flow",
        duration: "12 hours",
        difficulty: "Medium",
        theme_style: "cyberpunk"
      },
      {
        id: 3,
        title: "Web Development Fundamentals",
        description: "Build layout-responsive websites from scratch using HTML5, CSS3, Flexbox, and JavaScript DOM scripting.",
        skills: "HTML5,CSS3,Flexbox,Grid,DOM Events,JS",
        duration: "15 hours",
        difficulty: "Beginner",
        theme_style: "creative"
      },
      {
        id: 4,
        title: "Medium Python",
        description: "Take your Python skills to the next level. Learn file handling, exception handling, JSON serialization, and using native and external libraries.",
        skills: "File handling,Exception Handling,JSON,Modules,Libraries",
        duration: "12 hours",
        difficulty: "Medium",
        theme_style: "cosmic"
      },
      {
        id: 5,
        title: "Pro Python",
        description: "Master Object-Oriented Programming (OOP) in Python. Understand Classes, Objects, Inheritance, Polymorphism, and encapsulation like a professional developer.",
        skills: "OOP,Classes,Objects,Inheritance,Methods,Polymorphism",
        duration: "15 hours",
        difficulty: "Medium",
        theme_style: "cosmic"
      },
      {
        id: 6,
        title: "Advanced Python",
        description: "Deep dive into Python's advanced mechanics: Decorators, Generators, Iterators, Context Managers, and Multithreading.",
        skills: "Generators,Decorators,Context Managers,Concurrency,Multithreading",
        duration: "18 hours",
        difficulty: "Hard",
        theme_style: "cosmic"
      }
    ],
    faqs: [
      {
        q: "Is EduVerse really 100% free?",
        a: "Yes! EduVerse is completely free. There are no subscriptions, no payment walls, and no premium features. All courses, certificates, and the AI tutor are available to everyone at no cost."
      },
      {
        q: "How does the AI Tutor work?",
        a: "The AI Tutor is built on top of advanced large language models. It acts as a personal mentor, explaining lesson concepts using friendly analogies, offering debugging hints for code exercises, and generating custom mini-quizzes on demand."
      },
      {
        q: "Are the certificates verified?",
        a: "Yes! Every certificate generated comes with a unique Certificate ID and a secure verification QR code. Anyone can scan the QR code to verify the recipient's achievement on our platform."
      },
      {
        q: "Do I need prior coding experience?",
        a: "Not at all. EduVerse is designed specifically for absolute beginners. We teach programming concepts from absolute zero, starting with basic logic and simple variable declarations."
      }
    ]
  },
   ar: {
    statsLearners: "الطلاب حول العالم",
    statsCerts: "الشهادات الصادرة",
    statsLessons: "الدروس المنجزة",
    statsActive: "الطلاب النشطون اليوم",
    topStudentsTitle: "ساحة كبار المبرمجين",
    topStudentsSub: "الطلاب الأكثر نشاطاً في إنتاج وتثبيت الشهادات والمهام البرمجية",
    tickerTitle: "موجز الشهادات النشط",
    tickerSub: "المصادقة الفورية للشهادات البرمجية المعتمدة الصادرة حديثاً",
    viewProfile: "عرض الملف",
    freePill: "منصة تعليمية مجانية 100% مدعومة بالذكاء الاصطناعي",
    heroTitle1: "تعلم البرمجة من الصفر",
    heroTitle2: "مع معلمك الخاص بالذكاء الاصطناعي",
    heroDesc: "احترف لغات بايثون، سي بلس بلس، اتش تي ام ال، سي اس اس، وجافا سكريبت مع معلمك الذكي الشخصي المتاح على مدار الساعة لتوجيهك من الصفر المطلق إلى مبرمج معتمد.",
    getStarted: "ابدأ الآن",
    browseCourses: "تصفح الدورات",
    
    whyTitle: "لماذا تتعلم على EduVerse؟",
    whySubtitle: "تجمع منصتنا بين هيكلية المناهج المتميزة ومساعد الذكاء الاصطناعي الفوري لتبقيك متحمساً ومدعوماً.",
    
    featTutorTitle: "معلم ذكي 24/7",
    featTutorDesc: "هل علقت في مفهوم معين؟ اسأل المعلم الذكي للحصول على تلميحات، أو تشبيهات مبسطة، أو اختبارات قصيرة مخصصة لسؤالك.",
    
    featPracticeTitle: "تطبيق عملي بالمتصفح",
    featPracticeDesc: "لا حاجة لتثبيت أي برامج. اكتب الكود، وشغل الاختبارات، وعاين النتائج مباشرة داخل متصفحك.",
    
    featSyllabusTitle: "مناهج مهيكلة ومنظمة",
    featSyllabusDesc: "دروس برمجية منسقة مصممة خصيصاً للمبتدئين تماماً. لا نفترض وجود أي معرفة مسبقة بالبرمجة.",
    
    featAwardTitle: "شهادات معتمدة وقابلة للتحقق",
    featAwardDesc: "اجتز الامتحان النهائي لتوليد شهادة PDF تلقائياً تحتوي على رمز استجابة سريعة للتحقق موقعة من رئيسنا التنفيذي.",
    
    howTitle: "كيف تعمل المنصة؟",
    howSubtitle: "أكمل هذه الخطوات البسيطة للانتقال من الصفر البرمجي إلى مبرمج معتمد بالكامل.",
    
    step1Title: "سجل في دورة",
    step1Desc: "اختر من بين بايثون، سي بلس بلس، أو أساسيات تطوير الويب وسجل بضغطة زر واحدة.",
    
    step2Title: "تعلم واكتب كوداً",
    step2Desc: "اقرأ محتوى الدرس، وأكمل التطبيقات العملية، واسأل المعلم الذكي عن تلميحات إذا كنت بحاجة للمساعدة.",
    
    step3Title: "اجتز الامتحان النهائي",
    step3Desc: "أجب على الأسئلة الاختيارية والبرمجية. احصل على 70% أو أكثر لتنجح (مع إمكانية الإعادة مجاناً!).",
    
    step4Title: "احصل على شهادتك",
    step4Desc: "يتم توليد شهادتك المعتمدة بصيغة PDF فوراً، وإرسالها لبريدك، لتكون جاهزة للتنزيل الفوري.",
    
    startTodayTitle: "ابدأ رحلتك التعليمية اليوم",
    startTodaySubtitle: "سجل في مساراتنا التمهيدية. اختر مسارك وادرس بالسرعة التي تناسبك.",
    
    viewSyllabus: "عرض المنهج",
    loading: "جاري تحميل الدورات...",
    
    aiShowcaseTitle: "معلم ذكي مصمم للإجابة على أسئلتك على الفور",
    aiShowcaseDesc: "سواء كنت بحاجة لشرح مفهوم بتبسيط رائع، أو تلميحة لتطبيق برمجي، أو تشريح لخطأ برمجي، فإن المعلم الذكي مستعد دائماً لتوجيهك دون إعطائك الحل مباشرة لضمان تعلمك.",
    aiShowcasePill: "ميزة المعلم الذكي",
    aiShowcaseCheck1: "استجابة متوافقة تماماً مع سياق الدرس",
    aiShowcaseCheck2: "تشبيهات ممتازة لتبسيط الأكواد المعقدة",
    aiShowcaseCheck3: "تقييم وتصحيح مخصص للاختبارات الحية",
    
    tutorInterface: "واجهة محادثة المعلم الذكي",
    simUserMessage: "ما هو المتغير (Variable) في بايثون؟",
    simTutorMessage: "تخيل المتغير كأنه صندوق تخزين ملصق عليه اسم! عندما تكتب `x = 5` فإنك تضع القيمة `5` داخل الصندوق المسمى `x`. وفي أي وقت تستخدم فيه `x` ينظر بايثون داخل الصندوق لمعرفة ما بداخله!",
    askPlaceholder: "اسأل المعلم سؤالاً...",
    
    faqTitle: "الأسئلة الشائعة",
    faqSubtitle: "لديك استفسارات؟ لدينا الإجابات الوافية.",
    
    copyright: "منصة إديو فيرس 2026. بنيت لرؤية الشركات الناشئة في وادي السيليكون. جميع الحقوق محفوظة.",
    privacy: "سياسة الخصوصية",
    terms: "شروط الخدمة",
    contact: "الدعم الفني",
    
    widgetHeaderTitle: "المرشد البرمجي التجريبي",
    widgetHeaderSub: "EduVerse AI Tutor Preview",
    widgetWelcome: "أهلاً بك! أنا مرشدك البرمجي الذكي في EduVerse. اسألني أي سؤال في البرمجة لتجربتي فوراً! 🚀",
    widgetThinking: "المعلم يفكر",
    widgetPreset1: "تشبيه التكرار 🍳",
    widgetPreset2: "تعلم البرمجة 🚀",
    widgetPreset3: "بايثون vs سي بلس 💻",
    widgetPlaceholder: "اسألني أي سؤال في البرمجة...",
    widgetErrorReply: "لقد استلمت سؤالك: \"{query}\".\n\nأنا أعمل حالياً في وضع التجربة، ولكن يمكنك تسجيل الدخول والبدء في الكورسات لتفعيل الاتصال الكامل بـ AI Tutor للرد على كافة أسئلتك البرمجية الحية بشكل مخصص!",
    widgetClose: "إغلاق الدردشة",
    widgetOpen: "اسأل معلمك البرمجي الذكي",
    
    fallbackCourses: [
      {
        id: 1,
        title: "أساسيات بايثون",
        description: "تعلم لغة بايثون، اللغة الأكثر شعبية وتنوعاً في العالم. مثالية لكتابة السكربتات والأتمتة وتطوير تطبيقات الويب والذكاء الاصطناعي.",
        skills: "بايثون,المتغيرات,التكرار,الدوال,بنيات البيانات",
        duration: "10 ساعات",
        difficulty: "مبتدئ",
        theme_style: "cosmic"
      },
      {
        id: 2,
        title: "أساسيات سي بلس بلس",
        description: "استكشف القواعد الأساسية للغة سي بلس بلس، أمان الأنواع، بنيات الذاكرة، والعمليات على مستوى الهاردوير.",
        skills: "سي بلس بلس,التجميع,المؤشرات,الذاكرة,التحكم في التدفق",
        duration: "12 ساعة",
        difficulty: "متوسط",
        theme_style: "cyberpunk"
      },
      {
        id: 3,
        title: "أساسيات تطوير الويب",
        description: "ابنِ مواقع ويب متجاوبة بالكامل مع مختلف الشاشات من الصفر باستخدام HTML5 و CSS3 ونظام التخطيط Flexbox وجافا سكريبت لتفاعل حيوي.",
        skills: "HTML5,CSS3,Flexbox,Grid,DOM Events,JS",
        duration: "15 ساعة",
        difficulty: "مبتدئ",
        theme_style: "creative"
      },
      {
        id: 4,
        title: "بايثون - المستوى المتوسط",
        description: "تعمق في مفاهيم بايثون المتقدمة مثل البرمجة كائنية التوجه (OOP)، التعامل مع الملفات والأخطاء، وتطبيقات عملية متوسطة.",
        skills: "OOP,الفئات,الكائنات,الوراثة,إدارة الملفات,معالجة الاستثناءات",
        duration: "12 ساعة",
        difficulty: "متوسط",
        theme_style: "cosmic"
      },
      {
        id: 5,
        title: "بايثون للمحترفين",
        description: "احترف تقنيات بايثون المتقدمة مثل المولدات (Generators)، المنسقات (Decorators)، البرمجة المتزامنة (Asynchronous)، ومكتبات تحليل البيانات.",
        skills: "Generators,Decorators,Asyncio,Multithreading,Numpy,Pandas",
        duration: "15 ساعة",
        difficulty: "محترف",
        theme_style: "cosmic"
      },
      {
        id: 6,
        title: "بايثون المتقدم والذكاء الاصطناعي",
        description: "استكشف آفاق الذكاء الاصطناعي، تعلم الآلة (Machine Learning)، معالجة اللغات الطبيعية (NLP)، وبناء نماذج ذكية باستخدام بايثون.",
        skills: "Machine Learning,Deep Learning,NLP,TensorFlow,Scikit-Learn",
        duration: "18 ساعة",
        difficulty: "متقدم",
        theme_style: "cosmic"
      }
    ],
    faqs: [
      {
        q: "هل منصة EduVerse مجانية بالكامل حقاً؟",
        a: "نعم! EduVerse مجانية 100% تماماً. لا توجد اشتراكات، ولا جدران دفع، ولا ميزات مدفوعة مقفلة. جميع المناهج والشهادات والمعلم الذكي متوفرة للجميع دون أي تكلفة."
      },
      {
        q: "كيف يعمل المعلم الذكي بالذكاء الاصطناعي؟",
        a: "تم بناء المعلم الذكي بالاعتماد على نماذج لغوية ضخمة ومتطورة. يعمل كمرشد شخصي لك، حيث يشرح المفاهيم الصعبة بتشبيهات رائعة، ويقدم تلميحات لتصحيح الأخطاء البرمجية، وينشئ اختبارات قصيرة مخصصة لك عند الطلب."
      },
      {
        q: "هل الشهادات الصادرة موثقة وقابلة للتحقق؟",
        a: "نعم! تحتوي كل شهادة يتم إنشاؤها على معرف شهادة فريد ورمز استجابة سريعة (QR) آمن للتحقق. يمكن لأي شخص مسح الرمز ضوئياً للتحقق من إنجاز الطالب مباشرة عبر منصتنا."
      },
      {
        q: "هل أحتاج إلى خبرة سابقة في البرمجة للبدء؟",
        a: "لا على الإطلاق. تم تصميم EduVerse خصيصاً للمبتدئين من الصفر المطلق. نشرح المفاهيم البرمجية خطوة بخطوة، بدءاً من المنطق البسيط وتعريف المتغيرات الأساسية."
      }
    ]
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

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [topStudents, setTopStudents] = useState<LeaderboardEntry[]>([]);

  // State for landing page AI widget
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [widgetMessages, setWidgetMessages] = useState<any[]>([]);
  const [widgetInput, setWidgetInput] = useState('');
  const [widgetLoading, setWidgetLoading] = useState(false);
  const chatWidgetEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Read initial language
    const savedLang = localStorage.getItem('eduverse_lang') as 'en' | 'ar' | null;
    const currentLang = savedLang || 'en';
    setLang(currentLang);

    // Initial message for chatbot based on language
    setWidgetMessages([
      {
        role: 'assistant',
        content: pageTranslations[currentLang].widgetWelcome
      }
    ]);

    // Listener for global language toggle
    const handleLanguageChange = () => {
      const activeLang = localStorage.getItem('eduverse_lang') as 'en' | 'ar' | null;
      if (activeLang) {
        setLang(activeLang);
        setWidgetMessages([
          {
            role: 'assistant',
            content: pageTranslations[activeLang].widgetWelcome
          }
        ]);
      }
    };

    window.addEventListener('eduverse_language_change', handleLanguageChange);
    return () => {
      window.removeEventListener('eduverse_language_change', handleLanguageChange);
    };
  }, []);

  // Auto scroll to bottom in widget
  React.useEffect(() => {
    chatWidgetEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [widgetMessages, widgetLoading]);

  // Formatting parser for chat bubble
  const renderMessageContent = (content: string) => {
    const parts = content.split(/(```[a-z]*\n[\s\S]*?\n```|`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const lines = part.split('\n');
        const code = lines.slice(1, -1).join('\n');
        const lang = part.match(/```([a-z]*)/)?.[1] || 'code';
        return (
          <div key={index} className="my-2.5 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-md text-left">
            <div className="flex items-center justify-between bg-slate-800 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
              <span>{lang}</span>
            </div>
            <pre className="overflow-x-auto p-3 text-[11px] font-mono text-slate-100 leading-normal">
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="rounded bg-slate-200/80 dark:bg-slate-850 px-1 py-0.5 font-mono text-[10px] font-semibold text-indigo-650 dark:text-indigo-400">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      return <span key={index} className="whitespace-pre-line leading-relaxed">{part}</span>;
    });
  };

  const triggerWidgetPreset = async (presetKey: string) => {
    if (widgetLoading) return;

    let userText = '';
    let responseText = '';

    if (presetKey === 'loops') {
      if (lang === 'ar') {
        userText = "أشرح لي الـ Loops بتشبيه طبخ 🍳 (Loops Analogy)";
        responseText = `شرح الـ Loops بتشبيه المطبخ 🍳:

تخيل أنك شيف في مطعم، وتريد تحضير 5 أطباق من السلطة 🥗. 
بدلاً من كتابة أمر تحضير طبق سلطة 5 مرات منفصلة في كتاب الوصفات، ستكتب:
"كرر تحضير طبق السلطة طالما عدد الأطباق المحضرة أقل من 5."

هذا هو الـ Loop بالضبط! 
- **الشرط (Condition):** عدد الأطباق أقل من 5.
- **التكرار (Iteration):** في كل مرة تحضر طبقاً وتضيفه للعداد.
- **التوقف (Break):** عندما تصل لـ 5 أطباق، تتوقف عن التكرار!

في لغة بايثون، نكتبها هكذا:
\`\`\`python
for plate in range(5):
    print("تم تحضير طبق سلطة لذيذ! 🥗")
\`\`\`
سهلة، أليس كذلك؟`;
      } else {
        userText = "Explain Loops with a cooking analogy 🍳";
        responseText = `Here is Loops explained with a Cooking Analogy 🍳:

Imagine you are a chef in a restaurant, and you need to prepare 5 plates of salad 🥗. 
Instead of writing the instructions for making a salad 5 separate times in your recipe book, you write:
"Repeat making a salad plate as long as the count of prepared plates is less than 5."

That is exactly what a Loop is! 
- **Condition:** Plate count is less than 5.
- **Iteration:** Each time you make a plate and increment the counter.
- **Break/Stop:** When you reach 5 plates, you stop repeating!

In Python, we write it like this:
\`\`\`python
for plate in range(5):
    print("Delicious salad plate prepared! 🥗")
\`\`\`
Simple, right?`;
      }
    } else if (presetKey === 'scratch') {
      if (lang === 'ar') {
        userText = "كيف أتعلم البرمجة من الصفر؟ 🚀 (Coding from zero)";
        responseText = `خارطة طريق مبسطة لتعلم البرمجة من الصفر 🚀:

1. **لا تخف من البداية:** البرمجة ليست رياضيات معقدة، بل هي مثل كتابة نصائح وتوجيهات لصديق غبي (وهو الكمبيوتر).
2. **اختر لغة سهلة كبداية:** نوصي بشدة بـ **Python** لأنها تشبه اللغة الإنجليزية البسيطة، أو **HTML & CSS** إذا كنت تحب تصميم الواجهات المرئية.
3. **ابدأ بالتطبيق العملي فوراً:** لا تقرأ الكتب فقط! اكتب كوداً حياً بيدك، وهذا هو سر قوة محاكي الأكواد المتوفر في EduVerse.
4. **استعن بالـ AI Tutor:** نحن نوفر لك مرشداً ذكياً 24/7 يجيب على أسئلتك ويشرح لك الأخطاء بصبر ودون ملل.

ابدأ الآن بالتسجيل في كورس "Python Basics" في الأعلى، فهو مجاني 100%!`;
      } else {
        userText = "How do I learn programming from absolute zero? 🚀";
        responseText = `Here is a simple roadmap to learn programming from absolute zero 🚀:

1. **Don't be afraid to start:** Programming is not complex math. It's like writing helpful instructions for a very literal-minded friend (the computer).
2. **Choose a beginner-friendly language:** We highly recommend **Python** because it reads like simple English, or **HTML & CSS** if you love designing visual interfaces.
3. **Start practicing immediately:** Don't just read books! Write live code with your own hands, which is why EduVerse's in-browser playground is so powerful.
4. **Leverage the AI Tutor:** We provide a 24/7 AI mentor that answers your questions and explains code errors patiently.

Start right now by enrolling in "Python Basics" above—it's 100% free!`;
      }
    } else if (presetKey === 'compare') {
      if (lang === 'ar') {
        userText = "ما الفرق بين C++ و Python؟ 💻 (Python vs C++)";
        responseText = `الفرق بين بايثون (Python) وسي بلس بلس (C++) 💻:

- **بايثون (Python):** 
  مثل سيارة أوتوماتيكية حديثة وسهلة القيادة 🚗. الكود قصير، واضح، ولا تحتاج للقلق بشأن إدارة ذاكرة الكمبيوتر. ممتازة للذكاء الاصطناعي، وتحليل البيانات، والتطوير السريع.
  مثال:
  \`\`\`python
  print("Hello!")
  \`\`\`

- **سي بلس بلس (C++):**
  مثل سيارة سباق Formula 1 يدوية سريعة جداً ولكنها تحتاج مهارة فائقة 🏎️. تمنحك تحكماً كاملاً بالهاردوير والذاكرة، وتُسخدم لتطوير الألعاب الضخمة والأنظمة التي تتطلب أداءً فائقاً.
  مثال:
  \`\`\`cpp
  #include <iostream>
  int main() {
      std::cout << "Hello!";
      return 0;
  }
  \`\`\format`;
      } else {
        userText = "What is the difference between C++ and Python? 💻";
        responseText = `The difference between Python and C++ 💻:

- **Python:** 
  Like a modern automatic car that's easy to drive 🚗. Code is short, clear, and you don't worry about computer memory. Excellent for AI, data analysis, and rapid prototyping.
  Example:
  \`\`\`python
  print("Hello!")
  \`\`\`

- **C++:**
  Like a Formula 1 manual race car that's extremely fast but requires expert skill 🏎️. Gives you full control over hardware and memory, used for high-performance games and operating systems.
  Example:
  \`\`\`cpp
  #include <iostream>
  int main() {
      std::cout << "Hello!";
      return 0;
  }
  \`\`\format`;
      }
    }

    setWidgetMessages(prev => [...prev, { role: 'user', content: userText }]);
    setWidgetLoading(true);

    try {
      const response = await api.sendChatMessage(userText, 1, []);
      setWidgetMessages(prev => [...prev, { role: 'assistant', content: response.reply }]);
    } catch (e) {
      setTimeout(() => {
        setWidgetMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
      }, 1000);
    } finally {
      setTimeout(() => {
        setWidgetLoading(false);
      }, 1000);
    }
  };

  const handleWidgetSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!widgetInput.trim() || widgetLoading) return;

    const userText = widgetInput;
    setWidgetMessages(prev => [...prev, { role: 'user', content: userText }]);
    setWidgetInput('');
    setWidgetLoading(true);

    try {
      const response = await api.sendChatMessage(userText, 1, []);
      setWidgetMessages(prev => [...prev, { role: 'assistant', content: response.reply }]);
    } catch (err: any) {
      setTimeout(() => {
        const errorReply = pageTranslations[lang].widgetErrorReply.replace("{query}", userText);
        setWidgetMessages(prev => [
          ...prev,
          { 
            role: 'assistant', 
            content: errorReply
          }
        ]);
      }, 800);
    } finally {
      setTimeout(() => {
        setWidgetLoading(false);
      }, 800);
    }
  };

  useEffect(() => {
    async function fetchLandingData() {
      try {
        const data = await api.getCourses();
        setCourses(data);
      } catch (err) {
        console.error('Failed to fetch courses, loading fallback mocks', err);
        setCourses(pageTranslations[lang].fallbackCourses);
      } finally {
        setLoading(false);
      }
      
      try {
        const statsData = await api.getLeaderboardStats();
        setStats(statsData);
        const topData = await api.getAllTimeLeaderboard();
        setTopStudents(topData.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch landing stats/leaderboard", err);
      }
    }
    fetchLandingData();
  }, [lang]);

  const t = pageTranslations[lang];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-36 bg-gradient-to-b from-indigo-50/50 via-white to-transparent dark:from-slate-900/40 dark:via-slate-950 dark:to-transparent">
        {/* Floating Background Blobs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 h-[450px] w-[450px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl animate-float-1"></div>
          <div className="absolute top-1/2 -right-40 h-[600px] w-[600px] rounded-full bg-violet-500/10 dark:bg-violet-500/5 blur-3xl animate-float-2"></div>
          <div className="absolute -bottom-20 left-1/3 h-[350px] w-[350px] rounded-full bg-indigo-600/5 blur-3xl animate-pulse-soft"></div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            {/* Tagline pill */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/50 dark:border-indigo-800/40 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-6 shadow-sm">
              <Zap className="h-3.5 w-3.5 fill-current animate-pulse text-amber-500" />
              {t.freePill}
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl max-w-4xl leading-tight">
              {t.heroTitle1} <br />
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
                {t.heroTitle2}
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.heroDesc}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link
                href="/register"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:scale-[1.02] transition-all cursor-pointer"
              >
                {t.getStarted}
                <ArrowRight className={`h-5 w-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </Link>
              <a
                href="#courses-section"
                className="flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t.browseCourses}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- SOCIAL PROOF LIVE STATS BANNER --- */}
      <section className="relative z-10 -mt-10 max-w-5xl mx-auto px-4">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-6 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="block text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
              {stats ? stats.total_learners.toLocaleString() : "2,450"}+
            </span>
            <span className="text-[10px] uppercase font-extrabold text-slate-550 dark:text-slate-400 tracking-wider flex items-center gap-1 justify-center">
              <Users className="h-3.5 w-3.5 text-indigo-505" />
              {t.statsLearners}
            </span>
          </div>
          <div className="space-y-1">
            <span className="block text-2xl md:text-3xl font-black text-indigo-650 dark:text-indigo-400">
              {stats ? stats.total_certificates.toLocaleString() : "412"}+
            </span>
            <span className="text-[10px] uppercase font-extrabold text-slate-550 dark:text-slate-400 tracking-wider flex items-center gap-1 justify-center">
              <Award className="h-3.5 w-3.5 text-amber-500" />
              {t.statsCerts}
            </span>
          </div>
          <div className="space-y-1">
            <span className="block text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
              {stats ? stats.total_lessons_completed.toLocaleString() : "18,920"}+
            </span>
            <span className="text-[10px] uppercase font-extrabold text-slate-550 dark:text-slate-400 tracking-wider flex items-center gap-1 justify-center">
              <Code className="h-3.5 w-3.5 text-indigo-505" />
              {t.statsLessons}
            </span>
          </div>
          <div className="space-y-1">
            <span className="block text-2xl md:text-3xl font-black text-emerald-500">
              {stats ? stats.active_learners_today.toLocaleString() : "128"}+
            </span>
            <span className="text-[10px] uppercase font-extrabold text-slate-550 dark:text-slate-400 tracking-wider flex items-center gap-1 justify-center">
              <Flame className="h-3.5 w-3.5 text-emerald-500 animate-pulse fill-current" />
              {t.statsActive}
            </span>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-20 bg-white dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800/80 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t.whyTitle}</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">{t.whySubtitle}</p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {/* Feature 1 */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              className="rounded-2xl border border-slate-200/50 dark:border-slate-800 p-6 bg-white dark:bg-slate-900/50 shadow-sm flex flex-col items-start hover-premium-card"
            >
              <div className="rounded-lg bg-indigo-100 dark:bg-indigo-950/80 p-3 text-indigo-600 dark:text-indigo-400 mb-5">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.featTutorTitle}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{t.featTutorDesc}</p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              className="rounded-2xl border border-slate-200/50 dark:border-slate-800 p-6 bg-white dark:bg-slate-900/50 shadow-sm flex flex-col items-start hover-premium-card"
            >
              <div className="rounded-lg bg-indigo-100 dark:bg-indigo-950/80 p-3 text-indigo-600 dark:text-indigo-400 mb-5">
                <Code className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.featPracticeTitle}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{t.featPracticeDesc}</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              className="rounded-2xl border border-slate-200/50 dark:border-slate-800 p-6 bg-white dark:bg-slate-900/50 shadow-sm flex flex-col items-start hover-premium-card"
            >
              <div className="rounded-lg bg-indigo-100 dark:bg-indigo-950/80 p-3 text-indigo-600 dark:text-indigo-400 mb-5">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.featSyllabusTitle}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{t.featSyllabusDesc}</p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              className="rounded-2xl border border-slate-200/50 dark:border-slate-800 p-6 bg-white dark:bg-slate-900/50 shadow-sm flex flex-col items-start hover-premium-card"
            >
              <div className="rounded-lg bg-indigo-100 dark:bg-indigo-950/80 p-3 text-indigo-600 dark:text-indigo-400 mb-5">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.featAwardTitle}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{t.featAwardDesc}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- HOW IT WORKS TIMELINE --- */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t.howTitle}</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">{t.howSubtitle}</p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
            className={`relative border-l-2 border-indigo-200 dark:border-indigo-900/60 max-w-2xl mx-auto pl-8 space-y-12 ${
              lang === 'ar' ? 'border-l-0 border-r-2 pl-0 pr-8 border-indigo-200 dark:border-indigo-900/60' : ''
            }`}
          >
            <motion.div 
              variants={{
                hidden: { opacity: 0, x: lang === 'ar' ? 20 : -20 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
              }}
              className="relative"
            >
              <div className={`absolute top-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white font-bold shadow ${
                lang === 'ar' ? '-right-12' : '-left-12'
              }`}>1</div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t.step1Title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{t.step1Desc}</p>
            </motion.div>
            
            <motion.div 
              variants={{
                hidden: { opacity: 0, x: lang === 'ar' ? 20 : -20 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
              }}
              className="relative"
            >
              <div className={`absolute top-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white font-bold shadow ${
                lang === 'ar' ? '-right-12' : '-left-12'
              }`}>2</div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t.step2Title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{t.step2Desc}</p>
            </motion.div>
            
            <motion.div 
              variants={{
                hidden: { opacity: 0, x: lang === 'ar' ? 20 : -20 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
              }}
              className="relative"
            >
              <div className={`absolute top-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white font-bold shadow ${
                lang === 'ar' ? '-right-12' : '-left-12'
              }`}>3</div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t.step3Title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{t.step3Desc}</p>
            </motion.div>

            <motion.div 
              variants={{
                hidden: { opacity: 0, x: lang === 'ar' ? 20 : -20 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
              }}
              className="relative"
            >
              <div className={`absolute top-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white font-bold shadow ${
                lang === 'ar' ? '-right-12' : '-left-12'
              }`}>4</div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t.step4Title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{t.step4Desc}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- COURSES SECTION --- */}
      <section id="courses-section" className="py-20 bg-white dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800/80 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t.startTodayTitle}</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">{t.startTodaySubtitle}</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            </div>
          ) : (
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="grid grid-cols-1 gap-8 md:grid-cols-3"
            >
              {courses.map((course) => {
                const localCourse = translateCourse(course, lang);
                return (
                  <motion.div 
                    key={course.id} 
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                    }}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm hover-premium-card relative overflow-hidden group"
                  >
                    {/* Decorative badge */}
                    <div className={`absolute top-0 bg-indigo-600 text-white text-[9px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-bl-lg ${
                      lang === 'ar' ? 'left-0 right-auto rounded-bl-none rounded-br-lg' : 'right-0'
                    }`}>
                      {localCourse.difficulty}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{localCourse.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">{localCourse.description}</p>
                      
                      <div className="flex flex-wrap gap-1.5 mt-5">
                        {localCourse.skills.split(',').slice(0, 4).map((skill, idx) => (
                          <span key={idx} className="rounded bg-slate-100 dark:bg-slate-900 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800/40">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{localCourse.duration}</span>
                      <Link
                        href={`/courses/${course.id}`}
                        className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                      >
                        {t.viewSyllabus}
                        <ArrowRight className={`h-3 w-3 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* --- AI SHOWCASE --- */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            className="flex flex-col lg:flex-row items-center gap-12 max-w-5xl mx-auto"
          >
            <motion.div 
              variants={{
                hidden: { opacity: 0, x: lang === 'ar' ? 30 : -30 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="flex-1"
            >
              <div className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
                <Bot className="h-3.5 w-3.5 animate-pulse" /> {t.aiShowcasePill}
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">{t.aiShowcaseTitle}</h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.aiShowcaseDesc}
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                  {t.aiShowcaseCheck1}
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                  {t.aiShowcaseCheck2}
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                  {t.aiShowcaseCheck3}
                </div>
              </div>
            </motion.div>

            {/* Simulated Chat Panel Showcase */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, x: lang === 'ar' ? -30 : 30 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="flex-1 w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-2xl p-4 relative select-none"
            >
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-bold text-slate-750 dark:text-slate-300">{t.tutorInterface}</span>
              </div>
              <div className="py-4 space-y-3 text-right">
                <div className={`flex items-start gap-2 max-w-[85%] ${lang === 'ar' ? 'mr-0 ml-auto justify-start text-right' : 'justify-start text-left'}`}>
                  {lang !== 'ar' && <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] text-slate-650 dark:text-slate-400 font-bold shrink-0">U</div>}
                  <div className="rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs text-slate-700 dark:text-slate-300">{t.simUserMessage}</div>
                  {lang === 'ar' && <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] text-slate-650 dark:text-slate-400 font-bold shrink-0">U</div>}
                </div>
                <div className={`flex items-start gap-2 max-w-[85%] ${lang === 'ar' ? 'ml-0 mr-auto justify-end text-right' : 'ml-auto justify-end text-left'}`}>
                  {lang === 'ar' && <div className="h-6 w-6 rounded-full bg-indigo-650 flex items-center justify-center text-[10px] text-white font-bold shrink-0"><Bot className="h-3.5 w-3.5" /></div>}
                  <div className="rounded-xl bg-indigo-600 text-white px-3 py-2 text-xs">
                    {t.simTutorMessage}
                  </div>
                  {lang !== 'ar' && <div className="h-6 w-6 rounded-full bg-indigo-650 flex items-center justify-center text-[10px] text-white font-bold shrink-0"><Bot className="h-3.5 w-3.5" /></div>}
                </div>
              </div>
              <div className="flex gap-1 border-t border-slate-100 dark:border-slate-800 pt-3">
                <input disabled placeholder={t.askPlaceholder} className="flex-1 bg-slate-100 dark:bg-slate-800 text-[11px] rounded p-2 focus:outline-none text-right" />
                <button disabled className="bg-indigo-600 text-white p-2 rounded shrink-0"><Play className={`h-3 w-3 fill-current ${lang === 'ar' ? 'rotate-180' : ''}`} /></button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- TOP STUDENTS SHOWCASE --- */}
      {topStudents.length > 0 && (
        <section className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 transition-colors">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className={`max-w-3xl mx-auto mb-12 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 justify-start">
                <Trophy className="h-7 w-7 text-amber-555 animate-bounce" /> {t.topStudentsTitle}
              </h2>
              <p className="mt-3 text-sm text-slate-655 dark:text-slate-400 font-semibold">{t.topStudentsSub}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {topStudents.map((student, index) => {
                const colors = [
                  "from-amber-400 to-amber-600",
                  "from-slate-400 to-slate-600",
                  "from-amber-600 to-orange-700",
                  "from-indigo-500 to-indigo-700",
                  "from-violet-500 to-fuchsia-600"
                ];
                const badge = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "⚡";
                return (
                  <div 
                    key={student.email}
                    className="rounded-2xl border border-slate-250 dark:border-slate-850 bg-white dark:bg-slate-900 p-5 shadow-sm text-center relative overflow-hidden hover-premium-card flex flex-col justify-between"
                  >
                    <div className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-r ${colors[index % colors.length]}`}></div>
                    
                    <div className="pt-2">
                      <div className="text-xl mb-2">{badge}</div>
                      <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-black mx-auto text-indigo-600 dark:text-indigo-400 border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
                        {student.name[0].toUpperCase()}
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-800 dark:text-white mt-3 truncate">{student.name}</h4>
                      <p className="text-[9px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-505 mt-1">{student.rank_title}</p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex justify-between text-[10px] font-bold text-slate-550 dark:text-slate-400">
                      <span>Lv {student.level}</span>
                      <span className="text-indigo-650 dark:text-indigo-400 font-extrabold">{student.xp.toLocaleString()} XP</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* --- LIVE CERTIFICATE SHOWCASE --- */}
      <section className="py-20 bg-white dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800/80 transition-colors overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={`max-w-3xl mx-auto mb-12 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 justify-start">
              <Award className="h-7 w-7 text-indigo-505" /> {t.tickerTitle}
            </h2>
            <p className="mt-3 text-sm text-slate-655 dark:text-slate-400 font-semibold">{t.tickerSub}</p>
          </div>

          {/* Scrolling Ticker Simulator */}
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-none select-none">
            {[
              { name: "Alan Turing", course: "Futuristic AI Laboratory", date: "2 minutes ago" },
              { name: "Ada Lovelace", course: "Web Development Fundamentals", date: "15 minutes ago" },
              { name: "Linus Torvalds", course: "C++ Basics", date: "1 hour ago" },
              { name: "Guido van Rossum", course: "Python Basics", date: "2 hours ago" },
              { name: "Grace Hopper", course: "Python Advanced", date: "4 hours ago" }
            ].map((cert, index) => (
              <div 
                key={index}
                className="w-72 shrink-0 rounded-2xl border border-amber-500/10 dark:border-amber-500/5 bg-slate-50 dark:bg-slate-900 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600"></div>
                <div>
                  <div className="flex justify-between items-center text-[9px] font-black text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {cert.date}</span>
                    <span className="text-amber-500 uppercase tracking-wider">Verified</span>
                  </div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-white mt-3 truncate">{cert.name}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{cert.course}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-850 text-[9px] font-mono text-slate-400">
                  Hash: 0x8f3c7...{128 + index}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-20 bg-white dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800/80 transition-colors">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t.faqTitle}</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">{t.faqSubtitle}</p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
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
            {t.faqs.map((faq, index) => (
              <motion.div 
                key={index} 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                }}
                className="rounded-xl border border-slate-200 dark:border-slate-800/80 overflow-hidden bg-white dark:bg-slate-950 transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className={`w-full flex items-center justify-between p-5 font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors ${
                    lang === 'ar' ? 'text-right' : 'text-left'
                  }`}
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4.5 w-4.5 text-slate-500 transition-transform ${activeFaq === index ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className={`p-5 pt-0 border-t border-slate-100 dark:border-slate-900 text-sm text-slate-650 dark:text-slate-450 leading-relaxed ${
                        lang === 'ar' ? 'text-right' : 'text-left'
                      }`}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="mt-auto bg-slate-900 text-slate-400 border-t border-slate-800 py-12 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-white font-bold"><BookOpen className="h-4.5 w-4.5" /></div>
            <span className="text-lg font-bold text-white">EduVerse</span>
          </div>
          <p className="text-xs text-slate-500">&copy; {t.copyright}</p>
          <div className="flex gap-4 text-xs font-semibold text-slate-400">
            <span className="hover:text-white cursor-pointer">{t.privacy}</span>
            <span className="hover:text-white cursor-pointer">{t.terms}</span>
            <span className="hover:text-white cursor-pointer">{t.contact}</span>
          </div>
        </div>
      </footer>

      {/* --- FLOATING AI TUTOR PREVIEW WIDGET --- */}
      <div className={`fixed bottom-6 z-50 flex flex-col gap-4 font-sans select-none ${
        lang === 'ar' ? 'left-6 items-start' : 'right-6 items-end'
      }`}>
        <AnimatePresence>
          {showChatWidget && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="w-[360px] h-[480px] rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 shadow-2xl flex flex-col overflow-hidden glass text-right"
            >
              {/* Header */}
              <div className="bg-indigo-600 p-4 text-white flex items-center justify-between shadow-md">
                <button
                  onClick={() => setShowChatWidget(false)}
                  className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className={`flex items-center gap-2 ${lang === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                    <h4 className="text-xs font-black tracking-wide flex items-center gap-1 justify-end">
                      <span>{t.widgetHeaderTitle}</span>
                      <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
                    </h4>
                    <span className="text-[9px] text-indigo-200 font-medium">{t.widgetHeaderSub}</span>
                  </div>
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white shadow-inner">
                    <Bot className="h-5.5 w-5.5" />
                    <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-indigo-600"></span>
                  </div>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none">
                {widgetMessages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} ${
                    lang === 'ar' ? '' : 'flex-row-reverse'
                  }`}>
                    {msg.role !== 'user' && (
                      <div className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white shadow shadow-indigo-600/10">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[11px] shadow-sm leading-relaxed border ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-indigo-600 rounded-br-none font-medium'
                          : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200/60 dark:border-slate-800 rounded-bl-none'
                      } ${
                        lang === 'ar' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {renderMessageContent(msg.content)}
                    </div>
                  </div>
                ))}

                {widgetLoading && (
                  <div className={`flex gap-2 justify-start ${lang === 'ar' ? '' : 'flex-row-reverse'}`}>
                    <div className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white animate-spin">
                      <RefreshCw className="h-3.5 w-3.5" />
                    </div>
                    <div className="max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[10px] bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800/60 rounded-bl-none flex items-center gap-1.5">
                      <span>{t.widgetThinking}</span>
                      <span className="flex gap-0.5">
                        <span className="h-1 w-1 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="h-1 w-1 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="h-1 w-1 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </span>
                    </div>
                  </div>
                )}
                <div ref={chatWidgetEndRef} />
              </div>

              {/* Quick Actions / Preset prompts */}
              <div className={`px-3 py-2 border-t border-slate-100 dark:border-slate-900/60 bg-slate-50/50 dark:bg-slate-900/10 flex gap-2 overflow-x-auto scrollbar-none shrink-0 ${
                lang === 'ar' ? 'direction-rtl' : 'direction-ltr'
              }`}>
                <button
                  onClick={() => triggerWidgetPreset('loops')}
                  className="flex items-center gap-1 shrink-0 rounded-full border border-indigo-200 dark:border-indigo-900 bg-white dark:bg-slate-950 px-3 py-1.5 text-[10px] font-bold text-indigo-650 dark:text-indigo-455 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-all cursor-pointer shadow-sm"
                >
                  {t.widgetPreset1}
                </button>
                <button
                  onClick={() => triggerWidgetPreset('scratch')}
                  className="flex items-center gap-1 shrink-0 rounded-full border border-indigo-200 dark:border-indigo-900 bg-white dark:bg-slate-950 px-3 py-1.5 text-[10px] font-bold text-indigo-650 dark:text-indigo-455 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-all cursor-pointer shadow-sm"
                >
                  {t.widgetPreset2}
                </button>
                <button
                  onClick={() => triggerWidgetPreset('compare')}
                  className="flex items-center gap-1 shrink-0 rounded-full border border-indigo-200 dark:border-indigo-900 bg-white dark:bg-slate-950 px-3 py-1.5 text-[10px] font-bold text-indigo-650 dark:text-indigo-455 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-all cursor-pointer shadow-sm"
                >
                  {t.widgetPreset3}
                </button>
              </div>

              {/* Chat Input Form */}
              <form
                onSubmit={handleWidgetSend}
                className="p-3 border-t border-slate-200/60 dark:border-slate-900 bg-white dark:bg-slate-950/80 shrink-0"
              >
                <div className="relative flex items-center w-full">
                  <input
                    type="text"
                    value={widgetInput}
                    onChange={(e) => setWidgetInput(e.target.value)}
                    disabled={widgetLoading}
                    placeholder={t.widgetPlaceholder}
                    className={`w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 py-2.5 pl-3 pr-11 text-xs font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:outline-none dark:focus:border-indigo-400 transition-all ${
                      lang === 'ar' ? 'text-right' : 'text-left pl-11 pr-3'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={widgetLoading || !widgetInput.trim()}
                    className={`absolute flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow hover:bg-indigo-500 transition-all disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-450 shrink-0 cursor-pointer ${
                      lang === 'ar' ? 'right-1.5' : 'left-1.5'
                    }`}
                  >
                    <Send className={`h-4 w-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Launcher Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowChatWidget(!showChatWidget)}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-650 px-5 py-3.5 text-xs font-extrabold text-white shadow-xl shadow-indigo-600/25 hover:from-indigo-500 hover:to-violet-550 cursor-pointer"
        >
          {showChatWidget ? (
            <>
              {t.widgetClose}
              <X className="h-4.5 w-4.5" />
            </>
          ) : (
            <>
              {t.widgetOpen}
              <Bot className="h-4.5 w-4.5 animate-pulse text-amber-300" />
            </>
          )}
        </motion.button>
      </div>

      {/* Persistent Donation widget placed on bottom left */}
      <DonationWidget />
    </div>
  );
}
