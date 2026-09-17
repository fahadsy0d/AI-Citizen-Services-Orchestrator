# AI Citizen Services Orchestrator

An AI orchestration layer that turns a citizen's plain-language need into a
guided, unified journey across government employment and business support
schemes — instead of forcing them to search scheme-by-scheme.

- **Backend:** FastAPI + LangGraph (Python), with an Ollama-backed intent
  classifier (and a keyword-based fallback if Ollama isn't running).
- **Frontend:** React 19 + Vite + Tailwind CSS v4 (Figma Make export).

This README covers exactly what you need to run both halves together for a
live demo.

---

## 0. One-time setup

### Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
```

### Ollama (optional but recommended for the demo)

The intent-detection node calls a local Ollama model (`llama3.2`). If Ollama
isn't installed or the model isn't pulled, the backend **automatically falls
back to keyword matching** — nothing crashes — but responses will look less
"AI-driven" to anyone watching closely.

```bash
# Install Ollama first: https://ollama.com/download
ollama pull llama3.2
ollama serve   # usually starts automatically after install
```

### Frontend

```bash
cd frontend
npm install
```

> The project ships with `node_modules` pre-installed for Windows
> (win32-x64-msvc native bindings for Vite's bundler). If you ever run this
> on macOS or Linux, delete `node_modules` and run `npm install` fresh first
> — the Windows-only native binaries won't load on another OS.

---

## 1. Run it (every time)

**Terminal 1 — backend** (from `backend/`):

```bash
uvicorn main:app --reload --port 8000
```

Confirm it's up:

```bash
curl http://localhost:8000/api/services
```

**Terminal 2 — frontend** (from `frontend/`):

```bash
npm run dev
```

Vite will print a local URL (default port `8443`, configurable via `PORT`).
Open it in your browser.

**Terminal 3 — Ollama** (if using it):

```bash
ollama serve
```

---

## 2. Demo flow to walk through

1. **Home → AI Assistant** — type a need (e.g. *"I need employment
   support"* or *"I want to apply for the business grant"*). This calls
   `POST /api/analyze`, which runs the LangGraph workflow: intent detection →
   service discovery → document-readiness check → pauses at a consent
   checkpoint.
2. **Services** — pulls live scheme data from `GET /api/services`
   (backed by the SQLite `schemes` table, seeded on backend startup).
3. **Documents** — reads live readiness/missing-document state from
   `GET /api/state?thread_id=...` for the current session.
4. **Application → consent modal** — confirming consent calls
   `POST /api/consent`, which resumes the paused LangGraph run past the
   interrupt and returns the final agent response.

Each browser tab/session gets its own random `thread_id` (generated once in
`App.tsx`), so LangGraph's checkpointer keeps each demo run isolated.

---

## 3. API reference

| Method | Path | Body / Query | Purpose |
|---|---|---|---|
| `POST` | `/api/analyze` | `{ query, thread_id }` | Classify intent, discover matching schemes, check documents; pauses before consent. |
| `POST` | `/api/consent` | `{ user_consent, thread_id }` | Resume the paused workflow with the citizen's consent decision. |
| `GET` | `/api/state?thread_id=...` | — | Current readiness %, missing documents, consent flag for a session. |
| `GET` | `/api/services?category=...` | optional `category` | List schemes from the catalog, optionally filtered. |

---

## 4. Known limitations (by design, for the prototype)

- The Employment/Business categories and the three seeded schemes are mock
  data (`backend/database.py`) — there's no real government API integration.
- Document upload/OCR on the **Documents** screen and the final submission
  on the **Application** screen are simulated in the frontend; no files are
  actually uploaded or sent anywhere.
- Eligibility, Journey, Tracking, Profile, Grievances, and Admin screens are
  frontend-only mockups (static/mock data) — they are not wired to the
  backend, since the backend only models the intent → services → documents →
  consent → application path.
