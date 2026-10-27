import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PageMeta from '../../components/PageMeta'
import {
  deleteAdminTest,
  fetchAdminTest,
  upsertAdminTest,
  type AdminTestInput,
} from '../../lib/adminTests'
import { TEST_CATEGORIES } from '../../lib/testCategories'
import type {
  Question,
  TestCategoryId,
  TestResult,
  TestResultTemplate,
  TestScoringMode,
} from '../../types/test'
import { ui } from '../../lib/ui'

const RESULT_TEMPLATES: Array<TestResultTemplate | ''> = [
  '',
  'category',
  'gender',
  'kkondae',
  'jinsang',
  'relationship',
  'company',
  'halloween',
]

const SCORING_MODES: TestScoringMode[] = ['simple', 'category', 'pattern']

function emptyInput(): AdminTestInput {
  return {
    id: '',
    title: '',
    description: '',
    category: 'self',
    thumbnailCharacter: 'adapted',
    scoringMode: 'simple',
    resultTemplate: '',
    requiresGender: false,
    resultLabel: '',
    minScorePerAnswer: null,
    questions: [],
    results: [],
    publishAt: new Date().toISOString().slice(0, 16),
  }
}

function toDatetimeLocalValue(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 16)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function fieldClassName() {
  return 'mt-1 w-full rounded-md border-2 border-ink px-3 py-2 text-sm'
}

