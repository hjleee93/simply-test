import type { Gender, TestAnswers, TestDefinition } from '../types/test'

export type TestSession = {
  answers: TestAnswers
  gender?: Gender
}

const STORAGE_PREFIX = 'simply-test:result:'

function storageKey(testId: string) {
  return `${STORAGE_PREFIX}${testId}`
}

function writeStorage(storage: Storage, testId: string, raw: string) {
  try {
    storage.setItem(storageKey(testId), raw)
  } catch {
    // Kakao 등 일부 인앱 브라우저에서 저장소가 막힐 수 있음
  }
}

function readStorage(storage: Storage, testId: string): TestSession | null {
  try {
    const raw = storage.getItem(storageKey(testId))
    if (!raw) return null
    return JSON.parse(raw) as TestSession
  } catch {
    return null
  }
}

export function saveTestSession(testId: string, session: TestSession) {
  const raw = JSON.stringify(session)
  writeStorage(sessionStorage, testId, raw)
  writeStorage(localStorage, testId, raw)
}

export function loadTestSession(testId: string): TestSession | null {
  return readStorage(sessionStorage, testId) ?? readStorage(localStorage, testId)
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

function decodeAnswerPayload(
  answer: TestDefinition['questions'][number]['answers'][number],
): Pick<TestAnswers[number], 'score' | 'scores' | 'patternScores'> {
  if (answer.patternScores) {
    return { patternScores: answer.patternScores }
  }
  if (answer.score !== undefined) {
    return { score: answer.score }
  }
  return { scores: answer.scores ?? {} }
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
      ...decodeAnswerPayload(answer),
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

  const fromQuery = decodeSessionFromSearchParams(search, test)
  if (fromQuery?.answers) return fromQuery

  return loadTestSession(test.id)
}
