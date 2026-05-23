"""
CRUD operations for athlete and club profiles.
"""

from typing import Optional
from sqlalchemy.orm import Session, joinedload

from app.auth.models import User
from app.users.models import Athlete, Club


# ── Athlete CRUD ──────────────────────────────────────────────────

def get_athlete_by_user_id(db: Session, user_id: int) -> Optional[Athlete]:
    """Get athlete profile with sport/position eagerly loaded."""
    return (
        db.query(Athlete)
        .options(
            joinedload(Athlete.primary_sport),
            joinedload(Athlete.primary_position),
        )
        .filter(Athlete.user_id == user_id)
        .first()
    )


def create_athlete(db: Session, user_id: int, **kwargs) -> Athlete:
    """Create a new athlete profile linked to a user."""
    athlete = Athlete(user_id=user_id, **kwargs)
    db.add(athlete)
    db.commit()
    db.refresh(athlete)
    return athlete


def update_athlete(db: Session, athlete: Athlete, update_data: dict) -> Athlete:
    """Update athlete profile fields (only non-None values)."""
    for key, value in update_data.items():
        if value is not None:
            setattr(athlete, key, value)
    db.commit()
    db.refresh(athlete)
    return athlete


# ── Club CRUD ─────────────────────────────────────────────────────

def get_club_by_user_id(db: Session, user_id: int) -> Optional[Club]:
    """Get club profile by user ID."""
    return db.query(Club).filter(Club.user_id == user_id).first()


def create_club(db: Session, user_id: int, **kwargs) -> Club:
    """Create a new club profile linked to a user."""
    club = Club(user_id=user_id, **kwargs)
    db.add(club)
    db.commit()
    db.refresh(club)
    return club


def update_club(db: Session, club: Club, update_data: dict) -> Club:
    """Update club profile fields (only non-None values)."""
    for key, value in update_data.items():
        if value is not None:
            setattr(club, key, value)
    db.commit()
    db.refresh(club)
    return club


# ── User helpers ──────────────────────────────────────────────────

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Find a user by email address."""
    return db.query(User).filter(User.email == email).first()


def update_user_avatar(db: Session, user: User, avatar_url: str) -> None:
    """Update the profile picture URL for a user's athlete profile."""
    athlete = get_athlete_by_user_id(db, user.id)
    if athlete:
        athlete.profile_picture_url = avatar_url
        db.commit()
