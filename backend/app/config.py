"""
Kuntur-Tech Backend Configuration
Loads settings from environment variables with sensible defaults.
"""

import os
from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # ── Database ──────────────────────────────────────────────
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/kuntur_tech"

    # ── JWT Authentication ────────────────────────────────────
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # ── Cloudinary (stubbed for MVP) ──────────────────────────
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    # ── Email (stubbed for MVP — logs to console) ─────────────
    SENDGRID_API_KEY: str = ""
    FROM_EMAIL: str = "noreply@kuntur-tech.com"

    # ── CORS ──────────────────────────────────────────────────
    ALLOWED_ORIGINS: str = "http://localhost:3000"

    # ── Redis (optional) ──────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379/0"

    # ── App ───────────────────────────────────────────────────
    ENVIRONMENT: str = "development"
    APP_NAME: str = "Kuntur-Tech API"

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    """Cached settings instance — only reads .env once."""
    return Settings()
