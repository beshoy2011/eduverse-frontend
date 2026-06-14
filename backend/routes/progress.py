from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
import auth

router = APIRouter(prefix="/api/progress", tags=["progress"])

@router.get("/{course_id}", response_model=schemas.ProgressStatus)
def get_course_progress(
    course_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Verify course exists
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
        
    # Get all lessons for this course
    lessons = db.query(models.Lesson).filter(models.Lesson.course_id == course_id).all()
    total_lessons = len(lessons)
    
    if total_lessons == 0:
        return {"completed_lesson_ids": [], "percent_complete": 0.0}
        
    lesson_ids = [l.id for l in lessons]
    
    # Get completed progress records for these lessons
    completed_records = db.query(models.Progress).filter(
        models.Progress.user_id == current_user.id,
        models.Progress.lesson_id.in_(lesson_ids)
    ).all()
    
    completed_ids = [p.lesson_id for p in completed_records]
    percent_complete = round((len(completed_ids) / total_lessons) * 100, 1)
    
    return {
        "completed_lesson_ids": completed_ids,
        "percent_complete": percent_complete
    }

def update_user_level_and_rank(user: models.User):
    new_level = (user.xp // 1000) + 1
    if new_level != user.level:
        user.level = new_level
        
    if user.xp < 500:
        user.rank = "Beginner"
    elif user.xp < 1000:
        user.rank = "Explorer"
    elif user.xp < 2000:
        user.rank = "Coder"
    elif user.xp < 4000:
        user.rank = "Developer"
    elif user.xp < 7000:
        user.rank = "Senior Developer"
    elif user.xp < 10000:
        user.rank = "Architect"
    elif user.xp < 15000:
        user.rank = "Innovator"
    elif user.xp < 20000:
        user.rank = "Master"
    elif user.xp < 30000:
        user.rank = "Legend"
    elif user.xp < 50000:
        user.rank = "Grand Master"
    else:
        user.rank = "EduVerse Champion"

@router.post("/{lesson_id}/complete", response_model=schemas.ProgressOut)
def mark_lesson_complete(
    lesson_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")
        
    # Check if already completed
    existing_progress = db.query(models.Progress).filter(
        models.Progress.user_id == current_user.id,
        models.Progress.lesson_id == lesson_id
    ).first()
    
    if existing_progress:
        return existing_progress
        
    new_progress = models.Progress(
        user_id=current_user.id,
        lesson_id=lesson_id
    )
    db.add(new_progress)
    
    # Award +50 XP for lesson completion
    current_user.xp += 50
    
    # Check "First Steps" achievement
    ach_list = list(current_user.achievements or [])
    if "first_steps" not in ach_list:
        ach_list.append("first_steps")
        current_user.achievements = ach_list
        
    update_user_level_and_rank(current_user)
    
    db.commit()
    db.refresh(new_progress)
    return new_progress
