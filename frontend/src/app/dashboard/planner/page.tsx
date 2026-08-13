'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import DonationWidget from '@/components/DonationWidget';
import { api, StudyTask } from '@/lib/api';
import { 
  Calendar as CalendarIcon, 
  CheckCircle, 
  Circle, 
  Clock, 
  Plus, 
  Trash2, 
  Loader2, 
  BookOpen, 
  Code, 
  Award,
  Sparkles
} from 'lucide-react';

const t = {
  en: {
    title: "Study Planner",
    subtitle: "Organize your learning journey and track upcoming deadlines.",
    addTask: "Add New Task",
    taskTitlePlaceholder: "What do you need to study?",
    taskDescPlaceholder: "Add details (optional)",
    typeStudy: "Study Session",
    typeProject: "Project",
    typeExam: "Exam Prep",
    dueDate: "Due Date",
    saveTask: "Save Task",
    upcoming: "Upcoming Tasks",
    completed: "Completed",
    noTasks: "No tasks found. Time to add some goals!",
    loading: "Loading Planner...",
    today: "Today",
    tomorrow: "Tomorrow",
    delete: "Delete"
  },
  ar: {
    title: "خطة الدراسة",
    subtitle: "نظم رحلتك التعليمية وتتبع المواعيد النهائية القادمة.",
    addTask: "إضافة مهمة جديدة",
    taskTitlePlaceholder: "ماذا تحتاج أن تدرس؟",
    taskDescPlaceholder: "إضافة تفاصيل (اختياري)",
    typeStudy: "جلسة دراسة",
    typeProject: "مشروع",
    typeExam: "تحضير للامتحان",
    dueDate: "تاريخ التسليم",
    saveTask: "حفظ المهمة",
    upcoming: "المهام القادمة",
    completed: "المكتملة",
    noTasks: "لا توجد مهام. حان الوقت لإضافة بعض الأهداف!",
    loading: "جاري تحميل الخطة...",
    today: "اليوم",
    tomorrow: "غداً",
    delete: "حذف"
  }
};

