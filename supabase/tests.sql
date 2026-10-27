-- 최초 설정: SQL Editor에서 전체 실행
-- 테스트 콘텐츠(문항/결과)를 코드가 아니라 DB에 두고, publish_at으로 "오늘의 새 테스트"를
-- 코드 배포 없이 공개할 수 있게 한다.

create table if not exists public.tests (
  id text primary key,
  title text not null,
  description text not null,
  category text not null,
  -- 썸네일/OG 캐릭터 이미지 id (예: 'steel', 'kkondae/main'). public/characters/pixel/{character}.png
  character text not null,
  scoring_mode text not null default 'simple',
  result_template text,
  requires_gender boolean not null default false,
  result_label text,
  min_score_per_answer integer,
  questions jsonb not null,
  results jsonb not null,
  -- 이 시각 이후부터 앱에 노출된다. 미래 날짜로 미리 넣어두면 그 시각에 자동 공개됨.
  publish_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists tests_publish_at_idx on public.tests (publish_at);

alter table public.tests enable row level security;

drop policy if exists "Published tests are readable by anyone" on public.tests;

-- anon(앱)은 공개 시각이 지난 테스트만 읽을 수 있다. 쓰기(insert/update)는 anon 정책이 없으므로
-- service_role 키(=scripts/.env, 절대 커밋 금지)로만 가능하다. 앱 쪽 fetch도 이 조건과 동일하게
-- publish_at 필터를 걸어야 하므로 RLS는 "이미 걸어둔 필터가 뚫려도 안전한" 방어선 역할을 한다.
create policy "Published tests are readable by anyone"
  on public.tests
  for select
  to anon
  using (publish_at <= now());
