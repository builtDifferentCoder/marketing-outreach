from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class ProspectBase(BaseModel):
    company_name: str = Field(..., min_length=1, max_length=255)
    website: Optional[str] = None
    company_type: Optional[str] = None
    owner_name: str = Field(..., min_length=1, max_length=255)
    owner_title: Optional[str] = None
    email: str = Field(..., min_length=3, max_length=255)
    linkedin_url: Optional[str] = None
    phone: Optional[str] = None
    country: Optional[str] = None
    timezone: Optional[str] = None

    service_type: Optional[str] = None
    potential_need: Optional[str] = None
    source: Optional[str] = None

    status: str = "NEW"
    priority: str = "MEDIUM"

    first_contact_date: Optional[str] = None
    last_contact_date: Optional[str] = None
    next_follow_up_date: Optional[str] = None

    proposal_amount: Optional[float] = None
    currency: str = "USD"

    demo_sent: bool = False
    demo_type: Optional[str] = None

    notes: Optional[str] = None


class ProspectCreate(ProspectBase):
    pass


class ProspectUpdate(BaseModel):
    company_name: Optional[str] = None
    website: Optional[str] = None
    company_type: Optional[str] = None
    owner_name: Optional[str] = None
    owner_title: Optional[str] = None
    email: Optional[str] = None
    linkedin_url: Optional[str] = None
    phone: Optional[str] = None
    country: Optional[str] = None
    timezone: Optional[str] = None

    service_type: Optional[str] = None
    potential_need: Optional[str] = None
    source: Optional[str] = None

    status: Optional[str] = None
    priority: Optional[str] = None

    first_contact_date: Optional[str] = None
    last_contact_date: Optional[str] = None
    next_follow_up_date: Optional[str] = None

    proposal_amount: Optional[float] = None
    currency: Optional[str] = None

    demo_sent: Optional[bool] = None
    demo_type: Optional[str] = None

    notes: Optional[str] = None


class ProspectStatusUpdate(BaseModel):
    status: str


class ProspectFollowUpUpdate(BaseModel):
    next_follow_up_date: Optional[str] = None


class ProspectResponse(ProspectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class StatsResponse(BaseModel):
    total: int
    new: int
    contacted: int
    follow_up: int
    interested: int
    proposals: int
    won: int
    lost: int
