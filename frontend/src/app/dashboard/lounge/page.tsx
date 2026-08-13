'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Heart, 
  Send, 
  Sparkles, 
  Bot, 
  Code, 
  Tag, 
  Flame, 
  Filter, 
  Loader2,
  Share2
} from 'lucide-react';
import { api } from '@/lib/api';

interface Post {
  id: number;
  user_id: number;
  username: string;
  avatar: string;
  message: string;
  created_at: string;
  likes: number;
  is_liked: boolean;
  tag?: string;
  ai_reply?: string;
}

const translations = {
  en: {
    title: "Coder Lounge",
    subtitle: "Share code snippets, discuss solutions, and interact with the EduVerse community & AI Mentor.",
    postPlaceholder: "What are you coding today? Share a snippet or ask a question...",
    postBtn: "Post to Lounge",
    filterAll: "All Posts",
    filterPython: "Python",
    filterCpp: "C++",
    filterWeb: "Web Dev",
    filterAI: "AI & ML",
    aiAskBtn: "Get AI Tutor Answer",
    aiThinking: "AI Mentor is typing an answer...",
    likes: "Likes",
    noPosts: "No community posts yet. Be the first to share something!"
  },
  ar: {
    title: "ملتقى المبرمجين",
    subtitle: "شارك أكوادك البرمجية، وناقش الحلول، وتفاعل مع مجتمع إديو فيرس والمعلم الذكي.",
    postPlaceholder: "ماذا تبرمج اليوم؟ شارك كوداً أو اطرح سؤالاً...",
    postBtn: "نشر في الملتقى",
    filterAll: "جميع المنشورات",
    filterPython: "بايثون",
    filterCpp: "سي بلس بلس",
    filterWeb: "تطوير الويب",
    filterAI: "الذكاء الاصطناعي",
    aiAskBtn: "إجابة المعلم الذكي",
    aiThinking: "المعلم الذكي يكتب إجابة...",
    likes: "إعجابات",
    noPosts: "لا توجد منشورات مجتمعية بعد. كن أول من يشارك شفرة!"
  }
};

