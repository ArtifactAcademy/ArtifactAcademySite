# Artifact Academy architecture

## First-cohort MVP

Artifact Academy is a client-rendered Vite SPA. React Router owns URL state, typed modules own course content, a small service boundary owns authentication and student persistence, and Supabase enforces record access.

```text
src/
  content/
    types.ts                    discriminated lesson-block and course types
    course-content.ts           flattened sequence and selectors
    ai-creator-bootcamp/        course and eight session modules
  components/
    auth/                       route-scoped session provider and auth context
    marketing/                  public editorial sections and waitlist form
    ui/                         reusable design-system primitives
    academy/                    learning-domain components
    layout/                     protected shell, navigator, and top bar
    learning-blocks/            typed block renderer
    labs/                       local interactive-lab implementations
  lib/
    services/                   auth and learning repository interfaces
    supabase/                   production client, auth, and record mapping
    testing/                    build-time-only UI test adapter
  pages/                        route-level composition and access states
supabase/
  migrations/                   schema, functions, grants, and RLS policies
  functions/join-waitlist/      server-only early-interest signup boundary
  tests/database/               pgTAP authorization tests
  seed.sql                      non-content local seed entrypoint
```

## Routes and access

- `/` is the public product entry.
- `/login` sends email magic links and handles the PKCE callback.
- `/privacy` and `/terms` hold clearly marked starter legal notices for the marketing site.
- `/learn` and `/learn/:lessonId` require an authenticated user and an active course enrollment.
- Authenticated users without active enrollment see access pending.
- `/components` is registered only when `import.meta.env.DEV` is true.
- Removed or unmatched product routes render a 404.

There are no production routes for dashboards, catalogs, artifact management, portfolios, certificates, community, instructor review, notifications, search, calendars, CMS, payments, or administration.

## Dependency boundaries

- Course content lives only in `src/content/ai-creator-bootcamp`; it contains no student-specific state.
- Pages and components depend on mapped application types, never raw Supabase response shapes.
- Components do not call Supabase directly. `LearningRepository` owns progress and submission persistence; `AuthService` owns session actions; `WaitlistService` owns the public Edge Function request.
- Public routes initialize only the configuration-safe waitlist adapter. Authentication, the Supabase client, and the learning repository load only inside the `/login` and protected-learning route boundary, so `/`, `/privacy`, and `/terms` remain renderable without Supabase environment variables.
- The production adapter is selected by normal builds. The in-memory UI test adapter is selected only by `vite build --mode test` and is split out of production output.
- UI components remain unaware of database tables and RLS policy details.
- Course content is TypeScript data, not a CMS and not a database-backed curriculum.

## Authentication and enrollment

The browser uses only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. The Supabase client uses PKCE magic-link authentication, persists the session, and explicitly exchanges callback codes on `/login`.

An `auth.users` trigger creates every profile with the `student` role. Registration metadata is never trusted for role assignment. Students can update only their own `full_name`; authenticated clients cannot update `role` or write enrollments.

The learning shell follows this sequence:

1. restore or receive the authenticated user;
2. load the mapped profile and enrollment;
3. show access pending unless enrollment is active;
4. load progress and submissions through the repository;
5. derive completed, current, and locked course states from persisted completion IDs.

## Persistence and authorization

The public schema contains only the required tables:

- `profiles`
- `enrollments`
- `lesson_progress`
- `submissions`
- `interest_signups`

Every table has RLS enabled. Table grants, RLS policies, trusted helper functions, and a submission-protection trigger work together:

- students see only their own records;
- progress and submission access requires active enrollment;
- students cannot enroll themselves or assign roles;
- new submissions must start as `submitted`;
- only `needs_revision` submissions can be resubmitted by students;
- students cannot write feedback, review timestamps, or approval state;
- instructor access depends on a database-controlled profile role, never registration metadata.
- anonymous and authenticated browser roles have no direct access to early-interest records; the Edge Function has insert-only access and treats duplicate emails as successful submissions.

Lab and lesson completion functions perform narrow atomic writes under the caller’s permissions. No service-role or secret key is present in the client.

## Content engine and learning sequence

`LearningContentBlock` supports paragraph, heading, video, objectives, prompt, resource, instructor note, comprehension check, interactive lab, and artifact assignment blocks. `LearningContent` is the production renderer that switches on block type.

Every `LearningSession` is a tuple of two lessons and one artifact assignment. `LearningCourse.sessions` is a fixed eight-session tuple.

Completed item IDs determine sequence state:

1. completed IDs are `completed`;
2. the first incomplete item is `current`;
3. later items are `locked`.

Required lab block IDs gate lesson completion. Artifact completion additionally requires an `approved` submission. Submission UI supports only `submitted`, `needs-revision`, and `approved`.

The Context Window Packing Lab keeps selection, drag, touch, keyboard, capacity, reset, and answer-check behavior local. A correct answer emits `onComplete`; the repository then persists only the block ID.

## Deployment and testing

Production uses Cloudflare Pages with `npm run build`, `dist`, and the SPA fallback in `public/_redirects`. The Supabase project must allow the production `/login` redirect URL.

Playwright covers auth access states, record loading, persistence across refresh, submission lifecycle, account isolation, keyboard operation, responsive layout, console errors, and overflow. pgTAP runs against local Supabase to verify grants and RLS independently of the UI adapter.
