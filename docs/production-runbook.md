# Artifact Academy production runbook

This runbook is designed for both humans and coding agents. It documents how to configure, deploy, verify, operate, and recover the current first-cohort MVP.

## Read first

Before making changes, read:

1. `docs/project-context.md`
2. `docs/architecture.md`
3. `docs/design-system.md`
4. `AGENTS.md`
5. `CLAUDE.md`

Do not broaden product scope while performing operational work.

## Production inventory

### GitHub

```text
Repository: ArtifactAcademy/ArtifactAcademySite
Production branch: main
```

### Cloudflare

```text
Primary domain: https://theartifactacademy.com
Framework: Vite static SPA
Build command: npm run build
Output directory: dist
SPA fallback: public/_redirects
```

Cloudflare build variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

These values are public browser configuration. Never add a service-role key or private API key to a `VITE_` variable.

### Supabase

```text
Project name: Artifact Academy Production
Project reference: afqpnopdluqibdpsvxel
Region: West US (North California)
Project URL: https://afqpnopdluqibdpsvxel.supabase.co
```

### Resend

Recommended sending subdomain:

```text
auth.theartifactacademy.com
```

Recommended sender:

```text
Artifact Academy <login@auth.theartifactacademy.com>
```

### Course ID

```text
ai-creator-bootcamp
```

## Initial machine setup

Prerequisites:

- Git;
- Node version supported by `package.json`;
- Docker for local Supabase;
- Supabase CLI through `npx supabase`;
- repository access;
- Cloudflare and Supabase account access for production operations.

Clone and install:

```bash
git clone git@github.com:ArtifactAcademy/ArtifactAcademySite.git
cd ArtifactAcademySite
npm ci
```

Authenticate Supabase CLI:

```bash
npx supabase login
npx supabase projects list
```

Link the repository:

```bash
rm -f supabase/.temp/project-ref
npx supabase link --project-ref afqpnopdluqibdpsvxel
```

Confirm:

```bash
npx supabase migration list
npx supabase functions list --project-ref afqpnopdluqibdpsvxel
```

## Local development

Start Supabase:

```bash
npx supabase start
```

Copy environment template:

```bash
cp .env.example .env.local
```

Fill `.env.local` with the local public URL and publishable key shown by:

```bash
npx supabase status
```

Start the application:

```bash
npm run dev
```

Local URLs:

```text
App: http://localhost:5173
Supabase Studio: typically http://localhost:54323
Local email viewer: typically http://localhost:54324
```

## Required validation before commit

Run:

```bash
npm run lint
npm run build
npm run test:ui
npm run test:function
npm run lint:db
npm run test:db
npx supabase db reset
```

Do not commit if any required validation fails.

## Database deployment

All schema changes must be committed under `supabase/migrations`.

Review pending migrations:

```bash
npx supabase migration list
```

Push:

```bash
npx supabase db push
```

Confirm local and remote versions match:

```bash
npx supabase migration list
```

A warning after successful migration application is not automatically a deployment failure. Treat the final command status and remote migration list as the source of truth. Investigate warnings separately when they affect repeatability or future commands.

Never create production tables manually if a migration should represent the change.

## Edge Function deployment

Deploy the waitlist function:

```bash
npx supabase functions deploy join-waitlist --project-ref afqpnopdluqibdpsvxel
```

Confirm:

```bash
npx supabase functions list --project-ref afqpnopdluqibdpsvxel
```

Expected function:

```text
join-waitlist — ACTIVE
```

The hosted environment provides server-side Supabase credentials. Do not copy the service-role key into Cloudflare or client code.

## Cloudflare deployment

Normal path:

```text
Merge validated PR into main
→ Cloudflare detects push
→ npm run build
→ dist deployed
```

Cloudflare must contain these build variables:

```text
VITE_SUPABASE_URL=https://afqpnopdluqibdpsvxel.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<matching current project publishable key>
```

Because Vite embeds variables at build time, changing them requires a fresh deployment.

