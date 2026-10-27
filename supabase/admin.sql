-- 관리자(Supabase Auth authenticated)용 RLS.
-- 최초 1회 SQL Editor에서 실행. 공개 정책(anon + publish_at)은 tests.sql 그대로 둔다.
-- 관리자 계정은 Supabase Dashboard → Authentication → Users 에서 생성하고,
-- 앱의 VITE_ADMIN_EMAILS 에 이메일을 넣어 허용한다.

drop policy if exists "Authenticated admins can read all tests" on public.tests;
drop policy if exists "Authenticated admins can insert tests" on public.tests;
drop policy if exists "Authenticated admins can update tests" on public.tests;
drop policy if exists "Authenticated admins can delete tests" on public.tests;

create policy "Authenticated admins can read all tests"
  on public.tests
  for select
  to authenticated
  using (true);

create policy "Authenticated admins can insert tests"
  on public.tests
  for insert
  to authenticated
  with check (true);

create policy "Authenticated admins can update tests"
  on public.tests
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated admins can delete tests"
  on public.tests
  for delete
  to authenticated
  using (true);
