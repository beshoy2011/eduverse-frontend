from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
import auth
from database import get_db
from datetime import datetime

router = APIRouter(prefix="/api/planner", tags=["planner"])

@router.get("/tasks", response_model=List[schemas.StudyTaskOut])
def get_study_tasks(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    tasks = db.query(models.StudyTask).filter(models.StudyTask.user_id == current_user.id).order_by(models.StudyTask.deadline.asc().nulls_last()).all()
    return tasks

@router.post("/tasks", response_model=schemas.StudyTaskOut)
def create_study_task(
    task_in: schemas.StudyTaskCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    new_task = models.StudyTask(
        user_id=current_user.id,
        title=task_in.title,
        description=task_in.description,
        task_type=task_in.task_type,
        deadline=task_in.deadline,
        created_at=datetime.utcnow()
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.put("/tasks/{task_id}", response_model=schemas.StudyTaskOut)
def update_study_task(
    task_id: int,
    task_in: schemas.StudyTaskUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(models.StudyTask).filter(
        models.StudyTask.id == task_id,
        models.StudyTask.user_id == current_user.id
    ).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    update_data = task_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)
        
    db.commit()
    db.refresh(task)
    return task

@router.delete("/tasks/{task_id}")
def delete_study_task(
    task_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(models.StudyTask).filter(
        models.StudyTask.id == task_id,
        models.StudyTask.user_id == current_user.id
    ).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}
