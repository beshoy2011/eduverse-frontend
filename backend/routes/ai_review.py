from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
import auth
import ai_tutor

router = APIRouter(prefix="/api/ai-review", tags=["ai-review"])

@router.post("", response_model=schemas.CodeReviewResponse)
def get_code_review(
    req: schemas.CodeReviewRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    try:
        review = ai_tutor.generate_code_review(
            code=req.code,
            lesson_title=req.lesson_title,
            lesson_content=req.lesson_content
        )
        return review
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code review generation failed: {e}")
