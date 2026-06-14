from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
import auth
import ai_tutor

router = APIRouter(prefix="/api/chat", tags=["chat"])

@router.post("", response_model=schemas.ChatResponse)
def chat_with_tutor(
    chat_req: schemas.ChatRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    lesson_title = None
    lesson_content = None
    
    # 1. Fetch lesson context if lesson_id is provided
    if chat_req.lesson_id:
        lesson = db.query(models.Lesson).filter(models.Lesson.id == chat_req.lesson_id).first()
        if lesson:
            lesson_title = lesson.title
            lesson_content = lesson.content
            
    # 2. Gather conversation history
    # If history is provided in request, use it. Otherwise, load from DB.
    recent_history = []
    if chat_req.history:
        recent_history = chat_req.history
    else:
        # Load last 10 messages from DB for context
        db_history = db.query(models.ChatHistory).filter(
            models.ChatHistory.user_id == current_user.id,
            models.ChatHistory.lesson_id == chat_req.lesson_id
        ).order_by(models.ChatHistory.created_at.asc()).suffix_with("LIMIT 10").all()
        
        for msg in db_history:
            recent_history.append(schemas.ChatMessage(role=msg.role, content=msg.message))
            
    # 3. Call AI Tutor service
    reply = ai_tutor.generate_tutor_response(
        message=chat_req.message,
        lesson_title=lesson_title,
        lesson_content=lesson_content,
        history=recent_history
    )
    
    # 4. Save messages to DB
    user_msg_record = models.ChatHistory(
        user_id=current_user.id,
        lesson_id=chat_req.lesson_id,
        role="user",
        message=chat_req.message
    )
    assistant_msg_record = models.ChatHistory(
        user_id=current_user.id,
        lesson_id=chat_req.lesson_id,
        role="assistant",
        message=reply
    )
    
    db.add(user_msg_record)
    db.add(assistant_msg_record)
    db.commit()
    
    return {"reply": reply}

@router.get("/history/{lesson_id}", response_model=list[schemas.ChatMessage])
def get_chat_history(
    lesson_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    db_history = db.query(models.ChatHistory).filter(
        models.ChatHistory.user_id == current_user.id,
        models.ChatHistory.lesson_id == lesson_id
    ).order_by(models.ChatHistory.created_at.asc()).all()
    
    return [schemas.ChatMessage(role=h.role, content=h.message) for h in db_history]
