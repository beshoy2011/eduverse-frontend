from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified
import models
import schemas
import auth
from database import get_db

router = APIRouter(prefix="/api/lounge", tags=["lounge"])

@router.get("/posts", response_model=list[schemas.LoungePostOut])
def get_lounge_posts(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    posts = db.query(models.LoungePost).order_by(models.LoungePost.created_at.desc()).all()
    
    result = []
    for post in posts:
        liked_list = list(post.liked_by) if post.liked_by else []
        is_liked = current_user.id in liked_list
        
        result.append(schemas.LoungePostOut(
            id=post.id,
            user_id=post.user_id,
            username=post.username,
            avatar=post.avatar if post.avatar else "programmer",
            message=post.message,
            created_at=post.created_at,
            likes=post.likes,
            is_liked=is_liked
        ))
    return result

@router.post("/post", response_model=schemas.LoungePostOut)
def create_lounge_post(
    req: schemas.LoungePostCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Post message cannot be empty")
        
    try:
        # Determine avatar string matching active_frame/avatar
        avatar_val = current_user.active_frame
        if avatar_val == "default" or not avatar_val:
            avatar_val = "programmer" # default
            
        post = models.LoungePost(
            user_id=current_user.id,
            username=current_user.name,
            avatar=avatar_val,
            message=req.message,
            likes=0,
            liked_by=[]
        )
        db.add(post)
        
        # Award +25 XP for participating in peer discussions!
        current_user.xp += 25
        # Level up checks
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
                
        db.commit()
        db.refresh(post)
        
        return schemas.LoungePostOut(
            id=post.id,
            user_id=post.user_id,
            username=post.username,
            avatar=post.avatar,
            message=post.message,
            created_at=post.created_at,
            likes=post.likes,
            is_liked=False
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to submit post: {e}")

@router.post("/like/{post_id}", response_model=schemas.LoungePostOut)
def like_lounge_post(
    post_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    post = db.query(models.LoungePost).filter(models.LoungePost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Lounge post not found")
        
    try:
        liked_list = list(post.liked_by) if post.liked_by else []
        
        if current_user.id in liked_list:
            # Unlike
            liked_list.remove(current_user.id)
            post.likes = max(0, post.likes - 1)
            is_liked = False
        else:
            # Like
            liked_list.append(current_user.id)
            post.likes += 1
            is_liked = True
            
        post.liked_by = liked_list
        flag_modified(post, "liked_by")
        
        db.commit()
        db.refresh(post)
        
        return schemas.LoungePostOut(
            id=post.id,
            user_id=post.user_id,
            username=post.username,
            avatar=post.avatar,
            message=post.message,
            created_at=post.created_at,
            likes=post.likes,
            is_liked=is_liked
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to like post: {e}")
