# Artifact Academy

First-cohort MVP for the Artifact Academy student product. The application is a focused learning workspace for the eight-session AI Creator Bootcamp, with typed course content, an accessible deterministic lab, and Supabase-backed student state.

## Stack

- Vite, React 19, strict TypeScript, and React Router
- Tailwind CSS v4 with semantic design tokens
- Supabase Auth and Postgres with Row Level Security
- Discriminated TypeScript lesson blocks rendered by a shared content engine
- Playwright UI coverage and pgTAP database policy coverage

## Local development

Install dependencies and start the local Supabase stack:

```bash
npm install
npx supabase start
```

Copy `.env.example` to `.env.local` and fill in the local public API URL and publishable key reported by `npx supabase status`. Never add a secret key or service-role key to a `VITE_` variable.

```bash
npm run dev
```

Open `http://localhost:5173`. `/components` is available only in Vite development mode and is unavailable in production builds.

## Validation

With local Supabase running:

```bash
npm run lint
npm run build
npm run test:ui
npm run lint:db
npm run test:db
```

`npm run test:ui` builds with Vite’s test mode and injects a test-only repository. The test adapter cannot be selected by a URL, query parameter, local-storage value, or production browser setting, and it is excluded from the production bundle.

All database changes live in `supabase/migrations`. Validate a clean migration replay with:

```bash
npx supabase db reset
```

## Routes

- `/` — temporary public product entry
- `/login` — email magic-link sign-in and callback handling
- `/learn` — protected redirect to the current course item
- `/learn/:lessonId` — protected lesson or inline artifact assignment
- `/components` — development-only component gallery

Authenticated users without an active `ai-creator-bootcamp` enrollment see the access-pending state. The production application has no dashboard, catalog, artifact-management, portfolio, certificate, community, search, notification, calendar, CMS, instructor portal, payment, or admin route.

## Content and persistence boundaries

Course content remains in `src/content/ai-creator-bootcamp`. Each of the eight session modules exports exactly two lessons and one artifact assignment. Content modules never carry user progress, submissions, or instructor feedback.

Supabase persists profiles, privileged enrollments, lesson completion, completed lab block IDs, submissions, review states, and instructor feedback. The Context Window Packing Lab remains deterministic and local during interaction; only its completed block ID is persisted after a correct answer.

Components use the interfaces in `src/lib/services`. Raw Supabase records are mapped inside `src/lib/supabase` and do not reach pages or learning components.

## Deployment

Cloudflare Pages configuration:

- Build command: `npm run build`
- Output directory: `dist`
- SPA fallback: `public/_redirects` → `/* /index.html 200`
- Public environment variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`

Apply database migrations with the Supabase CLI rather than creating tables manually:

```bash
npx supabase link --project-ref your-project-ref
npx supabase db push
```

In Supabase Auth URL Configuration, set the production site URL and allow the production `/login` callback URL. Configure a production SMTP provider before cohort launch so magic-link email delivery is reliable.

Enrollment is intentionally privileged. After a student creates an account, a trusted operator must add the `(user_id, 'ai-creator-bootcamp', 'active')` enrollment through a controlled SQL or server-side workflow. The browser has no enrollment write permission.

Read [docs/design-system.md](docs/design-system.md) before UI work and [docs/architecture.md](docs/architecture.md) before changing application boundaries.
