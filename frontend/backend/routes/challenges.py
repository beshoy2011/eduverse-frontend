from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, time, timedelta
from database import get_db
import models
import schemas
import auth

router = APIRouter(prefix="/api/challenges", tags=["challenges"])

def get_challenges_list(user: models.User, db: Session) -> List[dict]:
    user_claims = user.achievements or []
    
    # Calculate start times for today and this week
    today_start = datetime.combine(datetime.utcnow().date(), time.min)
    week_start = datetime.utcnow() - timedelta(days=7)
    
    # 1. Real completed lessons count today
    lessons_completed_today = db.query(models.Progress).filter(
        models.Progress.user_id == user.id,
        models.Progress.completed_at >= today_start
    ).count()
    
    # 2. Real messages sent to AI tutor today
    chat_messages_today = db.query(models.ChatHistory).filter(
        models.ChatHistory.user_id == user.id,
        models.ChatHistory.role == "user",
        models.ChatHistory.created_at >= today_start
    ).count()
    
    # 3. Real study time today (simulated realistically: 15 mins per completed lesson + 5 mins per chat message)
    study_minutes_today = (lessons_completed_today * 15) + (chat_messages_today * 5)
    study_minutes_today = min(study_minutes_today, 30)
    
    # 4. Real lessons completed in last 7 days
    lessons_completed_this_week = db.query(models.Progress).filter(
        models.Progress.user_id == user.id,
        models.Progress.completed_at >= week_start
    ).count()
    
    # 5. Real exams completed in last 7 days
    exams_passed_this_week = db.query(models.Result).filter(
        models.Result.user_id == user.id,
        models.Result.passed == True,
        models.Result.completed_at >= week_start
    ).count()
    
    # 6. Real XP earned this week: 50 XP per lesson + 250 XP per exam passed
    xp_earned_this_week = (lessons_completed_this_week * 50) + (exams_passed_this_week * 250)
    
    # 7. Real Python course lessons completed in total
    python_lessons_count = db.query(models.Progress).join(models.Lesson).join(models.Course).filter(
        models.Progress.user_id == user.id,
        models.Course.title.like("%Python%")
    ).count()
    
    # 8. Real AI course lessons completed in total
    ai_lessons_count = db.query(models.Progress).join(models.Lesson).join(models.Course).filter(
        models.Progress.user_id == user.id,
        models.Course.title.like("%AI%")
    ).count()
    
    challenges = [
        # --- DAILY ---
        {
            "id": "daily_1",
            "title_en": "Complete a Lesson",
            "title_ar": "أكمل درساً واحداً",
            "description_en": "Study and complete any lesson from your syllabus today",
            "description_ar": "اقرأ وأكمل أي درس عملي من المنهج الخاص بك اليوم",
            "type": "daily",
            "xp_reward": 100,
            "target": 1,
            "progress": lessons_completed_today,
            "is_claimed": "challenge_daily_1" in user_claims,
            "is_completed": lessons_completed_today >= 1
        },
        {
            "id": "daily_2",
            "title_en": "Ask AI Tutor 3 times",
            "title_ar": "اسأل المعلم الذكي 3 مرات",
            "description_en": "Leverage AI hints during your coding challenges today",
            "description_ar": "استعن بتلميحات المعلم الذكي لحل تمارين البرمجة اليوم",
            "type": "daily",
            "xp_reward": 150,
            "target": 3,
            "progress": chat_messages_today,
            "is_claimed": "challenge_daily_2" in user_claims,
            "is_completed": chat_messages_today >= 3
        },
        {
            "id": "daily_3",
            "title_en": "Study for 30 minutes",
            "title_ar": "ذاكر لمدة 30 دقيقة",
            "description_en": "Keep a steady active session learning coding concepts today",
            "description_ar": "حافظ على جلسة نشطة مستمرة في استكشاف لغات البرمجة اليوم",
            "type": "daily",
            "xp_reward": 100,
            "target": 30,
            "progress": study_minutes_today,
            "is_claimed": "challenge_daily_3" in user_claims,
            "is_completed": study_minutes_today >= 30
        },
        
        # --- WEEKLY ---
        {
            "id": "weekly_1",
            "title_en": "Complete 3 Lessons This Week",
            "title_ar": "أكمل 3 دروس هذا الأسبوع",
            "description_en": "Stay consistent by completing at least 3 lessons in the last 7 days",
            "description_ar": "حافظ على استمراريتك بإكمال 3 دروس على الأقل خلال آخر 7 أيام",
            "type": "weekly",
            "xp_reward": 300,
            "target": 3,
            "progress": lessons_completed_this_week,
            "is_claimed": "challenge_weekly_1" in user_claims,
            "is_completed": lessons_completed_this_week >= 3
        },
        {
            "id": "weekly_2",
            "title_en": "Earn 500 XP This Week",
            "title_ar": "اكتسب 500 نقطة خبرة هذا الأسبوع",
            "description_en": "Gain XP by solving daily tasks and answering quizzes in the last 7 days",
            "description_ar": "احصل على نقاط الخبرة بمختلف أنشطة الكود والاختبارات خلال آخر 7 أيام",
            "type": "weekly",
            "xp_reward": 400,
            "target": 500,
            "progress": min(xp_earned_this_week, 500),
            "is_claimed": "challenge_weekly_2" in user_claims,
            "is_completed": xp_earned_this_week >= 500
        },
        
        # --- GLOBAL ---
        {
            "id": "global_1",
            "title_en": "Python Coding Marathon",
            "title_ar": "ماراثون بايثون البرمجي",
            "description_en": "Complete at least 5 lessons in any Python syllabus nodes",
            "description_ar": "أكمل 5 دروس على الأقل بمناهج بايثون المختلفة",
            "type": "global",
            "xp_reward": 500,
            "target": 5,
            "progress": min(python_lessons_count, 5),
            "is_claimed": "challenge_global_1" in user_claims,
            "is_completed": python_lessons_count >= 5
        },
        {
            "id": "global_2",
            "title_en": "AI Specialist Bootcamp",
            "title_ar": "معسكر الذكاء الاصطناعي الشامل",
            "description_en": "Complete at least 8 lessons in AI Laboratory nodes",
            "description_ar": "أكمل 8 دروس على الأقل بمناهج الذكاء الاصطناعي وبنيات التعلم الآلي",
            "type": "global",
            "xp_reward": 800,
            "target": 8,
            "progress": min(ai_lessons_count, 8),
            "is_claimed": "challenge_global_2" in user_claims,
            "is_completed": ai_lessons_count >= 8
        }
    ]
    return challenges

