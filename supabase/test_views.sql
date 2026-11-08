-- 최초 설정: SQL Editor에서 전체 실행
-- 테스트별 조회수 카운터. row가 쌓이는 로그가 아니라 test_slug당 1행 + count만 증가한다.
create table if not exists public.test_view_counts (
  test_slug text primary key,
  count integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.test_view_counts enable row level security;

-- 직접 select/insert/update 정책은 없음 — 아래 increment_test_view() 함수(security definer)를
-- 통해서만 값이 바뀐다. anon은 함수 호출만 가능하고 테이블에 바로 쓸 수는 없다.

create or replace function public.increment_test_view(test_slug text)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.test_view_counts (test_slug, count, updated_at)
  values (test_slug, 1, now())
  on conflict (test_slug)
  do update set count = test_view_counts.count + 1, updated_at = now();
$$;

grant execute on function public.increment_test_view(text) to anon;
