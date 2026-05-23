"""
User model — core authentication entity.
All users (athletes and clubs) share this table for login credentials.
"""

import enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class UserType(str, enum.Enum):
    ATHLETE = "athlete"
    CLUB = "club"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    username = Column(String(100), unique=True, nullable=True)
    user_type = Column(Enum(UserType, name="user_type_enum"), nullable=False)
    is_active = Column(Boolean, default=True)
    is_email_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)

    # Relationships (one-to-one with athlete or club profile)
    athlete_profile = relationship("Athlete", back_populates="user", uselist=False, cascade="all, delete-orphan")
    club_profile = relationship("Club", back_populates="user", uselist=False, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', type='{self.user_type}')>"
