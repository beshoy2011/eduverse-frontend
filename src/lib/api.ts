const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  xp: number;
  level: number;
  rank: string;
  completed_courses_count: number;
  certificates_count: number;
  achievements: string[];
  streak_days: number;
  last_active: string;
  active_frame?: string;
  active_theme?: string;
  unlocked_items?: string[];
  streak_freezes?: number;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  skills: string; // comma separated
  duration: string;
  difficulty: string;
  theme_style: string;
  intro_video_url?: string;
}

export interface Lesson {
  id: number;
  course_id: number;
  title: string;
  sequence_order: number;
}

export interface LessonDetail extends Lesson {
  content: string;
  code_template?: string;
  solution?: string;
  test_cases?: any[];
  practice_questions?: any[]; // JSON array of quiz questions
}

export interface CourseDetail extends Course {
  lessons: Lesson[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Question {
  id: number;
  question_text: string;
  options: string[];
  code_snippet?: string;
}

export interface Exam {
  id: number;
  course_id: number;
  title: string;
  duration_minutes: number;
  questions: Question[];
}

export interface ExamResult {
  score: number;
  passed: boolean;
  passed_score: number;
  correct_answers_count: number;
  total_questions: number;
}

export interface Certificate {
  id: number;
  uuid: string;
  issue_date: string;
  recipient_name: string;
  course_title: string;
}

// Helper to check if window is defined (for SSR safety)
const isServer = typeof window === 'undefined';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = !isServer ? localStorage.getItem('eduverse_token') : null;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    if (res.status === 401) {
      if (!isServer) {
        localStorage.removeItem('eduverse_token');
        localStorage.removeItem('eduverse_user_name');
        localStorage.removeItem('eduverse_user_id');
        localStorage.removeItem('eduverse_user_email');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
          window.location.href = '/login';
        }
      }
    }
    let errorMsg = 'An error occurred';
    try {
      const errorJson = await res.json();
      errorMsg = errorJson.detail || errorMsg;
    } catch (e) {
      // not a json response
    }
    throw new Error(errorMsg);
  }

  return res.json();
}

