from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import List, Optional, Any
from datetime import datetime

# --- Auth Schemas ---
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    is_admin: bool
    created_at: datetime
    xp: int
    level: int
    rank: str
    completed_courses_count: int
    certificates_count: int
    achievements: List[str]
    streak_days: int
    last_active: datetime
    unlocked_items: List[str]
    streak_freezes: int
    active_frame: str
    active_theme: str

    @field_validator('achievements', 'unlocked_items', mode='before')
    @classmethod
    def default_lists(cls, v):
        return v if v is not None else []

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class TokenData(BaseModel):
    email: Optional[str] = None

class GoogleAuthRequest(BaseModel):
    token: str
    is_simulation: bool = False
    email: Optional[str] = None
    name: Optional[str] = None


# --- Course & Lesson Schemas ---
class LessonCreate(BaseModel):
    title: str
    sequence_order: int
    content: str
    code_template: Optional[str] = None
    solution: Optional[str] = None
    test_cases: Optional[List[dict]] = None
    practice_questions: Optional[List[dict]] = None

class LessonOut(BaseModel):
    id: int
    course_id: int
    title: str
    sequence_order: int

    class Config:
        from_attributes = True

class LessonDetailOut(BaseModel):
    id: int
    course_id: int
    title: str
    sequence_order: int
    content: str
    code_template: Optional[str] = None
    solution: Optional[str] = None
    test_cases: Optional[Any] = None  # JSON array
    practice_questions: Optional[Any] = None  # JSON array

    class Config:
        from_attributes = True

class CourseOut(BaseModel):
    id: int
    title: str
    description: str
    skills: str
    duration: str
    difficulty: str
    theme_style: str
    intro_video_url: Optional[str] = None

    class Config:
        from_attributes = True

class CourseDetailOut(CourseOut):
    lessons: List[LessonOut] = []

    class Config:
        from_attributes = True

class EnrollmentOut(BaseModel):
    id: int
    user_id: int
    course_id: int
    enrolled_at: datetime
    is_completed: bool

    class Config:
        from_attributes = True


# --- Progress Schemas ---
class ProgressOut(BaseModel):
    id: int
    user_id: int
    lesson_id: int
    completed_at: datetime

    class Config:
        from_attributes = True

class ProgressStatus(BaseModel):
    completed_lesson_ids: List[int]
    percent_complete: float


# --- Chat/Tutor Schemas ---
class ChatMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    message: str
    lesson_id: Optional[int] = None
    history: Optional[List[ChatMessage]] = None

class ChatResponse(BaseModel):
    reply: str


# --- Exam Schemas ---
class QuestionOut(BaseModel):
    id: int
    question_text: str
    options: List[str]
    code_snippet: Optional[str] = None

    class Config:
        from_attributes = True

class ExamOut(BaseModel):
    id: int
    course_id: int
    title: str
    duration_minutes: int
    questions: List[QuestionOut]

    class Config:
        from_attributes = True

class AnswerSubmission(BaseModel):
    question_id: int
    selected_option_index: int

class ExamSubmission(BaseModel):
    answers: List[AnswerSubmission]

class ExamResultOut(BaseModel):
    score: float
    passed: bool
    passed_score: float = 70.0
    correct_answers_count: int
    total_questions: int

    class Config:
        from_attributes = True


# --- Certificate Schemas ---
class CertificateOut(BaseModel):
    id: int
    uuid: str
    certificate_id: Optional[str] = None
    verification_token: Optional[str] = None
    issue_date: datetime
    recipient_name: str
    course_title: str
    status: Optional[str] = "Verified"

    class Config:
        from_attributes = True

class CertificateVerificationResponse(BaseModel):
    valid: bool
    status: str  # Verified, Revoked, Expired
    certificate_id: str
    verification_token: str
    uuid: str
    student_name: str
    student_email: Optional[str] = None
    course_name: str
    issue_date: datetime
    completion_date: datetime
    hours_completed: int
    skills: List[str]
    grade: str
    revocation_reason: Optional[str] = None
    instructor: str = "Beshoy Simon"
    program: str = "EduVerse Signature Program"
    verification_url: str

class CertificateIssueRequest(BaseModel):
    user_id: int
    course_id: int
    student_name: str
    student_email: str
    course_name: str
    hours_completed: Optional[int] = 40
    skills: Optional[str] = "Replit Agent, Next.js 16, LLMs, Vector Search, FastAPI"
    grade: Optional[str] = "Distinction"


