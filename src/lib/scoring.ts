import type {
  PatternId,
  ScoreCategory,
  ScoreMap,
  TestAnswers,
  TestDefinition,
  TestResult,
} from '../types/test'

const CATEGORY_LABELS: Record<ScoreCategory, string> = {
  work: '업무·출근',
  money: '보상·연봉',
  people: '사람·관계',
  growth: '성장·커리어',
  workLifeBalance: '워라밸',
}

export function calculateCategoryScores(answers: TestAnswers): Record<ScoreCategory, number> {
  const totals: Record<ScoreCategory, number> = {
    work: 0,
    money: 0,
    people: 0,
    growth: 0,
    workLifeBalance: 0,
  }

  for (const answer of Object.values(answers)) {
    for (const [category, score] of Object.entries(answer.scores ?? {}) as [
      ScoreCategory,
      number,
    ][]) {
      totals[category] += score
    }
  }

  return totals
}

export function getTopCategory(
  answers: TestAnswers,
): { category: ScoreCategory; label: string; score: number } | null {
  const totals = calculateCategoryScores(answers)
  const entries = Object.entries(totals) as [ScoreCategory, number][]

  if (entries.every(([, score]) => score === 0)) return null

  const [category, score] = entries.reduce((top, current) =>
    current[1] > top[1] ? current : top,
  )

  return { category, label: CATEGORY_LABELS[category], score }
}

export function sumScores(scores: ScoreMap): number {
  return Object.values(scores).reduce((sum, value) => sum + (value ?? 0), 0)
}

export function isSimpleScoring(test: TestDefinition): boolean {
  return test.scoringMode === 'simple'
}

export function isPatternScoring(test: TestDefinition): boolean {
  return test.scoringMode === 'pattern'
}

/** pattern 채점 테스트의 유형 집합은 test.results의 id로 정의한다 (테스트마다 다를 수 있음). */
function getPatternIds(test: TestDefinition): PatternId[] {
  return test.results.map((result) => result.id)
}

export function calculatePatternScores(
  answers: TestAnswers,
  patternIds: PatternId[],
): Record<PatternId, number> {
  const totals = Object.fromEntries(
    patternIds.map((pattern) => [pattern, 0]),
  ) as Record<PatternId, number>

  for (const answer of Object.values(answers)) {
    for (const [pattern, score] of Object.entries(answer.patternScores ?? {})) {
      if (pattern in totals) totals[pattern] += score ?? 0
    }
  }

  return totals
}

export function getTopPattern(
  totals: Record<PatternId, number>,
  patternIds: PatternId[],
): PatternId {
  return patternIds.reduce((top, pattern) =>
    totals[pattern] > totals[top] ? pattern : top,
  )
}

export function getPatternMatchPercent(
  test: TestDefinition,
  answers: TestAnswers,
): number {
  const patternIds = getPatternIds(test)
  const totals = calculatePatternScores(answers, patternIds)
  const sorted = patternIds.map((pattern) => totals[pattern]).sort((a, b) => b - a)
  const [first, second = 0] = sorted

  if (first === 0) return 0
  if (first + second === 0) return 100

  return Math.round((first / (first + second)) * 100)
}

export function getPatternResult(
  test: TestDefinition,
  answers: TestAnswers,
): TestResult {
  const patternIds = getPatternIds(test)
  const totals = calculatePatternScores(answers, patternIds)
  const topPattern = getTopPattern(totals, patternIds)

  return (
    test.results.find((result) => result.id === topPattern) ?? test.results[0]
  )
}

export function calculateRawScore(answers: TestAnswers): number {
  return Object.values(answers).reduce((total, answer) => {
    if (answer.score !== undefined) return total + answer.score
    return total + sumScores(answer.scores ?? {})
  }, 0)
}

function getRawScore(answers: TestAnswers): number {
  return calculateRawScore(answers)
}

export function calculateThresholdPercent(
  rawScore: number,
  questionCount: number,
  minScorePerAnswer = 1,
): number {
  const minScore = questionCount * minScorePerAnswer
  const maxScore = questionCount * 4

  if (maxScore === minScore) return 0

  return Math.round(((rawScore - minScore) / (maxScore - minScore)) * 100)
}

export function getResult(
  test: TestDefinition,
  answers: TestAnswers,
): TestResult {
  if (isPatternScoring(test)) {
    return getPatternResult(test, answers)
  }

  const rawScore = getRawScore(answers)
  const percent = calculateThresholdPercent(
    rawScore,
    test.questions.length,
    test.minScorePerAnswer ?? 1,
  )

  return (
    test.results.find(
      (result) => percent >= result.min && percent <= result.max,
    ) ?? test.results[0]
  )
}

export function getThresholdPercent(
  test: TestDefinition,
  answers: TestAnswers,
): number {
  if (isPatternScoring(test)) {
    return getPatternMatchPercent(test, answers)
  }

  const rawScore = getRawScore(answers)
  return calculateThresholdPercent(
    rawScore,
    test.questions.length,
    test.minScorePerAnswer ?? 1,
  )
}
