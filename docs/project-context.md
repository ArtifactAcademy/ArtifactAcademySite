# Artifact Academy project context

This document is the human-readable source of truth for product scope, current status, and near-term priorities. Agents should read it before proposing architecture or product changes.

## Identity

- Brand: **Artifact Academy**
- Platform/design system: **Artifact Learning OS**
- Primary domain: `https://theartifactacademy.com`
- Flagship program: **AI Creator Bootcamp**
- Positioning: **Build with AI. Leave with proof.**

Artifact Academy teaches practical AI workflows through focused lessons, interactive exercises, real artifacts, instructor feedback, and portfolio-ready output. It is not intended to become a broad LMS before the first cohort validates the core learning loop.

## Audience

Initial audience:

- beginners;
- teenagers and young adults, approximately 15+;
- creators and professionals learning practical AI workflows;
- parents evaluating a structured program for a student.

The product should feel technically credible, calm, focused, premium, and beginner-friendly.

## Current product promise

AI Creator Bootcamp is planned as:

- eight instructor-led sessions;
- approximately sixty minutes per session;
- two lessons and one artifact assignment per session;
- interactive learning blocks where interaction improves understanding;
- direct instructor feedback;
- a published portfolio and Certificate of Completion.

A Certificate of Completion is not an accredited degree, professional license, or independent certification.

## Product principle

The MVP is a course storefront plus one focused learning workspace.

The essential student loop is:

```text
Discover program
→ join waitlist or enroll
→ sign in
→ open current lesson
→ complete lesson and required lab
→ submit artifact
→ receive feedback
→ continue
```

Do not add a dashboard merely because common LMS products have one. The student should arrive directly at the current lesson.

## Current production status

As of July 2026:

- the marketing landing page is live on `theartifactacademy.com`;
- the waitlist form successfully inserts into Supabase through the `join-waitlist` Edge Function;
- Supabase magic-link authentication works through custom Resend SMTP;
- production Auth URL configuration is correct;
- authenticated but unenrolled users see access pending;
- manually enrolled students can access the learning workspace;
- lesson progress, lab completion, submissions, review states, and feedback persist across refresh and devices;
- the first interactive Context Window Packing Lab works with mouse, touch, and keyboard controls;
- database migrations, RLS tests, Edge Function tests, and Playwright UI tests pass;
- Cloudflare deploys the Vite application from GitHub.

Production Supabase project:

```text
Name: Artifact Academy Production
Reference: afqpnopdluqibdpsvxel
Region: West US (North California)
Public URL: https://afqpnopdluqibdpsvxel.supabase.co
```

The project reference and public URL are not secrets. Publishable keys are public browser configuration but should still be copied from the dashboard rather than written into documentation.

## Current routes

Production:

- `/` — public marketing and waitlist landing page;
- `/login` — magic-link request and PKCE callback;
- `/privacy` — editable starter privacy notice;
- `/terms` — editable starter terms notice;
- `/learn` — protected redirect to the student’s current item;
- `/learn/:lessonId` — protected lesson or inline artifact assignment.

Development only:

- `/components` — component gallery, available only in Vite development mode.

## Current data model

Public schema tables:

- `profiles`;
- `enrollments`;
- `lesson_progress`;
- `submissions`;
- `interest_signups`.

Course content remains in Git under `src/content/ai-creator-bootcamp`. Supabase stores user-specific state only.

## Security model

- every exposed table has Row Level Security enabled;
- browser code uses only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`;
- no service-role key is present in browser code;
- students cannot enroll themselves;
- students cannot assign roles;
- students cannot read other students’ records;
- students cannot approve submissions or write instructor feedback;
- the public waitlist table cannot be read directly by anonymous or authenticated browser roles;
- the waitlist Edge Function performs validated insert-only writes and treats duplicate emails as success;
- registration metadata is never trusted for role assignment.

## Design direction

Artifact Learning OS uses:

- dark shadcn-style product interfaces;
- zinc and charcoal foundations;
- one-pixel borders;
- compact typography;
- minimal shadows;
- green for completion and progress;
- clay/orange for human guidance;
- violet for AI-assisted interactions;
- cinematic, editorial marketing layouts rather than dashboard card grids.

The product UI should remain approximately 85% restrained system and 15% Artifact Academy expression.

## Current course-content status

The technical content engine contains eight session modules with exactly two lessons and one artifact assignment per session. Much of the curriculum still needs final educational writing, real videos, examples, rubrics, and beginner testing.

Do not treat placeholder copy or mock media as final curriculum. Finish and validate Session 1 with real beginners before investing heavily in Sessions 2–8.

## Immediate priorities

1. Keep the production landing page and waitlist stable.
2. Finish real Session 1 materials end to end.
3. Test Session 1 with two or three beginners without instructor rescue.
4. Refine content based on observed confusion and completion behavior.
5. Add dates and pricing only when the cohort plan is confirmed.
6. Use Stripe Payment Links and manual enrollment for the first paid cohort.
7. Build automation only when the manual process becomes a real bottleneck.

## Explicit non-goals for the first cohort

Do not add:

- a student dashboard;
- a course catalog;
- community or social features;
- global search or notifications;
- a calendar system;
- built-in portfolio hosting;
- an instructor review dashboard;
- an admin CMS;
- automatic certificate issuance;
- custom Stripe Checkout or payment webhooks;
- team enrollment;
- multiple courses;
- live LLM calls inside labs;
- Three.js unless a validated learning concept clearly benefits from spatial interaction.

## First-cohort operating model

Use manual operations intentionally:

- waitlist records live in Supabase;
- payments can use Stripe Payment Links;
- enrollment is activated through a trusted SQL or server-side operation;
- instructor review can use Supabase Table Editor initially;
- feedback persists in the existing submissions table;
- certificates can be issued manually;
- community communication can use an external group tool.

This keeps engineering focused on the learning experience rather than administrative software.

## Decision rule for new features

A feature is justified only when at least one condition is true:

1. students cannot complete the core learning loop without it;
2. the current manual process is repeatedly causing errors or excessive work;
3. real user behavior shows a clear recurring need;
4. security, privacy, accessibility, or reliability requires it.

“Other LMS products have it” is not sufficient.