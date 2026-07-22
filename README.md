# Artifact Academy

Production first-cohort MVP for Artifact Academy. The application combines a cinematic marketing/waitlist site with a focused learning workspace for the eight-session AI Creator Bootcamp.

## Documentation map

Read these before substantial work:

- [Project context](docs/project-context.md) — brand, scope, current status, priorities, and non-goals
- [Architecture](docs/architecture.md) — technical boundaries and data flow
- [Production runbook](docs/production-runbook.md) — setup, deployment, verification, incidents, and recovery
- [Agent bootstrap](docs/agent-bootstrap.md) — compact machine-readable operating brief
- [Design system](docs/design-system.md) — Artifact Learning OS visual rules
- [AGENTS.md](AGENTS.md) and [CLAUDE.md](CLAUDE.md) — coding-agent constraints

## Stack

- Vite, React 19, strict TypeScript, and React Router
- Tailwind CSS v4 with semantic design tokens
- Supabase Auth and Postgres with Row Level Security
- Supabase Edge Function for waitlist insertion
- Resend SMTP for Auth email delivery
- Discriminated TypeScript lesson blocks rendered by a shared content engine
- Playwright UI coverage, Deno function tests, and pgTAP database-policy coverage
- Cloudflare static deployment from GitHub

## Local development

```bash
npm ci
npx supabase start
cp .env.example .env.local
npm run dev
```

Fill `.env.local` with the local public API URL and publishable key reported by:

```bash
npx supabase status
```

Never add a secret key or service-role key to a `VITE_` variable.

Open:

```text
http://localhost:5173
```

`/components` is available only in Vite development mode.

## Validation

With local Supabase running:

```bash
npm run lint
npm run build
npm run test:ui
npm run test:function
npm run lint:db
npm run test:db
npx supabase db reset
```

The UI test adapter is selected only by Vite test mode and is excluded from production output.

## Production routes

- `/` — marketing and waitlist landing page
- `/login` — email magic-link request and PKCE callback
- `/privacy` and `/terms` — editable starter legal notices
- `/learn` — protected redirect to the current course item
- `/learn/:lessonId` — protected lesson or inline artifact assignment
- `/components` — development-only component gallery

Authenticated users without an active `ai-creator-bootcamp` enrollment see access pending.

## Content and persistence boundaries

Course content remains in `src/content/ai-creator-bootcamp`. Each of the eight session modules exports exactly two lessons and one artifact assignment. Content modules never carry user progress, submissions, enrollment, or instructor feedback.

Supabase persists:

- profiles;
- privileged enrollments;
- lesson completion;
- completed lab block IDs;
- submissions;
- review states and feedback;
- waitlist signups.

Components use interfaces in `src/lib/services`. Raw Supabase records are mapped inside `src/lib/supabase` and do not reach pages or learning components.

## Production infrastructure

```text
Domain: https://theartifactacademy.com
Supabase project: Artifact Academy Production
Supabase ref: afqpnopdluqibdpsvxel
Region: West US (North California)
Course ID: ai-creator-bootcamp
```

Cloudflare build configuration:

```text
Build command: npm run build
Output directory: dist
SPA fallback: /* /index.html 200
```

Required build variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Apply hosted database and function changes explicitly:

```bash
npx supabase login
npx supabase link --project-ref afqpnopdluqibdpsvxel
npx supabase db push
npx supabase functions deploy join-waitlist --project-ref afqpnopdluqibdpsvxel
```

Git deployment does not automatically prove that hosted migrations or Edge Functions were applied. Follow the [production runbook](docs/production-runbook.md).

## Enrollment

Enrollment is intentionally privileged. After a student creates an account, a trusted operator must add the `(user_id, 'ai-creator-bootcamp', 'active')` enrollment through controlled SQL or a future server-only workflow. Browser clients have no enrollment write permission.

## MVP discipline

The production application intentionally has no dashboard, catalog, built-in portfolio, community, notification center, calendar, CMS, instructor portal, custom payment flow, or admin surface. Build those only after real student use proves they are needed.