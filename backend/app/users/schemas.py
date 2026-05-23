"""
Pydantic schemas for user profile data (athletes and clubs).
"""

from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, field_validator


# ── Sport/Position reference schemas ──────────────────────────────

class SportResponse(BaseModel):
    id: int
    name: str
    icon_url: Optional[str] = None

    model_config = {"from_attributes": True}


class PositionResponse(BaseModel):
    id: int
    name: str
    sport_id: int

    model_config = {"from_attributes": True}


# ── Athlete schemas ───────────────────────────────────────────────

class AthleteProfileResponse(BaseModel):
    id: int
    user_id: int
    first_name: str
    last_name: str
    date_of_birth: date
    country: str
    city: Optional[str] = None
    phone: Optional[str] = None
    height_cm: Optional[int] = None
    weight_kg: Optional[int] = None
    dominant_side: Optional[str] = None
    years_experience: Optional[int] = None
    current_team: Optional[str] = None
    bio: Optional[str] = None
    profile_picture_url: Optional[str] = None
    primary_sport: Optional[SportResponse] = None
    primary_position: Optional[PositionResponse] = None
    created_at: datetime
    updated_at: datetime

    # Computed fields
    email: Optional[str] = None
    is_email_verified: Optional[bool] = None

    model_config = {"from_attributes": True}


class AthleteUpdateRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None
    height_cm: Optional[int] = None
    weight_kg: Optional[int] = None
    dominant_side: Optional[str] = None
    years_experience: Optional[int] = None
    current_team: Optional[str] = None
    bio: Optional[str] = None
    primary_sport_id: Optional[int] = None
    primary_position_id: Optional[int] = None

    @field_validator("height_cm")
    @classmethod
    def reasonable_height(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and not (100 <= v <= 250):
            raise ValueError("Altura debe estar entre 100 y 250 cm")
        return v

    @field_validator("weight_kg")
    @classmethod
    def reasonable_weight(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and not (30 <= v <= 200):
            raise ValueError("Peso debe estar entre 30 y 200 kg")
        return v

    @field_validator("bio")
    @classmethod
    def bio_max_length(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and len(v) > 500:
            raise ValueError("La bio no puede exceder 500 caracteres")
        return v


# ── Club schemas ──────────────────────────────────────────────────

class ClubProfileResponse(BaseModel):
    id: int
    user_id: int
    name: str
    club_type: str
    country: str
    city: str
    phone: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None
    is_verified: bool
    responsible_name: str
    responsible_position: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    # From user
    email: Optional[str] = None
    is_email_verified: Optional[bool] = None

    model_config = {"from_attributes": True}


class ClubUpdateRequest(BaseModel):
    name: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    responsible_name: Optional[str] = None
    responsible_position: Optional[str] = None

    @field_validator("description")
    @classmethod
    def description_max_length(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and len(v) > 500:
            raise ValueError("La descripción no puede exceder 500 caracteres")
        return v
