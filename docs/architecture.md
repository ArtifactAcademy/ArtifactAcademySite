# Artifact Academy architecture

## First-cohort MVP

The application is a client-rendered Vite SPA. React Router owns URL state, the learning shell owns temporary completion and submission state, and typed fixtures in `src/lib/mock-data.ts` provide all course content and sample instructor feedback.

```text
src/
  components/
    ui/        reusable primitives with shadcn-compatible APIs
    academy/   learning-domain components
    layout/    learning shell, course navigator, and top bar
  pages/       route-level composition only
  styles/      semantic tokens and global behavior
  lib/         content types, fixtures, and shared utilities
docs/          design-system and architecture decisions
public/        static assets and Cloudflare SPA fallback
```

## Routes

- `/` is a temporary public product entry
- `/login` is a placeholder until authentication is implemented
- `/learn` resolves the first incomplete item and redirects to its canonical URL
- `/learn/:lessonId` renders a lesson or artifact assignment in the unified workspace
- `/components` is registered only when `import.meta.env.DEV` is true
- unmatched and removed product routes render a 404

There are no production routes for dashboards, course catalogs, artifact management, portfolios, certificates, community, instructor review, notifications, search, calendars, CMS, or administration.

## Dependency boundaries

- Pages compose components but do not define one-off token systems or duplicate approved component markup.
- UI components do not import page or fixture modules.
- Academy components accept typed props and do not know about routing or backend services.
- Layout components may use React Router for course navigation and own responsive shell state.
- Course content and sample submission feedback live in typed fixtures, separate from UI components.
- No network client, authentication state, payment SDK, or persistence layer exists in the first-cohort MVP.
- Lesson completion and artifact submission demonstration state are local and in-memory. They intentionally reset on refresh.

## Learning sequence

`learningCourse.sessions` is flattened into one ordered list. Completed IDs determine the item states:

1. items in the completion set are `completed`;
2. the first incomplete item is `current`;
3. every later item is `locked`.

This gives direct lesson routes, previous/next controls, the course navigator, and the `/learn` redirect one source of truth. Artifact review status is separate and uses only `submitted`, `needs-revision`, or `approved`.

## Future integration seams

Supabase, authentication, and Cloudflare bindings should be introduced behind dedicated service modules in later milestones. Markdown, TypeScript content modules, or database records should map into the existing learning content types rather than leaking backend response shapes into page markup.

Secrets must remain server-side. Never prefix secrets with `VITE_`; Vite-exposed variables are public by definition. Placeholder values in `.env.example` are documentation only.

## Deployment

Cloudflare Pages configuration:

- Build command: `npm run build`
- Output directory: `dist`
- SPA fallback: `public/_redirects` → `/* /index.html 200`
