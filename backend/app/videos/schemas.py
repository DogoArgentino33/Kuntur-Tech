"""Video schemas — Pydantic models for request/response validation."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from enum import Enum


class VideoStatus(str, Enum):
    """Video status enum."""
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    flagged = "flagged"


class VideoCreate(BaseModel):
    """Schema for creating a video (used in multipart form)."""
    title: str = Field(..., min_length=5, max_length=255, description="Video title")
    description: Optional[str] = Field(None, max_length=1000, description="Video description")
    sport_id: int = Field(..., description="Sport ID")
    recorded_date: Optional[str] = Field(None, description="Recording date (ISO format)")
    location: Optional[str] = Field(None, max_length=255, description="Recording location")


class VideoResponse(BaseModel):
    """Schema for video response."""
    id: int
    title: str
    description: Optional[str]
    sport_name: str
    file_url: str
    thumbnail_url: Optional[str]
    duration_seconds: int
    file_size_mb: int
    status: VideoStatus
    views_count: int
    created_at: datetime
    rejection_reason: Optional[str]

    class Config:
        from_attributes = True


class VideoListResponse(BaseModel):
    """Schema for listing videos."""
    id: int
    title: str
    description: Optional[str]
    sport_name: str
    file_url: str
    thumbnail_url: Optional[str]
    duration_seconds: int
    status: VideoStatus
    views_count: int
    created_at: datetime

    class Config:
        from_attributes = True
