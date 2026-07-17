begin;

select plan(25);

insert into auth.users (
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    '00000000-0000-0000-0000-000000000001',
    'authenticated',
    'authenticated',
    'student-a@example.com',
    '',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Student A","role":"instructor"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'authenticated',
    'authenticated',
    'student-b@example.com',
    '',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Student B"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'authenticated',
    'authenticated',
    'pending@example.com',
    '',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Pending Student"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'authenticated',
    'authenticated',
    'instructor@example.com',
    '',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Trusted Instructor"}',
    now(),
    now()
  );

update public.profiles
set role = 'instructor'
where id = '00000000-0000-0000-0000-000000000004';

insert into public.enrollments (user_id, course_id, status)
values
  ('00000000-0000-0000-0000-000000000001', 'ai-creator-bootcamp', 'active'),
  ('00000000-0000-0000-0000-000000000002', 'ai-creator-bootcamp', 'active');

select is(
  (
    select full_name
    from public.profiles
    where id = '00000000-0000-0000-0000-000000000001'
  ),
  'Student A',
  'the auth trigger creates a profile'
);

select is(
  (
    select role
    from public.profiles
    where id = '00000000-0000-0000-0000-000000000001'
  ),
  'student',
  'registration metadata cannot assign the instructor role'
);

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);

select is(
  (select count(*) from public.profiles),
  1::bigint,
  'a student can read only their own profile'
);

select is(
  (
    select count(*)
    from public.profiles
    where id = '00000000-0000-0000-0000-000000000002'
  ),
  0::bigint,
  'a student cannot read another profile'
);

select is(
  (select count(*) from public.enrollments),
  1::bigint,
  'a student can read their own enrollment'
);

select is(
  (
    select count(*)
    from public.enrollments
    where user_id = '00000000-0000-0000-0000-000000000002'
  ),
  0::bigint,
  'a student cannot read another enrollment'
);

select throws_ok(
  $$
    insert into public.enrollments (user_id, course_id, status)
    values (
      '00000000-0000-0000-0000-000000000001',
      'another-course',
      'active'
    )
  $$,
  '42501',
  'permission denied for table enrollments',
  'a student cannot enroll themselves'
);

select lives_ok(
  $$ select public.complete_lab('ai-creator-bootcamp', 'context-window-packing', 'context-window-packing-lab') $$,
  'an actively enrolled student can complete a lab'
);

select is(
  (
    select completed_lab_ids
    from public.lesson_progress
    where item_id = 'context-window-packing'
  ),
  array['context-window-packing-lab'],
  'lab completion is stored on the lesson progress record'
);

select lives_ok(
  $$ select public.complete_lesson('ai-creator-bootcamp', 'how-context-shapes-an-output') $$,
  'an actively enrolled student can complete a lesson'
);

select ok(
  (
    select completed_at is not null
    from public.lesson_progress
    where item_id = 'how-context-shapes-an-output'
  ),
  'lesson completion stores a timestamp'
);

select throws_ok(
  $$ update public.profiles set role = 'instructor' where id = auth.uid() $$,
  '42501',
  'permission denied for table profiles',
  'a student cannot assign their own role'
);

select lives_ok(
  $$
    insert into public.submissions (
      user_id,
      course_id,
      assignment_id,
      live_url,
      source_url,
      note
    )
    values (
      auth.uid(),
      'ai-creator-bootcamp',
      'foundations-artifact',
      'https://example.com/live',
      'https://example.com/source',
      'Please review the workflow.'
    )
  $$,
  'an actively enrolled student can create a submission'
);

select lives_ok(
  $$
    update public.submissions
    set status = 'approved'
    where assignment_id = 'foundations-artifact'
  $$,
  'an unauthorized approval attempt does not expose the row'
);

select is(
  (
    select status
    from public.submissions
    where assignment_id = 'foundations-artifact'
  ),
  'submitted',
  'an unauthorized approval attempt cannot change submission status'
);

reset role;
select set_config('request.jwt.claim.sub', '', true);
update public.submissions
set
  status = 'needs_revision',
  feedback = 'Clarify the second step.',
  reviewed_at = now()
where assignment_id = 'foundations-artifact';

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);

select lives_ok(
  $$
    update public.submissions
    set
      live_url = 'https://example.com/revised',
      source_url = 'https://example.com/revised-source',
      note = 'The second step is now explicit.',
      status = 'submitted'
    where assignment_id = 'foundations-artifact'
      and status = 'needs_revision'
  $$,
  'a student can resubmit an artifact that needs revision'
);

reset role;
select set_config('request.jwt.claim.sub', '', true);
update public.submissions
set status = 'needs_revision'
where assignment_id = 'foundations-artifact';

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);

select throws_ok(
  $$
    update public.submissions
    set status = 'submitted', feedback = 'Forged feedback'
    where assignment_id = 'foundations-artifact'
  $$,
  '42501',
  'students may only resubmit an artifact that needs revision',
  'a student cannot write instructor feedback while resubmitting'
);

reset role;
select set_config('request.jwt.claim.sub', '', true);
update public.submissions
set
  status = 'approved',
  feedback = 'Approved after revision.',
  reviewed_at = now()
where assignment_id = 'foundations-artifact';

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);

select is(
  (
    select status
    from public.submissions
    where assignment_id = 'foundations-artifact'
  ),
  'approved',
  'a student can read an approved state and instructor feedback'
);

select is(
  (
    select feedback
    from public.submissions
    where assignment_id = 'foundations-artifact'
  ),
  'Approved after revision.',
  'instructor feedback persists for the student'
);

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', true);

select is(
  (select count(*) from public.submissions),
  0::bigint,
  'another enrolled student cannot read the first student submission'
);

select is(
  (select count(*) from public.lesson_progress),
  0::bigint,
  'another enrolled student cannot read the first student progress'
);

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000003', true);

select throws_ok(
  $$ select public.complete_lesson('ai-creator-bootcamp', 'how-context-shapes-an-output') $$,
  '42501',
  'new row violates row-level security policy for table "lesson_progress"',
  'an unenrolled student cannot write progress'
);

select throws_ok(
  $$
    insert into public.submissions (
      user_id,
      course_id,
      assignment_id,
      live_url,
      source_url,
      note
    )
    values (
      auth.uid(),
      'ai-creator-bootcamp',
      'foundations-artifact',
      'https://example.com/pending',
      'https://example.com/pending-source',
      'Not enrolled.'
    )
  $$,
  '42501',
  'new row violates row-level security policy for table "submissions"',
  'an unenrolled student cannot submit an artifact'
);

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000004', true);

select is(
  (select count(*) from public.submissions),
  1::bigint,
  'a trusted instructor role can read submissions'
);

select lives_ok(
  $$
    update public.submissions
    set
      status = 'needs_revision',
      feedback = 'One more revision is required.',
      reviewed_at = now()
    where assignment_id = 'foundations-artifact'
  $$,
  'a trusted instructor role can write review state'
);

select * from finish();
rollback;
