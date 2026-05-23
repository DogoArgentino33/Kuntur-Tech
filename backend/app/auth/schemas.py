"""
Pydantic schemas for authentication requests and responses.
"""

import re
from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, field_validator


# ── Validators ────────────────────────────────────────────────────

def validate_strong_password(password: str) -> str:
    """Enforce: min 8 chars, at least 1 uppercase, 1 digit."""
    if len(password) < 8:
        raise ValueError("La contraseña debe tener al menos 8 caracteres")
    if not any(c.isupper() for c in password):
        raise ValueError("La contraseña necesita al menos una mayúscula")
    if not any(c.isdigit() for c in password):
        raise ValueError("La contraseña necesita al menos un número")
    return password


# ── Request schemas ───────────────────────────────────────────────

class RegisterAthleteRequest(BaseModel):
    """Step 1-3 combined: all data needed to register an athlete."""
    # Step 1 — Basic info
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    date_of_birth: date
    country: str
    phone: Optional[str] = None

    # Step 2 — Sport info
    sport_id: int
    position_id: int
    height_cm: int
    weight_kg: int
    dominant_side: Optional[str] = None
    years_experience: int
    current_team: Optional[str] = None
    bio: str

    @field_validator("password")
    @classmethod
    def password_strong(cls, v: str) -> str:
        return validate_strong_password(v)

    @field_validator("date_of_birth")
    @classmethod
    def must_be_at_least_13(cls, v: date) -> date:
        from datetime import date as d
        age = (d.today() - v).days // 365
        if age < 13:
            raise ValueError("Debes tener al menos 13 años para registrarte")
        return v

    @field_validator("height_cm")
    @classmethod
    def reasonable_height(cls, v: int) -> int:
        if not (100 <= v <= 250):
            raise ValueError("Altura debe estar entre 100 y 250 cm")
        return v

    @field_validator("weight_kg")
    @classmethod
    def reasonable_weight(cls, v: int) -> int:
        if not (30 <= v <= 200):
            raise ValueError("Peso debe estar entre 30 y 200 kg")
        return v

    @field_validator("bio")
    @classmethod
    def bio_max_length(cls, v: str) -> str:
        if len(v) > 500:
            raise ValueError("La bio no puede exceder 500 caracteres")
        return v

    @field_validator("phone")
    @classmethod
    def valid_phone(cls, v: Optional[str]) -> Optional[str]:
        if v and not re.match(r"^\+?[\d\s\-()]{7,20}$", v):
            raise ValueError("Formato de teléfono inválido")
        return v


class RegisterClubRequest(BaseModel):
    """All data needed to register a club/organization."""
    # Organization info
    name: str
    club_type: str  # "professional", "academy", "federation", "independent_scout", "independent_coach"
    country: str
    city: str
    phone: str
    email: EmailStr
    password: str
    website: Optional[str] = None
    description: str

    # Responsible person
    responsible_name: str
    responsible_position: Optional[str] = None

    @field_validator("password")
    @classmethod
    def password_strong(cls, v: str) -> str:
        return validate_strong_password(v)

    @field_validator("name")
    @classmethod
    def name_min_length(cls, v: str) -> str:
        if len(v) < 3:
            raise ValueError("El nombre de la organización debe tener al menos 3 caracteres")
        return v

    @field_validator("description")
    @classmethod
    def description_max_length(cls, v: str) -> str:
        if len(v) > 500:
            raise ValueError("La descripción no puede exceder 500 caracteres")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def password_strong(cls, v: str) -> str:
        return validate_strong_password(v)


# ── Response schemas ──────────────────────────────────────────────

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    user_type: str
    expires_in: int = 604800  # 7 days in seconds

    model_config = {"from_attributes": True}


class UserResponse(BaseModel):
    id: int
    email: str
    user_type: str
    is_email_verified: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class MessageResponse(BaseModel):
    message: str
