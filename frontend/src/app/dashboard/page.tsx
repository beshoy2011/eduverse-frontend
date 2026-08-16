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
  ArrowUpRight,
  Cpu,
  Compass
} from 'lucide-react';

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
        setEnrolledCourses([
          { 
            id: 1, 
            title: "Python Basics", 
            description: "Master variables, loops, control flow, and data structures.", 
            skills: "Python 3.12, Control Flow", 
            duration: "10 hours", 
            difficulty: "Beginner", 
            theme_style: "cosmic" 
          }
        ]);
        setAllCourses([
          { 
            id: 1, 
            title: "Python Basics", 
            description: "Master variables, loops, and data structures.", 
            skills: "Python 3.12", 
            duration: "10 hours", 
            difficulty: "Beginner", 
            theme_style: "cosmic" 
          },
          { 
            id: 2, 
            title: "C++ Systems", 
            description: "Pointers, memory management, and static typing.", 
            skills: "C++20, GCC", 
            duration: "12 hours", 
            difficulty: "Medium", 
            theme_style: "cyberpunk" 
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const concepts = {
    variables: {
      title: "VARIABLES // LABELED STORAGE BOX",
      code: "x = 42  # Puts 42 into labeled container 'x'\ny = x * 2  # Reads 'x', multiplies, stores 84 in 'y'",
      analogy: "Think of a variable as a labeled storage box in memory. When you assign x = 42, you place 42 inside. Whenever Python evaluates x, it inspects inside the container."
    },
    loops: {
      title: "LOOPS // CHEF RECIPE ITERATION",
      code: "for plate in range(5):\n    prepare_salad()  # Executes 5 times sequentially",
      analogy: "Instead of writing 'make salad' 5 separate times, you instruct the runtime to repeat the action until 5 plates are assembled."
    },
    pointers: {
      title: "POINTERS // RAM STREET ADDRESS",
      code: "int val = 100;\nint* ptr = &val;  // ptr holds the exact RAM address of val",
      analogy: "A variable holds the actual furniture. A pointer holds the GPS street address of the house where the furniture is located."
    },
    functions: {
      title: "FUNCTIONS // REUSABLE KITCHEN APPLIANCE",
      code: "def blend(fruit):\n    return f'{fruit} smoothie'\n\nresult = blend('Mango')",
      analogy: "A blender takes raw ingredients (arguments), performs internal transformation, and outputs a ready smoothie (return value)."
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans select-none">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Minimal Sidebar */}
        <DashboardSidebar />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-6 sm:p-8 lg:p-10 space-y-12 overflow-y-auto font-mono-code text-xs">
          
          {/* Top Status Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[11px] text-[#9a9a9a] uppercase font-bold">
                <span className="status-led status-led-active"></span>
                <span>WORKSPACE // {userName}</span>
              </div>
              <h1 className="font-heading-sm text-white uppercase tracking-tight">
                Developer Laboratory
              </h1>
            </div>

            {/* Telemetry Indicators */}
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 border border-white/10 bg-black text-[#8052ff] font-bold">
                LV {userLevel < 10 ? `0${userLevel}` : userLevel}
              </div>

              <div className="px-3 py-1.5 border border-white/10 bg-black text-[#ffb829] font-bold">
                {userXp} XP
              </div>

              <div className="px-3 py-1.5 border border-white/10 bg-black text-[#15846e] font-bold">
                {streakDays}D STREAK
              </div>
            </div>
          </div>

          {/* =====================================================================
              PRIMARY SECTION: WHAT ARE YOU WORKING ON?
              ===================================================================== */}
          <section className="space-y-6">
            
            <div className="flex items-center justify-between text-[11px] text-[#9a9a9a] border-b border-white/10 pb-2">
              <span>CURRENT THREAD</span>
              <span className="text-[#8052ff] font-bold">ACTIVE PROGRESS</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              <div className="lg:col-span-8 space-y-4">
                <div className="space-y-1">
                  <span className="text-[11px] text-[#8052ff] font-bold uppercase">
                    {enrolledCourses.length > 0 ? enrolledCourses[0].title : "Python Fundamentals"}
                  </span>
                  <h2 className="text-2xl font-bold text-white font-sans">
                    Incident #014 // The Empty List Crash
                  </h2>
                  <p className="text-[#9a9a9a] font-sans text-xs leading-relaxed">
                    Handling runtime zero-division edge cases when parsing empty student score records.
                  </p>
                </div>

                {/* Progress Bar with Thin 1px Border */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#9a9a9a]">Thread Mastery:</span>
                    <span className="text-[#15846e] font-bold">78% Complete</span>
                  </div>
                  <div className="w-full h-1 bg-black border border-white/10">
                    <div className="h-full bg-[#8052ff] w-[78%]"></div>
                  </div>
                </div>
              </div>

              {/* Next Move Call to Action */}
              <div className="lg:col-span-4 flex flex-col gap-3 p-5 border border-white/10 bg-black">
                <span className="text-[10px] text-[#9a9a9a] uppercase font-bold">NEXT MOVE</span>
                <Link
                  href="/courses/1/lessons/1"
                  className="edu-btn edu-btn-primary py-3 text-xs flex items-center justify-center gap-2 font-bold w-full"
                >
                  <span>CONTINUE LESSON 01</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  href="/champions"
                  className="edu-btn edu-btn-secondary py-2 text-xs text-center text-[#9a9a9a] hover:text-white"
                >
                  <span>View Next Mission Incident</span>
                </Link>
              </div>

            </div>
          </section>

          {/* =====================================================================
              INTERACTIVE CONCEPT LABORATORY
              ===================================================================== */}
          <section className="space-y-6 border-t border-white/10 pt-8">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
              <span className="font-bold text-white flex items-center gap-2 text-xs">
                <Cpu className="h-3.5 w-3.5 text-[#8052ff]" />
                <span>INTERACTIVE CONCEPT LABORATORY</span>
              </span>
              <span className="text-[10px] text-[#9a9a9a]">REAL-WORLD DEVELOPER ANALOGIES</span>
            </div>

            {/* Concept Selector Tabs */}
            <div className="flex flex-wrap gap-2">
              {(['variables', 'loops', 'pointers', 'functions'] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveConcept(key)}
                  className={`px-3 py-1.5 transition-colors cursor-pointer text-xs font-mono-code font-bold ${
                    activeConcept === key 
                      ? 'bg-[#8052ff] text-white' 
                      : 'bg-black border border-white/10 text-[#9a9a9a] hover:text-white'
                  }`}
                >
                  {key.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Selected Concept Card */}
            <div className="border border-white/10 bg-black p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#8052ff] font-mono-code">
                  {concepts[activeConcept].title}
                </h3>
                <p className="text-xs text-[#bdbdbd] font-sans leading-relaxed">
                  {concepts[activeConcept].analogy}
                </p>
              </div>

              <div className="p-4 bg-black border border-white/10 text-white flex flex-col justify-center">
                <span className="text-[10px] text-[#9a9a9a] mb-2">// Code Implementation:</span>
                <pre className="font-mono-code text-[11px] whitespace-pre-wrap leading-relaxed text-[#bdbdbd]">
                  {concepts[activeConcept].code}
                </pre>
              </div>
            </div>
          </section>

          {/* =====================================================================
              CURRICULUM BLUEPRINTS
              ===================================================================== */}
          <section className="space-y-6 border-t border-white/10 pt-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold text-white text-xs">
                CURRICULUM BLUEPRINTS
              </span>
              <Link href="/courses" className="text-[11px] text-[#8052ff] hover:underline flex items-center gap-1">
                <span>View Full Catalog</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allCourses.slice(0, 2).map((course) => (
                <div 
                  key={course.id}
                  className="border border-white/10 hover:border-white/30 bg-black p-5 flex flex-col justify-between space-y-4 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#9a9a9a] font-bold">TRACK_0{course.id}</span>
                      <span className="px-2 py-0.5 border border-white/10 text-white text-[10px] font-bold">
                        {course.difficulty}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white font-sans">{course.title}</h3>
                    <p className="text-xs text-[#9a9a9a] font-sans leading-relaxed">{course.description}</p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[#9a9a9a] text-[10px]">Duration: {course.duration}</span>
                    <Link
                      href={`/courses/${course.id}`}
                      className="edu-btn edu-btn-secondary py-1.5 px-3 text-xs"
                    >
                      Enter Blueprint
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* =====================================================================
              SECURED CREDENTIAL NODES
              ===================================================================== */}
          <section className="border border-white/10 bg-black p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold text-white text-xs">
                SECURED CREDENTIAL NODES ({certificates.length})
              </span>
              <Link href="/verify" className="text-[11px] text-[#15846e] hover:underline">
                Public Verification Registry
              </Link>
            </div>

            {certificates.length === 0 ? (
              <div className="p-6 text-center text-[#9a9a9a] space-y-2 border border-white/10 bg-black">
                <Award className="h-6 w-6 text-[#9a9a9a] mx-auto" />
                <p className="text-xs">No certificates issued yet. Complete all lessons and score &gt;= 70% on the final exam to issue your verified credential.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {certificates.map((cert) => (
                  <Link
                    key={cert.id}
                    href={`/certificates/${cert.uuid}`}
                    className="p-3 bg-black border border-white/10 hover:border-[#15846e] flex items-center justify-between transition-colors"
                  >
                    <div>
                      <span className="font-bold text-white block">{cert.course_title}</span>
                      <span className="text-[10px] text-[#9a9a9a]">{cert.uuid}</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#15846e]" />
                  </Link>
                ))}
              </div>
            )}
          </section>

          <DonationWidget />

        </main>
      </div>
    </div>
  );
}
