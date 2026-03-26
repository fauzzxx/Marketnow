# SaaS Login App

Production-ready Next.js 14 application with Supabase authentication, protected routes, and a modern SaaS-style UI.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS
- **Backend / Auth / DB:** Supabase
- **Session:** Supabase SSR with cookie-based auth

## Features

- Email + password sign up and login
- Logout with persistent session handling
- Auth state listener and protected routes via middleware
- Error handling (invalid credentials, weak password, etc.)
- Loading states and toast notifications
- Dark/light/system theme toggle
- User avatar placeholder from email
- Fully responsive, modern UI

## Project Structure

```
/app
  layout.tsx          # Root layout (Header, Toast)
  page.tsx            # Landing page
  globals.css
  /login
    page.tsx
  /signup
    page.tsx
  /dashboard          # Protected
    layout.tsx        # Server-side auth check
    page.tsx
    DashboardClient.tsx
/components
  ui/                 # Button, Input, Toast
  layout/             # Header, ThemeToggle
  auth/               # AuthCard, LoginForm, SignupForm
/hooks
  useUser.ts          # Client-side auth state
/lib
  supabase/
    client.ts         # Browser client
    server.ts         # Server client
    middleware.ts     # Session refresh + route logic
/utils
  toast.ts, theme.ts, avatar.ts
middleware.ts         # Route protection
```

## Setup

### 1. Clone and install

```bash
cd login
npm install
```

### 2. Supabase configuration

1. Create a project at [Supabase](https://app.supabase.com).
2. Go to **Project Settings** → **API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. In **Authentication** → **Providers**, ensure **Email** is enabled.
4. (Optional) Under **URL Configuration**, set **Site URL** to `http://localhost:3000` for dev and your production URL later.

### 3. Environment variables

Copy the example env file and fill in your Supabase values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use **Sign up** to create an account and **Log in** to access the dashboard.

## One-command run (frontend + backend)

This project uses a **Next.js frontend** and an embedded **Python backend** located at `login/backend`.

### Required installs

- Node.js (for the frontend)
- Python 3.10+ (for the backend)

Install frontend deps (from `login/`):

```bash
npm install
```

Install backend deps (from `login/backend/`):

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create backend env file:

- Copy `login/backend/.env.example` → `login/backend/.env`
- Set `SEARCHAPI_KEY`, `GROQ_API_KEY`, `CLAUDE_API_KEY`, etc.

### Dev (one command)

From `login/`:

```bash
npm run dev:all
```

This starts:
- Next.js on `http://localhost:3000`
- Flask API on `http://127.0.0.1:5001`

### Production (one command)

On Linux servers (recommended):

1) Build Next:

```bash
npm run build
```

2) Start both:

```bash
npm run start:all
```

Backend uses **gunicorn** in production mode (Windows falls back to `python server3.py`).

## Routes

| Route       | Access        | Description                    |
|------------|----------------|--------------------------------|
| `/`        | Public         | Landing page with CTAs         |
| `/login`   | Public         | Login form                     |
| `/signup`  | Public         | Sign up form                   |
| `/dashboard` | Authenticated | Protected dashboard (redirects to `/login` if not logged in) |

## Production

- Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your hosting env.
- In Supabase **Authentication** → **URL Configuration**, set **Site URL** to your production URL and add redirect URLs if needed.
- Build: `npm run build` then `npm start`.

## Code practices

- TypeScript throughout
- Supabase SSR (`@supabase/ssr`) for server/client and middleware
- No deprecated Supabase auth methods
- Modular components and clear folder structure
- Accessible forms and toasts
