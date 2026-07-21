import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base

# Import routers
from routes import auth, courses, lessons, progress, chat, exams, certificates, leaderboard, challenges, profile, ai_review, interview, shop, quests, lounge

# Create all tables on startup if they don't exist yet
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EduVerse API",
    description="Backend services for EduVerse AI-Powered Education Platform",
    version="1.0.0",
    # FIX: Prevent Swagger UI from constructing /docs/api/* relative URLs.
    # Without this, visiting /docs causes Swagger to call /docs/api/... instead of /api/...
    root_path_in_servers=False,
    # Explicit server root so Swagger always resolves requests from "/" not "/docs"
    servers=[
        {"url": "/", "description": "EduVerse API"},
    ],
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configurations for Next.js frontend
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://eduverse.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(lessons.router)
app.include_router(progress.router)
app.include_router(chat.router)
app.include_router(exams.router)
app.include_router(certificates.router)
app.include_router(leaderboard.router)
app.include_router(challenges.router)
app.include_router(profile.router)
app.include_router(ai_review.router)
app.include_router(interview.router)
app.include_router(shop.router)
app.include_router(quests.router)
app.include_router(lounge.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "platform": "EduVerse",
        "message": "Welcome to EduVerse API services. Explore documentation at /docs"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
