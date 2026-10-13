# Nadir  — Personal Portfolio Website
### Theme: "The Living Signal"

> Naturally futuristic: bioluminescent, organic, calm. A deep-sea and night-forest network where signals travel between nodes like mycelium.

This repository is a production-ready personal portfolio built for **Nadir ** (Software Engineering student), designed with inspiration from [Paragon Productions](https://www.paragonproductions.co/).

---

## Architecture & Tech Stack

```
/
├── content/                    # Typed JSON content (editable without touching components)
│   ├── profile.json            # Name, handle, bio, hero copy, interest tags
│   ├── what-i-do.json          # Build, Test, Integrate panels
│   ├── projects.json           # 4 project nodes with architecture details
│   ├── principles.json         # Three-column values triptych
│   ├── skills.json             # Constellation clusters & hidden placeholder
│   ├── education.json          # BAU degree & University of Colorado certs
│   ├── languages.json          # 4 glowing nodes with proficiency rings
│   ├── learning.json           # Sticky card-stack modules
│   └── contact.json            # Closing CTA and contact form copy
├── web/                        # Next.js 14/15 App Router Frontend
│   ├── src/
│   │   ├── app/                # App Router pages and layouts
│   │   │   ├── layout.tsx      # Space Grotesk, Inter, JetBrains Mono, SEO & OG
│   │   │   ├── page.tsx        # Complete single-page portfolio
│   │   │   └── projects/[slug] # Dedicated project architecture detail pages
│   │   ├── components/
│   │   │   ├── canvas/         # Living Signal Canvas 2D engine & node graph previews
│   │   │   ├── nav/            # Header, live API heartbeat dot, marquee ticker
│   │   │   ├── hero/           # Hero with Read Me / Move Me state toggle
│   │   │   ├── what-i-do/      # Stacked panels (Build, Test, Integrate)
│   │   │   ├── projects/       # 4 node cards with animated hover previews
│   │   │   ├── principles/     # Values triptych
│   │   │   ├── skills/         # Constellation clusters (no progress bars)
│   │   │   ├── education/      # BAU degree & Colorado certification IDs
│   │   │   ├── languages/      # 4 glowing SVG proficiency rings
│   │   │   ├── learning/       # Sticky card-stack section
│   │   │   └── contact/        # Closing CTA + POST /contact validated form
│   │   ├── hooks/              # useApiHealth (30s polling + offline fallback)
│   │   └── lib/                # Typed JSON content loaders
├── api-service/                # FastAPI Backend Microservice
│   ├── main.py                 # GET /health (latency, uptime) & POST /contact
│   ├── schemas.py              # Pydantic models with validation
│   ├── tests/                  # Pytest test suite (100% test pass rate)
│   ├── requirements.txt        # Backend dependencies
│   └── Dockerfile              # Production container build
└── .github/workflows/          # CI Pipeline (lint, typecheck, build, pytest)
```

---

## Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v20 or higher
- **Python**: v3.11 or higher
- **npm** or **pnpm**

### 2. Start the Backend API Service
```bash
cd api-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run the test suite
pytest tests/test_api.py -v

# Start the FastAPI server (runs on http://localhost:8000)
uvicorn main:app --reload --port 8000
```

### 3. Start the Web Frontend
```bash
cd web
npm install

# Start the Next.js development server (runs on http://localhost:3000)
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser. The live heartbeat in the navigation bar will show `LIVE // <latency>ms`.

---

## API Endpoints

### `GET /health`
Returns live system health, uptime, and latency. Polled automatically by the frontend every 30s.
```json
{
  "status": "healthy",
  "uptime": 142.3,
  "latency_ms": 0.42,
  "timestamp": "2026-10-13T19:00:00.000000+00:00"
}
```

### `POST /contact`
Validates name, email, and message. Implements in-memory rate limiting (max 5 requests / 60 seconds per IP).
```json
// Request Body
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "We would love to discuss a backend engineering internship with our team."
}

// Response
{
  "success": true,
  "message": "Signal transmitted successfully. Thank you for reaching out!",
  "timestamp": "2026-10-13T19:00:01.000000+00:00"
}
```

---

## Deployment Guide

### Deploying the Frontend (Vercel)
1. Push this repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/new), import your repository.
3. Configure the Project Settings:
   - **Root Directory**: `web`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Add the Environment Variable:
   - `NEXT_PUBLIC_API_URL`: URL of your deployed backend (e.g. `https://api-service.onrender.com`).
5. Click **Deploy**.

### Deploying the Backend API (Render or Fly.io)

#### Option A: Render
1. In the [Render Dashboard](https://dashboard.render.com/), create a new **Web Service**.
2. Connect your repository.
3. Configure:
   - **Root Directory**: `api-service`
   - **Environment**: Docker (uses `api-service/Dockerfile`) or Python
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Environment Variables:
   - `RESEND_API_KEY`: Your Resend API key (optional; if omitted, runs in mock logging mode).
   - `CONTACT_DESTINATION_EMAIL`: `mohn4560@gmail.com`.
5. Health Check Path: `/health`.

#### Option B: Fly.io
```bash
cd api-service
fly launch
fly secrets set RESEND_API_KEY=re_your_api_key_here
fly deploy
```

---

## [TODO] Checklist for Owner (Nadir)

The following items are marked with `[TODO]` and ready for you to fill in:

1. **Education Graduation Date**: In `content/education.json`, update `expectedGraduation` (e.g., `"June 2026"`) and change `"showGraduationDate": true` to display it on the site.
2. **Time Announcer Details**: In `content/projects.json`, add language, platform, and audio features for the Time Announcer project under `details`.
3. **Hidden Skills Placeholder**: In `content/skills.json`, fill in your databases, testing frameworks, Docker, CI/CD, and AI libraries under `_todo_placeholder` and set `"show_todo_placeholder": true` when ready.
4. **CV Document**: Replace the placeholder at `web/public/cv.pdf` with your actual exported PDF resume.
5. **Resend API Key**: To receive contact form submissions directly in your inbox, generate a free API key at [resend.com](https://resend.com) and set `RESEND_API_KEY` on your deployed backend.
