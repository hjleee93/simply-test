-- 결과 화면의 "같은 결과가 나온 사람" 비율.
-- 개인 행은 열지 않고, 테스트별 최신 결과만 집계해 숫자 두 개만 돌려준다.
-- SQL Editor에서 이 파일 전체를 한 번 실행한다.

create index if not exists test_results_slug_visitor_created_idx
  on public.test_results (test_slug, visitor_id, created_at desc);

create or replace function public.result_peer_counts(p_test_slug text, p_result_id text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with latest as (
    select distinct on (visitor_id) result_id
    from public.test_results
    where test_slug = p_test_slug
    order by visitor_id, created_at desc
  )
  select jsonb_build_object(
    'same_count', count(*) filter (where result_id = p_result_id),
    'total_count', count(*)
  )
  from latest;
$$;

revoke all on function public.result_peer_counts(text, text) from public;
grant execute on function public.result_peer_counts(text, text) to anon;
