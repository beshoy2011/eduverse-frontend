from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
import auth

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=schemas.Token, status_code=status.HTTP_201_CREATED)
def register(user_in: schemas.UserRegister, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )
        
    hashed_password = auth.get_password_hash(user_in.password)
    new_user = models.User(
        name=user_in.name,
        email=user_in.email,
        hashed_password=hashed_password
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create token for immediate login
    access_token = auth.create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": new_user}

@router.post("/login", response_model=schemas.Token)
def login(user_in: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if not user or not auth.verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@router.post("/google", response_model=schemas.Token)
def google_auth(request: schemas.GoogleAuthRequest, db: Session = Depends(get_db)):
    import urllib.request
    import json
    import secrets
    
    email = None
    name = None
    
    if request.is_simulation:
        if not request.email or not request.name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Simulation mode requires name and email"
            )
        email = request.email
        name = request.name
    else:
        # Real token validation (handles both access tokens and ID tokens)
        try:
            # Try to verify as Access Token using Google Userinfo API
            userinfo_url = f"https://www.googleapis.com/oauth2/v3/userinfo?access_token={request.token}"
            try:
                req = urllib.request.Request(userinfo_url)
                with urllib.request.urlopen(req) as response:
                    data = json.loads(response.read().decode())
                    email = data.get("email")
                    name = data.get("name", "Google User")
            except Exception:
                # If Userinfo fails, fallback to Tokeninfo API for ID token
                tokeninfo_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={request.token}"
                req = urllib.request.Request(tokeninfo_url)
                with urllib.request.urlopen(req) as response:
                    data = json.loads(response.read().decode())
                    if "error" in data or "error_description" in data:
                        raise ValueError(data.get("error_description", "Invalid Token"))
                    email = data.get("email")
                    name = data.get("name", "Google User")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Google authentication failed: {str(e)}"
            )
            
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not retrieve email from Google token"
        )
        
    # Check if user already exists
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        # Create new user with random hashed password
        random_pw = secrets.token_urlsafe(32)
        hashed_password = auth.get_password_hash(random_pw)
        user = models.User(
            name=name,
            email=email,
            hashed_password=hashed_password
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
    # Create token for immediate login
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@router.get("/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user
