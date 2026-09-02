import type { Gender, TestResult } from '../types/test'

export function getGenderLabel(gender: Gender): string {
  return gender === 'female' ? '남미새' : '여미새'
}

export function formatGenderResultTitle(title: string, gender: Gender): string {
  const label = getGenderLabel(gender)
  return title.replace('남미새/여미새', label)
}

export function applyGenderToResult(result: TestResult, gender: Gender): TestResult {
  return {
    ...result,
    title: formatGenderResultTitle(result.title, gender),
  }
}

export type GenderInsight = {
  radarLevel: string
  friendReaction: string
  tip: string
}

export function buildGenderInsights(percent: number): GenderInsight {
  if (percent <= 10) {
    return {
      radarLevel: '레이더 꺼짐 — 이성보다 취미가 먼저',
      friendReaction: '"너 연애 안 해도 행복해 보여"',
      tip: '지금 페이스도 나쁘지 않아요. 다만 가끔은 새로운 만남에도 열어두면 좋아요.',
    }
  }
  if (percent <= 30) {
    return {
      radarLevel: '가끔 켜지는 레이더 — 정상 범위',
      friendReaction: '"너? 그냥 평범한데?"',
      tip: '관심은 있지만 삶의 중심은 아닌 건강한 밸런스예요.',
    }
  }
  if (percent <= 50) {
    return {
      radarLevel: '은근히 작동 중 — 티는 안 나는 줄 알지만',
      friendReaction: '"너 요즘 눈이 좀 반짝이는데?"',
      tip: '기회가 오면 놓치지 않는 타입. 주변에서 이미 눈치챘을 수도 있어요.',
    }
  }
  if (percent <= 70) {
    return {
      radarLevel: '이성 등장 시 집중력 UP',
      friendReaction: '"아 맞다 너 그런 스타일이지 ㅋㅋ"',
      tip: '이성이 있는 자리를 더 선호하는 편. 친구들이 이미 알고 있을 확률 높음.',
    }
  }
  return {
    radarLevel: '풀가동 레이더 — 이성이 곧 콘텐츠',
    friendReaction: '"야 너 또 시작이야?"',
    tip: '솔직히 주변에서도 알고 있을 타입. 가끔은 다른 얘기도보면 어때요?',
  }
}