export default function AdminTestEdit() {
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'new'
  const navigate = useNavigate()
  const [input, setInput] = useState<AdminTestInput>(emptyInput)
  const [questionsJson, setQuestionsJson] = useState('[]')
  const [resultsJson, setResultsJson] = useState('[]')
  const [loading, setLoading] = useState(!isNew)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const title = useMemo(
    () => (isNew ? '새 테스트' : `편집 · ${input.title || id}`),
    [isNew, input.title, id],
  )

  useEffect(() => {
    if (isNew || !id) return
    let active = true
    fetchAdminTest(id)
      .then((row) => {
        if (!active) return
        if (!row) {
          setError('테스트를 찾지 못했어요.')
          return
        }
        setInput({
          id: row.id,
          title: row.title,
          description: row.description,
          category: row.category as TestCategoryId,
          thumbnailCharacter: row.character,
          scoringMode: row.scoring_mode as TestScoringMode,
          resultTemplate: (row.result_template as TestResultTemplate | null) ?? '',
          requiresGender: row.requires_gender,
          resultLabel: row.result_label ?? '',
          minScorePerAnswer: row.min_score_per_answer,
          questions: row.questions,
          results: row.results,
          publishAt: toDatetimeLocalValue(row.publish_at),
        })
        setQuestionsJson(JSON.stringify(row.questions, null, 2))
        setResultsJson(JSON.stringify(row.results, null, 2))
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : '불러오기 실패')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id, isNew])

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')

    try {
      const questions = JSON.parse(questionsJson) as Question[]
      const results = JSON.parse(resultsJson) as TestResult[]
      if (!Array.isArray(questions) || !Array.isArray(results)) {
        throw new Error('questions / results 는 배열이어야 해요.')
      }
      if (!input.id.trim()) throw new Error('id 가 필요해요.')

      await upsertAdminTest({
        ...input,
        questions,
        results,
        publishAt: new Date(input.publishAt).toISOString(),
      })
      setMessage('저장했어요.')
      if (isNew) navigate(`/admin/tests/${input.id.trim()}`, { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '저장 실패')
    } finally {
      setBusy(false)
    }
  }

  async function onDelete() {
    if (isNew || !input.id) return
    if (!window.confirm(`정말 삭제할까요?\n${input.id}`)) return
    setBusy(true)
    try {
      await deleteAdminTest(input.id)
      navigate('/admin', { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '삭제 실패')
      setBusy(false)
    }
  }

  function schedule(hoursFromNow: number) {
    const date = new Date(Date.now() + hoursFromNow * 60 * 60 * 1000)
    setInput((prev) => ({ ...prev, publishAt: toDatetimeLocalValue(date.toISOString()) }))
  }

  function publishNow() {
    setInput((prev) => ({ ...prev, publishAt: toDatetimeLocalValue(new Date().toISOString()) }))
  }

  if (loading) {
    return <p className="p-8 text-sm text-muted">불러오는 중...</p>
  }

  return (
    <div className="mx-auto min-h-svh max-w-[720px] px-5 py-8">
      <PageMeta title={title} noindex />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/admin" className="text-sm font-bold text-muted hover:text-ink">
            ← 목록
          </Link>
          <h1 className={`${ui.pageTitle} mt-2`}>{title}</h1>
        </div>
        {!isNew ? (
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            className="rounded-lg border-[3px] border-ink bg-white px-4 py-2 text-sm font-bold text-accent"
          >
            삭제
          </button>
        ) : null}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block text-sm font-bold text-ink">
          id (slug)
          <input
            required
            disabled={!isNew}
            value={input.id}
            onChange={(e) => setInput((prev) => ({ ...prev, id: e.target.value }))}
            className={fieldClassName()}
            placeholder="halloween-movie-villain-test"
          />
        </label>

        <label className="block text-sm font-bold text-ink">
          제목
          <input
            required
            value={input.title}
            onChange={(e) => setInput((prev) => ({ ...prev, title: e.target.value }))}
            className={fieldClassName()}
          />
        </label>

        <label className="block text-sm font-bold text-ink">
          설명
          <textarea
            required
            rows={3}
            value={input.description}
            onChange={(e) => setInput((prev) => ({ ...prev, description: e.target.value }))}
            className={fieldClassName()}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-bold text-ink">
            카테고리
            <select
              value={input.category}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, category: e.target.value as TestCategoryId }))
              }
              className={fieldClassName()}
            >
              {TEST_CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.emoji} {category.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-bold text-ink">
            썸네일 character
            <input
              value={input.thumbnailCharacter}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, thumbnailCharacter: e.target.value }))
              }
              className={fieldClassName()}
              placeholder="main-hero"
            />
          </label>

          <label className="block text-sm font-bold text-ink">
            scoringMode
            <select
              value={input.scoringMode}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  scoringMode: e.target.value as TestScoringMode,
                }))
              }
              className={fieldClassName()}
            >
              {SCORING_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-bold text-ink">
            resultTemplate
            <select
              value={input.resultTemplate ?? ''}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  resultTemplate: e.target.value as TestResultTemplate | '',
                }))
              }
              className={fieldClassName()}
            >
              {RESULT_TEMPLATES.map((template) => (
                <option key={template || 'none'} value={template}>
                  {template || '(없음)'}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-bold text-ink">
            resultLabel
            <input
              value={input.resultLabel ?? ''}
              onChange={(e) => setInput((prev) => ({ ...prev, resultLabel: e.target.value }))}
              className={fieldClassName()}
            />
          </label>

          <label className="block text-sm font-bold text-ink">
            minScorePerAnswer
            <input
              type="number"
              value={input.minScorePerAnswer ?? ''}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  minScorePerAnswer: e.target.value === '' ? null : Number(e.target.value),
                }))
              }
              className={fieldClassName()}
            />
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm font-bold text-ink">
          <input
            type="checkbox"
            checked={input.requiresGender}
            onChange={(e) => setInput((prev) => ({ ...prev, requiresGender: e.target.checked }))}
          />
          requiresGender
        </label>

        <div>
          <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
            <label className="block text-sm font-bold text-ink">publish_at</label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-md border-2 border-ink bg-lemon px-2 py-1 text-xs font-bold"
                onClick={publishNow}
              >
                지금 공개
              </button>
              <button
                type="button"
                className="rounded-md border-2 border-ink bg-white px-2 py-1 text-xs font-bold"
                onClick={() => schedule(24)}
              >
                +24시간
              </button>
              <button
                type="button"
                className="rounded-md border-2 border-ink bg-white px-2 py-1 text-xs font-bold"
                onClick={() => schedule(24 * 7)}
              >
                +7일
              </button>
            </div>
          </div>
          <input
            type="datetime-local"
            required
            value={input.publishAt}
            onChange={(e) => setInput((prev) => ({ ...prev, publishAt: e.target.value }))}
            className={fieldClassName()}
          />
        </div>

        <label className="block text-sm font-bold text-ink">
          questions (JSON)
          <textarea
            required
            rows={14}
            value={questionsJson}
            onChange={(e) => setQuestionsJson(e.target.value)}
            className={`${fieldClassName()} font-mono text-[12px]`}
          />
        </label>

        <label className="block text-sm font-bold text-ink">
          results (JSON)
          <textarea
            required
            rows={14}
            value={resultsJson}
            onChange={(e) => setResultsJson(e.target.value)}
            className={`${fieldClassName()} font-mono text-[12px]`}
          />
        </label>

        {error ? <p className="text-sm font-bold text-accent">{error}</p> : null}
        {message ? <p className="text-sm font-bold text-ink">{message}</p> : null}

        <button type="submit" className={ui.btnPrimary} disabled={busy}>
          {busy ? '저장 중...' : '저장'}
        </button>
      </form>
    </div>
  )
}
