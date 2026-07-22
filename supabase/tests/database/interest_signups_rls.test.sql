begin;

select plan(14);

select ok(
  (
    select relrowsecurity
    from pg_class
    where oid = 'public.interest_signups'::regclass
  ),
  'interest_signups has row level security enabled'
);

select ok(not has_table_privilege('anon', 'public.interest_signups', 'select'), 'anon cannot select signups');
select ok(not has_table_privilege('anon', 'public.interest_signups', 'insert'), 'anon cannot insert signups');
select ok(not has_table_privilege('anon', 'public.interest_signups', 'update'), 'anon cannot update signups');
select ok(not has_table_privilege('anon', 'public.interest_signups', 'delete'), 'anon cannot delete signups');

select ok(not has_table_privilege('authenticated', 'public.interest_signups', 'select'), 'authenticated clients cannot select signups');
select ok(not has_table_privilege('authenticated', 'public.interest_signups', 'insert'), 'authenticated clients cannot insert signups');
select ok(not has_table_privilege('authenticated', 'public.interest_signups', 'update'), 'authenticated clients cannot update signups');
select ok(not has_table_privilege('authenticated', 'public.interest_signups', 'delete'), 'authenticated clients cannot delete signups');

select ok(has_table_privilege('service_role', 'public.interest_signups', 'insert'), 'the server role can insert signups');
select ok(not has_table_privilege('service_role', 'public.interest_signups', 'select'), 'the server role does not need select access');

set local role anon;

select throws_ok(
  $$ select * from public.interest_signups $$,
  '42501',
  'permission denied for table interest_signups',
  'an anonymous browser query cannot read the waitlist'
);

select throws_ok(
  $$
    insert into public.interest_signups (email, consent_at)
    values ('browser@example.com', now())
  $$,
  '42501',
  'permission denied for table interest_signups',
  'an anonymous browser cannot bypass the Edge Function'
);

reset role;

select throws_ok(
  $$
    insert into public.interest_signups (email, consent_at)
    values ('Not-Normalized@Example.com', now())
  $$,
  '23514',
  null,
  'the database rejects non-normalized email storage'
);

select * from finish();
rollback;
