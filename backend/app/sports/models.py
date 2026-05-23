"""
Sport and Position models — reference data for athlete profiles.
"""

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Sport(Base):
    __tablename__ = "sports"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    icon_url = Column(String(500), nullable=True)

    # Relationship
    positions = relationship("Position", back_populates="sport", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Sport(id={self.id}, name='{self.name}')>"


class Position(Base):
    __tablename__ = "positions"

    id = Column(Integer, primary_key=True, index=True)
    sport_id = Column(Integer, ForeignKey("sports.id"), nullable=False)
    name = Column(String(100), nullable=False)

    # Relationship
    sport = relationship("Sport", back_populates="positions")

    def __repr__(self):
        return f"<Position(id={self.id}, name='{self.name}', sport_id={self.sport_id})>"
