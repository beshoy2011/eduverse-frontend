'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DonationWidget from '@/components/DonationWidget';
import DashboardSidebar from '@/components/DashboardSidebar';
import Navbar from '@/components/Navbar';
import { api, Course, Certificate } from '@/lib/api';
import { 
  Terminal, 
  Play, 
  Bug, 
  Target, 
  Flame, 
  BookOpen, 
  Award, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Loader2, 
  Code2, 
  CheckCircle,
  Zap,
  Clock,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('Developer');
  const [userXp, setUserXp] = useState<number>(0);
  const [userLevel, setUserLevel] = useState<number>(1);
  const [streakDays, setStreakDays] = useState<number>(1);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeConcept, setActiveConcept] = useState<'variables' | 'loops' | 'pointers' | 'functions'>('variables');

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const storedName = localStorage.getItem('eduverse_user_name');
        if (storedName) setUserName(storedName);

        const profile = await api.getMe();
        if (profile) {
          setUserName(profile.name);
          setUserXp(profile.xp);
          setUserLevel(profile.level);
          setStreakDays(profile.streak_days || 1);
        }

        const enrolled = await api.getEnrolledCourses();
        setEnrolledCourses(enrolled);

        const catalog = await api.getCourses();
        setAllCourses(catalog);

        const certs = await api.getUserCertificates();
        setCertificates(certs);
      } catch (err) {
        console.warn("Using offline dashboard state");
        setEnrolledCourses([
          { id: 1, title: "Python Basics", description: "Master variables, loops, control flow, and data structures.", skills: "Python, Control Flow", duration: "10 hours", difficulty: "Beginner", theme_style: "cosmic" }
        ]);
        setAllCourses([
          { id: 1, title: "Python Basics", description: "Master variables, loops, and data structures.", skills: "Python", duration: "10 hours", difficulty: "Beginner", theme_style: "cosmic" },
          { id: 2, title: "C++ Systems", description: "Pointers, memory management, and static typing.", skills: "C++", duration: "12 hours", difficulty: "Medium", theme_style: "cyberpunk" }
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const concepts = {
    variables: {
      title: "Variables // Labeled Storage Box",
      code: "x = 42  # Puts 42 into the labeled box 'x'",
      analogy: "Think of a variable as a labeled storage box. When you assign `x = 42`, you place the number `42` into the container named `x`. Whenever Python sees `x`, it checks inside the container."
    },
    loops: {
      title: "Loops // Chef Recipe Iteration",
      code: "for plate in range(5):\n    prepare_salad()",
      analogy: "Instead of writing 'make salad' 5 separate times, you instruct the kitchen to repeat the action until 5 plates are assembled. That is a for-loop condition."
    },
    pointers: {
      title: "Pointers // Street House Address",
      code: "int val = 100;\nint* ptr = &val;  // ptr holds address of val",
      analogy: "A variable holds the actual furniture. A pointer holds the GPS street address of the house where the furniture is located."
    },
    functions: {
      title: "Functions // Reusable Kitchen Appliance",
      code: "def blend(fruit):\n    return f'{fruit} smoothie'",
      analogy: "A blender takes raw ingredients, executes a predefined mechanical process, and produces a smoothie. You write the logic once and call it whenever needed."
    }
  };

  if (loading && enrolledCourses.length === 0) {
    return (
      <div className="flex h-screen flex-col bg-[#07090e] text-slate-200 font-mono-code text-xs">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-2">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
          <span>Accessing Developer Workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#07090e] text-slate-100 font-sans select-none">
      <Navbar />

      <div className="flex-1 flex min-h-0">
        <DashboardSidebar />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8 max-w-6xl font-mono-code text-xs">
          
          {/* Header Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e2638] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">DEV SESSION ACTIVE</span>
                <span className="text-slate-600">//</span>
                <span className="text-indigo-400 font-bold">LV.{userLevel}</span>
              </div>
              <h1 className="text-xl font-bold text-white mt-1 font-sans">
                Welcome back, {userName}.
              </h1>
            </div>

            <div className="flex items-center gap-3 bg-[#0d111a] border border-[#1e2638] p-2.5 rounded">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">CURRENT XP</span>
                <span className="font-bold text-amber-400 text-sm flex items-center gap-1 justify-end">
                  <Zap className="h-3.5 w-3.5 fill-amber-400" /> {userXp} XP
                </span>
              </div>
              <div className="h-6 w-px bg-[#1e2638]"></div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">STREAK</span>
                <span className="font-bold text-emerald-400 text-sm flex items-center gap-1 justify-end">
                  <Flame className="h-3.5 w-3.5 fill-emerald-500" /> {streakDays}d
                </span>
              </div>
            </div>
          </div>

          {/* =====================================================================
             SECTION 1: CURRENT INCIDENT / NEXT MOVE (NOT GENERIC METRICS)
             ===================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Active Incident Workbench Card */}
            <div className="lg:col-span-2 edu-panel p-5 bg-[#0d111a] border-[#1e2638] space-y-4">
              <div className="flex justify-between items-center border-b border-[#1e2638] pb-3">
                <div className="flex items-center gap-2">
                  <Bug className="h-4 w-4 text-rose-400" />
                  <span className="font-bold text-white uppercase tracking-wider">CURRENT ACTIVE INCIDENT</span>
                </div>
                <span className="edu-badge edu-badge-rose">IN PROGRESS</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-white font-sans">
                  The Empty List Edge-Case Bug
                </h3>
                <p className="text-slate-400 font-sans leading-relaxed">
                  Function `calculate_average()` crashes with `ZeroDivisionError` when invoked with empty input `[]`.
                </p>

                <div className="pt-2 space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Investigation Progress</span>
                    <span className="text-indigo-400 font-bold">██████░░ 72%</span>
                  </div>
                  <div className="text-[10px] text-slate-500 flex gap-4 pt-1">
                    <span>Bugs Found: 03</span>
                    <span>•</span>
                    <span>Bugs Fixed: 02</span>
                    <span>•</span>
                    <span>Last Attempt: 2m ago</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1e2638] flex items-center justify-between">
                <span className="text-[10px] text-slate-500">Target: Python Basics // Module 03</span>
                <Link
                  href="/courses/1/lessons/1"
                  className="edu-btn edu-btn-primary py-1.5 px-4 text-xs font-bold flex items-center gap-1.5"
                >
                  <span>Open Pair Debugger</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Things You've Been Breaking Lately (Developer Mastery Matrix) */}
            <div className="edu-panel p-5 bg-[#0d111a] border-[#1e2638] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">
                  DEBUG TELEMETRY
                </span>
                <h3 className="text-xs font-bold text-white">Things You&apos;ve Been Breaking Lately</h3>
              </div>

              <div className="space-y-2.5 text-[11px]">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Python 3.12 Syntax</span>
                    <span className="text-emerald-400 font-bold">████████░░ 80%</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Function Scope & Return</span>
                    <span className="text-indigo-400 font-bold">███████░░░ 70%</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Boundary Edge-Cases</span>
                    <span className="text-amber-400 font-bold">█████░░░░░ 50%</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1e2638] text-[10px] text-slate-500">
                <span>3 bugs survived this session. Keep testing.</span>
              </div>
            </div>

          </div>

          {/* =====================================================================
             SECTION 2: ACTIVE SYLLABI TRACKS
             ===================================================================== */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e2638] pb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-indigo-400" />
                <span className="font-bold text-white uppercase tracking-wider">Active Syllabi</span>
              </div>
              <span className="text-[10px] text-slate-500">Resume from last checkpoint</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="edu-panel p-4 bg-[#0d111a] border-[#1e2638] space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="edu-badge edu-badge-indigo text-[10px]">{course.difficulty}</span>
                      <h4 className="text-sm font-bold text-white font-sans mt-1">{course.title}</h4>
                    </div>
                    <Link
                      href={`/courses/${course.id}/lessons/1`}
                      className="edu-btn edu-btn-secondary text-[11px] py-1 px-3"
                    >
                      Resume Lesson
                    </Link>
                  </div>

                  <p className="text-slate-400 text-xs font-sans line-clamp-1">{course.description}</p>

                  <div className="pt-2 border-t border-[#1e2638] flex justify-between text-[10px] text-slate-500">
                    <span>Skills: {course.skills}</span>
                    <span>Duration: {course.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =====================================================================
             SECTION 3: MENTAL MODEL INSPECTOR
             ===================================================================== */}
          <div className="edu-panel p-5 bg-[#0d111a] border-[#1e2638] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1e2638] pb-3">
              <div>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">MENTAL MODEL INSPECTOR</span>
                <h3 className="text-sm font-bold text-white">Inspect Concrete Developer Analogies</h3>
              </div>

              <div className="flex gap-1 bg-[#07090e] p-1 rounded border border-[#1e2638]">
                {(['variables', 'loops', 'pointers', 'functions'] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveConcept(key)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                      activeConcept === key ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#07090e] border border-[#1e2638] rounded space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase block">Code Syntax</span>
                <pre className="text-cyan-300 font-mono-code">{concepts[activeConcept].code}</pre>
              </div>

              <div className="p-3 bg-[#07090e] border border-[#1e2638] rounded space-y-1.5">
                <span className="text-[10px] text-indigo-400 font-bold uppercase block">{concepts[activeConcept].title}</span>
                <p className="text-slate-300 font-sans leading-relaxed text-[11px]">{concepts[activeConcept].analogy}</p>
              </div>
            </div>
          </div>

          {/* =====================================================================
             SECTION 4: EARNED CREDENTIAL LEDGER
             ===================================================================== */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e2638] pb-2">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-400" />
                <span className="font-bold text-white uppercase tracking-wider">Earned Credentials</span>
              </div>
              <span className="text-[10px] text-slate-500">Cryptographically verifiable</span>
            </div>

            {certificates.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="edu-panel p-4 bg-[#0d111a] border-[#1e2638] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-bold block">✓ VERIFIED RECORD</span>
                      <h4 className="text-xs font-bold text-white font-sans mt-0.5">{cert.course_title}</h4>
                      <span className="text-[10px] text-slate-500 font-mono-code">{cert.uuid}</span>
                    </div>

                    <Link
                      href={`/certificates/${cert.uuid}`}
                      className="edu-btn edu-btn-secondary text-[10px] py-1 px-2.5"
                    >
                      Audit
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="edu-panel p-4 bg-[#0d111a] border-[#1e2638] text-center text-slate-500 space-y-1">
                <p>No certificates issued yet. Complete a course syllabus to earn your first verified credential.</p>
              </div>
            )}
          </div>

        </main>
      </div>

      <DonationWidget />
    </div>
  );
}
