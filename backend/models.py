from datetime import datetime
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    Integer,
    String,
    Text,
)
from database import Base


class Prospect(Base):
    __tablename__ = "prospects"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    company_name = Column(String(255), nullable=False, index=True)
    website = Column(String(255), nullable=True)
    company_type = Column(String(100), nullable=True)
    owner_name = Column(String(255), nullable=False, index=True)
    owner_title = Column(String(100), nullable=True)
    email = Column(String(255), nullable=False, index=True)
    linkedin_url = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    country = Column(String(100), nullable=True)
    timezone = Column(String(100), nullable=True)

    # Opportunity
    service_type = Column(String(100), nullable=True)
    potential_need = Column(String(255), nullable=True)
    source = Column(String(100), nullable=True)

    # Status & Priority
    status = Column(String(50), nullable=False, default="NEW", index=True)
    priority = Column(String(50), nullable=False, default="MEDIUM", index=True)

    # Dates (Stored as YYYY-MM-DD strings for clean SQLite queries)
    first_contact_date = Column(String(20), nullable=True)
    last_contact_date = Column(String(20), nullable=True)
    next_follow_up_date = Column(String(20), nullable=True, index=True)

    # Commercial
    proposal_amount = Column(Float, nullable=True)
    currency = Column(String(10), nullable=False, default="USD")

    # Demo
    demo_sent = Column(Boolean, nullable=False, default=False)
    demo_type = Column(String(100), nullable=True)

    # Notes
    notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
