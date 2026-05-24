"""Video model — database schema for athlete videos."""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from enum import Enum

from app.database import Base


class VideoStatus(str, Enum):
    """Video moderation status."""
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    flagged = "flagged"


class Video(Base):
    """Video uploaded by an athlete."""
    
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    athlete_id = Column(Integer, ForeignKey("athlete.id", ondelete="CASCADE"), nullable=False, index=True)
    sport_id = Column(Integer, ForeignKey("sport.id"), nullable=False)
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    file_url = Column(String(512), nullable=False)  # Path to video file
    thumbnail_url = Column(String(512), nullable=True)  # Path to thumbnail
    
    duration_seconds = Column(Integer, default=0)
    file_size_mb = Column(Integer, default=0)  # Size in MB
    mime_type = Column(String(50), default="video/mp4")
    
    status = Column(SQLEnum(VideoStatus), default=VideoStatus.pending, index=True)
    rejection_reason = Column(Text, nullable=True)
    
    views_count = Column(Integer, default=0)
    
    recorded_date = Column(DateTime, nullable=True)
    location = Column(String(255), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    athlete = relationship("Athlete", back_populates="videos")

    def __repr__(self):
        return f"<Video(id={self.id}, title='{self.title}', athlete_id={self.athlete_id}, status={self.status})>"