Production smoke test:

```text
/
/login
/privacy
/terms
/learn
```

Expected:

- `/` renders without authentication;
- waitlist submission succeeds;
- `/login` sends a magic link;
- `/learn` redirects unauthenticated users to login;
- authenticated unenrolled users see access pending;
- enrolled users enter the current lesson.

## Waitlist verification

Submit through the production site, then inspect:

```text
Supabase Dashboard
→ Table Editor
→ public.interest_signups
```

Expected fields include:

```text
email
source
utm_source
utm_medium
utm_campaign
consent_at
created_at
```

Direct function test:

```bash
export SUPABASE_PUBLISHABLE_KEY='copy from Supabase dashboard for this shell only'

curl -i -X POST \
  'https://afqpnopdluqibdpsvxel.supabase.co/functions/v1/join-waitlist' \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://theartifactacademy.com' \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" \
  --data '{"email":"test@example.com","source":"landing-hero"}'
```

Expected:

```json
{"ok":true}
```

Duplicate email should also return success without a duplicate row.

Failure map:

```text
DNS resolution error → wrong or deleted Supabase project URL
404 → function not deployed
403 → origin not allowed
503 → insert failed or table/migration missing
200 but no UI success → frontend state issue
```

## Resend and SMTP

Waitlist storage does not require SMTP. SMTP is required for reliable Supabase Auth email delivery.

Manual account tasks:

1. Create or access Resend account.
2. Add `auth.theartifactacademy.com`.
3. Add Resend DNS records in Cloudflare.
4. Wait until Resend reports Verified.
5. Create a Resend API key.
6. Configure Supabase SMTP.

Supabase SMTP values:

```text
Host: smtp.resend.com
Port: 465
Username: resend
Password: Resend API key
Sender name: Artifact Academy
Sender email: login@auth.theartifactacademy.com
```

Do not commit or expose the Resend API key.

Disable click tracking for authentication email links because link rewriting can break verification.

## Supabase Auth URL configuration

In Supabase Dashboard:

```text
Authentication
→ URL Configuration
```

Set:

```text
Site URL:
https://theartifactacademy.com
```

Allow:

```text
https://theartifactacademy.com/login
https://www.theartifactacademy.com/login
http://localhost:5173/login
```

Avoid broad production wildcards unless explicitly required.

## Auth template deployment

Repository templates:

```text
supabase/templates/magic-link.html
supabase/templates/invite.html
supabase/templates/confirmation.html
```

Keep templates in Git as the reviewable source of truth. When modifying them:

1. test in a major email client;
2. preserve the auth action variable exactly;
3. keep CSS email-client compatible;
4. avoid external scripts;
5. redeploy or update through the supported Supabase workflow;
6. send a controlled delivery test.

## Create and enroll a test student

1. Open `https://theartifactacademy.com/login` in incognito.
2. Request a magic link using an email you control.
3. Open the message and sign in.
4. Confirm access pending.
5. Open Supabase Dashboard → Authentication → Users.
6. Copy the user UUID.
7. Run a trusted SQL enrollment.

```sql
insert into public.enrollments (
  user_id,
  course_id,
  status
)
values (
  'USER_UUID',
  'ai-creator-bootcamp',
  'active'
)
on conflict (user_id, course_id)
do update set status = 'active';
```

8. Refresh or sign in again.
9. Confirm `/learn` opens the learning workspace.

## Full student smoke test

Run this sequence with a dedicated test account:

```text
request magic link
→ sign in
→ confirm active enrollment
→ open current lesson
→ complete Context Window Packing Lab
→ mark lesson complete
→ refresh
→ confirm progress persists
→ open artifact assignment
→ submit test URLs
→ refresh
→ confirm submission persists
→ set needs_revision through trusted operator path
→ resubmit
→ set approved and add feedback through trusted operator path
→ confirm student sees approved state and feedback
```

Inspect these tables during testing:

```text
profiles
enrollments
lesson_progress
submissions
```

