# Artifact Academy architecture

This document defines the technical boundaries of the first-cohort MVP. Read `docs/project-context.md` for product scope and `docs/production-runbook.md` for deployment and operations.

## System summary

Artifact Academy is a client-rendered Vite SPA deployed as static assets on Cloudflare. React Router owns URL state, typed TypeScript modules own course content, service interfaces isolate infrastructure, Supabase Auth identifies users, PostgreSQL stores user-specific state, Row Level Security enforces authorization, and a Supabase Edge Function provides the public waitlist write boundary.

```text
Browser
  ├─ public marketing routes
  │    └─ WaitlistService
  │         └─ Supabase Edge Function: join-waitlist
  │              └─ interest_signups
  │
  └─ login and protected learning routes
       ├─ AuthService
       │    └─ Supabase Auth (PKCE magic links)
       └─ LearningRepository
            └─ Supabase Postgres + RLS
                 ├─ profiles
                 ├─ enrollments
                 ├─ lesson_progress
                 └─ submissions

Course content
  └─ versioned TypeScript modules in Git
```

## Repository structure

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
    services/                   infrastructure-neutral interfaces
    supabase/                   production client, auth, waitlist, and record mapping
    testing/                    build-time-only UI test adapter
  pages/                        route-level composition and access states
supabase/
  migrations/                   schema, functions, grants, triggers, and RLS policies
  functions/join-waitlist/      server-only early-interest signup boundary
  templates/                    versioned Auth email templates
  tests/database/               pgTAP authorization tests
  seed.sql                      non-content local seed entrypoint
docs/
  project-context.md            product scope and current status
  architecture.md               technical boundaries
  production-runbook.md         setup, deployment, verification, and recovery
  design-system.md              visual system
```

## Production topology

### Frontend

```text
Cloudflare static deployment
Domain: theartifactacademy.com
Build: npm run build
Output: dist
SPA fallback: public/_redirects
```

Cloudflare injects these public values at build time:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Because the application is statically built, changing either value requires a new build. Runtime Worker secrets are not part of the frontend architecture.

### Supabase

```text
Project: Artifact Academy Production
Reference: afqpnopdluqibdpsvxel
Region: West US (North California)
```

The project reference and URL are public identifiers. Service-role keys, database passwords, and SMTP credentials remain server/account secrets.

### Email

Supabase Auth sends magic links through custom Resend SMTP. The recommended sending identity is:

```text
Artifact Academy <login@auth.theartifactacademy.com>
```

Marketing or broadcast email is a separate concern and must not reuse Auth email flows casually.

## Routes and access

- `/` is the public marketing and waitlist page.
- `/login` requests magic links and handles the PKCE callback.
- `/privacy` and `/terms` contain editable starter legal notices.
- `/learn` and `/learn/:lessonId` require authentication and active enrollment.
- Authenticated users without active enrollment see access pending.
- `/components` is registered only when `import.meta.env.DEV` is true.
- Removed or unmatched routes render a 404.

There are no production routes for dashboards, catalogs, artifact management, portfolios, certificates, community, instructor review, notifications, search, calendars, CMS, payments, or administration.

## Initialization boundaries

Public pages must render when Supabase is missing or temporarily unavailable.

- Public marketing routes initialize only a configuration-safe waitlist adapter.
- The waitlist client validates configuration at submission time and reports inline failure.
- Supabase Auth and the learning repository load only inside `/login` and protected learning routes.
- A Supabase outage must not blank `/`, `/privacy`, or `/terms`.

This boundary prevents the public business site from depending on the availability of student infrastructure.

## Service boundaries

Components and pages depend on application interfaces, never raw Supabase response shapes.

```text
AuthService
  getSession
  subscribe
  sendMagicLink
  exchangeCallback
  signOut

LearningRepository
  loadStudentState
  completeLab
  completeLesson
  createOrReviseSubmission

WaitlistService
  join
