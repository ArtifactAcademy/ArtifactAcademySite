# Artifact Academy architecture

## Milestone 0

The application is a client-rendered Vite SPA. React Router owns URL state, local components own presentational state, and typed fixtures in `src/lib/mock-data.ts` provide all course and student content.

```text
src/
  components/
    ui/        reusable primitives with shadcn-compatible APIs
    academy/   learning-domain components
    layout/    shell and responsive navigation
  pages/       route-level composition only
  styles/      semantic tokens and global behavior
  lib/         types, fixtures, and shared utilities
docs/          design-system and architecture decisions
public/        static assets and Cloudflare SPA fallback
```

## Routes

- `/` redirects to `/dashboard`
- `/dashboard` is the approved student dashboard
- `/components` is the development gallery
- `/courses` lists the typed mock course catalog
- `/courses/ai-creator-bootcamp` is the AI Creator Bootcamp overview
- `/courses/ai-creator-bootcamp/lessons/:lessonId` is the guarded lesson player; locked mock lessons render a locked state instead of player content
- `/artifacts`, `/portfolio`, `/certificate`, and `/community` are intentional future-facing placeholder routes
- unmatched routes render an in-shell 404

## Dependency boundaries

- Pages compose components but do not define one-off token systems or duplicate approved component markup.
- UI components do not import page or fixture modules.
- Academy components accept typed props and do not know about routing or backend services.
- Layout components may use React Router for navigation and Base UI for accessible interaction primitives.
- No network client, authentication state, payment SDK, or persistence layer exists in Milestone 0.
- Lesson completion demonstration state is local and in-memory. It intentionally resets on refresh.

## Future integration seams

Supabase, Stripe, and Cloudflare bindings should be introduced behind dedicated service modules in later milestones. Typed API models should be mapped into the existing component props rather than allowing backend response shapes to leak into page markup.

Secrets must remain server-side. Never prefix secrets with `VITE_`; Vite-exposed variables are public by definition. Placeholder values in `.env.example` are documentation only.

## Deployment

Cloudflare Pages configuration:

- Build command: `npm run build`
- Output directory: `dist`
- SPA fallback: `public/_redirects` → `/* /index.html 200`
