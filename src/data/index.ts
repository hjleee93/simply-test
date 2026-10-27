import { supabase } from '../lib/supabase'
import type {
  Question,
  TestCategoryId,
  TestDefinition,
  TestResult,
  TestResultTemplate,
  TestScoringMode,
} from '../types/test'

export const MAIN_PAGE_TEST_LIMIT = 10
export const RECOMMENDED_TEST_LIMIT = 3

type TestRow = {
  id: string
  title: string
  description: string
  category: string
  character: string
  scoring_mode: string
  result_template: string | null
  requires_gender: boolean
  result_label: string | null
  min_score_per_answer: number | null
  questions: Question[]
  results: TestResult[]
}

function mapRow(row: TestRow): TestDefinition {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category as TestCategoryId,
    questions: row.questions,
    results: row.results,
    scoringMode: row.scoring_mode as TestScoringMode,
    resultTemplate: (row.result_template as TestResultTemplate | null) ?? undefined,
    requiresGender: row.requires_gender,
    thumbnailCharacter: row.character,
    resultLabel: row.result_label ?? undefined,
    minScorePerAnswer: row.min_score_per_answer ?? undefined,
  }
}

let allTestsPromise: Promise<TestDefinition[]> | null = null

async function loadAllTests(): Promise<TestDefinition[]> {
  // 개발 서버는 Vite 미들웨어(`/__dev/tests`)로 미공개(publish_at 미래) 테스트까지 보여준다.
  // 운영 빌드에는 이 분기가 포함되지 않으며, 콘텐츠는 항상 Supabase가 원본이다.
  if (import.meta.env.DEV) {
    try {
      const response = await fetch('/__dev/tests')
      if (!response.ok) {
        console.error('로컬 미공개 테스트 프리뷰를 불러오지 못했어요:', response.statusText)
        return []
      }
      return ((await response.json()) as TestRow[]).map(mapRow)
    } catch (error) {
      console.error('로컬 미공개 테스트 프리뷰를 불러오지 못했어요:', error)
      return []
    }
  }

  if (!supabase) return []

  const { data, error } = await supabase
    .from('tests')
    .select('*')
    .lte('publish_at', new Date().toISOString())
    .order('publish_at', { ascending: false })

  if (error) {
    console.error('Supabase에서 테스트를 불러오지 못했어요:', error.message)
    return []
  }

  return (data as TestRow[]).map(mapRow)
}

/** 테스트 전체. 운영은 공개된 것만, 로컬 개발은 미공개 예약분까지. */
export function fetchAllTests(): Promise<TestDefinition[]> {
  if (!allTestsPromise) {
    allTestsPromise = loadAllTests().catch((error: unknown) => {
      allTestsPromise = null
      throw error
    })
  }
  return allTestsPromise
}

export async function fetchTest(id: string): Promise<TestDefinition | undefined> {
  const tests = await fetchAllTests()
  return tests.find((test) => test.id === id)
}

export async function fetchFeaturedTests(
  limit = MAIN_PAGE_TEST_LIMIT,
): Promise<TestDefinition[]> {
  const tests = await fetchAllTests()
  return tests.slice(0, limit)
}

export async function fetchRecommendedTests(
  excludeTestId: string,
  limit = RECOMMENDED_TEST_LIMIT,
): Promise<TestDefinition[]> {
  const tests = await fetchAllTests()
  return tests.filter((test) => test.id !== excludeTestId).slice(0, limit)
}
