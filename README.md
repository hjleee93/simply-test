# simply-test

## 새 테스트 추가하기

테스트 콘텐츠(문항/결과)는 코드가 아니라 Supabase `tests` 테이블에 저장된다. `publish_at`이 지나야 앱에 노출되므로, 미래 날짜로 미리 올려두면 코드 재배포 없이 예약 공개할 수 있다.

1. `scripts/test-draft.example.ts`를 복사해 `TestDefinition`을 채운다 (예: `drafts/myNewTest.ts` — `drafts/`는 자유롭게 만들어 쓰면 됨). Supabase가 콘텐츠의 유일한 원본이므로, draft 파일은 백업/히스토리 차원에서 커밋해둔다.
2. `scripts/.env`에 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`를 설정한다 (`scripts/.env.example` 참고, Supabase 대시보드 → Project Settings → API에서 확인. **service_role 키는 절대 커밋하지 말 것**).
3. 업로드한다.
   ```bash
   npm run upload:test -- --file ./drafts/myNewTest.ts
   # 또는 특정 시각에 공개하고 싶으면
   npm run upload:test -- --file ./drafts/myNewTest.ts --publish-at 2026-10-28T00:00:00+09:00
   ```
4. `--publish-at`을 생략하면 즉시 공개된다. 단, OG 이미지/sitemap 등 정적 SEO 자산은 다음 빌드(`npm run build`)에서 반영되니 가능하면 새 테스트 추가 후 한 번 빌드/배포해준다.

로컬에서만 먼저 확인하려면 미래 `publish_at`으로 업로드한다. 운영(anon + RLS)에는 안 보이고, `npm run dev`에서는 Vite가 service_role로 미공개 테스트까지 불러온다.

```bash
npm run upload:test -- --file ./drafts/myNewTest.ts --publish-at 2026-10-31T00:00:00+09:00
npm run dev
```

테이블 스키마와 RLS 정책은 `supabase/tests.sql`, `supabase/test_results.sql`에 있다 (최초 설정 시 Supabase SQL Editor에서 실행).

과거 코드에 하드코딩돼 있던 6개 테스트를 Supabase로 옮긴 1회용 마이그레이션 스크립트는 `scripts/seed-tests.ts` (`npm run seed:tests`)이며, 원본 데이터는 `scripts/legacy-test-data/`에 참고용으로 남아 있다.


## 관리자

콘텐츠는 `/admin`에서 관리한다. 유저 화면/내비에는 링크가 없고, 비로그인·비허용 계정으로 `/admin`에 들어오면 일반 404와 같은 화면만 보인다.

1. Supabase Dashboard → Authentication 에서 관리자 유저를 만든다.
2. SQL Editor에서 `supabase/admin.sql` 을 실행한다 (authenticated RLS).
3. `.env`에 `VITE_ADMIN_EMAILS=you@example.com` 을 넣고 개발 서버를 재시작한다.
4. 로그인: `/admin/login?gate=1` (gate 없으면 여기도 404). 이후 `/admin`에서 테스트 CRUD·예약 공개.

`drafts/` + `upload:test` 는 대량 초안/백업용으로 남겨둔다. 평소 콘텐츠 작업은 관리자 페이지를 쓴다.

## 개발

```bash
npm run dev       # 로컬 개발 서버
npm run build     # OG 이미지 생성 + 타입체크 + 빌드
npm run lint
```
