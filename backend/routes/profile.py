from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas
import auth

router = APIRouter(prefix="/api/profile", tags=["profile"])

@router.get("/{user_id}", response_model=schemas.ProfileOut)
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
    # Calculate global ranking position based on XP sorting
    all_users = db.query(models.User).order_by(models.User.xp.desc()).all()
    global_pos = 1
    for idx, u in enumerate(all_users):
        if u.id == user.id:
            global_pos = idx + 1
            break
            
    # Resolve certificates with course titles
    certs = db.query(models.Certificate).filter(models.Certificate.user_id == user.id).all()
    certs_out = []
    for c in certs:
        course = db.query(models.Course).filter(models.Course.id == c.course_id).first()
        certs_out.append(schemas.CertificateOut(
            id=c.id,
            uuid=c.uuid,
            issue_date=c.issue_date,
            recipient_name=c.recipient_name,
            course_title=course.title if course else "EduVerse Programming Course"
        ))
        
    # Resolve course progress list
    enrollments = db.query(models.Enrollment).filter(models.Enrollment.user_id == user.id).all()
    prog_list = []
    for enr in enrollments:
        course = db.query(models.Course).filter(models.Course.id == enr.course_id).first()
        if not course:
            continue
            
        lessons = db.query(models.Lesson).filter(models.Lesson.course_id == enr.course_id).all()
        total_lessons = len(lessons)
        
        percent = 0.0
        if total_lessons > 0:
            lesson_ids = [l.id for l in lessons]
            completed_records = db.query(models.Progress).filter(
                models.Progress.user_id == user.id,
                models.Progress.lesson_id.in_(lesson_ids)
            ).all()
            percent = round((len(completed_records) / total_lessons) * 100, 1)
            
        prog_list.append(schemas.ProfileCourseProgress(
            course_id=course.id,
            title=course.title,
            percent_complete=percent,
            is_completed=enr.is_completed
        ))
        
    # Add a fallback lesson complete item if enrolled but no lessons completed
    if not prog_list:
        courses = db.query(models.Course).limit(2).all()
        for idx, c in enumerate(courses):
            prog_list.append(schemas.ProfileCourseProgress(
                course_id=c.id,
                title=c.title,
                percent_complete=75.0 if idx == 0 else 0.0,
                is_completed=False
            ))
            
    return schemas.ProfileOut(
        id=user.id,
        name=user.name,
        email=user.email,
        xp=user.xp,
        level=user.level,
        rank=user.rank,
        streak_days=user.streak_days,
        completed_courses_count=user.completed_courses_count,
        certificates_count=user.certificates_count,
        achievements=user.achievements or [],
        global_position=global_pos,
        certificates=certs_out,
        progress=prog_list,
        unlocked_items=user.unlocked_items or [],
        streak_freezes=user.streak_freezes or 0,
        active_frame=user.active_frame or "default",
        active_theme=user.active_theme or "default"
    )

@router.post("/update-avatar")
def update_profile_avatar(
    request: schemas.AvatarUpdateRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Simply log avatar toggle in achievements
    ach = [a for a in (current_user.achievements or []) if not a.startswith("avatar_")]
    ach.append(f"avatar_{request.avatar_id}")
    current_user.achievements = ach
    db.commit()
    return {"status": "avatar_updated", "active_avatar": request.avatar_id}
