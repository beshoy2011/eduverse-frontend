from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified
import models
import schemas
import auth
from database import get_db

router = APIRouter(prefix="/api/quests", tags=["quests"])

QUEST_CATALOGUE = [
    {
        "id": "quest_first_lesson",
        "title_en": "First Steps",
        "title_ar": "الخطوات الأولى",
        "description_en": "Complete your first lesson in any course.",
        "description_ar": "أكمل أول درس لك في أي كورس.",
        "type": "daily",
        "xp_reward": 100,
        "target": 1
    },
    {
        "id": "quest_chat",
        "title_en": "Inquisitive Mind",
        "title_ar": "عقل فضولي",
        "description_en": "Send 5 queries to your 24/7 personal AI Tutor.",
        "description_ar": "أرسل 5 استفسارات لمدرب الذكاء الاصطناعي الخاص بك.",
        "type": "daily",
        "xp_reward": 150,
        "target": 5
    },
    {
        "id": "quest_interview",
        "title_en": "Corporate Ready",
        "title_ar": "جاهز للشركات",
        "description_en": "Complete a full 5-question AI Technical Mock Interview.",
        "description_ar": "أكمل مقابلة عمل تقنية كاملة من 5 أسئلة بالذكاء الاصطناعي.",
        "type": "weekly",
        "xp_reward": 250,
        "target": 1
    },
    {
        "id": "quest_certs",
        "title_en": "Certification Hoarder",
        "title_ar": "جامع الشهادات",
        "description_en": "Earn 2 verified course completion certificates.",
        "description_ar": "احصل على شهادتي إتمام كورسات موثقتين.",
        "type": "global",
        "xp_reward": 400,
        "target": 2
    },
    {
        "id": "quest_level_5",
        "title_en": "Scholar Milestone",
        "title_ar": "إنجاز الباحث",
        "description_en": "Reach Level 5 to prove your study progression.",
        "description_ar": "وصل للمستوى 5 لتثبت تقدمك الدراسي.",
        "type": "global",
        "xp_reward": 300,
        "target": 5
    }
]

def get_quest_progress(quest_id: str, user_id: int, user_level: int, db: Session) -> int:
    if quest_id == "quest_first_lesson":
        return db.query(models.Progress).filter(models.Progress.user_id == user_id).count()
    elif quest_id == "quest_chat":
        return db.query(models.ChatHistory).filter(
            models.ChatHistory.user_id == user_id,
            models.ChatHistory.role == "user"
        ).count()
    elif quest_id == "quest_interview":
        return db.query(models.InterviewSession).filter(
            models.InterviewSession.user_id == user_id,
            models.InterviewSession.status == "completed"
        ).count()
    elif quest_id == "quest_certs":
        return db.query(models.Certificate).filter(models.Certificate.user_id == user_id).count()
    elif quest_id == "quest_level_5":
        return user_level
    return 0

@router.get("", response_model=list[schemas.ChallengeOut])
def list_quests(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    results = []
    achieved = list(current_user.achievements) if current_user.achievements else []
    
    for q in QUEST_CATALOGUE:
        prog = get_quest_progress(q["id"], current_user.id, current_user.level, db)
        is_completed = prog >= q["target"]
        is_claimed = q["id"] in achieved
        
        results.append(schemas.ChallengeOut(
            id=q["id"],
            title_en=q["title_en"],
            title_ar=q["title_ar"],
            description_en=q["description_en"],
            description_ar=q["description_ar"],
            type=q["type"],
            xp_reward=q["xp_reward"],
            target=q["target"],
            progress=min(prog, q["target"]), # cap progress representation
            is_completed=is_completed,
            is_claimed=is_claimed
        ))
    return results

@router.post("/claim/{quest_id}", response_model=schemas.UserOut)
def claim_quest_reward(
    quest_id: str,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    q = next((item for item in QUEST_CATALOGUE if item["id"] == quest_id), None)
    if not q:
        raise HTTPException(status_code=404, detail="Quest not found in catalogue")
        
    achieved = list(current_user.achievements) if current_user.achievements else []
    if q["id"] in achieved:
        raise HTTPException(status_code=400, detail="Quest reward has already been claimed")
        
    prog = get_quest_progress(q["id"], current_user.id, current_user.level, db)
    if prog < q["target"]:
        raise HTTPException(status_code=400, detail="Quest requirements have not been fully met yet")
        
    try:
        # Add reward XP
        current_user.xp += q["xp_reward"]
        
        # Add to achievements array to mark claimed
        achieved.append(q["id"])
        current_user.achievements = achieved
        flag_modified(current_user, "achievements")
        
        # Level up logic
        new_level = (current_user.xp // 1000) + 1
        if new_level > current_user.level:
            current_user.level = new_level
            # Update titles
            if current_user.level >= 40:
                current_user.rank = "EduVerse Champion"
            elif current_user.level >= 25:
                current_user.rank = "Grand Master"
            elif current_user.level >= 10:
                current_user.rank = "Master"
            elif current_user.level >= 5:
                current_user.rank = "Scholar"
                
        db.commit()
        db.refresh(current_user)
        return current_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to claim quest reward: {e}")
