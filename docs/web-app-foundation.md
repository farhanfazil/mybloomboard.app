# Bloomboard Web App Foundation

This project now keeps the marketing website and authenticated app in the same Next.js codebase.

## Routes

- `mybloomboard.app` serves the public marketing site.
- `app.mybloomboard.app` is rewritten by `src/middleware.ts` into the `/app` route group.
- Local preview:
  - Marketing: `http://localhost:3000`
  - Web app: `http://localhost:3000/app`
  - Sign in: `http://localhost:3000/app/sign-in`

## Required Services

- Supabase Auth: email magic link plus Google provider.
- Supabase Postgres: run the migrations in order:
  - `supabase/migrations/001_web_app_foundation.sql`
  - `supabase/migrations/002_phase_two_collaboration.sql`
  - `supabase/migrations/003_workspace_bootstrap_and_reminders.sql`
- Cloudflare R2: connect signed upload URL generation in `src/app/api/storage/create-upload/route.ts`.
- Polar: point sandbox webhooks to `https://app.mybloomboard.app/api/polar/webhook`.
- AI provider: connect server-side generation in `src/app/api/ai/generate/route.ts`.

## Environment

Copy `.env.example` to `.env.local` and fill the Supabase, Polar, R2, and AI keys.

The app intentionally returns setup-friendly responses when secrets are missing, so
the site still builds during development. Without Supabase credentials, the workspace
runs in local preview mode. After sign-in, Tasks, Boards, and Reminders switch to the
user's Supabase workspace and display a visible cloud sync status in the app header.

## Sync Contract

Every synced table uses:

- `id`
- `workspace_id`
- `created_at`
- `updated_at`
- `deleted_at`
- `last_updated_by`
- `sync_version`

The v1 conflict rule is implemented in `src/lib/webapp/sync.ts`: newest `updated_at` wins.

## Next Build Phases

1. Connect Team, Chat, and Freelance screens to their Supabase tables.
2. Connect Polar webhooks to update `subscriptions` and `entitlements`.
3. Add R2 signed uploads for attachments, voice messages, board images, PDFs, avatars, and freelance assets.
4. Connect the real AI provider and enforce usage entitlements.
5. Add desktop sync adapters after the cloud schema is stable.
