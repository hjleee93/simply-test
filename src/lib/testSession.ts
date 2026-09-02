import type { Gender, TestAnswers, TestDefinition } from '../types/test'

export type TestSession = {
  answers: TestAnswers
  gender?: Gender
}

const STORAGE_PREFIX = 'simply-test:result:'

function storageKey(testId: string) {
  return `${STORAGE_PREFIX}${testId}`
}

export function saveTestSession(testId: string, session: TestSession) {
  try {
    sessionStorage.setItem(storageKey(testId), JSON.stringify(session))
  } catch {
    // Kakao 등 일부 인앱 브라우저에서 sessionStorage가 막힐 수 있음
  }
}

export function loadTestSession(testId: string): TestSession | null {
  try {
    const raw = sessionStorage.getItem(storageKey(testId))
    if (!raw) return null
    return JSON.parse(raw) as TestSession
  } catch {
    return null
  }
}

/** URL 쿼리로 답변을 직렬화 (인앱 브라우저 state 유실 대비) */
export function encodeSessionToSearchParams(session: TestSession, test: TestDefinition): string {
  const params = new URLSearchParams()
  const answerChars = test.questions
    .map((question) => session.answers[question.id]?.answerId ?? '')
    .join('')

  if (answerChars.length !== test.questions.length) return ''

  params.set('a', answerChars)
  if (session.gender) {
    params.set('g', session.gender === 'male' ? 'm' : 'f')
  }

  return params.toString()
}

export function decodeSessionFromSearchParams(
  search: string,
  test: TestDefinition,
): TestSession | null {
  const params = new URLSearchParams(search)
  const answerChars = params.get('a')
  if (!answerChars || answerChars.length !== test.questions.length) return null

  const answers: TestAnswers = {}

  for (let index = 0; index < test.questions.length; index += 1) {
    const question = test.questions[index]
    const answerId = answerChars[index]
    const answer = question.answers.find((item) => item.id === answerId)
    if (!answer) return null

    answers[question.id] = {
      answerId,
      ...(answer.score !== undefined
        ? { score: answer.score }
        : { scores: answer.scores ?? {} }),
    }
  }

  const genderParam = params.get('g')
  const gender: Gender | undefined =
    genderParam === 'm' ? 'male' : genderParam === 'f' ? 'female' : undefined

  return { answers, gender }
}

export function resolveTestSession(
  test: TestDefinition,
  locationState: Partial<TestSession> | null | undefined,
  search: string,
): TestSession | null {
  if (locationState?.answers) {
    return { answers: locationState.answers, gender: locationState.gender }
  }

  const fromStorage = loadTestSession(test.id)
  if (fromStorage?.answers) return fromStorage

  return decodeSessionFromSearchParams(search, test)
}
