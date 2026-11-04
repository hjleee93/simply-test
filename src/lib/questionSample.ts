import type { Question, TestDefinition } from '../types/test'

/** 문항 풀은 더 길어도, 한 판에 내는 개수. */
const PLAY_QUESTION_COUNT: Record<string, number> = {
  'meme-check-2026': 20,
}

export function getPlayQuestionCount(testId: string, questionCount: number): number {
  const sample = PLAY_QUESTION_COUNT[testId]
  if (!sample || questionCount === 0) return questionCount
  return Math.min(sample, questionCount)
}

/** 풀에서 한 판 분량만 뽑는다. 뽑힌 문항은 원래 순서를 유지한다. */
export function pickPlayQuestions(test: Pick<TestDefinition, 'id' | 'questions'>): Question[] {
  const count = getPlayQuestionCount(test.id, test.questions.length)
  if (count >= test.questions.length) return test.questions

  const pool = [...test.questions]
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const current = pool[index]
    pool[index] = pool[swapIndex]
    pool[swapIndex] = current
  }

  return pool.slice(0, count).sort((a, b) => a.id - b.id)
}
