import { rankByViewCount } from '../lib/rankByViews'
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
export const RECOMMENDED_TEST_LIMIT = 4

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
  publish_at?: string | null
  og_image?: string | null
  og_image_width?: number | null
  og_image_height?: number | null
  questions: Question[]
  results: TestResult[]
}

type InlineTestData = {
  id: string
  title: string
  description: string
  category: string
  character: string
  resultTemplate: string | null
  viewCount?: number
  publishAt?: string | null
}

type FullInlineTestData = {
  id: string
  title: string
  description: string
  category: string
  character: string
  scoringMode: string
  resultTemplate: string | null
  requiresGender: boolean
  resultLabel: string | null
  minScorePerAnswer: number | null
  ogImage?: string | null
  ogImageWidth?: number | null
  ogImageHeight?: number | null
  questions: Question[]
  results: TestResult[]
}

declare global {
  interface Window {
    __TESTS__?: InlineTestData[]
    __TEST__?: FullInlineTestData
  }
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
    ogImage: row.og_image ?? undefined,
    ogImageWidth: row.og_image_width ?? undefined,
    ogImageHeight: row.og_image_height ?? undefined,
    resultLabel: row.result_label ?? undefined,
    minScorePerAnswer: row.min_score_per_answer ?? undefined,
    publishAt: row.publish_at ?? undefined,
  }
}

function mapInlineTest(data: InlineTestData): TestDefinition {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category as TestCategoryId,
    questions: [],
    results: [],
    resultTemplate: (data.resultTemplate as TestResultTemplate | null) ?? undefined,
    thumbnailCharacter: data.character,
    publishAt: data.publishAt ?? undefined,
    viewCount: data.viewCount,
  }
}

function getPreloadedTests(): TestDefinition[] {
  const inlineData = typeof window !== 'undefined' ? window.__TESTS__ : undefined
  if (!inlineData || !Array.isArray(inlineData)) return []
  return inlineData.map(mapInlineTest)
}

function mapFullInlineTest(data: FullInlineTestData): TestDefinition {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category as TestCategoryId,
    questions: data.questions,
    results: data.results,
    scoringMode: data.scoringMode as TestScoringMode,
    resultTemplate: (data.resultTemplate as TestResultTemplate | null) ?? undefined,
    requiresGender: data.requiresGender,
    thumbnailCharacter: data.character,
    ogImage: data.ogImage ?? undefined,
    ogImageWidth: data.ogImageWidth ?? undefined,
    ogImageHeight: data.ogImageHeight ?? undefined,
    resultLabel: data.resultLabel ?? undefined,
    minScorePerAnswer: data.minScorePerAnswer ?? undefined,
  }
}

export function getPreloadedTest(id: string): TestDefinition | undefined {
  if (typeof window === 'undefined') return undefined
  
  const fullTest = window.__TEST__
  if (fullTest && fullTest.id === id) {
    return mapFullInlineTest(fullTest)
  }
  
  return undefined
}

export function getPreloadedFeaturedTests(limit = MAIN_PAGE_TEST_LIMIT): TestDefinition[] {
  const tests = getPreloadedTests()
  const inline = typeof window !== 'undefined' ? window.__TESTS__ : undefined
  if (!inline?.some((item) => typeof item.viewCount === 'number')) {
    return tests.slice(0, limit)
  }
  const counts = new Map(inline.map((item) => [item.id, item.viewCount ?? 0]))
  return rankByViewCount(tests, counts).slice(0, limit)
}

export function getPreloadedRecommendedTests(
  excludeTestId: string,
  limit = RECOMMENDED_TEST_LIMIT,
): TestDefinition[] {
  return getPreloadedTests()
    .filter((t) => t.id !== excludeTestId)
    .slice(0, limit)
}

let allTestsPromise: Promise<TestDefinition[]> | null = null

async function loadAllTests(): Promise<TestDefinition[]> {
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

  if (!supabase) return getPreloadedTests()

  const { data, error } = await supabase
    .from('tests')
    .select('*')
    .lte('publish_at', new Date().toISOString())
    .order('publish_at', { ascending: false })

  if (error) {
    console.error('Supabase에서 테스트를 불러오지 못했어요:', error.message)
    return getPreloadedTests()
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

let viewCountsPromise: Promise<Map<string, number> | null> | null = null

/** 테스트별 누적 조회수. 한 세션에서 한 번만 불러온다. */
export function fetchViewCounts(): Promise<Map<string, number> | null> {
  if (!viewCountsPromise) {
    viewCountsPromise = loadViewCounts().catch(() => {
      viewCountsPromise = null
      return null
    })
  }
  return viewCountsPromise
}

async function loadViewCounts(): Promise<Map<string, number> | null> {
  if (!supabase) return null

  const { data, error } = await supabase.from('test_view_counts').select('test_slug, count')
  if (error) {
    console.error('조회수를 불러오지 못했어요:', error.message)
    return null
  }

  const counts = new Map<string, number>()
  for (const row of data ?? []) {
    if (typeof row.test_slug === 'string' && typeof row.count === 'number') {
      counts.set(row.test_slug, row.count)
    }
  }
  return counts
}

export async function fetchFeaturedTests(
  limit = MAIN_PAGE_TEST_LIMIT,
): Promise<TestDefinition[]> {
  const [tests, counts] = await Promise.all([fetchAllTests(), fetchViewCounts()])
  if (!counts) return tests.slice(0, limit)
  return rankByViewCount(tests, counts).slice(0, limit)
}

export async function fetchRecommendedTests(
  excludeTestId: string,
  limit = RECOMMENDED_TEST_LIMIT,
): Promise<TestDefinition[]> {
  const tests = await fetchAllTests()
  return tests.filter((test) => test.id !== excludeTestId).slice(0, limit)
}

function withViewCounts(
  tests: readonly TestDefinition[],
  counts: ReadonlyMap<string, number> | null,
): TestDefinition[] {
  if (!counts) return [...tests]
  return tests.map((test) => ({ ...test, viewCount: counts.get(test.id) ?? test.viewCount ?? 0 }))
}

/** 홈용: 전체 테스트(최신 공개순) + 조회수. 섹션 구성은 화면에서 한다. */
export async function fetchHomeTests(): Promise<TestDefinition[]> {
  const [tests, counts] = await Promise.all([fetchAllTests(), fetchViewCounts()])
  return withViewCounts(tests, counts)
}

/** 빌드 시 HTML에 심어둔 목록(조회수 포함). 첫 화면을 네트워크 없이 그린다. */
export function getPreloadedHomeTests(): TestDefinition[] {
  return getPreloadedTests()
}
