"""
Sports router — public endpoints for listing sports and positions.
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.sports.models import Sport, Position
from app.users.schemas import SportResponse, PositionResponse

router = APIRouter(prefix="/api/v1/sports", tags=["Sports"])


@router.get(
    "",
    response_model=List[SportResponse],
    summary="List all available sports",
)
def list_sports(db: Session = Depends(get_db)):
    """Get all sports. Public endpoint — no auth required."""
    sports = db.query(Sport).order_by(Sport.name).all()
    return sports


@router.get(
    "/{sport_id}/positions",
    response_model=List[PositionResponse],
    summary="List positions for a specific sport",
)
def list_positions(sport_id: int, db: Session = Depends(get_db)):
    """Get all positions for a given sport. Public endpoint."""
    sport = db.query(Sport).filter(Sport.id == sport_id).first()
    if not sport:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deporte no encontrado",
        )

    positions = (
        db.query(Position)
        .filter(Position.sport_id == sport_id)
        .order_by(Position.name)
        .all()
    )
    return positions