```

Rules:

- UI components do not import the Supabase client.
- Database records are mapped inside `src/lib/supabase`.
- Infrastructure failures are translated into user-facing application errors at the boundary.
- The production adapter is selected in normal builds.
- The in-memory UI test adapter is selected only by Vite test mode and is excluded from production output.

## Authentication and enrollment

The browser uses PKCE magic-link authentication. It persists the Supabase session and explicitly exchanges callback codes on `/login`.

An `auth.users` trigger creates a `profiles` row with the `student` role. Registration metadata is never trusted for role assignment.

The protected learning shell follows this sequence:

1. restore or receive the authenticated user;
2. load mapped profile and enrollment;
3. show access pending unless enrollment is active;
4. load progress and submissions;
5. derive completed, current, and locked content state.

Enrollment is privileged. Browser clients cannot create or modify enrollment. For the first cohort, a trusted operator activates enrollment through SQL or a future server-only workflow.

## Persistence model

The public schema contains only:

- `profiles`;
- `enrollments`;
- `lesson_progress`;
- `submissions`;
- `interest_signups`.

Course content is not stored in these tables.

### profiles

Identity-adjacent application data such as `full_name` and database-controlled role.

### enrollments

Authoritative course access. The current course ID is `ai-creator-bootcamp` and status is `active` or `inactive`.

### lesson_progress

Student-specific completion state, completed lab block IDs, and timestamps.

### submissions

One submission per student/course/assignment, with student URLs and note plus controlled review state and feedback.

Supported statuses:

```text
submitted
needs_revision
approved
```

### interest_signups

Public acquisition records created only through the validated Edge Function. Direct anonymous and authenticated reads are denied.

## Authorization model

Every exposed table has RLS enabled. Grants, policies, trusted helper functions, and triggers enforce:

- students see only their own records;
- progress and submission access requires active enrollment;
- students cannot enroll themselves;
- students cannot assign or change roles;
- new submissions begin as `submitted`;
- students can revise only `needs_revision` submissions;
- students cannot write feedback, review timestamps, or approval state;
- instructor authority comes from a database-controlled profile role;
- anonymous and authenticated browser roles cannot read waitlist records;
- the Edge Function performs validated insert-only waitlist writes and treats duplicates as success.

No service-role key or secret exists in client code.

## Waitlist boundary

```text
WaitlistForm
→ WaitlistService
→ POST /functions/v1/join-waitlist
→ input validation and CORS
→ service-role insert
→ interest_signups
```

The function:

- accepts POST and OPTIONS only;
- allows exact production and local origins;
- validates and normalizes email;
- limits accepted fields and lengths;
- supports a honeypot;
- captures source and UTM values;
- returns generic results;
- treats unique-email conflicts as success;
- does not expose database details.

The browser receives no service-role credential.

## Content engine

Course content lives in `src/content/ai-creator-bootcamp` and contains no student-specific state.

`LearningContentBlock` supports:

- paragraph;
- heading;
- video;
- objectives;
- prompt;
- resource;
- instructor note;
- comprehension check;
- interactive lab;
- artifact assignment.

Every session is a fixed tuple of two lessons and one artifact assignment. The course is a fixed eight-session tuple.

Completed item IDs determine sequence state:

1. persisted completed IDs are `completed`;
2. the first incomplete item is `current`;
3. later items are `locked`.

Required lab IDs gate lesson completion. Artifact completion additionally requires an `approved` submission.

## Interactive labs

Labs use deterministic local interaction and persist only a completion identifier after success.

The Context Window Packing Lab supports:

- native drag and drop;
- touch controls;
- keyboard/button alternatives;
- capacity limits;
- reset and answer checking;
- explanatory feedback;
- an `onComplete` event.

Live model calls are intentionally absent. They would introduce cost, inconsistency, prompt-injection risk, and nondeterministic teaching outcomes.

## Email architecture

### Authentication email

Supabase Auth uses custom Resend SMTP for magic links, invitations, and confirmations. Templates are versioned under `supabase/templates`.

### Waitlist and marketing email

The waitlist currently stores consented addresses only. It does not send automatic confirmation or broadcast email. Future marketing delivery must include unsubscribe handling and remain separate from Auth email.

## Deployment flow

```text
feature branch
→ validation
→ pull request
→ human review and merge to main
→ Cloudflare build and deploy
```

Database and function deployment are explicit:

```text
npx supabase link --project-ref afqpnopdluqibdpsvxel
npx supabase db push
npx supabase functions deploy join-waitlist --project-ref afqpnopdluqibdpsvxel
```

Git merges do not automatically guarantee hosted database/function deployment unless CI is deliberately added later.

## Testing strategy

### UI

Playwright covers:

- public routes without Supabase configuration;
- waitlist states;
- authentication access states;
- enrollment gating;
- record loading;
- lab and lesson persistence;
- submission lifecycle;
- account isolation;
- keyboard operation;
- responsive layouts;
- console errors and overflow.

### Edge Function

Deno tests cover input validation, origin checks, duplicate behavior, and server failure handling.

### Database

pgTAP verifies grants and RLS independently of the UI adapter. `npx supabase db reset` verifies clean migration replay.

Required validation is documented in `docs/production-runbook.md`.

## Failure containment

- Supabase configuration failure must not blank public routes.
- Waitlist failure stays inside the form.
- Auth failure stays inside login/protected boundaries.
- Database authorization is enforced server-side even if frontend route guards fail.
- Course content remains available in the repository independently of database availability.
- Production schema changes are forward migrations, not dashboard-only edits.

## Evolution rules

The next architectural capability should be added only when real use requires it.

Likely future boundaries, in order of evidence rather than ambition:

1. a controlled enrollment function when manual SQL becomes risky;
2. Stripe Payment Link reconciliation when paid enrollment volume justifies it;
3. a minimal instructor review surface when Table Editor becomes a bottleneck;
4. automated certificate issuance after manual certificates are being issued regularly;
5. protected video delivery only after link sharing is observed;
6. additional interactive labs after Session 1 learning effectiveness is validated.

Do not add a general CMS, dashboard, or multi-course abstraction preemptively.