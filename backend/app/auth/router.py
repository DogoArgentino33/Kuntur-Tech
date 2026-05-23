"""
Authentication router — register, login, logout, password reset, email verification.
"""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.models import User, UserType
from app.auth.schemas import (
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    RegisterAthleteRequest,
    RegisterClubRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserResponse,
)
from app.auth.utils import (
    create_access_token,
    create_email_verification_token,
    create_password_reset_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.users.models import Athlete, Club, ClubType
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])


# ── Register Athlete ──────────────────────────────────────────────

@router.post(
    "/register/athlete",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new athlete account",
)
def register_athlete(
    data: RegisterAthleteRequest,
    db: Session = Depends(get_db),
):
    """
    Create a new user + athlete profile.
    Returns JWT tokens for immediate authentication.
    """
    # Check if email already exists
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una cuenta con este email",
        )

    # Create user record
    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        user_type=UserType.ATHLETE,
        is_email_verified=False,
    )
    db.add(user)
    db.flush()  # Get user.id

    # Create athlete profile
    athlete = Athlete(
        user_id=user.id,
        first_name=data.first_name,
        last_name=data.last_name,
        date_of_birth=data.date_of_birth,
        country=data.country,
        phone=data.phone,
        height_cm=data.height_cm,
        weight_kg=data.weight_kg,
        primary_sport_id=data.sport_id,
        primary_position_id=data.position_id,
        dominant_side=data.dominant_side,
        years_experience=data.years_experience,
        current_team=data.current_team,
        bio=data.bio,
    )
    db.add(athlete)
    db.commit()

    # Generate tokens
    token_data = {"sub": user.email, "user_type": user.user_type.value}
    access_token = create_access_token(data=token_data)
    refresh_token = create_refresh_token(data=token_data)

    # Send verification email (stubbed for MVP — just log)
    verification_token = create_email_verification_token(user.email)
    print(f"📧 [STUB] Verification email for {user.email}: /verify-email/{verification_token}")

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_type=user.user_type.value,
    )


# ── Register Club ────────────────────────────────────────────────

@router.post(
    "/register/club",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new club/organization account",
)
def register_club(
    data: RegisterClubRequest,
    db: Session = Depends(get_db),
):
    """
    Create a new user + club profile.
    Returns JWT tokens for immediate authentication.
    """
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una cuenta con este email",
        )

    # Validate club_type enum
    try:
        club_type = ClubType(data.club_type)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Tipo de club inválido. Opciones: {[t.value for t in ClubType]}",
        )

    # Create user record
    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        user_type=UserType.CLUB,
        is_email_verified=False,
    )
    db.add(user)
    db.flush()

    # Create club profile
    club = Club(
        user_id=user.id,
        name=data.name,
        club_type=club_type,
        country=data.country,
        city=data.city,
        phone=data.phone,
        website=data.website,
        description=data.description,
        responsible_name=data.responsible_name,
        responsible_position=data.responsible_position,
    )
    db.add(club)
    db.commit()

    # Generate tokens
    token_data = {"sub": user.email, "user_type": user.user_type.value}
    access_token = create_access_token(data=token_data)
    refresh_token = create_refresh_token(data=token_data)

    # Send verification email (stubbed)
    verification_token = create_email_verification_token(user.email)
    print(f"📧 [STUB] Verification email for {user.email}: /verify-email/{verification_token}")

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_type=user.user_type.value,
    )


# ── Login ─────────────────────────────────────────────────────────

@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Authenticate and obtain JWT tokens",
)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db),
):
    """
    Validate credentials and return JWT tokens.
    Rate limited to 5 attempts per 15 minutes (configured in main.py).
    """
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email no registrado",
        )

    if not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Contraseña incorrecta",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cuenta desactivada",
        )

    # Update last login
    user.last_login = datetime.now(timezone.utc)
    db.commit()

    # Generate tokens
    token_data = {"sub": user.email, "user_type": user.user_type.value}
    access_token = create_access_token(data=token_data)
    refresh_token = create_refresh_token(data=token_data)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_type=user.user_type.value,
    )


# ── Logout ────────────────────────────────────────────────────────

@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Logout (client-side token removal)",
)
def logout(current_user: User = Depends(get_current_user)):
    """
    Logout endpoint. In a JWT-based system, actual invalidation is client-side.
    This endpoint confirms the operation. For production, implement token blacklisting.
    """
    return MessageResponse(message="Sesión cerrada exitosamente")


# ── Refresh Token ─────────────────────────────────────────────────

@router.post(
    "/refresh-token",
    response_model=TokenResponse,
    summary="Refresh an expired access token",
)
def refresh_token(
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Accept a refresh token and return a new access token.
    The refresh token should be sent in the Authorization header.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token requerido",
        )

    token = auth_header.split(" ")[1]
    payload = decode_token(token)

    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token inválido o expirado",
        )

    email = payload.get("sub")
    user = db.query(User).filter(User.email == email).first()

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado o desactivado",
        )

    # Generate new access token
    token_data = {"sub": user.email, "user_type": user.user_type.value}
    new_access_token = create_access_token(data=token_data)

    return TokenResponse(
        access_token=new_access_token,
        user_type=user.user_type.value,
    )


# ── Forgot Password ──────────────────────────────────────────────

@router.post(
    "/forgot-password",
    response_model=MessageResponse,
    summary="Request a password reset email",
)
def forgot_password(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    """
    Send a password reset link to the user's email.
    Always returns success to prevent email enumeration.
    """
    user = db.query(User).filter(User.email == data.email).first()

    if user:
        reset_token = create_password_reset_token(user.email)
        # In production: send real email via SendGrid
        print(f"📧 [STUB] Password reset for {user.email}: /reset-password?token={reset_token}")

    # Always return success to prevent email enumeration attacks
    return MessageResponse(
        message="Si el email está registrado, recibirás un enlace de recuperación"
    )


# ── Reset Password ────────────────────────────────────────────────

@router.post(
    "/reset-password",
    response_model=MessageResponse,
    summary="Reset password using a valid token",
)
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    """Validate reset token and update the user's password."""
    payload = decode_token(data.token)

    if payload is None or payload.get("purpose") != "password_reset":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token de recuperación inválido o expirado",
        )

    email = payload.get("sub")
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado",
        )

    user.password_hash = hash_password(data.new_password)
    db.commit()

    return MessageResponse(message="Contraseña actualizada exitosamente")


# ── Verify Email ──────────────────────────────────────────────────

@router.get(
    "/verify-email/{token}",
    response_model=MessageResponse,
    summary="Verify email address using token from confirmation email",
)
def verify_email(
    token: str,
    db: Session = Depends(get_db),
):
    """Mark the user's email as verified."""
    payload = decode_token(token)

    if payload is None or payload.get("purpose") != "email_verification":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token de verificación inválido o expirado",
        )

    email = payload.get("sub")
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado",
        )

    if user.is_email_verified:
        return MessageResponse(message="Email ya verificado")

    user.is_email_verified = True
    db.commit()

    return MessageResponse(message="Email verificado exitosamente")
