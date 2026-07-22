# Artifact Academy agent bootstrap

This file is a compact machine-readable operating brief for coding agents. It does not replace the full documentation.

## Required reading order

```text
1. AGENTS.md or CLAUDE.md
2. docs/project-context.md
3. docs/architecture.md
4. docs/design-system.md
5. docs/production-runbook.md when deployment or infrastructure is involved
```

## Fixed identifiers

```yaml
brand: Artifact Academy
platform: Artifact Learning OS
course: AI Creator Bootcamp
course_id: ai-creator-bootcamp
production_domain: https://theartifactacademy.com
repository: ArtifactAcademy/ArtifactAcademySite
production_branch: main
supabase_project_name: Artifact Academy Production
supabase_project_ref: afqpnopdluqibdpsvxel
supabase_region: West US (North California)
supabase_url: https://afqpnopdluqibdpsvxel.supabase.co
cloudflare_build_command: npm run build
cloudflare_output_directory: dist
```

## Public browser variables

```yaml
required:
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_PUBLISHABLE_KEY
forbidden:
  - SUPABASE_SERVICE_ROLE_KEY
  - database_password
  - RESEND_API_KEY
  - STRIPE_SECRET_KEY
  - CLOUDFLARE_API_TOKEN
```

All `VITE_` values are public and build-time embedded.

## Production routes

```yaml
public:
  - /
  - /privacy
  - /terms
auth:
  - /login
protected:
  - /learn
  - /learn/:lessonId
development_only:
  - /components
```

Do not add production routes for dashboards, catalogs, portfolios, community, notifications, calendars, CMS, instructor portals, administration, or certificates without explicit product approval.

## Data ownership

```yaml
course_content:
  owner: git
  path: src/content/ai-creator-bootcamp
  database_backed: false
student_state:
  owner: supabase
  tables:
    - profiles
    - enrollments
    - lesson_progress
    - submissions
acquisition:
  owner: supabase
  tables:
    - interest_signups
```

Never place progress, enrollment, feedback, or submission state in course content.

## Service boundaries

```yaml
AuthService:
  owns:
    - sessions
    - magic_link_request
    - pkce_callback
    - sign_out
LearningRepository:
  owns:
    - enrollment_load
    - progress_load
    - lab_completion
    - lesson_completion
    - submissions
WaitlistService:
  owns:
    - join_waitlist_request
```

Components must not call Supabase directly.

## Security invariants

```yaml
rls_required_on_all_exposed_tables: true
student_self_enrollment: forbidden
registration_role_assignment: forbidden
student_cross_account_reads: forbidden
student_feedback_write: forbidden
student_approval_write: forbidden
anonymous_waitlist_read: forbidden
service_role_in_browser: forbidden
```

Do not weaken a policy to make a UI flow pass. Fix the flow or privileged boundary.

## Current user flow

```text
landing page
→ waitlist or login
→ magic link
→ authenticated
→ enrollment check
→ access pending or learning workspace
→ complete required lab
→ complete lesson
→ submit artifact
→ instructor feedback
→ continue
```

## Interactive-lab rules

```yaml
deterministic: true
external_ai_calls: false
mouse_support: required
touch_support: required
keyboard_support: required
reduced_motion: required
completion_event: onComplete
persisted_value: completed_block_id_only
```

Do not add Three.js unless specifically approved for a validated concept.

## Deployment commands

```bash
npx supabase login
npx supabase link --project-ref afqpnopdluqibdpsvxel
npx supabase migration list
npx supabase db push
npx supabase functions deploy join-waitlist --project-ref afqpnopdluqibdpsvxel
npx supabase functions list --project-ref afqpnopdluqibdpsvxel
```

Never claim hosted deployment from local tests alone.

## Required validation

```bash
npm run lint
npm run build
npm run test:ui
npm run test:function
npm run lint:db
npm run test:db
npx supabase db reset
```

For production-affecting work, also perform bounded hosted smoke tests.

## Production verification contract

Before saying production is complete, report each item explicitly:

```yaml
cloudflare_build: pass|fail|not_run
landing_page: pass|fail|not_run
waitlist_insert: pass|fail|not_run
magic_link_delivery: pass|fail|not_run
login_callback: pass|fail|not_run
enrollment_gate: pass|fail|not_run
lesson_persistence: pass|fail|not_run
submission_persistence: pass|fail|not_run
rls_verification: pass|fail|not_run
migrations_remote_match: pass|fail|not_run
edge_function_active: pass|fail|not_run
secrets_exposed: false|unknown
manual_actions_remaining: []
```

Do not convert `not_run` into `pass` based on inference.

## Human-only or human-approved actions

```yaml
- account creation
- billing acceptance
- DNS approval
- secret generation
- SMTP credentials
- final production merge
- student enrollment approval
- payment verification
- legal review
```

An agent may automate surrounding steps after the human authenticates and explicitly authorizes the action.

## First-cohort product constraints

```yaml
multiple_courses: false
cms: false
student_dashboard: false
instructor_dashboard: false
community: false
custom_checkout: false
automated_certificate: false
live_llm_labs: false
manual_enrollment: true
manual_review_allowed: true
manual_certificate_allowed: true
```

## Near-term priority order

```text
1. keep production stable
2. finish real Session 1
3. test with 2–3 beginners
4. revise based on evidence
5. publish dates and pricing
6. use Stripe Payment Link
7. enroll first cohort manually
8. automate only proven bottlenecks
```

## Change discipline

Before editing:

1. state the user-facing objective;
2. identify affected boundary;
3. inspect existing reusable implementation;
4. list files planned for modification;
5. name any migration, secret, or manual dashboard requirement.

After editing:

1. run required tests;
2. verify no scope expansion;
3. report local versus hosted validation separately;
4. identify every remaining manual task;
5. never print secrets.