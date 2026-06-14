from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models
import schemas
import auth

router = APIRouter(prefix="/api/courses", tags=["courses"])

@router.get("", response_model=List[schemas.CourseOut])
def get_courses(db: Session = Depends(get_db)):
    courses = db.query(models.Course).all()
    return courses

@router.get("/enrolled", response_model=List[schemas.CourseOut])
def get_enrolled_courses(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch all courses the user has enrolled in
    enrolled_ids = db.query(models.Enrollment.course_id).filter(models.Enrollment.user_id == current_user.id).all()
    enrolled_ids = [r[0] for r in enrolled_ids]
    
    courses = db.query(models.Course).filter(models.Course.id.in_(enrolled_ids)).all() if enrolled_ids else []
    return courses

@router.get("/{course_id}", response_model=schemas.CourseDetailOut)
def get_course_detail(course_id: int, db: Session = Depends(get_db)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    return course

@router.post("/{course_id}/enroll", response_model=schemas.EnrollmentOut)
def enroll_course(
    course_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Verify course exists
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
        
    # Check if already enrolled
    existing_enrollment = db.query(models.Enrollment).filter(
        models.Enrollment.user_id == current_user.id,
        models.Enrollment.course_id == course_id
    ).first()
    
    if existing_enrollment:
        return existing_enrollment
        
    new_enrollment = models.Enrollment(
        user_id=current_user.id,
        course_id=course_id
    )
    db.add(new_enrollment)
    db.commit()
    db.refresh(new_enrollment)
    return new_enrollment