export default function LoungePage() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedTag, setSelectedTag] = useState('Python');
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [aiReplyingId, setAiReplyingId] = useState<number | null>(null);

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

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await api.getLoungePosts();
      setPosts(data);
    } catch (err) {
      console.error('Failed loading lounge posts', err);
      // Fallback mock posts
      setPosts([
        {
          id: 101,
          user_id: 1,
          username: "Beshoy Nabil",
          avatar: "B",
          message: "Just solved the Fibonacci recursion challenge in C++! Pointers made memory usage super clean 🚀\n\n```cpp\nint fib(int n) {\n  if (n <= 1) return n;\n  return fib(n-1) + fib(n-2);\n}\n```",
          created_at: "10 mins ago",
          likes: 8,
          is_liked: false,
          tag: "C++",
          ai_reply: "Excellent job! Note that recursion has O(2^N) time complexity. Try memoization or dynamic programming for O(N) performance! 💡"
        },
        {
          id: 102,
          user_id: 2,
          username: "Sarah Miller",
          avatar: "S",
          message: "What is the best way to handle asynchronous API calls in Next.js 16 App Router?",
          created_at: "1 hour ago",
          likes: 5,
          is_liked: true,
          tag: "Web Dev"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const t = translations[lang];
  const isAr = lang === 'ar';

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || submitting) return;

    try {
      setSubmitting(true);
      const created = await api.createLoungePost(newPost);
      setPosts(prev => [
        {
          ...created,
          tag: selectedTag,
          avatar: created.username ? created.username[0].toUpperCase() : 'U'
        },
        ...prev
      ]);
      setNewPost('');
    } catch (err) {
      // Local addition fallback
      const mockNew: Post = {
        id: Date.now(),
        user_id: 99,
        username: localStorage.getItem('eduverse_user_name') || 'Student Coder',
        avatar: (localStorage.getItem('eduverse_user_name') || 'S')[0].toUpperCase(),
        message: newPost,
        created_at: "Just now",
        likes: 1,
        is_liked: false,
        tag: selectedTag
      };
      setPosts(prev => [mockNew, ...prev]);
      setNewPost('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId: number) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: p.is_liked ? p.likes - 1 : p.likes + 1,
          is_liked: !p.is_liked
        };
      }
      return p;
    }));

    try {
      await api.likeLoungePost(postId);
    } catch (err) {
      // Swallowed as local optimistic update handled it
    }
  };

  const handleRequestAIReply = async (postId: number, message: string) => {
    try {
      setAiReplyingId(postId);
      const res = await api.sendChatMessage(message, 0);
      setPosts(posts.map(p => p.id === postId ? { ...p, ai_reply: res.reply } : p));
    } catch (err) {
      setPosts(posts.map(p => p.id === postId ? {
        ...p,
        ai_reply: isAr ? 'أحسنت القول! استمر في التعلم وتطبيق المفاهيم البرمجية اليومية.' : 'Great question/code! Keep practicing and applying software patterns.'
      } : p));
    } finally {
      setAiReplyingId(null);
    }
  };

  const filteredPosts = posts.filter(p => {
    if (activeFilter === 'All') return true;
    return p.tag?.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="h-full flex flex-col p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className={`flex flex-col ${isAr ? 'items-end text-right' : 'items-start text-left'}`}>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          {t.title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{t.subtitle}</p>
      </div>

      {/* Post Creator Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <form onSubmit={handleCreatePost} className="space-y-4">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder={t.postPlaceholder}
            rows={3}
            className={`w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500 transition-colors resize-none ${
              isAr ? 'text-right' : 'text-left'
            }`}
          />

          <div className={`flex flex-wrap items-center justify-between gap-4 ${isAr ? 'flex-row-reverse' : ''}`}>
            {/* Topic Select */}
            <div className={`flex items-center gap-2 ${isAr ? 'flex-row-reverse' : ''}`}>
              <Tag size={16} className="text-slate-400" />
              {['Python', 'C++', 'Web Dev', 'AI'].map(tag => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    selectedTag === tag
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !newPost.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/20 transition-transform active:scale-95 disabled:opacity-50"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className={isAr ? 'rotate-180' : ''} />}
              {t.postBtn}
            </button>
          </div>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className={`flex overflow-x-auto gap-2 pb-1 ${isAr ? 'flex-row-reverse' : ''}`}>
        {['All', 'Python', 'C++', 'Web Dev'].map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              activeFilter === filter
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {filter === 'All' ? t.filterAll : filter}
          </button>
        ))}
      </div>

      {/* Feed Posts */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 ${
                  isAr ? 'text-right' : 'text-left'
                }`}
              >
                {/* Author Info */}
                <div className={`flex items-center justify-between ${isAr ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-3 ${isAr ? 'flex-row-reverse' : ''}`}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black flex items-center justify-center shadow">
                      {post.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {post.username}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {post.created_at}
                      </span>
                    </div>
                  </div>

                  {post.tag && (
                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full border border-indigo-100 dark:border-indigo-900/50">
                      {post.tag}
                    </span>
                  )}
                </div>

                {/* Message Body */}
                <p className="text-sm md:text-base leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                  {post.message}
                </p>

                {/* AI Tutor Reply Box */}
                {post.ai_reply && (
                  <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-100 space-y-1">
                    <div className={`flex items-center gap-2 text-xs font-bold text-amber-400 ${isAr ? 'flex-row-reverse' : ''}`}>
                      <Bot size={16} />
                      <span>{isAr ? 'إجابة المعلم الذكي' : 'AI Tutor Insight'}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-200 mt-1">
                      {post.ai_reply}
                    </p>
                  </div>
                )}

                {/* Actions Footer */}
                <div className={`pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between ${isAr ? 'flex-row-reverse' : ''}`}>
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      post.is_liked
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Heart size={14} className={post.is_liked ? 'fill-current' : ''} />
                    <span>{post.likes} {t.likes}</span>
                  </button>

                  {!post.ai_reply && (
                    <button
                      onClick={() => handleRequestAIReply(post.id, post.message)}
                      disabled={aiReplyingId === post.id}
                      className={`flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-xl text-xs font-bold transition-colors ${
                        isAr ? 'flex-row-reverse' : ''
                      }`}
                    >
                      {aiReplyingId === post.id ? (
                        <Loader2 size={14} className="animate-spin text-indigo-500" />
                      ) : (
                        <Sparkles size={14} className="text-amber-400" />
                      )}
                      <span>{t.aiAskBtn}</span>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredPosts.length === 0 && (
            <div className="py-16 text-center text-slate-500">
              <MessageSquare className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
              <p>{t.noPosts}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
