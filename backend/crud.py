from datetime import date, timedelta
from typing import List, Optional
from sqlalchemy import case, func, or_
from sqlalchemy.orm import Session
from models import Prospect
from schemas import ProspectCreate, ProspectUpdate


def get_prospects(
    db: Session,
    search: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    sort: Optional[str] = "newest",
) -> List[Prospect]:
    query = db.query(Prospect)

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Prospect.company_name.ilike(search_term),
                Prospect.owner_name.ilike(search_term),
                Prospect.email.ilike(search_term),
                Prospect.website.ilike(search_term),
            )
        )

    if status and status.upper() != "ALL":
        query = query.filter(Prospect.status == status.upper())

    if priority and priority.upper() != "ALL":
        query = query.filter(Prospect.priority == priority.upper())

    # Sorting
    if sort == "oldest":
        query = query.order_by(Prospect.created_at.asc())
    elif sort == "next_follow_up":
        # Put nulls last
        query = query.order_by(
            case((Prospect.next_follow_up_date.is_(None), 1), else_=0),
            Prospect.next_follow_up_date.asc(),
            Prospect.created_at.desc(),
        )
    elif sort == "priority":
        priority_order = case(
            (Prospect.priority == "HIGH", 1),
            (Prospect.priority == "MEDIUM", 2),
            (Prospect.priority == "LOW", 3),
            else_=4,
        )
        query = query.order_by(priority_order, Prospect.created_at.desc())
    else:  # newest default
        query = query.order_by(Prospect.created_at.desc())

    return query.all()


def get_prospect_by_id(db: Session, prospect_id: int) -> Optional[Prospect]:
    return db.query(Prospect).filter(Prospect.id == prospect_id).first()


def create_prospect(db: Session, prospect_in: ProspectCreate) -> Prospect:
    db_prospect = Prospect(**prospect_in.model_dump())
    db.add(db_prospect)
    db.commit()
    db.refresh(db_prospect)
    return db_prospect


def update_prospect(
    db: Session, db_prospect: Prospect, prospect_in: ProspectUpdate
) -> Prospect:
    update_data = prospect_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_prospect, field, value)
    db.commit()
    db.refresh(db_prospect)
    return db_prospect


def delete_prospect(db: Session, db_prospect: Prospect) -> None:
    db.delete(db_prospect)
    db.commit()


def update_prospect_status(
    db: Session, db_prospect: Prospect, status: str
) -> Prospect:
    db_prospect.status = status.upper()
    db.commit()
    db.refresh(db_prospect)
    return db_prospect


def update_prospect_follow_up(
    db: Session, db_prospect: Prospect, next_follow_up_date: Optional[str]
) -> Prospect:
    db_prospect.next_follow_up_date = next_follow_up_date
    db.commit()
    db.refresh(db_prospect)
    return db_prospect


def get_stats(db: Session) -> dict:
    total = db.query(func.count(Prospect.id)).scalar() or 0
    new_count = (
        db.query(func.count(Prospect.id))
        .filter(Prospect.status == "NEW")
        .scalar()
        or 0
    )
    contacted_count = (
        db.query(func.count(Prospect.id))
        .filter(Prospect.status == "CONTACTED")
        .scalar()
        or 0
    )
    follow_up_count = (
        db.query(func.count(Prospect.id))
        .filter(Prospect.status == "FOLLOW_UP")
        .scalar()
        or 0
    )
    interested_count = (
        db.query(func.count(Prospect.id))
        .filter(Prospect.status == "INTERESTED")
        .scalar()
        or 0
    )
    proposals_count = (
        db.query(func.count(Prospect.id))
        .filter(Prospect.status.in_(["PROPOSAL_SENT", "NEGOTIATING"]))
        .scalar()
        or 0
    )
    won_count = (
        db.query(func.count(Prospect.id))
        .filter(Prospect.status == "WON")
        .scalar()
        or 0
    )
    lost_count = (
        db.query(func.count(Prospect.id))
        .filter(Prospect.status == "LOST")
        .scalar()
        or 0
    )

    return {
        "total": total,
        "new": new_count,
        "contacted": contacted_count,
        "follow_up": follow_up_count,
        "interested": interested_count,
        "proposals": proposals_count,
        "won": won_count,
        "lost": lost_count,
    }


def get_due_follow_ups(db: Session) -> List[Prospect]:
    today_str = date.today().isoformat()
    return (
        db.query(Prospect)
        .filter(
            Prospect.next_follow_up_date.is_not(None),
            Prospect.next_follow_up_date != "",
            Prospect.next_follow_up_date <= today_str,
            Prospect.status.notin_(["WON", "LOST", "NOT_INTERESTED"]),
        )
        .order_by(Prospect.next_follow_up_date.asc())
        .all()
    )


def get_upcoming_follow_ups(db: Session) -> List[Prospect]:
    today = date.today()
    today_str = today.isoformat()
    next_week_str = (today + timedelta(days=7)).isoformat()

    return (
        db.query(Prospect)
        .filter(
            Prospect.next_follow_up_date.is_not(None),
            Prospect.next_follow_up_date != "",
            Prospect.next_follow_up_date > today_str,
            Prospect.next_follow_up_date <= next_week_str,
            Prospect.status.notin_(["WON", "LOST", "NOT_INTERESTED"]),
        )
        .order_by(Prospect.next_follow_up_date.asc())
        .all()
    )
