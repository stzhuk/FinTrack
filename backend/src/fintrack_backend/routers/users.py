"""User profile endpoints requiring authentication."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from fintrack_backend.database import get_db
from fintrack_backend.schemas.user import UserResponse, UserUpdate
from fintrack_backend.crud.user import user_crud
from fintrack_backend.dependencies import get_current_user


router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Return profile information for the authenticated user."""
    user = user_crud.get_by_id(db, current_user["user_id"])
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update profile fields for the authenticated user."""
    user = user_crud.update(db, current_user["user_id"], user_update)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user
