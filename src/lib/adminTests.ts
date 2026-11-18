import { supabase } from './supabase'
import type {
  Question,
  TestCategoryId,
  TestDefinition,
  TestResult,
  TestResultTemplate,
  TestScoringMode,
} from '../types/test'

export type AdminTestRow = {
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
  og_image: string | null
  og_image_width: number | null
  og_image_height: number | null
  questions: Question[]
  results: TestResult[]
  publish_at: string
  created_at?: string
}

export type AdminTestInput = {
  id: string
  title: string
  description: string
  category: TestCategoryId
  thumbnailCharacter: string
  ogImage: string
  ogImageWidth: number | null
  ogImageHeight: number | null
  scoringMode: TestScoringMode
  resultTemplate?: TestResultTemplate | ''
  requiresGender: boolean
  resultLabel?: string
  minScorePerAnswer?: number | null
  questions: Question[]
  results: TestResult[]
  publishAt: string
}

export function mapAdminRow(row: AdminTestRow): TestDefinition & { publishAt: string } {
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
    publishAt: row.publish_at,
  }
}

export async function fetchAdminTests(): Promise<AdminTestRow[]> {
  if (!supabase) throw new Error('Supabase가 설정되지 않았어요.')

  const { data, error } = await supabase
    .from('tests')
    .select('*')
    .order('publish_at', { ascending: false })

  if (error) throw error
  return (data as AdminTestRow[]) ?? []
}

export async function fetchAdminTest(id: string): Promise<AdminTestRow | null> {
  if (!supabase) throw new Error('Supabase가 설정되지 않았어요.')

  const { data, error } = await supabase.from('tests').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data as AdminTestRow | null
}

function hasUnsafeOgChar(value: string): boolean {
  if (/\s/.test(value) || value.includes('"') || value.includes('<') || value.includes('>')) {
    return true
  }
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i)
    if (code < 32 || code === 127) return true
  }
  return false
}

export function normalizeOgImage(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  if (hasUnsafeOgChar(trimmed)) {
    throw new Error('OG 이미지 주소에 공백이나 따옴표를 넣을 수 없어요.')
  }
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed
  throw new Error('OG 이미지는 https URL 또는 /로 시작하는 경로여야 해요.')
}

export function normalizeOgSize(
  width: number | null | undefined,
  height: number | null | undefined,
): { width: number | null; height: number | null } {
  if (width == null && height == null) return { width: null, height: null }
  if (
    typeof width !== 'number' ||
    typeof height !== 'number' ||
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width <= 0 ||
    height <= 0
  ) {
    throw new Error('OG 이미지 가로는 세로와 함께, 1 이상의 정수로 입력해주세요.')
  }
  return { width, height }
}

export async function upsertAdminTest(input: AdminTestInput) {
  if (!supabase) throw new Error('Supabase가 설정되지 않았어요.')

  const publishAt = new Date(input.publishAt)
  if (Number.isNaN(publishAt.getTime())) {
    throw new Error('공개 시각을 확인해주세요.')
  }

  const ogImage = normalizeOgImage(input.ogImage)
  const ogSize = normalizeOgSize(input.ogImageWidth, input.ogImageHeight)

  const { error } = await supabase.from('tests').upsert(
    {
      id: input.id.trim(),
      title: input.title.trim(),
      description: input.description.trim(),
      category: input.category,
      character: input.thumbnailCharacter.trim() || 'adapted',
      og_image: ogImage,
      og_image_width: ogSize.width,
      og_image_height: ogSize.height,
      scoring_mode: input.scoringMode,
      result_template: input.resultTemplate || null,
      requires_gender: input.requiresGender,
      result_label: input.resultLabel?.trim() || null,
      min_score_per_answer: input.minScorePerAnswer ?? null,
      questions: input.questions,
      results: input.results,
      publish_at: publishAt.toISOString(),
    },
    { onConflict: 'id' },
  )

  if (error) throw error
}

export async function deleteAdminTest(id: string) {
  if (!supabase) throw new Error('Supabase가 설정되지 않았어요.')
  const { error } = await supabase.from('tests').delete().eq('id', id)
  if (error) throw error
}

export function isPublished(publishAt: string, now = new Date()): boolean {
  return new Date(publishAt).getTime() <= now.getTime()
}
