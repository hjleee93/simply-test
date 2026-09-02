-- 최초 설정: SQL Editor에서 전체 실행
create table if not exists public.test_results (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  test_slug text not null,
  result_id text not null,
  score integer not null,
  created_at timestamptz not null default now()
);

create index if not exists test_results_visitor_id_idx
  on public.test_results (visitor_id);

alter table public.test_results enable row level security;

drop policy if exists "Anyone can insert test results" on public.test_results;

create policy "Anyone can insert test results"
  on public.test_results
  for insert
  to anon
  with check (true);

-- 이미 테이블을 만든 경우: 아래만 실행
-- alter table public.test_results add column if not exists visitor_id text;
-- update public.test_results set visitor_id = 'unknown' where visitor_id is null;
-- alter table public.test_results alter column visitor_id set not null;
-- create index if not exists test_results_visitor_id_idx on public.test_results (visitor_id);
