import { supabase } from './supabase'

/** 이 인원 미만이면 비율을 숨긴다. 두세 명으로 50%를 보여주는 건 허술하다. */
export const RESULT_PEER_MIN_PEOPLE = 10

export function toPeerPercent(sameCount: number, totalCount: number): number | null {
  if (!Number.isFinite(sameCount) || !Number.isFinite(totalCount)) return null
  if (totalCount < RESULT_PEER_MIN_PEOPLE || sameCount <= 0) return null
  return Math.min(100, Math.max(1, Math.round((sameCount / totalCount) * 100)))
}

/** 이 테스트를 끝낸 사람 중, 지금 결과와 같은 유형의 비율. 표본이 적거나 불러오지 못하면 null. */
export async function fetchResultPeerPercent(
  testSlug: string,
  resultId: string,
): Promise<number | null> {
  if (!supabase) return null

  const { data, error } = await supabase.rpc('result_peer_counts', {
    p_test_slug: testSlug,
    p_result_id: resultId,
  })

  if (error) {
    console.error('결과 분포를 불러오지 못했어요:', error.message)
    return null
  }

  const row = data as { same_count?: number; total_count?: number } | null
  return toPeerPercent(Number(row?.same_count ?? 0), Number(row?.total_count ?? 0))
}
