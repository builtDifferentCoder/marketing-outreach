# Outreach CRM

A sleek, lightweight, internal Outreach CRM designed specifically for managing cold outreach to agencies and prospective clients, tracking touchpoints, scheduling follow-ups, and managing client acquisition pipelines.

---

## Features

- **Dashboard**:
  - Dynamic KPI cards (*Total Prospects, New, Contacted, Follow Up, Interested, Proposals, Won*) dynamically computed from SQLite.
  - Dedicated **Follow-ups Due** section (identifying touchpoints due today or overdue).
  - Dedicated **Upcoming Follow-ups** section (tracking touchpoints scheduled within the next 7 days).
  - Search across company name, owner name, email, and website.
  - Filter by outreach status (*New, Contacted, Follow Up, Replied, Interested, Proposal Sent, Negotiating, Won, Lost*).
  - Multi-criteria sorting (*Newest, Oldest, Next Follow-up, Priority*).
  - Clean table layout with color-coded status badges, priority markers, last contact dates, next follow-up dates, and proposal values.
  - Interactive quick-action dropdowns on every prospect row.
- **Prospect Detail Modal**:
  - Clean modal grouping: *Contact Information*, *Opportunity & Fit*, *Outreach Progress*, *Commercial Proposal*, and *Notes*.
  - Direct clickable links: `mailto:` email links, and new-tab website/LinkedIn profile links.
  - In-modal quick workflow buttons (*Mark Researched, Mark Contacted, Schedule Follow-up, Mark Interested, Send Proposal, Mark Won*).
  - Delete confirmation.
- **Add / Edit Prospect**:
  - Logical 6-section form: Company, Contact, Opportunity, Outreach, Commercial, and Notes.
  - Form validation with clear feedback for required fields (*Company Name, Owner Name, Email*).
  - Redirects back to Dashboard upon save.
- **Quick Scheduling**:
  - Dedicated modal with 1-click shortcuts (*Tomorrow, In 3 Days, Next Week, In 2 Weeks*) or custom date picker.
- **Seed Data**:
  - Includes 8 realistic demo prospects covering all stages of cold outreach.

---

## Tech Stack & Architecture

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: FastAPI (Python), SQLAlchemy ORM.
- **Database**: SQLite (`outreach_crm.db`). Zero external database dependencies.

```
marketing-campaign/
├── backend/
│   ├── database.py       # SQLite connection and session maker
│   ├── models.py         # SQLAlchemy Prospect model
│   ├── schemas.py        # Pydantic schemas and validation
│   ├── crud.py           # DB query helpers, filtering, sorting, stats
│   ├── main.py           # FastAPI application and routes
│   ├── seed.py           # Demo seed script with 8 realistic prospects
│   ├── test_api.py       # API integration tests
│   └── requirements.txt  # Python backend dependencies
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js App Router (page.tsx, layout.tsx, prospects/)
│   │   ├── components/   # UI components (Table, Modal, Stats, Badges, Toast)
│   │   └── lib/          # API client and TypeScript definitions
│   ├── package.json
│   └── tailwind.config.ts
└── README.md
```

---

## 1. Requirements

- **Python**: 3.10+ (tested on Python 3.13)
- **Node.js**: 18+ (tested on Node.js v24)
- **npm**: 9+

---

## 2. Backend Setup & Run

### Step 1: Open a terminal in the `backend` folder
```bash
cd backend
```

### Step 2: Install dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Run the FastAPI server
```bash
uvicorn main:app --reload --port 8000
```
- The backend will start on: **`http://127.0.0.1:8000`**
- Interactive Swagger API docs: **`http://127.0.0.1:8000/docs`**
- SQLite database file `outreach_crm.db` and initial seed data will be automatically created on the first start!

---

## 3. Frontend Setup & Run

### Step 1: Open a new terminal in the `frontend` folder
```bash
cd frontend
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Start development server
```bash
npm run dev
```
- Open your browser at: **`http://localhost:3000`**

---

## 4. Seeding Demo Data

The database automatically seeds 8 realistic prospects if empty.

To manually re-seed or reset the demo data at any time:
```bash
cd backend
python seed.py --force
```
Alternatively, open the **Settings** tab in the web application and click **"Reset Demo Data"**.

---

## 5. API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/stats` | Aggregated counts for all status cards |
| `GET` | `/api/follow-ups/due` | Prospects with follow-ups due today or overdue |
| `GET` | `/api/follow-ups/upcoming` | Prospects with follow-ups in the next 7 days |
| `GET` | `/api/prospects` | List prospects with `search`, `status`, `priority`, `sort` |
| `GET` | `/api/prospects/{id}` | Get full details for a prospect |
| `POST` | `/api/prospects` | Create a new prospect |
| `PUT` | `/api/prospects/{id}` | Update existing prospect |
| `DELETE` | `/api/prospects/{id}` | Delete prospect |
| `PATCH` | `/api/prospects/{id}/status` | Quick update prospect status |
| `PATCH` | `/api/prospects/{id}/follow-up` | Quick update next follow-up date |
| `POST` | `/api/seed` | Seed or reset demo data (`?force=true`) |

---

## 6. Running Integration Tests

To run the automated backend test suite:
```bash
cd backend
python test_api.py
```
Tests cover:
- Health check
- Dynamic KPI calculation
- Follow-up filtering
- Search, filter, and sorting
- Full CRUD operations
- Quick action status and follow-up patches
