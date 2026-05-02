# Ekklesia Frontend — Setup Guide

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env
# Edit .env — set VITE_API_URL to your backend URL

# 3. Run development server
npm run dev
# Opens at http://localhost:5173
```

## Build for Production (Vercel)
```bash
npm run build
# Then deploy the /dist folder to Vercel
```

## Vercel Deploy
1. Push this folder to GitHub
2. Go to vercel.com → New Project → Import repo
3. Set env variable: VITE_API_URL = your Render backend URL
4. Deploy!

## Pages
- `/` — Landing page with daily verse + hero
- `/bacaan/:category` — Reading content (7 categories)
- `/struktur` — Org structure
- `/activity` — Articles + Gallery
- `/about` — About church
- `/admin/login` — Admin login
- `/admin/dashboard` — Admin dashboard
