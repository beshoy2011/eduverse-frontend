# EduVerse 🚀
> **A hands-on, gamified learning platform built for students who get bored of static video tutorials.**

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite)](https://sqlite.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

---

## 💡 Why I Built This

Whenever I tried to learn programming or computer science online, I always ran into the same roadblock: **tutorial hell**. Watching hours of videos without actually writing code or testing what I learned made me lose motivation fast. I wanted something that felt more like a game—where you learn a concept, complete a challenge, get immediate AI feedback, unlock achievements, and see your progress on a leaderboard.

EduVerse is my attempt at making online learning interactive, motivating, and fun. It combines structured lessons, real-time AI tutoring, mock technical interviews, and gamification elements (XP, streaks, shop rewards, and verifiable certificates) into a single platform.

---

## ✨ Features

- **🎓 Interactive Course Engine**: Structured lessons with embedded code snippets, interactive quizzes, and instant feedback.
- **🤖 Built-in AI Study Companion**: Ask questions when you get stuck without leaving your lesson. The AI tutor guides you step-by-step instead of just giving away code.
- **🎙️ AI Technical Mock Interviews**: Practice technical interview questions with real-time feedback on your answers and approach.
- **⚡ Daily Quests & Coding Challenges**: Earn XP, build up daily study streaks, and climb the global leaderboard.
- **🛒 EduVerse Shop**: Spend earned XP on custom avatar borders, badges, and profile customizations.
- **📜 Verifiable PDF Certificates**: Complete a course exam to automatically generate a custom PDF certificate complete with a scannable verification QR code.
- **📊 Analytics & Study Planner**: Track your active study hours, subject breakdown, and get an AI-generated study roadmap tailored to your target goals.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Framer Motion
- **Backend**: Python 3.11, FastAPI, SQLAlchemy, SQLite
- **Authentication**: JWT (JSON Web Tokens) with secure password hashing via `passlib`/`bcrypt`
- **PDF & Certificate Engine**: ReportLab & `qrcode` library for dynamic vector rendering

---

## 🧗 Challenges I Encountered & How I Solved Them

### 1. Synchronizing Auth State Between Next.js App Router and FastAPI
- **The Problem**: Next.js 15 client components lost authentication state during page refreshes, causing unauthorized redirects before FastAPI tokens could be validated from `localStorage`.
- **The Solution**: Implemented a dedicated `AuthContext` provider with persistent token verification headers on app mount. Added an interceptor that automatically attaches `Authorization: Bearer <token>` to outbound requests and handles `401 Unauthorized` responses gracefully without breaking active page state.

### 2. Precise Vector Positioning for PDF Certificate QR Codes
- **The Problem**: When generating PDF certificates dynamically with ReportLab, QR codes would frequently misalign or overlap with student names when long names wrapped onto two lines.
- **The Solution**: Calculated exact canvas bounding boxes for text before rendering the QR image overlay. Added dynamic coordinate calculations so the QR verification stamp stays anchored to the bottom-right corner regardless of name length.

### 3. Keeping AI Tutor Responses Responsive & Context-Aware
- **The Problem**: Passing full lesson histories to the AI endpoint produced high latency and occasionally exceeded prompt budget limits during long study sessions.
- **The Solution**: Created a sliding window context buffer in FastAPI that sends only the current lesson summary, recent prompt thread (last 6 messages), and student's current code attempt. This dropped response latency under 1.2s while preserving context.

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+ and `npm`
- Python 3.10+

### 1. Clone & Set Up Backend

```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python seed.py  # Seed initial courses, quizzes, and sample data
python main.py
```
*Backend server will start at `http://localhost:8000` (API Docs available at `/docs`).*

### 2. Set Up Frontend

```bash
cd frontend
npm install
npm run dev
```
*Frontend will run at `http://localhost:3000`.*

---

## 🛣️ What's Next?
- [ ] Add real-time peer-to-peer study rooms using WebRTC.
- [ ] Support custom user-created courses and community quiz sharing.
- [ ] Integrate GitHub API to import real student repositories into project reviews.

---

*Crafted with ❤️, coffee, and late-night coding sessions for Hack Club.*
