import type { TestDefinition } from '../types/test'

const DAY_MS = 24 * 60 * 60 * 1000

/** 공개 후 이 기간 안이면 NEW 배지를 단다 */
export const NEW_BADGE_DAYS = 14

/** 이 조회수 미만은 숫자를 숨긴다. "3명이 봤어요"는 오히려 썰렁해 보인다. */
export const VIEW_COUNT_DISPLAY_MIN = 100

function daysSince(iso: string | undefined, now: number): number | null {
  if (!iso) return null
  const time = Date.parse(iso)
  if (Number.isNaN(time)) return null
  return Math.max(0, (now - time) / DAY_MS)
}

/** 홈 스포트라이트에 "이번 주 새 테스트"라고 붙이는 기간 */
export const SPOTLIGHT_NEW_DAYS = 7

export function isPublishedWithin(test: TestDefinition, days: number, now = Date.now()): boolean {
  const elapsed = daysSince(test.publishAt, now)
  return elapsed !== null && elapsed <= days
}

export function isNewTest(test: TestDefinition, now = Date.now()): boolean {
  return isPublishedWithin(test, NEW_BADGE_DAYS, now)
}

/**
 * "지금 인기" 정렬. 누적 조회수를 그대로 쓰면 지난 시즌 테스트(빼빼로 등)가 계속 1위에 남으므로,
 * 공개 후 경과일로 나눈 하루 평균 조회수로 줄 세운다. 막 공개된 테스트가 하루 만에
 * 과하게 튀지 않도록 분모에 3일을 깔아둔다.
 * 공개일을 모르면 누적 조회수를 30일치로 보고 계산한다.
 */
export function rankByTrending(tests: readonly TestDefinition[], now = Date.now()): TestDefinition[] {
  return tests
    .map((test, index) => {
      const views = test.viewCount ?? 0
      const days = daysSince(test.publishAt, now) ?? 30
      return { test, index, score: views / (days + 3) }
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ test }) => test)
}

/** 12345 → "1.2만", 980 → "980" */
export function formatCount(count: number): string {
  if (count >= 10000) {
    const man = count / 10000
    return `${man >= 10 ? Math.floor(man) : Math.floor(man * 10) / 10}만`
  }
  return count.toLocaleString('ko-KR')
}

export function displayViewCount(test: TestDefinition): string | null {
  const views = test.viewCount ?? 0
  if (views < VIEW_COUNT_DISPLAY_MIN) return null
  return formatCount(views)
}
