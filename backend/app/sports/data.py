"""
Seed data for sports and positions.
Run this once on application startup to populate reference tables.
"""

from sqlalchemy.orm import Session
from app.sports.models import Sport, Position


# ── Sports and their positions ────────────────────────────────────
SPORTS_DATA = {
    "Fútbol": [
        "Portero", "Defensa Central", "Lateral Derecho", "Lateral Izquierdo",
        "Centrocampista Defensivo", "Centrocampista", "Mediapunta",
        "Extremo Derecho", "Extremo Izquierdo", "Delantero Centro",
    ],
    "Baloncesto": [
        "Base", "Escolta", "Alero", "Ala-Pívot", "Pívot",
    ],
    "Voleibol": [
        "Armador", "Central", "Opuesto", "Receptor", "Líbero",
    ],
    "Tenis": [
        "Singularista", "Doblista",
    ],
    "Atletismo": [
        "Velocista", "Fondista", "Mediofondista", "Saltador",
        "Lanzador", "Marchista", "Decatleta/Heptatleta",
    ],
    "Natación": [
        "Estilo Libre", "Espalda", "Pecho", "Mariposa", "Combinado",
    ],
    "Béisbol": [
        "Pitcher", "Catcher", "Primera Base", "Segunda Base",
        "Tercera Base", "Shortstop", "Jardinero Izquierdo",
        "Jardinero Central", "Jardinero Derecho",
    ],
    "Fútbol Americano": [
        "Quarterback", "Running Back", "Wide Receiver", "Tight End",
        "Offensive Lineman", "Defensive Lineman", "Linebacker",
        "Cornerback", "Safety", "Kicker/Punter",
    ],
}


def seed_sports_data(db: Session) -> None:
    """
    Populate sports and positions tables if they are empty.
    Safe to call multiple times — skips if data already exists.
    """
    existing_count = db.query(Sport).count()
    if existing_count > 0:
        return  # Already seeded

    for sport_name, positions in SPORTS_DATA.items():
        sport = Sport(name=sport_name)
        db.add(sport)
        db.flush()  # Get the sport.id

        for position_name in positions:
            position = Position(sport_id=sport.id, name=position_name)
            db.add(position)

    db.commit()
    print(f"✅ Seeded {len(SPORTS_DATA)} sports with positions")
