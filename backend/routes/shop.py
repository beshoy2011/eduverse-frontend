from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified
import models
import schemas
import auth

router = APIRouter(prefix="/api/shop", tags=["shop"])

SHOP_ITEMS = [
    {
        "id": "item_streak_freeze",
        "name": "Streak Freeze",
        "cost": 200,
        "category": "consumable",
        "description": "Saves your daily coding streak if you miss a day.",
        "style_class": "bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-400 text-white"
    },
    {
        "id": "frame_neon",
        "name": "Cyberpunk Neon Frame",
        "cost": 500,
        "category": "frame",
        "description": "A glowing cyan-magenta neon border around your profile avatar.",
        "style_class": "border-2 border-pink-500 shadow-[0_0_10px_#ec4899] text-pink-400"
    },
    {
        "id": "frame_rainbow",
        "name": "Chroma Rainbow Frame",
        "cost": 800,
        "category": "frame",
        "description": "A dynamic shifting rainbow gradient frame for elite coders.",
        "style_class": "border-2 border-transparent bg-gradient-to-r from-red-500 via-green-500 to-blue-500 bg-clip-border text-yellow-400"
    },
    {
        "id": "frame_gold",
        "name": "Royal Gold Frame",
        "cost": 1200,
        "category": "frame",
        "description": "A sparkling premium gold metallic frame.",
        "style_class": "border-2 border-yellow-500 shadow-[0_0_15px_#f59e0b] text-yellow-500"
    },
    {
        "id": "theme_cyberpunk",
        "name": "Neon Cyberpunk Sunset Theme",
        "cost": 600,
        "category": "theme",
        "description": "Applies a grid backdrop and retro sunset neon animations to your lobby.",
        "style_class": "bg-gray-950 border-cyan-500/30 text-cyan-400"
    },
    {
        "id": "theme_matrix",
        "name": "Matrix Digital Rain Theme",
        "cost": 1000,
        "category": "theme",
        "description": "Applies a falling matrix green code rain overlay to your dashboard.",
        "style_class": "bg-black border-green-500/30 text-green-500"
    }
]

@router.get("/items", response_model=list[schemas.ShopItemOut])
def get_shop_items(current_user: models.User = Depends(auth.get_current_user)):
    return SHOP_ITEMS

@router.post("/buy", response_model=schemas.UserOut)
def buy_shop_item(
    req: schemas.BuyRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Find item
    item = next((i for i in SHOP_ITEMS if i["id"] == req.item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Shop item not found")
        
    # Check XP balance
    if current_user.xp < item["cost"]:
        raise HTTPException(status_code=400, detail="Insufficient XP balance to purchase this item")
        
    # Check if cosmetic is already unlocked
    unlocked = list(current_user.unlocked_items) if current_user.unlocked_items else []
    if item["category"] != "consumable" and item["id"] in unlocked:
        raise HTTPException(status_code=400, detail="You have already unlocked this cosmetic item")
        
    try:
        # Deduct XP
        current_user.xp -= item["cost"]
        
        # Apply purchase
        if item["category"] == "consumable":
            if item["id"] == "item_streak_freeze":
                current_user.streak_freezes += 1
        else:
            unlocked.append(item["id"])
            current_user.unlocked_items = unlocked
            flag_modified(current_user, "unlocked_items")
            
        # Unlock achievement for first shop purchase
        ach = list(current_user.achievements) if current_user.achievements else []
        if "shop_buyer" not in ach:
            ach.append("shop_buyer")
            current_user.achievements = ach
            flag_modified(current_user, "achievements")
            
        db.commit()
        db.refresh(current_user)
        return current_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to complete purchase: {e}")

@router.post("/activate", response_model=schemas.UserOut)
def activate_shop_item(
    req: schemas.ActivateRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # 'default' is always allowed
    unlocked = list(current_user.unlocked_items) if current_user.unlocked_items else []
    if req.item_id != "default" and req.item_id not in unlocked:
        raise HTTPException(status_code=400, detail="You must purchase this cosmetic item before activating it")
        
    try:
        if req.category == "theme":
            current_user.active_theme = req.item_id
        elif req.category == "frame":
            current_user.active_frame = req.item_id
        else:
            raise HTTPException(status_code=400, detail="Invalid item category")
            
        db.commit()
        db.refresh(current_user)
        return current_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to activate item: {e}")
