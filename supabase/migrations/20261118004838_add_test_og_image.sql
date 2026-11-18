-- 테스트별 전용 OG/트위터 공유 이미지 (어드민·대시보드에서 설정)
-- 공개 사이트 프리렌더·PageMeta가 og_image 가 있으면 우선 사용한다.

alter table public.tests
  add column if not exists og_image text,
  add column if not exists og_image_width integer,
  add column if not exists og_image_height integer;
