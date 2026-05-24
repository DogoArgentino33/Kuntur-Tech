"""Videos router — endpoints for uploading, retrieving, and managing athlete videos."""

import os
import shutil
from datetime import datetime
from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_user
from app.auth.models import User
from app.database import get_db
from app.users.models import Athlete
from app.sports.models import Sport
from app.videos.models import Video, VideoStatus
from app.videos.schemas import VideoCreate, VideoResponse, VideoListResponse

# Create uploads directory if it doesn't exist
UPLOADS_DIR = Path(__file__).parent.parent.parent / "uploads" / "videos"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

# Allowed video extensions
ALLOWED_EXTENSIONS = {".mp4", ".mov", ".mpeg", ".webm", ".avi", ".mkv"}
MAX_FILE_SIZE = 500 * 1024 * 1024  # 500MB

router = APIRouter(prefix="/api/v1/videos", tags=["Videos"])


def save_upload_file(upload_file: UploadFile) -> tuple[str, int]:
    """
    Save uploaded file to disk and return filename and size.
    Returns (filename, file_size_mb)
    """
    # Validate file extension
    file_ext = Path(upload_file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File extension {file_ext} not allowed. Use: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Generate unique filename with timestamp
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S_")
    filename = timestamp + Path(upload_file.filename).name

    file_path = UPLOADS_DIR / filename

    try:
        # Write file to disk
        with open(file_path, "wb") as f:
            shutil.copyfileobj(upload_file.file, f)

        # Get file size
        file_size_bytes = file_path.stat().st_size

        if file_size_bytes > MAX_FILE_SIZE:
            file_path.unlink()  # Delete the file
            raise HTTPException(
                status_code=status.HTTP_413_PAYLOAD_TOO_LARGE,
                detail=f"File too large. Maximum size is 500MB."
            )

        file_size_mb = file_size_bytes // (1024 * 1024)

        return filename, file_size_mb

    except Exception as e:
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving file: {str(e)}"
        )


