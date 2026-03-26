# Market Now - Deployment Guide

## Architecture

- **Frontend**: Next.js 14 on **Vercel**
- **Backend**: Flask API on **Railway** (with Chrome/Selenium for LinkedIn automation)
- **Auth**: Supabase (hosted)

## Prerequisites

- GitHub account with repo: https://github.com/fauzzxx/Marketnow.git
- Vercel account (https://vercel.com) linked to GitHub
- Railway account (https://railway.app) linked to GitHub
- Supabase project (https://supabase.com)
- API keys: SearchApi.io, Groq, Anthropic (Claude), Google Gemini, Google Maps

---

## Step 1: Push to GitHub

```bash
git remote set-url origin https://github.com/fauzzxx/Marketnow.git
git add -A
git commit -m "Prepare for Vercel + Railway deployment"
git push -u origin main
```

---

## Step 2: Deploy Backend on Railway

1. Go to https://railway.app/new
2. Click **"Deploy from GitHub Repo"**
3. Select `fauzzxx/Marketnow`
4. Railway will detect the repo — click **"Add a Service"** > **"GitHub Repo"**
5. In the service settings, set **Root Directory** to `backend`
6. Railway will auto-detect the `Dockerfile` and `railway.toml`

### Set Environment Variables in Railway Dashboard

Go to your service > **Variables** tab and add:

| Variable | Value |
|---|---|
| `SEARCHAPI_KEY` | Your SearchApi.io key |
| `GROQ_API_KEY` | Your Groq API key |
| `CLAUDE_API_KEY` | Your Anthropic API key |
| `GEMINI_API_KEY` | Your Gemini API key |
| `GOOGLE_MAPS_API_KEY` | Your Google Maps key |
| `FRONTEND_URL` | `https://your-app.vercel.app` (set after Vercel deploy) |
| `USE_MOCK_FALLBACK` | `false` |
| `USE_CHROME_LINKEDIN` | `true` |

> Railway automatically sets `PORT`. Do not set it manually.

7. Click **Deploy** and wait for the build to complete
8. Copy your Railway public URL (e.g., `https://marketnow-backend-production.up.railway.app`)
9. Test it: visit `https://your-railway-url.up.railway.app/api/health`

---

## Step 3: Deploy Frontend on Vercel

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select `fauzzxx/Marketnow`
4. Vercel will auto-detect Next.js — keep defaults:
   - **Framework**: Next.js
   - **Root Directory**: `.` (project root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Set Environment Variables in Vercel Dashboard

Go to **Settings** > **Environment Variables** and add:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `NEXT_PUBLIC_API_URL` | Your Railway backend URL (e.g., `https://marketnow-backend-production.up.railway.app`) |

5. Click **Deploy**
6. Copy your Vercel URL (e.g., `https://marketnow.vercel.app`)

---

## Step 4: Connect Frontend and Backend

1. Go back to **Railway** dashboard > your backend service > **Variables**
2. Set `FRONTEND_URL` to your Vercel URL (e.g., `https://marketnow.vercel.app`)
3. Railway will auto-redeploy with the updated CORS config

---

## Step 5: Update Supabase Auth Redirect URLs

1. Go to your Supabase project > **Authentication** > **URL Configuration**
2. Add your Vercel URL to **Redirect URLs**:
   - `https://marketnow.vercel.app/**`
3. Update **Site URL** to `https://marketnow.vercel.app`

---

## Verify Deployment

1. Visit your Vercel URL — you should see the login page
2. Test backend health: `curl https://your-railway-url/api/health`
3. Log in and try a toolkit feature (e.g., Site Audit)

---

## Local Development

```bash
# Frontend + Backend together
npm run dev:all

# Frontend only (localhost:3000)
npm run dev

# Backend only (localhost:5001)
cd backend && python server3.py
```

No env changes needed for local dev — `NEXT_PUBLIC_API_URL` defaults to `http://127.0.0.1:5001`.

---

## Troubleshooting

| Issue | Fix |
|---|---|
| CORS errors in browser | Set `FRONTEND_URL` in Railway to your exact Vercel URL (no trailing slash) |
| "Cannot reach API" in frontend | Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel env vars |
| Railway build fails on Chrome | The Dockerfile installs Chrome — ensure Railway plan supports Docker builds |
| LinkedIn automation fails | Ensure `USE_CHROME_LINKEDIN=true` is set in Railway. Chrome runs headless in the container |
| Supabase auth redirect fails | Add Vercel URL to Supabase redirect URLs in dashboard |
