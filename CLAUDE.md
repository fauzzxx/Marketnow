# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Market Now** — AI-powered SEO & GEO Intelligence Platform. Next.js 14 frontend with Supabase auth, Python Flask backend providing 30+ API endpoints for SEO analysis, content generation, social media automation, and bulk email.

## Commands

```bash
# Development (starts Next.js on :3000 + Flask on :5001)
npm run dev:all

# Frontend only
npm run dev

# Build
npm run build

# Production (gunicorn on Linux, python fallback on Windows)
npm run start:all

# Lint
npm run lint

# Backend setup (one-time)
cd backend && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt
```

## Architecture

### Frontend (Next.js 14 App Router + TypeScript + Tailwind)

- **Auth flow**: Supabase SSR with cookie-based sessions. `middleware.ts` at root calls `updateSession()` from `lib/supabase/middleware.ts` to refresh sessions and protect `/dashboard` routes (redirects to `/login`). Already-authenticated users on `/login` or `/signup` get redirected to `/dashboard`.
- **Three Supabase clients**: `lib/supabase/client.ts` (browser), `lib/supabase/server.ts` (server components), `lib/supabase/middleware.ts` (middleware). Use the appropriate one based on context.
- **Dashboard**: `app/dashboard/layout.tsx` does server-side auth check. `app/dashboard/page.tsx` passes user to `DashboardClient.tsx`, which renders a sidebar with 10 tool tabs. Each tab is a self-contained component in `components/toolkit/` managing its own state, API calls, loading, and error handling.
- **API client**: `lib/api.ts` — typed wrapper around all Flask backend endpoints. Default 5-minute timeout; some endpoints have custom longer timeouts. Base URL defaults to `http://127.0.0.1:5001`.
- **Theme system**: `utils/theme.ts` manages light/dark/system via localStorage + `dark` class on `<html>`. Tailwind dark mode is class-based.
- **Toast system**: `utils/toast.ts` is a pub-sub notification pattern (subscribe/unsubscribe), rendered by `components/ui/Toast.tsx` in root layout.
- **Path alias**: `@/*` maps to project root (tsconfig).

### Backend (Flask — `backend/server3.py`)

- Single ~60KB Flask file with all endpoints
- External APIs: SearchApi.io (SERP), Claude (Anthropic), Groq (YT scripts), Google Gemini (chatbot), Google Maps
- Selenium WebDriver for LinkedIn automation (login + posting)
- SMTP for bulk email sending
- `USE_MOCK_FALLBACK=true` env var enables mock data when APIs fail
- Environment variables in `backend/.env` (copy from `backend/.env.example`)

### Key Patterns

- **Toolkit tabs** (`components/toolkit/*Tab.tsx`): Each tab follows the same pattern — form inputs, API call via `lib/api.ts`, loading spinner, results display. Add new tools by creating a new tab component and adding it to `DashboardClient.tsx` sidebar.
- **UI components** (`components/ui/`): `Button.tsx`, `Input.tsx`, `Toast.tsx` are shared primitives used across auth forms and toolkit tabs.
- **Sidebar state**: Managed by `contexts/DashboardSidebarContext.tsx`.
- **User hook**: `hooks/useUser.ts` for client-side auth state tracking.

## Environment Variables

**Frontend** (`.env.local`):
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `NEXT_PUBLIC_API_URL` — Flask backend URL (optional, defaults to `http://127.0.0.1:5001`)

**Backend** (`backend/.env`):
- `SEARCHAPI_KEY`, `GROQ_API_KEY`, `CLAUDE_API_KEY`, `GEMINI_API_KEY`, `GOOGLE_MAPS_API_KEY`
- `USE_MOCK_FALLBACK` — enable mock responses when APIs unavailable
- `USE_CHROME_LINKEDIN` — use Chrome instead of Edge for Selenium
