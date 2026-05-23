"""
Kuntur-Tech API — Main Application Entry Point

FastAPI application with CORS, rate limiting, and router registration.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.config import get_settings
from app.database import Base, engine

# Import all models so SQLAlchemy knows about them
from app.auth.models import User  # noqa: F401
from app.users.models import Athlete, Club  # noqa: F401
from app.sports.models import Sport, Position  # noqa: F401

# Import routers
from app.auth.router import router as auth_router
from app.users.router import router as users_router
from app.sports.router import router as sports_router

# Import seed data
from app.sports.data import seed_sports_data
from app.database import SessionLocal

settings = get_settings()


# ── Lifespan (startup/shutdown) ───────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle — create tables and seed data on startup."""
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")

    # Seed sports data
    db = SessionLocal()
    try:
        seed_sports_data(db)
    finally:
        db.close()

    yield  # App is running

    # Shutdown
    print("🛑 Application shutting down")


# ── Rate Limiter ──────────────────────────────────────────────────

limiter = Limiter(key_func=get_remote_address)


# ── FastAPI App ───────────────────────────────────────────────────

app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "API para la plataforma de scouting deportivo inteligente Kuntur-Tech. "
        "Conecta atletas, scouts, clubes y academias mediante IA y análisis de video."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Attach limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# ── CORS Middleware ───────────────────────────────────────────────

origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Register Routers ─────────────────────────────────────────────

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(sports_router)


# ── Health Check ──────────────────────────────────────────────────

@app.get("/health", tags=["Health"])
def health_check():
    """Basic health check endpoint."""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "environment": settings.ENVIRONMENT,
    }


@app.get("/", tags=["Health"])
def root():
    """Root endpoint — API info."""
    return {
        "app": settings.APP_NAME,
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
    }