# --- Dynamic Gamification Schemas ---
class LeaderboardEntry(BaseModel):
    rank: int
    name: str
    email: str
    xp: int
    level: int
    rank_title: str
    certificates_count: int
    completed_courses_count: int

class LeaderboardStats(BaseModel):
    total_learners: int
    total_certificates: int
    total_lessons_completed: int
    active_learners_today: int

class ChallengeOut(BaseModel):
    id: str
    title_en: str
    title_ar: str
    description_en: str
    description_ar: str
    type: str  # daily, weekly, global
    xp_reward: int
    target: int
    progress: int
    is_claimed: bool
    is_completed: bool

class ProfileCourseProgress(BaseModel):
    course_id: int
    title: str
    percent_complete: float
    is_completed: bool

class ProfileOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    xp: int
    level: int
    rank: str
    streak_days: int
    completed_courses_count: int
    certificates_count: int
    achievements: List[str]
    global_position: int
    certificates: List[CertificateOut]
    progress: List[ProfileCourseProgress]
    unlocked_items: List[str]
    streak_freezes: int
    active_frame: str
    active_theme: str

    @field_validator('achievements', 'unlocked_items', mode='before')
    @classmethod
    def default_lists(cls, v):
        return v if v is not None else []

class AvatarUpdateRequest(BaseModel):
    avatar_id: str


# --- New Feature Schemas ---

# AI Code Review
class CodeReviewRequest(BaseModel):
    code: str
    lesson_title: str
    lesson_content: str

class CodeReviewResponse(BaseModel):
    grade: str
    complexity: str
    feedback: str
    suggestions: List[str]
    improved_code: str

# AI Mock Interview
class InterviewStartRequest(BaseModel):
    role: str

class InterviewRespondRequest(BaseModel):
    session_id: int
    response: str

class InterviewSessionOut(BaseModel):
    id: int
    role: str
    messages: List[Any]
    status: str
    feedback: Optional[Any] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Coder Shop
class ShopItemOut(BaseModel):
    id: str
    name: str
    cost: int
    category: str
    description: str
    style_class: str

class BuyRequest(BaseModel):
    item_id: str

class ActivateRequest(BaseModel):
    item_id: str
    category: str

# Coder Lounge
class LoungePostCreate(BaseModel):
    message: str

class LoungePostOut(BaseModel):
    id: int
    user_id: int
    username: str
    avatar: str
    message: str
    created_at: datetime
    likes: int
    is_liked: bool = False

    class Config:
        from_attributes = True


# Analytics Schemas
class DailyActivity(BaseModel):
    day: str
    date_str: str
    hours: float
    xp: int

class SubjectStat(BaseModel):
    subject: str
    progress_percent: float
    total_lessons: int
    completed_lessons: int
    score_avg: float

class SkillHeatmapItem(BaseModel):
    skill: str
    category: str
    mastery_level: int # 1 to 5
    status: str # Mastered, In Progress, Needs Review

class AIInsightResponse(BaseModel):
    strengths: List[str]
    improvements: List[str]
    recommended_lessons: List[dict]
    weekly_summary: str

class StudentAnalyticsOut(BaseModel):
    total_learning_hours: float
    total_xp: int
    completion_rate: float
    streak_days: int
    weekly_activity: List[DailyActivity]
    subject_comparison: List[SubjectStat]
    skill_heatmap: List[SkillHeatmapItem]

class TeacherStudentOverview(BaseModel):
    id: int
    name: str
    email: str
    xp: int
    level: int
    completed_courses: int
    streak_days: int
    avg_score: float
    last_active: str

class TeacherClassStats(BaseModel):
    total_students: int
    active_students_this_week: int
    avg_completion_rate: float
    top_subject: str
    students: List[TeacherStudentOverview]

# --- Study Planner Schemas ---
class StudyTaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    task_type: str = "study"
    deadline: Optional[datetime] = None

class StudyTaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    task_type: Optional[str] = None
    deadline: Optional[datetime] = None
    is_completed: Optional[bool] = None

class StudyTaskOut(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str]
    task_type: str
    deadline: Optional[datetime]
    is_completed: bool
    created_at: datetime

    class Config:
        from_attributes = True