export const api = {
  // --- Auth ---
  async register(data: any): Promise<{ access_token: string; token_type: string; user: User }> {
    return fetchAPI('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async login(data: any): Promise<{ access_token: string; token_type: string; user: User }> {
    return fetchAPI('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async loginWithGoogle(token: string, isSimulation?: boolean, email?: string, name?: string): Promise<{ access_token: string; token_type: string; user: User }> {
    return fetchAPI('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token, is_simulation: isSimulation, email, name }),
    });
  },

  async getMe(): Promise<User> {
    return fetchAPI('/api/auth/me');
  },

  // --- Courses ---
  async getCourses(): Promise<Course[]> {
    return fetchAPI('/api/courses');
  },

  async getEnrolledCourses(): Promise<Course[]> {
    return fetchAPI('/api/courses/enrolled');
  },

  async getCourseDetail(courseId: number): Promise<CourseDetail> {
    return fetchAPI(`/api/courses/${courseId}`);
  },

  async enrollInCourse(courseId: number): Promise<any> {
    return fetchAPI(`/api/courses/${courseId}/enroll`, {
      method: 'POST',
    });
  },

  // --- Lessons ---
  async getLesson(lessonId: number): Promise<LessonDetail> {
    return fetchAPI(`/api/lessons/${lessonId}`);
  },

  // --- Progress ---
  async getCourseProgress(courseId: number): Promise<{ completed_lesson_ids: number[]; percent_complete: number }> {
    return fetchAPI(`/api/progress/${courseId}`);
  },

  async markLessonComplete(lessonId: number): Promise<any> {
    return fetchAPI(`/api/progress/${lessonId}/complete`, {
      method: 'POST',
    });
  },

  // --- Chat / Tutor ---
  async sendChatMessage(message: string, lessonId?: number, history?: ChatMessage[]): Promise<{ reply: string }> {
    return fetchAPI('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, lesson_id: lessonId, history }),
    });
  },

  async getChatHistory(lessonId: number): Promise<ChatMessage[]> {
    return fetchAPI(`/api/chat/history/${lessonId}`);
  },

  // --- Exams ---
  async getExam(courseId: number): Promise<Exam> {
    return fetchAPI(`/api/exams/${courseId}`);
  },

  async submitExam(courseId: number, answers: { question_id: number; selected_option_index: number }[]): Promise<ExamResult> {
    return fetchAPI(`/api/exams/${courseId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  },

  // --- Certificates ---
  async getUserCertificates(): Promise<Certificate[]> {
    return fetchAPI('/api/certificates/user');
  },

  async getCertificate(uuid: string): Promise<Certificate> {
    return fetchAPI(`/api/certificates/uuid/${uuid}`);
  },

  getDownloadUrl(uuid: string): string {
    return `${API_URL}/api/certificates/download/${uuid}`;
  },

  // --- Leaderboard ---
  async getMonthlyLeaderboard(): Promise<LeaderboardEntry[]> {
    return fetchAPI('/api/leaderboard/monthly');
  },

  async getAllTimeLeaderboard(): Promise<LeaderboardEntry[]> {
    return fetchAPI('/api/leaderboard/all-time');
  },

  async getLeaderboardStats(): Promise<LeaderboardStats> {
    return fetchAPI('/api/leaderboard/stats');
  },

  // --- Challenges ---
  async getChallenges(): Promise<Challenge[]> {
    return fetchAPI('/api/challenges');
  },

  async claimChallenge(challengeId: string): Promise<{ status: string; claimed_xp: number; new_xp: number; new_level: number }> {
    return fetchAPI(`/api/challenges/claim/${challengeId}`, {
      method: 'POST',
    });
  },

  // --- Profile ---
  async getUserProfile(userId: number): Promise<ProfileData> {
    return fetchAPI(`/api/profile/${userId}`);
  },

  async updateAvatar(avatarId: string): Promise<{ status: string; active_avatar: string }> {
    return fetchAPI('/api/profile/update-avatar', {
      method: 'POST',
      body: JSON.stringify({ avatar_id: avatarId }),
    });
  },

  // --- AI Code Reviewer ---
  async aiReview(code: string, lessonTitle: string, lessonContent: string): Promise<{ grade: string; complexity: string; feedback: string; suggestions: string[]; improved_code: string }> {
    return fetchAPI('/api/ai-review', {
      method: 'POST',
      body: JSON.stringify({ code, lesson_title: lessonTitle, lesson_content: lessonContent }),
    });
  },

  // --- AI Mock Interview ---
  async startInterview(role: string): Promise<any> {
    return fetchAPI('/api/interview/start', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
  },

  async respondInterview(sessionId: number, response: string): Promise<any> {
    return fetchAPI('/api/interview/respond', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId, response }),
    });
  },

  async getInterviewHistory(): Promise<any[]> {
    return fetchAPI('/api/interview/history');
  },

  // --- Coder Shop ---
  async getShopItems(): Promise<any[]> {
    return fetchAPI('/api/shop/items');
  },

  async buyShopItem(itemId: string): Promise<User> {
    return fetchAPI('/api/shop/buy', {
      method: 'POST',
      body: JSON.stringify({ item_id: itemId }),
    });
  },

  async activateShopItem(itemId: string, category: string): Promise<User> {
    return fetchAPI('/api/shop/activate', {
      method: 'POST',
      body: JSON.stringify({ item_id: itemId, category }),
    });
  },

  // --- Quests ---
  async getQuests(): Promise<Challenge[]> {
    return fetchAPI('/api/quests');
  },

  async claimQuest(questId: string): Promise<User> {
    return fetchAPI(`/api/quests/claim/${questId}`, {
      method: 'POST',
    });
  },

  // --- Lounge Message Board ---
  async getLoungePosts(): Promise<any[]> {
    return fetchAPI('/api/lounge/posts');
  },

  async createLoungePost(message: string): Promise<any> {
    return fetchAPI('/api/lounge/post', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  async likeLoungePost(postId: number): Promise<any> {
    return fetchAPI(`/api/lounge/like/${postId}`, {
      method: 'POST',
    });
  }
};

export interface LeaderboardEntry {
  rank: number;
  name: string;
  email: string;
  xp: number;
  level: number;
  rank_title: string;
  certificates_count: number;
  completed_courses_count: number;
}

export interface LeaderboardStats {
  total_learners: number;
  total_certificates: number;
  total_lessons_completed: number;
  active_learners_today: number;
}

export interface Challenge {
  id: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  type: 'daily' | 'weekly' | 'global';
  xp_reward: number;
  target: number;
  progress: number;
  is_claimed: boolean;
  is_completed: boolean;
}

export interface ProfileCourseProgress {
  course_id: number;
  title: string;
  percent_complete: number;
  is_completed: boolean;
}

export interface ProfileData {
  id: number;
  name: string;
  email: string;
  xp: number;
  level: number;
  rank: string;
  streak_days: number;
  completed_courses_count: number;
  certificates_count: number;
  achievements: string[];
  global_position: number;
  certificates: Certificate[];
  progress: ProfileCourseProgress[];
  unlocked_items?: string[];
  streak_freezes?: number;
  active_frame?: string;
  active_theme?: string;
}