@router.post(
    "/upload",
    response_model=VideoResponse,
    summary="Upload a video",
    status_code=status.HTTP_201_CREATED,
)
async def upload_video(
    file: UploadFile = File(...),
    title: str = Form(..., min_length=5, max_length=255),
    description: str = Form(None),
    sport_id: int = Form(...),
    recorded_date: str = Form(None),
    location: str = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Upload a video file. Returns video metadata with file URL.
    
    - **file**: Video file (MP4, MOV, WebM, etc.) — max 500MB
    - **title**: Video title (5-255 characters)
    - **description**: Optional description
    - **sport_id**: Sport ID
    - **recorded_date**: Optional recording date (ISO format)
    - **location**: Optional recording location
    """
    # Get athlete profile
    athlete = db.query(Athlete).filter(Athlete.user_id == current_user.id).first()
    if not athlete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Athlete profile not found"
        )

    # Validate sport exists
    sport = db.query(Sport).filter(Sport.id == sport_id).first()
    if not sport:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sport not found"
        )

    # Save file to disk
    filename, file_size_mb = save_upload_file(file)
    file_url = f"/uploads/videos/{filename}"
    thumbnail_url = f"/uploads/videos/{filename}.jpg"  # Placeholder for now

    # Create video record in database
    video = Video(
        athlete_id=athlete.id,
        sport_id=sport_id,
        title=title,
        description=description,
        file_url=file_url,
        thumbnail_url=thumbnail_url,
        file_size_mb=file_size_mb,
        mime_type=file.content_type or "video/mp4",
        status=VideoStatus.pending,
        recorded_date=recorded_date,
        location=location,
    )

    db.add(video)
    db.commit()
    db.refresh(video)

    return {
        "id": video.id,
        "title": video.title,
        "description": video.description,
        "sport_name": sport.name,
        "file_url": video.file_url,
        "thumbnail_url": video.thumbnail_url,
        "duration_seconds": video.duration_seconds,
        "file_size_mb": video.file_size_mb,
        "status": video.status,
        "views_count": video.views_count,
        "created_at": video.created_at,
        "rejection_reason": video.rejection_reason,
    }


@router.get(
    "/feed",
    response_model=List[dict],
    summary="Get public video feed for clubs/scouts",
)
async def get_video_feed(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all videos (approved/pending for MVP) for the club feed."""
    from app.sports.models import Position
    
    videos = db.query(Video).order_by(Video.created_at.desc()).all()
    
    result = []
    for video in videos:
        athlete = db.query(Athlete).filter(Athlete.id == video.athlete_id).first()
        if not athlete:
            continue
            
        sport = db.query(Sport).filter(Sport.id == athlete.primary_sport_id).first()
        position = db.query(Position).filter(Position.id == athlete.primary_position_id).first()
        
        # Calculate age
        age = None
        if athlete.date_of_birth:
            today = datetime.today()
            age = today.year - athlete.date_of_birth.year - ((today.month, today.day) < (athlete.date_of_birth.month, athlete.date_of_birth.day))
            
        result.append({
            "id": video.id,
            "title": video.title,
            "description": video.description,
            "file_url": video.file_url,
            "thumbnail_url": video.thumbnail_url,
            "duration_seconds": video.duration_seconds,
            "views_count": video.views_count,
            "created_at": video.created_at.isoformat(),
            "athlete": {
                "id": athlete.id,
                "first_name": athlete.first_name,
                "last_name": athlete.last_name,
                "country": athlete.country,
                "profile_picture_url": athlete.profile_picture_url,
                "primary_sport": {"id": sport.id, "name": sport.name} if sport else None,
                "primary_position": {"id": position.id, "name": position.name} if position else None,
                "height_cm": athlete.height_cm,
                "weight_kg": athlete.weight_kg,
                "age": age,
                "bio": athlete.bio
            }
        })
        
    return result


@router.get(
    "/my-videos",
    response_model=List[VideoListResponse],
    summary="Get current athlete's videos",
)
async def get_my_videos(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all videos uploaded by the current athlete."""
    athlete = db.query(Athlete).filter(Athlete.user_id == current_user.id).first()
    if not athlete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Athlete profile not found"
        )

    videos = db.query(Video).filter(
        Video.athlete_id == athlete.id
    ).order_by(Video.created_at.desc()).all()

    result = []
    for video in videos:
        sport = db.query(Sport).filter(Sport.id == video.sport_id).first()
        result.append({
            "id": video.id,
            "title": video.title,
            "description": video.description,
            "sport_name": sport.name if sport else "Unknown",
            "file_url": video.file_url,
            "thumbnail_url": video.thumbnail_url,
            "duration_seconds": video.duration_seconds,
            "status": video.status,
            "views_count": video.views_count,
            "created_at": video.created_at,
        })

    return result


@router.get(
    "/{video_id}",
    response_model=VideoResponse,
    summary="Get video details",
)
async def get_video(
    video_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get detailed information about a specific video."""
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found"
        )

    sport = db.query(Sport).filter(Sport.id == video.sport_id).first()

    return {
        "id": video.id,
        "title": video.title,
        "description": video.description,
        "sport_name": sport.name if sport else "Unknown",
        "file_url": video.file_url,
        "thumbnail_url": video.thumbnail_url,
        "duration_seconds": video.duration_seconds,
        "file_size_mb": video.file_size_mb,
        "status": video.status,
        "views_count": video.views_count,
        "created_at": video.created_at,
        "rejection_reason": video.rejection_reason,
    }


@router.delete(
    "/{video_id}",
    summary="Delete a video",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_video(
    video_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a video (owner only)."""
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found"
        )

    # Check if current user is the video owner
    athlete = db.query(Athlete).filter(Athlete.user_id == current_user.id).first()
    if not athlete or video.athlete_id != athlete.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to delete this video"
        )

    # Delete file from disk
    if video.file_url:
        file_path = UPLOADS_DIR / Path(video.file_url).name
        if file_path.exists():
            file_path.unlink()

    # Delete record from database
    db.delete(video)
    db.commit()
