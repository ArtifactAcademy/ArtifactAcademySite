create schema if not exists private;

revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role text not null default 'student' check (role in ('student', 'instructor')),
  created_at timestamptz not null default now()
);

create table public.enrollments (
  user_id uuid not null references public.profiles (id) on delete cascade,
  course_id text not null,
  status text not null check (status in ('active', 'inactive')),
  enrolled_at timestamptz not null default now(),
  primary key (user_id, course_id)
);

create table public.lesson_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  course_id text not null,
  item_id text not null,
  completed_lab_ids text[] not null default '{}',
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, course_id, item_id)
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  course_id text not null,
  assignment_id text not null,
  live_url text not null,
  source_url text not null,
  note text not null,
  status text not null default 'submitted'
    check (status in ('submitted', 'needs_revision', 'approved')),
  feedback text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  unique (user_id, course_id, assignment_id)
);

comment on table public.profiles is 'Application profile created from a trusted auth.users trigger.';
comment on table public.enrollments is 'Privileged cohort enrollment records; students have no write access.';
comment on table public.lesson_progress is 'Per-student lesson and interactive-lab completion.';
comment on table public.submissions is 'Per-student artifact submissions and instructor review state.';

create or replace function private.is_active_enrollment(
  target_user_id uuid,
  target_course_id text
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.enrollments
    where user_id = target_user_id
      and course_id = target_course_id
      and status = 'active'
  );
$$;

create or replace function private.is_instructor(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = target_user_id
      and role = 'instructor'
  );
$$;

revoke all on function private.is_active_enrollment(uuid, text) from public;
revoke all on function private.is_instructor(uuid) from public;
grant execute on function private.is_active_enrollment(uuid, text) to authenticated;
grant execute on function private.is_instructor(uuid) to authenticated;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger lesson_progress_set_updated_at
before update on public.lesson_progress
for each row execute function private.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(coalesce(new.email, ''), '@', 1)),
    'student'
  );
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function private.protect_submission_review_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is not null and not private.is_instructor(auth.uid()) then
    if old.status <> 'needs_revision'
      or new.status <> 'submitted'
      or new.feedback is distinct from old.feedback
      or new.reviewed_at is distinct from old.reviewed_at
      or new.user_id is distinct from old.user_id
      or new.course_id is distinct from old.course_id
      or new.assignment_id is distinct from old.assignment_id
    then
      raise insufficient_privilege using
        message = 'students may only resubmit an artifact that needs revision';
    end if;

    new.submitted_at := now();
  end if;

  return new;
end;
$$;

create trigger submissions_protect_review_fields
before update on public.submissions
for each row execute function private.protect_submission_review_fields();

alter table public.profiles enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.submissions enable row level security;

create policy "profiles_select_own_or_instructor"
on public.profiles
for select
to authenticated
using (
  id = (select auth.uid())
  or private.is_instructor((select auth.uid()))
);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy "enrollments_select_own"
on public.enrollments
for select
to authenticated
using (user_id = (select auth.uid()));

create policy "lesson_progress_select_own_active"
on public.lesson_progress
for select
to authenticated
using (
  user_id = (select auth.uid())
  and private.is_active_enrollment((select auth.uid()), course_id)
);

create policy "lesson_progress_insert_own_active"
on public.lesson_progress
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and private.is_active_enrollment((select auth.uid()), course_id)
);

create policy "lesson_progress_update_own_active"
on public.lesson_progress
for update
to authenticated
using (
  user_id = (select auth.uid())
  and private.is_active_enrollment((select auth.uid()), course_id)
)
with check (
  user_id = (select auth.uid())
  and private.is_active_enrollment((select auth.uid()), course_id)
);

create policy "submissions_select_own_active_or_instructor"
on public.submissions
for select
to authenticated
using (
  (
    user_id = (select auth.uid())
    and private.is_active_enrollment((select auth.uid()), course_id)
  )
  or private.is_instructor((select auth.uid()))
);

create policy "submissions_insert_own_active"
on public.submissions
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and private.is_active_enrollment((select auth.uid()), course_id)
  and status = 'submitted'
  and feedback is null
  and reviewed_at is null
);

create policy "submissions_resubmit_own_active"
on public.submissions
for update
to authenticated
using (
  user_id = (select auth.uid())
  and private.is_active_enrollment((select auth.uid()), course_id)
  and status = 'needs_revision'
)
with check (
  user_id = (select auth.uid())
  and private.is_active_enrollment((select auth.uid()), course_id)
  and status = 'submitted'
);

create policy "submissions_review_as_instructor"
on public.submissions
for update
to authenticated
using (private.is_instructor((select auth.uid())))
with check (private.is_instructor((select auth.uid())));

revoke all on public.profiles, public.enrollments, public.lesson_progress, public.submissions
from public, anon, authenticated;

grant select on public.profiles to authenticated;
grant update (full_name) on public.profiles to authenticated;

grant select on public.enrollments to authenticated;

grant select on public.lesson_progress to authenticated;
grant insert (user_id, course_id, item_id, completed_lab_ids, completed_at)
on public.lesson_progress to authenticated;
grant update (completed_lab_ids, completed_at)
on public.lesson_progress to authenticated;

grant select on public.submissions to authenticated;
grant insert (
  user_id,
  course_id,
  assignment_id,
  live_url,
  source_url,
  note,
  status
) on public.submissions to authenticated;
grant update (
  live_url,
  source_url,
  note,
  status,
  feedback,
  reviewed_at
) on public.submissions to authenticated;

create or replace function public.complete_lab(
  target_course_id text,
  target_item_id text,
  target_lab_id text
)
returns public.lesson_progress
language plpgsql
security invoker
set search_path = ''
as $$
declare
  progress public.lesson_progress;
begin
  insert into public.lesson_progress (
    user_id,
    course_id,
    item_id,
    completed_lab_ids
  )
  values (
    auth.uid(),
    target_course_id,
    target_item_id,
    array[target_lab_id]
  )
  on conflict (user_id, course_id, item_id)
  do update set
    completed_lab_ids = case
      when target_lab_id = any(public.lesson_progress.completed_lab_ids)
        then public.lesson_progress.completed_lab_ids
      else array_append(public.lesson_progress.completed_lab_ids, target_lab_id)
    end
  returning * into progress;

  return progress;
end;
$$;

create or replace function public.complete_lesson(
  target_course_id text,
  target_item_id text
)
returns public.lesson_progress
language plpgsql
security invoker
set search_path = ''
as $$
declare
  progress public.lesson_progress;
begin
  insert into public.lesson_progress (
    user_id,
    course_id,
    item_id,
    completed_at
  )
  values (
    auth.uid(),
    target_course_id,
    target_item_id,
    now()
  )
  on conflict (user_id, course_id, item_id)
  do update set completed_at = coalesce(public.lesson_progress.completed_at, now())
  returning * into progress;

  return progress;
end;
$$;

revoke all on function public.complete_lab(text, text, text) from public, anon;
revoke all on function public.complete_lesson(text, text) from public, anon;
grant execute on function public.complete_lab(text, text, text) to authenticated;
grant execute on function public.complete_lesson(text, text) to authenticated;