Remove synthetic test records when finished unless the account is intentionally retained as a production smoke-test user.

## Manual enrollment operating procedure

For the first cohort, manual enrollment is intentional.

Before enrolling:

- verify payment or approved access;
- verify the correct user UUID;
- verify the course ID;
- use a trusted SQL or server-side context;
- never expose enrollment writes to browser clients.

To deactivate:

```sql
update public.enrollments
set status = 'inactive'
where user_id = 'USER_UUID'
  and course_id = 'ai-creator-bootcamp';
```

## Waitlist operations

View signups:

```text
Supabase → Table Editor → interest_signups
```

Do not manually email users through auth SMTP. Authentication email and marketing email are separate concerns.

Before sending launch updates:

- establish unsubscribe handling;
- use a proper broadcast/audience workflow;
- avoid exporting sensitive data unnecessarily;
- send only to users who consented;
- preserve source and UTM attribution.

## Production incident checklist

### Landing page blank

Check:

1. Cloudflare deployment status;
2. browser console;
3. whether public routes still initialize Supabase eagerly;
4. static asset paths;
5. Cloudflare build logs.

Public `/`, `/privacy`, and `/terms` must render even if Supabase is unavailable.

### Waitlist errors

Check:

1. browser Network request to `/functions/v1/join-waitlist`;
2. status code;
3. Edge Function logs;
4. current Supabase project URL;
5. function deployment state;
6. migration state;
7. allowed production origin.

### Magic-link email not received

Check:

1. Resend domain verified;
2. Supabase SMTP enabled;
3. sender address belongs to verified domain;
4. Resend email logs;
5. Supabase Auth logs;
6. spam folder;
7. sending limits;
8. click tracking disabled.

### Magic link opens but login fails

Check:

1. Site URL;
2. exact redirect URL allow list;
3. email link rewriting;
4. callback code exchange on `/login`;
5. whether the same browser started the PKCE flow.

### Login succeeds but learning is blocked

Check:

1. `profiles` row exists;
2. `enrollments` contains active course enrollment;
3. course ID exactly equals `ai-creator-bootcamp`;
4. browser session is current;
5. RLS policy logs or SQL result.

## Rollback

Frontend rollback:

- use Cloudflare deployment history to restore a known-good deployment, or;
- revert the offending Git commit and push `main`.

Database rollback:

- do not manually delete migration history;
- write a forward migration that safely reverses or repairs the schema;
- test locally with `npx supabase db reset` before pushing.

Edge Function rollback:

- restore the known-good function code from Git;
- redeploy the function;
- verify with the direct endpoint test.

## Secret handling

Never print, commit, paste into prompts, or store in client variables:

- Supabase service-role key;
- database password;
- Resend API key;
- Cloudflare API token;
- GitHub personal access token;
- Stripe secret keys.

Browser-safe values:

- Supabase project URL;
- Supabase publishable key;
- public domain names;
- project reference.

Even browser-safe values should be sourced from configuration rather than hard-coded throughout the application.

## Human versus agent responsibility

### Human-controlled

- account creation and ownership;
- billing and legal acceptance;
- DNS approval;
- production secret creation;
- SMTP credentials;
- payment verification;
- final production merge approval;
- enrollment approval;
- legal/privacy review;
- communication with students.

### Agent-executable after authentication

- inspect repository and configuration;
- run tests;
- create migrations;
- validate RLS;
- deploy migrations and Edge Functions;
- verify routes and flows;
- create email templates;
- update documentation;
- diagnose logs;
- create bounded PRs;
- report exact remaining manual steps.

## Agent completion contract

An agent performing production setup must finish with a report containing:

```text
Repository branch and commit
Migrations applied
Functions deployed
Cloudflare build result
Production route smoke-test result
Waitlist insertion result
Auth email delivery result
Test student login result
Enrollment result
Progress persistence result
Submission persistence result
RLS validation result
Secrets not exposed confirmation
Remaining manual actions
```

The agent must not claim completion when a manual account-level task remains.