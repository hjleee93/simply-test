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

export async function upsertAdminTest(input: AdminTestInput) {
  if (!supabase) throw new Error('Supabase가 설정되지 않았어요.')

  const publishAt = new Date(input.publishAt)
  if (Number.isNaN(publishAt.getTime())) {
    throw new Error('공개 시각을 확인해주세요.')
  }

  const { error } = await supabase.from('tests').upsert(
    {
      id: input.id.trim(),
      title: input.title.trim(),
      description: input.description.trim(),
      category: input.category,
      character: input.thumbnailCharacter.trim() || 'adapted',
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
