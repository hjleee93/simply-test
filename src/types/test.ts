export type Gender = 'male' | 'female'

export type TestScoringMode = 'category' | 'simple' | 'pattern'

export type TestResultTemplate =
  | 'category'
  | 'gender'
  | 'kkondae'
  | 'jinsang'
  | 'relationship'
  | 'company'

/** pattern 채점 모드에서 결과 유형을 식별하는 id. 테스트마다 다른 유형 집합을 쓸 수 있다. */
export type PatternId = string

export type PatternScoreMap = Partial<Record<PatternId, number>>

export type ScoreCategory =
  | 'work'
  | 'money'
  | 'people'
  | 'growth'
  | 'workLifeBalance'

export type ScoreMap = Partial<Record<ScoreCategory, number>>

export type Answer = {
  id: string
  text: string
  scores?: ScoreMap
  score?: number
  patternScores?: PatternScoreMap
}

export type Question = {
  id: number
  question: string
  answers: Answer[]
}

export type TestResult = {
  id: string
  min: number
  max: number
  title: string
  emoji: string
  description: string
  keyword: string
  /** 결과 캐릭터 이미지 경로 (public 기준). 없으면 /characters/{id}.png 시도 후 emoji 폴백 */
  characterImage?: string
  characteristics?: string[]
  warning?: string
  advice?: string
  shareText?: string
  strengths?: string[]
  blindSpots?: string[]
  situations?: string[]
  viralHint?: string
}

export type TestDefinition = {
  id: string
  title: string
  description: string
  questions: Question[]
  results: TestResult[]
  scoringMode?: TestScoringMode
  resultTemplate?: TestResultTemplate
  requiresGender?: boolean
  thumbnailCharacter?: string
  resultLabel?: string
  /** 문항당 최소 점수. 기본 1(1~4점), 꼰대 테스트처럼 0점부터면 0 */
  minScorePerAnswer?: number
}

export type SelectedAnswer = {
  answerId: string
  scores?: ScoreMap
  score?: number
  patternScores?: PatternScoreMap
}

export type TestAnswers = Record<number, SelectedAnswer>
