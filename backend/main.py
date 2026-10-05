from contextlib import asynccontextmanager
from typing import List, Optional
from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import crud
from database import Base, engine, get_db
import models
from schemas import (
    ProspectCreate,
    ProspectFollowUpUpdate,
    ProspectResponse,
    ProspectStatusUpdate,
    ProspectUpdate,
    StatsResponse,
)
from seed import seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables automatically on startup
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Outreach CRM API",
    description="Internal Outreach CRM for managing cold outreach prospects and client acquisition",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
import os

frontend_url = os.getenv("FRONTEND_URL")
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]
if frontend_url:
    allowed_origins.append(frontend_url.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Outreach CRM API",
        "docs_url": "/docs",
    }


@app.get("/api/stats", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    """Get aggregated outreach statistics for dashboard cards."""
    return crud.get_stats(db)


@app.get("/api/follow-ups/due", response_model=List[ProspectResponse])
def get_due_follow_ups(db: Session = Depends(get_db)):
    """Get prospects whose follow-up is due today or overdue."""
    return crud.get_due_follow_ups(db)


@app.get("/api/follow-ups/upcoming", response_model=List[ProspectResponse])
def get_upcoming_follow_ups(db: Session = Depends(get_db)):
    """Get prospects whose follow-up is due in the next 7 days."""
    return crud.get_upcoming_follow_ups(db)


@app.get("/api/prospects", response_model=List[ProspectResponse])
def list_prospects(
    search: Optional[str] = Query(None, description="Search company, owner, email, or website"),
    status: Optional[str] = Query(None, description="Filter by status (or ALL)"),
    priority: Optional[str] = Query(None, description="Filter by priority (or ALL)"),
    sort: Optional[str] = Query("newest", description="Sort order: newest, oldest, next_follow_up, priority"),
    db: Session = Depends(get_db),
):
    """List prospects with optional search, filters, and sorting."""
    return crud.get_prospects(
        db=db, search=search, status=status, priority=priority, sort=sort
    )


@app.get("/api/prospects/{prospect_id}", response_model=ProspectResponse)
def get_prospect(prospect_id: int, db: Session = Depends(get_db)):
    """Get detailed prospect by ID."""
    db_prospect = crud.get_prospect_by_id(db, prospect_id)
    if not db_prospect:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prospect with ID {prospect_id} not found",
        )
    return db_prospect


@app.post(
    "/api/prospects",
    response_model=ProspectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_prospect(
    prospect_in: ProspectCreate, db: Session = Depends(get_db)
):
    """Create a new prospect."""
    return crud.create_prospect(db, prospect_in)


@app.put("/api/prospects/{prospect_id}", response_model=ProspectResponse)
def update_prospect(
    prospect_id: int,
    prospect_in: ProspectUpdate,
    db: Session = Depends(get_db),
):
    """Update an existing prospect."""
    db_prospect = crud.get_prospect_by_id(db, prospect_id)
    if not db_prospect:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prospect with ID {prospect_id} not found",
        )
    return crud.update_prospect(db, db_prospect, prospect_in)


@app.delete("/api/prospects/{prospect_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_prospect(prospect_id: int, db: Session = Depends(get_db)):
    """Delete a prospect by ID."""
    db_prospect = crud.get_prospect_by_id(db, prospect_id)
    if not db_prospect:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prospect with ID {prospect_id} not found",
        )
    crud.delete_prospect(db, db_prospect)
    return None


@app.patch("/api/prospects/{prospect_id}/status", response_model=ProspectResponse)
def update_status(
    prospect_id: int,
    status_in: ProspectStatusUpdate,
    db: Session = Depends(get_db),
):
    """Quick action: update status immediately."""
    db_prospect = crud.get_prospect_by_id(db, prospect_id)
    if not db_prospect:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prospect with ID {prospect_id} not found",
        )
    return crud.update_prospect_status(db, db_prospect, status_in.status)


@app.patch("/api/prospects/{prospect_id}/follow-up", response_model=ProspectResponse)
def update_follow_up(
    prospect_id: int,
    follow_up_in: ProspectFollowUpUpdate,
    db: Session = Depends(get_db),
):
    """Quick action: schedule follow-up date immediately."""
    db_prospect = crud.get_prospect_by_id(db, prospect_id)
    if not db_prospect:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prospect with ID {prospect_id} not found",
        )
    return crud.update_prospect_follow_up(
        db, db_prospect, follow_up_in.next_follow_up_date
    )


@app.post("/api/seed", status_code=status.HTTP_200_OK)
def trigger_seed(force: bool = False):
    """Reset or seed default demo prospects."""
    seed_database(force=force)
    return {"message": "Database seeded successfully", "force": force}
