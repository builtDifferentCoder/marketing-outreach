# Outreach CRM

A sleek, lightweight, internal Outreach CRM designed specifically for managing cold outreach to agencies and prospective clients, tracking touchpoints, scheduling follow-ups, and managing client acquisition pipelines.

---

## Tech Stack & Architecture

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: FastAPI (Python), SQLAlchemy ORM.
- **Database**: SQLite (local / persistent disk) or PostgreSQL (via `DATABASE_URL`).
- **Deployment**: Render (Backend) + Vercel (Frontend).

```
marketing-campaign/
├── backend/
│   ├── database.py       # DB connection (SQLite / Postgres auto-switch)
│   ├── models.py         # SQLAlchemy Prospect model
│   ├── schemas.py        # Pydantic schemas and validation
│   ├── crud.py           # DB query helpers, filtering, sorting, stats
│   ├── main.py           # FastAPI application and routes (CORS for Vercel)
│   ├── seed.py           # Optional demo seed script
│   ├── test_api.py       # API integration tests
│   └── requirements.txt  # Python backend dependencies
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js App Router (page.tsx, layout.tsx, prospects/)
│   │   ├── components/   # UI components (Table, Modal, Stats, Badges, Toast)
│   │   └── lib/          # API client and TypeScript definitions
│   ├── package.json
│   └── tailwind.config.ts
├── render.yaml           # Render deployment configuration
└── README.md
```

---

## Local Development

### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
- API: **`http://127.0.0.1:8000`**
- Docs: **`http://127.0.0.1:8000/docs`**

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
- Web App: **`http://localhost:3000`**

---

## Deployment Guide: Render (Backend) & Vercel (Frontend)

### Step 1: Push to GitHub
```bash
git push -u origin main
```

---

### Step 2: Deploy Backend to Render

1. Log in to [Render.com](https://render.com).
2. Click **New +** → **Web Service**.
3. Connect your repository: **`builtDifferentCoder/marketing-outreach`**.
4. Configure the Web Service settings:
   - **Name**: `marketing-outreach-backend` (or your choice)
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free
5. *(Optional - Persistent Database)*:
   - By default, it uses SQLite (`outreach_crm.db`).
   - If you want a persistent PostgreSQL database:
     - Click **New +** → **PostgreSQL** on Render (Free tier).
     - Copy the **Internal Database URL** and add it under your Web Service's **Environment Variables** as `DATABASE_URL`.
6. Click **Deploy Web Service**.
7. Once deployed, copy your backend URL (e.g., `https://marketing-outreach-backend.onrender.com`).

---

### Step 3: Deploy Frontend to Vercel

1. Log in to [Vercel.com](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import your repository: **`builtDifferentCoder/marketing-outreach`**.
4. In the project setup:
   - **Framework Preset**: Next.js
   - **Root Directory**: Click *Edit* and select **`frontend`**
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
5. Expand **Environment Variables** and add:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-backend-name.onrender.com` (your Render URL from Step 2)
6. Click **Deploy**.
7. Vercel will build and deploy your app, giving you a URL like `https://marketing-outreach.vercel.app`.

---

### Step 4: Final Verification

1. Open your Vercel URL in your browser.
2. The dashboard will load with live statistics and empty state.
3. Click **"+ Add Prospect"**, add a prospect, and verify it appears immediately on your dashboard.
4. Test quick actions, status transitions, follow-up scheduling, and modals.
