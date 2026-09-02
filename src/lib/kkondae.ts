export type KkondaeInsight = {
  radarLevel: string
  juniorReaction: string
  tip: string
}

export function buildKkondaeInsights(percent: number): KkondaeInsight {
  if (percent <= 10) {
    return {
      radarLevel: '꼰대 레이더 꺼짐 — 후배 칼퇴에도 박수',
      juniorReaction: '"형/누나 진짜 편해요 ㅋㅋ"',
      tip: '지금 마인드 유지하세요. 회사에 꼭 필요한 선배 타입입니다.',
    }
  }
  if (percent <= 33) {
    return {
      radarLevel: '가끔 작동 — 아직은 정상 범위',
      juniorReaction: '"그냥 평범한 선배인데?"',
      tip: '"나 때는"이 머릿속에 떠오르면 한 번 멈춰보세요.',
    }
  }
  if (percent <= 57) {
    return {
      radarLevel: '은근히 작동 중 — 티는 안 나는 줄 알지만',
      juniorReaction: '"선배 요즘 표정이 좀..."',
      tip: '후배 행동이 거슬릴 때, 이유를 먼저 물어보면 꼰대력이 내려갑니다.',
    }
  }
  if (percent <= 80) {
    return {
      radarLevel: '후배 행동 감시 모드 ON',
      juniorReaction: '"선배한테 말 걸기 좀 부담스러워요"',
      tip: '경험 공유는 좋지만, 먼저 들어주는 게 더 효과적일 수 있어요.',
    }
  }
  return {
    radarLevel: '풀가동 꼰대 레이더 — "벌써 가?" 자동 재생',
    juniorReaction: '"선배... 저 먼저 갈게요 (도망)"',
    tip: '조언 전에 "요즘 어때?" 한마디면 분위기가 확 달라집니다.',
  }
}
