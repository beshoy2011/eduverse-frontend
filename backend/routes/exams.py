import os
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
import models
import schemas
import auth
from certificate_generator import generate_pdf_certificate
from email_sender import send_certificate_email

router = APIRouter(prefix="/api/exams", tags=["exams"])

@router.get("/{course_id}", response_model=schemas.ExamOut)
def get_exam(
    course_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Verify enrollment
    enrollment = db.query(models.Enrollment).filter(
        models.Enrollment.user_id == current_user.id,
        models.Enrollment.course_id == course_id
    ).first()
    
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be enrolled in the course to take the exam"
        )
        
    exam = db.query(models.Exam).filter(models.Exam.course_id == course_id).first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam for this course not found"
        )
        
    return exam

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


@router.post("/{course_id}/submit", response_model=schemas.ExamResultOut)
def submit_exam(
    course_id: int,
    submission: schemas.ExamSubmission,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Verify enrollment
    enrollment = db.query(models.Enrollment).filter(
        models.Enrollment.user_id == current_user.id,
        models.Enrollment.course_id == course_id
    ).first()
    
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be enrolled in this course to submit the exam"
        )
        
    exam = db.query(models.Exam).filter(models.Exam.course_id == course_id).first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
        
    # Get all questions
    questions = db.query(models.Question).filter(models.Question.exam_id == exam.id).all()
    if not questions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No questions found in this exam"
        )
        
    total_questions = len(questions)
    correct_count = 0
    
    # Map questions for fast lookup
    question_map = {q.id: q for q in questions}
    
    # Grade submission
    for ans in submission.answers:
        q = question_map.get(ans.question_id)
        if q and q.correct_option_index == ans.selected_option_index:
            correct_count += 1
            
    score = (correct_count / total_questions) * 100
    passed = score >= 70.0
    
    # Record result
    result = models.Result(
        user_id=current_user.id,
        exam_id=exam.id,
        score=score,
        passed=passed
    )
    db.add(result)
    
    # Process completion if passed
    if passed:
        # Mark enrollment completed
        enrollment.is_completed = True
        
        # Check if they already have a certificate for this course
        existing_cert = db.query(models.Certificate).filter(
            models.Certificate.user_id == current_user.id,
            models.Certificate.course_id == course_id
        ).first()
        
        if not existing_cert:
            # Create a certificate
            new_cert = models.Certificate(
                user_id=current_user.id,
                course_id=course_id,
                recipient_name=current_user.name
            )
            db.add(new_cert)
            db.commit()
            db.refresh(new_cert)
            
            # Award +250 XP for course completion
            current_user.xp += 250
            current_user.completed_courses_count += 1
            current_user.certificates_count += 1
            
            # Evaluate Achievements
            ach = list(current_user.achievements or [])
            if score >= 100.0 and "perfect_score" not in ach:
                ach.append("perfect_score")
            if current_user.certificates_count >= 1 and "first_cert" not in ach:
                ach.append("first_cert")
            if current_user.certificates_count >= 10 and "ten_certs" not in ach:
                ach.append("ten_certs")
            if current_user.completed_courses_count >= 3 and "polyglot_coder" not in ach:
                ach.append("polyglot_coder")
                
            # Fetch course title
            course = db.query(models.Course).filter(models.Course.id == course_id).first()
            course_title = course.title if course else "EduVerse Programming Course"
            
            course_title_lower = course_title.lower()
            if "python" in course_title_lower and "python_master" not in ach:
                ach.append("python_master")
            if "c++" in course_title_lower and "cpp_master" not in ach:
                ach.append("cpp_master")
            if ("web" in course_title_lower or "html" in course_title_lower) and "web_master" not in ach:
                ach.append("web_master")
            if ("ai" in course_title_lower or "learning" in course_title_lower or "science" in course_title_lower) and "ai_specialist" not in ach:
                ach.append("ai_specialist")
                
            current_user.achievements = ach
            update_user_level_and_rank(current_user)
            
            # Create directories for certificates if they don't exist
            cert_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static", "certificates")
            os.makedirs(cert_dir, exist_ok=True)
            
            pdf_path = os.path.join(cert_dir, f"{new_cert.uuid}.pdf")
            
            # Generate the PDF file
            date_str = datetime.utcnow().strftime("%Y-%m-%d")
            generate_pdf_certificate(
                filename=pdf_path,
                student_name=current_user.name,
                course_name=course_title,
                cert_uuid=new_cert.uuid,
                issue_date=date_str
            )
            
            # Send certificate via Email
            send_certificate_email(
                recipient_email=current_user.email,
                recipient_name=current_user.name,
                course_name=course_title,
                pdf_path=pdf_path
            )
            
    db.commit()
    
    return {
        "score": score,
        "passed": passed,
        "correct_answers_count": correct_count,
        "total_questions": total_questions
    }
