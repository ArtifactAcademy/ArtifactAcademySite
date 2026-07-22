create extension if not exists citext with schema extensions;

create table public.interest_signups (
  id uuid primary key default gen_random_uuid(),
  email extensions.citext not null unique,
  first_name text,
  source text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  consent_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint interest_signups_email_normalized
    check (email::text = lower(btrim(email::text))),
  constraint interest_signups_email_length
    check (char_length(email::text) between 3 and 254),
  constraint interest_signups_first_name_length
    check (first_name is null or char_length(first_name) <= 100),
  constraint interest_signups_source_length
    check (source is null or char_length(source) <= 40),
  constraint interest_signups_utm_source_length
    check (utm_source is null or char_length(utm_source) <= 200),
  constraint interest_signups_utm_medium_length
    check (utm_medium is null or char_length(utm_medium) <= 200),
  constraint interest_signups_utm_campaign_length
    check (utm_campaign is null or char_length(utm_campaign) <= 200)
);

comment on table public.interest_signups is
  'Early-interest signups written only by the server-side join-waitlist Edge Function.';
comment on column public.interest_signups.consent_at is
  'Server-recorded time at which the signup form consent text was submitted.';

alter table public.interest_signups enable row level security;

revoke all on public.interest_signups from public, anon, authenticated, service_role;
grant insert on public.interest_signups to service_role;
