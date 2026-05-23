"""
Athlete and Club profile models.
Each is linked 1:1 to a User record via user_id.
"""

from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

import enum


class ClubType(str, enum.Enum):
    PROFESSIONAL = "professional"
    ACADEMY = "academy"
    FEDERATION = "federation"
    INDEPENDENT_SCOUT = "independent_scout"


class Athlete(Base):
    __tablename__ = "athletes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)

    # Personal info
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    country = Column(String(100), nullable=False)
    city = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)

    # Physical attributes
    height_cm = Column(Integer, nullable=True)
    weight_kg = Column(Integer, nullable=True)

    # Sport info
    primary_sport_id = Column(Integer, ForeignKey("sports.id"), nullable=True)
    primary_position_id = Column(Integer, ForeignKey("positions.id"), nullable=True)
    dominant_side = Column(String(20), nullable=True)  # "left", "right", "ambidextrous"
    years_experience = Column(Integer, nullable=True)
    current_team = Column(String(255), nullable=True)

    # Profile
    bio = Column(Text, nullable=True)
    profile_picture_url = Column(String(500), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="athlete_profile")
    primary_sport = relationship("Sport", foreign_keys=[primary_sport_id])
    primary_position = relationship("Position", foreign_keys=[primary_position_id])

    def __repr__(self):
        return f"<Athlete(id={self.id}, name='{self.first_name} {self.last_name}')>"


class Club(Base):
    __tablename__ = "clubs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)

    # Organization info
    name = Column(String(255), nullable=False)
    club_type = Column(Enum(ClubType, name="club_type_enum"), nullable=False)
    country = Column(String(100), nullable=False)
    city = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    website = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    logo_url = Column(String(500), nullable=True)
    is_verified = Column(Boolean, default=False)

    # Responsible person
    responsible_name = Column(String(255), nullable=False)
    responsible_position = Column(String(100), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="club_profile")

    def __repr__(self):
        return f"<Club(id={self.id}, name='{self.name}')>"