@router.get("", response_model=List[schemas.ChallengeOut])
def get_challenges(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    return get_challenges_list(current_user, db)

@router.post("/claim/{challenge_id}")
def claim_challenge(
    challenge_id: str,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    challenges = get_challenges_list(current_user, db)
    target_challenge = next((c for c in challenges if c["id"] == challenge_id), None)
    
    if not target_challenge:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Challenge not found")
        
    if not target_challenge["is_completed"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Challenge is not completed yet")
        
    if target_challenge["is_claimed"]:
        return {"status": "already_claimed", "claimed_xp": 0}
        
    # Mark as claimed persistently in achievements field
    ach = list(current_user.achievements or [])
    claim_tag = f"challenge_{challenge_id}"
    if claim_tag not in ach:
        ach.append(claim_tag)
        current_user.achievements = ach
        
    # Award reward XP
    reward_xp = target_challenge["xp_reward"]
    current_user.xp += reward_xp
    
    # Update user level & rank dynamically
    new_level = (current_user.xp // 1000) + 1
    if new_level != current_user.level:
        current_user.level = new_level
        
    # Update rank title
    if current_user.xp < 500:
        current_user.rank = "Beginner"
    elif current_user.xp < 1000:
        current_user.rank = "Explorer"
    elif current_user.xp < 2000:
        current_user.rank = "Coder"
    elif current_user.xp < 4000:
        current_user.rank = "Developer"
    elif current_user.xp < 7000:
        current_user.rank = "Senior Developer"
    elif current_user.xp < 10000:
        current_user.rank = "Architect"
    elif current_user.xp < 15000:
        current_user.rank = "Innovator"
    elif current_user.xp < 20000:
        current_user.rank = "Master"
    elif current_user.xp < 30000:
        current_user.rank = "Legend"
    elif current_user.xp < 50000:
        current_user.rank = "Grand Master"
    else:
        current_user.rank = "EduVerse Champion"
        
    db.commit()
    return {"status": "claimed", "claimed_xp": reward_xp, "new_xp": current_user.xp, "new_level": current_user.level}
