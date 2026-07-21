from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified
import json
from database import get_db
import models
import schemas
import auth
import ai_tutor

router = APIRouter(prefix="/api/interview", tags=["interview"])

@router.post("/start", response_model=schemas.InterviewSessionOut)
def start_interview(
    req: schemas.InterviewStartRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Generate the first recruiter question
        first_q = ai_tutor.generate_interview_start(req.role)
        
        session = models.InterviewSession(
            user_id=current_user.id,
            role=req.role,
            messages=[{"role": "interviewer", "content": first_q}],
            status="ongoing"
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        return session
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to start interview: {e}")

@router.post("/respond", response_model=schemas.InterviewSessionOut)
def respond_interview(
    req: schemas.InterviewRespondRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(models.InterviewSession).filter(
        models.InterviewSession.id == req.session_id,
        models.InterviewSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found")
        
    if session.status == "completed":
        raise HTTPException(status_code=400, detail="Interview session is already completed")
        
    try:
        # Append candidate response
        msgs = list(session.messages) if session.messages else []
        msgs.append({"role": "candidate", "content": req.response})
        
        # Get next interviewer response or final evaluation
        reply, finished = ai_tutor.generate_interview_next(session.role, msgs, req.response)
        
        if finished:
            session.status = "completed"
            session.feedback = json.loads(reply)
            
            # Award +300 XP for completing a mock interview!
            current_user.xp += 300
            # Level up calculation
            new_level = (current_user.xp // 1000) + 1
            if new_level > current_user.level:
                current_user.level = new_level
                if current_user.level >= 40:
                    current_user.rank = "EduVerse Champion"
                elif current_user.level >= 25:
                    current_user.rank = "Grand Master"
                elif current_user.level >= 10:
                    current_user.rank = "Master"
                elif current_user.level >= 5:
                    current_user.rank = "Scholar"
                    
            # Check for "Interview Starter" achievement
            if "interview_beginner" not in current_user.achievements:
                ach = list(current_user.achievements)
                ach.append("interview_beginner")
                current_user.achievements = ach
                flag_modified(current_user, "achievements")
        else:
            msgs.append({"role": "interviewer", "content": reply})
            
        session.messages = msgs
        flag_modified(session, "messages")
        
        db.commit()
        db.refresh(session)
        return session
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to process response: {e}")

@router.get("/history", response_model=list[schemas.InterviewSessionOut])
def get_interview_history(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    sessions = db.query(models.InterviewSession).filter(
        models.InterviewSession.user_id == current_user.id
    ).order_by(models.InterviewSession.created_at.desc()).all()
    return sessions
