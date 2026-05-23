"""
User profile router — CRUD for athlete and club profiles, avatar upload.
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.models import User, UserType
from app.dependencies import get_current_user
from app.users import crud
from app.users.schemas import (
    AthleteProfileResponse,
    AthleteUpdateRequest,
    ClubProfileResponse,
    ClubUpdateRequest,
)

router = APIRouter(prefix="/api/v1", tags=["User Profiles"])


# ── Athlete Profile ───────────────────────────────────────────────

@router.get(
    "/athletes/me",
    response_model=AthleteProfileResponse,
    summary="Get current athlete's profile",
)
def get_my_athlete_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the authenticated athlete's full profile."""
    if current_user.user_type != UserType.ATHLETE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo atletas pueden acceder a este recurso",
        )

    athlete = crud.get_athlete_by_user_id(db, current_user.id)
    if not athlete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Perfil de atleta no encontrado",
        )

    # Merge user data into response
    response = AthleteProfileResponse.model_validate(athlete)
    response.email = current_user.email
    response.is_email_verified = current_user.is_email_verified
    return response


@router.put(
    "/athletes/me",
    response_model=AthleteProfileResponse,
    summary="Update current athlete's profile",
)
def update_my_athlete_profile(
    data: AthleteUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update the authenticated athlete's profile fields."""
    if current_user.user_type != UserType.ATHLETE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo atletas pueden acceder a este recurso",
        )

    athlete = crud.get_athlete_by_user_id(db, current_user.id)
    if not athlete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Perfil de atleta no encontrado",
        )

    update_data = data.model_dump(exclude_unset=True)
    updated = crud.update_athlete(db, athlete, update_data)

    response = AthleteProfileResponse.model_validate(updated)
    response.email = current_user.email
    response.is_email_verified = current_user.is_email_verified
    return response


# ── Club Profile ──────────────────────────────────────────────────

@router.get(
    "/clubs/me",
    response_model=ClubProfileResponse,
    summary="Get current club's profile",
)
def get_my_club_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the authenticated club's full profile."""
    if current_user.user_type != UserType.CLUB:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo clubes pueden acceder a este recurso",
        )

    club = crud.get_club_by_user_id(db, current_user.id)
    if not club:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Perfil de club no encontrado",
        )

    response = ClubProfileResponse.model_validate(club)
    response.email = current_user.email
    response.is_email_verified = current_user.is_email_verified
    return response


@router.put(
    "/clubs/me",
    response_model=ClubProfileResponse,
    summary="Update current club's profile",
)
def update_my_club_profile(
    data: ClubUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update the authenticated club's profile fields."""
    if current_user.user_type != UserType.CLUB:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo clubes pueden acceder a este recurso",
        )

    club = crud.get_club_by_user_id(db, current_user.id)
    if not club:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Perfil de club no encontrado",
        )

    update_data = data.model_dump(exclude_unset=True)
    updated = crud.update_club(db, club, update_data)

    response = ClubProfileResponse.model_validate(updated)
    response.email = current_user.email
    response.is_email_verified = current_user.is_email_verified
    return response


# ── Avatar Upload ─────────────────────────────────────────────────

@router.post(
    "/users/avatar-upload",
    summary="Upload a profile picture / avatar",
)
def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Upload a profile picture. Currently stubbed for MVP —
    in production, integrates with Cloudinary.
    """
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tipo de archivo no permitido. Usa: {', '.join(allowed_types)}",
        )

    # Validate file size (max 5MB)
    file_size = 0
    for chunk in file.file:
        file_size += len(chunk)
        if file_size > 5 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El archivo excede el tamaño máximo de 5MB",
            )
    file.file.seek(0)  # Reset file pointer

    # STUB: In production, upload to Cloudinary
    # result = cloudinary.uploader.upload(file.file, folder="avatars", ...)
    # avatar_url = result["secure_url"]
    avatar_url = f"https://placeholder.kuntur-tech.com/avatars/{current_user.id}.jpg"

    # Update profile
    crud.update_user_avatar(db, current_user, avatar_url)

    return {"avatar_url": avatar_url, "message": "Avatar actualizado exitosamente"}
