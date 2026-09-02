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
  scores: ScoreMap
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
}

export type TestDefinition = {
  id: string
  title: string
  description: string
  questions: Question[]
  results: TestResult[]
}

export type SelectedAnswer = {
  answerId: string
  scores: ScoreMap
}

export type TestAnswers = Record<number, SelectedAnswer>
