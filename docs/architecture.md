# Artifact Academy architecture

## First-cohort MVP

The application is a client-rendered Vite SPA. React Router owns URL state, the learning shell owns temporary completion, lab, and submission state, and typed modules in `src/content` provide course content and sample instructor feedback.

```text
src/
  content/
    types.ts             discriminated lesson-block and course types
    course-content.ts    flattened sequence and selectors
    ai-creator-bootcamp/ course and eight session modules
  components/
    ui/        reusable primitives with shadcn-compatible APIs
    academy/   learning-domain components
    layout/    learning shell, course navigator, and top bar
    learning-blocks/ typed block renderers
    labs/      reusable interactive-lab boundary and implementations
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
- Academy, learning-block, and lab components accept typed props and do not know about routing or backend services.
- Layout components may use React Router for course navigation and own responsive shell state.
- Course content and sample submission feedback live in typed session modules, separate from UI components.
- No network client, authentication state, payment SDK, or persistence layer exists in the first-cohort MVP.
- Lesson completion, lab completion, and artifact submission demonstration state are local and in-memory. They intentionally reset on refresh.

## Content engine

`LearningContentBlock` is a discriminated union supporting paragraph, heading, video, objectives, prompt, resource, instructor note, comprehension check, interactive lab, and artifact assignment blocks. `LearningContent` is the only production renderer that switches on block type.

Every `LearningSession` contains a fixed tuple of two lessons followed by one artifact assignment. `LearningCourse.sessions` is a fixed eight-session tuple. These type boundaries prevent content modules from silently changing the cohort curriculum shape.

Interactive content uses `InteractiveLabBlock` as the reusable dispatch boundary. The Context Window Packing Lab is the first implementation. Its card data, capacity, and answer key live in Session 1 content; the component owns only deterministic interaction state and emits `onComplete`.

## Learning sequence

`learningCourse.sessions` is flattened into one ordered list. Completed IDs determine the item states:

1. items in the completion set are `completed`;
2. the first incomplete item is `current`;
3. every later item is `locked`.

This gives direct lesson routes, previous/next controls, the course navigator, and the `/learn` redirect one source of truth. Required interactive labs gate lesson completion. Artifact review status is separate and uses only `submitted`, `needs-revision`, or `approved`.

## Future integration seams

Supabase, authentication, and Cloudflare bindings should be introduced behind dedicated service modules in later milestones. Markdown or database records should map into the existing learning content types rather than leaking backend response shapes into page markup. The typed modules are a content engine, not a CMS.

Secrets must remain server-side. Never prefix secrets with `VITE_`; Vite-exposed variables are public by definition. Placeholder values in `.env.example` are documentation only.

## Deployment

Cloudflare Pages configuration:

- Build command: `npm run build`
- Output directory: `dist`
- SPA fallback: `public/_redirects` → `/* /index.html 200`