export default function StudyPlannerPage() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New task form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskType, setNewTaskType] = useState('study');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await api.getStudyTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks", error);
      // Fallback mocks
      setTasks([
        { id: 1, user_id: 1, title: "Finish Python Loops", description: "Complete the loops practice exercises", task_type: "study", is_completed: false, created_at: new Date().toISOString(), deadline: new Date(Date.now() + 86400000).toISOString() },
        { id: 2, user_id: 1, title: "Build Chat App", description: "Use WebSocket to build a real-time chat", task_type: "project", is_completed: true, created_at: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    try {
      setIsSubmitting(true);
      const data = {
        title: newTaskTitle,
        description: newTaskDesc,
        task_type: newTaskType,
        deadline: newTaskDate ? new Date(newTaskDate).toISOString() : undefined
      };
      
      const created = await api.createStudyTask(data);
      setTasks(prev => [created, ...prev]);
      
      // Reset form
      setNewTaskTitle('');
      setNewTaskDesc('');
      setNewTaskType('study');
      setNewTaskDate('');
      setShowAddForm(false);
    } catch (error) {
      console.error("Failed to create task", error);
      alert("Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTask = async (task: StudyTask) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, is_completed: !t.is_completed } : t));
    
    try {
      await api.updateStudyTask(task.id, { is_completed: !task.is_completed });
    } catch (error) {
      console.error("Failed to update task", error);
      // Revert on error
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, is_completed: task.is_completed } : t));
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    
    setTasks(prev => prev.filter(t => t.id !== taskId));
    try {
      await api.deleteStudyTask(taskId);
    } catch (error) {
      console.error("Failed to delete task", error);
      loadTasks(); // Reload to restore state
    }
  };

  const currentT = t[lang];
  const isRtl = lang === 'ar';
  
  const upcomingTasks = tasks.filter(t => !t.is_completed);
  const completedTasks = tasks.filter(t => t.is_completed);

  const getTaskIcon = (type: string) => {
    switch(type) {
      case 'project': return <Code className="h-4 w-4 text-violet-500" />;
      case 'exam': return <Award className="h-4 w-4 text-amber-500" />;
      default: return <BookOpen className="h-4 w-4 text-indigo-500" />;
    }
  };
  
  const formatDeadline = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return currentT.today;
    if (date.toDateString() === tomorrow.toDateString()) return currentT.tomorrow;
    
    return date.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 overflow-y-auto flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{currentT.loading}</span>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Header */}
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 ${isRtl ? 'md:flex-row-reverse text-right' : 'text-left'}`}>
              <div>
                <h1 className={`text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <CalendarIcon className="h-7 w-7 text-indigo-500" />
                  {currentT.title}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{currentT.subtitle}</p>
              </div>
              
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all ${isRtl ? 'flex-row-reverse' : ''}`}
              >
                <Plus className={`h-5 w-5 transition-transform ${showAddForm ? 'rotate-45' : ''}`} />
                {currentT.addTask}
              </button>
            </div>

            {/* Add Task Form Area */}
            {showAddForm && (
              <form onSubmit={handleAddTask} className="bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-6 shadow-xl shadow-indigo-500/5 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className={`flex flex-col gap-5 ${isRtl ? 'text-right' : 'text-left'}`}>
                  
                  <div>
                    <input 
                      type="text" 
                      required
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder={currentT.taskTitlePlaceholder}
                      className={`w-full text-lg font-bold bg-transparent border-b-2 border-slate-200 dark:border-slate-800 focus:border-indigo-500 p-2 outline-none transition-colors text-slate-900 dark:text-white ${isRtl ? 'text-right' : 'text-left'}`}
                    />
                  </div>
                  
                  <div>
                    <input 
                      type="text" 
                      value={newTaskDesc}
                      onChange={(e) => setNewTaskDesc(e.target.value)}
                      placeholder={currentT.taskDescPlaceholder}
                      className={`w-full text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-300 ${isRtl ? 'text-right' : 'text-left'}`}
                    />
                  </div>

                  <div className={`flex flex-col sm:flex-row gap-4 items-start sm:items-center ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 w-full sm:w-auto">
                      <button type="button" onClick={() => setNewTaskType('study')} className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${newTaskType === 'study' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>
                        <BookOpen className="h-3.5 w-3.5" /> {currentT.typeStudy}
                      </button>
                      <button type="button" onClick={() => setNewTaskType('project')} className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${newTaskType === 'project' ? 'bg-white dark:bg-slate-700 shadow-sm text-violet-600 dark:text-violet-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>
                        <Code className="h-3.5 w-3.5" /> {currentT.typeProject}
                      </button>
                      <button type="button" onClick={() => setNewTaskType('exam')} className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${newTaskType === 'exam' ? 'bg-white dark:bg-slate-700 shadow-sm text-amber-600 dark:text-amber-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>
                        <Award className="h-3.5 w-3.5" /> {currentT.typeExam}
                      </button>
                    </div>

                    <div className={`flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 w-full sm:w-auto ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <Clock className="h-4 w-4 text-slate-400" />
                      <input 
                        type="date" 
                        value={newTaskDate}
                        onChange={(e) => setNewTaskDate(e.target.value)}
                        className={`bg-transparent outline-none text-xs text-slate-600 dark:text-slate-300 cursor-pointer ${isRtl ? 'text-right' : 'text-left'}`} 
                      />
                    </div>
                    
                    <div className={isRtl ? 'mr-auto' : 'ml-auto'}>
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-md transition-colors w-full sm:w-auto flex justify-center items-center gap-2"
                      >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        {currentT.saveTask}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Tasks Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* UPCOMING TASKS */}
              <div className="space-y-4">
                <div className={`flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}>
                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
                  <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-200">{currentT.upcoming} ({upcomingTasks.length})</h2>
                </div>

                <div className="space-y-3">
                  {upcomingTasks.length > 0 ? upcomingTasks.map(task => (
                    <div 
                      key={task.id} 
                      className={`group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-start justify-between gap-4 ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}
                    >
                      <button onClick={() => handleToggleTask(task)} className="mt-0.5 shrink-0 text-slate-300 hover:text-indigo-500 dark:text-slate-600 dark:hover:text-indigo-400 transition-colors">
                        <Circle className="h-6 w-6" />
                      </button>
                      
                      <div className="flex-1 space-y-1">
                        <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{task.title}</h4>
                        {task.description && <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{task.description}</p>}
                        
                        <div className={`flex items-center gap-3 pt-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            {getTaskIcon(task.task_type)}
                            {task.task_type}
                          </span>
                          
                          {task.deadline && (
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 ${isRtl ? 'flex-row-reverse' : ''}`}>
                              <Clock className="h-3 w-3" />
                              {formatDeadline(task.deadline)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <button onClick={() => handleDeleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-all p-1 shrink-0">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )) : (
                    <div className="bg-slate-100/50 dark:bg-slate-900/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-sm">
                      {currentT.noTasks}
                    </div>
                  )}
                </div>
              </div>

              {/* COMPLETED TASKS */}
              <div className="space-y-4">
                <div className={`flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}>
                  <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                  <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-200">{currentT.completed} ({completedTasks.length})</h2>
                </div>

                <div className="space-y-3 opacity-60 hover:opacity-100 transition-opacity">
                  {completedTasks.map(task => (
                    <div 
                      key={task.id} 
                      className={`group bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4 ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}
                    >
                      <button onClick={() => handleToggleTask(task)} className="shrink-0 text-emerald-500 hover:text-emerald-600 transition-colors">
                        <CheckCircle className="h-6 w-6" />
                      </button>
                      
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-600 dark:text-slate-400 line-through decoration-slate-400/50 leading-tight">{task.title}</h4>
                      </div>
                      
                      <button onClick={() => handleDeleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-all p-1 shrink-0">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
      <DonationWidget />
    </div>
  );
}
