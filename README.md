# Class Portfolio Platform

A lightweight Next.js class gallery built from `Spec.md`. The app includes:

- a homepage gallery
- an upload flow with validation and loading states
- a responsive project detail page
- five distinct frontend variants on the same data/backend layer
- a Supabase-ready backend plus a local file fallback for development

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Variant routes

- `/` uses the default variant
- `/variants` shows all five variants
- add `?variant=folio`, `?variant=ledger`, `?variant=gallery`, `?variant=studio`, or `?variant=screen`

## Supabase setup

1. Copy `.env.example` to `.env.local`
2. Add your Supabase URL and publishable key
3. Create the `projects` table and storage bucket using the SQL migration in `supabase/migrations`
4. Keep the bucket public for reads and allow inserts from the public role if you want open uploads

Without Supabase credentials, the app falls back to the local `data/projects.json` store so the UI remains usable during development.
