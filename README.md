# Artifact Academy

First-cohort MVP for the Artifact Academy student product, internally named **Artifact Learning OS**. The application is a focused learning workspace for the eight-session AI Creator Bootcamp, backed by typed course-content modules and deterministic local interactions.

## Stack

- Vite, React 19,  and strict TypeScript
- Tailwind CSS v4 through the official Vite plugin
- React Router
- shadcn-compatible local components and Base UI primitives
- Lucide icons
- Locally bundled Geist variable fonts
- Discriminated TypeScript lesson blocks rendered by a shared content engine

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The component gallery is available at `http://localhost:5173/components`.

The component gallery is registered only by the Vite development build. It is intentionally unavailable in production.

Production preview:

```bash
npm run build
npm run preview
```

## Validation

```bash
npm run lint
npm run build
npm run test:ui
```

Cloudflare Pages should use `npm run build` with `dist` as the output directory. `public/_redirects` provides the SPA fallback.

## MVP routes

- `/` — temporary public entry
- `/login` — authentication placeholder
- `/learn` — redirects to the current course item
- `/learn/:lessonId` — lesson or inline artifact assignment
- `/components` — development-only component gallery

The production application does not include dashboard, catalog, artifact-management, portfolio, certificate, community, search, notification, calendar, CMS, instructor portal, or admin routes.

## MVP boundary

This release uses mock data and in-memory interaction state only. Completion and submission changes reset when the application reloads. It does not include Supabase, authentication, database schemas, Stripe, payments, enrollment, real student data, publishing workflows, or admin features. Environment keys in `.env.example` are placeholders for future work and are not consumed by the application.

Course content lives in `src/content/ai-creator-bootcamp`. Each of the eight session modules exports exactly two lessons and one artifact assignment. The first interactive block is the accessible Context Window Packing Lab in Session 1; it runs entirely in the browser and makes no external requests.

Read [docs/design-system.md](docs/design-system.md) before UI work and [docs/architecture.md](docs/architecture.md) before introducing new application boundaries.
