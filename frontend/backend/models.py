import datetime
import uuid
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Gamification Fields
    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    rank = Column(String, default="Beginner")
    completed_courses_count = Column(Integer, default=0)
    certificates_count = Column(Integer, default=0)
    achievements = Column(JSON, default=list)  # list of strings (achievement IDs)
    streak_days = Column(Integer, default=4)
    last_active = Column(DateTime, default=datetime.datetime.utcnow)
    unlocked_items = Column(JSON, default=list)  # purchased items
    streak_freezes = Column(Integer, default=0)
    active_frame = Column(String, default="default")
    active_theme = Column(String, default="default")
    
    enrollments = relationship("Enrollment", back_populates="user", cascade="all, delete-orphan")
    progress = relationship("Progress", back_populates="user", cascade="all, delete-orphan")
    results = relationship("Result", back_populates="user", cascade="all, delete-orphan")
    certificates = relationship("Certificate", back_populates="user", cascade="all, delete-orphan")
    chat_histories = relationship("ChatHistory", back_populates="user", cascade="all, delete-orphan")
    interviews = relationship("InterviewSession", back_populates="user", cascade="all, delete-orphan")
    lounge_posts = relationship("LoungePost", back_populates="user", cascade="all, delete-orphan")
    study_logs = relationship("StudyLog", back_populates="user", cascade="all, delete-orphan")
    study_tasks = relationship("StudyTask", back_populates="user", cascade="all, delete-orphan")

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    skills = Column(String, nullable=False)  # Comma-separated list of skills
    duration = Column(String, nullable=False)  # e.g., "12 hours"
    difficulty = Column(String, nullable=False)  # e.g., "Beginner"
    
    # Theme & Media Fields
    theme_style = Column(String, default="default")  # cosmic, cyberpunk, volcano, creative, electric, laboratory
    intro_video_url = Column(String, nullable=True)
    
    lessons = relationship("Lesson", back_populates="course", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="course", cascade="all, delete-orphan")
    exams = relationship("Exam", back_populates="course", cascade="all, delete-orphan")
    certificates = relationship("Certificate", back_populates="course", cascade="all, delete-orphan")


class Lesson(Base):
    __tablename__ = "lessons"
    
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String, nullable=False)
    sequence_order = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)  # Markdown text explaining concept
    code_template = Column(Text, nullable=True)  # Starter code template for practice
    solution = Column(Text, nullable=True)  # Solution code
    test_cases = Column(JSON, nullable=True)  # [{input: '...', output: '...'}]
    practice_questions = Column(JSON, nullable=True)  # [{question: '...', options: [], answer: 0}]
    
    course = relationship("Course", back_populates="lessons")
    progress = relationship("Progress", back_populates="lesson", cascade="all, delete-orphan")
    chat_histories = relationship("ChatHistory", back_populates="lesson", cascade="all, delete-orphan")


class Enrollment(Base):
    __tablename__ = "enrollments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    enrolled_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_completed = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")


class Progress(Base):
    __tablename__ = "progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="progress")
    lesson = relationship("Lesson", back_populates="progress")


class Exam(Base):
    __tablename__ = "exams"
    
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String, default="Final Exam")
    duration_minutes = Column(Integer, default=30)
    
    course = relationship("Course", back_populates="exams")
    questions = relationship("Question", back_populates="exam", cascade="all, delete-orphan")
    results = relationship("Result", back_populates="exam", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    options = Column(JSON, nullable=False)  # list of strings
    correct_option_index = Column(Integer, nullable=False)  # 0-indexed correct answer
    code_snippet = Column(Text, nullable=True)  # optional code block to display with the question
    
    exam = relationship("Exam", back_populates="questions")


class Result(Base):
    __tablename__ = "results"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    exam_id = Column(Integer, ForeignKey("exams.id"), nullable=False)
    score = Column(Float, nullable=False)  # Percentage score e.g., 85.5
    passed = Column(Boolean, nullable=False)
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="results")
    exam = relationship("Exam", back_populates="results")


class Certificate(Base):
    __tablename__ = "certificates"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    uuid = Column(String, unique=True, default=lambda: str(uuid.uuid4()), index=True)
    certificate_id = Column(String, unique=True, index=True, nullable=True)  # e.g., EV-RA-2026-A7F4KD91
    verification_token = Column(String, unique=True, index=True, nullable=True)  # 64-char hex
    recipient_name = Column(String, nullable=False)
    student_email = Column(String, nullable=True)
    course_title = Column(String, nullable=True)
    issue_date = Column(DateTime, default=datetime.datetime.utcnow)
    completion_date = Column(DateTime, default=datetime.datetime.utcnow)
    hours_completed = Column(Integer, default=40)
    skills = Column(String, default="Replit Agent, LLMs, Vector Search, FastAPI")
    grade = Column(String, default="Distinction")
    status = Column(String, default="Verified")  # Verified, Revoked, Expired
    revocation_reason = Column(String, nullable=True)
    verification_qr_code_url = Column(String, nullable=True)
    certificate_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="certificates")
    course = relationship("Course", back_populates="certificates")


class ChatHistory(Base):
    __tablename__ = "chat_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=True)
    role = Column(String, nullable=False)  # 'user' or 'assistant'
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="chat_histories")
    lesson = relationship("Lesson", back_populates="chat_histories")

class InterviewSession(Base):
    __tablename__ = "interview_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String, nullable=False)
    messages = Column(JSON, default=list)
    status = Column(String, default="ongoing")
    feedback = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="interviews")


class LoungePost(Base):
    __tablename__ = "lounge_posts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    username = Column(String, nullable=False)
    avatar = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    likes = Column(Integer, default=0)
    liked_by = Column(JSON, default=list)
    
    user = relationship("User", back_populates="lounge_posts")

class StudyLog(Base):
    __tablename__ = "study_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    minutes = Column(Float, default=30.0)
    xp_gained = Column(Integer, default=50)
    subject = Column(String, default="Python")
    skill_tags = Column(JSON, default=list)  # ["Variables", "Loops"]
    date = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="study_logs")

class StudyTask(Base):
    __tablename__ = "study_tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    task_type = Column(String, default="study") # study, project, exam
    deadline = Column(DateTime, nullable=True)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="study_tasks")
